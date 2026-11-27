/* Datos de la web. TODO lo que aparece en el sitio sale de acá y de
   C:\proyectos\Laboral\job-hunter-cgiar\data\perfil.json (base factual).
   Cambiar un hecho = cambiarlo aquí. Nada se inventa. */
window.CONSULTORIA = {
  /* medición anónima sin cookies: poner aquí el código de la cuenta de GoatCounter (p. ej. "consultoria-uptc");
     vacío = no se carga nada ni se muestra el aviso */
  analitica: { goatcounter: "" },
  contacto: {
    nombre: "Diego Israel Sanabria Higuera",
    whatsapp: "573158091128",
    whatsappVisible: "+57 315 809 1128",
    correo: "diego.san1296@gmail.com",
    ciudad: "Tunja, Boyacá"
  },

  lineasServicio: {
    investigacion: { titulo: "Investigación" },
    datos: { titulo: "Datos, IA y GIS" },
    agro: { titulo: "Agro y campo" },
    proyectos: { titulo: "Proyectos" }
  },

  /* 9 servicios esenciales con respaldo verificado */
  servicios: [
    { id: "estadistica", cat: "investigacion", corto: "Estadística y SEM", responsables: ["Diego"], linea: ["academica"], icono: "tesis",
      titulo: "Estadística y diseño experimental",
      entrega: "Plan de análisis, código en R, tablas y figuras listas para publicación, modelos PLS-SEM y sesión de sustentación.",
      respaldo: "4 tesis asesoradas (2023–2025) · 2 escalas psicométricas validadas · artículos PLS-PM (2024, 2026)" },

    { id: "cienciometria", cat: "investigacion", corto: "Cienciometría", responsables: ["Diego", "Zahira"], linea: ["academica"], icono: "biblio",
      titulo: "Cienciometría y artículos científicos",
      entrega: "Búsqueda calibrada, redes en Bibliometrix/VOSviewer, base BibTeX/RIS y apoyo en estructura, figuras y respuesta a revisores.",
      respaldo: "12 reportes bibliométricos (OCITEB) · 7 artículos con DOI (2023–2026) · 2 cartillas UPTC" },

    { id: "tableros", cat: "datos", corto: "Power BI", responsables: ["Diego"], linea: ["empresarial"], icono: "bi",
      titulo: "Tableros y modelos en Power BI",
      entrega: "Pipeline de datos, modelo relacional en estrella, medidas DAX, tablero interactivo y manual de actualización.",
      respaldo: "Tableros públicos de indicadores de CTeI · PostgreSQL y ETL en Python en producción" },

    { id: "gobernanza", cat: "datos", corto: "Datos y ETL", responsables: ["Diego"], linea: ["academica", "empresarial"], icono: "etl",
      titulo: "Gobernanza y limpieza de bases (ETL)",
      entrega: "Auditoría de duplicados y nulos, depuración automática, base en PostgreSQL y diccionario de datos.",
      respaldo: "Base de 10 000+ registros de investigación · procesos ETL multifuente en producción" },

    { id: "ia", cat: "datos", corto: "IA agrícola", responsables: ["Diego"], linea: ["empresarial", "productor"], icono: "ia",
      titulo: "Modelos de IA a medida para fincas",
      entrega: "Visión por computador y proyección de cosecha entrenados con sus datos, con error medido y tablero de uso.",
      respaldo: "IA por imagen en tomate, arándano, cacao y banano, y peso de bovinos y porcinos (Surco AgTech, YOLOv8) · Certificación IA MinTIC (2024)" },

    { id: "surco", cat: "datos", corto: "App Surco", responsables: ["Diego"], linea: ["empresarial", "productor"], icono: "app",
      titulo: "Surco configurado para su finca u organización",
      entrega: "Fincas, lotes y polígonos cargados, cultivos y labores, usuarios con roles, alertas, cuaderno BPA, módulo EUDR y capacitación de uso.",
      respaldo: "App publicada en Google Play · caso de uso con Arándanos de la Fuente · tablero por organización con roles" },

    { id: "geomatica", cat: "datos", corto: "GIS, dron y EUDR", responsables: ["Stiven", "Diego"], linea: ["academica", "empresarial", "productor"], icono: "geo",
      titulo: "Geomática, dron y trazabilidad EUDR",
      entrega: "Polígonos prediales y expediente EUDR, ortomosaicos y modelos de superficie con dron (RGB), conteo de plantas y mapas en QGIS.",
      respaldo: "Prototipo de debida diligencia EUDR con Whisp, Hansen/UMD y RADD-Sentinel-1 · QGIS, Google Earth Engine y dron 48 MP" },

    { id: "bpa", cat: "agro", corto: "BPA y ensayos", responsables: ["Faiver", "Diego"], linea: ["empresarial", "productor"], icono: "bpa",
      titulo: "Buenas Prácticas Agrícolas y ensayos en campo",
      entrega: "Diagnóstico y plan de adecuación para certificación BPA; protocolo, seguimiento fenológico (BBCH) y análisis estadístico de ensayos.",
      respaldo: "Acompañamiento a la certificación BPA de un vivero (Tunja, 2025) · ensayo factorial de 120 UE en R · evaluación de biofertilizantes (2024)" },

    { id: "proyectos", cat: "proyectos", corto: "Proyectos", responsables: ["Zahira", "Faiver", "Diego"], linea: ["academica", "empresarial", "productor"], icono: "proyectos",
      titulo: "Formulación de proyectos y asociatividad",
      entrega: "Estructuración técnica y financiera para convocatorias, informes de avance y talleres de asociatividad hasta el registro legal.",
      respaldo: "Proyectos universidad-empresa en OTRI y VIE-UPTC · talleres con 300+ productores y 3–5 asociaciones acompañadas hasta su registro" }
  ],

  lineas: {
    productor:   { texto: "Productor o finca", frase: "productor o con una finca" },
    empresarial: { texto: "Empresa o entidad", frase: "una empresa, asociación o entidad" },
    academica:   { texto: "Investigación o tesis", frase: "investigador o estudiante" }
  },

  situaciones: [
    { texto: "Analizar datos de un experimento, encuesta o tesis (R / PLS-SEM)", servicio: "estadistica", linea: ["academica", "empresarial"] },
    { texto: "Estado del arte, bibliometría o apoyo en artículo científico", servicio: "cienciometria", linea: ["academica", "empresarial"] },
    { texto: "Pasar reportes dispersos en Excel a un tablero en Power BI", servicio: "tableros", linea: ["empresarial"] },
    { texto: "Limpiar y ordenar una base de datos con duplicados o errores", servicio: "gobernanza", linea: ["academica", "empresarial"] },
    { texto: "Mapear lotes con dron, medir relieve o validar predios EUDR", servicio: "geomatica", linea: ["academica", "empresarial", "productor"] },
    { texto: "Llevar el registro de mi finca en una app: labores, alertas, BPA y EUDR", servicio: "surco", linea: ["empresarial", "productor"] },
    { texto: "Contar fruta, detectar daño o proyectar cosecha con IA", servicio: "ia", linea: ["empresarial", "productor"] },
    { texto: "Preparar una finca o vivero para la certificación BPA o evaluar un insumo en campo", servicio: "bpa", linea: ["empresarial", "productor"] },
    { texto: "Formular un proyecto, rendir informes o formalizar una asociación", servicio: "proyectos", linea: ["academica", "empresarial", "productor"] },
    { texto: "Otro caso: quiero conversarlo", servicio: null, linea: ["academica", "empresarial", "productor"] }
  ],

  equipo: [
    { ini: "DS", corto: "Diego", nombre: "Diego Sanabria Higuera", rol: "Estadística, datos y geomática",
      titulo: "Ing. Agrónomo y Esp. en Estadística (UPTC) · Maestría en Ciencias Agrarias (en curso)",
      respaldo: "7 artículos con DOI · investigador OCITEB VIE-UPTC · cofundador Surco AgTech", orcid: "0009-0007-3157-6140" },
    { ini: "ZR", corto: "Zahira", nombre: "Zahira Rodríguez Bautista", rol: "Gestión y seguimiento de proyectos",
      titulo: "Administradora de Empresas (UPTC)",
      respaldo: "Coautora de 2 artículos · joven investigadora VIE-UPTC y apoyo OTRI · cofundadora Surco AgTech", orcid: "0009-0004-4188-8488" },
    { ini: "SS", corto: "Stiven", nombre: "Stiven Santana", rol: "Agronomía y territorio · enfoque en papa",
      titulo: "Ing. Agrónomo y Esp. en Desarrollo Territorial (UPTC)" },
    { ini: "FS", corto: "Faiver", nombre: "Faiver Salcedo", rol: "Agronomía y territorio · enfoque en arándano",
      titulo: "Ing. Agrónomo y Esp. en Desarrollo Territorial (UPTC)" }
  ],

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

  cartillas: [
    { anio: 2024, ed: "Editorial UPTC", equipo: ["Diego Sanabria", "Zahira Rodríguez"],
      titulo: "Proyectos productivos sostenibles de jóvenes rurales: un ejercicio de emprendimiento en el municipio de Motavita",
      url: "https://repositorio.uptc.edu.co/entities/publication/c0bc5a12-31b9-46a8-9a45-3db98e9f27ac" },
    { anio: 2022, ed: "Repositorio UPTC", equipo: ["Diego Sanabria"],
      titulo: "Plan de manejo tecnológico del cultivo de la pitahaya",
      url: "https://repositorio.uptc.edu.co/bitstream/001/9055/1/Plan_manejo_tecnologico_cultivo_pitahaya.pdf" }
  ],

  /* cifras: ya no se muestran en la web (26/11/2026); se conservan como registro */
  cifras: [
    { n: 10000, sufijo: "+", etiqueta: "registros gestionados", fuente: "OCITEB · UPTC" },
    { n: 12, sufijo: "", etiqueta: "reportes bibliométricos", fuente: "OCITEB · UPTC" },
    { n: 4, sufijo: "", etiqueta: "sedes consolidadas", fuente: "UPTC" },
    { n: 300, sufijo: "+", etiqueta: "productores en talleres", fuente: "Epsea · ADR" },
    { n: 4, sufijo: "", etiqueta: "cultivos con IA por imagen", fuente: "Surco AgTech" },
    { n: 120, sufijo: "", etiqueta: "unidades en ensayo propio", fuente: "UPTC · CIDE" }
  ],

  testimonios: [],
  testimoniosDemo: [
    { cita: "Aquí irá, con su permiso, la frase textual de quien trabajó con el equipo.", nombre: "Nombre y apellido", rol: "Tesista · Universidad", servicio: "estadistica" },
    { cita: "Una frase corta sobre qué cambió: tiempo ahorrado, resultado aprobado, decisión tomada.", nombre: "Nombre y apellido", rol: "Directora de grupo de investigación", servicio: "cienciometria" },
    { cita: "Mejor si menciona el entregable concreto, el plazo y el resultado.", nombre: "Nombre y apellido", rol: "Asociación de productores", servicio: "proyectos" }
  ]
};
