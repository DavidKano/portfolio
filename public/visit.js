// Cambia estos valores si necesitas separar contadores por página
const NAMESPACE = "davidkano-portfolio";
const KEY = "home";

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch(
      `https://api.countapi.xyz/hit/${encodeURIComponent(NAMESPACE)}/${encodeURIComponent(KEY)}`,
      { cache: "no-store" }
    );
    const data = await res.json();
    const value = typeof data.value === "number" ? data.value : (data.count ?? 0);
    const el = document.getElementById("visit-count");
    if (el) el.textContent = value.toLocaleString();
  } catch {
    // deja "—" si falla
  }
});
