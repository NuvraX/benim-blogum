/* ===== Utilities ===== */
const $ = (q, c = document) => c.querySelector(q);
const $$ = (q, c = document) => [...c.querySelectorAll(q)];
const store = (k, v) => localStorage.setItem(k, JSON.stringify(v));
const load  = (k, d) => JSON.parse(localStorage.getItem(k) || JSON.stringify(d));

/* ===== Theme ===== */
(() => {
  const root = document.documentElement;
  const saved = load("theme", null);
  if (saved) root.setAttribute("data-theme", saved);
  const btn = $("#themeToggle");
  if (btn) btn.addEventListener("click", () => {
    const cur = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    root.setAttribute("data-theme", cur);
    store("theme", cur);
  });
})();

/* ===== Header Menu ===== */
(() => {
  const t = $("#navToggle"), m = $("#navMenu");
  if (!t || !m) return;
  t.addEventListener("click", () => {
    const open = m.classList.toggle("show");
    t.setAttribute("aria-expanded", open);
  });
  document.addEventListener("click", (e) => {
    if (!m.contains(e.target) && !t.contains(e.target)) m.classList.remove("show");
  });
})();

/* ===== Footer year ===== */
(() => { const y = $("#y"); if (y) y.textContent = new Date().getFullYear(); })();

/* ===== Blog: load + render ===== */
const state = {
  posts: [],
  filtered: [],
  tag: "all",
  q: ""
};

async function loadPosts() {
  try {
    const res = await fetch("posts.json", { cache: "no-store" });
    if (!res.ok) throw new Error("posts.json bulunamadı");
    const data = await res.json();
    state.posts = data.posts.sort((a,b) => new Date(b.date) - new Date(a.date));
    applyFilters();
  } catch (err) {
    console.error(err);
    const empty = $("#emptyState");
    if (empty) { empty.classList.remove("hidden"); empty.textContent = "Yazıları yüklerken sorun oluştu.";}
  }
}

function applyFilters() {
  const q = state.q.trim().toLowerCase();
  state.filtered = state.posts.filter(p => {
    const tagOk = state.tag === "all" || (p.tags||[]).includes(state.tag);
    const qOk = !q || [p.title, p.excerpt, p.content].join(" ").toLowerCase().includes(q);
    return tagOk && qOk;
  });
  renderPosts();
}

function postCard(p) {
  const html = `
  <article class="card post" data-id="${p.id}">
    <img src="${p.cover || 'img/post-placeholder.webp'}" alt="" loading="lazy">
    <div class="card-body">
      <div class="meta"><span>${new Date(p.date).toLocaleDateString('tr-TR')}</span> • <span>${(p.tags||[]).join(', ')}</span></div>
      <h3>${p.title}</h3>
      <p class="muted">${p.excerpt}</p>
      <div class="actions">
        <button class="btn btn-primary read-btn" data-id="${p.id}">Oku</button>
      </div>
    </div>
  </article>`;
  return html;
}

function renderPosts() {
  const container = $("#posts");
  const empty = $("#emptyState");
  if (!container) return;
  container.innerHTML = state.filtered.map(postCard).join("");
  if (state.filtered.length === 0) empty?.classList.remove("hidden");
  else empty?.classList.add("hidden");

  $$(".read-btn", container).forEach(btn =>
    btn.addEventListener("click", () => openModal(+btn.dataset.id))
  );
}

/* ===== Modal ===== */
function openModal(id) {
  const p = state.posts.find(x => x.id === id);
  if (!p) return;
  $("#mTitle").textContent = p.title;
  $("#mMeta").textContent = `${new Date(p.date).toLocaleDateString('tr-TR')} • ${(p.tags||[]).join(', ')}`;
  $("#mContent").innerHTML = p.content;
  $("#postModal").showModal();
}
(() => {
  const m = $("#postModal"), c = $("#mClose");
  if (m && c) {
    c.addEventListener("click", () => m.close());
    m.addEventListener("click", e => { if (e.target === m) m.close(); });
  }
})();

/* ===== Filters & Search ===== */
(() => {
  const chips = $$(".chip");
  chips.forEach(ch => ch.addEventListener("click", () => {
    chips.forEach(c => c.classList.remove("is-active"));
    ch.classList.add("is-active");
    state.tag = ch.dataset.tag;
    applyFilters();
  }));
  const form = $("#searchForm");
  const input = $("#searchInput");
  if (form && input) {
    form.addEventListener("submit", (e) => { e.preventDefault(); state.q = input.value; applyFilters(); });
    input.addEventListener("input", (e) => { state.q = e.target.value; applyFilters(); });
  }
})();

/* ===== Contact form (mailto) ===== */
(() => {
  const form = $("#contactForm"); if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const name = fd.get("name"); const email = fd.get("email"); const subject = fd.get("subject"); const message = fd.get("message");
    const mailto = `mailto:${encodeURIComponent('civanmertkrc@gmail.com')}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Ad: ${name}\nEposta: ${email}\n\n${message}`)}`;
    $("#formStatus").textContent = "E-posta istemcin açılıyor…";
    window.location.href = mailto;
    form.reset();
  });
})();

/* ===== Boot ===== */
document.addEventListener("DOMContentLoaded", () => {
  if ($("#posts")) loadPosts();
});
