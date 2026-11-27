/* Consultoría · «Cómo trabajamos»: recorrido por fases con un diorama isométrico en SVG.
   El texto de cada fase sale de la lista <ol class="pasos"> (que queda como respaldo sin JS y al imprimir).
   El desplazamiento dentro de la pista elige la fase; el escenario cambia con data-paso. Sin dependencias. */
(function () {
  "use strict";
  var sec = document.getElementById("proceso");
  var pista = sec && sec.querySelector(".pr-pista");
  var lista = sec && sec.querySelector("ol.pasos");
  if (!pista || !lista || !window.matchMedia) return;
  var NS = "http://www.w3.org/2000/svg";
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  function el(tag, a, p, txt) {
    var n = document.createElementNS(NS, tag);
    for (var k in a) n.setAttribute(k, a[k]);
    if (txt != null) n.textContent = txt;
    if (p) p.appendChild(n);
    return n;
  }
  function g(p, cls) { return el("g", cls ? { "class": cls } : {}, p); }

  /* ---------- proyección isométrica ---------- */
  var S = 22, CX = 400, CY = 318;
  function iso(x, y, z) { return [CX + (x - y) * S * 0.866, CY + (x + y) * S * 0.5 - (z || 0) * S]; }
  function pts(l) { return l.map(function (p) { var q = iso(p[0], p[1], p[2]); return q[0].toFixed(1) + "," + q[1].toFixed(1); }).join(" "); }
  function poly(p, l, a) { a = a || {}; a.points = pts(l); return el("polygon", a, p); }
  /* caja: tapa, cara izquierda (y máx.) y cara derecha (x máx.) */
  function caja(p, x, y, z, w, d, h, c) {
    poly(p, [[x, y + d, z], [x + w, y + d, z], [x + w, y + d, z + h], [x, y + d, z + h]], { fill: c[1] });
    poly(p, [[x + w, y, z], [x + w, y + d, z], [x + w, y + d, z + h], [x + w, y, z + h]], { fill: c[2] });
    poly(p, [[x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h]], { fill: c[0] });
  }
  function circuloIso(cx, cy, z, r, n) {
    var d = "";
    for (var i = 0; i <= n; i++) { var t = i / n * Math.PI * 2, q = iso(cx + r * Math.cos(t), cy + r * Math.sin(t), z); d += (i ? "L" : "M") + q[0].toFixed(1) + " " + q[1].toFixed(1); }
    return d + "Z";
  }
  /* rótulo en píldora. colocarEtq lo (re)coloca: f = escala (1 = 11,5 px); minX/maxX = bordes visibles.
     El ancho sale del texto medido cuando se puede (getComputedTextLength); si no, de una estimación. */
  function etiqueta(p, x, y, txt, ancla) {
    var e = g(p, "pr-etq");
    el("rect", {}, e);
    el("text", { "text-anchor": "middle" }, e, txt);
    colocarEtq(e, x, y, ancla, 1);
    return e;
  }
  function colocarEtq(e, x, y, ancla, f, minX, maxX) {
    var r = e.firstChild, t = e.lastChild;
    t.style.fontSize = f !== 1 ? (11.5 * f) + "px" : "";
    var tw = 0; try { tw = t.getComputedTextLength(); } catch (err) {}
    var w = (tw > 0 ? tw : t.textContent.length * 6.6 * f) + 22 * f;
    var gx = ancla === "fin" ? x - w : ancla === "medio" ? x - w / 2 : x;
    if (maxX != null && gx + w > maxX) gx = maxX - w;
    if (minX != null && gx < minX) gx = minX;
    r.setAttribute("x", gx); r.setAttribute("y", y - 12 * f); r.setAttribute("width", w);
    r.setAttribute("height", 24 * f); r.setAttribute("rx", 12 * f);
    t.setAttribute("x", gx + w / 2); t.setAttribute("y", y + 4 * f);
  }
  /* teléfono: número junto al objeto (en pMarca, se mueve con él) y fila de leyenda bajo el diorama (en pLey) */
  function marcaLey(pMarca, mx, my, pLey, num, fila, nombre) {
    el("circle", { cx: mx, cy: my, r: 11, "class": "pr-capa-num" }, pMarca);
    el("text", { x: mx, y: my + 4.5, "class": "pr-capa-num-t", "text-anchor": "middle" }, pMarca, num);
    leyenda.push({ fila: fila,
      c: el("circle", { "class": "pr-capa-num" }, pLey),
      n: el("text", { "class": "pr-capa-num-t", "text-anchor": "middle" }, pLey, num),
      t: el("text", { "class": "pr-capa-ley" }, pLey, nombre) });
  }
  var semilla = 7;
  function azar() { semilla = (semilla * 16807) % 2147483647; return (semilla - 1) / 2147483646; }

  /* ---------- texto de las fases desde la lista ---------- */
  var fases = [].map.call(lista.querySelectorAll("li"), function (li) {
    return { t: li.querySelector("h3").textContent, p: li.querySelector("p").textContent };
  });
  var n = fases.length;

  /* ---------- recorrido por perfil (mismo perfil que el embudo) ----------
     Cada fase propone el servicio que la respalda; las acciones son WhatsApp (canal principal en Colombia)
     y «Ver entregable», que deja el embudo con perfil y necesidad ya marcados. */
  var D = window.CONSULTORIA || { servicios: [], lineas: {}, contacto: {} };
  var PERFILES = {
    productor: {
      serv: ["geomatica", "ia", "surco", "bpa"],
      /* la prueba de cada fase en la misma página: el ciclo sirve de índice sin encerrar el contenido */
      prueba: [["laboratorio.html#ideam", "Ver mapas en vivo"], ["equipo.html#evidencia", "Ver publicaciones"], ["#surco", "Conocer Surco"], ["#contacto", "Ir al contacto"]],
      cta: "Quiero mi diagnóstico de finca",
      hitos: ["Visita", "Reporte BPA o EUDR", "Ajuste del plan"]
    },
    empresarial: {
      fases: [
        ["Diagnóstico", "Levantamos el estado de sus fincas o asociados: dron, suelo y registros."],
        ["Análisis y plan", "Indicadores por finca, lote y hato en un tablero, con un plan y metas para la organización."],
        ["Implementación de app", "Surco configurado para su organización: fincas, técnicos con roles y tablero gerencial."],
        ["Acompañamiento", "Reportes consolidados BPA o EUDR para compradores y auditorías, y ajuste del plan."]
      ],
      serv: ["geomatica", "tableros", "surco", "bpa"],
      prueba: [["laboratorio.html#eudr", "Pruebe el validador EUDR"], ["equipo.html#evidencia", "Ver publicaciones"], ["#surco", "Conocer Surco"], ["#contacto", "Ir al contacto"]],
      cta: "Quiero el diagnóstico de mi organización",
      tel: { tit: "Organización", sub: "3 fincas · 1 hato", filas: ["Finca 1", "Finca 2", "Finca 3", "Hato"], datos: ["BPA al día", "Riego hoy", "EUDR listo", "12 bovinos"], alerta: "Reporte comprador" },
      hitos: ["Comité", "Reporte consolidado", "Auditoría"],
      fun: [
        ["foto", "Diagnóstico por foto", "Sin internet, en 4 cultivos", 0],
        ["gota", "Riego y clima", "Balance hídrico por lote", 0],
        ["doc", "Cuaderno BPA y EUDR", "Reportes en PDF", 0],
        ["moneda", "Tablero gerencial", "Varias fincas y roles", 0],
        ["kg", "Peso por foto", "Bovinos y porcinos", 1],
        ["hato", "Hato y sanidad", "Vacunas y reproducción", 1]
      ]
    },
    academica: {
      fases: [
        ["Diagnóstico", "Revisamos el estado del arte, definimos su pregunta y el diseño de muestreo."],
        ["Análisis", "Estadística en R, modelos PLS-SEM y figuras listas para publicación."],
        ["Entrega reproducible", "Código, base de datos depurada con su diccionario, tablas y figuras."],
        ["Acompañamiento", "Hasta la sustentación y la respuesta a revisores."]
      ],
      serv: ["cienciometria", "estadistica", "gobernanza", "proyectos"],
      prueba: [["#equipo", "Conocer al equipo"], ["laboratorio.html#iguaque", "Ver un estudio longitudinal"], ["equipo.html#evidencia", "Ver publicaciones"], ["#contacto", "Ir al contacto"]],
      cta: "Quiero asesoría para mi investigación",
      titulo: "De la pregunta a la publicación",
      sub: "Cuatro fases. Al final usted se queda con un análisis reproducible: código, base depurada, tablas y figuras.",
      pec: false,
      capas: ["Diseño experimental", "Estadística en R", "Modelos PLS-SEM", "Figuras y tablas"],
      tel: { tit: "Ensayo", sub: "3 tratamientos · testigo", filas: ["T1", "T2", "T3", "Testigo"], datos: ["Datos al día", "Datos al día", "Datos al día", "Datos al día"], alerta: "Base depurada" },
      hitos: ["Revisión", "Respuesta a revisores", "Sustentación"],
      grupos: ["ENTREGABLES", null],
      fun: [
        ["doc", "Código en R", "Análisis reproducible", 0],
        ["doc", "Base depurada", "Con diccionario de datos", 0],
        ["doc", "Tablas y figuras", "Listas para publicación", 0],
        ["doc", "Sustentación", "Acompañamiento final", 0]
      ],
      ind: false
    }
  };
  var perfil = "productor";
  function textos() { var f = PERFILES[perfil].fases; return f ? f.map(function (x) { return { t: x[0], p: x[1] }; }) : fases; }
  function servDe(id) { return (D.servicios || []).filter(function (s) { return s.id === id; })[0]; }

  pista.innerHTML =
    '<div class="pr-fijo">' +
      '<div class="pr-perfil" role="radiogroup" aria-label="Recorrido para"><span>Recorrido para</span></div>' +
      '<div class="pr-escena" data-paso="0" aria-hidden="true"></div>' +
      '<div class="pr-panel">' +
        '<div class="pr-meta"><p class="pr-num"><b>01</b><span> / ' + ("0" + n).slice(-2) + '</span></p>' +
          '<div class="pr-prog" role="group" aria-label="Ir a una fase"></div></div>' +
        '<div class="pr-fases"></div>' +
        '<aside class="pr-serv" aria-live="polite"></aside>' +
      '</div>' +
      '<p class="pr-vivo" aria-live="polite"></p>' +
    '</div>';
  var escena = pista.querySelector(".pr-escena"), prog = pista.querySelector(".pr-prog"),
      cajaF = pista.querySelector(".pr-fases"), num = pista.querySelector(".pr-num b"), vivo = pista.querySelector(".pr-vivo");
  var barras = fases.map(function (f, i) {
    var b = document.createElement("button");
    b.type = "button"; b.setAttribute("aria-label", "Fase " + (i + 1) + ": " + f.t);
    b.innerHTML = "<span></span>";
    b.addEventListener("click", function () { irA(i); });
    prog.appendChild(b);
    var a = document.createElement("article");
    a.className = "pr-fase";
    a.innerHTML = "<h3></h3><p></p>";
    a.querySelector("h3").textContent = f.t; a.querySelector("p").textContent = f.p;
    cajaF.appendChild(a);
    return b;
  });
  var arts = [].slice.call(cajaF.children);
  var cajaS = pista.querySelector(".pr-serv"), cajaP = pista.querySelector(".pr-perfil");

  /* selector de perfil dentro del escenario fijo */
  var botonesP = Object.keys(PERFILES).map(function (id) {
    var b = document.createElement("button");
    b.type = "button"; b.setAttribute("role", "radio"); b.dataset.perfil = id;
    b.textContent = (D.lineas[id] && D.lineas[id].texto) || id;
    b.addEventListener("click", function () { aplicarPerfil(id, true); });
    cajaP.appendChild(b);
    return b;
  });

  /* tarjeta del servicio de la fase: entregable y acciones */
  function waLink(txt) { return "https://wa.me/" + (D.contacto.whatsapp || "") + "?text=" + encodeURIComponent(txt); }
  function servicio(i) {
    var s = servDe(PERFILES[perfil].serv[i]); if (!s) { cajaS.innerHTML = ""; return; }
    var f = textos()[i], quien = (D.lineas[perfil] && D.lineas[perfil].frase) || "";
    var msg = "Hola, equipo de Consultoría. Soy " + quien + ". Vi la fase «" + f.t + "» y me interesa: " + s.titulo + ".";
    cajaS.innerHTML = '<p class="k">Servicio de esta fase</p><h4></h4><p class="e"></p>' +
      '<div class="acc"><a class="boton boton-chico pr-wa" target="_blank" rel="noopener">Escribir por WhatsApp</a>' +
      '<button type="button" class="pr-ver">Ver entregable</button>' +
      (PERFILES[perfil].prueba ? '<a class="pr-ver pr-lab" data-evento="prueba"></a>' : '') + '</div>';
    cajaS.querySelector("h4").textContent = s.titulo;
    cajaS.querySelector(".e").textContent = s.entrega;
    cajaS.querySelector(".pr-wa").href = waLink(msg);
    var pr = PERFILES[perfil].prueba, lab = cajaS.querySelector(".pr-lab");
    if (pr && lab) { lab.href = pr[i][0]; lab.textContent = pr[i][1]; }
    cajaS.querySelector(".pr-ver").addEventListener("click", function () {
      var E = window.consultoriaEmbudo; if (!E) return;
      E.linea(perfil); E.servicio(s.id);
      var b = document.getElementById("buscador"); if (b) b.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    });
  }

  function aplicarPerfil(id, desdeAqui) {
    if (!PERFILES[id]) return;
    var cambia = id !== perfil;
    perfil = id;
    botonesP.forEach(function (b) { b.setAttribute("aria-checked", b.dataset.perfil === id ? "true" : "false"); });
    textos().forEach(function (f, k) {
      arts[k].querySelector("h3").textContent = f.t; arts[k].querySelector("p").textContent = f.p;
      barras[k].setAttribute("aria-label", "Fase " + (k + 1) + ": " + f.t);
    });
    var cta = sec.querySelector(".cierre-acc .boton");
    if (cta) cta.firstChild.textContent = PERFILES[id].cta + " ";
    /* título y subtítulo: los del HTML salvo que el perfil traiga los suyos (Investigación) */
    var h2 = sec.querySelector(".cab h2"), sub = sec.querySelector(".cab .sub");
    if (h2 && !h2.dataset.base) { h2.dataset.base = h2.textContent; sub.dataset.base = sub.firstChild.textContent; }
    if (h2) { h2.textContent = PERFILES[id].titulo || h2.dataset.base; sub.firstChild.textContent = PERFILES[id].sub ? PERFILES[id].sub + " " : sub.dataset.base; }
    if (desdeAqui && window.consultoriaEmbudo) window.consultoriaEmbudo.linea(id);
    if (cambia && typeof escenaSVG === "function" && escena.firstChild) { escenaSVG(); actual = -1; medir(); }
  }

  /* ---------- el diorama (apaisado; en pantallas angostas, vertical) ---------- */
  var estrecho = null, RUTA = null, rastro = null, vuelo = null, leyenda = [], etqMovil = [];
  /* teléfono: leyendas de las fases 1 y 2 (letra de al menos 12 px en pantalla) y rótulos de la fase 4 (unos 10 px),
     medidos con el tamaño real del SVG (en pantallas bajas manda el alto, el diorama se encoge y sobra ancho) */
  function ajustarLeyenda() {
    if (!leyenda.length && !etqMovil.length) return;
    var svg = escena.querySelector("svg"), r = svg && svg.getBoundingClientRect(), esc = 0;
    if (r && r.width > 0 && r.height > 0) esc = Math.min(r.width / 464, r.height / 740);
    var f = esc ? Math.max(17, 12 / esc) : 17;
    var fe = esc ? Math.min(1.6, Math.max(1, 10.5 / (11.5 * esc))) : 1;
    var minX = esc ? 400 - r.width / esc / 2 + 4 : 172, maxX = esc ? 400 + r.width / esc / 2 - 4 : 628;
    etqMovil.forEach(function (m) { colocarEtq(m.e, m.x, m.y, m.ancla, fe, minX, maxX); });
    var paso = Math.max(40, f * 1.5), x = Math.min(262, 400 - f * 7);
    leyenda.forEach(function (l) {
      var y = 492 + l.fila * paso;
      l.c.setAttribute("cx", x); l.c.setAttribute("cy", y); l.c.setAttribute("r", f * 0.76);
      l.n.setAttribute("x", x); l.n.setAttribute("y", y + f * 0.3); l.n.style.fontSize = (f * 0.82) + "px";
      l.t.setAttribute("x", x + f * 1.4); l.t.setAttribute("y", y + f * 0.38); l.t.style.fontSize = f + "px";
    });
  }
  function volar(t) {
    if (!vuelo) return;
    var tramos = [], tot = 0;
    for (var i = 1; i < RUTA.length; i++) { var l = Math.hypot(RUTA[i][0] - RUTA[i - 1][0], RUTA[i][1] - RUTA[i - 1][1]); tramos.push(l); tot += l; }
    var d = t * tot, k = 0;
    while (k < tramos.length - 1 && d > tramos[k]) { d -= tramos[k]; k++; }
    var f = Math.min(1, d / tramos[k]), u = RUTA[k][0] + (RUTA[k + 1][0] - RUTA[k][0]) * f, v = RUTA[k][1] + (RUTA[k + 1][1] - RUTA[k][1]) * f;
    vuelo.setAttribute("transform", "translate(" + ((u - v) * S * 0.866).toFixed(1) + " " + ((u + v) * S * 0.5).toFixed(1) + ")");
    rastro.style.strokeDashoffset = (1 - t).toFixed(4);
  }
  function escenaSVG() {
  var PF = PERFILES[perfil];
  estrecho = innerWidth < 640;
  semilla = 7;
  escena.innerHTML = "";
  var svg = el("svg", { viewBox: estrecho ? "168 26 464 740" : "0 58 800 462", preserveAspectRatio: "xMidYMid meet" }, escena);
  /* si se redibuja fuera de pantalla, nace en pausa (app.js, pausarFuera, la reanuda al volver) */
  if (sec.classList.contains("fuera") && svg.pauseAnimations) svg.pauseAnimations();
  leyenda = []; etqMovil = [];
  var defs = el("defs", {}, svg);
  var rg = el("radialGradient", { id: "pr-halo" }, defs);
  el("stop", { offset: "0", "stop-color": "#5ad69a", "stop-opacity": ".22" }, rg);
  el("stop", { offset: "1", "stop-color": "#5ad69a", "stop-opacity": "0" }, rg);

  /* fondo: puntos y halo */
  var fondo = g(svg, "pr-fondo");
  for (var fx = 40; fx < 800; fx += 40) for (var fy = 30; fy < 520; fy += 40) el("circle", { cx: fx, cy: fy, r: 1.1 }, fondo);
  el("ellipse", { cx: CX, cy: CY + 20, rx: 330, ry: 190, fill: "url(#pr-halo)" }, svg);

  /* fase 4 (detrás): mitad trasera del ciclo de seguimiento */
  var R = 8, rx = 1.2247 * R * S, ry = 0.7071 * R * S;
  var f3atras = g(svg, "pr-f pr-f3");
  el("path", { d: "M" + (CX - rx) + " " + CY + "A" + rx + " " + ry + " 0 0 1 " + (CX + rx) + " " + CY, "class": "pr-anillo pr-anillo-atras" }, f3atras);

  /* sombra y bloque de suelo con estratos */
  el("ellipse", { cx: CX, cy: CY + 150, rx: 230, ry: 34, "class": "pr-sombra" }, svg);
  var suelo = g(svg, "pr-suelo");
  var estratos = [[-1.3, 0.45, "#3d2c14", "#2f220f"], [-0.85, 0.45, "#6b4f26", "#523c1c"], [-0.4, 0.4, "#8a6a32", "#6d5326"]];
  estratos.forEach(function (e) { caja(suelo, -5, -5, e[0], 10, 10, e[1], ["#8a6a32", e[2], e[3]]); });
  poly(suelo, [[-5, -5, 0], [5, -5, 0], [5, 5, 0], [-5, 5, 0]], { fill: "#c9b98a" });   /* caminos */

  var LOTES = [
    { x: -4.7, y: -4.7, w: 4.2, d: 4.2, c: "#1d7a4e" },
    { x: 0.5, y: -4.7, w: 4.2, d: 4.2, c: "#237f52" },
    { x: -4.7, y: 0.5, w: 4.2, d: 4.2, c: "#18673f" },
    { x: 0.5, y: 0.5, w: 4.2, d: 4.2, c: "#5f9e4c", pasto: true }
  ];
  var gLotes = g(svg, "pr-lotes");
  LOTES.forEach(function (l) { poly(gLotes, [[l.x, l.y, 0.02], [l.x + l.w, l.y, 0.02], [l.x + l.w, l.y + l.d, 0.02], [l.x, l.y + l.d, 0.02]], { fill: l.c }); });
  /* contorno de lotes (se ilumina en la fase de la app) */
  var gContorno = g(svg, "pr-f pr-f2 pr-contornos");
  LOTES.forEach(function (l, i) {
    poly(gContorno, [[l.x, l.y, 0.03], [l.x + l.w, l.y, 0.03], [l.x + l.w, l.y + l.d, 0.03], [l.x, l.y + l.d, 0.03]], { "class": "pr-contorno" });
  });

  /* plantas por hileras, ordenadas para pintar de atrás hacia adelante */
  var plantas = [];
  LOTES.forEach(function (l) {
    if (l.pasto) return;
    for (var px = l.x + 0.6; px < l.x + l.w; px += 1.0) for (var py = l.y + 0.6; py < l.y + l.d; py += 1.05) plantas.push([px, py]);
  });
  plantas.sort(function (a, b) { return (a[0] + a[1]) - (b[0] + b[1]); });
  var gPl = g(svg, "pr-plantas");
  plantas.forEach(function (p, i) {
    var q = iso(p[0], p[1], 0), pg = g(gPl, "pr-planta");
    pg.style.transitionDelay = (i % 9) * 0.03 + "s";
    el("ellipse", { cx: q[0] + 3, cy: q[1] + 1, rx: 7, ry: 3.2, fill: "rgba(0,0,0,.28)" }, pg);
    el("path", { d: "M" + q[0] + " " + q[1] + "l0 -7", stroke: "#3d2c14", "stroke-width": 1.6 }, pg);
    el("circle", { cx: q[0], cy: q[1] - 11, r: 6.6, fill: "#2a9a62" }, pg);
    el("circle", { cx: q[0] - 1.8, cy: q[1] - 13, r: 3.4, fill: "#5ad69a", opacity: ".85" }, pg);
  });

  var gPot = g(svg, "pr-potrero"), P = LOTES[3];
  for (var hb = 0; hb < 34; hb++) {
    var hq = iso(P.x + 0.3 + azar() * (P.w - 0.6), P.y + 0.3 + azar() * (P.d - 0.6), 0.02);
    el("path", { d: "M" + (hq[0] - 3) + " " + hq[1] + "l2 -5l1 5l2 -4l1 4", "class": "pr-hierba" }, gPot);
  }
  var cerca = [[P.x + .1, P.y + .1], [P.x + P.w - .1, P.y + .1], [P.x + P.w - .1, P.y + P.d - .1], [P.x + .1, P.y + P.d - .1]];
  el("polygon", { points: pts(cerca.map(function (c) { return [c[0], c[1], 0.35]; })), "class": "pr-cerca" }, gPot);
  for (var ci = 0; ci < 4; ci++) for (var cs = 0; cs < 4; cs++) {
    var c0 = cerca[ci], c1 = cerca[(ci + 1) % 4], f = cs / 4, cx = c0[0] + (c1[0] - c0[0]) * f, cyy = c0[1] + (c1[1] - c0[1]) * f;
    var a0 = iso(cx, cyy, 0), a1 = iso(cx, cyy, 0.45);
    el("line", { x1: a0[0], y1: a0[1], x2: a1[0], y2: a1[1], "class": "pr-poste" }, gPot);
  }
  function vaca(x, y, flip) {
    var q = iso(x, y, 0), s = flip ? -1 : 1, v = g(gPot, "pr-vaca");
    el("ellipse", { cx: q[0], cy: q[1] + 1, rx: 13, ry: 3.6, fill: "rgba(0,0,0,.3)" }, v);
    [-7, -3, 4, 8].forEach(function (dx) { el("line", { x1: q[0] + dx * s, y1: q[1] - 6, x2: q[0] + dx * s, y2: q[1], stroke: "#2b2b26", "stroke-width": 2, "stroke-linecap": "round" }, v); });
    el("ellipse", { cx: q[0], cy: q[1] - 10, rx: 11.5, ry: 6.5, fill: "#f3f1ea", stroke: "#0e1512", "stroke-width": 1 }, v);
    el("ellipse", { cx: q[0] - 4 * s, cy: q[1] - 12, rx: 3.6, ry: 2.6, fill: "#22221f" }, v);
    el("ellipse", { cx: q[0] + 4 * s, cy: q[1] - 8, rx: 2.6, ry: 2, fill: "#22221f" }, v);
    el("ellipse", { cx: q[0] + 12 * s, cy: q[1] - 13, rx: 4.6, ry: 4, fill: "#f3f1ea", stroke: "#0e1512", "stroke-width": 1 }, v);
    el("ellipse", { cx: q[0] + 15 * s, cy: q[1] - 11.5, rx: 2.4, ry: 1.8, fill: "#d9a79a" }, v);
  }
  vaca(1.7, 1.6, false); vaca(3.5, 2.6, true); vaca(2.0, 3.6, false);

  /* ===== fase 1: diagnóstico (el dron recorre el cultivo al ritmo del desplazamiento) ===== */
  var f0 = g(svg, "pr-f pr-f0");
  RUTA = [[-2.9, -2.9], [2.9, -2.9], [2.9, -0.15], [-2.9, -0.15], [-2.9, 2.6], [2.9, 2.6]];
  rastro = el("polyline", { points: pts(RUTA.map(function (q) { return [q[0], q[1], 0.06]; })), pathLength: 1, "class": "pr-rastro" }, f0);
  /* barreno y núcleo de suelo (debajo del vuelo) */
  var bq = iso(-3.4, 3.6, 0);
  el("line", { x1: bq[0], y1: bq[1] + 6, x2: bq[0], y2: bq[1] - 46, stroke: "#e9eee9", "stroke-width": 3, "stroke-linecap": "round" }, f0);
  el("line", { x1: bq[0] - 10, y1: bq[1] - 46, x2: bq[0] + 10, y2: bq[1] - 46, stroke: "#e9eee9", "stroke-width": 3, "stroke-linecap": "round" }, f0);
  var nucleo = g(f0, "pr-nucleo");
  caja(nucleo, -1.9, 4.6, 0.02, 0.7, 0.7, 0.45, ["#8a6a32", "#6b4f26", "#523c1c"]);
  caja(nucleo, -1.9, 4.6, 0.47, 0.7, 0.7, 0.45, ["#a3814a", "#8a6a32", "#6d5326"]);
  caja(nucleo, -1.9, 4.6, 0.92, 0.7, 0.7, 0.35, ["#4a8a52", "#3d2c14", "#2f220f"]);
  var reg = iso(4.2, 4.6, 0);
  if (!estrecho) {
    etiqueta(f0, bq[0] - 16, bq[1] - 60, "Muestra de suelo", "fin");
    etiqueta(f0, reg[0] + 34, reg[1] + 26, "Revisión de registros");
  } else {
    marcaLey(f0, bq[0] - 20, bq[1] - 46, f0, "2", 1, "Muestra de suelo");
    marcaLey(f0, reg[0] + 24, reg[1] + 22, f0, "3", 2, "Revisión de registros");
  }
  /* el vuelo se dibuja centrado en (0, 0) y se traslada en pantalla: la proyección es lineal */
  vuelo = g(f0, "pr-vuelo");
  var hz = 1.5, huella = [[-hz, -hz, 0.05], [hz, -hz, 0.05], [hz, hz, 0.05], [-hz, hz, 0.05]];
  var dp = iso(0, 0, 7);
  huella.forEach(function (h, i) {
    var a = iso(h[0], h[1], h[2]), b = iso(huella[(i + 1) % 4][0], huella[(i + 1) % 4][1], 0.05);
    el("polygon", { points: dp[0] + "," + dp[1] + " " + a[0] + "," + a[1] + " " + b[0] + "," + b[1], "class": "pr-cono" }, vuelo);
  });
  poly(vuelo, huella, { "class": "pr-huella" });
  var barrido = el("polyline", { points: pts([[-hz, -hz, 0.06], [-hz, hz, 0.06]]), "class": "pr-barrido" }, vuelo);
  barrido.style.setProperty("--bx", (2 * hz * S * 0.866).toFixed(1) + "px");
  barrido.style.setProperty("--by", (2 * hz * S * 0.5).toFixed(1) + "px");
  var dron = g(vuelo, "pr-dron");
  [[-26, -6], [26, -6], [-18, 8], [18, 8]].forEach(function (o) {
    el("line", { x1: dp[0], y1: dp[1], x2: dp[0] + o[0], y2: dp[1] + o[1], stroke: "#cfd8d1", "stroke-width": 3, "stroke-linecap": "round" }, dron);
    el("ellipse", { cx: dp[0] + o[0], cy: dp[1] + o[1] - 3, rx: 13, ry: 3.2, "class": "pr-helice" }, dron);
  });
  el("rect", { x: dp[0] - 13, y: dp[1] - 8, width: 26, height: 14, rx: 5, fill: "#e9eee9" }, dron);
  el("rect", { x: dp[0] - 13, y: dp[1] + 2, width: 26, height: 4, rx: 2, fill: "#9aa59c" }, dron);
  el("circle", { cx: dp[0], cy: dp[1] + 8, r: 3.4, fill: "#0e1512", stroke: "#5ad69a", "stroke-width": 1.5 }, dron);
  el("circle", { cx: dp[0] + 8, cy: dp[1] - 3, r: 1.8, "class": "pr-led" }, dron);
  if (!estrecho) etiqueta(vuelo, dp[0] + 40, dp[1] - 22, "Vuelo de dron");
  else marcaLey(vuelo, dp[0] + 34, dp[1] - 16, f0, "1", 0, "Vuelo de dron");

  /* ===== fase 2: análisis (cuatro capas de decisión que se elevan) ===== */
  var f1 = g(svg, "pr-f pr-f1");
  [[-5, -5], [5, -5], [5, 5], [-5, 5]].forEach(function (c) {
    var a = iso(c[0] * 0.74, c[1] * 0.74, 0.1), b = iso(c[0] * 0.74, c[1] * 0.74, 6.9);
    el("line", { x1: a[0], y1: a[1], x2: b[0], y2: b[1], "class": "pr-guia" }, f1);
  });
  var capas = PF.pec !== false ? [
    { z: 1.3, t: "Nutrición y Riego" }, { z: 2.7, t: "Plagas y Enfermedades" }, { z: 4.1, t: "Podas" },
    { z: 5.5, t: "Hato y pastos", hato: true }, { z: 6.9, t: "Proyecciones" }
  ] : [
    { z: 1.5, t: "Nutrición y Riego" }, { z: 3.3, t: "Plagas y Enfermedades" },
    { z: 5.1, t: "Podas" }, { z: 6.9, t: "Proyecciones" }
  ];
  var SEC = ["#14633f", "#1d7a4e", "#2f8f5e", "#5ab07f", "#a9c98f", "#d8c78a"];
  capas.forEach(function (cp, k) {
    var cg = g(f1, "pr-capa");
    cg.style.transitionDelay = (0.08 + k * 0.14) + "s";
    var lim = 3.7, z = cp.z;
    poly(cg, [[-lim, -lim, z], [lim, -lim, z], [lim, lim, z], [-lim, lim, z]], { "class": "pr-plano" });
    if (k === 0) {            /* nutrición y riego: mapa de calor por celdas y gotas */
      var paso = 2 * lim / 6;
      for (var i = 0; i < 6; i++) for (var j = 0; j < 6; j++) {
        var x0 = -lim + i * paso, y0 = -lim + j * paso, v = Math.min(5, Math.floor(azar() * 3 + (i + j) / 3.4));
        poly(cg, [[x0 + .06, y0 + .06, z], [x0 + paso - .06, y0 + .06, z], [x0 + paso - .06, y0 + paso - .06, z], [x0 + .06, y0 + paso - .06, z]], { fill: SEC[v], opacity: ".9" });
      }
      [[-1.9, -1.0], [1.4, -2.2], [0.5, 1.9]].forEach(function (c) {
        var q = iso(c[0], c[1], z);
        el("path", { d: "M" + q[0] + " " + (q[1] - 16) + "c5 7 7 10 7 13a7 7 0 0 1 -14 0c0 -3 2 -6 7 -13z", "class": "pr-gota" }, cg);
      });
    } else if (k === 1) {     /* plagas y enfermedades: focos con su radio de vigilancia */
      [[-1.8, -1.4, 0.8], [1.6, 0.9, 0.65], [-0.4, 2.2, 0.5]].forEach(function (f) {
        el("path", { d: circuloIso(f[0], f[1], z, f[2] * 1.9, 40), "class": "pr-foco-r" }, cg);
        el("path", { d: circuloIso(f[0], f[1], z, f[2], 40), "class": "pr-foco" }, cg);
      });
      for (var m = 0; m < 16; m++) { var q = iso(-3.3 + azar() * 6.6, -3.3 + azar() * 6.6, z); el("circle", { cx: q[0], cy: q[1], r: 1.6, "class": "pr-insecto" }, cg); }
    } else if (k === 2) {     /* podas: copas por planta, algunas marcadas para podar */
      for (var a = -3.0; a <= 3.1; a += 1.2) for (var b = -3.0; b <= 3.1; b += 1.2) {
        var q2 = iso(a, b, z), marca = azar() < 0.22;
        el("ellipse", { cx: q2[0], cy: q2[1], rx: 7, ry: 4, "class": "pr-copa" }, cg);
        if (marca) el("ellipse", { cx: q2[0], cy: q2[1], rx: 11, ry: 6.4, "class": "pr-copa-m" }, cg);
      }
    } else if (cp.hato) {     /* hato y pastos: cuatro potreros de rotación por aforo y el hato pastando */
      var AFORO = ["#5ab07f", "#a9c98f", "#d8c78a", "#2f8f5e"], cerca = 0.08;
      [[-lim, -lim], [0, -lim], [-lim, 0], [0, 0]].forEach(function (o, n) {
        poly(cg, [[o[0] + cerca, o[1] + cerca, z], [o[0] + lim - cerca, o[1] + cerca, z], [o[0] + lim - cerca, o[1] + lim - cerca, z], [o[0] + cerca, o[1] + lim - cerca, z]],
          { fill: AFORO[n], opacity: ".9" });
      });
      [[1.0, 0.9], [2.3, 1.4], [1.5, 2.4], [2.7, 2.7], [0.9, 2.0]].forEach(function (v, n) {
        var q = iso(v[0], v[1], z);
        if (n === 1) el("ellipse", { cx: q[0], cy: q[1], rx: 12, ry: 6, "class": "pr-vaca-anillo" }, cg);
        el("ellipse", { cx: q[0], cy: q[1] - 2, rx: 5.5, ry: 3.2, "class": "pr-vaca-c" }, cg);
      });
    } else {                  /* proyecciones: barras por zona */
      var alturas = [0.35, 0.6, 0.5, 0.8, 1.0, 0.7, 0.55, 0.9, 1.2];
      for (var c2 = 0; c2 < 9; c2++) {
        var bx = -2.9 + (c2 % 3) * 2.1, by = -2.9 + Math.floor(c2 / 3) * 2.1;
        caja(cg, bx, by, z, 1.0, 1.0, alturas[c2], ["#7be3b0", "#2f8f5e", "#1d6b45"]);
      }
    }
    var izq = iso(-lim, lim, z);
    var nombre = PF.capas ? PF.capas[k] : cp.t;
    if (!estrecho) etiqueta(cg, izq[0] - 12, izq[1] - 4, nombre, "fin");
    else {
      /* teléfono: a la izquierda de las capas no cabe el rótulo (el dibujo llena el ancho). Cada capa lleva un número
         en su punta y la leyenda va debajo del diorama, en el espacio que esta fase deja libre (1 = capa de arriba) */
      marcaLey(cg, izq[0] - 12, izq[1], cg, String(capas.length - k), capas.length - 1 - k, nombre);
    }
  });

  /* ===== fase 2 (pecuario): marcos de aforo y anillos en el potrero, bajo la capa «Hato y pastos» ===== */
  if (PF.pec !== false) {
    var fp = g(svg, "pr-f pr-f1");
    [[1.0, 1.0], [3.85, 1.25], [3.0, 3.95]].forEach(function (m, i) {
      var lado = 0.55, mg = g(fp, "pr-aforo");
      mg.style.transitionDelay = (0.3 + i * 0.12) + "s";
      poly(mg, [[m[0], m[1], 0.04], [m[0] + lado, m[1], 0.04], [m[0] + lado, m[1] + lado, 0.04], [m[0], m[1] + lado, 0.04]], { "class": "pr-aforo-m" });
    });
    [[1.7, 1.6], [3.5, 2.6], [2.0, 3.6]].forEach(function (v, i) {
      var q = iso(v[0], v[1], 0), a = el("ellipse", { cx: q[0], cy: q[1], rx: 17, ry: 7, "class": "pr-vaca-anillo" }, fp);
      a.style.animationDelay = (i * 0.5) + "s";
    });
  }

  /* ===== fase 3: implementación de app (lotes y potrero en Surco, con sus funciones) ===== */
  var f2 = g(svg, "pr-f pr-f2");
  var tel = estrecho ? { x: 334, y: 470, w: 132, h: 282 } : { x: 628, y: 104, w: 132, h: 282 };
  var cards = [];
  LOTES.forEach(function (l, i) {
    var c = iso(l.x + l.w / 2, l.y + l.d / 2, 0.6), cy = tel.y + 86 + i * 42;
    cards.push(cy);
    el("path", { d: "M" + c[0] + " " + c[1] + "C" + (c[0] + (estrecho ? 0 : 120)) + " " + (c[1] + (estrecho ? 90 : -40)) + " " + (tel.x - 70) + " " + cy + " " + (tel.x + 8) + " " + cy, "class": "pr-enlace" }, f2);
    var pin = g(f2, "pr-pin");
    el("path", { d: "M" + c[0] + " " + c[1] + "c-9 -10 -9 -22 0 -22s9 12 0 22z", fill: l.pasto ? "#d9b26a" : "#5ad69a", stroke: "#0e1512", "stroke-width": 1.5 }, pin);
    el("text", { x: c[0], y: c[1] - 12, "text-anchor": "middle", "class": "pr-pin-n" }, pin, l.pasto ? "P" : String(i + 1));
  });
  var t = g(f2, "pr-tel");
  el("rect", { x: tel.x + 7, y: tel.y + 7, width: tel.w, height: tel.h, rx: 22, fill: "#5c6a61" }, t);
  el("rect", { x: tel.x, y: tel.y, width: tel.w, height: tel.h, rx: 22, fill: "#e9eee9" }, t);
  el("rect", { x: tel.x + 7, y: tel.y + 9, width: tel.w - 14, height: tel.h - 18, rx: 15, fill: "#fcfcfa" }, t);
  el("rect", { x: tel.x + tel.w / 2 - 18, y: tel.y + 14, width: 36, height: 7, rx: 3.5, fill: "#0e1512" }, t);
  var TL = PF.tel || { tit: "Surco", sub: "3 lotes · 1 potrero", filas: ["Lote 1", "Lote 2", "Lote 3", "Potrero"], datos: ["Fenología", "Riego hoy", "Sin alertas", "12 bovinos"], alerta: "Vacuna: 3 bovinos" };
  el("text", { x: tel.x + 18, y: tel.y + 44, "class": "pr-tel-tit" }, t, TL.tit);
  el("text", { x: tel.x + 18, y: tel.y + 58, "class": "pr-tel-sub" }, t, TL.sub);
  var nombres = TL.filas, datos = TL.datos;
  LOTES.forEach(function (l, i) {
    var cy = cards[i];
    el("rect", { x: tel.x + 14, y: cy - 16, width: tel.w - 28, height: 34, rx: 9, fill: "#eceee8" }, t);
    el("circle", { cx: tel.x + 27, cy: cy + 1, r: 6, fill: l.c }, t);
    el("text", { x: tel.x + 39, y: cy - 1, "class": "pr-tel-l" }, t, nombres[i]);
    el("text", { x: tel.x + 39, y: cy + 11, "class": "pr-tel-d" }, t, datos[i]);
  });
  var al = tel.y + tel.h - 36;
  el("rect", { x: tel.x + 14, y: al - 12, width: tel.w - 28, height: 24, rx: 12, fill: "#5ad69a" }, t);
  el("text", { x: tel.x + tel.w / 2, y: al + 4, "text-anchor": "middle", "class": "pr-tel-al" }, t, TL.alerta);

  /* funciones de la app: agrícolas y pecuarias */
  var FUN = PF.fun || [
    ["foto", "Diagnóstico por foto", "Sin internet, en 4 cultivos", 0],
    ["gota", "Riego y clima", "Balance hídrico por lote", 0],
    ["doc", "Cuaderno BPA y EUDR", "Reportes en PDF", 0],
    ["moneda", "Costos y precios", "Economía y precios SIPSA", 0],
    ["kg", "Peso por foto", "Bovinos y porcinos", 1],
    ["hato", "Hato y sanidad", "Vacunas y reproducción", 1]
  ];
  function icono(p, tipo, x, y, pec) {
    el("circle", { cx: x, cy: y, r: 15, "class": pec ? "pr-fun-ic pr-fun-pec" : "pr-fun-ic" }, p);
    var a = { fill: "none", stroke: "#0e1512", "stroke-width": 1.8, "stroke-linecap": "round", "stroke-linejoin": "round" };
    function trazo(d) { var o = {}; for (var k in a) o[k] = a[k]; o.d = d; el("path", o, p); }
    if (tipo === "foto") { trazo("M" + (x - 7) + " " + (y - 3) + "h3l2 -3h4l2 3h3v9h-14z"); el("circle", { cx: x, cy: y + 1.5, r: 2.8, fill: "none", stroke: "#0e1512", "stroke-width": 1.8 }, p); }
    else if (tipo === "gota") trazo("M" + x + " " + (y - 8) + "c4 5 6 8 6 11a6 6 0 0 1 -12 0c0 -3 2 -6 6 -11z");
    else if (tipo === "doc") trazo("M" + (x - 5) + " " + (y - 7) + "h7l3 3v11h-10zM" + (x - 2) + " " + (y + 1) + "h4M" + (x - 2) + " " + (y + 4) + "h4");
    else if (tipo === "moneda") { el("circle", { cx: x, cy: y, r: 7, fill: "none", stroke: "#0e1512", "stroke-width": 1.8 }, p); el("text", { x: x, y: y + 4, "text-anchor": "middle", "class": "pr-fun-sim" }, p, "$"); }
    else if (tipo === "kg") el("text", { x: x, y: y + 4, "text-anchor": "middle", "class": "pr-fun-sim" }, p, "kg");
    else trazo("M" + (x - 6) + " " + (y + 6) + "l9 -9M" + (x + 1) + " " + (y - 7) + "l6 6M" + (x - 3) + " " + (y - 1) + "l4 4M" + (x + 4) + " " + (y - 4) + "l3 -3");
  }
  var anchoF = estrecho ? 220 : 186;
  FUN.forEach(function (fn, i) {
    var x, y;
    if (estrecho) { x = 176 + (i % 2) * 228; y = 40 + Math.floor(i / 2) * 50; }
    else { x = 22; y = (fn[3] ? 108 : 86) + i * 50; }
    var fg = g(f2, "pr-fun");
    fg.style.transitionDelay = (0.12 + i * 0.09) + "s";
    el("rect", { x: x, y: y, width: anchoF, height: 42, rx: 21, "class": "pr-fun-caja" + (fn[3] ? " pr-fun-caja-pec" : "") }, fg);
    icono(fg, fn[0], x + 21, y + 21, fn[3]);
    el("text", { x: x + 44, y: y + (estrecho ? 26 : 19), "class": "pr-fun-t" }, fg, fn[1]);
    if (!estrecho) el("text", { x: x + 44, y: y + 33, "class": "pr-fun-s" }, fg, fn[2]);
  });
  if (!estrecho) {
    var GR = PF.grupos || ["AGRÍCOLA", "PECUARIO"];
    el("text", { x: 24, y: 76, "class": "pr-fun-g" }, f2, GR[0]);
    if (GR[1]) el("text", { x: 24, y: 298, "class": "pr-fun-g pr-fun-g-pec" }, f2, GR[1]);
  }

  /* ===== fase 4: acompañamiento (ciclo, alertas, informe, cultivo que crece) ===== */
  var f3 = g(svg, "pr-f pr-f3");
  var frente = "M" + (CX - rx) + " " + CY + "A" + rx + " " + ry + " 0 0 0 " + (CX + rx) + " " + CY;
  el("path", { d: frente, "class": "pr-anillo" }, f3);
  var punto = el("circle", { r: 7, "class": "pr-punto" }, f3);
  if (!reduce) {
    var am = el("animateMotion", { dur: "7s", repeatCount: "indefinite", path: frente.replace(/A/, " A") }, punto);
    am.setAttribute("rotate", "0");
  } else { punto.setAttribute("cx", CX); punto.setAttribute("cy", CY + ry); }
  PF.hitos.map(function (hh, k) { return [hh, [0.22, 0.5, 0.78][k]]; }).forEach(function (h) {
    var ang = Math.PI * (1 - h[1]), x = CX + rx * Math.cos(ang), y = CY + ry * Math.sin(ang);
    el("circle", { cx: x, cy: y, r: 5, "class": "pr-hito" }, f3);
    var eh = etiqueta(f3, x, y + 26, h[0], "medio");
    if (estrecho) { eh.classList.add("pr-etq-movil"); etqMovil.push({ e: eh, x: x, y: y + 26, ancla: "medio" }); }
  });
  [[-2.6, -2.6], [2.6, -2.6], [2.6, 2.6]].forEach(function (c, i) {
    var q = iso(c[0], c[1], 2.4), b = g(f3, "pr-aviso");
    b.style.animationDelay = (i * 0.9) + "s";
    el("circle", { cx: q[0], cy: q[1], r: 13, fill: "#5ad69a" }, b);
    el("path", { d: "M" + (q[0] - 5) + " " + (q[1] + 4) + "h10M" + q[0] + " " + (q[1] - 6) + "c-4 0 -5 3 -5 6v4h10v-4c0 -3 -1 -6 -5 -6z", fill: "none", stroke: "#0e1512", "stroke-width": 1.8, "stroke-linejoin": "round" }, b);
  });
  /* indicadores que se siguen en la app: solo el nombre y una tendencia dibujada, sin cifras (27/11/2026: las cifras
     ilustrativas parecían resultados reales) */
  var IND = [["Rendimiento", "por lote", 1], ["Uso de agua", "por kg", -1], ["Costo", "por kg", -1], ["Alertas", "atendidas", 1]];
  var posI = estrecho ? [[180, 494], [412, 494], [180, 574], [412, 574]] : [[606, 86], [630, 170], [24, 262], [38, 340]];
  var wI = estrecho ? 204 : 162, hI = 62;
  if (PF.ind !== false) IND.forEach(function (d, i) {
    var x = posI[i][0], y = posI[i][1], ig = g(f3, "pr-ind"), fl = g(ig, "pr-ind-flota");
    ig.style.transitionDelay = (0.15 + i * 0.12) + "s";
    fl.style.animationDelay = (i * 0.7) + "s";
    el("rect", { x: x, y: y, width: wI, height: hI, rx: 14, "class": "pr-ind-caja" }, fl);
    el("text", { x: x + 14, y: y + 23, "class": "pr-ind-n" }, fl, d[0]);
    el("text", { x: x + 14, y: y + 48, "class": "pr-ind-v" }, fl, d[1]);
    var sx = x + wI - 62, sy = y + 18, serie = d[2] > 0 ? [26, 22, 23, 16, 12, 6] : [6, 9, 8, 15, 19, 25];
    el("polyline", { points: serie.map(function (v, k) { return (sx + k * 9.6).toFixed(1) + "," + (sy + v).toFixed(1); }).join(" "), "class": "pr-ind-linea" }, fl);
    el("circle", { cx: sx + 48, cy: sy + serie[5], r: 3.2, "class": "pr-ind-pt" }, fl);
  });
  if (PF.ind !== false) el("text", { x: 400, y: estrecho ? 668 : 510, "text-anchor": "middle", "class": "pr-nota" }, f3, "Indicadores que usted sigue en Surco");
  var doc = g(f3, "pr-doc");
  if (estrecho) doc.setAttribute("transform", "translate(126 -70)");
  el("rect", { x: 70, y: 128, width: 92, height: 116, rx: 10, fill: "#e9eee9" }, doc);
  [150, 164, 178, 192].forEach(function (y, i) { el("rect", { x: 84, y: y, width: i === 3 ? 38 : 62, height: 5, rx: 2.5, fill: "#6b766f", opacity: ".6" }, doc); });
  el("circle", { cx: 140, cy: 222, r: 13, fill: "#14633f" }, doc);
  el("path", { d: "M133 222l5 5 9 -10", fill: "none", stroke: "#fff", "stroke-width": 2.6, "stroke-linecap": "round", "stroke-linejoin": "round" }, doc);
  if (!estrecho) etiqueta(f3, 116, 108, "Informe del periodo", "medio");
  }
  escenaSVG();
  ajustarLeyenda();

  /* ---------- desplazamiento → fase ---------- */
  var actual = -1;
  function poner(i) {
    if (i === actual) return;
    actual = i;
    escena.setAttribute("data-paso", i);
    num.textContent = ("0" + (i + 1)).slice(-2);
    arts.forEach(function (a, k) { a.classList.toggle("activa", k === i); });
    barras.forEach(function (b, k) { b.setAttribute("aria-current", k === i ? "step" : "false"); });
    vivo.textContent = "Fase " + (i + 1) + " de " + n + ": " + textos()[i].t + ".";
    servicio(i);
    ajustarLeyenda();
  }
  /* fusión con el inicio (27/11/2026, prototipo): con #proceso.pr-fusion la pista sube hasta quedar bajo el inicio.
     Al llegar al pie del inicio (G.ini) el escenario aparece con un fundido sobre el visor (hasta G.fin) y desde ahí
     corren las 4 fases en G.fases px, la misma distancia que sin fusión (1,4 pantallas en escritorio, 1,2 en < 861 px). */
  var hero = document.getElementById("inicio"), fusion = sec.classList.contains("pr-fusion") && !!hero;
  var fijo = pista.querySelector(".pr-fijo"), G = { ini: 0, fin: 1, fases: 1 };
  function encajar() {
    if (!fusion) return;
    var vh = innerHeight;
    pista.style.marginTop = "0px";
    var d = pista.getBoundingClientRect().top - hero.getBoundingClientRect().top;
    G.ini = Math.max(0, hero.offsetHeight - vh);
    G.fin = G.ini + Math.round(vh * 0.35);
    G.fases = Math.round(vh * (innerWidth <= 860 ? 1.2 : 1.4));
    pista.style.marginTop = (-d) + "px";
    pista.style.height = (G.fin + G.fases + vh) + "px";
  }
  function medir() {
    var r = pista.getBoundingClientRect(), total = pista.offsetHeight - innerHeight, p;
    if (fusion) {
      var t = -r.top, op = Math.min(1, Math.max(0, (t - G.ini) / (G.fin - G.ini)));
      fijo.style.opacity = op; fijo.classList.toggle("pr-activo", op > 0.6);
      p = Math.min(1, Math.max(0, (t - G.fin) / G.fases));
    } else p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0;
    var x = p * n, i = Math.min(n - 1, Math.floor(x));
    barras.forEach(function (b, k) { b.firstChild.style.transform = "scaleX(" + Math.max(0, Math.min(1, x - k)) + ")"; });
    poner(i);
    volar(Math.max(0, Math.min(1, x / 0.85)));
  }
  function irA(i) {
    var total = pista.offsetHeight - innerHeight, top = pista.getBoundingClientRect().top + scrollY;
    var y = fusion ? top + G.fin + G.fases * (i + 0.5) / n : top + total * (i + 0.5) / n;
    scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" });
  }
  window.consultoriaProceso = { irA: irA };
  /* con la fusión, un enlace a #proceso (botones del inicio, «Ver cómo lo hacemos») lleva a la fase 1 */
  document.addEventListener("click", function (e) {
    var a = fusion && e.target.closest && e.target.closest('a[href="#proceso"]');
    if (a && !a.hasAttribute("data-linea")) { e.preventDefault(); irA(0); }
  });
  var pend = false;
  function alDesplazar() { if (pend) return; pend = true; requestAnimationFrame(function () { pend = false; medir(); }); }
  sec.classList.add("pr-js");
  /* tocar el escenario resalta la propuesta de la fase */
  escena.addEventListener("click", function () {
    cajaS.classList.remove("pulso"); void cajaS.offsetWidth; cajaS.classList.add("pulso");
  });
  /* cierre: vuelve al embudo con el perfil marcado y pide la necesidad */
  var cierre = sec.querySelector(".cierre-acc .boton");
  if (cierre) cierre.addEventListener("click", function (e) {
    var E = window.consultoriaEmbudo, p2 = document.getElementById("paso-2");
    if (!E || !p2) return;
    e.preventDefault(); E.linea(perfil);
    p2.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
    p2.classList.add("resalta"); setTimeout(function () { p2.classList.remove("resalta"); }, 2200);
  });
  document.addEventListener("perfil", function (e) { if (e.detail !== perfil) aplicarPerfil(e.detail, false); });
  aplicarPerfil("productor", false);
  addEventListener("scroll", alDesplazar, { passive: true });
  addEventListener("resize", function () {
    if ((innerWidth < 640) !== estrecho) escenaSVG();
    ajustarLeyenda();
    encajar();
    alDesplazar();
  });
  /* el alto del inicio cambia cuando cargan las fuentes y termina la animación del titular */
  addEventListener("load", function () { encajar(); medir(); });
  setTimeout(function () { encajar(); medir(); }, 2500);
  encajar();
  medir();
})();
