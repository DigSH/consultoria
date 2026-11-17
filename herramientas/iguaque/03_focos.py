# -*- coding: utf-8 -*-
"""Agrupa la pérdida anual en celdas de ~1 km (focos) para que la animación se lea con el mapa alejado,
y escribe los archivos finales del sitio: datos/iguaque-datos.js y datos/iguaque-perdida.png."""
import sys, os, io, json, math, shutil
sys.path.insert(0, "D:/cache/pylibs_geo")
import numpy as np
from rasterio.transform import from_origin
from rasterio.features import geometry_mask
from shapely.geometry import shape, mapping
from shapely.ops import unary_union
from shapely import affinity
AQUI = os.path.dirname(os.path.abspath(__file__))
SITIO = "C:/proyectos/consultoria/datos"
D = json.load(io.open(os.path.join(AQUI, "iguaque-datos.json"), encoding="utf-8"))
ly = np.load(os.path.join(AQUI, "lossyear.npy")); tc = np.load(os.path.join(AQUI, "treecover2000.npy"))
H, W = ly.shape; w, s, e, n = D["marco"]; res = (e - w) / W
tr = from_origin(w, n, res, res)
gj = json.load(io.open(os.path.join(AQUI, "paramo_oficial.geojson"), encoding="utf-8"))
paramo = unary_union([shape(f["geometry"]).buffer(0) for f in gj["features"]])
latm = (s + n) / 2; gx = 2000 / (111320 * math.cos(math.radians(latm))); gy = 2000 / 110574
zona = affinity.scale(affinity.scale(paramo, xfact=1, yfact=gx / gy, origin=(0, 0)).buffer(gx), xfact=1, yfact=gy / gx, origin=(0, 0))
dentro = geometry_mask([mapping(paramo)], out_shape=(H, W), transform=tr, invert=True)
enzona = geometry_mask([mapping(zona)], out_shape=(H, W), transform=tr, invert=True)
lats = n - (np.arange(H) + 0.5) * res
phi = np.radians(lats); a, b = 6378137.0, 6356752.314245; e2 = 1 - (b * b) / (a * a)
pix_ha = ((math.pi / 180) * a * (1 - e2) / (1 - e2 * np.sin(phi) ** 2) ** 1.5 * res) * ((math.pi / 180) * a * np.cos(phi) / np.sqrt(1 - e2 * np.sin(phi) ** 2) * res) / 10000
CEL = 40  # píxeles por celda (40 x 0,00025° = 0,01° ≈ 1,1 km)
sel = (tc >= D["umbral_dosel"]) & (ly > 0) & enzona
ys, xs = np.nonzero(sel)
focos = {}
for y, x in zip(ys, xs):
    k = (int(ly[y, x]), y // CEL, x // CEL)
    f = focos.setdefault(k, [0.0, 0.0, 0.0, 0.0])
    h = pix_ha[y]; f[0] += h; f[1] += x * h; f[2] += y * h; f[3] += h if dentro[y, x] else 0.0
lista = []
for (anio, cy, cx), (ha, sx, sy, had) in sorted(focos.items()):
    if ha < 0.25: continue   # menos de ~3 píxeles: no se resalta (sí queda en la imagen)
    lista.append([round(w + (sx / ha + 0.5) * res, 5), round(n - (sy / ha + 0.5) * res, 5), anio, round(ha, 2), 1 if had >= ha / 2 else 0])
D["focos"] = lista
D["focos_nota"] = "celdas de 0,01 grados con al menos 0,25 ha de pérdida en el año, dentro del páramo o de su franja de 2 km"
tot = sum(D["paramo"]["por_anio"]) + sum(D["franja"]["por_anio"]); enf = sum(f[3] for f in lista)
print("focos:", len(lista), "| ha en focos:", round(enf, 1), "de", round(tot, 1), "ha en paramo+franja")
print("conteo de pixeles por anio (para contrastar con el navegador):", {int(y): int(((tc >= 30) & (ly == y)).sum()) for y in (12, 19, 25)}, "| bosque en pie:", int(((tc >= 30) & (ly == 0)).sum()))
os.makedirs(SITIO, exist_ok=True)
with io.open(os.path.join(SITIO, "iguaque-datos.js"), "w", encoding="utf-8", newline="") as fh:
    fh.write("/* Generado por un script: pérdida anual de cobertura arbórea (Hansen/UMD %s) en el Complejo de Páramos\n   Iguaque - Merchán (límite oficial de Minambiente, Resolución 1555 de 2016). No editar a mano. */\nwindow.IGUAQUE = " % D["version"])
    json.dump(D, fh, ensure_ascii=False, separators=(",", ":")); fh.write(";\n")
shutil.copyfile(os.path.join(AQUI, "iguaque-perdida.png"), os.path.join(SITIO, "iguaque-perdida.png"))
print("js", os.path.getsize(os.path.join(SITIO, "iguaque-datos.js")), "png", os.path.getsize(os.path.join(SITIO, "iguaque-perdida.png")))
