// desktop-ui.js — versión unificada, compatible con CSP (sin estilos inline)
(function () {
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  // Soportar tanto .window como .win
  const WIN_SELECTOR = '.window, .win';

  // ---- Estado / utilidades
  const closeAll = () => {
    $$(WIN_SELECTOR).forEach(w => {
      w.classList.add('hidden');
      w.classList.remove('is-open');
    });
    document.title = 'David Cano | Portfolio';
  };

  const setTitle = (w) => {
    if (!w) return;
    document.title = `David Cano — ${(w.dataset.title || '').trim()}`.trim();
  };

  // Traer al frente sin z-index inline: mover al final del contenedor
  const bringToFront = (w) => {
    const parent = w.parentNode;
    if (parent && parent.lastChild !== w) parent.appendChild(w);
  };

  // ---- Abrir / Cerrar ventanas (sin style.left/top)
  function openWindow(id) {
    const win = document.getElementById(id);
    if (!win) return;
    closeAll();
    win.classList.remove('hidden');
    win.classList.add('is-open');   // el CSS coloca la ventana centrada arriba
    bringToFront(win);
    location.hash = id;             // deep-link
    setTitle(win);
  }

  function closeWindow(id) {
    const win = document.getElementById(id);
    if (!win) return;
    win.classList.add('hidden');
    win.classList.remove('is-open');
    if (location.hash === `#${id}`) history.replaceState(null, '', ' ');
    document.title = 'David Cano | Portfolio';
  }

  // ---- Delegación de clicks (abrir/cerrar)
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
  }, { passive: true });

  // ---- Teclado y hash
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeAll(); });
  window.addEventListener('hashchange', () => {
    const id = location.hash.slice(1);
    if (id) openWindow(id);
  });

  // ---- Inicio (deep-link + reloj)
  document.addEventListener('DOMContentLoaded', () => {
    const id = location.hash.slice(1);
    if (id) openWindow(id);

    const clock = document.getElementById('clock');
    if (clock) {
      const tick = () => { const d = new Date(); clock.textContent = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); };
      tick(); setInterval(tick, 1000);
    }
  });

  // ---- Menú inicio
  (function () {
    const startBtn = document.getElementById('btn-start');
    const startMenu = document.getElementById('start-menu');
    if (!startBtn || !startMenu) return;

    const toggle = () => startMenu.classList.toggle('hidden');
    startBtn.addEventListener('click', (e) => { e.stopPropagation(); toggle(); });
    document.addEventListener('click', (e) => {
      if (!startMenu.contains(e.target) && !startBtn.contains(e.target)) startMenu.classList.add('hidden');
    });
  })();

  // ---- Modal de bienvenida con "No volver a mostrar"
  (function () {
    const overlay = document.getElementById('welcome-overlay');
    const modal   = document.getElementById('welcome-modal');
    const btnX    = document.getElementById('welcome-close');
    const btnOk   = document.getElementById('welcome-ok');
    const neverCb = document.getElementById('welcome-never');
    const KEY = 'dc_welcome_hide';

    if (!modal || !overlay) return;

    function open()  { overlay.classList.remove('hidden'); modal.classList.remove('hidden'); }
    function close() {
      if (neverCb?.checked) localStorage.setItem(KEY, '1');
      overlay.classList.add('hidden'); modal.classList.add('hidden');
    }
    if (!localStorage.getItem(KEY)) {
      if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', open);
      else open();
    }
    overlay.addEventListener('click', close);
    btnX?.addEventListener('click', close);
    btnOk?.addEventListener('click', close);
  })();

  // Exponer utilidades para depurar si quieres
  window.__openWindow = openWindow;
  window.__closeWindow = closeWindow;
})();
