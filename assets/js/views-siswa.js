/* ==========================================================================
   Bimbel Indonesia - Panel Siswa Views
   ========================================================================== */
(function (window) {
  'use strict';

  const S = window.BimbelStore;
  const escapeHtml = window.BimbelPublicViews.escapeHtml;

  function ensureSiswaUser() {
    let user = S.getCurrentUser();
    if (!user || user.role !== 'siswa') {
      user = S.state.users.find(u => u.role === 'siswa') || S.state.users[4];
      if (user) S.setCurrentUser(user.id);
    }
    return user;
  }

  function renderSiswaNavbar(activePage, user) {
    const st = S.state.settings;
    const firstName = (user.nama || 'Siswa').split(' ')[0];
    const navItems = [
      { id: 'dashboard', href: '#/siswa/dashboard', icon: 'fa-house', label: 'Beranda' },
      { id: 'kelas', href: '#/siswa/kelas', icon: 'fa-chalkboard', label: 'Kelas Saya' },
      { id: 'materi', href: '#/siswa/materi', icon: 'fa-book-open', label: 'Materi' },
      { id: 'riwayat', href: '#/siswa/riwayat', icon: 'fa-clock-rotate-left', label: 'Riwayat' },
      { id: 'pembayaran', href: '#/siswa/pembayaran', icon: 'fa-credit-card', label: 'Pembayaran' },
      { id: 'profil', href: '#/siswa/profil', icon: 'fa-user', label: 'Profil' }
    ];

    return `
    <nav class="navbar navbar-expand-lg siswa-navbar sticky-top">
      <div class="container">
        <a class="navbar-brand brand-mark" href="#/home" aria-label="Kembali ke website ${escapeHtml(st.site_name)}">
          <span class="brand-icon"><i class="fa-solid fa-graduation-cap"></i></span>
          <span>${escapeHtml(st.site_name)}<small>Ruang belajar siswa</small></span>
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navSiswa" aria-controls="navSiswa" aria-expanded="false" aria-label="Buka menu">
          <i class="fa-solid fa-bars"></i>
        </button>
        <div class="collapse navbar-collapse" id="navSiswa">
          <ul class="navbar-nav mx-auto mb-2 mb-lg-0">
            ${navItems.map(item => `
              <li class="nav-item">
                <a class="nav-link ${activePage === item.id ? 'active' : ''}" href="${item.href}">
                  <i class="fa-solid ${item.icon} me-1"></i>${item.label}
                </a>
              </li>
            `).join('')}
          </ul>
          <div class="d-flex align-items-center gap-2">
            <a href="#/home" class="btn btn-sm btn-siswa-light"><i class="fa-solid fa-globe me-1"></i>Lihat Website</a>
            <a href="#/siswa/katalog" class="btn btn-sm btn-siswa-light ${activePage === 'katalog' ? 'fw-bold' : ''}"><i class="fa-solid fa-plus me-1"></i>Paket Baru</a>
            <div class="dropdown">
              <button class="profile-pill border-0" data-bs-toggle="dropdown" aria-expanded="false">
                <img src="${escapeHtml(user.avatar || 'assets/img/avatar.svg')}" alt="Foto profil">
                <span class="d-none d-xl-inline small fw-semibold">${escapeHtml(firstName)}</span>
                <i class="fa-solid fa-chevron-down" style="font-size:.65rem"></i>
              </button>
              <ul class="dropdown-menu dropdown-menu-end mt-2">
                <li><a class="dropdown-item" href="#/siswa/profil"><i class="fa-solid fa-user me-2"></i>Profil</a></li>
                <li><a class="dropdown-item" href="#/siswa/pembayaran"><i class="fa-solid fa-credit-card me-2"></i>Pembayaran</a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item text-danger" href="#" data-action="logout"><i class="fa-solid fa-arrow-right-from-bracket me-2"></i>Logout</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>`;
  }

  function renderSiswaFooter() {
    const st = S.state.settings;
    return `
    <footer class="siswa-footer">
      <div class="container">
        <div class="row g-4">
          <div class="col-lg-4">
            <a class="brand-mark footer-brand mb-3" href="#/home">
              <span class="brand-icon"><i class="fa-solid fa-graduation-cap"></i></span>
              <span>${escapeHtml(st.site_name)}<small>Belajar lebih mudah</small></span>
            </a>
            <p class="small mt-3 mb-0" style="max-width:330px">${escapeHtml(st.site_description)}</p>
          </div>
          <div class="col-6 col-lg-2">
            <h6>Belajar</h6>
            <ul class="list-unstyled d-grid gap-2">
              <li><a href="#/siswa/katalog">Katalog Paket</a></li>
              <li><a href="#/siswa/kelas">Kelas Saya</a></li>
              <li><a href="#/siswa/materi">Materi</a></li>
            </ul>
          </div>
          <div class="col-6 col-lg-2">
            <h6>Akun</h6>
            <ul class="list-unstyled d-grid gap-2">
              <li><a href="#/siswa/profil">Profil</a></li>
              <li><a href="#/siswa/pembayaran">Pembayaran</a></li>
              <li><a href="#/siswa/riwayat">Riwayat Nilai</a></li>
            </ul>
          </div>
          <div class="col-lg-4">
            <h6>Butuh Bantuan?</h6>
            <p class="small mb-2"><i class="fa-solid fa-envelope me-2"></i>${escapeHtml(st.email)}</p>
            <p class="small mb-2"><i class="fa-solid fa-phone me-2"></i>${escapeHtml(st.phone)}</p>
            <p class="small"><i class="fa-solid fa-location-dot me-2"></i>${escapeHtml(st.address)}</p>
          </div>
        </div>
        <div class="footer-bottom d-flex flex-wrap justify-content-between gap-2">
          <span>&copy; 2026 ${escapeHtml(st.site_name)}. Dibuat dengan semangat belajar.</span>
          <span>${escapeHtml(st.site_name)} v1.0.0</span>
        </div>
      </div>
    </footer>`;
  }

  function getSiswaEnrolledClasses(siswaId) {
    const enrolls = S.state.enrollments.filter(e => Number(e.siswa_id) === Number(siswaId) && e.status === 'aktif');
    const classIds = [...new Set(enrolls.map(e => Number(e.class_id)))];
    return S.state.classes.filter(c => classIds.includes(Number(c.id)));
  }

  function renderDashboard() {
    const user = ensureSiswaUser();
    document.body.className = 'siswa-body siswa-dashboard';
    const firstName = (user.nama || 'Siswa').split(' ')[0];

    const myClasses = getSiswaEnrolledClasses(user.id);
    const myClassIds = myClasses.map(c => Number(c.id));
    const myMaterials = S.state.materials.filter(m => myClassIds.includes(Number(m.class_id)));
    const myResults = S.state.examResults.filter(r => Number(r.siswa_id) === Number(user.id));
    const avgScore = myResults.length
      ? (myResults.reduce((s, r) => s + Number(r.nilai), 0) / myResults.length).toFixed(1)
      : '0.0';

    const pendingPayment = S.state.payments.find(p => Number(p.siswa_id) === Number(user.id) && p.status === 'pending');

    const upcomingSchedules = S.state.schedules
      .filter(sc => myClassIds.includes(Number(sc.class_id)) && sc.status === 'terjadwal')
      .sort((a, b) => String(a.tanggal).localeCompare(String(b.tanggal)));

    const notifs = S.state.notifications.filter(n => Number(n.user_id) === Number(user.id));

    return `
      ${renderSiswaNavbar('dashboard', user)}
      <main class="siswa-wrap">
        <div class="container">
          <div class="siswa-hero mb-4">
            <div class="row align-items-center g-3">
              <div class="col-md-8">
                <span class="hero-kicker"><i class="fa-solid fa-sparkles me-1"></i>Ruang Belajar</span>
                <h1>Selamat pagi, ${escapeHtml(firstName)}!</h1>
                <p>Terus tingkatkan kemampuanmu. Setiap usaha kecil hari ini membawa hasil besar esok hari.</p>
                <div class="d-flex flex-wrap gap-2 mt-3">
                  <a href="#/siswa/kelas" class="btn btn-light rounded-pill px-4"><i class="fa-solid fa-play me-1"></i>Lanjut Belajar</a>
                  <a href="#/siswa/katalog" class="btn btn-outline-light rounded-pill px-4"><i class="fa-solid fa-plus me-1"></i>Paket Baru</a>
                </div>
              </div>
              <div class="col-md-4 text-center d-none d-md-block">
                <div class="hero-orb"><i class="fa-solid fa-graduation-cap"></i></div>
              </div>
            </div>
          </div>

          ${pendingPayment ? `
            <div class="alert alert-warning d-flex flex-wrap align-items-center gap-2 mb-4">
              <i class="fa-solid fa-hourglass-half"></i>
              <div class="flex-grow-1">Invoice <strong>${escapeHtml(pendingPayment.invoice)}</strong> sebesar <strong>${S.formatRupiah(pendingPayment.nominal)}</strong> masih menunggu pembayaran.</div>
              <a href="#/siswa/pembayaran?invoice=${pendingPayment.id}" class="btn btn-sm btn-dark rounded-pill">Bayar Sekarang</a>
            </div>
          ` : ''}

          <div class="row g-3 mb-4">
            <div class="col-6 col-lg-3"><div class="siswa-stat"><div class="icon bg-blue"><i class="fa-solid fa-chalkboard"></i></div><div class="value">${myClasses.length}</div><div class="label">Kelas Aktif</div></div></div>
            <div class="col-6 col-lg-3"><div class="siswa-stat"><div class="icon bg-purple"><i class="fa-solid fa-book-open"></i></div><div class="value">${myMaterials.length}</div><div class="label">Materi Tersedia</div></div></div>
            <div class="col-6 col-lg-3"><div class="siswa-stat"><div class="icon bg-green"><i class="fa-solid fa-clipboard-check"></i></div><div class="value">${myResults.length}</div><div class="label">Try Out Selesai</div></div></div>
            <div class="col-6 col-lg-3"><div class="siswa-stat"><div class="icon bg-yellow"><i class="fa-solid fa-star"></i></div><div class="value">${avgScore}</div><div class="label">Rata-rata Nilai</div></div></div>
          </div>

          <div class="row g-4">
            <div class="col-lg-7">
              <div class="siswa-card p-3 p-md-4 h-100">
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <h2 class="h6 mb-0">Jadwal Berikutnya</h2>
                  <a href="#/siswa/kelas" class="small text-decoration-none">Semua kelas <i class="fa-solid fa-arrow-right ms-1"></i></a>
                </div>
                ${upcomingSchedules.length === 0 ? `
                  <div class="empty-state py-4"><i class="fa-solid fa-calendar-xmark"></i><p class="mb-0">Belum ada jadwal terdekat.</p></div>
                ` : `
                  <div class="d-grid gap-2">
                    ${upcomingSchedules.map(sc => {
                      const cls = S.state.classes.find(c => Number(c.id) === Number(sc.class_id));
                      const tutor = cls ? S.state.users.find(u => Number(u.id) === Number(cls.tutor_id)) : null;
                      const dParts = String(sc.tanggal).split('-');
                      const dayNum = dParts[2] || '18';
                      const monthShort = ['JAN','FEB','MAR','APR','MEI','JUN','JUL','AGU','SEP','OKT','NOV','DES'][(Number(dParts[1]) || 11) - 1];
                      return `
                      <div class="schedule-row">
                        <div class="date-box"><span>${dayNum}</span><small>${monthShort}</small></div>
                        <div class="flex-grow-1">
                          <div class="fw-semibold small">${escapeHtml(sc.topik)}</div>
                          <div class="text-muted" style="font-size:.74rem">${escapeHtml(cls ? cls.nama : '')} &middot; ${escapeHtml(sc.jam_mulai)}–${escapeHtml(sc.jam_selesai)} WIB ${tutor ? '&middot; ' + escapeHtml(tutor.nama) : ''}</div>
                        </div>
                        <a href="${escapeHtml(sc.meeting_link || 'https://meet.google.com')}" target="_blank" class="btn btn-siswa rounded-pill"><i class="fa-solid fa-video me-1"></i>Masuk</a>
                      </div>`;
                    }).join('')}
                  </div>
                `}
              </div>
            </div>
            <div class="col-lg-5">
              <div class="siswa-card p-3 p-md-4 h-100">
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <h2 class="h6 mb-0">Notifikasi</h2>
                  ${notifs.length ? `<button type="button" class="btn btn-link btn-sm p-0 text-decoration-none small" data-action="clear-notifs">Tandai dibaca</button>` : ''}
                </div>
                ${notifs.length === 0 ? `<p class="small text-muted mb-0">Belum ada notifikasi baru.</p>` : `
                  <div class="d-grid gap-3">
                    ${notifs.map(n => `
                      <div class="notification-row d-flex align-items-start gap-2">
                        <div class="icon"><i class="fa-solid fa-bell"></i></div>
                        <div>
                          <div class="fw-semibold small">${escapeHtml(n.judul)} ${!n.dibaca ? '<span class="notif-dot ms-1"></span>' : ''}</div>
                          <div class="text-muted small">${escapeHtml(n.pesan)}</div>
                          <div class="text-muted" style="font-size:.68rem">${escapeHtml(n.tanggal)}</div>
                        </div>
                      </div>
                    `).join('')}
                  </div>
                `}
              </div>
            </div>
          </div>

          <div class="siswa-card p-3 p-md-4 mt-4">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h2 class="h6 mb-0">Kelas Saya</h2>
              <a href="#/siswa/katalog" class="small text-decoration-none">+ Tambah Paket</a>
            </div>
            <div class="row g-3">
              ${myClasses.length === 0 ? `
                <div class="col-12"><div class="empty-state py-3"><p class="mb-2">Kamu belum terdaftar di kelas mana pun.</p><a href="#/siswa/katalog" class="btn btn-siswa btn-sm rounded-pill">Pilih Paket Belajar</a></div></div>
              ` : myClasses.map(cls => {
                const prog = S.state.programs.find(p => Number(p.id) === Number(cls.program_id));
                const tutor = S.state.users.find(u => Number(u.id) === Number(cls.tutor_id));
                return `
                <div class="col-md-6">
                  <div class="class-tile">
                    <div class="class-icon"><i class="fa-solid fa-book"></i></div>
                    <div class="flex-grow-1">
                      <div class="fw-semibold small">${escapeHtml(cls.nama)}</div>
                      <div class="text-muted" style="font-size:.72rem">${escapeHtml(prog ? prog.nama : 'Program')} &middot; ${escapeHtml(tutor ? tutor.nama : 'Tutor')}</div>
                    </div>
                    <a href="#/siswa/kelas?id=${cls.id}" class="btn btn-soft btn-sm rounded-circle"><i class="fa-solid fa-arrow-right"></i></a>
                  </div>
                </div>`;
              }).join('')}
            </div>
          </div>
        </div>
      </main>
      ${renderSiswaFooter()}
    `;
  }

  function renderKatalog() {
    const user = ensureSiswaUser();
    document.body.className = 'siswa-body siswa-catalog';
    const programs = S.state.programs.filter(p => p.status === 'aktif');

    return `
      ${renderSiswaNavbar('katalog', user)}
      <main class="siswa-wrap">
        <div class="container">
          <div class="page-heading">
            <div><h1>Pilih Paket Belajar</h1><p>Temukan paket yang sesuai dengan kebutuhan dan target belajarmu.</p></div>
          </div>

          <div class="siswa-banner catalog-banner mb-4">
            <div class="row align-items-center g-3">
              <div class="col-md-8">
                <h2 class="h4 mb-1">Belajar terarah, hasil maksimal.</h2>
                <p class="mb-0 small">Semua paket sudah termasuk kelas online, materi, latihan soal, dan laporan progres belajar.</p>
              </div>
              <div class="col-md-4 text-md-end"><span class="hero-kicker"><i class="fa-solid fa-shield-heart me-1"></i>Garansi belajar nyaman</span></div>
            </div>
          </div>

          ${programs.map(prog => {
            const pkgs = S.state.packages.filter(pk => Number(pk.program_id) === Number(prog.id) && pk.status === 'aktif');
            if (!pkgs.length) return '';
            return `
            <div class="catalog-group mb-4">
              <div class="catalog-group-heading d-flex align-items-center gap-2 mb-3">
                <h2 class="h5 mb-0">${escapeHtml(prog.nama)}</h2>
                <span class="chip chip-brand">${pkgs.length} paket</span>
              </div>
              <div class="row g-4">
                ${pkgs.map(pkg => `
                  <div class="col-md-6 col-xl-4">
                    <div class="pricing-card catalog-package ${pkg.is_popular ? 'featured' : ''} h-100">
                      ${pkg.is_popular ? '<span class="popular-tag">Paling Populer</span>' : ''}
                      <div class="pricing-icon"><i class="fa-solid fa-book-open-reader"></i></div>
                      <h3 class="h6">${escapeHtml(pkg.nama)}</h3>
                      <div class="price">${S.formatRupiah(pkg.harga)}<small>/paket</small></div>
                      <p class="small text-muted">${escapeHtml(pkg.deskripsi)}</p>
                      <ul class="pricing-features">
                        ${(pkg.fitur || [`${pkg.durasi_bulan} bulan belajar`, `${pkg.jumlah_pertemuan} pertemuan live`, 'Materi & latihan soal', 'Try out dan pembahasan']).map(f => `
                          <li><i class="fa-solid fa-circle-check"></i>${escapeHtml(f)}</li>
                        `).join('')}
                      </ul>
                      <a href="#/siswa/checkout?package_id=${pkg.id}" class="btn ${pkg.is_popular ? 'btn-siswa' : 'btn-soft'} w-100 rounded-pill mt-auto">Pilih Paket <i class="fa-solid fa-arrow-right ms-1"></i></a>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>`;
          }).join('')}
        </div>
      </main>
      ${renderSiswaFooter()}
    `;
  }

  function renderCheckout(params) {
    const user = ensureSiswaUser();
    document.body.className = 'siswa-body siswa-checkout';
    const pkgId = Number(params.get('package_id')) || 4;
    const pkg = S.state.packages.find(p => Number(p.id) === pkgId) || S.state.packages[0];
    const prog = S.state.programs.find(p => Number(p.id) === Number(pkg.program_id));
    let availClasses = S.state.classes.filter(c => (Number(c.package_id) === Number(pkg.id) || Number(c.program_id) === Number(pkg.program_id)) && c.status === 'aktif');
    if (availClasses.length === 0) availClasses = S.state.classes.filter(c => c.status === 'aktif');

    const activeCoupons = S.state.coupons.filter(c => c.status === 'aktif');

    return `
      ${renderSiswaNavbar('katalog', user)}
      <main class="siswa-wrap">
        <div class="container">
          <div class="page-heading">
            <div><h1>Checkout Paket</h1><p>Selesaikan pendaftaran paket belajarmu.</p></div>
            <a href="#/siswa/katalog" class="btn btn-soft rounded-pill"><i class="fa-solid fa-arrow-left me-1"></i>Kembali</a>
          </div>

          <form id="siswaCheckoutForm">
            <input type="hidden" name="package_id" value="${pkg.id}">
            <div class="row g-4">
              <div class="col-lg-7">
                <div class="siswa-card p-3 p-md-4 mb-4">
                  <h2 class="h6 mb-3">Detail Paket</h2>
                  <div class="d-flex align-items-center gap-3 mb-3">
                    <div class="class-icon" style="width:54px;height:54px"><i class="fa-solid fa-book-open-reader"></i></div>
                    <div>
                      <div class="fw-semibold">${escapeHtml(pkg.nama)}</div>
                      <div class="small text-muted">${escapeHtml(prog ? prog.nama : 'Program')} &middot; ${pkg.durasi_bulan} bulan &middot; ${pkg.jumlah_pertemuan} pertemuan</div>
                    </div>
                  </div>
                  <p class="small text-muted mb-0">${escapeHtml(pkg.deskripsi)}</p>
                </div>

                <div class="siswa-card p-3 p-md-4 mb-4">
                  <h2 class="h6 mb-3">Pilih Kelas</h2>
                  <div class="d-grid gap-2">
                    ${availClasses.map((cls, idx) => {
                      const tutor = S.state.users.find(u => Number(u.id) === Number(cls.tutor_id));
                      const enrolledCount = S.state.enrollments.filter(e => Number(e.class_id) === Number(cls.id) && e.status === 'aktif').length;
                      return `
                      <label class="option-card d-flex align-items-center gap-3 p-3 border rounded-4" style="cursor:pointer">
                        <input type="radio" name="class_id" value="${cls.id}" ${idx === 0 ? 'checked' : ''} required>
                        <span class="flex-grow-1">
                          <span class="d-block small fw-semibold">${escapeHtml(cls.nama)}</span>
                          <span class="d-block text-muted" style="font-size:.72rem">Tutor ${escapeHtml(tutor ? tutor.nama : '-')} &middot; ${escapeHtml(cls.jenjang || 'Umum')}</span>
                        </span>
                        <span class="chip">${enrolledCount}/${cls.kapasitas}</span>
                      </label>`;
                    }).join('')}
                  </div>
                </div>

                <div class="siswa-card p-3 p-md-4">
                  <h2 class="h6 mb-2">Metode Pembayaran Manual</h2>
                  <p class="small text-muted mb-3">Pilih metode pembayaran manual. Setelah invoice dibuat, lakukan pembayaran ke rekening, e-wallet, atau QRIS yang tersedia, lalu unggah bukti transfer.</p>
                  <div class="row g-2">
                    <div class="col-sm-4">
                      <label class="border rounded-3 p-2 d-flex align-items-center gap-2 small w-100" style="cursor:pointer">
                        <input type="radio" name="metode" value="bank_transfer" checked> <span>Transfer Bank</span>
                      </label>
                    </div>
                    <div class="col-sm-4">
                      <label class="border rounded-3 p-2 d-flex align-items-center gap-2 small w-100" style="cursor:pointer">
                        <input type="radio" name="metode" value="qris"> <span>QRIS</span>
                      </label>
                    </div>
                    <div class="col-sm-4">
                      <label class="border rounded-3 p-2 d-flex align-items-center gap-2 small w-100" style="cursor:pointer">
                        <input type="radio" name="metode" value="ewallet"> <span>E-Wallet</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-lg-5">
                <div class="siswa-card p-3 p-md-4 sticky-lg-top" style="top:90px">
                  <h2 class="h6 mb-3">Ringkasan Pembayaran</h2>
                  <div class="mb-3">
                    <label class="form-label small">Kode Kupon Diskon</label>
                    <div class="input-group">
                      <input type="text" name="kupon" id="checkoutKuponInput" class="form-control text-uppercase" placeholder="HEMAT50K" data-base-price="${pkg.harga}">
                      <button type="button" class="btn btn-soft" id="btnApplyKupon">Cek</button>
                    </div>
                    <div class="form-text" id="kuponFeedback">Kupon tersedia: ${activeCoupons.map(c => `<code>${escapeHtml(c.kode)}</code>`).join(', ')}</div>
                  </div>
                  <div class="d-flex justify-content-between small py-1"><span class="text-muted">Harga paket</span><span>${S.formatRupiah(pkg.harga)}</span></div>
                  <div class="d-flex justify-content-between small py-1"><span class="text-muted">Durasi</span><span>${pkg.durasi_bulan} bulan (${pkg.jumlah_pertemuan} sesi)</span></div>
                  <div class="d-flex justify-content-between small py-1 text-success d-none" id="checkoutDiskonRow"><span>Potongan Kupon</span><span id="checkoutDiskonText">-Rp 0</span></div>
                  <hr>
                  <div class="d-flex justify-content-between align-items-center mb-3">
                    <span class="fw-semibold">Total Tagihan</span>
                    <span class="h5 mb-0 text-brand" id="checkoutTotalText">${S.formatRupiah(pkg.harga)}</span>
                  </div>
                  <button type="submit" class="btn btn-siswa w-100 rounded-pill py-2"><i class="fa-solid fa-file-invoice me-1"></i>Buat Invoice</button>
                  <p class="small text-muted text-center mt-2 mb-0">Invoice akan langsung muncul di halaman Pembayaran.</p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
      ${renderSiswaFooter()}
    `;
  }

  function renderPembayaran(params) {
    const user = ensureSiswaUser();
    document.body.className = 'siswa-body siswa-payments';
    const myPayments = S.state.payments
      .filter(p => Number(p.siswa_id) === Number(user.id))
      .sort((a, b) => Number(b.id) - Number(a.id));

    const selectedInvoiceId = Number(params.get('invoice')) || (myPayments.find(p => p.status !== 'lunas')?.id) || (myPayments[0]?.id);
    const activePayment = myPayments.find(p => Number(p.id) === Number(selectedInvoiceId)) || myPayments[0];
    const activeMethods = S.state.paymentMethods.filter(m => m.status === 'aktif');

    function statusBadge(st) {
      if (st === 'lunas') return '<span class="badge rounded-pill bg-success">Lunas</span>';
      if (st === 'menunggu_verifikasi') return '<span class="badge rounded-pill bg-info text-dark">Menunggu Verifikasi</span>';
      if (st === 'ditolak') return '<span class="badge rounded-pill bg-danger">Ditolak</span>';
      return '<span class="badge rounded-pill bg-warning text-dark">Pending</span>';
    }

    const activePkg = activePayment ? S.state.packages.find(pk => Number(pk.id) === Number(activePayment.package_id)) : null;

    return `
      ${renderSiswaNavbar('pembayaran', user)}
      <main class="siswa-wrap">
        <div class="container">
          <div class="page-heading">
            <div><h1>Pembayaran</h1><p>Lihat invoice, detail transfer, unggah bukti, dan unduh invoice PNG.</p></div>
            <a href="#/siswa/katalog" class="btn btn-siswa rounded-pill"><i class="fa-solid fa-plus me-1"></i>Paket Baru</a>
          </div>

          ${activePayment ? `
          <div class="siswa-card payment-highlight p-3 p-md-4 mb-4">
            <div class="row g-4 align-items-center">
              <div class="col-md-7">
                <div class="d-flex align-items-center gap-2 mb-2">
                  <span class="chip chip-brand">Invoice Dipilih</span>
                  ${statusBadge(activePayment.status)}
                </div>
                <h2 class="h5 mb-1">${escapeHtml(activePayment.invoice)}</h2>
                <p class="small text-muted mb-2">${escapeHtml(activePkg ? activePkg.nama : 'Paket Belajar')} &middot; dibuat ${S.formatDateId(activePayment.tanggal)} ${activePayment.kupon ? `&middot; Kupon <strong>${escapeHtml(activePayment.kupon)}</strong> (-${S.formatRupiah(activePayment.diskon)})` : ''}</p>
                <div class="h4 payment-amount mb-0 text-brand">${S.formatRupiah(activePayment.nominal)}</div>
                ${activePayment.catatan_admin ? `<div class="small text-muted mt-2"><i class="fa-solid fa-comment-dots me-1"></i>Catatan Admin: ${escapeHtml(activePayment.catatan_admin)}</div>` : ''}
              </div>
              <div class="col-md-5 d-grid gap-2">
                ${activePayment.status === 'lunas' ? `
                  <button type="button" class="btn btn-siswa rounded-pill w-100 btn-download-invoice" data-payment-id="${activePayment.id}">
                    <i class="fa-solid fa-download me-1"></i>Unduh Invoice PNG
                  </button>
                ` : `
                  <button type="button" class="btn btn-siswa rounded-pill w-100" data-bs-toggle="modal" data-bs-target="#modalBukti" data-payment="${activePayment.id}" data-invoice="${escapeHtml(activePayment.invoice)}">
                    <i class="fa-solid fa-upload me-1"></i>${activePayment.bukti ? 'Perbarui Bukti Transfer' : 'Unggah Bukti Transfer'}
                  </button>
                `}
                ${activePayment.bukti ? `
                  <button type="button" class="btn btn-soft rounded-pill w-100 btn-preview-bukti" data-bukti="${escapeHtml(activePayment.bukti)}" data-invoice="${escapeHtml(activePayment.invoice)}">
                    <i class="fa-solid fa-image me-1"></i>Lihat Bukti Transfer
                  </button>
                ` : ''}
              </div>
            </div>

            <div class="border rounded-4 p-3 mt-4 bg-light bg-opacity-50">
              <h3 class="h6 mb-3"><i class="fa-solid fa-building-columns me-2 text-brand"></i>Tujuan Pembayaran Manual & Petunjuk Transfer</h3>
              <div class="row g-3">
                ${activeMethods.map(m => {
                  const badgeLabel = m.tipe === 'qris' ? 'QRIS' : (m.tipe === 'ewallet' ? 'E-Wallet' : 'Transfer Bank');
                  return `
                  <div class="col-md-6">
                    <div class="h-100 border rounded-3 p-3 bg-white">
                      <div class="d-flex justify-content-between align-items-center gap-2">
                        <strong>${escapeHtml(m.nama)}</strong>
                        <span class="badge text-bg-light">${badgeLabel}</span>
                      </div>
                      <div class="d-flex align-items-center gap-2 mt-2">
                        <span class="fw-bold font-monospace">${escapeHtml(m.nomor)}</span>
                        <button type="button" class="btn btn-soft btn-sm py-0 px-2" data-copy="${escapeHtml(m.nomor)}" title="Salin nomor"><i class="fa-regular fa-copy"></i></button>
                      </div>
                      <div class="small text-muted">a.n. ${escapeHtml(m.atas_nama)}</div>
                      ${m.catatan ? `<p class="small text-muted mt-2 mb-0">${escapeHtml(m.catatan)}</p>` : ''}
                      ${m.qr_image ? `<div class="mt-2"><img src="${escapeHtml(m.qr_image)}" alt="QRIS" style="max-width:130px;border-radius:10px;border:1px solid #e2e8f0"></div>` : ''}
                    </div>
                  </div>`;
                }).join('')}
              </div>
              <p class="small text-muted mt-3 mb-0"><i class="fa-solid fa-circle-info me-1"></i>Cantumkan nomor invoice <strong>${escapeHtml(activePayment.invoice)}</strong> pada berita transfer. Setelah membayar, klik <strong>Unggah Bukti Transfer</strong> untuk diverifikasi oleh Admin.</p>
            </div>
          </div>
          ` : ''}

          <div class="siswa-card payment-table-card p-3 p-md-4">
            <div class="table-responsive">
              <table class="table table-hover datatable align-middle">
                <thead>
                  <tr><th>Invoice</th><th>Paket</th><th>Nominal</th><th>Tanggal</th><th>Status</th><th>Bukti</th><th class="text-end">Aksi</th></tr>
                </thead>
                <tbody>
                  ${myPayments.map(p => {
                    const pkg = S.state.packages.find(k => Number(k.id) === Number(p.package_id));
                    const isSelected = activePayment && Number(activePayment.id) === Number(p.id);
                    return `
                    <tr>
                      <td>
                        <div class="small fw-semibold">${escapeHtml(p.invoice)}</div>
                        ${isSelected ? '<span class="chip chip-brand mt-1">Dipilih</span>' : ''}
                      </td>
                      <td class="small">${escapeHtml(pkg ? pkg.nama : '-')}</td>
                      <td class="small fw-semibold">${S.formatRupiah(p.nominal)}</td>
                      <td class="small">${S.formatDateId(p.tanggal)}</td>
                      <td>${statusBadge(p.status)}</td>
                      <td>
                        ${p.bukti ? `<button type="button" class="btn btn-soft btn-sm rounded-pill btn-preview-bukti" data-bukti="${escapeHtml(p.bukti)}" data-invoice="${escapeHtml(p.invoice)}"><i class="fa-solid fa-image me-1"></i>Lihat</button>` : '<span class="text-muted small">-</span>'}
                      </td>
                      <td class="text-end">
                        <div class="d-inline-flex gap-1 flex-wrap justify-content-end">
                          <a href="#/siswa/pembayaran?invoice=${p.id}" class="btn btn-soft btn-sm rounded-pill"><i class="fa-solid fa-eye me-1"></i>Detail</a>
                          ${p.status === 'lunas' ? `
                            <button type="button" class="btn btn-siswa btn-sm rounded-pill btn-download-invoice" data-payment-id="${p.id}">
                              <i class="fa-solid fa-download me-1"></i>Invoice PNG
                            </button>
                          ` : `
                            <button type="button" class="btn btn-siswa btn-sm rounded-pill" data-bs-toggle="modal" data-bs-target="#modalBukti" data-payment="${p.id}" data-invoice="${escapeHtml(p.invoice)}">
                              <i class="fa-solid fa-upload me-1"></i>Upload Bukti
                            </button>
                          `}
                        </div>
                      </td>
                    </tr>`;
                  }).join('')}
                </tbody>
              </table>
            </div>
          </div>

          <div class="modal fade" id="modalBukti" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title"><i class="fa-solid fa-upload me-2 text-brand"></i>Upload Bukti Pembayaran</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <form id="uploadBuktiForm">
                  <input type="hidden" name="payment_id" id="buktiPaymentId" value="${activePayment ? activePayment.id : ''}">
                  <div class="modal-body">
                    <p class="small text-muted">Invoice: <strong id="buktiInvoice">${escapeHtml(activePayment ? activePayment.invoice : '')}</strong></p>
                    <div class="mb-3">
                      <label class="form-label">Metode Transfer yang Digunakan</label>
                      <select name="metode" class="form-select">
                        <option value="bank_transfer">Transfer Bank (BCA / Mandiri)</option>
                        <option value="qris">QRIS</option>
                        <option value="ewallet">E-Wallet (GoPay / DANA / OVO)</option>
                      </select>
                    </div>
                    <div class="mb-2">
                      <label class="form-label">File Bukti Transfer *</label>
                      <input type="file" name="bukti" id="buktiFileInput" class="form-control" accept="image/jpeg,image/png,image/webp">
                      <div class="form-text">JPG, PNG, atau WEBP maksimal 5 MB. (Jika tidak memilih file, sistem akan membuatkan bukti simulasi otomatis).</div>
                    </div>
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-soft rounded-pill" data-bs-dismiss="modal">Batal</button>
                    <button type="submit" class="btn btn-siswa rounded-pill px-4"><i class="fa-solid fa-paper-plane me-1"></i>Kirim Bukti</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
      ${renderSiswaFooter()}
    `;
  }

  function renderKelas(params) {
    const user = ensureSiswaUser();
    document.body.className = 'siswa-body siswa-classes';
    const myClasses = getSiswaEnrolledClasses(user.id);
    const selectedId = Number(params.get('id')) || (myClasses[0]?.id) || 0;
    const activeClass = myClasses.find(c => Number(c.id) === selectedId) || myClasses[0];

    if (!activeClass) {
      return `
        ${renderSiswaNavbar('kelas', user)}
        <main class="siswa-wrap">
          <div class="container">
            <div class="page-heading">
              <div><h1>Kelas Saya</h1><p>Semua kelas, jadwal, dan materi belajar dalam satu tempat.</p></div>
              <a href="#/siswa/katalog" class="btn btn-siswa rounded-pill"><i class="fa-solid fa-plus me-1"></i>Tambah Paket</a>
            </div>
            <div class="siswa-card p-5 text-center">
              <div class="empty-state">
                <div class="icon"><i class="fa-solid fa-chalkboard"></i></div>
                <h2 class="h5">Belum Ada Kelas Aktif</h2>
                <p class="small text-muted">Pilih paket belajar terlebih dahulu untuk mulai mengikuti kelas online.</p>
                <a href="#/siswa/katalog" class="btn btn-siswa rounded-pill">Lihat Katalog Paket</a>
              </div>
            </div>
          </div>
        </main>
        ${renderSiswaFooter()}
      `;
    }

    const prog = S.state.programs.find(p => Number(p.id) === Number(activeClass.program_id));
    const pkg = S.state.packages.find(p => Number(p.id) === Number(activeClass.package_id));
    const tutor = S.state.users.find(u => Number(u.id) === Number(activeClass.tutor_id));
    const classSchedules = S.state.schedules.filter(s => Number(s.class_id) === Number(activeClass.id));
    const classMaterials = S.state.materials.filter(m => Number(m.class_id) === Number(activeClass.id));
    const classExams = S.state.exams.filter(ex => Number(ex.class_id) === Number(activeClass.id) && ex.status === 'aktif');

    return `
      ${renderSiswaNavbar('kelas', user)}
      <main class="siswa-wrap">
        <div class="container">
          <div class="page-heading">
            <div><h1>Kelas Saya</h1><p>Semua kelas, jadwal, dan materi belajar dalam satu tempat.</p></div>
            <a href="#/siswa/katalog" class="btn btn-soft rounded-pill"><i class="fa-solid fa-plus me-1"></i>Tambah Paket</a>
          </div>

          <div class="row g-4">
            <div class="col-lg-4">
              <div class="d-grid gap-2">
                ${myClasses.map(cls => {
                  const t = S.state.users.find(u => Number(u.id) === Number(cls.tutor_id));
                  return `
                  <a href="#/siswa/kelas?id=${cls.id}" class="class-select ${Number(cls.id) === Number(activeClass.id) ? 'active' : ''}">
                    <div class="class-icon"><i class="fa-solid fa-book"></i></div>
                    <div class="flex-grow-1">
                      <div class="fw-semibold small">${escapeHtml(cls.nama)}</div>
                      <div class="text-muted" style="font-size:.72rem">${escapeHtml(t ? t.nama : 'Tutor')} &middot; ${escapeHtml(cls.jenjang || 'SMP')}</div>
                    </div>
                    <i class="fa-solid fa-chevron-right small"></i>
                  </a>`;
                }).join('')}
              </div>
            </div>

            <div class="col-lg-8">
              <div class="siswa-card class-overview p-3 p-md-4 mb-4">
                <div class="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-3">
                  <div>
                    <span class="chip chip-brand mb-2">${escapeHtml(prog ? prog.nama : 'Program')}</span>
                    <h2 class="h5 mb-1">${escapeHtml(activeClass.nama)}</h2>
                    <p class="small text-muted mb-0">Tutor ${escapeHtml(tutor ? tutor.nama : '-')} &middot; ${escapeHtml(pkg ? pkg.nama : '')}</p>
                  </div>
                  <span class="chip">${classSchedules.length} pertemuan</span>
                </div>
                <p class="small text-muted mb-0">${escapeHtml(activeClass.deskripsi)}</p>
              </div>

              <div class="siswa-card p-3 p-md-4 mb-4">
                <h2 class="h6 mb-3"><i class="fa-solid fa-calendar-days me-2 text-brand"></i>Jadwal Pertemuan</h2>
                <div class="table-responsive">
                  <table class="table table-hover align-middle mb-0">
                    <thead><tr><th>Tanggal</th><th>Jam</th><th>Topik</th><th>Status</th><th class="text-end">Meeting</th></tr></thead>
                    <tbody>
                      ${classSchedules.length === 0 ? `<tr><td colspan="5" class="text-center text-muted small py-3">Belum ada jadwal pertemuan.</td></tr>` : classSchedules.map(sc => {
                        const badge = sc.status === 'selesai'
                          ? '<span class="badge rounded-pill bg-success">Selesai</span>'
                          : (sc.status === 'batal' ? '<span class="badge rounded-pill bg-danger">Batal</span>' : '<span class="badge rounded-pill bg-primary">Terjadwal</span>');
                        return `
                        <tr>
                          <td class="small">${S.formatDateId(sc.tanggal, true)}</td>
                          <td class="small">${escapeHtml(sc.jam_mulai)}–${escapeHtml(sc.jam_selesai)}</td>
                          <td class="small">${escapeHtml(sc.topik)}</td>
                          <td>${badge}</td>
                          <td class="text-end">
                            <a href="${escapeHtml(sc.meeting_link || 'https://meet.google.com')}" target="_blank" class="btn btn-soft btn-sm rounded-pill"><i class="fa-solid fa-video me-1"></i>Masuk</a>
                          </td>
                        </tr>`;
                      }).join('')}
                    </tbody>
                  </table>
                </div>
              </div>

              <div class="siswa-card p-3 p-md-4 mb-4">
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <h2 class="h6 mb-0"><i class="fa-solid fa-book-open me-2 text-brand"></i>Materi Kelas</h2>
                  <a href="#/siswa/materi?class_id=${activeClass.id}" class="small text-decoration-none">Semua materi</a>
                </div>
                <div class="d-grid gap-2">
                  ${classMaterials.length === 0 ? `<p class="small text-muted mb-0">Belum ada materi untuk kelas ini.</p>` : classMaterials.map(m => {
                    const ic = m.tipe === 'video' ? 'fa-circle-play' : (m.tipe === 'file' ? 'fa-file-pdf' : 'fa-link');
                    return `
                    <a href="${escapeHtml(m.url || '#')}" target="_blank" class="material-row" data-open-material="${m.id}">
                      <span class="material-icon"><i class="fa-solid ${ic}"></i></span>
                      <span class="flex-grow-1">
                        <span class="d-block small fw-semibold">${escapeHtml(m.judul)}</span>
                        <span class="d-block text-muted" style="font-size:.72rem">${escapeHtml(m.deskripsi)}</span>
                      </span>
                      <i class="fa-solid fa-arrow-up-right-from-square text-muted small"></i>
                    </a>`;
                  }).join('')}
                </div>
              </div>

              <div class="siswa-card p-3 p-md-4">
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <h2 class="h6 mb-0"><i class="fa-solid fa-clipboard-check me-2 text-brand"></i>Try Out & Latihan Kelas</h2>
                  <a href="#/siswa/riwayat" class="small text-decoration-none">Riwayat Nilai</a>
                </div>
                <div class="d-grid gap-2">
                  ${classExams.length === 0 ? `<p class="small text-muted mb-0">Belum ada try out aktif di kelas ini.</p>` : classExams.map(ex => {
                    const existingResult = S.state.examResults.find(r => Number(r.exam_id) === Number(ex.id) && Number(r.siswa_id) === Number(user.id));
                    return `
                    <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 p-3 border rounded-4">
                      <div>
                        <div class="small fw-semibold">${escapeHtml(ex.judul)}</div>
                        <div class="text-muted" style="font-size:.73rem"><i class="fa-regular fa-clock me-1"></i>${ex.durasi_menit} menit &middot; ${ex.jumlah_soal} soal ${existingResult ? `&middot; Nilai Terakhir: <strong class="text-success">${Number(existingResult.nilai).toFixed(1)}</strong>` : ''}</div>
                      </div>
                      <button type="button" class="btn btn-siswa btn-sm rounded-pill btn-start-tryout" data-exam-id="${ex.id}">
                        <i class="fa-solid fa-play me-1"></i>${existingResult ? 'Ulangi Try Out' : 'Mulai Try Out'}
                      </button>
                    </div>`;
                  }).join('')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      ${renderSiswaFooter()}
    `;
  }

  function renderMateri(params) {
    const user = ensureSiswaUser();
    document.body.className = 'siswa-body siswa-materials';
    const myClasses = getSiswaEnrolledClasses(user.id);
    const myClassIds = myClasses.map(c => Number(c.id));

    const q = (params.get('q') || '').trim().toLowerCase();
    const filterClassId = Number(params.get('class_id')) || 0;

    const materials = S.state.materials.filter(m => {
      if (filterClassId && Number(m.class_id) !== filterClassId) return false;
      if (!filterClassId && myClassIds.length && !myClassIds.includes(Number(m.class_id))) return false;
      if (q && !(m.judul.toLowerCase().includes(q) || (m.deskripsi || '').toLowerCase().includes(q))) return false;
      return true;
    });

    return `
      ${renderSiswaNavbar('materi', user)}
      <main class="siswa-wrap">
        <div class="container">
          <div class="page-heading">
            <div><h1>Materi Belajar</h1><p>Akses semua materi dari kelas yang kamu ikuti.</p></div>
          </div>

          <div class="siswa-card materials-filter p-3 mb-4">
            <form id="siswaMateriFilterForm" class="row g-2 align-items-end">
              <div class="col-md-4">
                <label class="form-label small mb-1">Cari Materi</label>
                <input type="text" name="q" class="form-control" value="${escapeHtml(q)}" placeholder="Judul atau deskripsi">
              </div>
              <div class="col-md-4">
                <label class="form-label small mb-1">Kelas</label>
                <select name="class_id" class="form-select">
                  <option value="0">Semua kelas saya</option>
                  ${myClasses.map(c => `<option value="${c.id}" ${Number(c.id) === filterClassId ? 'selected' : ''}>${escapeHtml(c.nama)}</option>`).join('')}
                </select>
              </div>
              <div class="col-md-2"><button type="submit" class="btn btn-siswa w-100 rounded-pill">Filter</button></div>
              <div class="col-md-2 text-md-end"><span class="small text-muted">${materials.length} materi</span></div>
            </form>
          </div>

          <div class="row g-4">
            ${materials.length === 0 ? `
              <div class="col-12"><div class="siswa-card p-5"><div class="empty-state"><div class="icon"><i class="fa-solid fa-folder-open"></i></div><p class="mb-0">Materi tidak ditemukan.</p></div></div></div>
            ` : materials.map(m => {
              const cls = S.state.classes.find(c => Number(c.id) === Number(m.class_id));
              const tutor = cls ? S.state.users.find(u => Number(u.id) === Number(cls.tutor_id)) : null;
              const ic = m.tipe === 'video' ? 'fa-circle-play' : (m.tipe === 'file' ? 'fa-file-pdf' : 'fa-link');
              const kindLabel = m.tipe === 'video' ? 'Video' : (m.tipe === 'file' ? 'File' : 'Link');
              return `
              <div class="col-md-6 col-xl-4">
                <div class="siswa-card material-card p-3 h-100 d-flex flex-column">
                  <div class="material-card-heading d-flex justify-content-between align-items-start mb-3">
                    <span class="material-icon"><i class="fa-solid ${ic}"></i></span>
                    <span class="chip material-kind">${kindLabel}</span>
                  </div>
                  <h2 class="h6 mb-1">${escapeHtml(m.judul)}</h2>
                  <div class="material-meta text-muted small mb-2">${escapeHtml(cls ? cls.nama : '')} &middot; ${escapeHtml(tutor ? tutor.nama : 'Tutor')}</div>
                  <p class="material-description small text-muted flex-grow-1">${escapeHtml(m.deskripsi)}</p>
                  <a href="${escapeHtml(m.url || '#')}" target="_blank" class="btn btn-soft rounded-pill w-100" data-open-material="${m.id}">
                    <i class="fa-solid fa-arrow-up-right-from-square me-1"></i>Buka Materi
                  </a>
                </div>
              </div>`;
            }).join('')}
          </div>
        </div>
      </main>
      ${renderSiswaFooter()}
    `;
  }

  function renderRiwayat() {
    const user = ensureSiswaUser();
    document.body.className = 'siswa-body siswa-history';

    const myResults = S.state.examResults.filter(r => Number(r.siswa_id) === Number(user.id));
    const myAttendance = S.state.attendance.filter(a => Number(a.siswa_id) === Number(user.id));
    const myPayments = S.state.payments.filter(p => Number(p.siswa_id) === Number(user.id));
    const avgScore = myResults.length
      ? (myResults.reduce((s, r) => s + Number(r.nilai), 0) / myResults.length).toFixed(1).replace('.', ',')
      : '0,0';

    return `
      ${renderSiswaNavbar('riwayat', user)}
      <main class="siswa-wrap">
        <div class="container">
          <div class="page-heading">
            <div><h1>Riwayat Belajar</h1><p>Pantau perkembangan nilai, kehadiran, dan transaksi.</p></div>
          </div>

          <div class="row g-3 mb-4 history-stats">
            <div class="col-6 col-lg-3"><div class="siswa-stat history-stat"><div class="icon bg-blue"><i class="fa-solid fa-clipboard-check"></i></div><div class="value">${myResults.length}</div><div class="label">Try Out</div></div></div>
            <div class="col-6 col-lg-3"><div class="siswa-stat history-stat"><div class="icon bg-green"><i class="fa-solid fa-user-check"></i></div><div class="value">${myAttendance.filter(a => a.status === 'hadir').length}</div><div class="label">Kehadiran</div></div></div>
            <div class="col-6 col-lg-3"><div class="siswa-stat history-stat"><div class="icon bg-purple"><i class="fa-solid fa-chart-line"></i></div><div class="value">${avgScore}</div><div class="label">Rata-rata Nilai</div></div></div>
            <div class="col-6 col-lg-3"><div class="siswa-stat history-stat"><div class="icon bg-yellow"><i class="fa-solid fa-receipt"></i></div><div class="value">${myPayments.length}</div><div class="label">Transaksi</div></div></div>
          </div>

          <ul class="nav nav-pills app-tabs history-tabs mb-3" role="tablist">
            <li class="nav-item"><button class="nav-link active" data-bs-toggle="pill" data-bs-target="#tabNilai" type="button">Nilai Try Out</button></li>
            <li class="nav-item"><button class="nav-link" data-bs-toggle="pill" data-bs-target="#tabAbsensi" type="button">Absensi</button></li>
            <li class="nav-item"><button class="nav-link" data-bs-toggle="pill" data-bs-target="#tabPembayaran" type="button">Pembayaran</button></li>
          </ul>

          <div class="tab-content">
            <div class="tab-pane fade show active" id="tabNilai">
              <div class="siswa-card history-table-card p-3 p-md-4">
                <div class="table-responsive">
                  <table class="table table-hover datatable align-middle">
                    <thead><tr><th>Try Out</th><th>Kelas</th><th>Nilai</th><th>Durasi</th><th>Tanggal</th><th class="text-end">Aksi</th></tr></thead>
                    <tbody>
                      ${myResults.map(r => {
                        const ex = S.state.exams.find(e => Number(e.id) === Number(r.exam_id));
                        const cls = ex ? S.state.classes.find(c => Number(c.id) === Number(ex.class_id)) : null;
                        return `
                        <tr>
                          <td class="small fw-semibold">${escapeHtml(ex ? ex.judul : 'Try Out')}</td>
                          <td class="small">${escapeHtml(cls ? cls.nama : '-')}</td>
                          <td><span class="badge bg-success">${Number(r.nilai).toFixed(2)}</span></td>
                          <td class="small">${ex ? ex.durasi_menit : 20} menit</td>
                          <td class="small">${S.formatDateId(r.tanggal)}</td>
                          <td class="text-end">
                            ${ex ? `<button type="button" class="btn btn-soft btn-sm rounded-pill btn-start-tryout" data-exam-id="${ex.id}"><i class="fa-solid fa-rotate-right me-1"></i>Latihan Lagi</button>` : ''}
                          </td>
                        </tr>`;
                      }).join('')}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div class="tab-pane fade" id="tabAbsensi">
              <div class="siswa-card history-table-card p-3 p-md-4">
                <div class="table-responsive">
                  <table class="table table-hover datatable align-middle">
                    <thead><tr><th>Tanggal</th><th>Kelas</th><th>Topik</th><th>Status</th><th>Catatan</th></tr></thead>
                    <tbody>
                      ${myAttendance.map(a => {
                        const sc = S.state.schedules.find(s => Number(s.id) === Number(a.schedule_id));
                        const cls = sc ? S.state.classes.find(c => Number(c.id) === Number(sc.class_id)) : null;
                        const stMap = {
                          hadir: '<span class="badge rounded-pill bg-success">Hadir</span>',
                          izin: '<span class="badge rounded-pill bg-info text-dark">Izin</span>',
                          sakit: '<span class="badge rounded-pill bg-warning text-dark">Sakit</span>',
                          alpa: '<span class="badge rounded-pill bg-danger">Alpa</span>'
                        };
                        return `
                        <tr>
                          <td class="small">${S.formatDateId(sc ? sc.tanggal : '')}</td>
                          <td class="small">${escapeHtml(cls ? cls.nama : '-')}</td>
                          <td class="small">${escapeHtml(sc ? sc.topik : '-')}</td>
                          <td>${stMap[a.status] || stMap.hadir}</td>
                          <td class="small">${escapeHtml(a.catatan || '-')}</td>
                        </tr>`;
                      }).join('')}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div class="tab-pane fade" id="tabPembayaran">
              <div class="siswa-card history-table-card p-3 p-md-4">
                <div class="table-responsive">
                  <table class="table table-hover datatable align-middle">
                    <thead><tr><th>Invoice</th><th>Paket</th><th>Nominal</th><th>Status</th><th>Tanggal</th><th class="text-end">Aksi</th></tr></thead>
                    <tbody>
                      ${myPayments.map(p => {
                        const pkg = S.state.packages.find(k => Number(k.id) === Number(p.package_id));
                        const badge = p.status === 'lunas'
                          ? '<span class="badge rounded-pill bg-success">Lunas</span>'
                          : (p.status === 'menunggu_verifikasi' ? '<span class="badge rounded-pill bg-info text-dark">Menunggu Verifikasi</span>' : (p.status === 'ditolak' ? '<span class="badge rounded-pill bg-danger">Ditolak</span>' : '<span class="badge rounded-pill bg-warning text-dark">Pending</span>'));
                        return `
                        <tr>
                          <td class="small fw-semibold">${escapeHtml(p.invoice)}</td>
                          <td class="small">${escapeHtml(pkg ? pkg.nama : '-')}</td>
                          <td class="small">${S.formatRupiah(p.nominal)}</td>
                          <td>${badge}</td>
                          <td class="small">${S.formatDateId(p.tanggal)}</td>
                          <td class="text-end"><a href="#/siswa/pembayaran?invoice=${p.id}" class="btn btn-soft btn-sm rounded-pill">Detail</a></td>
                        </tr>`;
                      }).join('')}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      ${renderSiswaFooter()}
    `;
  }

  function renderProfil() {
    const user = ensureSiswaUser();
    document.body.className = 'siswa-body siswa-profile';

    return `
      ${renderSiswaNavbar('profil', user)}
      <main class="siswa-wrap">
        <div class="container">
          <div class="page-heading">
            <div><h1>Profil Saya</h1><p>Kelola data diri dan keamanan akunmu.</p></div>
          </div>

          <div class="row g-4 profile-layout">
            <div class="col-lg-4">
              <div class="siswa-card profile-overview p-4 text-center">
                <img src="${escapeHtml(user.avatar || 'assets/img/avatar.svg')}" alt="Foto profil" class="profile-avatar rounded-circle mx-auto mb-3" style="width:104px;height:104px;object-fit:cover">
                <h2 class="h5 mb-1">${escapeHtml(user.nama)}</h2>
                <p class="small text-muted mb-2">${escapeHtml(user.kelas || 'Siswa')} &middot; ${escapeHtml(user.sekolah || '-')}</p>
                <span class="badge rounded-pill bg-success">Aktif</span>
                <hr>
                <div class="profile-details text-start small">
                  <div class="d-flex justify-content-between py-1"><span class="text-muted">Email</span><span>${escapeHtml(user.email)}</span></div>
                  <div class="d-flex justify-content-between py-1"><span class="text-muted">WhatsApp</span><span>${escapeHtml(user.no_hp || '-')}</span></div>
                  <div class="d-flex justify-content-between py-1"><span class="text-muted">Kota</span><span>${escapeHtml(user.kota || '-')}</span></div>
                  <div class="d-flex justify-content-between py-1"><span class="text-muted">Bergabung</span><span>${S.formatDateId(user.created_at)}</span></div>
                </div>
              </div>
            </div>
            <div class="col-lg-8">
              <div class="siswa-card profile-form-card p-3 p-md-4 mb-4">
                <h2 class="h6 mb-3">Data Diri</h2>
                <form id="siswaProfileForm">
                  <div class="row g-3">
                    <div class="col-md-6"><label class="form-label">Nama Lengkap *</label><input type="text" name="nama" class="form-control" value="${escapeHtml(user.nama)}" required></div>
                    <div class="col-md-6"><label class="form-label">Email *</label><input type="email" name="email" class="form-control" value="${escapeHtml(user.email)}" required></div>
                    <div class="col-md-6"><label class="form-label">No. WhatsApp</label><input type="text" name="no_hp" class="form-control" value="${escapeHtml(user.no_hp || '')}" placeholder="628xxxxxxxxxx"></div>
                    <div class="col-md-6"><label class="form-label">Tanggal Lahir</label><input type="date" name="tanggal_lahir" class="form-control" value="${escapeHtml(user.tanggal_lahir || '2011-05-12')}"></div>
                    <div class="col-md-6"><label class="form-label">Kelas</label><input type="text" name="kelas" class="form-control" value="${escapeHtml(user.kelas || '')}" placeholder="SMA Kelas 12"></div>
                    <div class="col-md-6"><label class="form-label">Sekolah</label><input type="text" name="sekolah" class="form-control" value="${escapeHtml(user.sekolah || '')}"></div>
                    <div class="col-md-6"><label class="form-label">Kota</label><input type="text" name="kota" class="form-control" value="${escapeHtml(user.kota || '')}"></div>
                    <div class="col-md-6"><label class="form-label">Foto Profil</label><input type="file" name="foto" id="siswaAvatarInput" class="form-control" accept="image/jpeg,image/png,image/webp"></div>
                    <div class="col-12"><label class="form-label">Alamat</label><textarea name="alamat" class="form-control" rows="3">${escapeHtml(user.alamat || '')}</textarea></div>
                  </div>
                  <button type="submit" class="btn btn-siswa rounded-pill px-4 mt-3"><i class="fa-solid fa-floppy-disk me-1"></i>Simpan Profil</button>
                </form>
              </div>

              <div class="siswa-card profile-form-card p-3 p-md-4">
                <h2 class="h6 mb-3">Ubah Password</h2>
                <form id="siswaPasswordForm">
                  <div class="row g-3">
                    <div class="col-md-4"><label class="form-label">Password Saat Ini *</label><input type="password" name="current_password" class="form-control" required></div>
                    <div class="col-md-4"><label class="form-label">Password Baru *</label><input type="password" name="new_password" class="form-control" minlength="6" required><div class="form-text">Minimal 6 karakter.</div></div>
                    <div class="col-md-4"><label class="form-label">Konfirmasi *</label><input type="password" name="confirm_password" class="form-control" minlength="6" required></div>
                  </div>
                  <button type="submit" class="btn btn-soft rounded-pill px-4 mt-3"><i class="fa-solid fa-key me-1"></i>Ubah Password</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
      ${renderSiswaFooter()}
    `;
  }

  window.BimbelSiswaViews = {
    renderDashboard,
    renderKatalog,
    renderCheckout,
    renderPembayaran,
    renderKelas,
    renderMateri,
    renderRiwayat,
    renderProfil
  };
})(window);
