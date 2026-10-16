/* ══════════════════════════════════════════════════════════════
   BLOG — BUILDER ARTIKEL (metadata dari blog-data.js)
   ──────────────────────────────────────────────────────────────
   Dipakai SEMUA halaman artikel (assets/site/<slug>/).

   File artikel cukup berisi:
     1. <head> boilerplate (identik utk semua post — copy-paste)
     2. <div class="post-body"> ... konten ... </div>
     3. dua <script> di bawah
   Sisanya DIBANGUN OTOMATIS dari blog-data.js:
     <title> • meta description • og:meta • .post-wrap •
     tombol [ ← Kembali ] • .post-meta (tanggal+durasi) •
     <h1> • chip .post-tags • .post-end

   CARA PAKAI (letakkan sebelum </body>):
     <script src="../../blog-data.js"></script>
     <script src="../article.js" data-post="assets/site/linux/build-t4nos.html"></script>

   ⚠ data-post HARUS sama persis dgn field "selengkapnya"
     post itu di blog-data.js (case-sensitive!)

   KOMPATIBEL MUNDUR: artikel versi lama yang udah punya
   .post-article / .post-meta / <h1> / .post-tags statis tetap
   jalan — nilainya ditimpa dari data, elemen gak diduplikat.
   ══════════════════════════════════════════════════════════════ */
(() => {
  "use strict";

  const POST_KEY = document.currentScript?.dataset.post;
  if (!POST_KEY) {
    console.warn(
      "[article] atribut data-post gak ada di <script src=article.js>",
    );
    return;
  }
  if (typeof BLOG === "undefined") {
    console.warn(
      "[article] BLOG gak ketemu — load blog-data.js DULU, baru article.js",
    );
    return;
  }

  const post = BLOG.find((b) => b.selengkapnya === POST_KEY);
  if (!post) {
    console.warn(
      `[article] data-post "${POST_KEY}" gak ada di blog-data.js — cek "selengkapnya"`,
    );
    return;
  }

  // helper: bikin elemen + class + innerHTML sekali jalan
  const el = (tag, cls, html) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  };

  /* ── 1. HEAD: <title> ──
     document.title otomatis bikin elemen <title> kalau belum ada */
  document.title = `${post.judul} • Gh0sT4n`;

  /* ── 2. HEAD: meta description + og:meta (buat kalau belum ada) ── */
  const ensureMeta = (attr, name, content) => {
    let m = document.head.querySelector(`meta[${attr}="${name}"]`);
    if (!m) {
      m = document.createElement("meta");
      m.setAttribute(attr, name);
      document.head.appendChild(m);
    }
    m.setAttribute("content", content);
  };
  ensureMeta("name", "description", post.subjudul);
  ensureMeta("property", "og:title", `${post.judul} • Gh0sT4n`);
  ensureMeta("property", "og:description", post.subjudul);
  ensureMeta("property", "og:type", "article");

  /* ── 3. BODY: konten artikel (satu-satunya yang wajib manual) ── */
  const content = document.querySelector(".post-body");
  if (!content) {
    console.warn(
      "[article] elemen .post-body gak ketemu — konten artikel wajib ada",
    );
    return;
  }

  /* ── 4. kerangka halaman ──
     Versi baru: gak ada .post-article → bangun seluruh shell
     (wrap + tombol kembali + article + penutup), konten dipindah
     ke dalamnya. Versi lama: pakai .post-article yang sudah ada. */
  let article = document.querySelector(".post-article");

  if (!article) {
    const wrap = el("div", "post-wrap");
    const back = el("a", "project-link post-back", "[ ← Kembali ke Blog ]");
    back.href = "../../index.html"; // jalan di local (file://) & GitHub Pages

    article = el("article", "post-article");
    const end = el("p", "post-end mono", "// end of post — thanks for reading");

    article.append(content, end); // pindahkan konten + tambah penutup
    wrap.append(back, article);
    document.body.append(wrap);
  }

  /* ── 5. header artikel: meta / h1 / chip tag ──
     bikin kalau belum ada (disisipkan SEBELUM .post-body),
     isi dari data — selalu ditimpa supaya konsisten */
  const bodyEl = article.querySelector(".post-body");

  const ensureInArticle = (selector, cls, tag) => {
    let node = article.querySelector(selector);
    if (!node) {
      node = el(tag, cls);
      if (bodyEl) article.insertBefore(node, bodyEl);
      else article.appendChild(node);
    }
    return node;
  };

  // baris meta: tanggal + durasi baca
  const meta = ensureInArticle(".post-meta", "post-meta mono", "div");
  meta.innerHTML = `
    <span><i class="ph ph-calendar-blank"></i> ${post.tanggal}</span>
    <span><i class="ph ph-clock"></i> ${post.durasi} menit baca</span>`;

  // judul h1
  const h1 = ensureInArticle("h1", null, "h1");
  h1.textContent = post.judul;

  // chip tag dari kategori ("a, b, c" → chip terpisah)
  const tagsWrap = ensureInArticle(".post-tags", "post-tags", "div");
  const tags = (post.kategori || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  tagsWrap.innerHTML = tags
    .map((t) => `<span class="tag">${t}</span>`)
    .join("");
})();
