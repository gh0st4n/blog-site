/* ══════════════════════════════════════════════════════════════
   BLOG.GH0ST4N.MY.ID — DATA POST
   ──────────────────────────────────────────────────────────────
   SATU-SATUNYA tempat nambah/menghapus post.
   index.html GAK PERLU disentuh — kartu dirender otomatis oleh
   script.js dari array di bawah (bagian 5: renderPosts).

   FIELD TIAP POST:
   kategori     → tags, dipisah KOMA ("linux, tutorial")
                  → jadi chip di kartu + kunci filter tag
   judul        → judul kartu (sekalian link ke artikel)
   subjudul     → excerpt/deskripsi singkat
   durasi       → angka menit baca ("9" → tampil "9 Menit")
   tanggal      → tampil apa adanya di kartu
   selengkapnya → path folder artikel (assets/site/.../)

   ATURAN:
   - Urutan tampil = urutan array → taruh post TERBARU di ATAS.
   - Penulisan tag KONSISTEN: "void-linux" dan "voidlinux"
     dianggap dua tag berbeda (muncul 2 tombol filter).
   - Path case-sensitive di GitHub Pages — samakan PERSIS dgn
     nama folder/file aslinya (Windows gak peduli, Pages peduli).

   CARA NAMBAH POST BARU:
   1. Bikin folder + index.html di assets/site/<slug>/
      (copy template dari post yang sudah ada)
   2. Duplikat satu objek { ... } di bawah, isi fieldnya
   3. Save → selesai. Chip tag, filter, search: nambah sendiri.
   ══════════════════════════════════════════════════════════════ */

const BLOG = [
  {
    kategori: "linux, void-linux, tutorial",
    judul: "Build T4n OS Sendiri: Dari Source sampai ISO",
    subjudul:
      "Catatan lengkap proses gue mem-build ISO T4n OS pakai T4n-Live dari repo kosong, xchroot, sampai ISO bisa di-boot.",
    durasi: "9",
    tanggal: "16 Dec 2026",
    selengkapnya: "assets/site/linux/build-t4nos.html",
  },
  // {
  //   kategori: "security, low-level, writeup",
  //   judul: "Catatan Belajar ROP: Return Oriented Programming di Linux",
  //   subjudul:
  //     "Dari stack smashing sampai menyusun gadget chain — catatan belajar pribadi soal exploit development di Linux x86-64.",
  //   durasi: "5",
  //   tanggal: "28 Dec 2026",
  //   selengkapnya: "assets/site/pwn.college/",
  // },
  // {
  //   kategori: "reverse-engineering, writeup",
  //   judul: "[ GANTI: judul post cracks.me ]",
  //   subjudul: "[ GANTI: deskripsi singkat post cracks.me ]",
  //   durasi: "7",
  //   tanggal: "[ GANTI: tanggal ]",
  //   selengkapnya: "assets/site/cracks.me/",
  // },
];
