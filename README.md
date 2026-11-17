# consultoria

Web piloto de la consultoría (Diego Sanabria, Zahira Rodríguez, Stiven Santana y Faiver Salcedo): consultoría académica y empresarial, estadística, datos y proyectos para el agro y la academia.
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
- La gráfica «Así te entregamos un resultado» usa **datos simulados** y lo dice en la página.
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

## Embudo (fase 1) y equipo

- El inicio tiene dos entradas (investigador o estudiante / empresa, asociación o entidad) que alimentan un embudo de 4 pasos: quién eres, qué necesitas, qué tienes, para cuándo. Todo corre en el navegador; el resultado abre WhatsApp o rellena el formulario. No se guarda nada.
- Fase 2 (pendiente): chat con LLM. La clave de la API **no puede ir en esta página estática**; necesita un intermediario (p. ej. Cloudflare Workers), catálogo cerrado de servicios, aviso de tratamiento de datos (Ley 1581 de 2012) y traspaso final a una persona.
- `equipo/` (hojas de vida con teléfono y correo) está en `.gitignore`: **nunca se sube** a este repositorio público.
- Equipo en `datos.js`: el enfoque en papa y arándano está como «enfoque», no «experto», hasta tener evidencia. La maestría de Zahira no figura en su hoja de vida: se añade cuando ella la confirme.

## Auditoría del 16/11/2026

Implementada tras comprobar cada punto contra el código y los documentos: validador GIS (ejemplo y ceros finales, polígonos de área cero, JSON no numérico, texto del recuadro de Colombia), contraste del aviso, menú móvil, 4 integrantes a la vista, pasos opcionales desmarcables, respaldo de correo, impresión a PDF (contadores y gráficas en su estado final), detalle visible en las tarjetas de dron e IA, hechos del CV de Diego y de la hoja de vida de Zahira, autoría del equipo en cada artículo (comprobada en Crossref), imagen y metadatos para compartir.
Se **descartó** cambiar el DOI de Yachana: el registrado (con prefijo repetido) resuelve (HTTP 200) y el «corregido» da 404.
No se publican números de contrato ni nombres de clientes. La maestría de Zahira no se incluye mientras no figure en su hoja de vida.
`AUDITORIA_WEB.md` y `equipo/` están en `.gitignore`.

## Líneas de servicio, responsables y servicios en preparación

- `datos.js` define 4 líneas (`lineasServicio`) y 8 servicios, todos con respaldo verificado (desde la simplificación del 16/11/2026 no se publican servicios «en preparación»).
- Un servicio en preparación **no lleva respaldo** (la web lo dice). Pasa a activo cuando el equipo aporte soportes: añadir `para`, `entrega` y `respaldo` y quitar `estado`.
- `responsables` sale de lo dicho por el equipo (no son credenciales verificadas). «Piloto certificado», «experto» y similares se publican solo con soporte (certificado, número, proyecto).
- Tres perfiles en el embudo: investigador, empresa y productor. Cada servicio debe ser alcanzable desde alguna situación.
- MIPE = manejo integrado de plagas y enfermedades; MIRFE = manejo integrado de riego y fertilización (confirmado por el equipo).

## Pendientes

1. Confirmar el nombre comercial (hoy «Consultoría Sanabria», provisional).
   La paleta (cian, coral y azul tinta) se cambia en las variables del inicio de `styles.css`.
2. Conseguir 2 o 3 testimonios reales (ver `docs/TESTIMONIOS.md`) y pasarlos a `datos.js`.
3. Enlace del repositorio EUDR y de un caso de tablero público, para sumarlos como prueba cuando estén verificados.
4. Dominio propio (opcional) y correo de la consultoría distinto del personal.
