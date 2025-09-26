(function(){
  const $ = (s, c=document) => c.querySelector(s);
  const $$ = (s, c=document) => Array.from(c.querySelectorAll(s));
  const zBase = 50; let zTop = zBase; const state = { active: null };

  function updateTaskbarButtons(){
    const openIds = $$('.win').filter(w=>!w.classList.contains('hidden')).map(w=>w.id);
    $$('.taskbar [data-open]').forEach(btn=>{
      const id = btn.getAttribute('data-open');
      btn.classList.toggle('is-open', openIds.includes(id));
    });
  }

  function focus(win){
    if(!win) return;
    $$('.win').forEach(w=>w.classList.remove('is-active'));
    win.classList.remove('hidden');
    win.classList.add('is-active');
    win.style.zIndex = ++zTop;
    state.active = win.id;
    document.title = `David Cano — ${win.dataset.title || ''}`.trim();
    updateTaskbarButtons();
  }

  function openWindow(id){ const w = document.getElementById(id); if(w) focus(w); }
  function closeWindow(id){ const w = document.getElementById(id); if(!w) return; w.classList.add('hidden'); if(state.active===id) state.active=null; updateTaskbarButtons(); }
  function minimizeWindow(id){ const w = document.getElementById(id); if(!w) return; w.classList.add('hidden'); updateTaskbarButtons(); }
  function toggleMaximize(id){ const w = document.getElementById(id); if(!w) return; w.classList.toggle('maximized'); focus(w); }

  // ---- Drag (Pointer Events)
  let drag=null;
  function startDrag(e){
    const head = e.currentTarget; const win = head.closest('[data-win]'); if(!win) return;
    if(win.classList.contains('maximized')) return;
    const r = win.getBoundingClientRect();
    drag = { win, sx: e.clientX, sy: e.clientY, l: r.left, t: r.top };
    focus(win);
    window.addEventListener('pointermove', onDragMove);
    window.addEventListener('pointerup', stopDrag, { once: true });
  }
  function onDragMove(e){
    if(!drag) return;
    const dx = e.clientX - drag.sx, dy = e.clientY - drag.sy;
    drag.win.style.left = Math.max(8, drag.l + dx) + 'px';
    drag.win.style.top  = Math.max(8, drag.t + dy) + 'px';
    showSnapPreview(e.clientX, e.clientY);
  }
  function stopDrag(e){
    hideSnapPreview();
    if(!drag) return;
    applySnap(e.clientX, e.clientY, drag.win);
    drag=null;
    window.removeEventListener('pointermove', onDragMove);
  }

  // ---- Resize (Pointer Events)
  let rez=null;
  function startResize(e){
    const handle = e.currentTarget; const win = handle.closest('[data-win]'); if(!win) return;
    if(win.classList.contains('maximized')){
      win.classList.remove('maximized');
      const r = win.getBoundingClientRect();
      win.style.left=r.left+'px'; win.style.top=r.top+'px';
      win.style.width=r.width+'px'; win.style.height=r.height+'px';
    }
    const r = win.getBoundingClientRect();
    rez = { win, edge: handle.className, sx:e.clientX, sy:e.clientY, w:r.width, h:r.height, l:r.left, t:r.top };
    focus(win);
    window.addEventListener('pointermove', onResizeMove);
    window.addEventListener('pointerup', stopResize, { once: true });
  }
  function onResizeMove(e){
    if(!rez) return;
    const dx=e.clientX-rez.sx, dy=e.clientY-rez.sy; const w=rez.win; const minW=360, minH=220;
    if(rez.edge.includes('rh-e')) w.style.width  = Math.max(minW, rez.w + dx) + 'px';
    if(rez.edge.includes('rh-s')) w.style.height = Math.max(minH, rez.h + dy) + 'px';
    if(rez.edge.includes('rh-w')) { w.style.width = Math.max(minW, rez.w - dx) + 'px'; w.style.left = rez.l + Math.min(dx, rez.w - minW) + 'px'; }
    if(rez.edge.includes('rh-n')) { w.style.height= Math.max(minH, rez.h - dy) + 'px'; w.style.top  = rez.t + Math.min(dy, rez.h - minH) + 'px'; }
  }
  function stopResize(){ rez=null; window.removeEventListener('pointermove', onResizeMove); }

  // ---- Snap
  let preview; function ensurePreview(){ if(!preview){ preview=document.createElement('div'); preview.className='win-snap-preview'; preview.innerHTML='<div></div>'; document.body.appendChild(preview);} }
  function showSnapPreview(x,y){ ensurePreview(); const box=preview.firstElementChild; const vw=innerWidth, vh=innerHeight, g=8; let area=null;
    if(x<vw*0.06) area={left:g, top:g, width:vw/2-2*g, height:vh-88};
    else if(x>vw*0.94) area={left:vw/2+g, top:g, width:vw/2-2*g, height:vh-88};
    else if(y<vh*0.06) area={left:g, top:g, width:vw-2*g, height:vh-88};
    preview.style.display = area?'block':'none'; if(area) Object.assign(box.style, area);
  }
  function hideSnapPreview(){ if(preview) preview.style.display='none'; }
  function applySnap(x,y,win){ const vw=innerWidth, vh=innerHeight, g=8;
    if(x<vw*0.06){ win.classList.remove('maximized'); win.style.left=g+'px'; win.style.top=g+'px'; win.style.width=(vw/2-2*g)+'px'; win.style.height=(vh-88)+'px'; return; }
    if(x>vw*0.94){ win.classList.remove('maximized'); win.style.left=(vw/2+g)+'px'; win.style.top=g+'px'; win.style.width=(vw/2-2*g)+'px'; win.style.height=(vh-88)+'px'; return; }
    if(y<vh*0.06){ win.classList.add('maximized'); }
  }

  // ---- registrar listeners en cabeceras y asas
  function registerWindows(){
    $$('.win-header').forEach(h=>{ h.onpointerdown = startDrag; });
    $$('.resize-handle').forEach(h=>{ h.onpointerdown = startResize; });
  }

  // ---- botones
  document.addEventListener('click', (e)=>{
    const t=e.target;
    const openId=t.closest?.('[data-open]')?.getAttribute('data-open'); if(openId){ e.preventDefault(); openWindow(openId); return; }
    const closeId=t.closest?.('[data-close]')?.getAttribute('data-close'); if(closeId){ e.preventDefault(); closeWindow(closeId); return; }
    const minId=t.closest?.('[data-win-minimize]')?.getAttribute('data-win-minimize'); if(minId){ e.preventDefault(); minimizeWindow(minId); return; }
    const maxId=t.closest?.('[data-win-maximize]')?.getAttribute('data-win-maximize'); if(maxId){ e.preventDefault(); toggleMaximize(maxId); return; }
    const win=t.closest?.('[data-win]'); if(win) focus(win);
  });

  window.addEventListener('hashchange', ()=>{ const id=location.hash.slice(1); if(id) openWindow(id); });
  document.addEventListener('DOMContentLoaded', ()=>{ registerWindows(); updateTaskbarButtons(); const id=location.hash.slice(1); if(id) openWindow(id); });

  window.WinMgr = { openWindow, closeWindow, minimizeWindow, toggleMaximize };
})();
