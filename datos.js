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

  /* Los 8 servicios del plan de ingresos (13/11/2026). Los precios NO se publican (eran supuestos). */
  servicios: [
    { id: "tesis", icono: "tesis", titulo: "Análisis estadístico y diseño experimental para tesis",
      para: "Tesistas de maestría y doctorado en ciencias agrarias, biológicas y ambientales",
      entrega: "Plan de análisis, script reproducible en R, tablas y gráficos con calidad de publicación, y una sesión de 2 h para sustentar el método.",
      respaldo: "Asesoría estadística a 3 proyectos simultáneos (doctoral, maestría y pregrado) · R avanzado" },
    { id: "sem", icono: "sem", titulo: "Ecuaciones estructurales (PLS-SEM) y psicometría",
      para: "Grupos de investigación y doctorandos en administración, economía, educación y ciencias sociales",
      entrega: "Modelo de medida (fiabilidad, AVE, HTMT), modelo estructural con bootstrapping, reporte de hipótesis y sección de resultados lista para artículo.",
      respaldo: "2 instrumentos psicométricos diseñados y validados · artículos con PLS-PM publicados (2024 y 2026)" },
    { id: "biblio", icono: "biblio", titulo: "Vigilancia científica y análisis bibliométrico",
      para: "Grupos de investigación, decanaturas y quienes formulan proyectos o estados del arte",
      entrega: "Ecuaciones de búsqueda calibradas, cribado asistido por agentes de IA con revisión humana y citas verificadas, redes de coautoría y co-citación, informe ejecutivo y base depurada en BibTeX/RIS.",
      respaldo: "12 reportes de análisis bibliométrico en el observatorio de CTeI de Boyacá · Bibliometrix y VOSviewer avanzado" },
    { id: "bi", icono: "bi", titulo: "Tableros de control y modelos de datos (Power BI)",
      para: "Universidades, colegios, cooperativas y ONG con reportes dispersos en Excel",
      entrega: "Pipeline de datos, modelo relacional en estrella, medidas DAX, tablero interactivo y manual de actualización.",
      respaldo: "Tableros públicos de indicadores de CTeI · PostgreSQL y ETL en Python en producción" },
    { id: "geo", icono: "geo", titulo: "Geolocalización de predios y cribado de deforestación (EUDR)",
      para: "Cooperativas y asociaciones de productores que venden a mercados europeos",
      entrega: "Polígonos prediales validados (GeoJSON), cruce satelital de deforestación y expediente de debida diligencia auditable.",
      respaldo: "Prototipo de debida diligencia EUDR con Whisp, Hansen/UMD y RADD-Sentinel-1 · QGIS y Google Earth Engine" },
    { id: "talleres", icono: "talleres", titulo: "Talleres de asociatividad y formalización rural",
      para: "Alcaldías, UMATA, fundaciones y asociaciones agropecuarias en formación",
      entrega: "Diseño pedagógico y facilitación de 2 a 3 jornadas, memorias técnicas y documentación para el registro en cámara de comercio.",
      respaldo: "Talleres para más de 300 productores en Boyacá · acompañamiento a 3 a 5 asociaciones hasta su registro" },
    { id: "ensayos", icono: "ensayos", titulo: "Ensayos agronómicos de eficacia de insumos",
      para: "Casas comerciales de bioinsumos, fertilizantes y laboratorios agrícolas",
      entrega: "Protocolo de ensayo, planilla móvil de captura fenológica (BBCH), seguimiento y reporte estadístico formal.",
      respaldo: "Ensayo propio: 120 unidades experimentales en diseño factorial con testigo, de la siembra a la cosecha, analizado en R" },
    { id: "etl", icono: "etl", titulo: "Auditoría y limpieza de bases de datos (ETL)",
      para: "Pymes, centros de diagnóstico y entidades con registros dispersos y con errores",
      entrega: "Diagnóstico de calidad (duplicados, nulos, integridad), script de depuración automática y base relacional limpia en PostgreSQL.",
      respaldo: "Base de 10 000+ registros con criterios de calidad · procesos ETL que consolidan reportes de varios sistemas" }
  ],

  /* Buscador: situación → servicio recomendado */
  situaciones: [
    { texto: "Tengo datos de un experimento y no sé cómo analizarlos", servicio: "tesis" },
    { texto: "Mi modelo teórico tiene variables que no se miden directamente", servicio: "sem" },
    { texto: "Necesito el estado del arte o mapear un tema de investigación", servicio: "biblio" },
    { texto: "Mis reportes viven en Excel y nadie los entiende", servicio: "bi" },
    { texto: "Mi asociación quiere exportar a Europa", servicio: "geo" },
    { texto: "Quiero capacitar o formalizar a una asociación", servicio: "talleres" },
    { texto: "Debo probar si mi producto funciona en campo", servicio: "ensayos" },
    { texto: "Mi base de datos tiene errores y duplicados", servicio: "etl" }
  ],

  /* Solo artículos con DOI verificado en Crossref el 16/11/2026 */
  publicaciones: [
    { anio: 2026, tema: "Complejidad y economía", rev: "Agrociencia", doi: "10.47163/agrociencia.v60i5.3581",
      titulo: "Economy as a complex adaptive system: an approach from evolutionary biology" },
    { anio: 2026, tema: "Territorio rural", rev: "Yachana Revista Científica", doi: "10.62325/10.62325/yachana.v15.n2.2026.1059",
      titulo: "Diversificación productiva y sostenibilidad territorial en organizaciones rurales amazónicas y andinas de Colombia" },
    { anio: 2026, tema: "Economía solidaria", rev: "360: Revista de Ciencias de la Gestión", doi: "10.18800/360gestion.202611.002",
      titulo: "Trabajo digno y seguridad laboral en circuitos cortos de comercialización" },
    { anio: 2026, tema: "PLS-SEM", rev: "Revista Boletín Redipe", doi: "10.36260/06cv8y62",
      titulo: "Intención emprendedora en estudiantes de secundaria desde la Teoría de la Acción Planificada con modelos PLS-PM" },
    { anio: 2025, tema: "Bibliometría", rev: "Journal of Scientific Metrics and Evaluation", doi: "10.69821/josme.v3i1.18",
      titulo: "Tecnologías emergentes y la gestión del conocimiento: un mapeo bibliométrico" },
    { anio: 2024, tema: "PLS-SEM", rev: "Journal of Posthumanism", doi: "10.63332/joph.v4i3.3174",
      titulo: "Factors of Influence on Purchasing Behavior: A Model with Latent Variables" },
    { anio: 2023, tema: "Bibliometría", rev: "Ciencia en Desarrollo", doi: "10.19053/uptc.01217488.v14.n3.2023.17422",
      titulo: "Criminología verde, una disciplina emergente: revisión bibliométrica (2000–2022)" }
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
    { fecha: "2025 – hoy", cargo: "Investigador facilitador", donde: "OCITEB · Vicerrectoría de Investigación y Extensión, UPTC",
      texto: "Base de datos de CTeI de Boyacá, ETL en Python, PostgreSQL, tableros en Power BI y reportes para SNIES-MEN, DANE y acreditación." },
    { fecha: "2024 – hoy", cargo: "Cofundador y líder técnico", donde: "Surco AgTech",
      texto: "Plataforma offline-first para pequeños productores, diagnóstico de enfermedades por imagen en 7 cultivos y asistente agronómico con RAG." },
    { fecha: "2024", cargo: "Joven investigador", donde: "Grupo IDEAS · UPTC",
      texto: "Dos instrumentos psicométricos validados y asesoría estadística a tres proyectos simultáneos." },
    { fecha: "2024", cargo: "Extensionista tallerista", donde: "Epsea UPTC · Agencia de Desarrollo Rural",
      texto: "Talleres de asociatividad para más de 300 productores y acompañamiento a la formalización de asociaciones." },
    { fecha: "2022 – 2023", cargo: "Formación", donde: "UPTC · MinTIC",
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
