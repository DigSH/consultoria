/* Laboratorio GIS · estudio longitudinal del Complejo de Páramos Iguaque - Merchán.
   Pérdida anual de cobertura arbórea (Hansen/UMD) dentro del límite oficial de Minambiente.
   Los datos se calculan con un script y llegan en datos/iguaque-datos.js y datos/iguaque-perdida.png:
   aquí solo se dibujan. Se cargan cuando la tarjeta se acerca a la pantalla. */
(function () {
  "use strict";
  if (typeof L === "undefined") return;
  var caja = document.getElementById("map-iguaque");
  if (!caja) return;
  var $ = function (s) { return document.querySelector(s); };
  var NS = "http://www.w3.org/2000/svg";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var VER = (document.currentScript && document.currentScript.src.split("?v=")[1]) || "";
  var estado = $("#ig-estado"), pedido = false;

  function num(v, dec) { return v.toLocaleString("es-CO", { minimumFractionDigits: dec, maximumFractionDigits: dec }); }
  function svg(tag, attrs, padre, texto) {
    var n = document.createElementNS(NS, tag);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (texto != null) n.textContent = texto;
    if (padre) padre.appendChild(n);
    return n;
  }

  function pedir() {
    if (pedido) return; pedido = true;
    var s = document.createElement("script");
    s.src = "datos/iguaque-datos.js" + (VER ? "?v=" + VER : "");
    s.onload = function () { if (window.IGUAQUE) iniciar(window.IGUAQUE); };
    s.onerror = function () { estado.textContent = "No se pudieron cargar los datos del estudio. Recargue la página."; };
    document.head.appendChild(s);
  }
  /* visibilidad medida con la posición de la caja: no depende de IntersectionObserver */
  function cerca(margen) { var r = caja.getBoundingClientRect(); return r.bottom > -margen && r.top < window.innerHeight + margen; }
  function alMover() { if (cerca(600)) { window.removeEventListener("scroll", alMover); window.removeEventListener("resize", alMover); pedir(); } }
  window.addEventListener("scroll", alMover, { passive: true }); window.addEventListener("resize", alMover);
  alMover();

  function iniciar(D) {
    var A0 = D.primer_anio - 1, A1 = D.ultimo_anio, CORTE = 2020;
    var pa = D.paramo, fr = D.franja;
    var anio = A0, verBosque = true, cod = null, lienzo = null, ctx = null, img = null;

    /* ----- mapa ----- */
    var bases = {
      "Mapa": L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19, attribution: "© OpenStreetMap" }),
      "Satélite": L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", { maxZoom: 19, attribution: "Imágenes © Esri, Maxar, Earthstar Geographics" })
    };
    var map = L.map(caja, { layers: [bases["Mapa"]], scrollWheelZoom: false, zoomSnap: 0.25, minZoom: 9, maxZoom: 16 });
    L.control.layers(bases, null, { collapsed: true }).addTo(map);
    L.control.scale({ imperial: false }).addTo(map);
    map.on("focus", function () { map.scrollWheelZoom.enable(); });
    map.on("blur", function () { map.scrollWheelZoom.disable(); });
    map.attributionControl.addAttribution("Pérdida: Hansen/UMD/Google/USGS/NASA · Límite: Minambiente");
    map.createPane("ig-raster").style.zIndex = 350;
    map.createPane("ig-limite").style.zIndex = 420;
    map.createPane("ig-focos").style.zIndex = 430;
    var marco = L.latLngBounds([D.marco[1], D.marco[0]], [D.marco[3], D.marco[2]]);
    L.geoJSON(D.limite, { pane: "ig-limite", interactive: false, style: { color: "#ffffff", weight: 4.5, opacity: .75, fill: false } }).addTo(map);
    var limite = L.geoJSON(D.limite, { pane: "ig-limite", interactive: false, style: { color: "#0b1b2b", weight: 1.8, fillColor: "#0b6e8a", fillOpacity: .05 } }).addTo(map);
    map.fitBounds(limite.getBounds(), { padding: [12, 12] });
    map.setMaxBounds(marco.pad(.25));
    var vistaInicial = { c: map.getCenter(), z: map.getZoom() };

    /* ----- capa ráster: un lienzo con la imagen codificada (0 sin bosque, 200 bosque en pie, 1..25 año de pérdida) ----- */
    var CapaLienzo = L.ImageOverlay.extend({
      _initImage: function () {
        var c = this._image = this._url;
        L.DomUtil.addClass(c, "leaflet-image-layer ig-lienzo");
        if (this._zoomAnimated) L.DomUtil.addClass(c, "leaflet-zoom-animated");
        c.onselectstart = L.Util.falseFn; c.onmousemove = L.Util.falseFn;
      }
    });
    function pintarRaster() {
      if (!cod) return;
      var d = img.data, yy = anio - 2000, n = cod.length;
      for (var i = 0, p = 0; i < n; i++, p += 4) {
        var v = cod[i];
        if (v === 0) { d[p + 3] = 0; continue; }
        if (v === 200 || v > yy) {                       /* bosque que sigue en pie ese año */
          if (verBosque) { d[p] = 27; d[p + 1] = 138; d[p + 2] = 90; d[p + 3] = 62; } else d[p + 3] = 0;
        } else if (v === yy) { d[p] = 255; d[p + 1] = 92; d[p + 2] = 20; d[p + 3] = 255; }   /* pérdida del año */
        else { d[p] = 176; d[p + 1] = 22; d[p + 2] = 34; d[p + 3] = 240; }                    /* pérdida acumulada */
      }
      ctx.putImageData(img, 0, 0);
    }
    var fuente = new Image();
    fuente.onload = function () {
      var tmp = document.createElement("canvas"); tmp.width = D.ancho; tmp.height = D.alto;
      var t = tmp.getContext("2d", { willReadFrequently: true }); t.drawImage(fuente, 0, 0);
      var px;
      try { px = t.getImageData(0, 0, D.ancho, D.alto).data; } catch (e) { estado.textContent = "El navegador bloqueó la lectura de la imagen; se muestran solo los focos."; return; }
      cod = new Uint8Array(D.ancho * D.alto);
      for (var i = 0, p = 0; i < cod.length; i++, p += 4) cod[i] = px[p];
      lienzo = document.createElement("canvas"); lienzo.width = D.ancho; lienzo.height = D.alto;
      ctx = lienzo.getContext("2d"); img = ctx.createImageData(D.ancho, D.alto);
      new CapaLienzo(lienzo, marco, { pane: "ig-raster", interactive: false }).addTo(map);
      window.IGUAQUE_PRUEBA = { cuenta: function (y) { var c = 0; for (var k = 0; k < cod.length; k++) if (cod[k] === y) c++; return c; } };
      pintarRaster();
      estado.textContent = "";
      listo = true;
      vigilar();
    };
    fuente.onerror = function () { estado.textContent = "No se pudo cargar la imagen de pérdida; se muestran solo los focos."; };
    fuente.src = "datos/iguaque-perdida.png" + (VER ? "?v=" + VER : "");

    /* ----- focos: celdas de ~1 km con pérdida, para que el cambio se lea con el mapa alejado ----- */
    var gFocos = L.layerGroup().addTo(map);
    function pintarFocos() {
      gFocos.clearLayers();
      if (map.getZoom() >= 13.5) return;                  /* de cerca ya se ven los píxeles reales */
      var yy = anio - 2000;
      D.focos.forEach(function (f) {
        if (f[2] > yy) return;
        var actual = f[2] === yy;
        L.circleMarker([f[1], f[0]], {
          pane: "ig-focos", radius: actual ? 4 + Math.sqrt(f[3]) * 2.6 : 2 + Math.sqrt(f[3]) * 1.1,
          color: actual ? "#ff5c14" : "#b01622", weight: actual ? 2 : 1, opacity: actual ? 1 : .7,
          fillColor: actual ? "#ff7a59" : "#b01622", fillOpacity: actual ? .45 : .32, className: actual ? "ig-foco ig-foco-act" : "ig-foco"
        }).bindTooltip((2000 + f[2]) + " · " + num(f[3], 1) + " ha · " + (f[4] ? "dentro del páramo" : "franja de 2 km"), { direction: "top" }).addTo(gFocos);
      });
    }
    map.on("zoomend", pintarFocos);

    /* ----- panel: cifras y barras por año ----- */
    var acP = [0], acF = [0];
    pa.por_anio.forEach(function (v, i) { acP.push(acP[i] + v); }); fr.por_anio.forEach(function (v, i) { acF.push(acF[i] + v); });
    var tAnio = $("#ig-anio"), tAc = $("#ig-acum"), tDet = $("#ig-det"), rango = $("#ig-rango"), btn = $("#ig-play");
    rango.min = A0; rango.max = A1; rango.value = A0;
    var gW = 420, gH = 190, m = { l: 34, r: 8, t: 14, b: 30 }, N = pa.por_anio.length;
    var maxV = Math.max.apply(null, pa.por_anio.concat(fr.por_anio)), tope = Math.ceil(maxV / 10) * 10;
    var g = svg("svg", { viewBox: "0 0 " + gW + " " + gH, role: "img", "aria-label": "Hectáreas de cobertura arbórea perdidas por año, " + D.primer_anio + " a " + A1 + ", en el páramo y en su franja de 2 km" }, $("#ig-barras"));
    var paso = (gW - m.l - m.r) / N, ay = function (v) { return gH - m.b - (v / tope) * (gH - m.t - m.b); };
    [0, tope / 2, tope].forEach(function (v) {
      svg("line", { x1: m.l, x2: gW - m.r, y1: ay(v), y2: ay(v), "class": "ig-guia" }, g);
      svg("text", { x: m.l - 5, y: ay(v) + 3.5, "text-anchor": "end", "class": "ig-eje" }, g, v);
    });
    svg("text", { x: 2, y: 9, "class": "ig-eje" }, g, "ha/año");
    var barras = [];
    for (var i = 0; i < N; i++) {
      var x = m.l + i * paso, bw = Math.max(2, paso * .38);
      var b1 = svg("rect", { x: (x + paso * .08).toFixed(1), y: ay(fr.por_anio[i]).toFixed(1), width: bw.toFixed(1), height: (gH - m.b - ay(fr.por_anio[i])).toFixed(1), "class": "ig-b ig-b-fr" }, g);
      var b2 = svg("rect", { x: (x + paso * .08 + bw + 0.6).toFixed(1), y: ay(pa.por_anio[i]).toFixed(1), width: bw.toFixed(1), height: (gH - m.b - ay(pa.por_anio[i])).toFixed(1), "class": "ig-b ig-b-pa" }, g);
      svg("title", {}, b1, (D.primer_anio + i) + ": " + num(fr.por_anio[i], 1) + " ha en la franja de 2 km");
      svg("title", {}, b2, (D.primer_anio + i) + ": " + num(pa.por_anio[i], 1) + " ha en el páramo");
      barras.push([b1, b2]);
      if ((D.primer_anio + i) % 5 === 0 || i === 0) svg("text", { x: (x + paso / 2).toFixed(1), y: gH - m.b + 13, "text-anchor": "middle", "class": "ig-eje" }, g, D.primer_anio + i);
    }
    var xc = m.l + (CORTE - A0) * paso;
    svg("line", { x1: xc, x2: xc, y1: m.t - 4, y2: gH - m.b, "class": "ig-corte" }, g);
    svg("text", { x: xc - 4, y: m.t + 4, "text-anchor": "end", "class": "ig-eje ig-corte-t" }, g, "corte EUDR 31-dic-2020");
    var cursor = svg("rect", { x: 0, y: m.t, width: paso.toFixed(1), height: gH - m.t - m.b, "class": "ig-cursor", visibility: "hidden" }, g);
    $("#ig-resumen").innerHTML = "<b>" + D.primer_anio + "–" + A1 + ":</b> " + num(pa.perdida_total_ha, 1) + " ha perdidas dentro del páramo, el " + num(pa.perdida_pct_bosque2000, 2) +
      " % de las " + num(Math.round(pa.bosque2000_ha), 0) + " ha con cobertura arbórea en 2000. " + num(pa.hasta_2020_ha, 1) + " ha ocurrieron antes del corte EUDR y " + num(pa.desde_2021_ha, 1) +
      " ha después. En la franja exterior de 2 km la pérdida fue de " + num(fr.perdida_total_ha, 1) + " ha (" + num(fr.perdida_pct_bosque2000, 2) + " %).";

    function poner(a, desdeRango) {
      anio = Math.max(A0, Math.min(A1, a));
      var k = anio - A0;
      if (!desdeRango) rango.value = anio;
      rango.setAttribute("aria-valuetext", String(anio));
      tAnio.textContent = anio;
      tAc.textContent = num(acP[k], 1) + " ha";
      tDet.textContent = k === 0 ? "Línea base: " + num(Math.round(pa.bosque2000_ha), 0) + " ha con cobertura arbórea dentro del páramo."
        : "En " + anio + ": " + num(pa.por_anio[k - 1], 1) + " ha en el páramo y " + num(fr.por_anio[k - 1], 1) + " ha en la franja de 2 km (acumulado en la franja: " + num(acF[k], 1) + " ha).";
      barras.forEach(function (b, i) { var on = i < k; b[0].classList.toggle("ig-off", !on); b[1].classList.toggle("ig-off", !on); });
      if (k > 0) { cursor.setAttribute("x", (m.l + (k - 1) * paso).toFixed(1)); cursor.setAttribute("visibility", "visible"); } else cursor.setAttribute("visibility", "hidden");
      pintarRaster(); pintarFocos();
    }

    /* ----- reproducción ----- */
    var reloj = 0, listo = false, enVista = false;
    function detener() { if (reloj) { clearInterval(reloj); reloj = 0; } btn.textContent = "▶ Reproducir"; btn.setAttribute("aria-pressed", "false"); }
    function reproducir() {
      if (reloj) return;
      if (anio >= A1) poner(A0);
      btn.textContent = "❚❚ Pausar"; btn.setAttribute("aria-pressed", "true");
      reloj = setInterval(function () { if (anio >= A1) { detener(); return; } poner(anio + 1); }, 650);
    }
    btn.addEventListener("click", function () { if (reloj) detener(); else reproducir(); });
    rango.addEventListener("input", function () { detener(); poner(+rango.value, true); });
    $("#ig-bosque").addEventListener("click", function () {
      verBosque = !verBosque; this.setAttribute("aria-pressed", verBosque ? "true" : "false"); pintarRaster();
    });
    $("#ig-vista").addEventListener("click", function () { map.setView(vistaInicial.c, vistaInicial.z); });
    var auto = false;   /* la reproducción automática ocurre una sola vez, al entrar el mapa en pantalla */
    function vigilar() {
      var r = caja.getBoundingClientRect(), h = window.innerHeight;
      enVista = r.top < h * .8 && r.bottom > h * .2;
      if (!enVista) detener(); else if (listo && !reduce && !auto && anio === A0) { auto = true; reproducir(); }
    }
    window.addEventListener("scroll", vigilar, { passive: true }); window.addEventListener("resize", vigilar);
    poner(reduce ? A1 : A0);
    vigilar();
  }
})();
