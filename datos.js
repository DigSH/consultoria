/* Datos de la web. TODO lo que aparece en el sitio sale de acá y de
   C:\proyectos\Laboral\job-hunter-cgiar\data\perfil.json (base factual).
   Cambiar un hecho = cambiarlo aquí. Nada se inventa. */
window.CONSULTORIA = {
  contacto: {
    nombre: "Diego Israel Sanabria Higuera",
    whatsapp: "573158091128",
    whatsappVisible: "+57 315 809 1128",
    correo: "diego.san1296@gmail.com",
    ciudad: "Tunja, Boyacá"
  },

  /* Cuatro líneas de trabajo. Cada servicio declara su línea (`cat`), quién lo lidera (`responsables`, según lo
     dicho por el equipo) y su estado: los de `estado: "preparacion"` NO llevan respaldo hasta que esté documentado. */
  lineasServicio: {
    investigacion: { titulo: "Investigación y academia", lema: "Análisis que resiste al jurado y al revisor." },
    datos: { titulo: "Datos, IA y geomática", lema: "Del dato disperso al tablero, al modelo a medida y al mapa." },
    agro: { titulo: "Agricultura de precisión", lema: "Acompañamiento técnico a fincas, viveros e invernaderos." },
    proyectos: { titulo: "Proyectos y empresa", lema: "Formular, financiar, organizar y vender mejor." }
  },

  /* 12 servicios (consolidados). Cada uno declara su línea (`cat`), quién lo lidera (`responsables`, según lo dicho
     por el equipo), `incluye` (lo que reúne) y, si lo tiene, `limites`. Los de `estado: "preparacion"` NO llevan
     respaldo hasta que esté documentado; un servicio mixto es activo y marca «en preparación» solo la parte sin soporte.
     Los precios NO se publican (eran supuestos). */
  servicios: [
    { id: "estadistica", cat: "investigacion", corto: "Estadística y SEM", responsables: ["Diego"], linea: ["academica"], icono: "tesis",
      titulo: "Estadística y diseño experimental para investigación",
      para: "Tesistas, doctorandos y grupos de investigación en ciencias agrarias, biológicas, ambientales y sociales",
      entrega: "Plan de análisis, script reproducible en R, tablas y gráficos con calidad de publicación, modelos de ecuaciones estructurales con bootstrapping y una sesión de 2 h para sustentar el método.",
      respaldo: "Asesoría estadística y metodológica a 4 tesis entre 2023 y 2025 (1 doctoral, 2 de maestría y 1 de pregrado) · 2 instrumentos psicométricos diseñados y validados · artículos con PLS-PM publicados (2024 y 2026) · R avanzado",
      incluye: [
        { t: "Análisis estadístico y diseño experimental", d: "Plan de análisis, script en R, tablas y gráficos con calidad de publicación." },
        { t: "Ecuaciones estructurales (PLS-SEM) y psicometría", d: "Modelo de medida (fiabilidad, AVE, HTMT), modelo estructural con bootstrapping y reporte de hipótesis." }
      ] },

    { id: "cienciometria", cat: "investigacion", corto: "Cienciometría y artículos", responsables: ["Diego", "Zahira"], linea: ["academica"], icono: "biblio",
      titulo: "Cienciometría, vigilancia científica y artículos",
      para: "Grupos de investigación, decanaturas, docentes y quienes formulan proyectos o estados del arte",
      entrega: "Ecuaciones de búsqueda calibradas, redes de coautoría y co-citación, informe ejecutivo, base depurada en BibTeX/RIS y, si se requiere, el manuscrito: estructura, análisis, figuras reproducibles y apoyo en la respuesta a los revisores.",
      respaldo: "12 reportes de análisis bibliométrico en el observatorio de CTeI de Boyacá · Bibliometrix y VOSviewer avanzado · 7 artículos con DOI verificado (2023 a 2026) y 2 cartillas técnicas del Repositorio UPTC",
      incluye: [
        { t: "Vigilancia científica y bibliometría", d: "Búsqueda calibrada, redes de coautoría y co-citación, informe ejecutivo." },
        { t: "Producción de artículos científicos", d: "Estructura del manuscrito, análisis y figuras reproducibles, y apoyo con los revisores." }
      ] },

    { id: "tableros", cat: "datos", corto: "Tableros", responsables: ["Diego"], linea: ["empresarial"], icono: "bi",
      titulo: "Tableros de control y modelos de datos (Power BI)",
      para: "Universidades, colegios, cooperativas y ONG con reportes dispersos en Excel",
      entrega: "Pipeline de datos, modelo relacional en estrella, medidas DAX, tablero interactivo y manual de actualización.",
      respaldo: "Tableros públicos de indicadores de CTeI · PostgreSQL y ETL en Python en producción",
      incluye: [
        { t: "Pipeline de datos y modelo relacional en estrella", d: "Los datos de varios reportes consolidados en un modelo limpio." },
        { t: "Medidas DAX y tablero interactivo", d: "Indicadores calculados y visuales listos para decidir." },
        { t: "Manual de actualización", d: "Cómo refrescar el tablero sin depender de nadie." }
      ] },

    { id: "gobernanza", cat: "datos", corto: "Gobernanza de datos", responsables: ["Diego"], linea: ["academica", "empresarial"], icono: "etl",
      titulo: "Gobernanza y calidad de datos",
      para: "Universidades, colegios, cooperativas, ONG y entidades con registros dispersos, duplicados o sin responsables definidos",
      entrega: "Diagnóstico de calidad (duplicados, nulos, integridad), script de depuración automática, base relacional limpia en PostgreSQL y lineamientos de gobernanza: diccionario de datos, roles y responsables, y reglas de calidad y actualización.",
      respaldo: "Base de 10 000+ registros con criterios de calidad · procesos ETL que consolidan reportes de varios sistemas",
      incluye: [
        { t: "Auditoría y limpieza de bases de datos (ETL)", d: "Diagnóstico de calidad, depuración automática y base relacional limpia." },
        { t: "Gobernanza de datos", d: "Diccionario de datos, roles y responsables, y reglas de calidad y actualización." }
      ] },

    { id: "ia", cat: "datos", corto: "IA a medida", responsables: ["Diego"], linea: ["empresarial", "productor"], icono: "ia",
      titulo: "Modelos de inteligencia artificial a medida para fincas",
      para: "Fincas, empresas agrícolas y asociaciones que quieren contar, medir o anticipar con sus propios datos",
      entrega: "Modelo entrenado con imágenes y registros de tu finca, validado con su error medido, y una herramienta sencilla (tablero) para usarlo. Conteo de fruta, proyección de cosecha y otros casos.",
      respaldo: "Diagnóstico de enfermedades por imagen en 7 cultivos (arándano, cacao, uchuva, papa, tomate, cebolla y cebada) con YOLOv8 y EfficientNet, en Surco AgTech · Python y aprendizaje automático · Certificación Profesional en Inteligencia Artificial (MinTIC, 2024)",
      incluye: [
        { t: "Conteo de fruta", d: "Visión por computador sobre fotos o video del cultivo, en la planta o en la cosecha." },
        { t: "Proyección de cosecha", d: "Estimación de producción por lote y por semana con conteos, clima y registros de la finca." },
        { t: "Detección temprana de plagas y enfermedades", d: "Diagnóstico por imagen adaptado a tus cultivos." },
        { t: "Clasificación de calidad", d: "Fruta por tamaño, madurez o defectos para ordenar la cosecha y la venta." },
        { t: "Y otros casos", d: "Si tu finca tiene un dato que hoy se cuenta a mano, se evalúa si un modelo puede hacerlo." }
      ],
      limites: "Cada modelo se entrena y se valida con datos de tu finca y se entrega con su error medido. Con pocos datos propios, se empieza por un piloto." },

    { id: "geomatica", cat: "datos", corto: "Dron, GIS y EUDR", responsables: ["Stiven", "Diego"], linea: ["academica", "empresarial", "productor"], icono: "geo",
      titulo: "Geomática, mapeo con dron y trazabilidad EUDR",
      para: "Cooperativas, asociaciones, productores y empresas que exportan o necesitan ver el lote desde arriba",
      entrega: "Polígonos prediales validados (GeoJSON), cruce satelital de deforestación y expediente de debida diligencia auditable; ortomosaico y modelo de superficie con dron, conteo de plantas, cobertura e índices de vegetación en RGB y registro fotográfico, a cielo abierto o bajo cubierta, con mapas listos para QGIS.",
      respaldo: "Prototipo de debida diligencia EUDR con Whisp, Hansen/UMD y RADD-Sentinel-1 · QGIS y Google Earth Engine · equipo propio de vuelo (cámara de 48 MP y video 4K)",
      incluye: [
        { t: "Geolocalización de predios y cribado EUDR", d: "Polígonos validados en GeoJSON, cruce satelital de deforestación y expediente auditable." },
        { t: "Ortomosaico y modelo de superficie", d: "Mapa aéreo georreferenciado del lote y su relieve, listo para QGIS." },
        { t: "Conteo de plantas y fallas de siembra", d: "Detección sobre el ortomosaico, validada con muestreos en campo." },
        { t: "Cobertura e índices de vegetación en RGB", d: "Vigor relativo entre zonas del lote (VARI, GLI). No es NDVI." },
        { t: "Delimitación visual de predios", d: "Apoyo al polígono para EUDR o formalización. No reemplaza un levantamiento topográfico." },
        { t: "Seguimiento de ensayos y parcelas", d: "Vuelos repetidos para comparar tratamientos: cobertura y altura relativa." },
        { t: "Registro de daños y evidencias", d: "Granizo, heladas, inundaciones o fallas visibles, documentados para informes." },
        { t: "Vuelos bajo cubierta", d: "Inspección, conteo y registro en invernaderos y cultivos bajo cubierta." }
      ],
      limites: "Cámara RGB: no mide NDVI ni temperatura. La precisión absoluta de los mapas mejora con puntos de control en tierra, y se acuerda según el uso. Bajo cubierta, el plan de vuelo depende del espacio disponible." },

    { id: "bajo", cat: "agro", corto: "Bajo cubierta", responsables: ["Faiver"], estado: "preparacion", linea: ["empresarial", "productor"], icono: "invernadero",
      titulo: "Cultivos intensivos bajo cubierta (MIPE, MIRFE)",
      desc: "Manejo integrado de plagas y enfermedades (MIPE) y manejo integrado de riego y fertilización (MIRFE) en invernaderos y cultivos bajo cubierta.",
      incluye: [
        { t: "Manejo integrado de plagas y enfermedades (MIPE)", d: "En invernaderos y cultivos bajo cubierta." },
        { t: "Manejo integrado de riego y fertilización (MIRFE)", d: "En invernaderos y cultivos bajo cubierta." }
      ] },

    { id: "suelos", cat: "agro", corto: "Suelos y praderas", responsables: ["Diego", "Stiven"], estado: "preparacion", linea: ["empresarial", "productor"], icono: "suelo",
      titulo: "Suelos, aguas y mejoramiento de praderas",
      desc: "Análisis de suelos y aguas para cultivos extensivos con interpretación de resultados, y diagnóstico y plan de mejoramiento de praderas.",
      incluye: [
        { t: "Análisis de suelos y aguas (cultivos extensivos)", d: "Con interpretación de resultados." },
        { t: "Mejoramiento de praderas", d: "Diagnóstico y plan de mejoramiento." }
      ] },

    { id: "bpa", cat: "agro", corto: "BPA y ensayos", responsables: ["Faiver", "Diego"], linea: ["empresarial", "productor"], icono: "bpa",
      titulo: "Buenas Prácticas Agrícolas, ensayos de eficacia y diseño de fincas",
      para: "Fincas, viveros, asociaciones, cooperativas y casas comerciales de bioinsumos y fertilizantes",
      entrega: "BPA: diagnóstico frente a la norma, plan de adecuación con registros y formatos, preparación para la auditoría de certificación y plan de manejo con calendario de labores. Ensayos: protocolo, planilla móvil de captura fenológica (BBCH), seguimiento y reporte estadístico formal.",
      respaldo: "Acompañamiento a la certificación en BPA de un vivero en Tunja (2025) · ensayo propio: 120 unidades experimentales en diseño factorial con testigo, de la siembra a la cosecha, analizado en R · evaluación agronómica de biofertilizantes (2024) · coautoría del plan de manejo tecnológico del cultivo de la pitahaya (Repositorio UPTC, 2022)",
      incluye: [
        { t: "Buenas Prácticas Agrícolas y planes de manejo", d: "Diagnóstico, adecuación con registros, preparación para la auditoría y calendario de labores." },
        { t: "Ensayos agronómicos de eficacia de insumos", d: "Protocolo, captura fenológica (BBCH), seguimiento y reporte estadístico." },
        { t: "Diseño de fincas (en preparación)", d: "Diseño y rediseño de fincas.", prep: true }
      ] },

    { id: "semilla", cat: "agro", corto: "Papa y poscosecha", responsables: ["Stiven", "Faiver"], estado: "preparacion", linea: ["empresarial", "productor"], icono: "semilla",
      titulo: "Semilla certificada de papa, poscosecha y logística",
      desc: "Acompañamiento en la producción de semilla certificada de papa y en el manejo poscosecha y la logística del producto agrícola.",
      incluye: [
        { t: "Producción de semilla certificada de papa", d: "Acompañamiento en la producción." },
        { t: "Poscosecha y logística", d: "Manejo poscosecha y logística del producto agrícola." }
      ] },

    { id: "proyectos", cat: "proyectos", corto: "Proyectos", responsables: ["Zahira", "Faiver", "Diego"], linea: ["academica", "empresarial", "productor"], icono: "proyectos",
      titulo: "Formulación, evaluación y seguimiento de proyectos, y asociatividad",
      para: "Grupos de investigación, asociaciones, alcaldías, UMATA, fundaciones y empresas que formulan proyectos o se organizan",
      entrega: "Propuesta técnica y administrativa, cronograma y entregables, informes de avance y un informe final técnico y financiero; evaluación de proyectos ajenos (coherencia técnica y presupuestal) y talleres de asociatividad de 2 a 3 jornadas con memorias y documentación para el registro en cámara de comercio.",
      respaldo: "Formulación y seguimiento administrativo de proyectos universidad-empresa en la OTRI y la Vicerrectoría de Investigación y Extensión de la UPTC · talleres para más de 300 productores en Boyacá · acompañamiento a 3 a 5 asociaciones hasta su registro",
      incluye: [
        { t: "Formulación, evaluación y seguimiento de proyectos", d: "Propuesta, cronograma, informes de avance y final técnico y financiero." },
        { t: "Talleres de asociatividad y formalización rural", d: "2 a 3 jornadas, memorias y documentación para el registro en cámara de comercio." }
      ] },

    { id: "empresa", cat: "proyectos", corto: "Finanzas y marca", responsables: ["Zahira"], estado: "preparacion", linea: ["empresarial", "productor"], icono: "financiero",
      titulo: "Finanzas, marca y mercadeo para empresas y asociaciones",
      desc: "Análisis financiero y consultoría empresarial, diseño de marca, marketing y mercadeo.",
      incluye: [
        { t: "Análisis financiero y consultoría empresarial", d: "Para empresas y asociaciones." },
        { t: "Diseño de marca, marketing y mercadeo", d: "Marca y estrategia de mercadeo." }
      ] }
  ],

  /* Embudo de 4 pasos: quién eres, qué necesitas, qué tienes, para cuándo */
  lineas: {
    academica:   { texto: "Soy investigador o estudiante", frase: "investigador o estudiante" },
    empresarial: { texto: "Soy empresa, asociación o entidad", frase: "una empresa, asociación o entidad" },
    productor: { texto: "Soy productor o tengo una finca", frase: "productor o con una finca" }
  },
  situaciones: [
    { texto: "Tengo datos de un experimento y no sé cómo analizarlos", servicio: "estadistica", linea: ["academica"] },
    { texto: "Mi modelo teórico tiene variables que no se miden directamente", servicio: "estadistica", linea: ["academica"] },
    { texto: "Necesito el estado del arte o mapear un tema de investigación o de tecnología", servicio: "cienciometria", linea: ["academica", "empresarial"] },
    { texto: "Quiero diseñar y analizar una encuesta o una escala de medición", servicio: "estadistica", linea: ["academica", "empresarial"] },
    { texto: "Quiero convertir mi investigación en un artículo científico", servicio: "cienciometria", linea: ["academica"] },
    { texto: "Debo formular o evaluar un proyecto, o presentarme a una convocatoria", servicio: "proyectos", linea: ["academica", "empresarial", "productor"] },
    { texto: "Debo rendir informes técnicos y financieros de un proyecto", servicio: "proyectos", linea: ["academica", "empresarial", "productor"] },
    { texto: "Mis reportes viven en Excel y nadie los entiende", servicio: "tableros", linea: ["empresarial"] },
    { texto: "Mi base de datos tiene errores y duplicados", servicio: "gobernanza", linea: ["academica", "empresarial"] },
    { texto: "No sé quién es responsable de mis datos ni qué reglas deben cumplir", servicio: "gobernanza", linea: ["academica", "empresarial"] },
    { texto: "Mi asociación quiere exportar a Europa", servicio: "geomatica", linea: ["empresarial", "productor"] },
    { texto: "Quiero capacitar o formalizar a una asociación", servicio: "proyectos", linea: ["empresarial", "productor"] },
    { texto: "Debo probar si mi producto funciona en campo", servicio: "bpa", linea: ["empresarial"] },
    { texto: "Quiero analizar mis finanzas o el modelo de negocio de mi empresa", servicio: "empresa", linea: ["empresarial"] },
    { texto: "Quiero mejorar mi marca y mis ventas", servicio: "empresa", linea: ["empresarial", "productor"] },
    { texto: "Quiero ver, mapear o contar plantas de mis lotes desde el aire", servicio: "geomatica", linea: ["academica", "empresarial", "productor"] },
    { texto: "Quiero contar fruta o proyectar mi cosecha con inteligencia artificial", servicio: "ia", linea: ["empresarial", "productor"] },
    { texto: "Quiero certificar mi finca o vivero en Buenas Prácticas Agrícolas, u ordenar el manejo de mi cultivo", servicio: "bpa", linea: ["empresarial", "productor"] },
    { texto: "Tengo plagas o enfermedades en mi invernadero o cultivo bajo cubierta", servicio: "bajo", linea: ["empresarial", "productor"] },
    { texto: "Quiero analizar mi suelo y mi agua", servicio: "suelos", linea: ["empresarial", "productor"] },
    { texto: "Mis praderas están degradadas o producen poco", servicio: "suelos", linea: ["empresarial", "productor"] },
    { texto: "Pierdo producto después de cosechar o no sé cómo transportarlo", servicio: "semilla", linea: ["empresarial", "productor"] },
    { texto: "Quiero diseñar o rediseñar mi finca", servicio: "bpa", linea: ["empresarial", "productor"] },
    { texto: "Quiero producir semilla certificada de papa", servicio: "semilla", linea: ["empresarial", "productor"] },
    { texto: "Todavía no sé cuál es mi problema, quiero conversarlo", servicio: null, linea: ["academica", "empresarial", "productor"] }
  ],
  opcionesDatos: [
    { id: "tengo", t: "Ya tengo datos" },
    { id: "sucios", t: "Tengo datos dispersos o con errores" },
    { id: "diseno", t: "Aún no hay datos: hay que diseñar el estudio" },
    { id: "idea", t: "Solo tengo la idea" }
  ],
  opcionesPlazo: [
    { id: "urgente", t: "Menos de 2 semanas" },
    { id: "mes", t: "Entre 2 semanas y 2 meses" },
    { id: "largo", t: "Más de 2 meses" },
    { id: "libre", t: "Sin fecha definida" }
  ],

  /* Equipo. Titulación según lo dicho por Diego y la hoja de vida de Zahira. «Enfoque en papa/arándano» queda
     como enfoque (no «experto») hasta tener evidencia: proyectos, años o publicaciones. */
  equipo: [
    { ini: "DS", corto: "Diego", nombre: "Diego Sanabria Higuera", rol: "Estadística, datos y análisis territorial",
      titulo: "Ingeniero Agrónomo y Especialista en Estadística (UPTC). Maestría en Ciencias Agrarias en curso.",
      respaldo: "Autor de los 7 artículos con DOI de esta página · 12 reportes bibliométricos en el OCITEB · cofundador de Surco AgTech", orcid: "0009-0007-3157-6140" },
    { ini: "ZR", corto: "Zahira", nombre: "Zahira Rodríguez Bautista", rol: "Gestión y seguimiento de proyectos",
      titulo: "Administradora de Empresas (UPTC)",
      respaldo: "Coautora de 2 de los artículos de esta página · joven investigadora en la Vicerrectoría de Investigación y Extensión y apoyo en la OTRI (UPTC)", orcid: "0009-0004-4188-8488" },
    { ini: "SS", corto: "Stiven", nombre: "Stiven Santana", rol: "Agronomía y desarrollo territorial, con enfoque en papa", titulo: "Ingeniero Agrónomo, Especialista en Desarrollo Territorial (UPTC)" },
    { ini: "FS", corto: "Faiver", nombre: "Faiver Salcedo", rol: "Agronomía y desarrollo territorial, con enfoque en arándano", titulo: "Ingeniero Agrónomo, Especialista en Desarrollo Territorial (UPTC)" }
  ],

  /* Solo artículos con DOI verificado en Crossref el 16/11/2026.
     `equipo` = integrantes que figuran como autores en el registro de Crossref (comprobado ese día). */
  publicaciones: [
    { anio: 2026, tema: "Complejidad y economía", rev: "Agrociencia", doi: "10.47163/agrociencia.v60i5.3581", equipo: ["Diego Sanabria"],
      titulo: "Economy as a complex adaptive system: an approach from evolutionary biology" },
    { anio: 2026, tema: "Territorio rural", rev: "Yachana Revista Científica", doi: "10.62325/10.62325/yachana.v15.n2.2026.1059", equipo: ["Diego Sanabria"],
      titulo: "Diversificación productiva y sostenibilidad territorial en organizaciones rurales amazónicas y andinas de Colombia" },
    { anio: 2026, tema: "Economía solidaria", rev: "360: Revista de Ciencias de la Gestión", doi: "10.18800/360gestion.202611.002", equipo: ["Diego Sanabria"],
      titulo: "Trabajo digno y seguridad laboral en circuitos cortos de comercialización" },
    { anio: 2026, tema: "PLS-SEM", rev: "Revista Boletín Redipe", doi: "10.36260/06cv8y62", equipo: ["Diego Sanabria", "Zahira Rodríguez"],
      titulo: "Intención emprendedora en estudiantes de secundaria desde la Teoría de la Acción Planificada con modelos PLS-PM" },
    { anio: 2025, tema: "Bibliometría", rev: "Journal of Scientific Metrics and Evaluation", doi: "10.69821/josme.v3i1.18", equipo: ["Diego Sanabria", "Zahira Rodríguez"],
      titulo: "Tecnologías emergentes y la gestión del conocimiento: un mapeo bibliométrico" },
    { anio: 2024, tema: "PLS-SEM", rev: "Journal of Posthumanism", doi: "10.63332/joph.v4i3.3174", equipo: ["Diego Sanabria"],
      titulo: "Factors of Influence on Purchasing Behavior: A Model with Latent Variables" },
    { anio: 2023, tema: "Bibliometría", rev: "Ciencia en Desarrollo", doi: "10.19053/uptc.01217488.v14.n3.2023.17422", equipo: ["Diego Sanabria"],
      titulo: "Criminología verde, una disciplina emergente: revisión bibliométrica (2000–2022)" }
  ],

  /* Cartillas técnicas del Repositorio UPTC (enlaces comprobados el 16/11/2026: responden 200).
     Autoría según el CV de Diego y la hoja de vida de Zahira. */
  cartillas: [
    { anio: 2024, ed: "Editorial UPTC", equipo: ["Diego Sanabria", "Zahira Rodríguez"],
      titulo: "Proyectos productivos sostenibles de jóvenes rurales: un ejercicio de emprendimiento en el municipio de Motavita",
      url: "https://repositorio.uptc.edu.co/entities/publication/c0bc5a12-31b9-46a8-9a45-3db98e9f27ac" },
    { anio: 2022, ed: "Repositorio UPTC", equipo: ["Diego Sanabria"],
      titulo: "Plan de manejo tecnológico del cultivo de la pitahaya",
      url: "https://repositorio.uptc.edu.co/bitstream/001/9055/1/Plan_manejo_tecnologico_cultivo_pitahaya.pdf" }
  ],

  /* Competencias geoespaciales declaradas en perfil.json (nada de GDAL/rasterio: aún no está documentado) */
  gis: [
    { t: "QGIS", d: "Análisis y cartografía de predios y cuencas" },
    { t: "Google Earth Engine", d: "Series satelitales y cribado a escala" },
    { t: "Sentinel-1 · RADD", d: "Alertas de deforestación con radar" },
    { t: "Hansen / UMD", d: "Pérdida de cobertura arbórea posterior a 2020" },
    { t: "Whisp · Open Foris", d: "Cribado de riesgo por polígono" },
    { t: "GeoJSON · GPX", d: "Validación y entrega de geometrías" }
  ],

  cifras: [
    { n: 10000, sufijo: "+", etiqueta: "registros de investigación gestionados", fuente: "OCITEB · UPTC" },
    { n: 12, sufijo: "", etiqueta: "reportes de análisis bibliométrico", fuente: "OCITEB · UPTC" },
    { n: 4, sufijo: "", etiqueta: "sedes consolidadas para la reacreditación Multicampus", fuente: "UPTC" },
    { n: 300, sufijo: "+", etiqueta: "productores rurales en talleres", fuente: "Epsea UPTC · ADR" },
    { n: 7, sufijo: "", etiqueta: "cultivos con diagnóstico por imagen", fuente: "Surco AgTech" },
    { n: 120, sufijo: "", etiqueta: "unidades experimentales en un ensayo propio", fuente: "Proyecto de grado · CIDE" }
  ],

  trayectoria: [
    { fecha: "2026 – en curso", quien: "Diego", cargo: "Maestría en Ciencias Agrarias", donde: "UPTC",
      texto: "Estudios de maestría en curso, junto con el trabajo de consultoría." },
    { fecha: "2025 – hoy", quien: "Diego", cargo: "Investigador facilitador", donde: "OCITEB · Vicerrectoría de Investigación y Extensión, UPTC",
      texto: "Base de datos de CTeI de Boyacá, ETL en Python, PostgreSQL, tableros en Power BI y reportes para SNIES-MEN, DANE y acreditación." },
    { fecha: "2025 – 2026", quien: "Zahira", cargo: "Joven investigadora", donde: "Vicerrectoría de Investigación y Extensión, UPTC · Grupo Gamma",
      texto: "Proyecto sobre barreras y facilitadores en la integración de la inteligencia artificial en actividades académicas, con informes técnicos y financieros, actualización de CvLAC, GrupLAC y SGI, y análisis en JASP y R." },
    { fecha: "2024 – hoy", quien: "Diego", cargo: "Cofundador y líder técnico", donde: "Surco AgTech",
      texto: "Plataforma offline-first para pequeños productores, diagnóstico de enfermedades por imagen en 7 cultivos (arándano, cacao, uchuva, papa, tomate, cebolla y cebada) y asistente agronómico con RAG." },
    { fecha: "2024", quien: "Diego", cargo: "Joven investigador", donde: "Grupo IDEAS · UPTC",
      texto: "Dos instrumentos psicométricos validados y asesoría estadística a tres proyectos simultáneos." },
    { fecha: "2024", quien: "Diego", cargo: "Extensionista tallerista", donde: "Epsea UPTC · Agencia de Desarrollo Rural",
      texto: "Talleres de asociatividad para más de 300 productores y acompañamiento a la formalización de asociaciones." },
    { fecha: "2024", quien: "Zahira", cargo: "Profesional de apoyo en gestión de proyectos", donde: "OTRI · UPTC",
      texto: "Estructuración administrativa del proyecto de innovación social UPTC-UNIMINUTO, análisis bibliométricos, tableros de indicadores en Excel y asesoría en activos intangibles." },
    { fecha: "2022 – 2023", quien: "Diego", cargo: "Formación", donde: "UPTC · MinTIC",
      texto: "Ingeniero Agrónomo y Especialista en Estadística (2023). Certificación Profesional en Inteligencia Artificial, MinTIC (2024)." }
  ],

  /* Testimonios REALES y autorizados por escrito. Vacío hasta tenerlos.
     Formato: { cita: "…", nombre: "…", rol: "…", servicio: "tesis", autorizado: true }
     Ver docs/TESTIMONIOS.md para pedirlos. */
  testimonios: [],

  /* Solo se muestran con ?demo=1 para ver el diseño. Texto de relleno marcado como ejemplo. */
  testimoniosDemo: [
    { cita: "Aquí irá, con su permiso, la frase textual de quien trabajó contigo.", nombre: "Nombre y apellido", rol: "Tesista · Universidad", servicio: "tesis" },
    { cita: "Una frase corta sobre qué cambió: tiempo ahorrado, resultado aprobado, decisión tomada.", nombre: "Nombre y apellido", rol: "Directora de grupo de investigación", servicio: "biblio" },
    { cita: "Mejor si menciona el entregable concreto, el plazo y el resultado.", nombre: "Nombre y apellido", rol: "Asociación de productores", servicio: "talleres" }
  ]
};
