# Cómo conseguir testimonios reales

La sección «Voces» de la web solo muestra frases textuales de personas con las que se trabajó, con su permiso
por escrito. Mientras `testimonios` esté vacío en `datos.js`, la página muestra una invitación honesta, no relleno.

## A quién pedírselos primero (personas reales de tu trayectoria)

Quienes recibieron un servicio tuyo, no quienes te dan referencias académicas:

- Los 3 proyectos que asesoraste en el grupo IDEAS (doctoral, maestría, pregrado).
- Asociaciones o líderes de los talleres de Epsea UPTC y ADR.
- Colegas de la Dirección de Investigaciones que usan los reportes o tableros del OCITEB.

Cada uno puede decidir si firma con nombre y cargo, o solo con el rol. Sin permiso, no se publica.

## Mensaje para enviar por WhatsApp

> Hola [nombre], estoy armando la página de mi consultoría y me ayudaría mucho una frase tuya sobre cómo
> te sirvió [el análisis / el taller / el tablero]. Dos o tres líneas bastan: qué necesitabas, qué entregué
> y qué cambió. ¿Me autorizas a publicarla con tu nombre y cargo? Si prefieres, la dejo solo con tu rol.

## Cómo guardarlo

Guarda la captura del «sí, autorizo» (WhatsApp o correo) en una carpeta fuera del repositorio.
Luego agrega la entrada en `datos.js`, dentro de `testimonios`:

```js
{ cita: "Texto exacto que te enviaron.", nombre: "Nombre Apellido", rol: "Cargo · Institución",
  servicio: "tesis", autorizado: true }
```

`servicio` es el `id` de uno de los 8 servicios (`tesis`, `sem`, `biblio`, `bi`, `geo`, `talleres`, `ensayos`, `etl`).

## Reglas

- La frase va tal como la escribió la persona. Solo se corrige ortografía evidente, con su visto bueno.
- Nada de cifras en la frase que no se puedan comprobar.
- Si alguien pide retirar su testimonio, se borra la entrada y se vuelve a publicar.
