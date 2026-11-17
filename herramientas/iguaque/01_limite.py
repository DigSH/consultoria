# -*- coding: utf-8 -*-
"""Descarga el límite oficial del Complejo de Páramos Iguaque - Merchán
(Minambiente, capa «Páramos Delimitados» de Datos Abiertos MADS)."""
import json, sys, io, os, requests
from urllib.parse import quote
AQUI = os.path.dirname(os.path.abspath(__file__))
BASE = "https://services6.arcgis.com/hxAwRYAu9QHliJ8T/arcgis/rest/services/" + quote("Páramos_Delimitados") + "/FeatureServer"
s = requests.Session(); s.headers["User-Agent"] = "consulta-geo/1.0"
info = s.get(BASE, params={"f": "json"}, timeout=60).json()
print("servicio:", info.get("serviceDescription", "")[:200], "| capas:", [(l["id"], l["name"]) for l in info.get("layers", [])])
print("copyright:", info.get("copyrightText"))
capa = info["layers"][0]["id"]
meta = s.get(f"{BASE}/{capa}", params={"f": "json"}, timeout=60).json()
campos = [f["name"] for f in meta["fields"]]
print("campos:", campos)
print("descripcion capa:", (meta.get("description") or "")[:400], "| copyright:", meta.get("copyrightText"))
print("edicion:", meta.get("editingInfo"))
texto = [f["name"] for f in meta["fields"] if f["type"] == "esriFieldTypeString"]
donde = " OR ".join(f"UPPER({c}) LIKE '%IGUAQUE%'" for c in texto)
r = s.get(f"{BASE}/{capa}/query", params={"where": donde, "outFields": "*", "outSR": 4326, "f": "geojson", "geometryPrecision": 6}, timeout=120)
gj = r.json()
print("entidades:", len(gj.get("features", [])))
for f in gj["features"]:
    print({k: v for k, v in f["properties"].items() if v not in (None, "")})
    g = f["geometry"]; print("tipo:", g["type"], "partes:", len(g["coordinates"]))
with io.open(os.path.join(AQUI, "paramo_oficial.geojson"), "w", encoding="utf-8") as fh: json.dump(gj, fh)
