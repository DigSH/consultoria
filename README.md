# consultoria

Web piloto de la consultoría de Diego Sanabria (estadística y datos para el agro y la academia).
Sitio estático: HTML + CSS + JS sin dependencias, sin cookies ni rastreadores.

## Archivos

| Archivo | Qué es |
|---|---|
| `index.html` | Estructura de la página |
| `styles.css` | Diseño (azul tinta, cian, coral) |
| `app.js` | Relieve del hero, buscador, gráficas SVG, formulario |
| `gis.js` | Laboratorio GIS: mapa de estaciones del IDEAM (datos en vivo) y validador de polígonos de predio |
| `vendor/leaflet/` | Leaflet 1.9.4 (BSD-2) incluido en el repo, sin CDN |
| `datos.js` | **Todo el contenido que cambia**: servicios, cifras, publicaciones, trayectoria, testimonios, contacto |
| `docs/TESTIMONIOS.md` | Cómo pedir y publicar testimonios reales |

## Ver la página

Abrir `index.html` en el navegador, o servirla: `py -m http.server 8765` y abrir http://127.0.0.1:8765.
Con `?demo=1` al final de la dirección se ven tarjetas de testimonio de ejemplo (solo para ver el diseño).

## Reglas de contenido

- Todo lo que dice la página sale de `C:\proyectos\Laboral\job-hunter-cgiar\data\perfil.json`
  (hechos verificados). Un hecho nuevo se cambia en `perfil.json` y en `datos.js`.
- Las **publicaciones** de `datos.js` tienen DOI comprobado en Crossref el 16/11/2026.
  Quedó fuera *Cultura* (2024): solo se encontró un preprint en Zenodo, no el artículo de revista.
  Se sumará cuando haya enlace a la revista.
- **No se publican precios.** Los del plan de ingresos (13/11/2026) eran supuestos.
- La gráfica «Así te entrego un resultado» usa **datos simulados** y lo dice en la página.
- **Testimonios**: solo con `autorizado: true` y permiso por escrito. Nunca se inventan.

## Laboratorio GIS

- **Estaciones IDEAM**: lee en vivo el conjunto `hp9r-jxuu` de datos.gov.co (CC BY-SA 4.0), solo las activas de Boyacá.
  Comprobado el 16/11/2026: 988 activas (331 automáticas, 657 convencionales), igual que la consulta directa a la API.
- **Validador de predios**: corre todo en el navegador, no envía datos. Revisa cierre, autocruces, coordenadas
  invertidas o fuera de Colombia, decimales (≥ 6), sentido del anillo (RFC 7946) y el umbral de 4 ha.
  El área es esférica (±0,5 %); no sustituye el cribado satelital ni la debida diligencia completa.
- Las competencias GIS de `datos.js` (`gis`) salen de `perfil.json`. GDAL y rasterio **no** figuran: aún no hay evidencia pública.
- Pendiente: casos GIS con cliente (mapa o captura) cuando haya autorización, y el repositorio EUDR verificado.

## Publicar

Publicada con GitHub Pages (rama `main`, raíz): https://digsh.github.io/consultoria/ . Cada `git push` la actualiza en ~1 minuto.

## Pendientes

1. Confirmar el nombre comercial (hoy «Consultoría Sanabria», provisional).
   La paleta (cian, coral y azul tinta) se cambia en las variables del inicio de `styles.css`.
2. Conseguir 2 o 3 testimonios reales (ver `docs/TESTIMONIOS.md`) y pasarlos a `datos.js`.
3. Enlace del repositorio EUDR y de un caso de tablero público, para sumarlos como prueba cuando estén verificados.
4. Dominio propio (opcional) y correo de la consultoría distinto del personal.
