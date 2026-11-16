/* Consultoría · comportamiento de la página. Sin dependencias.
   Datos: datos.js. Las gráficas se dibujan en SVG a partir de esos datos. */
(function () {
  "use strict";
  var D = window.CONSULTORIA;
  var NS = "http://www.w3.org/2000/svg";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function el(tag, attrs, parent, text) {
    var n = document.createElementNS(NS, tag);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (text != null) n.textContent = text;
    if (parent) parent.appendChild(n);
    return n;
  }
  function h(tag, attrs, parent, html) {
    var n = document.createElement(tag);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (html != null) n.innerHTML = html;
    if (parent) parent.appendChild(n);
    return n;
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function rng(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function serv(id) { return D.servicios.filter(function (s) { return s.id === id; })[0]; }
  function waLink(texto) { return "https://wa.me/" + D.contacto.whatsapp + "?text=" + encodeURIComponent(texto); }

  /* ---------- barra ---------- */
  var barra = $("#barra");
  function scrollBarra() { barra.classList.toggle("sol", window.scrollY > 40); }
  window.addEventListener("scroll", scrollBarra, { passive: true }); scrollBarra();

  /* ---------- relieve del hero (curvas de nivel generadas) ---------- */
  (function relieve() {
    var svg = $("#relieve"), R = rng(2026);
    var colinas = [
      { cx: 880, cy: 270, rs: 11, paso: 30, ini: 28 },
      { cx: 170, cy: 640, rs: 8, paso: 34, ini: 30 },
      { cx: 520, cy: 760, rs: 6, paso: 38, ini: 34 }
    ];
    var grupos = [];
    colinas.forEach(function (c, ci) {
      var g = el("g", {}, svg); grupos.push({ g: g, f: 0.4 + ci * 0.35 });
      var fases = [], amps = [];
      for (var i = 0; i < 5; i++) { fases.push(R() * 6.28); amps.push((0.12 + R() * 0.1) / (i + 1)); }
      for (var k = 0; k < c.rs * 3; k++) {
        var base = c.ini + k * c.paso, pts = [];
        for (var a = 0; a <= 360; a++) {
          var t = a / 360 * Math.PI * 2, f = 1;
          for (var j = 0; j < 5; j++) f += amps[j] * Math.sin((j + 2) * t + fases[j] + k * 0.12);
          var r = base * f;
          pts.push((c.cx + Math.cos(t) * r * 1.35).toFixed(1) + "," + (c.cy + Math.sin(t) * r).toFixed(1));
        }
        var p = el("path", { d: "M" + pts.join("L") + "Z" }, g);
        if (k % 5 === 0) p.setAttribute("class", "maestra");
        else if (k % 7 === 3) p.setAttribute("class", "oro");
        if (!reduce) {
          var len = 4000; p.style.strokeDasharray = len; p.style.strokeDashoffset = len;
          p.style.transition = "stroke-dashoffset 2.6s ease-out " + (k * 0.04 + ci * 0.3) + "s";
          requestAnimationFrame(function (q) { return function () { requestAnimationFrame(function () { q.style.strokeDashoffset = 0; }); }; }(p));
        }
      }
    });
    if (reduce) return;
    var tx = 0, ty = 0, raf = 0;
    document.addEventListener("pointermove", function (e) {
      var nx = e.clientX / innerWidth - .5, ny = e.clientY / innerHeight - .5;
      if (raf) return;
      raf = requestAnimationFrame(function () {
        raf = 0;
        grupos.forEach(function (o) { o.g.setAttribute("transform", "translate(" + (nx * 40 * o.f).toFixed(1) + " " + (ny * 28 * o.f).toFixed(1) + ")"); });
      });
    }, { passive: true });
  })();

  /* ---------- embudo guiado (4 pasos) ---------- */
  (function embudo() {
    var est = { linea: null, sit: null, datos: null, plazo: null };
    var bl = $("#e-linea"), bs = $("#situaciones"), bd = $("#e-datos"), bp = $("#e-plazo"), res = $("#resultado");

    function marcar(box, b) {
      [].forEach.call(box.children, function (x) { x.setAttribute("aria-checked", "false"); });
      b.setAttribute("aria-checked", "true");
    }
    function grupo(box, items, alElegir) {
      box.innerHTML = "";
      items.forEach(function (it, i) {
        var b = h("button", { type: "button", role: "radio", "aria-checked": "false" }, box, esc(it.t || it.texto));
        b.addEventListener("click", function () { marcar(box, b); alElegir(it); });
        b.addEventListener("keydown", function (e) {
          var k = e.key, n = null, c = box.children;
          if (k === "ArrowDown" || k === "ArrowRight") n = c[(i + 1) % c.length];
          if (k === "ArrowUp" || k === "ArrowLeft") n = c[(i - 1 + c.length) % c.length];
          if (n) { e.preventDefault(); n.focus(); n.click(); }
        });
      });
    }
    function situaciones() {
      est.sit = null;
      if (!est.linea) { bs.innerHTML = '<p class="vacio-e">Elige primero quién eres (paso 1).</p>'; return; }
      var lista = D.situaciones.filter(function (s) { return s.linea.indexOf(est.linea) >= 0; });
      grupo(bs, lista, function (s) { est.sit = s; render(); });
    }
    function elegirLinea(id) {
      var i = Object.keys(D.lineas).indexOf(id);
      if (i < 0 || !bl.children[i]) return;
      marcar(bl, bl.children[i]); est.linea = id; situaciones(); render();
    }

    function resumen() {
      var L = D.lineas[est.linea], sv = est.sit.servicio ? serv(est.sit.servicio) : null;
      var datos = D.opcionesDatos.filter(function (o) { return o.id === est.datos; })[0];
      var plazo = D.opcionesPlazo.filter(function (o) { return o.id === est.plazo; })[0];
      var p = ["Soy " + L.frase + ".", "Mi situación: " + est.sit.texto.toLowerCase() + "."];
      if (sv) p.push("Me interesa: " + sv.titulo + ".");
      if (datos) p.push("Datos: " + datos.t.toLowerCase() + ".");
      if (plazo) p.push("Plazo: " + plazo.t.toLowerCase() + ".");
      return p.join(" ");
    }
    function render() {
      if (!est.linea || !est.sit) {
        res.innerHTML = '<p class="vacio">Responde los pasos 1 y 2 y aquí aparece qué te entregamos.</p>';
        return;
      }
      var sv = est.sit.servicio ? serv(est.sit.servicio) : null, txt = resumen();
      var sel = $("#f-servicio"); if (sel) sel.value = sv ? sv.id : "otro";
      var datos = D.opcionesDatos.filter(function (o) { return o.id === est.datos; })[0];
      var plazo = D.opcionesPlazo.filter(function (o) { return o.id === est.plazo; })[0];
      var extra = (datos || plazo) ? '<p class="e-extra">' + (datos ? esc(datos.t) : "") + (datos && plazo ? " · " : "") + (plazo ? esc(plazo.t) : "") + "</p>" : "";
      var cuerpo = sv
        ? '<h3>' + esc(sv.titulo) + '</h3><dl><dt>Te entregamos</dt><dd>' + esc(sv.entrega) + '</dd><dt>Respaldo</dt><dd>' + esc(sv.respaldo) + '</dd></dl>'
        : '<h3>Conversemos tu caso</h3><p>Con tu caso en pocas líneas te decimos si lo resolvemos, con quién del equipo y cómo empezar.</p>';
      res.innerHTML = '<div class="entra">' + cuerpo + extra +
        '<div class="e-acc"><a class="boton" target="_blank" rel="noopener" href="' + waLink("Hola, equipo de Consultoría. Vi su página. " + txt) + '">Enviar por WhatsApp</a>' +
        '<button type="button" class="boton boton-claro" id="e-form">Completar en el formulario</button></div></div>';
      $("#e-form").addEventListener("click", function () {
        var f = $("#formu"); if (!f.caso.value.trim() || f.caso.dataset.auto === "1") { f.caso.value = txt; f.caso.dataset.auto = "1"; }
        location.hash = "#contacto";
        setTimeout(function () { f.nombre.focus({ preventScroll: true }); }, 400);
      });
    }

    grupo(bl, Object.keys(D.lineas).map(function (k) { return { id: k, t: D.lineas[k].texto }; }), function (it) { est.linea = it.id; situaciones(); render(); });
    grupo(bd, D.opcionesDatos, function (o) { est.datos = o.id; render(); });
    grupo(bp, D.opcionesPlazo, function (o) { est.plazo = o.id; render(); });
    situaciones();
    [].forEach.call(document.querySelectorAll("[data-linea]"), function (a) {
      a.addEventListener("click", function () { elegirLinea(a.dataset.linea); });
    });
  })();

  /* ---------- servicios ---------- */
  (function servicios() {
    var rej = $("#rejilla");
    D.servicios.forEach(function (s) {
      var c = h("article", { "class": "serv rev" }, rej,
        '<svg viewBox="0 0 40 40" aria-hidden="true"><use href="#i-' + s.icono + '"/></svg>' +
        '<p class="tags">' + s.linea.map(function (l) { return '<span>' + (l === "academica" ? "Académico" : "Empresarial") + '</span>'; }).join("") + '</p>' +
        '<h3>' + esc(s.titulo) + '</h3>' +
        '<p class="para">Para: ' + esc(s.para) + '.</p>' +
        '<p>' + esc(s.entrega) + '</p>' +
        '<p class="resp"><b>RESPALDO</b> ' + esc(s.respaldo) + '</p>');
    });
    var sel = $("#f-servicio");
    D.servicios.forEach(function (s) { h("option", { value: s.id }, sel, esc(s.titulo)); });
    h("option", { value: "otro" }, sel, "Otro / no lo sé todavía");
  })();

  /* ---------- detalle de servicios con dron ---------- */
  (function dron() {
    var dd = D.dron; if (!dd) return;
    $("#dron-equipo").textContent = dd.equipo;
    var ul = $("#dron-items");
    dd.items.forEach(function (i) { h("li", {}, ul, '<b>' + esc(i.t) + '</b><span>' + esc(i.d) + '</span>'); });
    $("#dron-lim").textContent = dd.limites;
  })();

  /* ---------- cifras con conteo ---------- */
  (function cifras() {
    var box = $("#cifras");
    D.cifras.forEach(function (c) {
      var d = h("div", { "class": "cifra rev" }, box,
        '<div class="n" data-n="' + c.n + '" data-s="' + c.sufijo + '">0</div><div class="e">' + esc(c.etiqueta) + '</div><div class="f">' + esc(c.fuente) + '</div>');
    });
    function cuenta(nodo) {
      var meta = +nodo.dataset.n, suf = nodo.dataset.s, ini = performance.now(), dur = 1500;
      function fmt(v) { return Math.round(v).toLocaleString("es-CO") + suf; }
      if (reduce) { nodo.textContent = fmt(meta); return; }
      (function paso(t) {
        var p = Math.min(1, (t - ini) / dur), e = 1 - Math.pow(1 - p, 3);
        nodo.textContent = fmt(meta * e);
        if (p < 1) requestAnimationFrame(paso);
      })(ini);
    }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { cuenta(e.target); io.unobserve(e.target); } });
    }, { threshold: .6 });
    [].forEach.call(box.querySelectorAll(".n"), function (n) { io.observe(n); });
  })();

  /* ---------- gráfica 1: publicaciones por año ---------- */
  (function pubs() {
    var cont = $("#g-pubs"), det = $("#detalle-pub");
    var W = 760, H = 300, m = { l: 40, r: 20, t: 20, b: 46 };
    var svg = el("svg", { viewBox: "0 0 " + W + " " + H, role: "img", "aria-label": "Publicaciones por año, 2023 a 2026" }, cont);
    var anios = [2023, 2024, 2025, 2026], colores = { "PLS-SEM": "#0b6e8a", "Bibliometría": "#e0533a", "Complejidad y economía": "#6b4fc7", "Territorio rural": "#6b4fc7", "Economía solidaria": "#6b4fc7" };
    var etiquetaTema = function (t) { return /PLS/.test(t) ? "PLS-SEM" : t === "Bibliometría" ? "Bibliometría" : "Territorio y economía"; };
    var xs = function (a) { return m.l + (anios.indexOf(a) + .5) * ((W - m.l - m.r) / anios.length); };
    var base = H - m.b, r = 17;
    el("line", { x1: m.l, x2: W - m.r, y1: base, y2: base, stroke: "#0b1b2b", "stroke-width": 2 }, svg);
    for (var g = 1; g <= 4; g++) {
      var y = base - g * (r * 2 + 4) + r + 2;
      el("line", { x1: m.l, x2: W - m.r, y1: y + r + 2, y2: y + r + 2, stroke: "#c5d3dc", "stroke-dasharray": "3 5" }, svg);
    }
    anios.forEach(function (a) { el("text", { x: xs(a), y: H - 16, "text-anchor": "middle", "font-size": 15, "font-weight": 600 }, svg, a); });
    var pila = {};
    D.publicaciones.slice().sort(function (a, b) { return a.anio - b.anio; }).forEach(function (p, idx) {
      pila[p.anio] = (pila[p.anio] || 0) + 1;
      var cx = xs(p.anio), cy = base - 4 - r - (pila[p.anio] - 1) * (r * 2 + 4);
      var col = colores[p.tema] || "#0b6e8a";
      var c = el("circle", { cx: cx, cy: cy, r: r, fill: col, "class": "punto-pub", tabindex: 0, role: "button", "aria-label": p.anio + ": " + p.titulo, stroke: "#fbfdfe", "stroke-width": 3 }, svg);
      if (!reduce) { c.style.transform = "translateY(" + (base - 4 - r - cy) + "px)"; c.style.opacity = 0; c.style.transition = "transform .7s cubic-bezier(.2,1.4,.4,1) " + (idx * .12) + "s, opacity .3s " + (idx * .12) + "s"; }
      var mostrar = function () {
        det.innerHTML = '<b>' + esc(p.titulo) + '</b><br>' + esc(p.rev) + ' · ' + p.anio + ' · ' + esc(etiquetaTema(p.tema)) + ' <a href="https://doi.org/' + p.doi + '" target="_blank" rel="noopener">doi.org/' + esc(p.doi) + '</a>';
        [].forEach.call(svg.querySelectorAll("circle"), function (x) { x.setAttribute("r", r); });
        c.setAttribute("r", r + 4);
      };
      c.addEventListener("pointerenter", mostrar); c.addEventListener("focus", mostrar); c.addEventListener("click", mostrar);
      c.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); mostrar(); } });
      c._fin = function () { c.style.transform = "none"; c.style.opacity = 1; };
    });
    /* leyenda */
    var leg = [["PLS-SEM", "#0b6e8a"], ["Bibliometría", "#e0533a"], ["Territorio y economía", "#6b4fc7"]];
    leg.forEach(function (l, i) {
      var x = m.l + 10 + i * 170;
      el("circle", { cx: x, cy: 14, r: 6, fill: l[1] }, svg);
      el("text", { x: x + 12, y: 18, "font-size": 12 }, svg, l[0]);
    });
    var io = new IntersectionObserver(function (es) {
      if (es[0].isIntersecting) { [].forEach.call(svg.querySelectorAll("circle.punto-pub"), function (c) { c._fin(); }); io.disconnect(); }
    }, { threshold: .4 }); io.observe(cont);
  })();

  /* ---------- gráfica 2: 300 puntos ---------- */
  (function puntos() {
    var cont = $("#g-puntos"), cols = 20, filas = 15, s = 22;
    var svg = el("svg", { viewBox: "0 0 " + (cols * s) + " " + (filas * s + 30), role: "img", "aria-label": "300 puntos que representan más de 300 productores capacitados" }, cont);
    var dots = [];
    for (var i = 0; i < cols * filas; i++) {
      var c = el("circle", { cx: (i % cols) * s + s / 2, cy: Math.floor(i / cols) * s + s / 2, r: 7, fill: "#c5d3dc" }, svg);
      c.style.transition = "fill .3s"; dots.push(c);
    }
    var t = el("text", { x: cols * s, y: filas * s + 22, "text-anchor": "end", "font-size": 13, "font-weight": 600 }, svg, "300+ productores");
    var io = new IntersectionObserver(function (es) {
      if (!es[0].isIntersecting) return; io.disconnect();
      dots.forEach(function (c, i) {
        var f = function () { c.setAttribute("fill", i % 7 === 3 ? "#e0533a" : "#0b6e8a"); };
        reduce ? f() : setTimeout(f, i * 8);
      });
    }, { threshold: .5 }); io.observe(cont);
  })();

  /* ---------- gráfica 3: cajas con datos simulados ---------- */
  (function cajas() {
    var cont = $("#g-cajas"), R = rng(77);
    function normal() { var u = 1 - R(), v = R(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
    var grupos = [["A", 42, 6], ["B", 48, 6], ["C", 56, 6.5], ["D", 51, 6]].map(function (g) {
      var xs = []; for (var i = 0; i < 30; i++) xs.push(g[1] + g[2] * normal());
      xs.sort(function (a, b) { return a - b; });
      var q = function (p) { var i = (xs.length - 1) * p, lo = Math.floor(i); return xs[lo] + (xs[Math.min(lo + 1, xs.length - 1)] - xs[lo]) * (i - lo); };
      var mean = xs.reduce(function (a, b) { return a + b; }, 0) / xs.length;
      var sd = Math.sqrt(xs.reduce(function (a, b) { return a + (b - mean) * (b - mean); }, 0) / (xs.length - 1));
      var ci = 2.045 * sd / Math.sqrt(xs.length); /* t(0,975; 29 gl) = 2,045 */
      return { n: g[0], xs: xs, q1: q(.25), med: q(.5), q3: q(.75), mean: mean, ci: ci };
    });
    var W = 420, H = 320, m = { l: 44, r: 12, t: 16, b: 40 };
    var lo = 25, hi = 75, Y = function (v) { return H - m.b - (v - lo) / (hi - lo) * (H - m.t - m.b); };
    var svg = el("svg", { viewBox: "0 0 " + W + " " + H, role: "img", "aria-label": "Diagramas de caja de cuatro materiales con datos simulados" }, cont);
    for (var v = 30; v <= 70; v += 10) {
      el("line", { x1: m.l, x2: W - m.r, y1: Y(v), y2: Y(v), stroke: "#c5d3dc", "stroke-dasharray": "3 5" }, svg);
      el("text", { x: m.l - 8, y: Y(v) + 4, "text-anchor": "end", "font-size": 11 }, svg, v);
    }
    var bw = 46, paso = (W - m.l - m.r) / 4;
    var cols = ["#0b6e8a", "#3d9fb8", "#6b4fc7", "#e0533a"];
    grupos.forEach(function (g, i) {
      var cx = m.l + paso * (i + .5), gr = el("g", {}, svg);
      el("line", { x1: cx, x2: cx, y1: Y(g.xs[0]), y2: Y(g.xs[29]), stroke: "#0b1b2b", "stroke-width": 1.5 }, gr);
      var caja = el("rect", { x: cx - bw / 2, width: bw, y: Y(g.q3), height: Y(g.q1) - Y(g.q3), fill: cols[i], "fill-opacity": .85, stroke: "#0b1b2b", "stroke-width": 1.5 }, gr);
      el("line", { x1: cx - bw / 2, x2: cx + bw / 2, y1: Y(g.med), y2: Y(g.med), stroke: "#fbfdfe", "stroke-width": 3 }, gr);
      g.xs.forEach(function (v, j) { el("circle", { cx: cx + ((j * 37 % 21) - 10) * 1.9 + (j % 2 ? 0 : 0), cy: Y(v), r: 2.4, fill: "#0b1b2b", "fill-opacity": .35 }, gr); });
      el("line", { x1: cx + bw / 2 + 8, x2: cx + bw / 2 + 8, y1: Y(g.mean - g.ci), y2: Y(g.mean + g.ci), stroke: "#0b1b2b", "stroke-width": 2 }, gr);
      el("path", { d: "M" + (cx + bw / 2 + 8) + " " + (Y(g.mean) - 6) + "l6 6-6 6-6-6z", fill: "#ff7a59", stroke: "#0b1b2b", "stroke-width": 1.5 }, gr);
      el("text", { x: cx, y: H - 14, "text-anchor": "middle", "font-size": 13, "font-weight": 600 }, svg, "Material " + g.n);
      if (!reduce) { gr.style.transformOrigin = cx + "px " + Y(g.med) + "px"; gr.style.transform = "scaleY(0)"; gr.style.transition = "transform .8s cubic-bezier(.2,1.3,.4,1) " + (i * .12) + "s"; }
      gr._i = i;
    });
    el("text", { x: 12, y: H / 2, "font-size": 11, transform: "rotate(-90 12 " + H / 2 + ")", "text-anchor": "middle" }, svg, "variable de respuesta (unidades arbitrarias)");
    var io = new IntersectionObserver(function (es) {
      if (!es[0].isIntersecting) return; io.disconnect();
      [].forEach.call(svg.querySelectorAll("g"), function (g) { g.style.transform = "scaleY(1)"; });
    }, { threshold: .4 }); io.observe(cont);
  })();

  /* ---------- gráfica 4: ruta del dato ---------- */
  (function ruta() {
    var cont = $("#g-ruta"), W = 900, H = 170;
    var svg = el("svg", { viewBox: "0 0 " + W + " " + H, role: "img", "aria-label": "Ruta del dato: campo o Excel, limpieza, modelo, informe o tablero" }, cont);
    var nodos = [["Campo y Excel", "tus datos como llegan"], ["Limpieza", "Python · SQL · duplicados"], ["Análisis", "R · PLS-SEM · ANOVA"], ["Entrega", "informe · tablero · DAX"]];
    var paso = (W - 260) / 3, y = 60;
    el("path", { d: "M130 " + y + "H" + (W - 130), stroke: "#e0533a", "stroke-width": 3, "stroke-dasharray": "10 8", fill: "none", style: reduce ? "" : "animation:fluye 1.2s linear infinite" }, svg);
    nodos.forEach(function (n, i) {
      var x = 130 + paso * i;
      el("circle", { cx: x, cy: y, r: 26, fill: i === 3 ? "#0b6e8a" : "#fbfdfe", stroke: "#0b1b2b", "stroke-width": 3 }, svg);
      el("text", { x: x, y: y + 6, "text-anchor": "middle", "font-size": 18, "font-weight": 700, style: "fill:" + (i === 3 ? "#fff" : "#0b1b2b") }, svg, i + 1);
      el("text", { x: x, y: y + 58, "text-anchor": "middle", "font-size": 16, "font-weight": 700, style: "fill:#0b1b2b;font-family:Georgia,serif" }, svg, n[0]);
      el("text", { x: x, y: y + 80, "text-anchor": "middle", "font-size": 12 }, svg, n[1]);
    });
  })();

  /* ---------- equipo ---------- */
  (function equipo() {
    var cont = $("#equipo-lista");
    D.equipo.forEach(function (p) {
      h("article", { "class": "persona rev" }, cont,
        '<span class="av" aria-hidden="true">' + esc(p.ini) + '</span><h3>' + esc(p.nombre) + '</h3>' +
        '<p class="rol">' + esc(p.rol) + '</p><p class="tit">' + esc(p.titulo) + '</p>');
    });

    /* carrusel: scroll-snap nativo + flechas y puntos; sin movimiento automático */
    var prev = $("#car-prev"), next = $("#car-next"), pts = $("#equipo-pts"), n = cont.children.length;
    function paso() { return n > 1 ? cont.children[1].offsetLeft - cont.children[0].offsetLeft : cont.clientWidth; }
    function visibles() { return Math.max(1, Math.round(cont.clientWidth / paso())); }
    function posiciones() { return Math.max(1, n - visibles() + 1); }
    function ir(i) { cont.scrollTo({ left: i * paso(), behavior: reduce ? "auto" : "smooth" }); }
    function puntos() {
      pts.innerHTML = "";
      for (var i = 0; i < posiciones(); i++) (function (i) {
        var b = h("button", { type: "button", "aria-label": "Ir a la posición " + (i + 1) }, pts);
        b.addEventListener("click", function () { ir(i); });
      })(i);
      estado();
    }
    function estado() {
      var max = cont.scrollWidth - cont.clientWidth, i = Math.min(posiciones() - 1, Math.round(cont.scrollLeft / paso()));
      prev.disabled = cont.scrollLeft <= 2; next.disabled = cont.scrollLeft >= max - 2;
      [].forEach.call(pts.children, function (b, k) { b.setAttribute("aria-current", k === i ? "true" : "false"); });
      $("#equipo-car").classList.toggle("sin-desborde", max <= 2);
      pts.hidden = max <= 2;
    }
    prev.addEventListener("click", function () { cont.scrollBy({ left: -paso(), behavior: reduce ? "auto" : "smooth" }); });
    next.addEventListener("click", function () { cont.scrollBy({ left: paso(), behavior: reduce ? "auto" : "smooth" }); });
    cont.addEventListener("scroll", estado, { passive: true });
    cont.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { e.preventDefault(); next.click(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); prev.click(); }
    });
    window.addEventListener("resize", puntos);
    puntos();
  })();

  /* ---------- trayectoria ---------- */
  (function trayectoria() {
    var ol = $("#linea");
    D.trayectoria.forEach(function (t) {
      h("li", { "class": "rev" }, ol, '<span class="f">' + esc(t.fecha) + '</span><div><h3>' + esc(t.cargo) + '</h3><div class="d">' + esc(t.donde) + '</div><p>' + esc(t.texto) + '</p></div>');
    });
  })();

  /* ---------- lista de publicaciones ---------- */
  (function listaPubs() {
    var ul = $("#lista-pubs");
    D.publicaciones.forEach(function (p) {
      h("li", { "class": "rev" }, ul, '<span class="y">' + p.anio + '</span><div><p class="t">' + esc(p.titulo) + '</p><span class="r"><span class="tema">' + esc(p.tema) + '</span>' + esc(p.rev) + ' <a href="https://doi.org/' + p.doi + '" target="_blank" rel="noopener">doi.org/' + esc(p.doi) + '</a></span></div>');
    });
  })();

  /* ---------- voces (solo testimonios reales; ?demo=1 muestra el diseño) ---------- */
  (function voces() {
    var cont = $("#voces-lista"), demo = /[?&]demo=1/.test(location.search);
    var lista = D.testimonios.filter(function (t) { return t.autorizado; });
    if (demo) lista = D.testimoniosDemo;
    if (!lista.length) {
      h("div", { "class": "voces-vacio" }, cont,
        '<h3>Aquí van las voces de quienes ya trabajaron con nosotros</h3>' +
        '<p>Esta sección solo publica frases textuales, con nombre y con permiso por escrito. Los primeros proyectos de esta etapa piloto serán los primeros en aparecer.</p>' +
        '<p><a class="boton" href="#contacto">Sé el primer caso</a></p>');
      return;
    }
    lista.forEach(function (t) {
      var s = t.servicio && serv(t.servicio);
      h("figure", { "class": "voz rev" + (demo ? " demo" : "") }, cont,
        (demo ? '<span class="etiqueta sello">ejemplo de diseño</span>' : "") +
        '<blockquote>' + esc(t.cita) + '</blockquote><figcaption><span class="q">' + esc(t.nombre) + '</span><br><span class="r">' + esc(t.rol) + (s ? ' · ' + esc(s.titulo) : "") + '</span></figcaption>');
    });
  })();

  /* ---------- contacto ---------- */
  (function contacto() {
    var c = D.contacto;
    var wa = $("#c-wa"); wa.textContent = c.whatsappVisible; wa.href = "https://wa.me/" + c.whatsapp;
    var ma = $("#c-mail"); ma.textContent = c.correo; ma.href = "mailto:" + c.correo;
    var f = $("#formu"), via = "whatsapp";
    [].forEach.call(f.querySelectorAll("button"), function (b) { b.addEventListener("click", function () { via = b.dataset.via; }); });
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var nombre = f.nombre.value.trim(), caso = f.caso.value.trim();
      if (!nombre || !caso) { (nombre ? f.caso : f.nombre).focus(); return; }
      var sv = serv(f.servicio.value), t = sv ? sv.titulo : "otro tema";
      var msg = "Hola, equipo de Consultoría. Soy " + nombre + ". Me interesa: " + t + ".\n\n" + caso;
      if (via === "correo") location.href = "mailto:" + c.correo + "?subject=" + encodeURIComponent("Consulta: " + t) + "&body=" + encodeURIComponent(msg);
      else window.open(waLink(msg), "_blank", "noopener");
    });
  })();

  /* ---------- aparición al hacer scroll ---------- */
  (function rev() {
    var nodos = document.querySelectorAll(".rev");
    if (reduce || !("IntersectionObserver" in window)) { [].forEach.call(nodos, function (n) { n.classList.add("ya"); }); return; }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("ya"); io.unobserve(e.target); } });
    }, { threshold: .15 });
    [].forEach.call(nodos, function (n, i) { n.style.transitionDelay = (i % 4) * 70 + "ms"; io.observe(n); });
  })();
})();
