/* ==========================================================================
   Bimbel Indonesia - Public Landing, Blog, Login & Register Views
   ========================================================================== */
(function (window) {
  'use strict';

  const S = window.BimbelStore;

  function escapeHtml(str) {
    return String(str ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function renderPublicNavbar(activeSection) {
    const st = S.state.settings;
    const user = S.getCurrentUser();
    let rightBtns = '';
    if (user) {
      const dashRoute = user.role === 'admin' ? 'admin/dashboard' : (user.role === 'tutor' ? 'tutor/dashboard' : 'siswa/dashboard');
      const roleLabel = user.role === 'admin' ? 'Panel Admin' : (user.role === 'tutor' ? 'Panel Tutor' : 'Ruang Siswa');
      rightBtns = `
        <a href="#/${dashRoute}" class="btn btn-brand rounded-pill px-3"><i class="fa-solid fa-gauge-high me-1"></i>${roleLabel} (${escapeHtml(user.nama.split(' ')[0])})</a>
        <button type="button" class="btn btn-soft rounded-pill px-3" data-action="logout"><i class="fa-solid fa-arrow-right-from-bracket me-1"></i>Keluar</button>
      `;
    } else {
      rightBtns = `
        <a href="#/auth/login" class="btn btn-soft rounded-pill px-3">Masuk</a>
        <a href="#/auth/register" class="btn btn-brand rounded-pill px-3">Daftar Siswa</a>
      `;
    }

    return `
    <nav class="navbar navbar-expand-lg landing-navbar sticky-top">
      <div class="container">
        <a class="navbar-brand brand-mark" href="#/home">
          <span class="brand-icon"><i class="fa-solid fa-graduation-cap"></i></span>
          <span>${escapeHtml(st.site_name)}<small>${escapeHtml(st.site_tagline)}</small></span>
        </a>
        <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navLanding" aria-controls="navLanding" aria-expanded="false" aria-label="Buka menu">
          <i class="fa-solid fa-bars"></i>
        </button>
        <div class="collapse navbar-collapse" id="navLanding">
          <ul class="navbar-nav mx-auto mb-2 mb-lg-0">
            <li class="nav-item"><a class="nav-link ${activeSection === 'home' ? 'text-brand fw-bold' : ''}" href="#/home">Beranda</a></li>
            <li class="nav-item"><a class="nav-link" href="#/home" data-scroll-to="#program">Program</a></li>
            <li class="nav-item"><a class="nav-link" href="#/home" data-scroll-to="#paket">Paket Belajar</a></li>
            <li class="nav-item"><a class="nav-link" href="#/home" data-scroll-to="#keunggulan">Keunggulan</a></li>
            <li class="nav-item"><a class="nav-link" href="#/home" data-scroll-to="#tutor">Tutor</a></li>
            <li class="nav-item"><a class="nav-link ${activeSection === 'blog' ? 'text-brand fw-bold' : ''}" href="#/blog">Blog</a></li>
            <li class="nav-item"><a class="nav-link" href="#/home" data-scroll-to="#faq">FAQ</a></li>
          </ul>
          <div class="d-flex align-items-center gap-2">
            ${rightBtns}
          </div>
        </div>
      </div>
    </nav>`;
  }

  function renderPublicFooter() {
    const st = S.state.settings;
    const programs = S.state.programs.filter(p => p.status === 'aktif').slice(0, 4);
    return `
    <footer class="landing-footer">
      <div class="container">
        <div class="row g-4">
          <div class="col-lg-4">
            <a class="brand-mark footer-brand mb-3" href="#/home">
              <span class="brand-icon"><i class="fa-solid fa-graduation-cap"></i></span>
              <span>${escapeHtml(st.site_name)}<small>${escapeHtml(st.site_tagline)}</small></span>
            </a>
            <p class="small mt-3" style="max-width:340px">${escapeHtml(st.site_description)}</p>
            <div class="footer-social d-flex gap-2 mt-3">
              <a href="${escapeHtml(st.instagram)}" target="_blank" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
              <a href="${escapeHtml(st.youtube)}" target="_blank" aria-label="YouTube"><i class="fa-brands fa-youtube"></i></a>
              <a href="${escapeHtml(st.whatsapp)}" target="_blank" aria-label="WhatsApp"><i class="fa-brands fa-whatsapp"></i></a>
            </div>
          </div>
          <div class="col-6 col-lg-2">
            <h6>Program</h6>
            <ul class="list-unstyled d-grid gap-2">
              ${programs.map(p => `<li><a href="#/home" data-scroll-to="#program">${escapeHtml(p.nama)}</a></li>`).join('')}
            </ul>
          </div>
          <div class="col-6 col-lg-2">
            <h6>Perusahaan</h6>
            <ul class="list-unstyled d-grid gap-2">
              <li><a href="#/home" data-scroll-to="#keunggulan">Tentang Kami</a></li>
              <li><a href="#/home" data-scroll-to="#tutor">Tutor</a></li>
              <li><a href="#/blog">Blog</a></li>
              <li><a href="#/home" data-scroll-to="#faq">FAQ</a></li>
            </ul>
          </div>
          <div class="col-lg-4">
            <h6>Kontak</h6>
            <p class="small mb-2"><i class="fa-solid fa-envelope me-2"></i>${escapeHtml(st.email)}</p>
            <p class="small mb-2"><i class="fa-solid fa-phone me-2"></i>${escapeHtml(st.phone)}</p>
            <p class="small"><i class="fa-solid fa-location-dot me-2"></i>${escapeHtml(st.address)}</p>
            <a href="#/auth/register" class="btn btn-accent rounded-pill mt-2 px-4">Mulai Belajar Gratis</a>
          </div>
        </div>
        <div class="footer-bottom d-flex flex-wrap justify-content-between gap-2">
          <span>&copy; 2026 ${escapeHtml(st.site_name)}. All rights reserved.</span>
          <span>Platform Bimbingan Belajar Terpadu &middot; Bootstrap 5</span>
        </div>
      </div>
    </footer>`;
  }

  function renderHome() {
    document.body.className = 'landing-body';
    const st = S.state.settings;
    const sliders = S.state.sliders
      .filter(s => s.status === 'aktif')
      .sort((a, b) => Number(a.urutan) - Number(b.urutan));

    const siswaCount = S.state.users.filter(u => u.role === 'siswa').length + 6; // matches 11+
    const tutorCount = S.state.users.filter(u => u.role === 'tutor' && u.status === 'aktif').length;
    const programCount = S.state.programs.filter(p => p.status === 'aktif').length;

    const programs = S.state.programs.filter(p => p.status === 'aktif');
    const packages = S.state.packages.filter(p => p.status === 'aktif');
    const tutors = S.state.users.filter(u => u.role === 'tutor' && u.status === 'aktif');
    const testimonials = S.state.testimonials.filter(t => t.status === 'aktif');
    const blogs = S.state.blogs.filter(b => b.status === 'publish').slice(0, 3);
    const faqs = S.state.faqs;
    const user = S.getCurrentUser();

    let heroHtml = '';
    if (sliders.length > 0) {
      heroHtml = `
      <section class="hero-carousel">
        <div id="heroCarousel" class="carousel slide carousel-fade" data-bs-ride="carousel" data-bs-interval="5500">
          <div class="carousel-indicators">
            ${sliders.map((s, idx) => `
              <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="${idx}" class="${idx === 0 ? 'active' : ''}" aria-label="Slide ${idx + 1}"></button>
            `).join('')}
          </div>
          <div class="carousel-inner">
            ${sliders.map((s, idx) => `
              <div class="carousel-item ${idx === 0 ? 'active' : ''}">
                <div class="hero-slide hero-image">
                  <img src="${escapeHtml(s.image)}" alt="${escapeHtml(s.title)}">
                </div>
              </div>
            `).join('')}
          </div>
          ${sliders.length > 1 ? `
            <button class="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev"><span class="carousel-control-prev-icon" aria-hidden="true"></span><span class="visually-hidden">Sebelumnya</span></button>
            <button class="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next"><span class="carousel-control-next-icon" aria-hidden="true"></span><span class="visually-hidden">Berikutnya</span></button>
          ` : ''}
        </div>
      </section>`;
    } else {
      heroHtml = `
      <section class="hero-carousel">
        <div class="hero-slide hero-default">
          <div class="hero-blob b1"></div>
          <div class="hero-blob b2"></div>
          <div class="container">
            <div class="row">
              <div>
                <span class="hero-kicker"><i class="fa-solid fa-star"></i> Bimbel Online Terbaik</span>
                <h1 class="hero-title">Belajar Lebih Mudah, Raih Prestasi Lebih Tinggi</h1>
                <p class="hero-sub">${escapeHtml(st.site_description)}</p>
                <div class="d-flex flex-wrap gap-2 mt-4">
                  <a href="#/auth/register" class="btn btn-brand btn-lg rounded-pill">Daftar Sekarang <i class="fa-solid fa-arrow-right ms-1"></i></a>
                  <a href="#/home" data-scroll-to="#program" class="btn btn-soft btn-lg rounded-pill">Lihat Program</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>`;
    }

    return `
      ${renderPublicNavbar('home')}
      ${heroHtml}

      <section class="trust-strip">
        <div class="container">
          <div class="trust-inner">
            <div class="row g-3 align-items-center">
              <div class="col-6 col-lg-3">
                <div class="trust-item"><span class="brand-icon"><i class="fa-solid fa-user-graduate"></i></span><div><div class="num">${siswaCount}</div><div class="txt">Siswa terdaftar</div></div></div>
              </div>
              <div class="col-6 col-lg-3">
                <div class="trust-item"><span class="brand-icon"><i class="fa-solid fa-chalkboard-user"></i></span><div><div class="num">${tutorCount}</div><div class="txt">Tutor terdaftar</div></div></div>
              </div>
              <div class="col-6 col-lg-3">
                <div class="trust-item"><span class="brand-icon"><i class="fa-solid fa-layer-group"></i></span><div><div class="num">${programCount}</div><div class="txt">Program belajar</div></div></div>
              </div>
              <div class="col-6 col-lg-3">
                <div class="trust-item"><span class="brand-icon"><i class="fa-solid fa-laptop"></i></span><div><div class="num">100%</div><div class="txt">Kelas online</div></div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="section-padding" id="program">
        <div class="container">
          <div class="text-center mb-5">
            <span class="section-eyebrow"><i class="fa-solid fa-layer-group"></i> Program Belajar</span>
            <h2 class="section-title">Pilih program yang paling cocok untukmu</h2>
            <p class="section-desc">Dari penguatan materi sekolah sampai persiapan ujian, semua tersedia dengan kurikulum yang terstruktur.</p>
          </div>
          <div class="row g-4">
            ${programs.map(p => {
              const targetHref = user && user.role === 'siswa' ? '#/siswa/katalog' : '#/auth/register';
              return `
              <div class="col-md-6 col-lg-3">
                <article class="card program-card card-hover">
                  <div class="thumb" style="background-image:url('${escapeHtml(p.thumbnail || 'uploads/programs/program-matematika.svg')}')">
                    <span class="tag">${escapeHtml(p.kategori || 'Program')}</span>
                  </div>
                  <div class="body d-flex flex-column">
                    <h3 class="h6 mb-2">${escapeHtml(p.nama)}</h3>
                    <p class="small text-muted mb-3 flex-grow-1">${escapeHtml(p.deskripsi)}</p>
                    <div class="d-flex align-items-center justify-content-between mt-auto">
                      <div>
                        <div class="small text-muted">Mulai dari</div>
                        <div class="price">${S.formatRupiah(p.harga_mulai)}</div>
                      </div>
                      <a href="${targetHref}" class="btn btn-soft rounded-pill btn-sm">Pilih <i class="fa-solid fa-arrow-right ms-1"></i></a>
                    </div>
                  </div>
                </article>
              </div>`;
            }).join('')}
          </div>
        </div>
      </section>

      <section class="section-padding pt-0" id="paket">
        <div class="container">
          <div class="text-center mb-5">
            <span class="section-eyebrow"><i class="fa-solid fa-box-open"></i> Paket Belajar</span>
            <h2 class="section-title">Investasi terbaik untuk masa depanmu</h2>
            <p class="section-desc">Pilih paket belajar dengan jadwal fleksibel, modul lengkap, latihan soal, dan try out berkala.</p>
          </div>
          <div class="row g-4 justify-content-center">
            ${packages.map(pkg => {
              const prog = S.state.programs.find(pr => pr.id === Number(pkg.program_id));
              const checkoutHref = user && user.role === 'siswa' ? `#/siswa/checkout?package_id=${pkg.id}` : `#/auth/register?package_id=${pkg.id}`;
              return `
              <div class="col-md-6 col-lg-4">
                <div class="card program-card card-hover h-100 p-4 position-relative ${pkg.is_popular ? 'border-success border-2' : ''}">
                  <div class="d-flex justify-content-between align-items-center mb-3">
                    <span class="chip chip-brand">${escapeHtml(prog ? prog.nama : 'Program')}</span>
                    ${pkg.is_popular ? '<span class="badge rounded-pill" style="background:#176b59;color:#fff">Paling Populer</span>' : ''}
                  </div>
                  <h3 class="h5 mb-1">${escapeHtml(pkg.nama)}</h3>
                  <div class="h4 fw-bold text-brand my-2">${S.formatRupiah(pkg.harga)} <small class="text-muted fw-normal" style="font-size:.8rem">/paket</small></div>
                  <p class="small text-muted mb-3">${escapeHtml(pkg.deskripsi)}</p>
                  <ul class="list-unstyled d-grid gap-2 small mb-4">
                    ${(pkg.fitur || [`${pkg.durasi_bulan} bulan belajar`, `${pkg.jumlah_pertemuan} pertemuan live`, 'Materi & latihan soal', 'Try out dan pembahasan']).map(f => `
                      <li class="d-flex align-items-center gap-2"><i class="fa-solid fa-circle-check text-brand"></i><span>${escapeHtml(f)}</span></li>
                    `).join('')}
                  </ul>
                  <a href="${checkoutHref}" class="btn ${pkg.is_popular ? 'btn-brand' : 'btn-soft'} rounded-pill w-100 mt-auto">Pilih Paket <i class="fa-solid fa-arrow-right ms-1"></i></a>
                </div>
              </div>`;
            }).join('')}
          </div>
        </div>
      </section>

      <section class="section-padding pt-0" id="keunggulan">
        <div class="container">
          <div class="row align-items-center g-5">
            <div class="col-lg-5">
              <span class="section-eyebrow"><i class="fa-solid fa-heart"></i> Kenapa ${escapeHtml(st.site_name)}?</span>
              <h2 class="section-title">Belajar nyaman, hasil lebih maksimal</h2>
              <p class="text-muted">Kami percaya belajar terbaik terjadi saat siswa merasa aman untuk bertanya, mencoba, dan membuat kesalahan. Karena itu, setiap kelas dirancang personal dan menyenangkan.</p>
              <div class="d-flex flex-wrap gap-2 mt-3">
                <span class="chip chip-success"><i class="fa-solid fa-check"></i> Kelas kecil</span>
                <span class="chip chip-brand"><i class="fa-solid fa-check"></i> Tutor terverifikasi</span>
                <span class="chip chip-warning"><i class="fa-solid fa-check"></i> Laporan progres</span>
              </div>
            </div>
            <div class="col-lg-7">
              <div class="row g-3">
                <div class="col-sm-6"><div class="feature-card"><div class="feature-icon fi-blue"><i class="fa-solid fa-chalkboard-user"></i></div><h3 class="h6">Tutor Berpengalaman</h3><p class="small text-muted mb-0">Dibimbing tutor pilihan yang paham cara menjelaskan materi dengan bahasa sederhana.</p></div></div>
                <div class="col-sm-6"><div class="feature-card"><div class="feature-icon fi-yellow"><i class="fa-solid fa-clock"></i></div><h3 class="h6">Belajar Fleksibel</h3><p class="small text-muted mb-0">Ikuti kelas online dari mana saja dan akses materi kapan pun dibutuhkan.</p></div></div>
                <div class="col-sm-6"><div class="feature-card"><div class="feature-icon fi-purple"><i class="fa-solid fa-clipboard-check"></i></div><h3 class="h6">Latihan & Try Out</h3><p class="small text-muted mb-0">Uji kemampuan dengan soal berbatas waktu dan pembahasan yang jelas.</p></div></div>
                <div class="col-sm-6"><div class="feature-card"><div class="feature-icon fi-pink"><i class="fa-solid fa-chart-line"></i></div><h3 class="h6">Progres Terukur</h3><p class="small text-muted mb-0">Pantau nilai, kehadiran, dan perkembangan belajar dalam satu dashboard.</p></div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="section-padding" id="tutor">
        <div class="container">
          <div class="text-center mb-5">
            <span class="section-eyebrow"><i class="fa-solid fa-user-tie"></i> Tutor Kami</span>
            <h2 class="section-title">Belajar bersama tutor yang tepat</h2>
            <p class="section-desc">Tutor berpengalaman, ramah, dan siap membantu kamu memahami materi tanpa rasa takut.</p>
          </div>
          <div class="row g-4 justify-content-center">
            ${tutors.map(t => `
              <div class="col-sm-6 col-lg-4">
                <div class="tutor-card">
                  <img src="${escapeHtml(t.avatar || 'assets/img/avatar.svg')}" class="tutor-avatar" alt="${escapeHtml(t.nama)}">
                  <h3 class="h6 mb-1">${escapeHtml(t.nama)}</h3>
                  <div class="small text-brand fw-semibold mb-2">${escapeHtml(t.spesialisasi || 'Tutor Bimbel')}</div>
                  <p class="small text-muted mb-0">${escapeHtml(t.bio || '')}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>

      <section class="section-padding">
        <div class="container">
          <div class="text-center mb-5">
            <span class="section-eyebrow"><i class="fa-solid fa-quote-left"></i> Testimoni</span>
            <h2 class="section-title">Cerita mereka yang sudah merasakan</h2>
          </div>
          <div class="row g-4">
            ${testimonials.map(tm => `
              <div class="col-md-4">
                <div class="testimonial-card d-flex flex-column">
                  <div class="stars mb-3">
                    ${'<i class="fa-solid fa-star"></i>'.repeat(Math.max(1, Math.min(5, Number(tm.rating) || 5)))}
                  </div>
                  <p class="mb-4 flex-grow-1">"${escapeHtml(tm.pesan)}"</p>
                  <div class="d-flex align-items-center gap-2 mt-auto">
                    <img src="${escapeHtml(tm.avatar || 'assets/img/avatar.svg')}" class="avatar" alt="">
                    <div>
                      <div class="fw-semibold small">${escapeHtml(tm.nama)}</div>
                      <div class="text-muted" style="font-size:.72rem">${escapeHtml(tm.info)}</div>
                    </div>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>

      <section class="section-padding pt-0" id="blog">
        <div class="container">
          <div class="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
            <div>
              <span class="section-eyebrow"><i class="fa-solid fa-newspaper"></i> Blog & Tips</span>
              <h2 class="section-title mb-0">Wawasan untuk belajar lebih baik</h2>
            </div>
            <a href="#/blog" class="btn btn-soft rounded-pill">Semua artikel <i class="fa-solid fa-arrow-right ms-1"></i></a>
          </div>
          <div class="row g-4">
            ${blogs.map(b => `
              <div class="col-md-4">
                <article class="card blog-card card-hover">
                  <div class="thumb" style="background-image:url('${escapeHtml(b.thumbnail || 'uploads/blog/blog-belajar.svg')}')"></div>
                  <div class="body d-flex flex-column">
                    <div class="small text-muted mb-2"><i class="fa-regular fa-calendar me-1"></i>${escapeHtml(b.tanggal)} &middot; ${escapeHtml(b.penulis)}</div>
                    <h3 class="h6">${escapeHtml(b.judul)}</h3>
                    <p class="small text-muted flex-grow-1">${escapeHtml(b.ringkasan)}</p>
                    <a href="#/blog?id=${b.id}" class="small fw-bold text-brand">Baca artikel <i class="fa-solid fa-arrow-right ms-1"></i></a>
                  </div>
                </article>
              </div>
            `).join('')}
          </div>
        </div>
      </section>

      <section class="section-padding pt-0" id="faq">
        <div class="container">
          <div class="row g-5">
            <div class="col-lg-4">
              <span class="section-eyebrow"><i class="fa-solid fa-circle-question"></i> FAQ</span>
              <h2 class="section-title">Pertanyaan yang sering ditanyakan</h2>
              <p class="text-muted">Belum menemukan jawaban? Hubungi kami melalui WhatsApp atau email di halaman kontak.</p>
            </div>
            <div class="col-lg-8">
              <div class="accordion faq-accordion" id="faqAccordion">
                ${faqs.map((f, idx) => `
                  <div class="accordion-item">
                    <h3 class="accordion-header">
                      <button class="accordion-button ${idx === 0 ? '' : 'collapsed'}" type="button" data-bs-toggle="collapse" data-bs-target="#faq${idx}" aria-expanded="${idx === 0 ? 'true' : 'false'}">${escapeHtml(f.pertanyaan)}</button>
                    </h3>
                    <div id="faq${idx}" class="accordion-collapse collapse ${idx === 0 ? 'show' : ''}" data-bs-parent="#faqAccordion">
                      <div class="accordion-body text-muted">${escapeHtml(f.jawaban)}</div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="pb-5">
        <div class="container">
          <div class="cta-section">
            <div class="row align-items-center g-4">
              <div class="col-lg-8">
                <h2 class="mb-2" style="font-size:clamp(1.7rem,3vw,2.4rem)">${escapeHtml(st.cta_title || 'Siap meraih prestasi lebih tinggi?')}</h2>
                <p class="mb-0" style="color:rgba(255,255,255,.8)">${escapeHtml(st.cta_subtitle || 'Daftar gratis hari ini dan temukan cara belajar yang lebih mudah bersama Bimbel Indonesia.')}</p>
              </div>
              <div class="col-lg-4 text-lg-end">
                <a href="#/auth/register" class="btn btn-accent btn-lg rounded-pill">Daftar Siswa <i class="fa-solid fa-arrow-right ms-1"></i></a>
              </div>
            </div>
          </div>
        </div>
      </section>

      ${renderPublicFooter()}
    `;
  }

  function renderBlog(params) {
    document.body.className = 'landing-body';
    const blogId = params.get('id');
    const slug = params.get('slug');
    const q = (params.get('q') || '').trim().toLowerCase();

    if (blogId || slug) {
      const article = S.state.blogs.find(b =>
        (blogId && Number(b.id) === Number(blogId)) ||
        (slug && b.slug === slug)
      ) || S.state.blogs[0];

      if (article) {
        const shareText = encodeURIComponent(article.judul + ' - ' + window.location.href);
        return `
          ${renderPublicNavbar('blog')}
          <section class="py-5" style="background:linear-gradient(115deg,#174f43,#176b59);color:#fff">
            <div class="container py-2">
              <a href="#/blog" class="text-white-50 small text-decoration-none"><i class="fa-solid fa-arrow-left me-1"></i>Semua Artikel</a>
              <h1 class="mt-3 mb-2 text-white">${escapeHtml(article.judul)}</h1>
              <div class="small text-white-50"><i class="fa-regular fa-user me-1"></i>${escapeHtml(article.penulis)} &middot; <i class="fa-regular fa-calendar ms-2 me-1"></i>${escapeHtml(article.tanggal)}</div>
            </div>
          </section>
          <section class="section-padding">
            <div class="container">
              <div class="row g-4 justify-content-center">
                <div class="col-lg-8">
                  <article class="card-soft p-3 p-md-4 bg-white">
                    <img src="${escapeHtml(article.thumbnail || 'uploads/blog/blog-belajar.svg')}" alt="${escapeHtml(article.judul)}" class="img-fluid rounded-4 mb-4" style="width:100%;max-height:420px;object-fit:cover">
                    <p class="lead text-muted">${escapeHtml(article.ringkasan)}</p>
                    <div class="article-content">${article.konten}</div>
                    <div class="d-flex flex-wrap align-items-center gap-2 mt-4 pt-3 border-top">
                      <span class="small text-muted">Bagikan:</span>
                      <a href="https://wa.me/?text=${shareText}" target="_blank" class="btn btn-soft btn-sm rounded-pill"><i class="fa-brands fa-whatsapp me-1"></i>WhatsApp</a>
                      <a href="#/auth/register" class="btn btn-brand btn-sm rounded-pill ms-auto">Mulai Belajar</a>
                    </div>
                  </article>
                </div>
              </div>
            </div>
          </section>
          ${renderPublicFooter()}
        `;
      }
    }

    const articles = S.state.blogs.filter(b => {
      if (b.status !== 'publish') return false;
      if (!q) return true;
      return b.judul.toLowerCase().includes(q) || b.ringkasan.toLowerCase().includes(q);
    });

    return `
      ${renderPublicNavbar('blog')}
      <section class="py-5" style="background:linear-gradient(115deg,#174f43,#176b59);color:#fff">
        <div class="container py-2">
          <span class="hero-kicker"><i class="fa-solid fa-newspaper"></i> Blog</span>
          <h1 class="mt-3 mb-2 text-white">Artikel & Tips Belajar</h1>
          <p class="mb-0 text-white-50">Informasi bermanfaat untuk perjalanan belajar kamu.</p>
        </div>
      </section>
      <section class="section-padding">
        <div class="container">
          <form id="blogSearchForm" class="row g-2 justify-content-center mb-5">
            <div class="col-md-6"><input type="text" name="q" class="form-control form-control-lg rounded-pill" value="${escapeHtml(q)}" placeholder="Cari artikel..."></div>
            <div class="col-auto"><button type="submit" class="btn btn-brand btn-lg rounded-pill px-4"><i class="fa-solid fa-search"></i></button></div>
          </form>
          <div class="row g-4">
            ${articles.length === 0 ? `<div class="col-12"><div class="empty-state"><div class="icon"><i class="fa-regular fa-newspaper"></i></div><p>Artikel tidak ditemukan.</p></div></div>` : articles.map(b => `
              <div class="col-md-6 col-lg-4">
                <article class="card blog-card card-hover h-100">
                  <div class="thumb" style="background-image:url('${escapeHtml(b.thumbnail || 'uploads/blog/blog-belajar.svg')}')"></div>
                  <div class="body d-flex flex-column">
                    <div class="small text-muted mb-2"><i class="fa-regular fa-calendar me-1"></i>${escapeHtml(b.tanggal)} &middot; ${escapeHtml(b.penulis)}</div>
                    <h2 class="h6"><a href="#/blog?id=${b.id}" class="text-decoration-none text-dark">${escapeHtml(b.judul)}</a></h2>
                    <p class="small text-muted flex-grow-1">${escapeHtml(b.ringkasan)}</p>
                    <a href="#/blog?id=${b.id}" class="small fw-bold text-brand">Baca Selengkapnya <i class="fa-solid fa-arrow-right ms-1"></i></a>
                  </div>
                </article>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
      ${renderPublicFooter()}
    `;
  }

  function renderLogin() {
    document.body.className = 'auth-body auth-login';
    const st = S.state.settings;
    return `
    <div class="auth-split">
      <section class="auth-visual">
        <a href="#/home" class="brand-mark">
          <span class="brand-icon"><i class="fa-solid fa-graduation-cap"></i></span>
          <span>${escapeHtml(st.site_name)}<small>${escapeHtml(st.site_tagline)}</small></span>
        </a>
        <div class="my-auto py-5">
          <span class="hero-kicker"><i class="fa-solid fa-star"></i> Belajar #LebihMudah</span>
          <h1>Selamat datang kembali. Lanjutkan perjalanan belajarmu.</h1>
          <p>Bergabung bersama ribuan pelajar yang belajar lebih terarah bersama tutor berpengalaman.</p>
          <div class="mt-4">
            <div class="auth-feature">
              <span class="ic"><i class="fa-solid fa-chalkboard-user"></i></span>
              <div><strong class="d-block">Tutor berpengalaman</strong><span class="small">Pendampingan personal di kelas kecil.</span></div>
            </div>
            <div class="auth-feature">
              <span class="ic"><i class="fa-solid fa-book-open"></i></span>
              <div><strong class="d-block">Materi lengkap</strong><span class="small">Modul, latihan soal, dan try out online.</span></div>
            </div>
            <div class="auth-feature">
              <span class="ic"><i class="fa-solid fa-chart-line"></i></span>
              <div><strong class="d-block">Pantau progres</strong><span class="small">Lihat perkembangan nilai secara berkala.</span></div>
            </div>
          </div>
        </div>
        <div class="small" style="color:rgba(255,255,255,.6)">&copy; 2026 ${escapeHtml(st.site_name)}</div>
      </section>
      <section class="auth-form-side">
        <div class="auth-card">
          <div class="auth-mobile-brand">
            <a href="#/home" class="brand-mark">
              <span class="brand-icon"><i class="fa-solid fa-graduation-cap"></i></span>
              <span>${escapeHtml(st.site_name)}<small>${escapeHtml(st.site_tagline)}</small></span>
            </a>
          </div>
          <div class="mb-4">
            <span class="chip chip-brand mb-3"><i class="fa-solid fa-right-to-bracket"></i> Portal Login</span>
            <h2>Masuk ke akunmu</h2>
            <p class="sub">Gunakan email dan password yang terdaftar. Sistem akan mengarahkan ke dashboard sesuai role.</p>
          </div>

          <form id="loginForm" novalidate>
            <div class="mb-3">
              <label class="form-label" for="loginEmail">Email</label>
              <div class="input-group">
                <span class="input-group-text"><i class="fa-regular fa-envelope"></i></span>
                <input type="email" class="form-control" id="loginEmail" name="email" placeholder="nama@email.com" required>
              </div>
            </div>
            <div class="mb-3">
              <div class="d-flex justify-content-between">
                <label class="form-label" for="loginPassword">Password</label>
                <a href="#" data-action="forgot-password" class="small fw-semibold text-brand">Lupa password?</a>
              </div>
              <div class="position-relative">
                <input type="password" class="form-control" id="loginPassword" name="password" placeholder="Masukkan password" required>
                <button type="button" class="password-toggle" data-password-toggle="#loginPassword" aria-label="Tampilkan password"><i class="fa-regular fa-eye"></i></button>
              </div>
            </div>
            <div class="d-flex align-items-center justify-content-between mb-4">
              <div class="form-check">
                <input class="form-check-input" type="checkbox" id="remember" name="remember" value="1" checked>
                <label class="form-check-label small" for="remember">Ingat saya</label>
              </div>
              <span class="small text-muted"><i class="fa-solid fa-lock me-1"></i>Aman & terenkripsi</span>
            </div>
            <button type="submit" class="btn btn-brand w-100 rounded-pill py-2 mb-3">Masuk Sekarang <i class="fa-solid fa-arrow-right ms-1"></i></button>
          </form>

          <div class="text-center small text-muted mb-4">
            Belum punya akun? <a href="#/auth/register" class="fw-bold text-brand">Daftar sebagai Siswa</a>
          </div>

          <div class="auth-demo">
            <div class="d-flex align-items-center justify-content-between mb-2">
              <strong class="small"><i class="fa-solid fa-bolt me-1 text-warning"></i>Akses Cepat Semua Role</strong>
              <span class="badge">Full Interaktif</span>
            </div>
            <p class="small text-muted mb-2">Klik salah satu tombol di bawah untuk langsung masuk ke dashboard Siswa, Tutor, atau Admin dengan akses penuh:</p>
            <div class="row g-2">
              <div class="col-6"><button type="button" class="btn btn-soft w-100" data-quick-login="siswa"><i class="fa-solid fa-user-graduate me-1"></i>Masuk Siswa</button></div>
              <div class="col-6"><button type="button" class="btn btn-soft w-100" data-quick-login="tutor"><i class="fa-solid fa-chalkboard-user me-1"></i>Masuk Tutor</button></div>
              <div class="col-6"><button type="button" class="btn btn-soft w-100" data-quick-login="admin"><i class="fa-solid fa-user-shield me-1"></i>Masuk Admin</button></div>
              <div class="col-6"><a href="#/auth/register" class="btn btn-accent w-100"><i class="fa-solid fa-user-plus me-1"></i>Daftar Siswa</a></div>
            </div>
            <div class="small text-muted mt-2" style="font-size:.74rem">
              Akun default: <code>demo.siswa@bimbelindonesia.test</code>, <code>demo.tutor@bimbelindonesia.test</code>, <code>admin@bimbelindonesia.test</code> (Password: <code>password123</code>)
            </div>
          </div>

          <p class="text-center small text-muted mt-4 mb-0"><a href="#/home" class="text-muted"><i class="fa-solid fa-arrow-left me-1"></i>Kembali ke beranda</a></p>
        </div>
      </section>
    </div>`;
  }

  function renderRegister() {
    document.body.className = 'auth-body auth-register';
    const st = S.state.settings;
    return `
    <div class="auth-split">
      <section class="auth-visual">
        <a href="#/home" class="brand-mark">
          <span class="brand-icon"><i class="fa-solid fa-graduation-cap"></i></span>
          <span>${escapeHtml(st.site_name)}<small>${escapeHtml(st.site_tagline)}</small></span>
        </a>
        <div class="my-auto py-5">
          <span class="hero-kicker"><i class="fa-solid fa-star"></i> Belajar #LebihMudah</span>
          <h1>Bangun kebiasaan belajar yang membawa kamu lebih jauh.</h1>
          <p>Bergabung bersama ribuan pelajar yang belajar lebih terarah bersama tutor berpengalaman.</p>
          <div class="mt-4">
            <div class="auth-feature">
              <span class="ic"><i class="fa-solid fa-chalkboard-user"></i></span>
              <div><strong class="d-block">Tutor berpengalaman</strong><span class="small">Pendampingan personal di kelas kecil.</span></div>
            </div>
            <div class="auth-feature">
              <span class="ic"><i class="fa-solid fa-book-open"></i></span>
              <div><strong class="d-block">Materi lengkap</strong><span class="small">Modul, latihan soal, dan try out online.</span></div>
            </div>
            <div class="auth-feature">
              <span class="ic"><i class="fa-solid fa-chart-line"></i></span>
              <div><strong class="d-block">Pantau progres</strong><span class="small">Lihat perkembangan nilai secara berkala.</span></div>
            </div>
          </div>
        </div>
        <div class="small" style="color:rgba(255,255,255,.6)">&copy; 2026 ${escapeHtml(st.site_name)}</div>
      </section>
      <section class="auth-form-side">
        <div class="auth-card">
          <div class="auth-mobile-brand">
            <a href="#/home" class="brand-mark">
              <span class="brand-icon"><i class="fa-solid fa-graduation-cap"></i></span>
              <span>${escapeHtml(st.site_name)}<small>${escapeHtml(st.site_tagline)}</small></span>
            </a>
          </div>
          <div class="mb-4">
            <span class="chip chip-brand mb-3"><i class="fa-solid fa-user-plus"></i> Pendaftaran Siswa</span>
            <h2>Buat akun siswa</h2>
            <p class="sub">Isi data di bawah ini. Akun tutor hanya dapat dibuat oleh administrator.</p>
          </div>

          <form id="registerForm">
            <div class="row g-3">
              <div class="col-12">
                <label class="form-label" for="regNama">Nama Lengkap</label>
                <input type="text" class="form-control" id="regNama" name="nama" placeholder="Nama lengkap" required minlength="3">
              </div>
              <div class="col-md-6">
                <label class="form-label" for="regEmail">Email</label>
                <input type="email" class="form-control" id="regEmail" name="email" placeholder="nama@email.com" required>
              </div>
              <div class="col-md-6">
                <label class="form-label" for="regNoHp">Nomor WhatsApp</label>
                <input type="tel" class="form-control" id="regNoHp" name="no_hp" placeholder="08xxxxxxxxxx" required>
              </div>
              <div class="col-md-6">
                <label class="form-label" for="regKelas">Kelas</label>
                <select class="form-select" id="regKelas" name="kelas" required>
                  <option value="">Pilih kelas</option>
                  <option value="Kelas 6 SD">Kelas 6 SD</option>
                  <option value="Kelas 7">Kelas 7</option>
                  <option value="Kelas 8">Kelas 8</option>
                  <option value="Kelas 9">Kelas 9</option>
                  <option value="Kelas 10">Kelas 10</option>
                  <option value="Kelas 11">Kelas 11</option>
                  <option value="Kelas 12">Kelas 12</option>
                  <option value="Gap Year">Gap Year</option>
                </select>
              </div>
              <div class="col-md-6">
                <label class="form-label" for="regSekolah">Asal Sekolah</label>
                <input type="text" class="form-control" id="regSekolah" name="sekolah" placeholder="Nama sekolah">
              </div>
              <div class="col-md-6">
                <label class="form-label" for="regPassword">Password</label>
                <div class="position-relative">
                  <input type="password" class="form-control" id="regPassword" name="password" placeholder="Minimal 6 karakter" required minlength="6">
                  <button type="button" class="password-toggle" data-password-toggle="#regPassword" aria-label="Tampilkan password"><i class="fa-regular fa-eye"></i></button>
                </div>
                <div class="form-text">Minimal 6 karakter; disarankan memakai setidaknya 1 angka.</div>
              </div>
              <div class="col-md-6">
                <label class="form-label" for="regConfirm">Konfirmasi Password</label>
                <input type="password" class="form-control" id="regConfirm" name="konfirmasi_password" placeholder="Ulangi password" required minlength="6">
              </div>
              <div class="col-12">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" id="setuju" name="setuju" value="1" required checked>
                  <label class="form-check-label small" for="setuju">Saya menyetujui <a href="#/home" data-scroll-to="#faq">Syarat & Ketentuan</a> serta <a href="#/home" data-scroll-to="#faq">Kebijakan Privasi</a>.</label>
                </div>
              </div>
            </div>
            <button type="submit" class="btn btn-brand w-100 rounded-pill py-2 mt-4 mb-3">Daftar Sekarang <i class="fa-solid fa-arrow-right ms-1"></i></button>
          </form>
          <div class="text-center small text-muted">
            Sudah punya akun? <a href="#/auth/login" class="fw-bold text-brand">Masuk di sini</a>
          </div>
        </div>
      </section>
    </div>`;
  }

  window.BimbelPublicViews = {
    renderHome,
    renderBlog,
    renderLogin,
    renderRegister,
    escapeHtml
  };
})(window);
