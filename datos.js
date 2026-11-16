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

  /* Servicios del plan de ingresos (13/11/2026) y los sumados después (proyectos, dron, IA). Los precios NO se publican (eran supuestos). */
  servicios: [
    { id: "tesis", linea: ["academica"], icono: "tesis", titulo: "Análisis estadístico y diseño experimental para tesis",
      para: "Tesistas de maestría y doctorado en ciencias agrarias, biológicas y ambientales",
      entrega: "Plan de análisis, script reproducible en R, tablas y gráficos con calidad de publicación, y una sesión de 2 h para sustentar el método.",
      respaldo: "Asesoría estadística y metodológica a 4 tesis entre 2023 y 2025 (1 doctoral, 2 de maestría y 1 de pregrado) · R avanzado" },
    { id: "sem", linea: ["academica"], icono: "sem", titulo: "Ecuaciones estructurales (PLS-SEM) y psicometría",
      para: "Grupos de investigación y doctorandos en administración, economía, educación y ciencias sociales",
      entrega: "Modelo de medida (fiabilidad, AVE, HTMT), modelo estructural con bootstrapping, reporte de hipótesis y sección de resultados lista para artículo.",
      respaldo: "2 instrumentos psicométricos diseñados y validados · artículos con PLS-PM publicados (2024 y 2026)" },
    { id: "biblio", linea: ["academica"], icono: "biblio", titulo: "Vigilancia científica y análisis bibliométrico",
      para: "Grupos de investigación, decanaturas y quienes formulan proyectos o estados del arte",
      entrega: "Ecuaciones de búsqueda calibradas, redes de coautoría y co-citación, informe ejecutivo y base depurada en BibTeX/RIS.",
      respaldo: "12 reportes de análisis bibliométrico en el observatorio de CTeI de Boyacá · Bibliometrix y VOSviewer avanzado" },
    { id: "bi", linea: ["empresarial"], icono: "bi", titulo: "Tableros de control y modelos de datos (Power BI)",
      para: "Universidades, colegios, cooperativas y ONG con reportes dispersos en Excel",
      entrega: "Pipeline de datos, modelo relacional en estrella, medidas DAX, tablero interactivo y manual de actualización.",
      respaldo: "Tableros públicos de indicadores de CTeI · PostgreSQL y ETL en Python en producción" },
    { id: "geo", linea: ["empresarial"], icono: "geo", titulo: "Geolocalización de predios y cribado de deforestación (EUDR)",
      para: "Cooperativas y asociaciones de productores que venden a mercados europeos",
      entrega: "Polígonos prediales validados (GeoJSON), cruce satelital de deforestación y expediente de debida diligencia auditable.",
      respaldo: "Prototipo de debida diligencia EUDR con Whisp, Hansen/UMD y RADD-Sentinel-1 · QGIS y Google Earth Engine" },
    { id: "talleres", linea: ["empresarial"], icono: "talleres", titulo: "Talleres de asociatividad y formalización rural",
      para: "Alcaldías, UMATA, fundaciones y asociaciones agropecuarias en formación",
      entrega: "Diseño pedagógico y facilitación de 2 a 3 jornadas, memorias técnicas y documentación para el registro en cámara de comercio.",
      respaldo: "Talleres para más de 300 productores en Boyacá · acompañamiento a 3 a 5 asociaciones hasta su registro" },
    { id: "ensayos", linea: ["empresarial"], icono: "ensayos", titulo: "Ensayos agronómicos de eficacia de insumos",
      para: "Casas comerciales de bioinsumos, fertilizantes y laboratorios agrícolas",
      entrega: "Protocolo de ensayo, planilla móvil de captura fenológica (BBCH), seguimiento y reporte estadístico formal.",
      respaldo: "Ensayo propio: 120 unidades experimentales en diseño factorial con testigo, de la siembra a la cosecha, analizado en R · evaluación agronómica de biofertilizantes (2024) · acompañamiento a la certificación en Buenas Prácticas Agrícolas de un vivero en Tunja (2025)" },
    { id: "etl", linea: ["empresarial"], icono: "etl", titulo: "Auditoría y limpieza de bases de datos (ETL)",
      para: "Pymes, centros de diagnóstico y entidades con registros dispersos y con errores",
      entrega: "Diagnóstico de calidad (duplicados, nulos, integridad), script de depuración automática y base relacional limpia en PostgreSQL.",
      respaldo: "Base de 10 000+ registros con criterios de calidad · procesos ETL que consolidan reportes de varios sistemas" },
    { id: "proyectos", linea: ["academica", "empresarial"], icono: "proyectos", titulo: "Formulación y seguimiento de proyectos",
      para: "Grupos de investigación, asociaciones y empresas que se presentan a convocatorias o deben rendir cuentas",
      entrega: "Estructuración técnica y administrativa de la propuesta, cronograma y entregables, informes de avance y un informe final técnico y financiero.",
      respaldo: "Formulación y seguimiento administrativo de proyectos universidad-empresa en la OTRI y la Vicerrectoría de Investigación y Extensión de la UPTC · informes técnicos y financieros (Zahira Rodríguez)" }
    ,
    { id: "dron", linea: ["academica", "empresarial"], icono: "dron", titulo: "Mapeo y monitoreo de lotes con dron",
      para: "Productores, asociaciones, empresas del agro y grupos que necesitan ver el lote desde arriba",
      entrega: "Ortomosaico georreferenciado y modelo de superficie del predio, conteo de plantas, cobertura e índices de vegetación en RGB, y registro fotográfico, a cielo abierto o bajo cubierta, con mapas listos para QGIS.",
      respaldo: "Equipo propio de vuelo (cámara de 48 MP y video 4K) · análisis geoespacial en QGIS y Google Earth Engine" },
    { id: "ia", linea: ["empresarial"], icono: "ia", titulo: "Modelos de inteligencia artificial a medida para fincas",
      para: "Fincas, empresas agrícolas y asociaciones que quieren contar, medir o anticipar con sus propios datos",
      entrega: "Modelo entrenado con imágenes y registros de tu finca, validado con su error medido, y una herramienta sencilla (tablero) para usarlo. Conteo de fruta, proyección de cosecha y otros casos.",
      respaldo: "Diagnóstico de enfermedades por imagen en 7 cultivos (arándano, cacao, uchuva, papa, tomate, cebolla y cebada) con YOLOv8 y EfficientNet, en Surco AgTech · Python y aprendizaje automático · Certificación Profesional en Inteligencia Artificial (MinTIC, 2024)" }
  ],

  /* Detalle de los modelos a medida. Los casos de fruta y cosecha se ofrecen a medida: no se afirma
     un proyecto entregado hasta tener un caso verificado. */
  ia: {
    items: [
      { t: "Conteo de fruta", d: "Visión por computador sobre fotos o video del cultivo, en la planta o en la cosecha." },
      { t: "Proyección de cosecha", d: "Estimación de producción por lote y por semana con conteos, clima y registros de la finca." },
      { t: "Detección temprana de plagas y enfermedades", d: "Diagnóstico por imagen adaptado a tus cultivos." },
      { t: "Clasificación de calidad", d: "Fruta por tamaño, madurez o defectos para ordenar la cosecha y la venta." },
      { t: "Y otros casos", d: "Si tu finca tiene un dato que hoy se cuenta a mano, se evalúa si un modelo puede hacerlo." }
    ],
    limites: "Cada modelo se entrena y se valida con datos de tu finca y se entrega con su error medido. Con pocos datos propios, se empieza por un piloto."
  },

  /* Detalle de los servicios con dron. Cámara RGB (sin sensor multiespectral ni térmico).
     La experiencia de vuelo y los permisos NO se afirman hasta tenerlos verificados. */
  dron: {
    items: [
      { t: "Ortomosaico y modelo de superficie", d: "Mapa aéreo georreferenciado del lote y su relieve, listo para QGIS." },
      { t: "Conteo de plantas y fallas de siembra", d: "Detección sobre el ortomosaico, validada con muestreos en campo." },
      { t: "Cobertura e índices de vegetación en RGB", d: "Vigor relativo entre zonas del lote (VARI, GLI). No es NDVI." },
      { t: "Delimitación visual de predios", d: "Apoyo al polígono para EUDR o formalización. No reemplaza un levantamiento topográfico." },
      { t: "Seguimiento de ensayos y parcelas", d: "Vuelos repetidos para comparar tratamientos: cobertura y altura relativa." },
      { t: "Registro de daños y evidencias", d: "Granizo, heladas, inundaciones o fallas visibles, documentados para informes." },
      { t: "Vuelos bajo cubierta", d: "Inspección, conteo y registro en invernaderos y cultivos bajo cubierta." }
    ],
    limites: "Cámara RGB: no mide NDVI ni temperatura. La precisión absoluta de los mapas mejora con puntos de control en tierra, y se acuerda según el uso. Bajo cubierta, el plan de vuelo depende del espacio disponible."
  },

  /* Embudo de 4 pasos: quién eres, qué necesitas, qué tienes, para cuándo */
  lineas: {
    academica:   { texto: "Soy investigador o estudiante", frase: "investigador o estudiante" },
    empresarial: { texto: "Soy empresa, asociación o entidad", frase: "una empresa, asociación o entidad" }
  },
  situaciones: [
    { texto: "Tengo datos de un experimento y no sé cómo analizarlos", servicio: "tesis", linea: ["academica"] },
    { texto: "Mi modelo teórico tiene variables que no se miden directamente", servicio: "sem", linea: ["academica"] },
    { texto: "Necesito el estado del arte o mapear un tema de investigación o de tecnología", servicio: "biblio", linea: ["academica", "empresarial"] },
    { texto: "Quiero diseñar y analizar una encuesta o una escala de medición", servicio: "sem", linea: ["academica", "empresarial"] },
    { texto: "Debo formular un proyecto o presentarme a una convocatoria", servicio: "proyectos", linea: ["academica", "empresarial"] },
    { texto: "Mis reportes viven en Excel y nadie los entiende", servicio: "bi", linea: ["empresarial"] },
    { texto: "Mi base de datos tiene errores y duplicados", servicio: "etl", linea: ["academica", "empresarial"] },
    { texto: "Mi asociación quiere exportar a Europa", servicio: "geo", linea: ["empresarial"] },
    { texto: "Quiero capacitar o formalizar a una asociación", servicio: "talleres", linea: ["empresarial"] },
    { texto: "Debo probar si mi producto funciona en campo", servicio: "ensayos", linea: ["empresarial"] },
    { texto: "Debo rendir informes técnicos y financieros de un proyecto", servicio: "proyectos", linea: ["academica", "empresarial"] },
    { texto: "Quiero ver, mapear o contar plantas de mis lotes desde el aire", servicio: "dron", linea: ["academica", "empresarial"] },
    { texto: "Quiero contar fruta o proyectar mi cosecha con inteligencia artificial", servicio: "ia", linea: ["empresarial"] },
    { texto: "Todavía no sé cuál es mi problema, quiero conversarlo", servicio: null, linea: ["academica", "empresarial"] }
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
    { ini: "DS", nombre: "Diego Sanabria Higuera", rol: "Estadística, datos y análisis territorial",
      titulo: "Ingeniero Agrónomo y Especialista en Estadística (UPTC). Maestría en Ciencias Agrarias en curso.",
      respaldo: "Autor de los 7 artículos con DOI de esta página · 12 reportes bibliométricos en el OCITEB · cofundador de Surco AgTech", orcid: "0009-0007-3157-6140" },
    { ini: "ZR", nombre: "Zahira Rodríguez Bautista", rol: "Gestión y seguimiento de proyectos",
      titulo: "Administradora de Empresas (UPTC)",
      respaldo: "Coautora de 2 de los artículos de esta página · joven investigadora en la Vicerrectoría de Investigación y Extensión y apoyo en la OTRI (UPTC)", orcid: "0009-0004-4188-8488" },
    { ini: "SS", nombre: "Stiven Santana", rol: "Agronomía y desarrollo territorial, con enfoque en papa", titulo: "Ingeniero Agrónomo, Especialista en Desarrollo Territorial" },
    { ini: "FS", nombre: "Faiver Salcedo", rol: "Agronomía y desarrollo territorial, con enfoque en arándano", titulo: "Ingeniero Agrónomo, Especialista en Desarrollo Territorial" }
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
