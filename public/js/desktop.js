// public/js/desktop.js
(() => {
  // Abridores válidos: data-win, data-open o data-target
  const OPEN_ATTRS = ["win", "open", "target"];
  let zCounter = 100;

  function resolveTargetId(el) {
    for (const key of OPEN_ATTRS) {
      const v = el.dataset?.[key];
      if (v) return v;
    }
    return null;
  }

  function bringToFront(win) {
    zCounter += 1;
    win.style.zIndex = zCounter;
  }

  function clampToViewport(win) {
    const rect = win.getBoundingClientRect();
    const m = 8;
    let left = rect.left, top = rect.top;

    if (rect.right > innerWidth - m) left = Math.max(m, innerWidth - rect.width - m);
    if (rect.left < m) left = m;
    if (rect.bottom > innerHeight - m) top = Math.max(m, innerHeight - rect.height - m);
    if (rect.top < m) top = m;

    if (left !== rect.left || top !== rect.top) {
      win.style.transform = "none";
      win.style.left = `${left}px`;
      win.style.top = `${top}px`;
    }
  }

  function openWindow(id) {
    if (!id) return;
    const win = document.getElementById(id);
    if (!win) return;
    win.classList.add("is-open", "is-centered");
    bringToFront(win);
    requestAnimationFrame(() => clampToViewport(win));
  }

  function closeWindow(el) {
    const win = el.closest(".window, .ventana,[role='dialog']");
    if (win) win.classList.remove("is-open");
  }

  // Delegación: abrir
  document.addEventListener("click", (e) => {
    const opener = e.target.closest("[data-win],[data-open],[data-target]");
    if (opener) {
      openWindow(resolveTargetId(opener));
    }
  }, { passive: true });

  // Delegación: cerrar
  document.addEventListener("click", (e) => {
    const closeBtn = e.target.closest("[data-win-close], .btn-cerrar, .window__btn[data-close]");
    if (closeBtn) closeWindow(closeBtn);
  }, { passive: true });

  // Traer al frente si tocas la ventana
  document.addEventListener("mousedown", (e) => {
    const win = e.target.closest(".window, .ventana,[role='dialog']");
    if (win) bringToFront(win);
  });
  document.addEventListener("touchstart", (e) => {
    const win = e.target.closest(".window, .ventana,[role='dialog']");
    if (win) bringToFront(win);
  }, { passive: true });

  // Reajustar al cambiar tamaño
  addEventListener("resize", () => {
    document.querySelectorAll(".window.is-open, .ventana.is-open,[role='dialog'].is-open")
      .forEach(clampToViewport);
  });
})();
