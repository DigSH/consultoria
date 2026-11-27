/* Consultoría · lo que comparten todas las páginas: barra y menú, aparición al hacer scroll, medición anónima
   (GoatCounter y GA4 con permiso), pausa de animaciones fuera de pantalla y enlaces de WhatsApp con data-wa.
   Va después de datos.js y antes de app.js o gis.js. Sin dependencias. */
(function () {
  "use strict";
  var D = window.CONSULTORIA;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
    var links = [].slice.call(document.querySelectorAll('#nav-enlaces a[href^="#"]')), mapa = {}, secs = [];
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

  /* ---------- enlaces de WhatsApp escritos en el HTML: <a data-wa="mensaje"> ---------- */
  [].forEach.call(document.querySelectorAll("a[data-wa]"), function (a) {
    a.href = "https://wa.me/" + D.contacto.whatsapp + "?text=" + encodeURIComponent(a.getAttribute("data-wa"));
  });

  /* ---------- aparición al hacer scroll ----------
     Corre al terminar de cargar todos los scripts: app.js crea después tarjetas .rev (equipo, cifras, voces)
     y, si se buscaran antes, se quedarían invisibles (pasó el 27/11/2026 con el equipo vacío). */
  function rev() {
    var nodos = document.querySelectorAll(".rev");
    if (reduce || !("IntersectionObserver" in window)) { [].forEach.call(nodos, function (n) { n.classList.add("ya"); }); return; }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("ya"); io.unobserve(e.target); } });
    }, { threshold: .15 });
    [].forEach.call(nodos, function (n, i) { n.style.transitionDelay = (i % 4) * 70 + "ms"; io.observe(n); });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", rev); else rev();

  /* ---------- medición anónima y sin cookies (GoatCounter); inactiva mientras datos.js no traiga el código ----------
     Cuenta: perfil elegido, clics en WhatsApp por sección, enlaces de prueba de cada fase, «Cotizar», envío del
     formulario y hasta qué sección llega la visita (una vez por sección). Nada de nombres, teléfonos ni textos escritos. */
  /* Google Analytics 4 (datos.js → analitica.ga4, gtag.js directo) usa cookies: solo carga si la persona acepta en el aviso #permiso;
     la decisión queda en localStorage («medicion-google»: "si" o "no") y se cambia desde el pie. Los mismos eventos
     llegan a GA4 como evento «consultoria» con los parámetros accion y titulo. */
  (function medicion() {
    var A = D.analitica || {};
    var codigo = A.goatcounter && /^[a-z0-9-]+$/.test(A.goatcounter) ? A.goatcounter : "";
    var gtm = A.ga4 && /^G-[A-Z0-9]+$/.test(A.ga4) ? A.ga4 : "";
    if (!codigo && !gtm) return;
    var cola = [], hechos = {}, s = null;
    if (codigo) {
      s = document.createElement("script");
      s.async = true; s.src = "https://gc.zgo.at/count.js";
      s.setAttribute("data-goatcounter", "https://" + codigo + ".goatcounter.com/count");
      document.head.appendChild(s);
      var aviso = $("#aviso-medicion"); if (aviso) aviso.hidden = false;
      s.addEventListener("load", function () { cola.forEach(function (ev) { window.goatcounter.count(ev); }); cola = []; });
    }
    var gtmCargado = false;
    function cargarGtm() {
      if (gtmCargado) return; gtmCargado = true;
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag("js", new Date());
      window.gtag("config", gtm);
      var g = document.createElement("script");
      g.async = true; g.src = "https://www.googletagmanager.com/gtag/js?id=" + gtm;
      document.head.appendChild(g);
    }
    if (gtm) {
      var clave = "medicion-google", caja = $("#permiso"), cambiar = $("#permiso-cambiar");
      var decision = null; try { decision = localStorage.getItem(clave); } catch (e) {}
      var guardar = function (v) { try { localStorage.setItem(clave, v); } catch (e) {} };
      if (decision === "si") cargarGtm();
      else if (decision !== "no" && caja) caja.hidden = false;
      if (cambiar) cambiar.hidden = false;
      if (caja) caja.addEventListener("click", function (e) {
        var b = e.target.closest("button[data-permiso]"); if (!b) return;
        var si = b.dataset.permiso === "si";
        guardar(si ? "si" : "no"); caja.hidden = true;
        if (si) cargarGtm();
        else if (gtmCargado) {   /* retiró el permiso: borrar las cookies de Google Analytics y recargar sin GTM */
          /* GA4 guarda sus cookies en el dominio del sitio (digsh.github.io); .github.io es sufijo público y no se puede
             tocar, así que se borran sin dominio, con el dominio exacto y con el punto delante */
          window["ga-disable-" + gtm] = true;
          var host = location.hostname;
          document.cookie.split(";").forEach(function (c) {
            var n = c.split("=")[0].trim();
            if (!/^_ga|^_gid|^_gat/.test(n)) return;
            ["", "; domain=" + host, "; domain=." + host].forEach(function (d) { document.cookie = n + "=; Max-Age=0; path=/" + d; });
          });
          location.reload();
        }
      });
      if (cambiar) cambiar.addEventListener("click", function () { if (caja) caja.hidden = false; });
    }
    function medir(ruta, titulo, unaVez) {
      if (unaVez) { if (hechos[ruta]) return; hechos[ruta] = 1; }
      if (codigo) {
        var ev = { path: ruta, title: titulo || ruta, event: true };
        if (window.goatcounter && window.goatcounter.count) window.goatcounter.count(ev); else cola.push(ev);
      }
      if (gtmCargado) window.gtag("event", "consultoria", { accion: ruta, titulo: titulo || ruta });
    }
    var perfilActual = "sin-perfil";
    document.addEventListener("perfil", function (e) { perfilActual = e.detail; medir("perfil/" + e.detail, "Perfil elegido", true); });
    document.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest("a, button"); if (!a) return;
      var sec = (a.closest("section, header, footer") || {}).id || "pagina";
      if (a.href && a.href.indexOf("wa.me/") >= 0) medir("whatsapp/" + sec + "/" + perfilActual, "Clic en WhatsApp");
      else if (a.dataset && a.dataset.evento === "prueba") medir("prueba/" + (a.getAttribute("href") || "").replace(/^.*#/, ""), "Prueba de la fase");
      else if (a.dataset && a.dataset.serv) medir("cotizar/" + a.dataset.serv, "Cotizar servicio");
    }, true);
    /* app.js emite «formulario-ok» solo cuando el formulario pasó la validación: un intento con campos vacíos no cuenta */
    document.addEventListener("formulario-ok", function () { medir("formulario/envio/" + perfilActual, "Envío del formulario"); });
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { medir("seccion/" + e.target.id, "Llegó a la sección", true); io.unobserve(e.target); } });
      }, { rootMargin: "-45% 0px -45% 0px" });   /* cuenta cuando la sección cruza el centro: sirve para secciones de varias pantallas */
      [].forEach.call(document.querySelectorAll("#contenido > section[id]:not([hidden])"), function (x) { io.observe(x); });
    }
  })();

  /* ---------- rendimiento: las animaciones infinitas de una sección solo corren mientras se ve ----------
     Las animaciones CSS sobre SVG no pasan a la GPU: fuera de pantalla seguían forzando estilo y layout
     60 veces por segundo (medido el 26/11/2026: 126 ms de CPU por segundo con la página quieta en el pie). */
  (function pausarFuera() {
    if (!("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        e.target.classList.toggle("fuera", !e.isIntersecting);
        /* SMIL (animateMotion del ciclo en «Cómo trabajamos») no obedece a animation-play-state */
        [].forEach.call(e.target.querySelectorAll("svg"), function (s) {
          if (s.pauseAnimations) { if (e.isIntersecting) s.unpauseAnimations(); else s.pauseAnimations(); }
        });
      });
    }, { rootMargin: "100px 0px" });
    [].forEach.call(document.querySelectorAll("#contenido > section"), function (s) { io.observe(s); });
  })();
})();
