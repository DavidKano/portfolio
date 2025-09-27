// music.js — Player pro con lista interactiva (CSP friendly)
(() => {
  const scope = document.getElementById("music") || document.getElementById("win-musica") || document.getElementById("music-scope");
  if (!scope) return;

  const audio = scope.querySelector("#audio") || scope.querySelector("audio");
  const list  = scope.querySelector("#musicList");
  const btnPlay = scope.querySelector("#btnPlay");
  const btnPrev = scope.querySelector("#btnPrev");
  const btnNext = scope.querySelector("#btnNext");
  const seek = scope.querySelector("#seek");
  const vol  = scope.querySelector("#vol");
  const now  = scope.querySelector("#musicNow");
  const tcur = scope.querySelector("#musicTime");
  const tdur = scope.querySelector("#musicDur");

  if (!audio || !list || !btnPlay || !seek || !vol) return;

  const TRACKS = Array.isArray(window.MUSIC_TRACKS) && window.MUSIC_TRACKS.length ? window.MUSIC_TRACKS : [];
  let idx = 0;
  let seeking = false;

  // --- Utils
  const fmt = s => {
    s = Math.max(0, Math.floor(s || 0));
    const m = Math.floor(s / 60);
    const r = s % 60;
    return `${m}:${r.toString().padStart(2, "0")}`;
  };
  const setActive = i => {
    list.querySelectorAll(".music-item").forEach((li, k) => li.classList.toggle("is-active", k === i));
  };
  const load = i => {
    idx = (i + TRACKS.length) % TRACKS.length;
    const tr = TRACKS[idx];
    audio.src = tr.src;
    now.textContent = tr.title;
    setActive(idx);
    // reseteo UI
    tcur.textContent = "0:00";
    tdur.textContent = "0:00";
    seek.value = "0";
  };
  const play = () => {
    audio.play().then(() => {
      btnPlay.textContent = "⏸";
      btnPlay.classList.add("mc-btn--primary");
    }).catch(() => {
      // Necesita gesto: no pasa nada, el usuario volverá a darle al botón
    });
  };
  const pause = () => {
    audio.pause();
    btnPlay.textContent = "▶";
    btnPlay.classList.remove("mc-btn--primary");
  };
  const toggle = () => (audio.paused ? play() : pause());
  const next = () => { load(idx + 1); play(); };
  const prev = () => { load(idx - 1); play(); };

  // --- Render lista
  list.innerHTML = "";
  TRACKS.forEach((tr, i) => {
    const li = document.createElement("li");
    li.className = "music-item";
    li.innerHTML = `
      <div>
        <div class="music-item__title">${tr.title}</div>
        ${tr.artist ? `<div class="music-item__meta">${tr.artist}</div>` : ""}
      </div>
      <div class="text-xs opacity-60">▶</div>
    `;
    li.addEventListener("click", () => { load(i); play(); });
    list.appendChild(li);
  });

  // --- Eventos audio
  audio.addEventListener("loadedmetadata", () => {
    tdur.textContent = fmt(audio.duration);
  });
  audio.addEventListener("timeupdate", () => {
    if (seeking) return;
    const cur = audio.currentTime || 0;
    const dur = audio.duration || 1;
    tcur.textContent = fmt(cur);
    seek.value = String(Math.round((cur / dur) * 100));
  });
  audio.addEventListener("ended", next);
  audio.addEventListener("play", () => { btnPlay.textContent = "⏸"; btnPlay.classList.add("mc-btn--primary"); });
  audio.addEventListener("pause", () => { btnPlay.textContent = "▶"; btnPlay.classList.remove("mc-btn--primary"); });

  // --- Controles
  btnPlay.addEventListener("click", toggle);
  btnNext.addEventListener("click", next);
  btnPrev.addEventListener("click", prev);

  seek.addEventListener("input", () => {
    seeking = true;
    const p = Number(seek.value) / 100;
    audio.currentTime = (audio.duration || 0) * p;
    tcur.textContent = fmt(audio.currentTime);
  });
  seek.addEventListener("change", () => { seeking = false; });

  // Volumen (persistente)
  const VOL_KEY = "dc_music_vol";
  const savedVol = localStorage.getItem(VOL_KEY);
  audio.volume = savedVol ? Number(savedVol) : 0.8;
  vol.value = String(audio.volume);
  vol.addEventListener("input", () => {
    audio.volume = Number(vol.value);
    localStorage.setItem(VOL_KEY, audio.volume.toString());
  });

  // Teclas rápidas
  document.addEventListener("keydown", (e) => {
    if (!scope.classList.contains("is-open")) return; // solo si la ventana está visible
    if (["INPUT","TEXTAREA"].includes(document.activeElement?.tagName)) return;
    if (e.code === "Space") { e.preventDefault(); toggle(); }
    if (e.key === "ArrowRight") { e.preventDefault(); audio.currentTime += 5; }
    if (e.key === "ArrowLeft")  { e.preventDefault(); audio.currentTime -= 5; }
    if (e.key === "ArrowUp")    { e.preventDefault(); audio.volume = Math.min(1, audio.volume + 0.05); vol.value = String(audio.volume); localStorage.setItem(VOL_KEY, audio.volume.toString()); }
    if (e.key === "ArrowDown")  { e.preventDefault(); audio.volume = Math.max(0, audio.volume - 0.05); vol.value = String(audio.volume); localStorage.setItem(VOL_KEY, audio.volume.toString()); }
  });

  // Arranque
  if (TRACKS.length) load(0);
})();
