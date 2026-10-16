/* ══════════════════════════════════════════════════════════════
   BLOG.GH0ST4N.MY.ID — JAVASCRIPT
   ──────────────────────────────────────────────────────────────
   DAFTAR ISI:
   0. Konfigurasi ........ titik edit utama (teks typewriter)
   1. Typewriter ......... tagline hero ngetik sendiri
   2. Hamburger menu ..... menu mobile
   3. Scroll reveal ...... animasi .fade-in-up
   4. Particles .......... background canvas hero
   5. Render posts ....... bangun kartu dari array BLOG
   6. Blog filter ........ search live + filter tag
   7. Inisialisasi ....... semua fitur dinyalakan di sini

   CATATAN:
   - File dimuat di AKHIR <body> + SETELAH blog-data.js
     (urutan di index.html) → BLOG & DOM pasti sudah ada.
     Kalau dipindah ke <head>, WAJIB tambah atribut defer.
   - Semua dibungkus IIFE (() => {...})() → variabel & function
     gak bocor ke global scope.
   - TAMBAH POST BARU: cukup tulis artikel di assets/site/<slug>/
     + tambah 1 objek di blog-data.js → kartu, chip tag, filter,
     search nambah OTOMATIS. Gak perlu sentuh file ini.
   - MAU MATIKAN FITUR SEMENTARA? Komentarin 1 baris di bagian 7.
   ══════════════════════════════════════════════════════════════ */
