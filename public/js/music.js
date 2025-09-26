// music.js — inicia solo tras interacción, rutas absolutas
(() => {
// Antes: const scope = document.getElementById("win-musica");
const scope = document.getElementById("win-musica") || document.getElementById("music") || document.getElementById("music-scope");
  if (!scope) return;

  const audio = scope.querySelector("audio");
  const list  = scope.querySelector("#musicList");
  const play  = scope.querySelector("#musicPlayAll");
  const status= scope.querySelector("#musicStatus");

  if (!audio || !list || !play || !status) return;

  const TRACKS = Array.isArray(window.MUSIC_TRACKS) && window.MUSIC_TRACKS.length
    ? window.MUSIC_TRACKS
    : [{ title:"Demo", src:"/assets/music/demo.mp3" }];

  // Pintar lista
  list.textContent = "";
  TRACKS.forEach((t,i) => {
    const li = document.createElement("li");
    li.className = "cursor-pointer py-2 px-2 hover:opacity-80";
    li.dataset.index = String(i);
    li.textContent = t.title;
    list.appendChild(li);
  });

  let current = 0;
  function load(i){
    current = i;
    audio.src = TRACKS[current].src;   // solo URLs absolutas /assets/...
    status.textContent = `Reproduciendo: ${TRACKS[current].title}`;
  }
  function playNow(){
    audio.load();
    audio.play().catch(err => {
      status.textContent = "Toca Reproducir o elige una canción.";
      console.log("Bloqueado por autoplay hasta gesto:", err?.message || err);
    });
  }

  play.addEventListener("click", ()=>{ load(0); playNow(); });
  list.addEventListener("click",(e)=>{
    const li = e.target.closest("li");
    if (!li) return;
    load(Number(li.dataset.index||0)); playNow();
  });

  audio.addEventListener("error", ()=>{
    status.textContent = "No se pudo cargar el audio (revisa la ruta en Netlify).";
    console.warn("Audio error", audio.error, "src:", audio.currentSrc);
  });
  audio.addEventListener("ended", ()=>{
    const next = (current + 1) % TRACKS.length;
    load(next); playNow();
  });
})();
