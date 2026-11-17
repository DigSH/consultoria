# -*- coding: utf-8 -*-
"""Reescribe la imagen del sitio dejando solo el páramo y su franja de 2 km (el resto del marco queda transparente)."""
import sys, os, io, json, math
sys.path.insert(0, "D:/cache/pylibs_geo")
import numpy as np
from PIL import Image
from rasterio.transform import from_origin
from rasterio.features import geometry_mask
from shapely.geometry import shape, mapping
from shapely.ops import unary_union
from shapely import affinity
AQUI = os.path.dirname(os.path.abspath(__file__))
D = json.load(io.open(os.path.join(AQUI, "iguaque-datos.json"), encoding="utf-8"))
ly = np.load(os.path.join(AQUI, "lossyear.npy")); tc = np.load(os.path.join(AQUI, "treecover2000.npy"))
H, W = ly.shape; w, s, e, n = D["marco"]; res = (e - w) / W
tr = from_origin(w, n, res, res)
gj = json.load(io.open(os.path.join(AQUI, "paramo_oficial.geojson"), encoding="utf-8"))
paramo = unary_union([shape(f["geometry"]).buffer(0) for f in gj["features"]])
latm = (s + n) / 2; gx = 2000 / (111320 * math.cos(math.radians(latm))); gy = 2000 / 110574
zona = affinity.scale(affinity.scale(paramo, xfact=1, yfact=gx / gy, origin=(0, 0)).buffer(gx), xfact=1, yfact=gy / gx, origin=(0, 0))
enzona = geometry_mask([mapping(zona)], out_shape=(H, W), transform=tr, invert=True)
bosque = (tc >= D["umbral_dosel"]) & enzona
img = np.zeros((H, W), np.uint8); img[bosque] = 200; sel = bosque & (ly > 0); img[sel] = ly[sel]
destino = "C:/proyectos/consultoria/datos/iguaque-perdida.png"
Image.fromarray(img, "L").save(destino, optimize=True)
print("png", os.path.getsize(destino), "| pixeles:", {int(y): int((img == y).sum()) for y in (12, 19, 25, 200)})