(() => {
  "use strict"; // ← directive asli, tanpa kurung

  /* ─────────────── 0. KONFIGURASI ───────────────
     Edit bagian ini dulu sebelum ubah yang lain. */

  // Kalimat yang diketik-hapus di tagline hero
  const TYPE_PHRASES = [
    "Write-ups • Notes • Tutorial",
    "Mostly Linux & Low-Level Security",
    "Ditulis pelan-pelan, dibaca cepat-cepat",
  ];

  // Pagination daftar post
  const POSTS_PER_PAGE = 5; // jumlah post per halaman
  const MAX_PAGE_BTNS = 5; // maks angka berurutan di bar pagination

  const REDUCED_MOTION = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  /* ─────────────── 1. TYPEWRITER ───────────────
     Tagline hero diketik-hapus-ganti secara bergantian.
     Edit daftar kalimat di TYPE_PHRASES (bagian 0). */
  function initTypewriter() {
    const span = document.getElementById("typewriter");
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
      const current = TYPE_PHRASES[phraseIndex];

      if (isDeleting) {
        span.textContent = current.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 50; // hapus lebih cepat
      } else {
        span.textContent = current.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 100;
      }

      if (!isDeleting && charIndex === current.length) {
        isDeleting = true;
        typeSpeed = 2000; // jeda saat kalimat lengkap
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % TYPE_PHRASES.length;
        typeSpeed = 500; // jeda sebelum kalimat baru
      }

      setTimeout(type, typeSpeed);
    }

    type();
  }

  /* ─────────────── 2. HAMBURGER MENU ───────────────
     Toggle menu mobile + auto-tutup saat link diklik. */
  function initHamburger() {
    const hamburger = document.getElementById("hamburger");
    const navContainer = document.getElementById("navLinks");

    hamburger.addEventListener("click", () => {
      navContainer.classList.toggle("active");
    });

    document.querySelectorAll(".nav-links a").forEach((link) => {
      link.addEventListener("click", () => {
        navContainer.classList.remove("active");
      });
    });
  }

  /* ─────────────── 3. SCROLL REVEAL ───────────────
     Elemen .fade-in-up muncul saat masuk viewport (sekali saja).
     Kartu post hasil renderPosts ikut ke-observe karena
     renderPosts() dijamin jalan SEBELUM function ini (bagian 7). */
  function initScrollReveal() {
    const elements = document.querySelectorAll(".fade-in-up");

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            obs.unobserve(entry.target); // animasi cuma sekali
          }
        });
      },
      { root: null, threshold: 0.15, rootMargin: "0px" },
    );

    elements.forEach((el) => observer.observe(el));
  }

  /* ─────────────── 4. PARTICLES ───────────────
     Background titik-titik ungu di hero.
     Ukuran canvas ikut ELEMEN (clientWidth/Height), bukan window
     — hero di sini pendek (bukan 100vh), kalau pakai innerHeight
     gambarnya bakal gepeng (lingkaran jadi elips). */
  function initParticles() {
    const canvas = document.getElementById("particles-canvas");
    const ctx = canvas.getContext("2d");
    let particlesArray = [];

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1; // 1–3 px
        this.speedX = Math.random() * 0.5 - 0.25; // gerak pelan
        this.speedY = Math.random() * 0.5 - 0.25;
        this.color = "rgba(124, 58, 237, 0.3)"; // ungu transparan
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        // wrap: keluar sisi → muncul di sisi sebaliknya
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
      }
      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function spawnParticles() {
      particlesArray = [];
      const total = Math.floor((canvas.width * canvas.height) / 15000);
      for (let i = 0; i < total; i++) {
        particlesArray.push(new Particle());
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particlesArray) {
        p.update();
        p.draw();
      }
      requestAnimationFrame(animate);
    }

    function sizeCanvas() {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    }

    sizeCanvas();
    spawnParticles();

    window.addEventListener("resize", () => {
      sizeCanvas();
      spawnParticles();
    });

    // user mematikan animasi → gambar frame statis saja
    if (REDUCED_MOTION) {
      particlesArray.forEach((p) => p.draw());
      return;
    }
    animate();
  }

  /* ─────────────── 5. RENDER POSTS ───────────────
     Bangun semua .post-card dari array BLOG (blog-data.js).
     WAJIB jalan PALING AWAL, karena filter/search/scroll-reveal
     semuanya membaca DOM hasil render ini.

     Field "kategori" ditulis dgn koma ("linux, tutorial") →
     dipecah jadi chip terpisah + diratakan jadi data-tags
     (dipisah spasi) untuk filter & search. */
  function renderPosts() {
    const list = document.getElementById("postsList");

    // data gak ke-load / kosong → tampilin pesan, jangan error
    if (typeof BLOG === "undefined" || !BLOG.length) {
      list.innerHTML =
        '<p class="empty-note mono">[ belum ada post / blog-data.js gak ke-load ]</p>';
      return;
    }

    list.innerHTML = BLOG.map((b) => {
      // "a, b, c" → ["a","b","c"] — trim spasi & buang yang kosong
      const tags = (b.kategori || "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      return `
        <article class="post-card fade-in-up" data-tags="${tags.join(" ")}">
          <div class="post-meta mono">
            <span><i class="ph ph-calendar-blank"></i> ${b.tanggal}</span>
            <span><i class="ph ph-clock"></i> ${b.durasi} Menit</span>
          </div>
          <h3 class="post-title">
            <a href="${b.selengkapnya}">${b.judul}</a>
          </h3>
          <p class="post-excerpt">${b.subjudul}</p>
          <div class="post-tags">
            ${tags.map((t) => `<span class="tag">${t}</span>`).join("")}
          </div>
          <a href="${b.selengkapnya}" class="project-link">[ Baca Selengkapnya → ]</a>
        </article>`;
    }).join("");
  }

  /* ─────────────── 6. BLOG FILTER + PAGINATION ───────────────
     - Chip tag dari data-tags; search dari seluruh teks kartu
     - Kartu yang lolos filter dipotong per halaman
       (POSTS_PER_PAGE) → sisanya disembunyikan
     - Bar pagination: [ First ] [ 1 ] … [ Last ], window geser
       maks MAX_PAGE_BTNS angka; halaman 1 & terakhir SELALU
       tampil; "…" disisipkan di celah yang bolong
     - Ganti tag / ketik search → kembali ke halaman 1 */
  function initBlogFilter() {
    const posts = [...document.querySelectorAll(".post-card")];
    const tagWrap = document.getElementById("tagFilters");
    const search = document.getElementById("blogSearch");
    const empty = document.getElementById("blogEmpty");
    const count = document.getElementById("postCount");
    const pagWrap = document.getElementById("pagination");
    let activeTag = "all";
    let currentPage = 1;

    /* -- susun isi bar pagination --
       return campuran angka & "…", mis. [1,2,3,4,5,"…",10] */
    function buildPageList(current, total) {
      // halaman sedikit → tampil semua, tanpa ellipsis
      if (total <= MAX_PAGE_BTNS) {
        return Array.from({ length: total }, (_, i) => i + 1);
      }

      // window geser sepanjang MAX_PAGE_BTNS, dipusatkan di current
      const half = Math.floor(MAX_PAGE_BTNS / 2);
      let start = Math.max(1, current - half);
      let end = Math.min(total, start + MAX_PAGE_BTNS - 1);
      start = Math.max(1, end - MAX_PAGE_BTNS + 1); // clamp ujung kanan

      // halaman 1 & terakhir dipaksa ikut → unik + urut
      const win = Array.from({ length: end - start + 1 }, (_, i) => start + i);
      const pages = [...new Set([1, ...win, total])].sort((a, b) => a - b);

      // sisipkan "…" setiap ada celah (selisih > 1)
      const out = [];
      pages.forEach((p, i) => {
        if (i > 0 && p - pages[i - 1] > 1) out.push("…");
        out.push(p);
      });
      return out;
    }

    /* -- render bar [ First ] [ angka/… ] [ Last ] -- */
    function renderPagination(total) {
      pagWrap.innerHTML = "";
      if (total <= 1) {
        pagWrap.hidden = true; // cuma 1 halaman → bar gak perlu
        return;
      }
      pagWrap.hidden = false;

      const goTo = (p) => {
        if (p < 1 || p > total || p === currentPage) return;
        currentPage = p;
        apply();
        document
          .getElementById("posts")
          .scrollIntoView({ behavior: REDUCED_MOTION ? "auto" : "smooth" });
      };

      const makeBtn = (
        label,
        page,
        { active = false, disabled = false } = {},
      ) => {
        const btn = document.createElement("button");
        btn.className = "filter-btn page-btn mono";
        btn.textContent = `[ ${label} ]`;
        if (active) {
          btn.classList.add("active");
          btn.setAttribute("aria-current", "page");
        }
        btn.disabled = disabled;
        if (page != null) btn.addEventListener("click", () => goTo(page));
        return btn;
      };

      // [ First ]
      pagWrap.appendChild(makeBtn("First", 1, { disabled: currentPage === 1 }));

      // angka + ellipsis
      buildPageList(currentPage, total).forEach((item) => {
        if (item === "…") {
          const dots = document.createElement("span");
          dots.className = "page-dots mono";
          dots.textContent = "…";
          pagWrap.appendChild(dots);
        } else {
          pagWrap.appendChild(
            makeBtn(String(item), item, {
              active: item === currentPage,
            }),
          );
        }
      });

      // [ Last ]
      pagWrap.appendChild(
        makeBtn("Last", total, { disabled: currentPage === total }),
      );
    }

    // filter + potong per halaman → tampilkan slice-nya saja
    function apply() {
      const q = search.value.trim().toLowerCase();

      // 1) kartu yang lolos tag + keyword
      const matched = posts.filter((p) => {
        const postTags = (p.dataset.tags || "").split(" ");
        const hay = (
          p.textContent +
          " " +
          (p.dataset.tags || "")
        ).toLowerCase();
        const okTag = activeTag === "all" || postTags.includes(activeTag);
        const okSearch = !q || hay.includes(q);
        return okTag && okSearch;
      });

      // 2) hitung total halaman & clamp posisi sekarang
      const totalPages = Math.max(
        1,
        Math.ceil(matched.length / POSTS_PER_PAGE),
      );
      if (currentPage > totalPages) currentPage = totalPages;

      // 3) sembunyikan semua → tampilkan hanya slice halaman ini
      const startIdx = (currentPage - 1) * POSTS_PER_PAGE;
      posts.forEach((p) => p.classList.add("is-hidden"));
      matched
        .slice(startIdx, startIdx + POSTS_PER_PAGE)
        .forEach((p) => p.classList.remove("is-hidden"));

      // 4) pesan kosong + hitungan "1–5 dari 23"
      empty.hidden = matched.length > 0;
      const to = startIdx + Math.min(POSTS_PER_PAGE, matched.length - startIdx);
      count.textContent = matched.length
        ? `Menampilkan ${startIdx + 1}–${to} dari ${matched.length} post`
        : "0 post";

      // 5) render bar pagination
      renderPagination(totalPages);
    }

    // bikin satu tombol tag
    function makeTagBtn(label, value) {
      const btn = document.createElement("button");
      btn.className = "filter-btn mono";
      btn.textContent = "[ " + label + " ]";
      btn.addEventListener("click", () => {
        if (btn.classList.contains("active")) return;
        tagWrap
          .querySelectorAll(".filter-btn")
          .forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        activeTag = value;
        currentPage = 1; // filter berubah → balik ke halaman awal
        apply();
      });
      return btn;
    }

    const allBtn = makeTagBtn("semua", "all");
    allBtn.classList.add("active");
    tagWrap.appendChild(allBtn);

    // kumpulin tag unik → tombol filter (urut abjad)
    const tags = [
      ...new Set(
        posts.flatMap((p) => (p.dataset.tags || "").split(" ").filter(Boolean)),
      ),
    ].sort();
    tags.forEach((t) => tagWrap.appendChild(makeTagBtn(t, t)));

    search.addEventListener("input", () => {
      currentPage = 1; // search berubah → balik ke halaman awal
      apply();
    });

    apply(); // render pertama
  }

  /* ─────────────── 7. INISIALISASI ───────────────
     Urutan PENTING: renderPosts() harus PALING AWAL —
     initScrollReveal & initBlogFilter membaca DOM hasil render.
     Sisanya bebas urutannya. Mau matikan sementara satu fitur?
     Komentarin satu barisnya. */
  renderPosts();
  initTypewriter();
  initHamburger();
  initScrollReveal();
  initParticles();
  initBlogFilter();
})();
