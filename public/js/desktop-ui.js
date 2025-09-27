// desktop-ui.js — abre/cierra/ordena ventanas sin estilos inline (CSP OK)
(function () {
  const WIN_SELECTOR = ".win, .window";

  function closeAll() {
    document.querySelectorAll(WIN_SELECTOR).forEach(w => {
      w.classList.add("hidden");
      w.classList.remove("is-open");
    });
    document.title = "David Cano | Portfolio";
  }

  function bringToFront(win) {
    // sin z-index inline: reinsertar nodo al final del contenedor
    const p = win.parentNode;
    if (p && p.lastChild !== win) p.appendChild(win);
  }

  function openWindow(id) {
    const win = document.getElementById(id);
    if (!win) return;
    closeAll();
    win.classList.remove("hidden");
    win.classList.add("is-open");   // el CSS la centra arriba
    bringToFront(win);
    location.hash = id;
    const t = (win.dataset.title || "").trim();
    if (t) document.title = `David Cano — ${t}`;
  }

  function closeWindow(id) {
    const win = document.getElementById(id);
    if (!win) return;
    win.classList.add("hidden");
    win.classList.remove("is-open");
    if (location.hash === `#${id}`) history.replaceState(null, "", " ");
    document.title = "David Cano | Portfolio";
  }

  // Abrir/Cerrar por delegación
 document.addEventListener('click', (e) => {
  const opener = e.target.closest('[data-open]');
  if (opener) {
    e.preventDefault();
    const openId = opener.getAttribute('data-open');
    if (openId) openWindow(openId);
    return;
  }
  const closer = e.target.closest('[data-close],[data-win-close]');
  if (closer) {
    e.preventDefault();
    const win = closer.closest(WIN_SELECTOR);
    if (win?.id) closeWindow(win.id);
  }
}, { passive: false });

  // Traer al frente al interactuar
  document.addEventListener("mousedown", (e) => {
    const win = e.target.closest(WIN_SELECTOR);
    if (win) bringToFront(win);
  });
  document.addEventListener("touchstart", (e) => {
    const win = e.target.closest(WIN_SELECTOR);
    if (win) bringToFront(win);
  });

  // Hash/deeplink
  window.addEventListener("hashchange", () => {
    const id = location.hash.slice(1);
    if (id) openWindow(id);
  });

  // Arranque (si entra con hash)
  document.addEventListener("DOMContentLoaded", () => {
    const id = location.hash.slice(1);
    if (id) openWindow(id);
  });

  // util para depurar si quieres desde consola
  window.__openWindow = openWindow;
  window.__closeWindow = closeWindow;
})();
