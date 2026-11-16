# consultoria

Web piloto de la consultoría de Diego Sanabria (estadística y datos para el agro y la academia).
Sitio estático: HTML + CSS + JS sin dependencias, sin cookies ni rastreadores.

## Archivos

| Archivo | Qué es |
|---|---|
| `index.html` | Estructura de la página |
| `styles.css` | Diseño (papel, tinta, verde surco, ocre) |
| `app.js` | Relieve del hero, buscador, gráficas SVG, formulario |
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

## Publicar (pendiente de decidir)

El repositorio está en privado. Para publicar con GitHub Pages hay que hacerlo público
(o usar un plan con Pages privado), activar Pages en `main` / raíz, y opcionalmente apuntar un dominio propio.
La dirección quedaría `https://digsh.github.io/consultoria/`.

## Pendientes

1. Confirmar el nombre comercial (hoy «Consultoría Sanabria», provisional).
2. Conseguir 2 o 3 testimonios reales (ver `docs/TESTIMONIOS.md`) y pasarlos a `datos.js`.
3. Enlace del repositorio EUDR y de un caso de tablero público, para sumarlos como prueba cuando estén verificados.
4. Dominio propio (opcional) y correo de la consultoría distinto del personal.
