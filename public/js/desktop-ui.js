(function(){
const $ = (s, c=document) => c.querySelector(s);
const $$ = (s, c=document) => Array.from(c.querySelectorAll(s));
const closeAll = () => $$('.win').forEach(w => w.classList.add('hidden'));
const setTitle = (w) => { if(!w) return; document.title = `David Cano — ${w.dataset.title || ''}`.trim(); };


function openWindow(id){
const win = document.getElementById(id);
if(!win) return;
closeAll();
win.classList.remove('hidden');
location.hash = id;
setTitle(win);
}
function closeWindow(id){
const win = document.getElementById(id);
if(!win) return;
win.classList.add('hidden');
if(location.hash === `#${id}`) history.replaceState(null, '', ' ');
document.title = 'David Cano | Portfolio';
}


document.addEventListener('click', (e)=>{
const openId = e.target.closest('[data-open]')?.getAttribute('data-open');
if(openId){ e.preventDefault(); openWindow(openId); }
const closeId = e.target.closest('[data-close]')?.getAttribute('data-close');
if(closeId){ e.preventDefault(); closeWindow(closeId); }
});


window.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') closeAll(); });
window.addEventListener('hashchange', ()=>{ const id = location.hash.slice(1); if(id) openWindow(id); });


// abrir por hash directo (deep-link)
document.addEventListener('DOMContentLoaded', ()=>{
const id = location.hash.slice(1);
if(id) openWindow(id);
// reloj simple
const clock = document.getElementById('clock');
if(clock){ setInterval(()=>{ const d=new Date(); clock.textContent = d.toLocaleString(); }, 1000); }
});


// Exponer para pruebas
window.__openWindow = openWindow;
window.__closeWindow = closeWindow;
})();

(function(){
const startBtn = document.getElementById('btn-start');
const startMenu = document.getElementById('start-menu');
if(startBtn && startMenu){
const toggle = ()=> startMenu.classList.toggle('hidden');
startBtn.addEventListener('click', (e)=>{ e.stopPropagation(); toggle(); });
document.addEventListener('click', (e)=>{
if(!startMenu.contains(e.target) && !startBtn.contains(e.target)) startMenu.classList.add('hidden');
});
}
// Reloj 12/24h del sistema
const clock = document.getElementById('clock');
if(clock){ setInterval(()=>{ const d=new Date(); clock.textContent = d.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}); }, 1000); }
})();

// Modal de bienvenida con "No volver a mostrar"
(function () {
  const overlay = document.getElementById('welcome-overlay');
  const modal   = document.getElementById('welcome-modal');
  const btnX    = document.getElementById('welcome-close');
  const btnOk   = document.getElementById('welcome-ok');
  const neverCb = document.getElementById('welcome-never');
  const KEY = 'dc_welcome_hide';

  if (!modal || !overlay) return;

  function open() {
    overlay.classList.remove('hidden');
    modal.classList.remove('hidden');
  }
  function close() {
    if (neverCb?.checked) localStorage.setItem(KEY, '1');
    overlay.classList.add('hidden');
    modal.classList.add('hidden');
  }

  // Mostrar solo si el usuario no lo desactivó
  if (!localStorage.getItem(KEY)) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', open);
    } else {
      open();
    }
  }

  overlay.addEventListener('click', close);
  btnX?.addEventListener('click', close);
  btnOk?.addEventListener('click', close);
})();

