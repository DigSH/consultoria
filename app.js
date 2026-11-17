/* Consultoría · comportamiento de la página. Sin dependencias.
   Datos: datos.js. Las gráficas se dibujan en SVG a partir de esos datos. */
(function () {
  "use strict";
  var D = window.CONSULTORIA;
  var NS = "http://www.w3.org/2000/svg";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finales = []; /* funciones que fijan el estado final de gráficas y contadores (impresión) */

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
  (function menu() {
    var btn = $("#menu-btn"), panel = $("#nav-enlaces");
    function poner(abierto) { barra.classList.toggle("abierto", abierto); btn.setAttribute("aria-expanded", abierto ? "true" : "false"); btn.textContent = abierto ? "Cerrar" : "Menú"; }
    btn.addEventListener("click", function () { poner(!barra.classList.contains("abierto")); });
    panel.addEventListener("click", function (e) { if (e.target.closest("a")) poner(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && barra.classList.contains("abierto")) { poner(false); btn.focus(); } });
    window.addEventListener("resize", function () { if (window.innerWidth > 860) poner(false); });
  })();
  /* indicador de sección activa en la barra */
  (function espia() {
    if (!("IntersectionObserver" in window)) return;
    var links = [].slice.call(document.querySelectorAll("#nav-enlaces a")), mapa = {}, secs = [];
    links.forEach(function (a) { var s = document.querySelector(a.getAttribute("href")); if (s) { mapa[s.id] = a; secs.push(s); } });
    var inicio = $("#inicio"); if (inicio) secs.push(inicio);
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) { a.removeAttribute("aria-current"); });
        if (mapa[e.target.id]) mapa[e.target.id].setAttribute("aria-current", "true");
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    secs.forEach(function (s) { io.observe(s); });
  })();

  /* ---------- visor GIS interactivo del hero (DEM + Marching Squares + Hidrología + Perfil) ---------- */
  (function relieve() {
    var svg = $("#relieve"), hero = $("#inicio");
    if (!svg || !hero) return;
    var W = 1200, H = 720, PASO = 15, NX = W / PASO, NY = H / PASO, ESCALA_M = 4.2;

    /* 1. Modelo Digital de Elevación (DEM) analítico: altiplano de Boyacá (2.560 a 3.290 msnm) */
    var cumbres = [
      { cx: 915, cy: 255, amp: 535, sx: 230, sy: 168, rot: -0.32, nom: "▲ 3286 msnm · Alto del Gavilán" },
      { cx: 1065, cy: 505, amp: 355, sx: 190, sy: 150, rot: 0.38, nom: "▲ 3082 msnm · Loma Chica" },
      { cx: 695, cy: 515, amp: 305, sx: 205, sy: 145, rot: -0.22, nom: "▲ 2964 msnm · Cerro Sur" },
      { cx: 625, cy: 185, amp: 225, sx: 175, sy: 130, rot: 0.18 },
      { cx: 215, cy: 600, amp: 270, sx: 235, sy: 165, rot: 0.25 },
      { cx: 335, cy: 150, amp: 185, sx: 210, sy: 140, rot: -0.15 },
      { cx: 775, cy: 365, amp: -135, sx: 140, sy: 112, rot: 0.12 }
    ];
    cumbres.forEach(function (c) { c.cos = Math.cos(c.rot); c.sen = Math.sin(c.rot); });

    function elev(x, y) {
      var z = 2540 + (x / W) * 70 + ((H - y) / H) * 40;
      for (var i = 0; i < cumbres.length; i++) {
        var c = cumbres[i], dx = x - c.cx, dy = y - c.cy;
        var rx = dx * c.cos - dy * c.sen, ry = dx * c.sen + dy * c.cos;
        z += c.amp * Math.exp(-0.5 * ((rx * rx) / (c.sx * c.sx) + (ry * ry) / (c.sy * c.sy)));
      }
      z += 15 * Math.sin(x * 0.015 + y * 0.01) * Math.cos(x * 0.008 - y * 0.014);
      return z;
    }

    var rumbos = ["N", "NE", "E", "SE", "S", "SO", "O", "NO"];
    function grad(x, y) {
      var e = 2.5;
      var dzx = (elev(x + e, y) - elev(x - e, y)) / (2 * e);
      var dzy = (elev(x, y + e) - elev(x, y - e)) / (2 * e);
      var sx = dzx / ESCALA_M, sy = -dzy / ESCALA_M;
      var mag = Math.hypot(sx, sy), deg = Math.atan(mag) * 180 / Math.PI;
      var asp = (Math.atan2(-sx, -sy) * 180 / Math.PI + 360) % 360;
      return { dzx: dzx, dzy: dzy, deg: deg, pct: mag * 100, asp: asp, rum: rumbos[Math.round(asp / 45) % 8] };
    }

    function dms(val, pos, neg) {
      var h = val >= 0 ? pos : neg, a = Math.abs(val), g = Math.floor(a), m = Math.floor((a - g) * 60), s = ((a - g) * 3600 - m * 60).toFixed(0);
      return g + "°" + (m < 10 ? "0" : "") + m + "'" + (s < 10 ? "0" : "") + s + '"' + h;
    }
    function aGeo(x, y) {
      var lon = -73.382 + (x / W) * 0.058, lat = 5.568 - (y / H) * 0.035;
      var este = Math.round(4959000 + x * ESCALA_M), norte = Math.round(2173024 - y * ESCALA_M);
      return { dms: dms(lat, "N", "S") + " · " + dms(lon, "E", "O"), este: este, norte: norte };
    }

    /* 2. Malla precalculada y Marching Squares para curvas de nivel e isohipsa en vivo */
    var malla = [];
    for (var iy = 0; iy <= NY; iy++) {
      var fila = [];
      for (var ix = 0; ix <= NX; ix++) fila.push(elev(ix * PASO, iy * PASO));
      malla.push(fila);
    }
    var tablaMS = {
      1: [[3, 0]], 14: [[3, 0]], 2: [[0, 1]], 13: [[0, 1]],
      4: [[1, 2]], 11: [[1, 2]], 8: [[2, 3]], 7: [[2, 3]],
      3: [[3, 1]], 12: [[3, 1]], 6: [[0, 2]], 9: [[0, 2]],
      5: [[3, 2], [0, 1]], 10: [[3, 0], [1, 2]]
    };

    function marchar(cota, coser) {
      var segs = [], adj = {};
      function clave(p) { return Math.round(p[0] * 5) + "_" + Math.round(p[1] * 5); }
      for (var y = 0; y < NY; y++) {
        var y0 = y * PASO, y1 = y0 + PASO, r0 = malla[y], r1 = malla[y + 1];
        for (var x = 0; x < NX; x++) {
          var z0 = r0[x], z1 = r0[x + 1], z2 = r1[x + 1], z3 = r1[x];
          var idx = (z0 >= cota ? 1 : 0) | (z1 >= cota ? 2 : 0) | (z2 >= cota ? 4 : 0) | (z3 >= cota ? 8 : 0);
          var pares = tablaMS[idx];
          if (!pares) continue;
          var x0 = x * PASO, x1 = x0 + PASO, pts = [];
          if ((idx & 1) !== ((idx >> 1) & 1)) pts[0] = [x0 + PASO * ((cota - z0) / (z1 - z0 || 1e-6)), y0];
          if (((idx >> 1) & 1) !== ((idx >> 2) & 1)) pts[1] = [x1, y0 + PASO * ((cota - z1) / (z2 - z1 || 1e-6))];
          if (((idx >> 2) & 1) !== ((idx >> 3) & 1)) pts[2] = [x0 + PASO * ((cota - z3) / (z2 - z3 || 1e-6)), y1];
          if (((idx >> 3) & 1) !== (idx & 1)) pts[3] = [x0, y0 + PASO * ((cota - z0) / (z3 - z0 || 1e-6))];
          for (var k = 0; k < pares.length; k++) {
            var a = pts[pares[k][0]], b = pts[pares[k][1]];
            var si = segs.length; segs.push([a, b]);
            if (coser) {
              var ka = clave(a), kb = clave(b);
              (adj[ka] = adj[ka] || []).push(si); (adj[kb] = adj[kb] || []).push(si);
            }
          }
        }
      }
      if (!coser) {
        var d = "";
        for (var i = 0; i < segs.length; i++) {
          var s = segs[i];
          d += "M" + s[0][0].toFixed(1) + " " + s[0][1].toFixed(1) + "L" + s[1][0].toFixed(1) + " " + s[1][1].toFixed(1);
        }
        return { d: d, cadenas: [] };
      }
      var usado = [], cadenas = [], dCosido = "";
      for (var j = 0; j < segs.length; j++) {
        if (usado[j]) continue;
        usado[j] = 1;
        var cad = [segs[j][0], segs[j][1]];
        while (true) {
          var kf = clave(cad[cad.length - 1]), ls = adj[kf], sig = -1;
          if (ls) for (var m = 0; m < ls.length; m++) if (!usado[ls[m]]) { sig = ls[m]; break; }
          if (sig < 0) break;
          usado[sig] = 1;
          var sg = segs[sig]; cad.push(clave(sg[0]) === kf ? sg[1] : sg[0]);
        }
        while (true) {
          var ki = clave(cad[0]), ls2 = adj[ki], ant = -1;
          if (ls2) for (var n = 0; n < ls2.length; n++) if (!usado[ls2[n]]) { ant = ls2[n]; break; }
          if (ant < 0) break;
          usado[ant] = 1;
          var sg2 = segs[ant]; cad.unshift(clave(sg2[0]) === ki ? sg2[1] : sg2[0]);
        }
        cadenas.push(cad);
        dCosido += "M" + cad.map(function (p) { return p[0].toFixed(1) + " " + p[1].toFixed(1); }).join("L");
      }
      return { d: dCosido, cadenas: cadenas };
    }

    /* 3. Definiciones SVG: máscara de legibilidad para el texto izquierdo */
    var defs = el("defs", {}, svg);
    var gradMask = el("linearGradient", { id: "mask-grad", x1: "0%", y1: "0%", x2: "100%", y2: "0%" }, defs);
    el("stop", { offset: "0%", "stop-color": "#fff", "stop-opacity": "0.42" }, gradMask);
    el("stop", { offset: "42%", "stop-color": "#fff", "stop-opacity": "0.52" }, gradMask);
    el("stop", { offset: "62%", "stop-color": "#fff", "stop-opacity": "0.94" }, gradMask);
    el("stop", { offset: "100%", "stop-color": "#fff", "stop-opacity": "1" }, gradMask);
    var mask = el("mask", { id: "hero-mask" }, defs);
    el("rect", { x: 0, y: 0, width: W, height: H, fill: "url(#mask-grad)" }, mask);

    var gRaiz = el("g", { mask: "url(#hero-mask)" }, svg);
    var gCaneva = el("g", { id: "capa-caneva" }, gRaiz);
    var gCurvas = el("g", { id: "capa-curvas" }, gRaiz);
    var gPend = el("g", { id: "capa-pendiente" }, gRaiz);
    var gHidro = el("g", { id: "capa-hidro" }, gRaiz);
    var gLotes = el("g", { id: "capa-lotes" }, gRaiz);
    var gSonda = el("g", { id: "capa-sonda" }, svg);

    /* 4. Capa 0: Canevá cartográfico, coordenadas, rosa de los vientos y escala */
    for (var gx = 150; gx < W; gx += 150) {
      el("line", { x1: gx, y1: 0, x2: gx, y2: H, "class": "can-lin" }, gCaneva);
      var geoX = aGeo(gx, 0);
      el("text", { x: gx + 4, y: 74, "class": "can-txt" }, gCaneva, (geoX.este / 1000).toFixed(1) + " km E");
    }
    for (var gy = 120; gy < H; gy += 120) {
      el("line", { x1: 0, y1: gy, x2: W, y2: gy, "class": "can-lin" }, gCaneva);
      var geoY = aGeo(0, gy);
      el("text", { x: W - 8, y: gy - 4, "text-anchor": "end", "class": "can-txt" }, gCaneva, (geoY.norte / 1000).toFixed(1) + " km N");
      for (var gx2 = 150; gx2 < W; gx2 += 150) {
        el("path", { d: "M" + (gx2 - 4) + " " + gy + "h8M" + gx2 + " " + (gy - 4) + "v8", "class": "can-cruz" }, gCaneva);
      }
    }
    var gNorte = el("g", { transform: "translate(1152,96)" }, gCaneva);
    el("circle", { cx: 0, cy: 0, r: 18, fill: "#fbfdfecc", stroke: "#0b1b2b", "stroke-width": 1, "stroke-opacity": 0.35 }, gNorte);
    el("path", { d: "M0 -14L5 6L0 2L-5 6Z", fill: "#0b1b2b" }, gNorte);
    el("path", { d: "M0 -14L0 2L5 6Z", fill: "#e0533a" }, gNorte);
    el("text", { x: 0, y: -21, "text-anchor": "middle", "class": "can-txt", style: "font-weight:700;fill:#0b1b2b" }, gNorte, "N");

    var gEsc = el("g", { transform: "translate(985,84)" }, gCaneva);
    el("rect", { x: 0, y: 0, width: 60, height: 5, fill: "#0b1b2b", "fill-opacity": 0.7 }, gEsc);
    el("rect", { x: 60, y: 0, width: 60, height: 5, fill: "#fbfdfe", stroke: "#0b1b2b", "stroke-width": 1 }, gEsc);
    el("text", { x: 0, y: 16, "class": "can-txt" }, gEsc, "0");
    el("text", { x: 60, y: 16, "text-anchor": "middle", "class": "can-txt" }, gEsc, "250 m");
    el("text", { x: 120, y: 16, "text-anchor": "end", "class": "can-txt" }, gEsc, "500 m");

    /* 5. Capa 1: Ráster DEM con sombreado analítico interactivo (Hillshade) + curvas de nivel (2600 a 3275 m) */
    var cDem = document.createElement("canvas");
    cDem.className = "dem-canvas"; cDem.width = 240; cDem.height = 144;
    hero.insertBefore(cDem, svg);
    var ctxDem = cDem.getContext && cDem.getContext("2d");
    var RW = 240, RH = 144, RN = RW * RH;
    var demNx = new Float32Array(RN), demNy = new Float32Array(RN), demNz = new Float32Array(RN);
    var demR = new Uint8Array(RN), demG = new Uint8Array(RN), demB = new Uint8Array(RN), demA = new Uint8Array(RN);
    var imgDem = ctxDem ? ctxDem.createImageData(RW, RH) : null;
    if (ctxDem) {
      for (var ry = 0, pi = 0; ry < RH; ry++) {
        var vyR = (ry + 0.5) * (H / RH);
        for (var rx = 0; rx < RW; rx++, pi++) {
          var vxR = (rx + 0.5) * (W / RW);
          var zR = elev(vxR, vyR), gR = grad(vxR, vyR);
          var nxR = -gR.dzx / ESCALA_M, nyR = -gR.dzy / ESCALA_M, nzR = 0.26;
          var invN = 1 / Math.hypot(nxR, nyR, nzR);
          demNx[pi] = nxR * invN; demNy[pi] = nyR * invN; demNz[pi] = nzR * invN;
          var tZ = Math.max(0, Math.min(1, (zR - 2580) / 680));
          /* Rampa hipsométrica estilo QGIS (azul valle -> verde esmeralda -> ocre -> terracota cumbre) */
          var cr, cg, cb;
          if (tZ < 0.35) { var u1 = tZ / 0.35; cr = 212 - u1 * 48; cg = 232 - u1 * 12; cb = 238 - u1 * 38; }
          else if (tZ < 0.7) { var u2 = (tZ - 0.35) / 0.35; cr = 164 + u2 * 68; cg = 220 - u2 * 22; cb = 200 - u2 * 52; }
          else { var u3 = (tZ - 0.7) / 0.3; cr = 232 + u3 * 18; cg = 198 - u3 * 52; cb = 148 - u3 * 36; }
          demR[pi] = cr; demG[pi] = cg; demB[pi] = cb;
          var fMask = vxR < 520 ? 0.22 + (vxR / 520) * 0.25 : Math.min(0.82, 0.47 + ((vxR - 520) / 420) * 0.35);
          demA[pi] = Math.round(fMask * (65 + tZ * 115));
        }
      }
    }
    function pintarDem(cx, cy) {
      if (!ctxDem || !imgDem) return;
      var d = imgDem.data, lx = (cx - W * 0.55) / 520 - 0.55, ly = (cy - H * 0.5) / 420 - 0.55, lz = 0.72;
      var invL = 1 / Math.hypot(lx, ly, lz); lx *= invL; ly *= invL; lz *= invL;
      var rCx = cx * (RW / W), rCy = cy * (RH / H), rLente2 = 8.4 * 8.4;
      for (var i = 0, p = 0; i < RN; i++, p += 4) {
        var sh = demNx[i] * lx + demNy[i] * ly + demNz[i] * lz;
        var luz = Math.max(0.58, Math.min(1.22, 0.68 + sh * 0.52));
        var ix = i % RW, iy = (i / RW) | 0;
        var dxL = ix - rCx, dyL = iy - rCy, dist2 = dxL * dxL + dyL * dyL;
        if (dist2 < rLente2) {
          /* Lupa multiespectral NDVI / pendiente dentro del anillo de la sonda */
          d[p] = Math.min(255, (demR[i] * 0.45 + (1 - demNz[i]) * 380) | 0);
          d[p + 1] = Math.min(255, (demG[i] * 0.85 + sh * 45) | 0);
          d[p + 2] = Math.min(255, (demB[i] * 0.55) | 0);
          d[p + 3] = Math.min(220, demA[i] + 55);
        } else {
          d[p] = Math.min(255, (demR[i] * luz) | 0);
          d[p + 1] = Math.min(255, (demG[i] * luz) | 0);
          d[p + 2] = Math.min(255, (demB[i] * luz) | 0);
          d[p + 3] = demA[i];
        }
      }
      ctxDem.putImageData(imgDem, 0, 0);
    }

    var capasParalaje = [];

    for (var cota = 2600, idxC = 0; cota <= 3275; cota += 25, idxC++) {
      var esMaestra = cota % 100 === 0, esAlta = cota >= 3100;
      var resC = marchar(cota, true);
      if (!resC.d) continue;
      var cls = "curva" + (esMaestra ? " maestra" : "") + (esAlta ? " alta" : "");
      var gNivel = el("g", {}, gCurvas); capasParalaje.push({ g: gNivel, f: (cota - 2580) / 700 });
      var pCurva = el("path", { d: resC.d, "class": cls }, gNivel);
      if (!reduce && esMaestra) {
        pCurva.style.strokeDasharray = 3600; pCurva.style.strokeDashoffset = 3600;
        pCurva.style.transition = "stroke-dashoffset 2.2s ease-out " + (idxC * 0.04) + "s";
        requestAnimationFrame(function (q) { return function () { requestAnimationFrame(function () { q.style.strokeDashoffset = 0; }); }; }(pCurva));
      }
      if (esMaestra) {
        resC.cadenas.forEach(function (cad) {
          if (cad.length < 28) return;
          var mIdx = Math.floor(cad.length * 0.55), pm = cad[mIdx], pa = cad[mIdx - 2], pb = cad[mIdx + 2];
          if (!pm || pm[0] < 540 || pm[0] > 1140 || pm[1] < 60 || pm[1] > 660) return;
          var ang = Math.atan2(pb[1] - pa[1], pb[0] - pa[0]) * 180 / Math.PI;
          if (ang > 90) ang -= 180; if (ang < -90) ang += 180;
          el("text", {
            x: pm[0].toFixed(1), y: (pm[1] + 3).toFixed(1), "text-anchor": "middle",
            transform: "rotate(" + ang.toFixed(1) + " " + pm[0].toFixed(1) + " " + pm[1].toFixed(1) + ")",
            "class": "cota-lbl" + (esAlta ? " alta" : "")
      }, gNivel, cota + " msnm");
        });
      }
    }
    cumbres.forEach(function (c) {
      if (!c.nom) return;
      el("text", { x: c.cx, y: c.cy - 6, "text-anchor": "middle", "class": "cumbre-lbl" }, gCurvas, c.nom);
    });

    /* 6. Capa 2: Red TIN y campo vectorial de pendientes (reactivo al cursor) */
    var nodosTIN = [
      [915, 255], [785, 210], [1045, 220], [830, 355], [985, 365],
      [1065, 505], [910, 485], [695, 515], [625, 185], [680, 340], [1135, 370]
    ];
    var paresTIN = [[0,1],[0,2],[0,3],[0,4],[1,8],[1,9],[3,9],[3,6],[4,2],[4,5],[4,6],[4,10],[5,6],[5,10],[6,7],[3,7],[8,9]];
    var dTIN = paresTIN.map(function (pr) {
      var a = nodosTIN[pr[0]], b = nodosTIN[pr[1]];
      return "M" + a[0] + " " + a[1] + "L" + b[0] + " " + b[1];
    }).join("");
    el("path", { d: dTIN, "class": "tin-arista" }, gPend);

    var vectores = [];
    for (var vy = 84; vy <= H - 70; vy += 54) {
      for (var vx = 480; vx <= W - 45; vx += 54) {
        var gr = grad(vx, vy);
        if (gr.deg < 3.5) continue;
        var len = Math.min(20, 6 + gr.deg * 0.55);
        var rad = (gr.asp - 90) * Math.PI / 180;
        var ux = Math.cos(rad), uy = Math.sin(rad);
        var col = gr.deg > 22 ? "#e0533a" : gr.deg > 13 ? "#6b4fc7" : "#0b6e8a";
        var lin = el("line", {
          x1: vx.toFixed(1), y1: vy.toFixed(1),
          x2: (vx + ux * len).toFixed(1), y2: (vy + uy * len).toFixed(1),
          stroke: col, "stroke-opacity": 0.42, "class": "vec-pend"
        }, gPend);
        vectores.push({ x: vx, y: vy, ux: ux, uy: uy, len: len, el: lin });
      }
    }

    /* 7. Capa 3: Red de escorrentía superficial D8 + trazador hidrológico en vivo */
    function trazarFlujo(x0, y0, pasos, pasoPx) {
      var x = x0, y = y0, pts = [[x, y]];
      for (var i = 0; i < pasos; i++) {
        var g = grad(x, y), m = Math.hypot(g.dzx, g.dzy);
        if (m < 0.015) break;
        x -= (g.dzx / m) * pasoPx;
        y -= (g.dzy / m) * pasoPx;
        if (x < 10 || x > W - 10 || y < 10 || y > H - 10) break;
        pts.push([x, y]);
      }
      return pts;
    }
    var semillasHidro = [[865, 235], [955, 290], [820, 310], [1025, 470], [725, 475], [645, 220]];
    semillasHidro.forEach(function (s) {
      var tr = trazarFlujo(s[0], s[1], 55, 11);
      if (tr.length > 5) {
        el("path", { d: "M" + tr.map(function (p) { return p[0].toFixed(1) + " " + p[1].toFixed(1); }).join("L"), "class": "drenaje" }, gHidro);
      }
    });
    var pFlujoVivo = el("path", { d: "", "class": "flujo-vivo" }, gHidro);
    var cDescarga = el("circle", { cx: -20, cy: -20, r: 4, fill: "#009ec2", stroke: "#fff", "stroke-width": 1.5 }, gHidro);

    /* 8. Capa 4: Polígonos prediales georreferenciados (Papa, Arándano, Ensayo, Reserva EUDR) */
    var lotes = [
      { id: "LOTE P-01", uso: "Papa Diacol Capiro · 6,4 ha · NDVI 0,78", col: "#0b6e8a",
        pts: [[760, 155], [855, 140], [870, 215], [775, 235]] },
      { id: "LOTE A-04", uso: "Arándano Biloxi · 3,8 ha · NDVI 0,82", col: "#6b4fc7",
        pts: [[945, 325], [1035, 310], [1050, 385], [955, 395]] },
      { id: "ENSAYO E-12", uso: "Bioinsumos DBCA (120 UE) · 2,1 ha", col: "#e0533a",
        pts: [[615, 420], [705, 405], [720, 470], [625, 485]] },
      { id: "RESERVA R-02", uso: "Bosque altoandino · EUDR conforme · 11,2 ha", col: "#1b8a5a",
        pts: [[1020, 145], [1135, 130], [1150, 235], [1040, 245]] }
    ];
    lotes.forEach(function (lt) {
      var gL = el("g", { "class": "lote-g" }, gLotes);
      lt.el = gL;
      var strPts = lt.pts.map(function (p) { return p[0] + "," + p[1]; }).join(" ");
      el("polygon", { points: strPts, fill: lt.col, stroke: lt.col, "class": "lote-poly" }, gL);
      var cx = 0, cy = 0;
      lt.pts.forEach(function (p) {
        cx += p[0]; cy += p[1];
        el("rect", { x: p[0] - 3, y: p[1] - 3, width: 6, height: 6, "class": "lote-vert" }, gL);
      });
      cx /= lt.pts.length; cy /= lt.pts.length;
      el("text", { x: cx.toFixed(1), y: cy.toFixed(1), "text-anchor": "middle", "class": "lote-lbl" }, gL, lt.id);
    });

    function enPoligono(x, y, pts) {
      var dentro = false;
      for (var i = 0, j = pts.length - 1; i < pts.length; j = i++) {
        var xi = pts[i][0], yi = pts[i][1], xj = pts[j][0], yj = pts[j][1];
        if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) dentro = !dentro;
      }
      return dentro;
    }

    /* 9. Capa 5: Sonda interactiva en vivo, isohipsa dinámica y transecto A-B */
    var pIsoViva = el("path", { d: "", "class": "iso-viva" }, gSonda);
    var lHiloX = el("line", { x1: 0, y1: 0, x2: W, y2: 0, "class": "hilo" }, gSonda);
    var lHiloY = el("line", { x1: 0, y1: 0, x2: 0, y2: H, "class": "hilo" }, gSonda);
    var lTransecto = el("line", { x1: 0, y1: 0, x2: 0, y2: 0, "class": "transecto", hidden: "" }, gSonda);
    var cPtoA = el("circle", { cx: -20, cy: -20, r: 5.5, "class": "pto-ab", hidden: "" }, gSonda);
    var cPtoB = el("circle", { cx: -20, cy: -20, r: 5.5, "class": "pto-ab", hidden: "" }, gSonda);
    var tLblA = el("text", { x: -20, y: -20, "class": "lbl-ab", hidden: "" }, gSonda, "A");
    var tLblB = el("text", { x: -20, y: -20, "class": "lbl-ab", hidden: "" }, gSonda, "B");

    var gCursor = el("g", { transform: "translate(880,280)" }, gSonda);
    el("circle", { cx: 0, cy: 0, r: 42, "class": "sonda-anillo" }, gCursor);
    el("path", { d: "M-48 0h10M38 0h10M0 -48v10M0 38v10", stroke: "#0b1b2b", "stroke-width": 1.3, "stroke-opacity": 0.6 }, gCursor);
    var lAsp = el("line", { x1: 0, y1: 0, x2: 24, y2: 0, "class": "sonda-asp" }, gCursor);
    el("circle", { cx: 0, cy: 0, r: 4.5, "class": "sonda-centro" }, gCursor);
    var rTag = el("rect", { x: 14, y: -28, width: 148, height: 20, "class": "sonda-tag" }, gCursor);
    var tTag = el("text", { x: 20, y: -14, "class": "sonda-txt" }, gCursor, "2948 msnm · 16,8° NO");

    /* 10. HUD y gráfico de perfil topográfico en vivo */
    var hCoord = $("#hud-coord"), hCota = $("#hud-cota"), hPend = $("#hud-pend"), hObj = $("#hud-obj");
    var hTit = $("#hud-perfil-tit"), hDes = $("#hud-perfil-des"), svgPerf = $("#hud-perfil"), btnLimpiar = $("#hud-limpiar");
    var pPerfArea = el("path", { d: "", fill: "#0b6e8a", "fill-opacity": 0.32 }, svgPerf);
    var pPerfLinea = el("path", { d: "", fill: "none", stroke: "#3d9fb8", "stroke-width": 2 }, svgPerf);
    var cPerfPin = el("circle", { cx: 110, cy: 26, r: 3.8, fill: "#ff7a59", stroke: "#08131f", "stroke-width": 1.5 }, svgPerf);

    var ptoA = null, ptoB = null;

    function dibujarPerfil(p1, p2, cursorEnMedio) {
      var muestras = 32, zs = [], zMin = Infinity, zMax = -Infinity;
      for (var i = 0; i <= muestras; i++) {
        var t = i / muestras;
        var px = p1[0] + (p2[0] - p1[0]) * t, py = p1[1] + (p2[1] - p1[1]) * t;
        var z = elev(px, py);
        zs.push(z);
        if (z < zMin) zMin = z; if (z > zMax) zMax = z;
      }
      var span = Math.max(30, zMax - zMin), PW = 220, PH = 52, pad = 5;
      var pts = zs.map(function (z, idx) {
        var x = (idx / muestras) * PW;
        var y = PH - pad - ((z - zMin) / span) * (PH - pad * 2);
        return [x, y];
      });
      var dLin = "M" + pts.map(function (p) { return p[0].toFixed(1) + " " + p[1].toFixed(1); }).join("L");
      pPerfLinea.setAttribute("d", dLin);
      pPerfArea.setAttribute("d", dLin + "L" + PW + " " + PH + "L0 " + PH + "Z");
      var idxPin = cursorEnMedio ? Math.floor(muestras / 2) : muestras;
      cPerfPin.setAttribute("cx", pts[idxPin][0].toFixed(1));
      cPerfPin.setAttribute("cy", pts[idxPin][1].toFixed(1));
      var distM = Math.round(Math.hypot(p2[0] - p1[0], p2[1] - p1[1]) * ESCALA_M);
      var dZ = Math.round(zs[muestras] - zs[0]);
      if (cursorEnMedio) {
        hTit.textContent = "Perfil local (" + distM + " m)";
        hDes.textContent = Math.round(zMin) + " a " + Math.round(zMax) + " msnm";
      } else {
        hTit.textContent = "Transecto A-B (" + distM + " m)";
        hDes.textContent = "ΔZ " + (dZ >= 0 ? "+" : "") + dZ + " m";
      }
    }

    function actualizarSonda(x, y) {
      x = Math.max(20, Math.min(W - 20, x));
      y = Math.max(20, Math.min(H - 20, y));
      var z = elev(x, y), gr = grad(x, y), geo = aGeo(x, y);

      lHiloX.setAttribute("y1", y.toFixed(1)); lHiloX.setAttribute("y2", y.toFixed(1));
      lHiloY.setAttribute("x1", x.toFixed(1)); lHiloY.setAttribute("x2", x.toFixed(1));
      gCursor.setAttribute("transform", "translate(" + x.toFixed(1) + "," + y.toFixed(1) + ")");

      var radAsp = (gr.asp - 90) * Math.PI / 180;
      lAsp.setAttribute("x2", (Math.cos(radAsp) * 28).toFixed(1));
      lAsp.setAttribute("y2", (Math.sin(radAsp) * 28).toFixed(1));

      var txtSonda = Math.round(z) + " msnm · " + gr.deg.toFixed(1).replace(".", ",") + "° " + gr.rum;
      tTag.textContent = txtSonda;
      var tagIzq = x > W - 170;
      rTag.setAttribute("x", tagIzq ? -162 : 14);
      tTag.setAttribute("x", tagIzq ? -156 : 20);

      /* Isohipsa exacta bajo el cursor, sombreado DEM dinámico y paralaje 2.5D por altitud */
      pIsoViva.setAttribute("d", marchar(z, false).d);
      if (!gCurvas.hasAttribute("hidden")) {
        pintarDem(x, y);
        var nxP = (x / W - 0.5) * 26, nyP = (y / H - 0.5) * 18;
        for (var ip = 0; ip < capasParalaje.length; ip++) {
          var cp = capasParalaje[ip];
          cp.g.setAttribute("transform", "translate(" + (nxP * cp.f).toFixed(1) + "," + (nyP * cp.f).toFixed(1) + ")");
        }
      }

      /* Escorrentía en vivo pendiente abajo */
      if (!gHidro.hasAttribute("hidden")) {
        var fl = trazarFlujo(x, y, 42, 11);
        if (fl.length > 2) {
          pFlujoVivo.setAttribute("d", "M" + fl.map(function (p) { return p[0].toFixed(1) + " " + p[1].toFixed(1); }).join("L"));
          var ult = fl[fl.length - 1];
          cDescarga.setAttribute("cx", ult[0].toFixed(1)); cDescarga.setAttribute("cy", ult[1].toFixed(1));
        }
      }

      /* Campo de vectores de pendiente reactivo al radio de la sonda */
      if (!gPend.hasAttribute("hidden")) {
        for (var i = 0; i < vectores.length; i++) {
          var v = vectores[i], d = Math.hypot(v.x - x, v.y - y);
          var f = d < 165 ? 1 + (1 - d / 165) * 0.75 : 1;
          v.el.setAttribute("x2", (v.x + v.ux * v.len * f).toFixed(1));
          v.el.setAttribute("y2", (v.y + v.uy * v.len * f).toFixed(1));
          v.el.setAttribute("stroke-opacity", d < 165 ? "0.88" : "0.38");
        }
      }

      /* Detección de polígono de lote bajo el cursor */
      var loteActivo = null;
      for (var j = 0; j < lotes.length; j++) {
        var dentro = enPoligono(x, y, lotes[j].pts);
        lotes[j].el.classList.toggle("activo", dentro);
        if (dentro) loteActivo = lotes[j];
      }

      if (hCoord) hCoord.textContent = geo.dms;
      if (hCota) hCota.textContent = Math.round(z).toLocaleString("es-CO") + " msnm";
      if (hPend) hPend.textContent = gr.deg.toFixed(1).replace(".", ",") + "° (" + Math.round(gr.pct) + " %) · " + gr.rum;

      if (ptoA) {
        var dest = ptoB || [x, y];
        lTransecto.setAttribute("x1", ptoA[0].toFixed(1)); lTransecto.setAttribute("y1", ptoA[1].toFixed(1));
        lTransecto.setAttribute("x2", dest[0].toFixed(1)); lTransecto.setAttribute("y2", dest[1].toFixed(1));
        cPtoB.setAttribute("cx", dest[0].toFixed(1)); cPtoB.setAttribute("cy", dest[1].toFixed(1));
        tLblB.setAttribute("x", (dest[0] + 8).toFixed(1)); tLblB.setAttribute("y", (dest[1] - 8).toFixed(1));
        cPtoB.removeAttribute("hidden"); tLblB.removeAttribute("hidden");
        dibujarPerfil(ptoA, dest, false);
        if (hObj) hObj.textContent = ptoB ? "Transecto A-B fijado (clic para reiniciar)" : "Mueve y haz clic para fijar B";
      } else {
        /* Perfil local en la dirección de máxima pendiente (±60 px ≈ ±250 m) */
        var dxP = Math.cos(radAsp) * 58, dyP = Math.sin(radAsp) * 58;
        dibujarPerfil([x - dxP, y - dyP], [x + dxP, y + dyP], true);
        if (hObj) hObj.textContent = loteActivo ? loteActivo.id + " · " + loteActivo.uso : "Clic en el mapa: medir perfil A-B";
      }
    }

    function limpiarAB() {
      ptoA = null; ptoB = null;
      lTransecto.setAttribute("hidden", ""); cPtoA.setAttribute("hidden", ""); cPtoB.setAttribute("hidden", "");
      tLblA.setAttribute("hidden", ""); tLblB.setAttribute("hidden", "");
      if (btnLimpiar) btnLimpiar.hidden = true;
    }

    function aCoordSVG(e) {
      var r = svg.getBoundingClientRect();
      if (!r.width || !r.height) return [880, 280];
      var esc = Math.max(r.width / W, r.height / H);
      var ox = (r.width - W * esc) / 2, oy = (r.height - H * esc) / 2;
      return [(e.clientX - r.left - ox) / esc, (e.clientY - r.top - oy) / esc];
    }

    /* Interacción con puntero y clic para transecto A-B */
    var manual = false, raf = 0, ultPt = [885, 275];
    hero.addEventListener("pointermove", function (e) {
      if (e.target.closest && e.target.closest(".gis-hud")) return;
      manual = true;
      ultPt = aCoordSVG(e);
      if (raf) return;
      raf = requestAnimationFrame(function () { raf = 0; actualizarSonda(ultPt[0], ultPt[1]); });
    }, { passive: true });

    hero.addEventListener("pointerleave", function () { if (!ptoA) manual = false; });

    hero.addEventListener("click", function (e) {
      if (e.target.closest && e.target.closest("a, button, .gis-hud")) return;
      manual = true;
      var pt = aCoordSVG(e);
      if (!ptoA) {
        ptoA = pt; ptoB = null;
        cPtoA.setAttribute("cx", pt[0].toFixed(1)); cPtoA.setAttribute("cy", pt[1].toFixed(1));
        tLblA.setAttribute("x", (pt[0] + 8).toFixed(1)); tLblA.setAttribute("y", (pt[1] - 8).toFixed(1));
        cPtoA.removeAttribute("hidden"); tLblA.removeAttribute("hidden"); lTransecto.removeAttribute("hidden");
        if (btnLimpiar) btnLimpiar.hidden = false;
      } else if (!ptoB) {
        ptoB = pt;
      } else {
        limpiarAB();
      }
      actualizarSonda(pt[0], pt[1]);
    });

    if (btnLimpiar) btnLimpiar.addEventListener("click", function () { limpiarAB(); actualizarSonda(ultPt[0], ultPt[1]); });

    /* Botones de capas en el HUD */
    var mapaCapas = { curvas: gCurvas, pendiente: gPend, hidro: gHidro, lotes: gLotes };
    [].forEach.call(document.querySelectorAll(".hud-chip[data-capa]"), function (b) {
      b.addEventListener("click", function () {
        var k = b.dataset.capa, g = mapaCapas[k];
        if (!g) return;
        var vis = b.getAttribute("aria-pressed") !== "true";
        b.setAttribute("aria-pressed", vis ? "true" : "false");
        if (vis) g.removeAttribute("hidden"); else g.setAttribute("hidden", "");
        if (k === "curvas") cDem.hidden = !vis;
        actualizarSonda(ultPt[0], ultPt[1]);
      });
    });

    /* Escaneo orbital autónomo mientras el usuario no mueve el cursor */
    actualizarSonda(885, 275);
    if (reduce) return;
    var heroVis = true;
    if ("IntersectionObserver" in window) {
      var ioH = new IntersectionObserver(function (es) { heroVis = es[0].isIntersecting; }, { threshold: 0.05 });
      ioH.observe(hero);
    }
    (function orbita(t) {
      if (heroVis && !manual && !ptoA) {
        var s = t * 0.00045;
        var ox = 865 + Math.cos(s) * 195 + Math.sin(s * 2.1) * 55;
        var oy = 330 + Math.sin(s * 1.3) * 155 + Math.cos(s * 0.7) * 40;
        ultPt = [ox, oy];
        actualizarSonda(ox, oy);
      }
      requestAnimationFrame(orbita);
    })(0);
  })();

  /* ---------- embudo guiado (4 pasos) ---------- */
  (function embudo() {
    var est = { linea: null, sit: null, datos: null, plazo: null, todas: false };
    var bl = $("#e-linea"), bs = $("#situaciones"), bd = $("#e-datos"), bp = $("#e-plazo"), res = $("#resultado"), ver = $("#e-ver"), btnTodas = $("#e-todas");

    function icono(it) {
      var s = it.servicio && serv(it.servicio);
      return s ? '<svg class="ic" viewBox="0 0 40 40" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#i-' + s.icono + '"/></svg>' : "";
    }
    function marcar(box, b) {
      [].forEach.call(box.children, function (x) { x.setAttribute("aria-checked", "false"); });
      b.setAttribute("aria-checked", "true");
    }
    /* desmarcable: los pasos opcionales se pueden volver a pulsar para quitar la respuesta */
    function grupo(box, items, alElegir, desmarcable) {
      box.innerHTML = "";
      items.forEach(function (it, i) {
        var b = h("button", { type: "button", role: "radio", "aria-checked": "false" }, box, esc(it.t || it.texto) + icono(it));
        b.addEventListener("click", function () {
          if (desmarcable && b.getAttribute("aria-checked") === "true") { b.setAttribute("aria-checked", "false"); alElegir(null); return; }
          marcar(box, b); alElegir(it);
        });
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
      var lista = est.todas ? D.situaciones : D.situaciones.filter(function (s) { return s.linea.indexOf(est.linea) >= 0; });
      /* al productor se le muestran primero los problemas de campo */
      if (est.linea === "productor") {
        var orden = ["agro", "geo", "datos", "proyectos", "investigacion"];
        var peso = function (s) { var sv = s.servicio && serv(s.servicio); return sv ? orden.indexOf(sv.cat) : 99; };
        lista = lista.slice().sort(function (x, y) { return peso(x) - peso(y); });
      }
      grupo(bs, lista, function (s) { est.sit = s; render(); });
    }
    function elegirLinea(id) {
      var i = Object.keys(D.lineas).indexOf(id);
      if (i < 0 || !bl.children[i]) return;
      marcar(bl, bl.children[i]); est.linea = id; situaciones(); render();
    }
    function opcion(lista, id) { return lista.filter(function (o) { return o.id === id; })[0]; }

    function resumen() {
      var L = D.lineas[est.linea], sv = est.sit.servicio ? serv(est.sit.servicio) : null;
      var datos = opcion(D.opcionesDatos, est.datos), plazo = opcion(D.opcionesPlazo, est.plazo);
      var p = ["Soy " + L.frase + ".", "Mi situación: " + est.sit.texto.toLowerCase() + "."];
      if (sv) p.push("Me interesa: " + sv.titulo + (sv.estado === "preparacion" ? " (servicio en preparación)" : "") + ".");
      if (datos) p.push("Datos: " + datos.t.toLowerCase() + ".");
      if (plazo) p.push("Plazo: " + plazo.t.toLowerCase() + ".");
      return p.join(" ");
    }
    function render() {
      ver.hidden = !(est.linea && est.sit);
      ["#paso-3", "#paso-4"].forEach(function (id) { $(id).classList.toggle("espera", !(est.linea && est.sit)); });
      if (!est.linea || !est.sit) {
        res.innerHTML = '<p class="vacio">Responde los pasos 1 y 2 y aquí aparece qué te entregamos.</p>';
        return;
      }
      var sv = est.sit.servicio ? serv(est.sit.servicio) : null, txt = resumen();
      var sel = $("#f-servicio"); if (sel) sel.value = sv ? sv.id : "otro";
      var datos = opcion(D.opcionesDatos, est.datos), plazo = opcion(D.opcionesPlazo, est.plazo);
      var extra = (datos || plazo) ? '<p class="e-extra">' + (datos ? esc(datos.t) : "") + (datos && plazo ? " · " : "") + (plazo ? esc(plazo.t) : "") + "</p>" : "";
      var lider = sv && sv.responsables && sv.responsables.length ? '<dt>Lo lidera</dt><dd>' + esc(sv.responsables.join(" y ")) + '</dd>' : '';
      var cuerpo = !sv
        ? '<h3>Conversemos tu caso</h3><p>Con tu caso en pocas líneas te decimos si lo resolvemos, con quién del equipo y cómo empezar.</p>'
        : sv.estado === "preparacion"
          ? '<h3>' + esc(sv.titulo) + '</h3><p class="e-prep"><b>En preparación.</b> ' + esc(sv.desc) + ' Cuéntanos tu caso y te decimos si podemos atenderlo ya y con quién del equipo.</p>' + (lider ? '<dl>' + lider + '</dl>' : '')
          : '<h3>' + esc(sv.titulo) + '</h3><dl><dt>Te entregamos</dt><dd>' + esc(sv.entrega) + '</dd>' + lider + '<dt>Respaldo</dt><dd>' + esc(sv.respaldo) + '</dd></dl>';
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
    grupo(bd, D.opcionesDatos, function (o) { est.datos = o ? o.id : null; render(); }, true);
    grupo(bp, D.opcionesPlazo, function (o) { est.plazo = o ? o.id : null; render(); }, true);
    btnTodas.addEventListener("click", function () {
      est.todas = !est.todas;
      btnTodas.setAttribute("aria-pressed", est.todas ? "true" : "false");
      btnTodas.textContent = est.todas ? "Ver solo las de mi perfil" : "Ver todas las situaciones";
      situaciones(); render();
    });
    situaciones();
    [].forEach.call(document.querySelectorAll("[data-linea]"), function (x) {
      x.addEventListener("click", function (e) {
        e.preventDefault();
        elegirLinea(x.dataset.linea);
        var p1 = $("#paso-1"), p2 = $("#paso-2");
        p1.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
        p2.classList.add("resalta"); setTimeout(function () { p2.classList.remove("resalta"); }, 2200);
      });
    });
    render();
  })();

  /* ---------- servicios: cinco líneas, tarjetas y servicios en preparación ---------- */
  (function servicios() {
    var rej = $("#rejilla"), perfiles = { academica: "Académico", empresarial: "Empresarial", productor: "Productor" };
    function chips(s) {
      return (s.responsables && s.responsables.length)
        ? '<p class="lidera"><span>Lidera</span>' + s.responsables.map(function (n) { return '<a href="#equipo" data-persona="' + esc(n) + '">' + esc(n) + '</a>'; }).join("") + '</p>' : "";
    }
    /* cada tarjeta se puede contraer: contraída muestra icono, etiquetas, título y quién la lidera */
    var cerrarInicial = true, todas = null; /* todas empiezan contraídas: cada visitante despliega las que le interesan */
    function poner(c, abrir) {
      c.classList.toggle("cerrada", !abrir);
      c.querySelector(".serv-toggle").setAttribute("aria-expanded", abrir ? "true" : "false");
      c.querySelector(".serv-cuerpo").hidden = !abrir;
    }
    function etiquetaTodas() { if (todas) todas.textContent = rej.querySelector('.serv-toggle[aria-expanded="true"]') ? "Contraer todas" : "Expandir todas"; }
    function tarjeta(s, box) {
      var prep = s.estado === "preparacion", abierta = !cerrarInicial;
      h("article", { "class": "serv rev" + (prep ? " prep" : "") + (abierta ? "" : " cerrada"), "data-id": s.id }, box,
        '<svg viewBox="0 0 40 40" aria-hidden="true"><use href="#i-' + s.icono + '"/></svg>' +
        '<p class="tags">' + s.linea.map(function (l) { return '<span>' + perfiles[l] + '</span>'; }).join("") + (prep ? '<span class="tag-prep">En preparación</span>' : '') + '</p>' +
        '<h3><button type="button" class="serv-toggle" aria-expanded="' + abierta + '" aria-controls="sc-' + esc(s.id) + '"><span>' + esc(s.titulo) + '</span><i class="chev" aria-hidden="true"></i></button></h3>' +
        chips(s) +
        '<div class="serv-cuerpo" id="sc-' + esc(s.id) + '"' + (abierta ? '' : ' hidden') + '>' +
        (prep ? '<p>' + esc(s.desc) + '</p>' : '<p class="para">Para: ' + esc(s.para) + '.</p><p>' + esc(s.entrega) + '</p>') +
        (s.incluye && s.incluye.length ? '<details class="incl"><summary>Qué incluye (' + s.incluye.length + ')</summary><ul class="incluye">' + s.incluye.map(function (i) { return '<li' + (i.prep ? ' class="prep"' : '') + '><b>' + esc(i.t) + '</b><span>' + esc(i.d) + '</span></li>'; }).join("") + '</ul></details>' : '') +
        (s.limites ? '<p class="lim">' + esc(s.limites) + '</p>' : '') +
        '<a class="cta" href="#contacto" data-serv="' + esc(s.id) + '">' + (prep ? 'Pedir información →' : 'Pedir cotización →') + '</a>' +
        '<p class="resp"><b>RESPALDO</b> ' + (prep ? 'En preparación: se publicará cuando esté documentado.' : esc(s.respaldo)) + '</p>' +
        '</div>');
    }
    rej.addEventListener("click", function (e) {
      var b = e.target.closest && e.target.closest(".serv-toggle"); if (!b) return;
      var c = b.closest(".serv"); poner(c, c.classList.contains("cerrada")); etiquetaTodas();
    });
    var bloques = [];
    Object.keys(D.lineasServicio).forEach(function (k) {
      var L = D.lineasServicio[k];
      var act = D.servicios.filter(function (s) { return s.cat === k && s.estado !== "preparacion"; });
      var prep = D.servicios.filter(function (s) { return s.cat === k && s.estado === "preparacion"; });
      var blq = h("section", { "class": "bloque", "data-cat": k, "aria-labelledby": "h-" + k }, rej,
        '<h3 id="h-' + k + '">' + esc(L.titulo) + '</h3><p class="bloque-lema">' + esc(L.lema) + '</p>');
      var grid = h("div", { "class": "rejilla" }, blq);
      act.forEach(function (s) { tarjeta(s, grid); });
      prep.forEach(function (s) { tarjeta(s, grid); });
      bloques.push({ k: k, titulo: L.titulo, n: act.length + prep.length, blq: blq });
    });

    var sel = $("#f-servicio");
    D.servicios.forEach(function (s) { h("option", { value: s.id }, sel, esc(s.titulo) + (s.estado === "preparacion" ? " (en preparación)" : "")); });
    h("option", { value: "otro" }, sel, "Otro / no lo sé todavía");

    /* «Pedir cotización» deja el servicio elegido en el formulario (también el enlace del validador GIS) */
    document.addEventListener("click", function (e) {
      var l = e.target.closest && e.target.closest("[data-serv]"); if (!l) return;
      var s = $("#f-servicio"); if (s) s.value = l.dataset.serv;
    });

    /* filtros por línea */
    var fil = $("#filtros"), total = D.servicios.length;
    [{ k: "todas", t: "Todas las líneas (" + total + ")" }].concat(bloques.map(function (b) { return { k: b.k, t: b.titulo + " (" + b.n + ")" }; })).forEach(function (f, i) {
      var b = h("button", { type: "button", "class": "chip", "aria-pressed": i === 0 ? "true" : "false" }, fil, esc(f.t));
      b.addEventListener("click", function () {
        [].forEach.call(fil.children, function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
        bloques.forEach(function (bl) { bl.blq.hidden = f.k !== "todas" && bl.k !== f.k; });
      });
    });
    todas = h("button", { type: "button", "class": "chip chip-acc", id: "serv-todas" }, fil, "");
    todas.addEventListener("click", function () {
      var abrir = !rej.querySelector('.serv-toggle[aria-expanded="true"]');
      [].forEach.call(rej.querySelectorAll(".serv"), function (c) { poner(c, abrir); });
      etiquetaTodas();
    });
    etiquetaTodas();
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
    finales.push(function () { [].forEach.call(box.querySelectorAll(".n"), function (n) { n.textContent = Math.round(+n.dataset.n).toLocaleString("es-CO") + n.dataset.s; }); });
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
    var pila = {}, ultima = null;
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
      if (!ultima || p.anio >= ultima.anio) ultima = { anio: p.anio, f: mostrar };
    });
    if (ultima) ultima.f(); /* el artículo más reciente ya aparece leído */
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
    finales.push(function () { [].forEach.call(svg.querySelectorAll("circle.punto-pub"), function (c) { c.style.transition = "none"; c._fin(); }); });
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
        var f = function () { c.setAttribute("fill", "#0b6e8a"); };
        reduce ? f() : setTimeout(f, i * 8);
      });
    }, { threshold: .5 }); io.observe(cont);
    finales.push(function () { dots.forEach(function (c, i) { c.setAttribute("fill", "#0b6e8a"); }); });
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
    finales.push(function () { [].forEach.call(svg.querySelectorAll("g"), function (g) { g.style.transition = "none"; g.style.transform = "scaleY(1)"; }); });
  })();

  /* ---------- gráfica 4: ruta del dato ---------- */
  (function ruta() {
    var cont = $("#g-ruta"), W = 900, H = 170;
    var svg = el("svg", { viewBox: "0 0 " + W + " " + H, role: "img", "aria-label": "Ruta del dato: campo o Excel, limpieza, modelo, informe o tablero" }, cont);
    var nodos = [["Campo y Excel", "tus datos como llegan"], ["Limpieza", "Python · SQL · duplicados"], ["Análisis", "R · PLS-SEM · ANOVA"], ["Entrega", "informe · tablero · DAX"]];
    var paso = (W - 260) / 3, y = 60;
    var flujo = el("path", { d: "M130 " + y + "H" + (W - 130), stroke: "#e0533a", "stroke-width": 3, "stroke-dasharray": "10 8", fill: "none", style: reduce ? "" : "animation:fluye 1.2s linear infinite;animation-play-state:paused" }, svg);
    if (!reduce && "IntersectionObserver" in window) new IntersectionObserver(function (es) { flujo.style.animationPlayState = es[0].isIntersecting ? "running" : "paused"; }).observe(cont);
    nodos.forEach(function (n, i) {
      var x = 130 + paso * i;
      el("circle", { cx: x, cy: y, r: 26, fill: i === 3 ? "#0b6e8a" : "#fbfdfe", stroke: "#0b1b2b", "stroke-width": 3 }, svg);
      el("text", { x: x, y: y + 6, "text-anchor": "middle", "font-size": 18, "font-weight": 700, style: "fill:" + (i === 3 ? "#fff" : "#0b1b2b") }, svg, i + 1);
      el("text", { x: x, y: y + 58, "text-anchor": "middle", "font-size": 16, "font-weight": 700, style: "fill:#0b1b2b;font-family:Georgia,serif" }, svg, n[0]);
      el("text", { x: x, y: y + 80, "text-anchor": "middle", "font-size": 12 }, svg, n[1]);
    });
    /* en celular el SVG se vuelve ilegible: se muestra la misma ruta como lista */
    var ol = h("ol", { "class": "ruta-lista" }, cont);
    nodos.forEach(function (n, i) { h("li", {}, ol, '<span class="n">' + (i + 1) + '</span><div><b>' + esc(n[0]) + '</b><span>' + esc(n[1]) + '</span></div>'); });
  })();

  /* ---------- equipo ---------- */
  (function equipo() {
    var cont = $("#equipo-lista");
    function lidera(p) {
      var lid = D.servicios.filter(function (s) { return (s.responsables || []).indexOf(p.corto) >= 0; });
      return lid.length ? '<p class="lidera-p"><span>Lidera</span>' + lid.map(function (s) { return '<em' + (s.estado === "preparacion" ? ' class="prep" title="En preparación"' : '') + '>' + esc(s.corto) + '</em>'; }).join("") + '</p>' : "";
    }
    D.equipo.forEach(function (p) {
      h("article", { "class": "persona rev" }, cont,
        '<span class="av" aria-hidden="true">' + esc(p.ini) + '</span><h3>' + esc(p.nombre) + '</h3>' +
        '<p class="rol">' + esc(p.rol) + '</p><p class="tit">' + esc(p.titulo) + '</p>' + lidera(p) +
        (p.respaldo ? '<p class="resp-p">' + esc(p.respaldo) + '</p>' : '') +
        (p.orcid ? '<a class="orcid" href="https://orcid.org/' + esc(p.orcid) + '" target="_blank" rel="noopener">ORCID ' + esc(p.orcid) + '</a>' : ''));
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
    /* desde el chip de un servicio: lleva el carrusel a esa persona */
    document.addEventListener("click", function (e) {
      var l = e.target.closest && e.target.closest("[data-persona]"); if (!l) return;
      var i = D.equipo.map(function (p) { return p.corto; }).indexOf(l.dataset.persona);
      if (i >= 0 && cont.children[i]) setTimeout(function () { cont.scrollTo({ left: cont.children[i].offsetLeft - cont.children[0].offsetLeft, behavior: reduce ? "auto" : "smooth" }); }, 350);
    });
  })();

  /* ---------- trayectoria ---------- */
  (function trayectoria() {
    var ol = $("#linea");
    D.trayectoria.forEach(function (t) {
      h("li", { "class": "rev" }, ol, '<span class="f">' + esc(t.fecha) + '</span><div><h3>' + esc(t.cargo) + (t.quien ? ' <span class="quien">' + esc(t.quien) + '</span>' : '') + '</h3><div class="d">' + esc(t.donde) + '</div><p>' + esc(t.texto) + '</p></div>');
    });
  })();

  /* ---------- lista de publicaciones ---------- */
  (function listaPubs() {
    var ul = $("#lista-pubs");
    D.publicaciones.forEach(function (p) {
      h("li", { "class": "rev" }, ul, '<span class="y">' + p.anio + '</span><div><p class="t">' + esc(p.titulo) + '</p><span class="r"><span class="tema">' + esc(p.tema) + '</span>' + esc(p.rev) + ' <a href="https://doi.org/' + p.doi + '" target="_blank" rel="noopener">doi.org/' + esc(p.doi) + '</a></span>' + (p.equipo ? '<span class="eq">Del equipo: ' + esc(p.equipo.join(" · ")) + '</span>' : '') + '</div>');
    });
    var cu = $("#lista-cartillas");
    (D.cartillas || []).forEach(function (c) {
      h("li", { "class": "rev" }, cu, '<span class="y">' + c.anio + '</span><div><p class="t">' + esc(c.titulo) + '</p><span class="r">' + esc(c.ed) + ' · <a href="' + esc(c.url) + '" target="_blank" rel="noopener">Ver en el repositorio</a></span><span class="eq">Del equipo: ' + esc(c.equipo.join(" · ")) + '</span></div>');
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
    var aviso = $("#formu-aviso");
    function marca(campo, ok) { if (ok) campo.removeAttribute("aria-invalid"); else campo.setAttribute("aria-invalid", "true"); }
    [f.nombre, f.caso].forEach(function (x) { x.addEventListener("input", function () { if (x.value.trim()) marca(x, true); }); });
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var nombre = f.nombre.value.trim(), caso = f.caso.value.trim(), falta = [];
      marca(f.nombre, !!nombre); marca(f.caso, !!caso);
      if (!nombre) falta.push("tu nombre"); if (!caso) falta.push("tu caso en pocas líneas");
      if (falta.length) { aviso.textContent = "Falta " + falta.join(" y ") + "."; (nombre ? f.caso : f.nombre).focus(); return; }
      aviso.textContent = "";
      var sv = serv(f.servicio.value), t = sv ? sv.titulo : "otro tema";
      var msg = "Hola, equipo de Consultoría. Soy " + nombre + ". Me interesa: " + t + ".\n\n" + caso;
      if (via === "correo") {
        var copiado = navigator.clipboard && navigator.clipboard.writeText ? navigator.clipboard.writeText(msg).then(function () { return true; }, function () { return false; }) : Promise.resolve(false);
        copiado.then(function (ok) {
          aviso.textContent = ok ? "Abriendo tu programa de correo. Si no se abre, el mensaje ya quedó copiado: pégalo en un correo a " + c.correo + "."
                                 : "Abriendo tu programa de correo. Si no se abre, escribe a " + c.correo + ".";
        });
        location.href = "mailto:" + c.correo + "?subject=" + encodeURIComponent("Consulta: " + t) + "&body=" + encodeURIComponent(msg);
      } else window.open(waLink(msg), "_blank", "noopener");
    });
  })();

  /* ---------- impresión: fija el estado final de contadores y gráficas, y abre los detalles ---------- */
  (function impresion() {
    var abiertos = [];
    function antes() {
      finales.forEach(function (f) { try { f(); } catch (e) { } });
      [].forEach.call(document.querySelectorAll("details.incl"), function (d) { if (!d.open) { d.open = true; abiertos.push(d); } });
    }
    function despues() { abiertos.forEach(function (d) { d.open = false; }); abiertos = []; }
    window.addEventListener("beforeprint", antes); window.addEventListener("afterprint", despues);
    if (window.matchMedia) {
      var mq = window.matchMedia("print"), fn = function (e) { if (e.matches) antes(); else despues(); };
      if (mq.addEventListener) mq.addEventListener("change", fn); else if (mq.addListener) mq.addListener(fn);
    }
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
