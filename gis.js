/* Laboratorio GIS: mapa de estaciones del IDEAM (datos en vivo) y validador de polígonos de predio.
   Leaflet va dentro del repositorio (vendor/leaflet). Nada se envía a ningún servidor propio. */
(function () {
  "use strict";
  if (typeof L === "undefined") return;
  var D = window.CONSULTORIA;
  var $ = function (s) { return document.querySelector(s); };
  var CIAN = "#0b6e8a", CORAL = "#e0533a", TINTA = "#0b1b2b";
  var COL = { latMin: -4.3, latMax: 13.5, lonMin: -79.1, lonMax: -66.8 };

  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function bases() {
    return {
      "Mapa": L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19, attribution: "© OpenStreetMap" }),
      "Satélite": L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", { maxZoom: 19, attribution: "Imágenes © Esri, Maxar, Earthstar Geographics" })
    };
  }
  function enColombia(lat, lon) { return lat > COL.latMin && lat < COL.latMax && lon > COL.lonMin && lon < COL.lonMax; }

  /* ---------- competencias ---------- */
  (function comp() {
    var c = $("#gis-comp");
    (D.gis || []).forEach(function (g) {
      var d = document.createElement("div"); d.className = "gis-c";
      d.innerHTML = "<b>" + esc(g.t) + "</b><span>" + esc(g.d) + "</span>"; c.appendChild(d);
    });
  })();

  /* ---------- mapa 1: estaciones IDEAM ---------- */
  function iniciarIdeam() {
    var b = bases();
    var map = L.map("map-ideam", { layers: [b["Mapa"]], preferCanvas: true, scrollWheelZoom: false }).setView([5.75, -73.1], 8);
    L.control.layers(b, null, { collapsed: true }).addTo(map);
    map.on("focus", function () { map.scrollWheelZoom.enable(); });
    map.on("blur", function () { map.scrollWheelZoom.disable(); });
    var capa = L.layerGroup().addTo(map), est = [], filtro = "todas", cuenta = $("#ideam-cuenta");

    function pintar() {
      capa.clearLayers();
      var n = 0;
      est.forEach(function (e) {
        if (filtro !== "todas" && e.tipo !== filtro) return;
        n++;
        L.circleMarker([e.lat, e.lon], { radius: 4.5, weight: 1, color: "#fff", fillColor: e.tipo === "auto" ? CIAN : CORAL, fillOpacity: .9 })
          .bindPopup("<b>" + esc(e.nombre) + "</b><br>" + esc(e.municipio) + "<br>" + esc(e.categoria) + "<br>" + esc(e.tecnologia) + (e.alt ? "<br>Altitud: " + esc(e.alt) + " m" : ""))
          .addTo(capa);
      });
      var a = est.filter(function (e) { return e.tipo === "auto"; }).length;
      cuenta.textContent = n.toLocaleString("es-CO") + " estaciones mostradas · de " + est.length.toLocaleString("es-CO") + " activas (" + a + " automáticas, " + (est.length - a) + " convencionales)";
    }
    [].forEach.call(document.querySelectorAll(".mapa-barra [data-f]"), function (btn) {
      btn.addEventListener("click", function () {
        filtro = btn.dataset.f;
        [].forEach.call(document.querySelectorAll(".mapa-barra [data-f]"), function (x) { x.setAttribute("aria-pressed", x === btn ? "true" : "false"); });
        pintar();
      });
    });

    var q = new URLSearchParams({
      "$select": "codigo,nombre,categoria,tecnologia,municipio,altitud,latitud,longitud",
      "$where": "upper(departamento) like 'BOYAC%' and estado='Activa'",
      "$limit": "3000"
    });
    var ctl = new AbortController(), t = setTimeout(function () { ctl.abort(); }, 30000);
    fetch("https://www.datos.gov.co/resource/hp9r-jxuu.json?" + q.toString(), { signal: ctl.signal })
      .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
      .then(function (rows) {
        clearTimeout(t);
        var descartadas = 0;
        rows.forEach(function (r) {
          var lat = parseFloat(r.latitud), lon = parseFloat(r.longitud);
          if (!enColombia(lat, lon)) { descartadas++; return; }
          est.push({ lat: lat, lon: lon, nombre: r.nombre, municipio: r.municipio, categoria: r.categoria, tecnologia: r.tecnologia, alt: r.altitud, tipo: /autom/i.test(r.tecnologia || "") ? "auto" : "conv" });
        });
        pintar();
        if (descartadas) cuenta.textContent += " · " + descartadas + " descartadas por coordenadas fuera del recuadro de Colombia";
        window.__ideam = { total: est.length, descartadas: descartadas };
      })
      .catch(function (e) {
        clearTimeout(t);
        cuenta.innerHTML = 'No se pudieron cargar las estaciones (' + esc(e.message) + '). Puedes ver el catálogo en <a href="https://www.datos.gov.co/resource/hp9r-jxuu" target="_blank" rel="noopener">datos.gov.co</a>.';
        window.__ideam = { error: e.message };
      });
    return map;
  }

  /* ---------- mapa 2: validador de polígonos ---------- */
  var rad = function (g) { return g * Math.PI / 180; };
  function areaHa(ring) {
    var R = 6371007.2, a = 0, n = ring.length;
    for (var i = 0; i < n; i++) { var p = ring[i], q = ring[(i + 1) % n]; a += rad(q[0] - p[0]) * (2 + Math.sin(rad(p[1])) + Math.sin(rad(q[1]))); }
    return Math.abs(a * R * R / 2) / 10000;
  }
  function perimetroM(ring) {
    var R = 6371008.8, s = 0, n = ring.length;
    for (var i = 0; i < n; i++) {
      var p = ring[i], q = ring[(i + 1) % n], dLat = rad(q[1] - p[1]), dLon = rad(q[0] - p[0]);
      var h = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(rad(p[1])) * Math.cos(rad(q[1])) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
      s += 2 * R * Math.asin(Math.sqrt(h));
    }
    return s;
  }
  function areaFirmada(ring) { var a = 0, n = ring.length; for (var i = 0; i < n; i++) { var p = ring[i], q = ring[(i + 1) % n]; a += p[0] * q[1] - q[0] * p[1]; } return a / 2; }
  function ccw(a, b, c) { return (c[1] - a[1]) * (b[0] - a[0]) > (b[1] - a[1]) * (c[0] - a[0]); }
  function cruza(a, b, c, d) { return ccw(a, c, d) !== ccw(b, c, d) && ccw(a, b, c) !== ccw(a, b, d); }
  function autocruces(r) {
    var n = r.length, k = 0;
    for (var i = 0; i < n; i++) for (var j = i + 2; j < n; j++) {
      if (i === 0 && j === n - 1) continue;
      if (cruza(r[i], r[(i + 1) % n], r[j], r[(j + 1) % n])) k++;
    }
    return k;
  }
  function decimales(x) { var s = String(x); if (/e-/i.test(s)) return 15; var i = s.indexOf("."); return i < 0 ? 0 : s.length - i - 1; }
  /* Decimales según el texto pegado: JSON.parse descarta ceros finales (-73.355300 pasa a -73.3553) y daría un falso aviso. */
  function decimalesTexto(txt) {
    var i = txt.indexOf('"coordinates"'); if (i < 0) return null;
    var j = txt.indexOf("[", i); if (j < 0) return null;
    var nivel = 0, k = j;
    for (; k < txt.length; k++) { var ch = txt.charAt(k); if (ch === "[") nivel++; else if (ch === "]") { nivel--; if (nivel === 0) break; } }
    var m = txt.slice(j, k + 1).match(/-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g);
    if (!m || !m.length) return null;
    return Math.min.apply(null, m.map(function (s) { if (/e/i.test(s)) return 15; var p = s.indexOf("."); return p < 0 ? 0 : s.length - p - 1; }));
  }

  function iniciarPredio() {
    var b = bases();
    var map = L.map("map-predio", { layers: [b["Mapa"]], scrollWheelZoom: false }).setView([5.5536, -73.3553], 15);
    L.control.layers(b, null, { collapsed: true }).addTo(map);
    map.on("focus", function () { map.scrollWheelZoom.enable(); });
    map.on("blur", function () { map.scrollWheelZoom.disable(); });
    var dib = L.layerGroup().addTo(map), pts = [], avisos = [], res = $("#val-res"), btnDes = $("#v-descargar"), ultimo = null, decTexto = null;

    function dibujar() {
      dib.clearLayers();
      var ll = pts.map(function (p) { return [p[1], p[0]]; });
      if (ll.length >= 3) L.polygon(ll, { color: CIAN, weight: 3, fillColor: CIAN, fillOpacity: .22 }).addTo(dib);
      else if (ll.length === 2) L.polyline(ll, { color: CIAN, weight: 3, dashArray: "6 6" }).addTo(dib);
      ll.forEach(function (p, i) {
        var m = L.marker(p, { draggable: true, keyboard: false, icon: L.divIcon({ className: "vert" + (i === 0 ? " ini" : ""), iconSize: i === 0 ? [20, 20] : [16, 16] }) }).addTo(dib);
        m.on("dragend", function () { var q = m.getLatLng(); pts[i] = [q.lng, q.lat]; decTexto = null; setTimeout(analizar, 0); });
      });
    }
    function fila(tipo, texto) { return '<li class="' + tipo + '"><span aria-hidden="true">' + (tipo === "ok" ? "✓" : tipo === "mal" ? "✕" : "!") + "</span><span>" + texto + "</span></li>"; }

    function analizar() {
      dibujar(); ultimo = null; btnDes.disabled = true;
      if (pts.length < 3) {
        res.innerHTML = '<p class="vacio">' + (pts.length === 0 ? "Haz clic en el mapa para marcar el primer vértice." : "Llevas " + pts.length + " vértice(s). Se necesitan al menos 3.") + "</p>";
        return;
      }
      var items = [], mal = 0;
      var ha = areaHa(pts), per = perimetroM(pts), cruces = autocruces(pts), n = pts.length;
      var dec = decTexto != null ? decTexto : Math.min.apply(null, pts.map(function (p) { return Math.min(decimales(p[0]), decimales(p[1])); }));
      var repetidos = 0;
      for (var u = 0; u < n; u++) { var pu = pts[u], qu = pts[(u + 1) % n]; if (Math.abs(pu[0] - qu[0]) < 1e-7 && Math.abs(pu[1] - qu[1]) < 1e-7) repetidos++; }
      var fuera = pts.filter(function (p) { return !enColombia(p[1], p[0]); }).length;
      var invert = pts.filter(function (p) { return p[0] > COL.latMin && p[0] < COL.latMax && p[1] < -66 && p[1] > -80; }).length === n;
      var cw = areaFirmada(pts) < 0;

      avisos.forEach(function (a) { items.push(fila("aviso", a)); });
      items.push(fila("ok", "<b>" + n + " vértices</b>, polígono cerrado automáticamente al descargar."));
      items.push(fila("ok", "Área esférica (±0,5 %): <b>" + ha.toLocaleString("es-CO", { maximumFractionDigits: 2 }) + " ha</b> · perímetro " + Math.round(per).toLocaleString("es-CO") + " m."));
      if (repetidos) { items.push(fila("mal", "<b>" + repetidos + " vértice(s) repetido(s)</b> o a menos de 1 cm del siguiente: separa los puntos.")); mal++; }
      if (ha < 0.0001) { items.push(fila("mal", "<b>El área es prácticamente cero</b> (menos de 1 m²): los vértices están repetidos o alineados.")); mal++; }
      if (cruces) { items.push(fila("mal", "<b>El contorno se cruza consigo mismo</b> (" + cruces + " cruce(s)). Las plataformas lo rechazan: corrige los vértices."));  mal++; }
      else items.push(fila("ok", "Sin cruces del contorno."));
      if (invert) { items.push(fila("mal", "Las coordenadas parecen <b>invertidas</b> (latitud y longitud intercambiadas). GeoJSON va en orden [longitud, latitud].")); mal++; }
      else if (fuera) { items.push(fila("mal", "<b>" + fuera + " vértice(s) fuera del recuadro de Colombia</b>: revisa el signo y el orden de las coordenadas.")); mal++; }
      else items.push(fila("ok", "Todos los vértices están dentro del recuadro geográfico de Colombia (no distingue las fronteras con países vecinos)."));
      items.push(dec >= 6 ? fila("ok", "Precisión de coordenadas suficiente (6 decimales o más).") : fila("aviso", "Algunas coordenadas tienen solo " + dec + " decimal(es). Se recomiendan al menos 6 (≈ 0,1 m)."));
      items.push(cw ? fila("aviso", "El anillo va en sentido horario; al descargar se corrige a antihorario (norma RFC 7946).") : fila("ok", "Sentido del anillo correcto (antihorario)."));
      items.push(ha > 4 ? fila("ok", "Supera 4 ha: el Reglamento exige <b>polígono</b> (este) y no basta un punto.") : fila("ok", "Hasta 4 ha basta un punto, pero el polígono también es válido."));

      res.innerHTML = "<ul>" + items.join("") + "</ul>" +
        '<p class="val-veredicto ' + (mal ? "mal" : "ok") + '">' + (mal ? "Hay " + mal + " problema(s) bloqueante(s)." : "Geometría válida para presentar.") + "</p>" +
        '<p class="val-cta">¿Necesitas cruzar este polígono con alertas satelitales de deforestación y armar el expediente EUDR? <a href="#contacto" data-serv="geo">Solicítalo aquí →</a></p>';
      if (!mal) {
        var ring = pts.slice(); if (cw) ring.reverse();
        ring = ring.map(function (p) { return [+p[0].toFixed(6), +p[1].toFixed(6)]; });
        ring.push(ring[0]);
        ultimo = { type: "Feature", properties: { area_ha: +ha.toFixed(2), validacion: "geometria basica", generado: new Date().toISOString().slice(0, 10) }, geometry: { type: "Polygon", coordinates: [ring] } };
        btnDes.disabled = false;
      }
      window.__predio = { n: n, ha: ha, cruces: cruces, mal: mal };
    }

    map.on("click", function (e) { avisos = []; decTexto = null; pts.push([e.latlng.lng, e.latlng.lat]); analizar(); });
    $("#v-deshacer").addEventListener("click", function () { avisos = []; decTexto = null; pts.pop(); analizar(); });
    $("#v-limpiar").addEventListener("click", function () { avisos = []; decTexto = null; pts = []; analizar(); });
    $("#v-ejemplo").addEventListener("click", function () {
      avisos = ["Ejemplo ilustrativo: <b>no corresponde a ningún predio real</b>."];
      var c = [-73.355314, 5.553628], dx = 0.001613, dy = 0.001127, r6 = function (v) { return +v.toFixed(6); };
      decTexto = null;
      pts = [[r6(c[0] - dx), r6(c[1] - dy)], [r6(c[0] + dx), r6(c[1] - dy)], [r6(c[0] + dx), r6(c[1] + dy)], [r6(c[0] - dx), r6(c[1] + dy)]];
      analizar(); map.fitBounds(L.latLngBounds(pts.map(function (p) { return [p[1], p[0]]; })).pad(.4));
    });
    $("#v-cargar").addEventListener("click", function () {
      var txt = $("#v-texto").value.trim(); avisos = [];
      if (!txt) { res.innerHTML = '<p class="vacio">Pega primero un GeoJSON.</p>'; return; }
      var g;
      try { g = JSON.parse(txt); } catch (e) { res.innerHTML = '<ul>' + fila("mal", "No es un JSON válido: " + esc(e.message)) + "</ul>"; return; }
      if (g.type === "FeatureCollection") g = (g.features || [])[0]; if (g && g.type === "Feature") g = g.geometry;
      if (!g || (g.type !== "Polygon" && g.type !== "MultiPolygon")) { res.innerHTML = "<ul>" + fila("mal", "Se esperaba un Polygon o MultiPolygon.") + "</ul>"; return; }
      var ring;
      try {
        if (!Array.isArray(g.coordinates)) throw new Error("sin coordenadas");
        if (g.type === "MultiPolygon") { ring = g.coordinates[0][0]; avisos.push("Es un MultiPolygon con " + g.coordinates.length + " partes: se valida solo la primera."); }
        else ring = g.coordinates[0];
      } catch (e) { res.innerHTML = "<ul>" + fila("mal", "La geometría no trae coordenadas con la forma esperada.") + "</ul>"; return; }
      if (g.type === "Polygon" && g.coordinates.length > 1) avisos.push("Tiene " + (g.coordinates.length - 1) + " hueco(s): se valida solo el contorno exterior.");
      if (!Array.isArray(ring) || ring.length < 4) { res.innerHTML = "<ul>" + fila("mal", "El anillo necesita al menos 4 posiciones (3 vértices y el cierre).") + "</ul>"; return; }
      var numericos = ring.every(function (p) { return Array.isArray(p) && p.length >= 2 && typeof p[0] === "number" && isFinite(p[0]) && typeof p[1] === "number" && isFinite(p[1]); });
      if (!numericos) { res.innerHTML = "<ul>" + fila("mal", "Todas las posiciones deben ser pares numéricos [longitud, latitud]: hay valores vacíos o con texto.") + "</ul>"; return; }
      var a = ring[0], z = ring[ring.length - 1];
      if (a[0] !== z[0] || a[1] !== z[1]) avisos.push("El anillo <b>no estaba cerrado</b> (primer y último punto distintos); se cierra al validar.");
      else ring = ring.slice(0, -1);
      pts = ring.map(function (p) { return [p[0], p[1]]; });
      decTexto = decimalesTexto(txt);
      analizar();
      var ll = pts.map(function (p) { return [p[1], p[0]]; }).filter(function (p) { return isFinite(p[0]) && isFinite(p[1]); });
      if (ll.length) try { map.fitBounds(L.latLngBounds(ll).pad(.4)); } catch (e) { }
    });
    btnDes.addEventListener("click", function () {
      if (!ultimo) return;
      var blob = new Blob([JSON.stringify(ultimo, null, 2)], { type: "application/geo+json" });
      var a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "predio.geojson";
      document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
    });
    return map;
  }

  /* se inician al acercarse, para que Leaflet mida bien el contenedor */
  var mapas = {};
  function arrancar() { if (mapas.i) return; mapas.i = iniciarIdeam(); mapas.p = iniciarPredio(); window.__mapas = mapas; }
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { arrancar(); io.disconnect(); } }, { rootMargin: "300px" });
    io.observe($("#mapas"));
  } else arrancar();
})();
