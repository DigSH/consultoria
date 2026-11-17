# -*- coding: utf-8 -*-
"""Pérdida anual de cobertura arbórea (Hansen/UMD GFC v1.13, 2001-2025) en el
Complejo de Páramos Iguaque - Merchán (límite oficial Minambiente, Res. 1555 de 2016).
Lee por ventana (sin bajar la tesela completa), calcula hectáreas por año y exporta
una imagen codificada para la animación web."""
import sys, os, io, json, math
sys.path.insert(0, "D:/cache/pylibs_geo")
import numpy as np, rasterio
from rasterio.windows import from_bounds
from rasterio.features import geometry_mask
from shapely.geometry import shape, mapping
from shapely.ops import unary_union
from PIL import Image

AQUI = os.path.dirname(os.path.abspath(__file__))
VER = "GFC-2025-v1.13"
URL = "/vsicurl/https://storage.googleapis.com/earthenginepartners-hansen/%s/Hansen_%s_%%s_10N_080W.tif" % (VER, VER)
UMBRAL = 30          # % de dosel en 2000 para contar como bosque (convención de Global Forest Watch)
MARGEN = 0.03        # grados alrededor del complejo
ANILLO_M = 2000      # franja exterior de presión

gj = json.load(io.open(os.path.join(AQUI, "paramo_oficial.geojson"), encoding="utf-8"))
polis = [shape(f["geometry"]).buffer(0) for f in gj["features"]]
paramo = unary_union(polis)
ha_oficial = sum(f["properties"]["area_ha"] for f in gj["features"])
w, s, e, n = paramo.bounds
w, s, e, n = w - MARGEN, s - MARGEN, e + MARGEN, n + MARGEN
latm = (s + n) / 2
# franja exterior de 2 km (aproximación en grados, corrigiendo la longitud por la latitud media)
gx = ANILLO_M / (111320 * math.cos(math.radians(latm))); gy = ANILLO_M / 110574
from shapely import affinity
esc = affinity.scale(paramo, xfact=1, yfact=gx / gy, origin=(0, 0))
anillo = affinity.scale(esc.buffer(gx), xfact=1, yfact=gy / gx, origin=(0, 0)).difference(paramo)

env = dict(GDAL_DISABLE_READDIR_ON_OPEN="EMPTY_DIR", CPL_VSIL_CURL_ALLOWED_EXTENSIONS=".tif", GDAL_HTTP_MAX_RETRY="4", GDAL_HTTP_RETRY_DELAY="2")
with rasterio.Env(**env):
    with rasterio.open(URL % "lossyear") as ds:
        win = from_bounds(w, s, e, n, ds.transform).round_offsets().round_lengths()
        ly = ds.read(1, window=win); tr = ds.window_transform(win)
        print("lossyear", ds.width, ds.height, ds.res, "bloques", ds.block_shapes[0], "ventana", ly.shape)
    with rasterio.open(URL % "treecover2000") as ds:
        tc = ds.read(1, window=win)
H, W = ly.shape
np.save(os.path.join(AQUI, "lossyear.npy"), ly); np.save(os.path.join(AQUI, "treecover2000.npy"), tc)

# área de cada píxel (ha) según su latitud (elipsoide WGS84, fórmula de longitud de arco)
lats = tr.f + (np.arange(H) + 0.5) * tr.e
phi = np.radians(lats); a, b = 6378137.0, 6356752.314245; e2 = 1 - (b * b) / (a * a)
m_lat = (math.pi / 180) * a * (1 - e2) / (1 - e2 * np.sin(phi) ** 2) ** 1.5
m_lon = (math.pi / 180) * a * np.cos(phi) / np.sqrt(1 - e2 * np.sin(phi) ** 2)
pix_ha = (m_lat * abs(tr.e)) * (m_lon * tr.a) / 10000.0
area = np.repeat(pix_ha[:, None], W, axis=1)

dentro = geometry_mask([mapping(paramo)], out_shape=(H, W), transform=tr, invert=True)
franja = geometry_mask([mapping(anillo)], out_shape=(H, W), transform=tr, invert=True)
bosque = tc >= UMBRAL
ultimo = int(ly.max())
def resumen(mask, nombre):
    r = {"zona": nombre, "area_ha": round(float(area[mask].sum()), 1), "bosque2000_ha": round(float(area[mask & bosque].sum()), 1), "por_anio": []}
    for y in range(1, ultimo + 1):
        r["por_anio"].append(round(float(area[mask & bosque & (ly == y)].sum()), 2))
    r["perdida_total_ha"] = round(sum(r["por_anio"]), 1)
    r["perdida_pct_bosque2000"] = round(100 * r["perdida_total_ha"] / r["bosque2000_ha"], 2) if r["bosque2000_ha"] else None
    r["hasta_2020_ha"] = round(sum(r["por_anio"][:20]), 1); r["desde_2021_ha"] = round(sum(r["por_anio"][20:]), 1)
    r["perdida_sin_umbral_ha"] = round(float(area[mask & (ly > 0)].sum()), 1)
    return r
R1, R2 = resumen(dentro, "paramo"), resumen(franja, "franja_2km")
print("area oficial (ha):", round(ha_oficial, 1), "| area rasterizada (ha):", R1["area_ha"], "| ultimo anio: 20%02d" % ultimo)
for R in (R1, R2): print(json.dumps(R, ensure_ascii=False))

# imagen codificada: 0 = sin bosque en 2000; 200 = bosque 2000 que sigue en pie; 1..25 = año de pérdida (20xx)
img = np.zeros((H, W), np.uint8); img[bosque] = 200; sel = bosque & (ly > 0); img[sel] = ly[sel]
Image.fromarray(img, "L").save(os.path.join(AQUI, "iguaque-perdida.png"), optimize=True)
lim = unary_union([p.simplify(0.00012, preserve_topology=True) for p in polis])
geo = {"type": "Feature", "properties": {}, "geometry": json.loads(json.dumps(mapping(lim), default=float))}
def red(c):
    return [round(c[0], 5), round(c[1], 5)] if isinstance(c[0], (int, float)) else [red(x) for x in c]
geo["geometry"]["coordinates"] = red(geo["geometry"]["coordinates"])
salida = {"version": VER, "umbral_dosel": UMBRAL, "primer_anio": 2001, "ultimo_anio": 2000 + ultimo,
          "marco": [round(tr.c, 6), round(tr.f + H * tr.e, 6), round(tr.c + W * tr.a, 6), round(tr.f, 6)], "ancho": W, "alto": H,
          "area_oficial_ha": round(ha_oficial, 1), "paramo": R1, "franja": R2, "limite": geo}
with io.open(os.path.join(AQUI, "iguaque-datos.json"), "w", encoding="utf-8") as fh: json.dump(salida, fh, ensure_ascii=False, separators=(",", ":"))
print("png", os.path.getsize(os.path.join(AQUI, "iguaque-perdida.png")), "json", os.path.getsize(os.path.join(AQUI, "iguaque-datos.json")), "marco", salida["marco"], W, H)
