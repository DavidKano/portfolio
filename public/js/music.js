// public/js/music.js
(() => {
  const audio = document.querySelector("#win-musica audio");
  const list = document.querySelector("#win-musica #musicList");
  const playBtn = document.querySelector("#win-musica #musicPlayAll");
  const status = document.querySelector("#win-musica #musicStatus");

  if (!audio || !list || !playBtn || !status) return;

  // Permite override desde la página:
  const TRACKS = (window.MUSIC_TRACKS && Array.isArray(window.MUSIC_TRACKS) && window.MUSIC_TRACKS.length)
    ? window.MUSIC_TRACKS
    : [
        { title: "Tema 1", src: "/assets/music/tema1.mp3" },
        { title: "Tema 2", src: "/assets/music/tema2.mp3" },
        { title: "Tema 3", src: "/assets/music/tema3.mp3" },
      ];

  list.innerHTML = "";
  TRACKS.forEach((t, i) => {
    const li = document.createElement("li");
    li.style.cursor = "pointer";
    li.style.padding = "6px 8px";
    li.textContent = t.title;
    li.dataset.index = String(i);
    list.appendChild(li);
  });

  let current = 0;
  function load(i) {
    current = i;
    const tr = TRACKS[current];
    audio.src = tr.src;
    status.textContent = `Reproduciendo: ${tr.title}`;
  }
  function play() {
    audio.play().catch(err => {
      status.textContent = "Toca “Reproducir” o elige una canción.";
      console.log("Autoplay bloqueado hasta interacción:", err);
    });
  }

  playBtn.addEventListener("click", () => { load(0); play(); });
  list.addEventListener("click", (e) => {
    const li = e.target.closest("li");
    if (!li) return;
    load(Number(li.dataset.index || 0));
    play();
  });
  audio.addEventListener("ended", () => {
    const next = (current + 1) % TRACKS.length;
    load(next); play();
  });
})();
