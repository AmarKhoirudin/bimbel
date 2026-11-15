/* ==========================================================================
   Bimbel Indonesia - Panel Admin Views
   ========================================================================== */
(function (window) {
  'use strict';

  const S = window.BimbelStore;
  const escapeHtml = window.BimbelPublicViews.escapeHtml;
  const calcDurationHours = window.BimbelTutorViews.calcDurationHours;

  function ensureAdminUser() {
    let user = S.getCurrentUser();
    if (!user || user.role !== 'admin') {
      user = S.state.users.find(u => u.role === 'admin') || S.state.users[0];
      if (user) S.setCurrentUser(user.id);
    }
    return user;
  }

  function renderAdminShell(activeMenu, title, user, contentHtml) {
    const st = S.state.settings;
    const pendingCount = S.state.payments.filter(p => p.status === 'pending' || p.status === 'menunggu_verifikasi').length;

    const menus = [
      { section: 'Utama', items: [
        { id: 'dashboard', href: '#/admin/dashboard', icon: 'fa-chart-pie', label: 'Dashboard' },
        { id: 'pengguna', href: '#/admin/pengguna', icon: 'fa-users', label: 'Akun Pengguna' },
        { id: 'program', href: '#/admin/program', icon: 'fa-layer-group', label: 'Program & Paket' },
        { id: 'kelas', href: '#/admin/kelas', icon: 'fa-chalkboard-user', label: 'Kelas & Jadwal' },
        { id: 'materi-soal', href: '#/admin/materi-soal', icon: 'fa-book-open-reader', label: 'Materi & Bank Soal' }
      ]},
      { section: 'Transaksi & Konten', items: [
        { id: 'pembayaran', href: '#/admin/pembayaran', icon: 'fa-file-invoice-dollar', label: 'Pembayaran', badge: pendingCount },
        { id: 'banner', href: '#/admin/banner', icon: 'fa-images', label: 'Banner Depan' },
        { id: 'konten', href: '#/admin/konten', icon: 'fa-newspaper', label: 'Blog, Testimoni & Kupon' },
        { id: 'laporan', href: '#/admin/laporan', icon: 'fa-chart-line', label: 'Laporan & Performa' },
        { id: 'whatsapp', href: '#/admin/whatsapp', icon: 'fa-brands fa-whatsapp', label: 'Pesan WhatsApp' },
        { id: 'pengaturan', href: '#/admin/pengaturan', icon: 'fa-sliders', label: 'Pengaturan Website' }
      ]}
    ];

    return `
    <div class="app-shell">
      <aside class="app-sidebar">
        <div class="sidebar-brand">
          <span class="brand-icon"><i class="fa-solid fa-graduation-cap"></i></span>
          <div>
            <div class="name">${escapeHtml(st.site_name)}</div>
            <div class="role">Panel Administrator</div>
          </div>
        </div>
        <div class="sidebar-scroll">
          ${menus.map(group => `
            <div class="sidebar-label">${group.section}</div>
            <ul class="sidebar-nav">
              ${group.items.map(item => `
                <li>
                  <a href="${item.href}" class="${activeMenu === item.id ? 'active' : ''}">
                    <i class="${item.icon.includes('fa-brands') ? item.icon : 'fa-solid ' + item.icon}"></i>
                    <span class="flex-grow-1">${item.label}</span>
                    ${item.badge ? `<span class="badge rounded-pill bg-warning text-dark">${item.badge}</span>` : ''}
                  </a>
                </li>
              `).join('')}
            </ul>
          `).join('')}
          <div class="sidebar-label">Lainnya</div>
          <ul class="sidebar-nav">
            <li><a href="#/home"><i class="fa-solid fa-globe"></i><span>Lihat Website</span></a></li>
            <li><a href="#" data-action="logout"><i class="fa-solid fa-arrow-right-from-bracket"></i><span>Logout</span></a></li>
          </ul>
        </div>
        <div class="sidebar-profile">
          <img src="${escapeHtml(user.avatar || 'assets/img/avatar.svg')}" class="avatar" alt="Foto profil">
          <div class="flex-grow-1 overflow-hidden">
            <div class="name">${escapeHtml(user.nama)}</div>
            <div class="role">Administrator</div>
          </div>
        </div>
      </aside>
      <div class="sidebar-overlay"></div>
      <div class="app-main">
        <header class="app-topbar">
          <div class="d-flex align-items-center gap-3">
            <button type="button" class="sidebar-toggle" data-sidebar-toggle aria-label="Buka menu"><i class="fa-solid fa-bars"></i></button>
            <div>
              <h1 class="topbar-title">${escapeHtml(title)}</h1>
              <p class="topbar-sub">Minggu, 15 November 2026</p>
            </div>
          </div>
          <div class="d-flex align-items-center gap-2 gap-md-3">
            <span class="badge topbar-badge py-2 px-3 d-none d-md-inline-flex align-items-center gap-2">
              <i class="fa-solid fa-user-shield"></i> Administrator
            </span>
            <div class="dropdown">
              <button class="btn p-0 border-0 d-flex align-items-center gap-2" data-bs-toggle="dropdown" aria-expanded="false">
                <img src="${escapeHtml(user.avatar || 'assets/img/avatar.svg')}" class="avatar" alt="Foto profil">
                <span class="d-none d-lg-block text-start">
                  <span class="d-block small fw-semibold">${escapeHtml(user.nama)}</span>
                  <span class="d-block text-muted" style="font-size:.7rem">${escapeHtml(user.email)}</span>
                </span>
                <i class="fa-solid fa-chevron-down small text-muted"></i>
              </button>
              <ul class="dropdown-menu dropdown-menu-end mt-2">
                <li><a class="dropdown-item" href="#/admin/pengaturan"><i class="fa-solid fa-sliders me-2"></i>Pengaturan</a></li>
                <li><a class="dropdown-item" href="#/home"><i class="fa-solid fa-globe me-2"></i>Lihat Website</a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item text-danger" href="#" data-action="logout"><i class="fa-solid fa-arrow-right-from-bracket me-2"></i>Logout</a></li>
              </ul>
            </div>
          </div>
        </header>
        <main class="app-content">
          ${contentHtml}
        </main>
        <footer class="px-4 py-3 text-muted small border-top bg-white d-flex flex-wrap justify-content-between gap-2">
          <span>&copy; 2026 ${escapeHtml(st.site_name)}.</span>
          <span>Panel Admin v1.0.0</span>
        </footer>
      </div>
    </div>`;
  }

  function renderDashboard() {
    const user = ensureAdminUser();
    document.body.className = 'app-body admin-body';

    const students = S.state.users.filter(u => u.role === 'siswa');
    const tutors = S.state.users.filter(u => u.role === 'tutor');
    const paidPayments = S.state.payments.filter(p => p.status === 'lunas');
    const pendingPayments = S.state.payments.filter(p => p.status === 'pending' || p.status === 'menunggu_verifikasi');
    const totalRevenue = paidPayments.reduce((sum, p) => sum + (Number(p.nominal) || 0), 0);

    const content = `
      <div class="page-heading">
        <div><h1>Ringkasan Aktivitas</h1><p>Pantau perkembangan siswa, kelas, pembayaran, dan konten Bimbel Indonesia.</p></div>
        <div class="d-flex gap-2">
          <a href="#/admin/pembayaran" class="btn btn-brand rounded-pill"><i class="fa-solid fa-check-double me-1"></i>Verifikasi Pembayaran (${pendingPayments.length})</a>
        </div>
      </div>

      <div class="row g-3 mb-4">
        <div class="col-sm-6 col-xl-3"><div class="stat-card"><div class="icon icon-blue"><i class="fa-solid fa-user-graduate"></i></div><div class="value mt-3">${students.length}</div><div class="label">Total Siswa</div></div></div>
        <div class="col-sm-6 col-xl-3"><div class="stat-card"><div class="icon icon-purple"><i class="fa-solid fa-chalkboard-user"></i></div><div class="value mt-3">${tutors.length}</div><div class="label">Tutor Aktif</div></div></div>
        <div class="col-sm-6 col-xl-3"><div class="stat-card"><div class="icon icon-green"><i class="fa-solid fa-sack-dollar"></i></div><div class="value mt-3" style="font-size:1.3rem">${S.formatRupiah(totalRevenue)}</div><div class="label">Pendapatan Terverifikasi</div></div></div>
        <div class="col-sm-6 col-xl-3"><div class="stat-card"><div class="icon icon-yellow"><i class="fa-solid fa-hourglass-half"></i></div><div class="value mt-3">${pendingPayments.length}</div><div class="label">Invoice Menunggu Verifikasi</div></div></div>
      </div>

      <div class="row g-4 mb-4">
        <div class="col-lg-8">
          <div class="card-soft chart-card p-3 p-md-4 h-100">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h2 class="h6 mb-0">Tren Pendapatan & Pendaftaran</h2>
                <p class="small text-muted mb-0">Ringkasan transaksi bulanan tahun 2026</p>
              </div>
              <a href="#/admin/laporan" class="small text-brand fw-semibold">Lihat Laporan <i class="fa-solid fa-arrow-right ms-1"></i></a>
            </div>
            <div style="height:250px"><canvas id="adminRevenueChart"></canvas></div>
          </div>
        </div>
        <div class="col-lg-4">
          <div class="card-soft p-3 p-md-4 h-100">
            <h2 class="h6 mb-3">Aksi Cepat</h2>
            <div class="d-grid gap-2">
              <a href="#/admin/pembayaran" class="quick-action">
                <span class="ic"><i class="fa-solid fa-file-invoice-dollar"></i></span>
                <div><div class="small fw-semibold">Verifikasi Invoice</div><div class="text-muted" style="font-size:.72rem">${pendingPayments.length} transaksi menunggu</div></div>
              </a>
              <a href="#/admin/banner" class="quick-action">
                <span class="ic"><i class="fa-solid fa-images"></i></span>
                <div><div class="small fw-semibold">Kelola Banner Depan</div><div class="text-muted" style="font-size:.72rem">${S.state.sliders.length} slide promosi</div></div>
              </a>
              <a href="#/admin/kelas" class="quick-action">
                <span class="ic"><i class="fa-solid fa-chalkboard"></i></span>
                <div><div class="small fw-semibold">Kelas & Jadwal</div><div class="text-muted" style="font-size:.72rem">${S.state.classes.length} kelas aktif</div></div>
              </a>
              <a href="#/admin/whatsapp" class="quick-action">
                <span class="ic"><i class="fa-brands fa-whatsapp text-success"></i></span>
                <div><div class="small fw-semibold">Kirim Pesan WhatsApp</div><div class="text-muted" style="font-size:.72rem">Hubungi siswa & tutor</div></div>
              </a>
              <a href="#/admin/pengaturan" class="quick-action">
                <span class="ic"><i class="fa-solid fa-sliders"></i></span>
                <div><div class="small fw-semibold">Metode Pembayaran & Situs</div><div class="text-muted" style="font-size:.72rem">${S.state.paymentMethods.length} metode pembayaran</div></div>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="row g-4">
        <div class="col-lg-7">
          <div class="card-soft p-3 p-md-4 h-100">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h2 class="h6 mb-0">Invoice & Pembayaran Terbaru</h2>
              <a href="#/admin/pembayaran" class="small text-brand fw-semibold">Semua invoice</a>
            </div>
            <div class="table-responsive">
              <table class="table table-hover align-middle mb-0">
                <thead><tr><th>Invoice</th><th>Siswa</th><th>Nominal</th><th>Status</th><th class="text-end">Aksi</th></tr></thead>
                <tbody>
                  ${S.state.payments.slice(0, 5).map(p => {
                    const st = S.state.users.find(u => Number(u.id) === Number(p.siswa_id));
                    const badge = p.status === 'lunas'
                      ? '<span class="badge rounded-pill bg-success">Lunas</span>'
                      : (p.status === 'menunggu_verifikasi' ? '<span class="badge rounded-pill bg-info text-dark">Cek Bukti</span>' : (p.status === 'ditolak' ? '<span class="badge rounded-pill bg-danger">Ditolak</span>' : '<span class="badge rounded-pill bg-warning text-dark">Pending</span>'));
                    return `
                    <tr>
                      <td class="small fw-semibold">${escapeHtml(p.invoice)}</td>
                      <td class="small">${escapeHtml(st ? st.nama : '-')}</td>
                      <td class="small fw-semibold">${S.formatRupiah(p.nominal)}</td>
                      <td>${badge}</td>
                      <td class="text-end">
                        <a href="#/admin/pembayaran" class="btn btn-soft btn-sm rounded-pill">Periksa</a>
                      </td>
                    </tr>`;
                  }).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="col-lg-5">
          <div class="card-soft p-3 p-md-4 h-100">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h2 class="h6 mb-0">Siswa Terdaftar Terbaru</h2>
              <a href="#/admin/pengguna" class="small text-brand fw-semibold">Kelola pengguna</a>
            </div>
            <div class="d-grid gap-2">
              ${students.slice(0, 5).map(s => `
                <div class="d-flex align-items-center gap-2 py-2 border-bottom">
                  <img src="${escapeHtml(s.avatar || 'assets/img/avatar.svg')}" class="avatar-sm" alt="">
                  <div class="flex-grow-1 overflow-hidden">
                    <div class="small fw-semibold text-truncate">${escapeHtml(s.nama)}</div>
                    <div class="text-muted" style="font-size:.72rem">${escapeHtml(s.kelas || 'Siswa')} &middot; ${escapeHtml(s.sekolah || '-')}</div>
                  </div>
                  <span class="badge rounded-pill bg-success">Aktif</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;

    return renderAdminShell('dashboard', 'Dashboard Admin', user, content);
  }

  function renderPengguna(params) {
    const user = ensureAdminUser();
    document.body.className = 'app-body admin-body';
    const roleFilter = params.get('role') || 'all';
    const users = S.state.users.filter(u => roleFilter === 'all' || u.role === roleFilter);

    const content = `
      <div class="page-heading">
        <div><h1>Kelola Akun Pengguna</h1><p>Atur akun Siswa, Tutor pengampu, dan Administrator.</p></div>
        <button type="button" class="btn btn-brand rounded-pill" id="btnAddUserAdmin"><i class="fa-solid fa-user-plus me-1"></i>Tambah Pengguna</button>
      </div>

      <div class="card-soft p-3 mb-4">
        <div class="d-flex flex-wrap gap-2 align-items-center justify-content-between">
          <div class="d-flex flex-wrap gap-2">
            <a href="#/admin/pengguna?role=all" class="btn ${roleFilter === 'all' ? 'btn-brand' : 'btn-soft'} btn-sm rounded-pill">Semua (${S.state.users.length})</a>
            <a href="#/admin/pengguna?role=siswa" class="btn ${roleFilter === 'siswa' ? 'btn-brand' : 'btn-soft'} btn-sm rounded-pill">Siswa (${S.state.users.filter(u => u.role === 'siswa').length})</a>
            <a href="#/admin/pengguna?role=tutor" class="btn ${roleFilter === 'tutor' ? 'btn-brand' : 'btn-soft'} btn-sm rounded-pill">Tutor (${S.state.users.filter(u => u.role === 'tutor').length})</a>
            <a href="#/admin/pengguna?role=admin" class="btn ${roleFilter === 'admin' ? 'btn-brand' : 'btn-soft'} btn-sm rounded-pill">Admin (${S.state.users.filter(u => u.role === 'admin').length})</a>
          </div>
          <span class="small text-muted">Menampilkan ${users.length} akun</span>
        </div>
      </div>

      <div class="card-soft p-3 p-md-4">
        <div class="table-responsive">
          <table class="table table-hover datatable align-middle">
            <thead><tr><th>Pengguna</th><th>Role</th><th>WhatsApp</th><th>Info Tambahan</th><th>Status</th><th class="text-end">Aksi</th></tr></thead>
            <tbody>
              ${users.map(u => {
                const roleBadge = u.role === 'admin'
                  ? '<span class="badge bg-dark">Admin</span>'
                  : (u.role === 'tutor' ? '<span class="badge bg-info text-dark">Tutor</span>' : '<span class="badge bg-primary">Siswa</span>');
                const extraInfo = u.role === 'tutor'
                  ? `${escapeHtml(u.spesialisasi || '-')} &middot; ${S.formatRupiah(u.honor_per_jam || 100000)}/jam`
                  : (u.role === 'siswa' ? `${escapeHtml(u.kelas || '-')} &middot; ${escapeHtml(u.sekolah || '-')}` : 'Akses penuh sistem');
                return `
                <tr>
                  <td>
                    <div class="d-flex align-items-center gap-2">
                      <img src="${escapeHtml(u.avatar || 'assets/img/avatar.svg')}" class="avatar-sm" alt="">
                      <div>
                        <div class="small fw-semibold">${escapeHtml(u.nama)}</div>
                        <div class="text-muted" style="font-size:.72rem">${escapeHtml(u.email)}</div>
                      </div>
                    </div>
                  </td>
                  <td>${roleBadge}</td>
                  <td class="small">${escapeHtml(u.no_hp || '-')}</td>
                  <td class="small text-muted">${extraInfo}</td>
                  <td><span class="badge rounded-pill ${u.status === 'aktif' ? 'bg-success' : 'bg-secondary'}">${u.status === 'aktif' ? 'Aktif' : 'Nonaktif'}</span></td>
                  <td class="text-end table-actions">
                    <button type="button" class="btn btn-soft btn-sm btn-kirim-wa"
                      data-wa-user-id="${u.id}" data-wa-nama="${escapeHtml(u.nama)}"
                      data-wa-phone="${escapeHtml(u.no_hp || '')}"
                      data-wa-pesan="Halo ${escapeHtml(u.nama)}, salam dari Admin Bimbel Indonesia." title="WhatsApp"><i class="fa-brands fa-whatsapp text-success"></i></button>
                    <button type="button" class="btn btn-soft btn-sm btn-edit-user" data-id="${u.id}" title="Edit"><i class="fa-solid fa-pen"></i></button>
                    ${u.id !== 1 ? `<button type="button" class="btn btn-soft btn-sm text-danger btn-delete-user" data-id="${u.id}" title="Hapus"><i class="fa-solid fa-trash"></i></button>` : ''}
                  </td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <div class="modal fade" id="modalUserAdmin" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header"><h5 class="modal-title"><i class="fa-solid fa-user-gear me-2 text-primary"></i>Form Akun Pengguna</h5><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div>
            <form id="adminUserForm">
              <input type="hidden" name="id" id="adminUserId" value="">
              <div class="modal-body">
                <div class="row g-3">
                  <div class="col-md-4">
                    <label class="form-label">Role *</label>
                    <select name="role" id="adminUserRole" class="form-select" required>
                      <option value="siswa">Siswa</option>
                      <option value="tutor">Tutor</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div class="col-md-4">
                    <label class="form-label">Status</label>
                    <select name="status" id="adminUserStatus" class="form-select">
                      <option value="aktif">Aktif</option>
                      <option value="nonaktif">Nonaktif</option>
                    </select>
                  </div>
                  <div class="col-md-4">
                    <label class="form-label">Password</label>
                    <input type="text" name="password" id="adminUserPassword" class="form-control" placeholder="password123">
                  </div>
                  <div class="col-md-6"><label class="form-label">Nama Lengkap *</label><input type="text" name="nama" id="adminUserNama" class="form-control" required></div>
                  <div class="col-md-6"><label class="form-label">Email *</label><input type="email" name="email" id="adminUserEmail" class="form-control" required></div>
                  <div class="col-md-6"><label class="form-label">No. WhatsApp</label><input type="text" name="no_hp" id="adminUserHp" class="form-control" placeholder="628xxxxxxxxxx"></div>
                  <div class="col-md-6"><label class="form-label">Kelas (Untuk Siswa)</label><input type="text" name="kelas" id="adminUserKelas" class="form-control" placeholder="Kelas 10 / Kelas 12"></div>
                  <div class="col-md-6"><label class="form-label">Asal Sekolah (Untuk Siswa)</label><input type="text" name="sekolah" id="adminUserSekolah" class="form-control" placeholder="Nama sekolah"></div>
                  <div class="col-md-6"><label class="form-label">Spesialisasi (Untuk Tutor)</label><input type="text" name="spesialisasi" id="adminUserSpesialisasi" class="form-control" placeholder="Matematika SMP & SMA"></div>
                  <div class="col-md-6"><label class="form-label">Pendidikan (Untuk Tutor)</label><input type="text" name="pendidikan" id="adminUserPendidikan" class="form-control" placeholder="S1 Pendidikan Matematika"></div>
                  <div class="col-md-6"><label class="form-label">Honor per Jam (Rp)</label><input type="number" name="honor_per_jam" id="adminUserHonor" class="form-control" value="100000"></div>
                  <div class="col-12"><label class="form-label">Bio Tutor / Catatan</label><textarea name="bio" id="adminUserBio" class="form-control" rows="2"></textarea></div>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-soft rounded-pill" data-bs-dismiss="modal">Batal</button>
                <button type="submit" class="btn btn-brand rounded-pill px-4">Simpan Pengguna</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;

    return renderAdminShell('pengguna', 'Kelola Pengguna', user, content);
  }

  function renderProgram() {
    const user = ensureAdminUser();
    document.body.className = 'app-body admin-body';

    const content = `
      <div class="page-heading">
        <div><h1>Program & Paket Belajar</h1><p>Kelola program studi, paket belajar, harga, durasi, dan informasi paket.</p></div>
        <div class="d-flex gap-2">
          <button type="button" class="btn btn-soft rounded-pill" id="btnAddProgramAdmin"><i class="fa-solid fa-folder-plus me-1"></i>Tambah Program</button>
          <button type="button" class="btn btn-brand rounded-pill" id="btnAddPackageAdmin"><i class="fa-solid fa-plus me-1"></i>Tambah Paket Belajar</button>
        </div>
      </div>

      <ul class="nav nav-tabs mb-4" role="tablist">
        <li class="nav-item"><button class="nav-link active" data-bs-toggle="tab" data-bs-target="#tabPaketAdmin" type="button">Paket Belajar (${S.state.packages.length})</button></li>
        <li class="nav-item"><button class="nav-link" data-bs-toggle="tab" data-bs-target="#tabProgramAdmin" type="button">Program Belajar (${S.state.programs.length})</button></li>
      </ul>

      <div class="tab-content">
        <div class="tab-pane fade show active" id="tabPaketAdmin">
          <div class="card-soft p-3 p-md-4">
            <div class="table-responsive">
              <table class="table table-hover datatable align-middle">
                <thead><tr><th>Nama Paket</th><th>Program</th><th>Harga</th><th>Durasi & Sesi</th><th>Populer</th><th>Status</th><th class="text-end">Aksi</th></tr></thead>
                <tbody>
                  ${S.state.packages.map(pkg => {
                    const prog = S.state.programs.find(p => Number(p.id) === Number(pkg.program_id));
                    return `
                    <tr>
                      <td>
                        <div class="small fw-semibold">${escapeHtml(pkg.nama)}</div>
                        <div class="text-muted" style="font-size:.72rem">${escapeHtml(pkg.deskripsi)}</div>
                      </td>
                      <td><span class="chip chip-brand">${escapeHtml(prog ? prog.nama : '-')}</span></td>
                      <td class="small fw-bold text-primary">${S.formatRupiah(pkg.harga)}</td>
                      <td class="small">${pkg.durasi_bulan} bln &middot; ${pkg.jumlah_pertemuan} sesi</td>
                      <td>${pkg.is_popular ? '<span class="badge bg-warning text-dark">Populer</span>' : '-'}</td>
                      <td><span class="badge rounded-pill ${pkg.status === 'aktif' ? 'bg-success' : 'bg-secondary'}">${pkg.status === 'aktif' ? 'Aktif' : 'Nonaktif'}</span></td>
                      <td class="text-end table-actions">
                        <button type="button" class="btn btn-soft btn-sm btn-edit-package" data-id="${pkg.id}"><i class="fa-solid fa-pen"></i></button>
                        <button type="button" class="btn btn-soft btn-sm text-danger btn-delete-package" data-id="${pkg.id}"><i class="fa-solid fa-trash"></i></button>
                      </td>
                    </tr>`;
                  }).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="tab-pane fade" id="tabProgramAdmin">
          <div class="row g-4">
            ${S.state.programs.map(prog => `
              <div class="col-md-6 col-xl-3">
                <div class="card-soft overflow-hidden h-100 d-flex flex-column">
                  <div style="height:150px;background-image:url('${escapeHtml(prog.thumbnail || 'uploads/programs/program-matematika.svg')}');background-size:cover;background-position:center"></div>
                  <div class="p-3 d-flex flex-column flex-grow-1">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                      <span class="chip chip-brand">${escapeHtml(prog.kategori)}</span>
                      <span class="badge rounded-pill ${prog.status === 'aktif' ? 'bg-success' : 'bg-secondary'}">${prog.status}</span>
                    </div>
                    <h3 class="h6 mb-1">${escapeHtml(prog.nama)}</h3>
                    <p class="small text-muted flex-grow-1">${escapeHtml(prog.deskripsi)}</p>
                    <div class="fw-bold text-primary small mb-3">Mulai ${S.formatRupiah(prog.harga_mulai)}</div>
                    <div class="d-flex gap-2">
                      <button type="button" class="btn btn-soft btn-sm rounded-pill flex-grow-1 btn-edit-program" data-id="${prog.id}"><i class="fa-solid fa-pen me-1"></i>Edit</button>
                      <button type="button" class="btn btn-soft btn-sm text-danger rounded-pill btn-delete-program" data-id="${prog.id}"><i class="fa-solid fa-trash"></i></button>
                    </div>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <div class="modal fade" id="modalProgramAdmin" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header"><h5 class="modal-title">Form Program Belajar</h5><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div>
            <form id="adminProgramForm">
              <input type="hidden" name="id" id="progId" value="">
              <div class="modal-body">
                <div class="row g-3">
                  <div class="col-md-8"><label class="form-label">Nama Program *</label><input type="text" name="nama" id="progNama" class="form-control" required></div>
                  <div class="col-md-4"><label class="form-label">Kategori/Tag</label><input type="text" name="kategori" id="progKategori" class="form-control" value="Sains"></div>
                  <div class="col-md-6"><label class="form-label">Harga Mulai (Rp)</label><input type="number" name="harga_mulai" id="progHarga" class="form-control" value="400000" required></div>
                  <div class="col-md-6"><label class="form-label">Status</label><select name="status" id="progStatus" class="form-select"><option value="aktif">Aktif</option><option value="nonaktif">Nonaktif</option></select></div>
                  <div class="col-12"><label class="form-label">Deskripsi *</label><textarea name="deskripsi" id="progDeskripsi" class="form-control" rows="3" required></textarea></div>
                  <div class="col-12"><label class="form-label">Unggah Gambar Program (Opsional)</label><input type="file" id="progThumbFile" class="form-control" accept="image/*"></div>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-soft rounded-pill" data-bs-dismiss="modal">Batal</button>
                <button type="submit" class="btn btn-brand rounded-pill px-4">Simpan Program</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div class="modal fade" id="modalPackageAdmin" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header"><h5 class="modal-title">Form Paket Belajar</h5><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div>
            <form id="adminPackageForm">
              <input type="hidden" name="id" id="pkgId" value="">
              <div class="modal-body">
                <div class="row g-3">
                  <div class="col-md-6">
                    <label class="form-label">Program *</label>
                    <select name="program_id" id="pkgProgram" class="form-select" required>
                      ${S.state.programs.map(p => `<option value="${p.id}">${escapeHtml(p.nama)}</option>`).join('')}
                    </select>
                  </div>
                  <div class="col-md-6"><label class="form-label">Nama Paket *</label><input type="text" name="nama" id="pkgNama" class="form-control" required></div>
                  <div class="col-md-4"><label class="form-label">Harga (Rp) *</label><input type="number" name="harga" id="pkgHarga" class="form-control" value="450000" required></div>
                  <div class="col-md-4"><label class="form-label">Durasi (Bulan)</label><input type="number" name="durasi_bulan" id="pkgDurasi" class="form-control" value="3" required></div>
                  <div class="col-md-4"><label class="form-label">Jumlah Pertemuan</label><input type="number" name="jumlah_pertemuan" id="pkgPertemuan" class="form-control" value="12" required></div>
                  <div class="col-12"><label class="form-label">Deskripsi Paket *</label><textarea name="deskripsi" id="pkgDeskripsi" class="form-control" rows="2" required></textarea></div>
                  <div class="col-12"><label class="form-label">Fitur Paket (pisahkan dengan koma)</label><input type="text" name="fitur" id="pkgFitur" class="form-control" value="3 bulan belajar, 12 pertemuan live, Materi & latihan soal, Try out dan pembahasan"></div>
                  <div class="col-md-6">
                    <label class="form-label">Status</label>
                    <select name="status" id="pkgStatus" class="form-select"><option value="aktif">Aktif</option><option value="nonaktif">Nonaktif</option></select>
                  </div>
                  <div class="col-md-6 d-flex align-items-end">
                    <div class="form-check mb-2">
                      <input type="checkbox" class="form-check-input" id="pkgPopular" name="is_popular">
                      <label class="form-check-label small fw-semibold" for="pkgPopular">Tandai sebagai "Paling Populer"</label>
                    </div>
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-soft rounded-pill" data-bs-dismiss="modal">Batal</button>
                <button type="submit" class="btn btn-brand rounded-pill px-4">Simpan Paket</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;

    return renderAdminShell('program', 'Program & Paket Belajar', user, content);
  }

  function renderKelas() {
    const user = ensureAdminUser();
    document.body.className = 'app-body admin-body';
    const tutors = S.state.users.filter(u => u.role === 'tutor');

    const content = `
      <div class="page-heading">
        <div><h1>Kelas & Jadwal Pertemuan</h1><p>Atur kelas, tutor pengampu, kapasitas kelas, dan jadwal pertemuan.</p></div>
        <div class="d-flex gap-2">
          <button type="button" class="btn btn-soft rounded-pill" id="btnAddScheduleAdmin"><i class="fa-solid fa-calendar-plus me-1"></i>Tambah Jadwal</button>
          <button type="button" class="btn btn-brand rounded-pill" id="btnAddClassAdmin"><i class="fa-solid fa-plus me-1"></i>Buat Kelas Baru</button>
        </div>
      </div>

      <ul class="nav nav-tabs mb-4" role="tablist">
        <li class="nav-item"><button class="nav-link active" data-bs-toggle="tab" data-bs-target="#tabAdminKelas" type="button">Daftar Kelas (${S.state.classes.length})</button></li>
        <li class="nav-item"><button class="nav-link" data-bs-toggle="tab" data-bs-target="#tabAdminJadwal" type="button">Jadwal Pertemuan (${S.state.schedules.length})</button></li>
      </ul>

      <div class="tab-content">
        <div class="tab-pane fade show active" id="tabAdminKelas">
          <div class="card-soft p-3 p-md-4">
            <div class="table-responsive">
              <table class="table table-hover datatable align-middle">
                <thead><tr><th>Nama Kelas</th><th>Paket / Program</th><th>Tutor Pengampu</th><th>Jenjang</th><th>Kapasitas</th><th>Status</th><th class="text-end">Aksi</th></tr></thead>
                <tbody>
                  ${S.state.classes.map(cls => {
                    const pkg = S.state.packages.find(p => Number(p.id) === Number(cls.package_id));
                    const tutor = S.state.users.find(u => Number(u.id) === Number(cls.tutor_id));
                    const enrolled = S.state.enrollments.filter(e => Number(e.class_id) === Number(cls.id) && e.status === 'aktif').length;
                    return `
                    <tr>
                      <td>
                        <div class="small fw-semibold">${escapeHtml(cls.nama)}</div>
                        <div class="text-muted" style="font-size:.72rem">${escapeHtml(cls.deskripsi)}</div>
                      </td>
                      <td class="small">${escapeHtml(pkg ? pkg.nama : '-')}</td>
                      <td class="small fw-semibold">${escapeHtml(tutor ? tutor.nama : '-')}</td>
                      <td><span class="chip">${escapeHtml(cls.jenjang || 'SMP')}</span></td>
                      <td class="small"><strong>${enrolled}</strong> / ${cls.kapasitas} siswa</td>
                      <td><span class="badge rounded-pill ${cls.status === 'aktif' ? 'bg-success' : 'bg-secondary'}">${cls.status}</span></td>
                      <td class="text-end table-actions">
                        <button type="button" class="btn btn-soft btn-sm btn-edit-class" data-id="${cls.id}" title="Edit"><i class="fa-solid fa-pen"></i></button>
                        <button type="button" class="btn btn-soft btn-sm text-danger btn-delete-class" data-id="${cls.id}" title="Hapus"><i class="fa-solid fa-trash"></i></button>
                      </td>
                    </tr>`;
                  }).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="tab-pane fade" id="tabAdminJadwal">
          <div class="card-soft p-3 p-md-4">
            <div class="table-responsive">
              <table class="table table-hover datatable align-middle">
                <thead><tr><th>Tanggal & Jam</th><th>Kelas</th><th>Tutor</th><th>Topik</th><th>Meeting</th><th>Status</th><th class="text-end">Aksi</th></tr></thead>
                <tbody>
                  ${S.state.schedules.map(sc => {
                    const cls = S.state.classes.find(c => Number(c.id) === Number(sc.class_id));
                    const tutor = S.state.users.find(u => Number(u.id) === Number(sc.tutor_id || (cls ? cls.tutor_id : 0)));
                    const badge = sc.status === 'selesai'
                      ? '<span class="badge rounded-pill bg-success">Selesai</span>'
                      : (sc.status === 'batal' ? '<span class="badge rounded-pill bg-danger">Batal</span>' : '<span class="badge rounded-pill bg-primary">Terjadwal</span>');
                    return `
                    <tr>
                      <td class="small"><div>${S.formatDateId(sc.tanggal)}</div><div class="text-muted" style="font-size:.72rem">${escapeHtml(sc.jam_mulai)}–${escapeHtml(sc.jam_selesai)} WIB</div></td>
                      <td class="small fw-semibold">${escapeHtml(cls ? cls.nama : '-')}</td>
                      <td class="small">${escapeHtml(tutor ? tutor.nama : '-')}</td>
                      <td class="small">${escapeHtml(sc.topik)}</td>
                      <td><a href="${escapeHtml(sc.meeting_link || 'https://meet.google.com')}" target="_blank" class="btn btn-soft btn-sm rounded-pill"><i class="fa-solid fa-video me-1"></i>Link</a></td>
                      <td>${badge}</td>
                      <td class="text-end table-actions">
                        <button type="button" class="btn btn-soft btn-sm btn-edit-jadwal"
                          data-id="${sc.id}" data-class="${sc.class_id}" data-tanggal="${escapeHtml(sc.tanggal)}"
                          data-mulai="${escapeHtml(sc.jam_mulai)}" data-selesai="${escapeHtml(sc.jam_selesai)}"
                          data-topik="${escapeHtml(sc.topik)}" data-link="${escapeHtml(sc.meeting_link || '')}"
                          data-status="${escapeHtml(sc.status)}"><i class="fa-solid fa-pen"></i></button>
                        <button type="button" class="btn btn-soft btn-sm text-danger btn-delete-jadwal" data-id="${sc.id}"><i class="fa-solid fa-trash"></i></button>
                      </td>
                    </tr>`;
                  }).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div class="modal fade" id="modalClassAdmin" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header"><h5 class="modal-title">Form Kelas Belajar</h5><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div>
            <form id="adminClassForm">
              <input type="hidden" name="id" id="clsId" value="">
              <div class="modal-body">
                <div class="row g-3">
                  <div class="col-md-6"><label class="form-label">Nama Kelas *</label><input type="text" name="nama" id="clsNama" class="form-control" required></div>
                  <div class="col-md-6">
                    <label class="form-label">Paket Belajar *</label>
                    <select name="package_id" id="clsPackage" class="form-select" required>
                      ${S.state.packages.map(p => `<option value="${p.id}">${escapeHtml(p.nama)}</option>`).join('')}
                    </select>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Tutor Pengampu *</label>
                    <select name="tutor_id" id="clsTutor" class="form-select" required>
                      ${tutors.map(t => `<option value="${t.id}">${escapeHtml(t.nama)} (${escapeHtml(t.spesialisasi || 'Tutor')})</option>`).join('')}
                    </select>
                  </div>
                  <div class="col-md-3">
                    <label class="form-label">Jenjang</label>
                    <select name="jenjang" id="clsJenjang" class="form-select">
                      <option value="SD">SD</option><option value="SMP">SMP</option><option value="SMA">SMA</option><option value="UTBK">UTBK</option>
                    </select>
                  </div>
                  <div class="col-md-3"><label class="form-label">Kapasitas Siswa</label><input type="number" name="kapasitas" id="clsKapasitas" class="form-control" value="20" min="1" required></div>
                  <div class="col-12"><label class="form-label">Deskripsi Kelas</label><textarea name="deskripsi" id="clsDeskripsi" class="form-control" rows="2"></textarea></div>
                  <div class="col-md-6"><label class="form-label">Status</label><select name="status" id="clsStatus" class="form-select"><option value="aktif">Aktif</option><option value="nonaktif">Nonaktif</option></select></div>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-soft rounded-pill" data-bs-dismiss="modal">Batal</button>
                <button type="submit" class="btn btn-brand rounded-pill px-4">Simpan Kelas</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div class="modal fade" id="modalJadwal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header"><h5 class="modal-title">Form Jadwal Pertemuan</h5><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div>
            <form id="tutorJadwalForm">
              <input type="hidden" name="id" id="jadwalId" value="">
              <div class="modal-body">
                <div class="row g-3">
                  <div class="col-md-6">
                    <label class="form-label">Kelas *</label>
                    <select name="class_id" id="jadwalKelas" class="form-select" required>
                      ${S.state.classes.map(c => `<option value="${c.id}">${escapeHtml(c.nama)}</option>`).join('')}
                    </select>
                  </div>
                  <div class="col-md-6"><label class="form-label">Tanggal *</label><input type="date" name="tanggal" id="jadwalTanggal" class="form-control" value="2026-11-20" required></div>
                  <div class="col-md-6"><label class="form-label">Jam Mulai</label><input type="time" name="jam_mulai" id="jadwalMulai" class="form-control" value="16:00" required></div>
                  <div class="col-md-6"><label class="form-label">Jam Selesai</label><input type="time" name="jam_selesai" id="jadwalSelesai" class="form-control" value="17:30" required></div>
                  <div class="col-12"><label class="form-label">Topik *</label><input type="text" name="topik" id="jadwalTopik" class="form-control" required></div>
                  <div class="col-12"><label class="form-label">Meeting Link</label><input type="url" name="meeting_link" id="jadwalLink" class="form-control" placeholder="https://meet.google.com/..."></div>
                  <div class="col-md-6"><label class="form-label">Status</label><select name="status" id="jadwalStatus" class="form-select"><option value="terjadwal">Terjadwal</option><option value="selesai">Selesai</option><option value="batal">Batal</option></select></div>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-soft rounded-pill" data-bs-dismiss="modal">Batal</button>
                <button type="submit" class="btn btn-brand rounded-pill px-4">Simpan Jadwal</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;

    return renderAdminShell('kelas', 'Kelas & Jadwal', user, content);
  }

  function renderMateriSoal() {
    const user = ensureAdminUser();
    document.body.className = 'app-body admin-body';

    const content = `
      <div class="page-heading">
        <div><h1>Pantau Materi & Bank Soal</h1><p>Pantau seluruh materi belajar dan soal pilihan ganda yang diunggah oleh tutor.</p></div>
      </div>

      <ul class="nav nav-tabs mb-4" role="tablist">
        <li class="nav-item"><button class="nav-link active" data-bs-toggle="tab" data-bs-target="#tabMonitorMateri" type="button">Materi Belajar (${S.state.materials.length})</button></li>
        <li class="nav-item"><button class="nav-link" data-bs-toggle="tab" data-bs-target="#tabMonitorSoal" type="button">Bank Soal (${S.state.questions.length})</button></li>
        <li class="nav-item"><button class="nav-link" data-bs-toggle="tab" data-bs-target="#tabMonitorTryout" type="button">Daftar Try Out (${S.state.exams.length})</button></li>
      </ul>

      <div class="tab-content">
        <div class="tab-pane fade show active" id="tabMonitorMateri">
          <div class="card-soft p-3 p-md-4">
            <div class="table-responsive">
              <table class="table table-hover datatable align-middle">
                <thead><tr><th>Judul Materi</th><th>Tipe</th><th>Kelas</th><th>Tutor Pengunggah</th><th>Tanggal</th><th class="text-end">Aksi</th></tr></thead>
                <tbody>
                  ${S.state.materials.map(m => {
                    const cls = S.state.classes.find(c => Number(c.id) === Number(m.class_id));
                    const tutor = S.state.users.find(u => Number(u.id) === Number(m.tutor_id || (cls ? cls.tutor_id : 0)));
                    return `
                    <tr>
                      <td>
                        <div class="small fw-semibold">${escapeHtml(m.judul)}</div>
                        <div class="text-muted" style="font-size:.72rem">${escapeHtml(m.deskripsi)}</div>
                      </td>
                      <td><span class="chip text-uppercase">${escapeHtml(m.tipe)}</span></td>
                      <td class="small">${escapeHtml(cls ? cls.nama : '-')}</td>
                      <td class="small">${escapeHtml(tutor ? tutor.nama : '-')}</td>
                      <td class="small">${S.formatDateId(m.created_at)}</td>
                      <td class="text-end table-actions">
                        <a href="${escapeHtml(m.url || '#')}" target="_blank" class="btn btn-soft btn-sm" data-open-material="${m.id}" title="Buka"><i class="fa-solid fa-arrow-up-right-from-square"></i></a>
                        <button type="button" class="btn btn-soft btn-sm text-danger btn-delete-materi" data-id="${m.id}" title="Hapus"><i class="fa-solid fa-trash"></i></button>
                      </td>
                    </tr>`;
                  }).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="tab-pane fade" id="tabMonitorSoal">
          <div class="card-soft p-3 p-md-4">
            <div class="table-responsive">
              <table class="table table-hover datatable align-middle">
                <thead><tr><th>Pertanyaan</th><th>Kelas</th><th>Tutor</th><th>Kunci</th><th>Status</th><th class="text-end">Aksi</th></tr></thead>
                <tbody>
                  ${S.state.questions.map(q => {
                    const cls = S.state.classes.find(c => Number(c.id) === Number(q.class_id));
                    const tutor = S.state.users.find(u => Number(u.id) === Number(q.tutor_id));
                    return `
                    <tr>
                      <td class="small" style="max-width:420px">${escapeHtml(q.pertanyaan)}</td>
                      <td class="small">${escapeHtml(cls ? cls.nama : 'Umum')}</td>
                      <td class="small">${escapeHtml(tutor ? tutor.nama : '-')}</td>
                      <td><span class="badge bg-primary">${escapeHtml(q.jawaban_benar)}</span></td>
                      <td><span class="badge rounded-pill ${q.status === 'aktif' ? 'bg-success' : 'bg-secondary'}">${q.status}</span></td>
                      <td class="text-end table-actions">
                        <button type="button" class="btn btn-soft btn-sm btn-view-question" data-id="${q.id}" title="Lihat Detail"><i class="fa-solid fa-eye"></i></button>
                        <button type="button" class="btn btn-soft btn-sm text-danger btn-delete-question" data-id="${q.id}" title="Hapus"><i class="fa-solid fa-trash"></i></button>
                      </td>
                    </tr>`;
                  }).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="tab-pane fade" id="tabMonitorTryout">
          <div class="card-soft p-3 p-md-4">
            <div class="table-responsive">
              <table class="table table-hover datatable align-middle">
                <thead><tr><th>Judul Try Out</th><th>Kelas</th><th>Tutor</th><th>Durasi</th><th>Peserta</th><th>Status</th><th class="text-end">Aksi</th></tr></thead>
                <tbody>
                  ${S.state.exams.map(ex => {
                    const cls = S.state.classes.find(c => Number(c.id) === Number(ex.class_id));
                    const tutor = S.state.users.find(u => Number(u.id) === Number(ex.tutor_id));
                    const cnt = S.state.examResults.filter(r => Number(r.exam_id) === Number(ex.id)).length;
                    return `
                    <tr>
                      <td class="small fw-semibold">${escapeHtml(ex.judul)}</td>
                      <td class="small">${escapeHtml(cls ? cls.nama : '-')}</td>
                      <td class="small">${escapeHtml(tutor ? tutor.nama : '-')}</td>
                      <td class="small">${ex.durasi_menit} menit</td>
                      <td class="small">${cnt} siswa</td>
                      <td><span class="badge rounded-pill bg-success">${escapeHtml(ex.status)}</span></td>
                      <td class="text-end">
                        <button type="button" class="btn btn-soft btn-sm text-danger btn-delete-exam" data-id="${ex.id}"><i class="fa-solid fa-trash"></i></button>
                      </td>
                    </tr>`;
                  }).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div class="modal fade" id="modalLihatSoal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header"><h5 class="modal-title">Detail Soal Pilihan Ganda</h5><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div>
            <div class="modal-body" id="lihatSoalBody"></div>
          </div>
        </div>
      </div>
    `;

    return renderAdminShell('materi-soal', 'Materi & Bank Soal', user, content);
  }

  function renderPembayaran(params) {
    const user = ensureAdminUser();
    document.body.className = 'app-body admin-body';
    const statusFilter = params.get('status') || 'all';
    const payments = S.state.payments
      .filter(p => statusFilter === 'all' || p.status === statusFilter)
      .sort((a, b) => Number(b.id) - Number(a.id));

    function statusBadge(st) {
      if (st === 'lunas') return '<span class="badge rounded-pill bg-success">Lunas</span>';
      if (st === 'menunggu_verifikasi') return '<span class="badge rounded-pill bg-info text-dark">Menunggu Verifikasi</span>';
      if (st === 'ditolak') return '<span class="badge rounded-pill bg-danger">Ditolak</span>';
      return '<span class="badge rounded-pill bg-warning text-dark">Pending</span>';
    }

    const content = `
      <div class="page-heading">
        <div><h1>Verifikasi Pembayaran & Invoice</h1><p>Periksa bukti transfer siswa, lalu verifikasi atau tolak pembayaran.</p></div>
      </div>

      <div class="card-soft p-3 mb-4">
        <div class="d-flex flex-wrap gap-2">
          <a href="#/admin/pembayaran?status=all" class="btn ${statusFilter === 'all' ? 'btn-brand' : 'btn-soft'} btn-sm rounded-pill">Semua (${S.state.payments.length})</a>
          <a href="#/admin/pembayaran?status=menunggu_verifikasi" class="btn ${statusFilter === 'menunggu_verifikasi' ? 'btn-brand' : 'btn-soft'} btn-sm rounded-pill">Butuh Verifikasi (${S.state.payments.filter(p => p.status === 'menunggu_verifikasi').length})</a>
          <a href="#/admin/pembayaran?status=pending" class="btn ${statusFilter === 'pending' ? 'btn-brand' : 'btn-soft'} btn-sm rounded-pill">Pending (${S.state.payments.filter(p => p.status === 'pending').length})</a>
          <a href="#/admin/pembayaran?status=lunas" class="btn ${statusFilter === 'lunas' ? 'btn-brand' : 'btn-soft'} btn-sm rounded-pill">Lunas (${S.state.payments.filter(p => p.status === 'lunas').length})</a>
          <a href="#/admin/pembayaran?status=ditolak" class="btn ${statusFilter === 'ditolak' ? 'btn-brand' : 'btn-soft'} btn-sm rounded-pill">Ditolak (${S.state.payments.filter(p => p.status === 'ditolak').length})</a>
        </div>
      </div>

      <div class="card-soft p-3 p-md-4">
        <div class="table-responsive">
          <table class="table table-hover datatable align-middle">
            <thead><tr><th>Invoice</th><th>Siswa</th><th>Paket & Kelas</th><th>Nominal</th><th>Tanggal</th><th>Bukti</th><th>Status</th><th class="text-end">Verifikasi / Aksi</th></tr></thead>
            <tbody>
              ${payments.map(p => {
                const st = S.state.users.find(u => Number(u.id) === Number(p.siswa_id));
                const pkg = S.state.packages.find(k => Number(k.id) === Number(p.package_id));
                const cls = S.state.classes.find(c => Number(c.id) === Number(p.class_id));
                return `
                <tr>
                  <td>
                    <div class="small fw-semibold">${escapeHtml(p.invoice)}</div>
                    <div class="text-muted" style="font-size:.7rem">${escapeHtml(p.metode || 'manual')} ${p.kupon ? `&middot; Kupon ${escapeHtml(p.kupon)}` : ''}</div>
                  </td>
                  <td>
                    <div class="small fw-semibold">${escapeHtml(st ? st.nama : '-')}</div>
                    <div class="text-muted" style="font-size:.7rem">${escapeHtml(st ? st.email : '')}</div>
                  </td>
                  <td>
                    <div class="small">${escapeHtml(pkg ? pkg.nama : '-')}</div>
                    <div class="text-muted" style="font-size:.7rem">${escapeHtml(cls ? cls.nama : '')}</div>
                  </td>
                  <td class="small fw-bold">${S.formatRupiah(p.nominal)}</td>
                  <td class="small">${S.formatDateId(p.tanggal)}</td>
                  <td>
                    ${p.bukti ? `<button type="button" class="btn btn-soft btn-sm rounded-pill btn-preview-bukti" data-bukti="${escapeHtml(p.bukti)}" data-invoice="${escapeHtml(p.invoice)}"><i class="fa-solid fa-image me-1"></i>Lihat Bukti</button>` : '<span class="text-muted small">Belum ada</span>'}
                  </td>
                  <td>${statusBadge(p.status)}</td>
                  <td class="text-end table-actions">
                    ${p.status !== 'lunas' ? `
                      <button type="button" class="btn btn-success btn-sm btn-verify-payment" data-id="${p.id}" data-status="lunas" title="Verifikasi (Lunas)"><i class="fa-solid fa-check"></i></button>
                    ` : ''}
                    ${p.status !== 'ditolak' ? `
                      <button type="button" class="btn btn-danger btn-sm btn-verify-payment" data-id="${p.id}" data-status="ditolak" title="Tolak Pembayaran"><i class="fa-solid fa-xmark"></i></button>
                    ` : ''}
                    ${p.status === 'lunas' ? `
                      <button type="button" class="btn btn-soft btn-sm btn-download-invoice" data-payment-id="${p.id}" title="Unduh Invoice PNG"><i class="fa-solid fa-download"></i></button>
                    ` : ''}
                  </td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    return renderAdminShell('pembayaran', 'Verifikasi Pembayaran', user, content);
  }

  function renderBanner() {
    const user = ensureAdminUser();
    document.body.className = 'app-body admin-body';
    const sliders = [...S.state.sliders].sort((a, b) => Number(a.urutan) - Number(b.urutan));

    const content = `
      <div class="page-heading">
        <div><h1>Banner Halaman Depan</h1><p>Unggah gambar desain banner sendiri, atur urutan tampil, dan status aktif pada halaman publik.</p></div>
      </div>

      <div class="row g-4">
        <div class="col-lg-5">
          <div class="card-soft p-3 p-md-4">
            <h2 class="h6 mb-3"><i class="fa-solid fa-cloud-arrow-up me-2 text-primary"></i>Unggah Banner Baru</h2>
            <form id="adminSliderForm">
              <input type="hidden" name="id" id="sliderId" value="">
              <div class="mb-3">
                <label class="form-label">Judul / Keterangan Banner *</label>
                <input type="text" name="title" id="sliderTitle" class="form-control" placeholder="Contoh: Promo Intensif UTBK 2026" required>
              </div>
              <div class="row g-3 mb-3">
                <div class="col-6">
                  <label class="form-label">Urutan Tampil</label>
                  <input type="number" name="urutan" id="sliderUrutan" class="form-control" value="${sliders.length + 1}" min="1" required>
                </div>
                <div class="col-6">
                  <label class="form-label">Status Tampil</label>
                  <select name="status" id="sliderStatus" class="form-select">
                    <option value="aktif">Tampil (Aktif)</option>
                    <option value="nonaktif">Sembunyikan (Nonaktif)</option>
                  </select>
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label">File Gambar Desain Banner *</label>
                <input type="file" id="sliderImageInput" class="form-control" accept="image/jpeg,image/png,image/webp,image/svg+xml">
                <div class="form-text">Rekomendasi rasio 12:5 (misal 1920&times;800 px).</div>
              </div>
              <div class="slider-upload-preview mb-3" id="sliderUploadPreviewBox">
                <span class="small" id="sliderPreviewPlaceholder"><i class="fa-regular fa-image me-1"></i>Pratinjau gambar banner (12:5)</span>
                <img id="sliderUploadPreviewImg" src="" alt="Preview" hidden>
              </div>
              <button type="submit" class="btn btn-brand rounded-pill w-100"><i class="fa-solid fa-floppy-disk me-1"></i>Simpan Banner</button>
            </form>
          </div>
        </div>

        <div class="col-lg-7">
          <div class="card-soft p-3 p-md-4">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h2 class="h6 mb-0">Daftar Banner (${sliders.length})</h2>
              <a href="#/home" class="small text-brand fw-semibold"><i class="fa-solid fa-eye me-1"></i>Lihat di Beranda</a>
            </div>
            <div class="d-grid gap-3">
              ${sliders.map((s, idx) => `
                <div class="border rounded-4 p-3 bg-white">
                  <div class="row g-3 align-items-center">
                    <div class="col-sm-5">
                      <div class="slider-preview-frame">
                        <img src="${escapeHtml(s.image)}" alt="${escapeHtml(s.title)}">
                      </div>
                    </div>
                    <div class="col-sm-7">
                      <div class="d-flex justify-content-between align-items-start gap-2 mb-1">
                        <span class="chip chip-brand">Urutan #${s.urutan}</span>
                        <span class="badge rounded-pill ${s.status === 'aktif' ? 'bg-success' : 'bg-secondary'}">${s.status === 'aktif' ? 'Tampil' : 'Disembunyikan'}</span>
                      </div>
                      <h3 class="h6 mb-2 mt-2">${escapeHtml(s.title)}</h3>
                      <div class="d-flex flex-wrap gap-2 mt-3">
                        <button type="button" class="btn btn-soft btn-sm rounded-pill btn-move-slider" data-id="${s.id}" data-dir="up" ${idx === 0 ? 'disabled' : ''} title="Naikkan urutan"><i class="fa-solid fa-arrow-up"></i></button>
                        <button type="button" class="btn btn-soft btn-sm rounded-pill btn-move-slider" data-id="${s.id}" data-dir="down" ${idx === sliders.length - 1 ? 'disabled' : ''} title="Turunkan urutan"><i class="fa-solid fa-arrow-down"></i></button>
                        <button type="button" class="btn btn-soft btn-sm rounded-pill btn-toggle-slider" data-id="${s.id}">
                          <i class="fa-solid ${s.status === 'aktif' ? 'fa-eye-slash' : 'fa-eye'} me-1"></i>${s.status === 'aktif' ? 'Sembunyikan' : 'Tampilkan'}
                        </button>
                        <button type="button" class="btn btn-soft btn-sm text-danger rounded-pill ms-auto btn-delete-slider" data-id="${s.id}"><i class="fa-solid fa-trash"></i></button>
                      </div>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;

    return renderAdminShell('banner', 'Banner Halaman Depan', user, content);
  }

  function renderKonten() {
    const user = ensureAdminUser();
    document.body.className = 'app-body admin-body';

    const content = `
      <div class="page-heading">
        <div><h1>Blog, Testimoni, Kupon & FAQ</h1><p>Kelola artikel blog edukasi, testimoni siswa, kode kupon diskon, dan FAQ halaman depan.</p></div>
        <div class="d-flex flex-wrap gap-2">
          <button type="button" class="btn btn-brand rounded-pill btn-sm" id="btnAddBlogAdmin"><i class="fa-solid fa-plus me-1"></i>Artikel Blog</button>
          <button type="button" class="btn btn-soft rounded-pill btn-sm" id="btnAddTestiAdmin"><i class="fa-solid fa-plus me-1"></i>Testimoni</button>
          <button type="button" class="btn btn-soft rounded-pill btn-sm" id="btnAddCouponAdmin"><i class="fa-solid fa-plus me-1"></i>Kupon Diskon</button>
          <button type="button" class="btn btn-soft rounded-pill btn-sm" id="btnAddFaqAdmin"><i class="fa-solid fa-plus me-1"></i>FAQ</button>
        </div>
      </div>

      <ul class="nav nav-tabs mb-4" role="tablist">
        <li class="nav-item"><button class="nav-link active" data-bs-toggle="tab" data-bs-target="#tabAdminBlog" type="button">Artikel Blog (${S.state.blogs.length})</button></li>
        <li class="nav-item"><button class="nav-link" data-bs-toggle="tab" data-bs-target="#tabAdminTesti" type="button">Testimoni (${S.state.testimonials.length})</button></li>
        <li class="nav-item"><button class="nav-link" data-bs-toggle="tab" data-bs-target="#tabAdminKupon" type="button">Kupon Diskon (${S.state.coupons.length})</button></li>
        <li class="nav-item"><button class="nav-link" data-bs-toggle="tab" data-bs-target="#tabAdminFaq" type="button">FAQ (${S.state.faqs.length})</button></li>
      </ul>

      <div class="tab-content">
        <div class="tab-pane fade show active" id="tabAdminBlog">
          <div class="card-soft p-3 p-md-4">
            <div class="table-responsive">
              <table class="table table-hover align-middle">
                <thead><tr><th>Judul Artikel</th><th>Penulis</th><th>Tanggal</th><th>Status</th><th class="text-end">Aksi</th></tr></thead>
                <tbody>
                  ${S.state.blogs.map(b => `
                    <tr>
                      <td>
                        <div class="small fw-semibold">${escapeHtml(b.judul)}</div>
                        <div class="text-muted" style="font-size:.72rem">${escapeHtml(b.ringkasan)}</div>
                      </td>
                      <td class="small">${escapeHtml(b.penulis)}</td>
                      <td class="small">${escapeHtml(b.tanggal)}</td>
                      <td><span class="badge rounded-pill ${b.status === 'publish' ? 'bg-success' : 'bg-secondary'}">${b.status}</span></td>
                      <td class="text-end table-actions">
                        <a href="#/blog?id=${b.id}" class="btn btn-soft btn-sm" title="Lihat"><i class="fa-solid fa-eye"></i></a>
                        <button type="button" class="btn btn-soft btn-sm btn-edit-blog" data-id="${b.id}"><i class="fa-solid fa-pen"></i></button>
                        <button type="button" class="btn btn-soft btn-sm text-danger btn-delete-blog" data-id="${b.id}"><i class="fa-solid fa-trash"></i></button>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="tab-pane fade" id="tabAdminTesti">
          <div class="card-soft p-3 p-md-4">
            <div class="table-responsive">
              <table class="table table-hover align-middle">
                <thead><tr><th>Nama Siswa</th><th>Kelas / Info</th><th>Testimoni</th><th>Rating</th><th>Status</th><th class="text-end">Aksi</th></tr></thead>
                <tbody>
                  ${S.state.testimonials.map(t => `
                    <tr>
                      <td class="small fw-semibold">${escapeHtml(t.nama)}</td>
                      <td class="small">${escapeHtml(t.info)}</td>
                      <td class="small text-muted" style="max-width:380px">"${escapeHtml(t.pesan)}"</td>
                      <td class="text-warning small">${'<i class="fa-solid fa-star"></i>'.repeat(Number(t.rating) || 5)}</td>
                      <td><span class="badge rounded-pill ${t.status === 'aktif' ? 'bg-success' : 'bg-secondary'}">${t.status}</span></td>
                      <td class="text-end table-actions">
                        <button type="button" class="btn btn-soft btn-sm btn-edit-testi" data-id="${t.id}"><i class="fa-solid fa-pen"></i></button>
                        <button type="button" class="btn btn-soft btn-sm text-danger btn-delete-testi" data-id="${t.id}"><i class="fa-solid fa-trash"></i></button>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="tab-pane fade" id="tabAdminKupon">
          <div class="card-soft p-3 p-md-4">
            <div class="table-responsive">
              <table class="table table-hover align-middle">
                <thead><tr><th>Kode Kupon</th><th>Tipe</th><th>Nilai Diskon</th><th>Pemakaian</th><th>Berlaku Sampai</th><th>Status</th><th class="text-end">Aksi</th></tr></thead>
                <tbody>
                  ${S.state.coupons.map(c => `
                    <tr>
                      <td><code class="fw-bold fs-6">${escapeHtml(c.kode)}</code></td>
                      <td class="small text-capitalize">${escapeHtml(c.tipe)}</td>
                      <td class="small fw-semibold">${c.tipe === 'persen' ? c.nilai + '%' : S.formatRupiah(c.nilai)}</td>
                      <td class="small">${c.terpakai || 0} / ${c.kuota}</td>
                      <td class="small">${S.formatDateId(c.berlaku_sampai)}</td>
                      <td><span class="badge rounded-pill ${c.status === 'aktif' ? 'bg-success' : 'bg-secondary'}">${c.status}</span></td>
                      <td class="text-end table-actions">
                        <button type="button" class="btn btn-soft btn-sm btn-edit-coupon" data-id="${c.id}"><i class="fa-solid fa-pen"></i></button>
                        <button type="button" class="btn btn-soft btn-sm text-danger btn-delete-coupon" data-id="${c.id}"><i class="fa-solid fa-trash"></i></button>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="tab-pane fade" id="tabAdminFaq">
          <div class="card-soft p-3 p-md-4">
            <div class="table-responsive">
              <table class="table table-hover align-middle">
                <thead><tr><th>Pertanyaan</th><th>Jawaban</th><th class="text-end">Aksi</th></tr></thead>
                <tbody>
                  ${S.state.faqs.map(f => `
                    <tr>
                      <td class="small fw-semibold">${escapeHtml(f.pertanyaan)}</td>
                      <td class="small text-muted">${escapeHtml(f.jawaban)}</td>
                      <td class="text-end table-actions">
                        <button type="button" class="btn btn-soft btn-sm text-danger btn-delete-faq" data-id="${f.id}"><i class="fa-solid fa-trash"></i></button>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div class="modal fade" id="modalBlogAdmin" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header"><h5 class="modal-title">Form Artikel Blog</h5><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div>
            <form id="adminBlogForm">
              <input type="hidden" name="id" id="blogId" value="">
              <div class="modal-body">
                <div class="row g-3">
                  <div class="col-md-8"><label class="form-label">Judul Artikel *</label><input type="text" name="judul" id="blogJudul" class="form-control" required></div>
                  <div class="col-md-4"><label class="form-label">Penulis</label><input type="text" name="penulis" id="blogPenulis" class="form-control" value="Tim Bimbel Indonesia"></div>
                  <div class="col-12"><label class="form-label">Ringkasan Singkat *</label><textarea name="ringkasan" id="blogRingkasan" class="form-control" rows="2" required></textarea></div>
                  <div class="col-12"><label class="form-label">Isi Artikel (HTML / Paragraf) *</label><textarea name="konten" id="blogKonten" class="form-control" rows="5" required></textarea></div>
                  <div class="col-md-6"><label class="form-label">Gambar Sampul (Opsional)</label><input type="file" id="blogThumbFile" class="form-control" accept="image/*"></div>
                  <div class="col-md-6"><label class="form-label">Status</label><select name="status" id="blogStatus" class="form-select"><option value="publish">Publish</option><option value="draft">Draft</option></select></div>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-soft rounded-pill" data-bs-dismiss="modal">Batal</button>
                <button type="submit" class="btn btn-brand rounded-pill px-4">Simpan Artikel</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div class="modal fade" id="modalTestiAdmin" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header"><h5 class="modal-title">Form Testimoni Siswa</h5><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div>
            <form id="adminTestiForm">
              <input type="hidden" name="id" id="testiId" value="">
              <div class="modal-body">
                <div class="row g-3">
                  <div class="col-md-6"><label class="form-label">Nama Siswa *</label><input type="text" name="nama" id="testiNama" class="form-control" required></div>
                  <div class="col-md-6"><label class="form-label">Kelas / Sekolah *</label><input type="text" name="info" id="testiInfo" class="form-control" placeholder="Siswa Kelas 12" required></div>
                  <div class="col-12"><label class="form-label">Isi Testimoni *</label><textarea name="pesan" id="testiPesan" class="form-control" rows="3" required></textarea></div>
                  <div class="col-md-6"><label class="form-label">Rating Bintang</label><select name="rating" id="testiRating" class="form-select"><option value="5">5 Bintang</option><option value="4">4 Bintang</option></select></div>
                  <div class="col-md-6"><label class="form-label">Status</label><select name="status" id="testiStatus" class="form-select"><option value="aktif">Aktif</option><option value="nonaktif">Nonaktif</option></select></div>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-soft rounded-pill" data-bs-dismiss="modal">Batal</button>
                <button type="submit" class="btn btn-brand rounded-pill px-4">Simpan Testimoni</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div class="modal fade" id="modalCouponAdmin" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header"><h5 class="modal-title">Form Kupon Diskon</h5><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div>
            <form id="adminCouponForm">
              <input type="hidden" name="id" id="couponId" value="">
              <div class="modal-body">
                <div class="row g-3">
                  <div class="col-md-6"><label class="form-label">Kode Kupon *</label><input type="text" name="kode" id="couponKode" class="form-control text-uppercase" placeholder="HEMAT50K" required></div>
                  <div class="col-md-6"><label class="form-label">Tipe Diskon</label><select name="tipe" id="couponTipe" class="form-select"><option value="nominal">Nominal (Rp)</option><option value="persen">Persentase (%)</option></select></div>
                  <div class="col-md-6"><label class="form-label">Nilai Diskon *</label><input type="number" name="nilai" id="couponNilai" class="form-control" value="50000" required></div>
                  <div class="col-md-6"><label class="form-label">Kuota</label><input type="number" name="kuota" id="couponKuota" class="form-control" value="50" required></div>
                  <div class="col-md-6"><label class="form-label">Berlaku Sampai</label><input type="date" name="berlaku_sampai" id="couponExp" class="form-control" value="2026-12-31"></div>
                  <div class="col-md-6"><label class="form-label">Status</label><select name="status" id="couponStatus" class="form-select"><option value="aktif">Aktif</option><option value="nonaktif">Nonaktif</option></select></div>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-soft rounded-pill" data-bs-dismiss="modal">Batal</button>
                <button type="submit" class="btn btn-brand rounded-pill px-4">Simpan Kupon</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div class="modal fade" id="modalFaqAdmin" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header"><h5 class="modal-title">Tambah FAQ</h5><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div>
            <form id="adminFaqForm">
              <div class="modal-body">
                <div class="mb-3"><label class="form-label">Pertanyaan *</label><input type="text" name="pertanyaan" class="form-control" required></div>
                <div class="mb-0"><label class="form-label">Jawaban *</label><textarea name="jawaban" class="form-control" rows="3" required></textarea></div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-soft rounded-pill" data-bs-dismiss="modal">Batal</button>
                <button type="submit" class="btn btn-brand rounded-pill px-4">Simpan FAQ</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;

    return renderAdminShell('konten', 'Blog, Testimoni & Kupon', user, content);
  }

  function renderLaporan() {
    const user = ensureAdminUser();
    document.body.className = 'app-body admin-body';

    const paidPayments = S.state.payments.filter(p => p.status === 'lunas');
    const totalRevenue = paidPayments.reduce((s, p) => s + (Number(p.nominal) || 0), 0);
    const totalDiscount = paidPayments.reduce((s, p) => s + (Number(p.diskon) || 0), 0);
    const tutors = S.state.users.filter(u => u.role === 'tutor');

    const content = `
      <div class="page-heading">
        <div><h1>Laporan Pendapatan, Pendaftaran & Performa Tutor</h1><p>Analisis komprehensif keuangan, keterisian kelas, dan aktivitas mengajar tutor.</p></div>
        <button type="button" class="btn btn-soft rounded-pill" onclick="window.print()"><i class="fa-solid fa-print me-1"></i>Cetak / Simpan PDF</button>
      </div>

      <div class="row g-3 mb-4">
        <div class="col-sm-6 col-xl-3"><div class="stat-card"><div class="icon icon-green"><i class="fa-solid fa-sack-dollar"></i></div><div class="value mt-3" style="font-size:1.3rem">${S.formatRupiah(totalRevenue)}</div><div class="label">Total Pendapatan Bersih</div></div></div>
        <div class="col-sm-6 col-xl-3"><div class="stat-card"><div class="icon icon-blue"><i class="fa-solid fa-receipt"></i></div><div class="value mt-3">${paidPayments.length}</div><div class="label">Transaksi Lunas</div></div></div>
        <div class="col-sm-6 col-xl-3"><div class="stat-card"><div class="icon icon-purple"><i class="fa-solid fa-user-check"></i></div><div class="value mt-3">${S.state.enrollments.length}</div><div class="label">Total Enrollment Kelas</div></div></div>
        <div class="col-sm-6 col-xl-3"><div class="stat-card"><div class="icon icon-yellow"><i class="fa-solid fa-tags"></i></div><div class="value mt-3" style="font-size:1.3rem">${S.formatRupiah(totalDiscount)}</div><div class="label">Total Diskon Kupon</div></div></div>
      </div>

      <div class="card-soft p-3 p-md-4 mb-4">
        <h2 class="h6 mb-3">Laporan Performa Tutor & Rekap Honor</h2>
        <div class="table-responsive">
          <table class="table table-hover align-middle">
            <thead><tr><th>Nama Tutor</th><th>Spesialisasi</th><th>Kelas Diampu</th><th>Siswa Aktif</th><th>Pertemuan Selesai</th><th>Total Jam</th><th>Materi & Soal</th><th>Total Honor</th></tr></thead>
            <tbody>
              ${tutors.map(t => {
                const tClasses = S.state.classes.filter(c => Number(c.tutor_id) === Number(t.id));
                const tClassIds = tClasses.map(c => Number(c.id));
                const tEnrolls = S.state.enrollments.filter(e => tClassIds.includes(Number(e.class_id)) && e.status === 'aktif');
                const tDoneSched = S.state.schedules.filter(sc => (tClassIds.includes(Number(sc.class_id)) || Number(sc.tutor_id) === Number(t.id)) && sc.status === 'selesai');
                const hrs = tDoneSched.reduce((sum, sc) => sum + calcDurationHours(sc.jam_mulai, sc.jam_selesai), 0);
                const rate = Number(t.honor_per_jam) || 100000;
                const matCount = S.state.materials.filter(m => Number(m.tutor_id) === Number(t.id) || tClassIds.includes(Number(m.class_id))).length;
                const qCount = S.state.questions.filter(q => Number(q.tutor_id) === Number(t.id) || tClassIds.includes(Number(q.class_id))).length;
                return `
                <tr>
                  <td class="small fw-semibold">${escapeHtml(t.nama)}</td>
                  <td class="small text-muted">${escapeHtml(t.spesialisasi || '-')}</td>
                  <td class="small">${tClasses.length} kelas</td>
                  <td class="small">${tEnrolls.length} siswa</td>
                  <td class="small">${tDoneSched.length} sesi</td>
                  <td class="small">${hrs.toFixed(1)} jam</td>
                  <td class="small">${matCount} materi &middot; ${qCount} soal</td>
                  <td class="small fw-bold text-success">${S.formatRupiah(Math.round(hrs * rate))}</td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <div class="row g-4">
        <div class="col-lg-6">
          <div class="card-soft p-3 p-md-4 h-100">
            <h2 class="h6 mb-3">Laporan Pendaftaran / Enrollment per Kelas</h2>
            <div class="d-grid gap-3">
              ${S.state.classes.map(cls => {
                const cnt = S.state.enrollments.filter(e => Number(e.class_id) === Number(cls.id) && e.status === 'aktif').length;
                const pct = Math.min(100, Math.round((cnt / (Number(cls.kapasitas) || 20)) * 100));
                return `
                <div>
                  <div class="d-flex justify-content-between small mb-1">
                    <span class="fw-semibold">${escapeHtml(cls.nama)}</span>
                    <span class="text-muted">${cnt} / ${cls.kapasitas} siswa (${pct}%)</span>
                  </div>
                  <div class="progress"><div class="progress-bar bg-primary" style="width:${pct}%"></div></div>
                </div>`;
              }).join('')}
            </div>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="card-soft p-3 p-md-4 h-100">
            <h2 class="h6 mb-3">Rincian Pendapatan Lunas</h2>
            <div class="table-responsive">
              <table class="table table-sm align-middle">
                <thead><tr><th>Invoice</th><th>Siswa</th><th>Paket</th><th>Tanggal</th><th class="text-end">Nominal</th></tr></thead>
                <tbody>
                  ${paidPayments.map(p => {
                    const st = S.state.users.find(u => Number(u.id) === Number(p.siswa_id));
                    const pkg = S.state.packages.find(k => Number(k.id) === Number(p.package_id));
                    return `
                    <tr>
                      <td class="small fw-semibold">${escapeHtml(p.invoice)}</td>
                      <td class="small">${escapeHtml(st ? st.nama : '-')}</td>
                      <td class="small">${escapeHtml(pkg ? pkg.nama : '-')}</td>
                      <td class="small">${S.formatDateId(p.tanggal)}</td>
                      <td class="small fw-bold text-end">${S.formatRupiah(p.nominal)}</td>
                    </tr>`;
                  }).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    `;

    return renderAdminShell('laporan', 'Laporan & Performa', user, content);
  }

  function renderWhatsapp() {
    const user = ensureAdminUser();
    document.body.className = 'app-body admin-body';
    const recipients = S.state.users.filter(u => u.role === 'siswa' || u.role === 'tutor');

    const content = `
      <div class="page-heading">
        <div><h1>Pengiriman Pesan WhatsApp Manual</h1><p>Siapkan pesan WhatsApp dan pilih penerima untuk dikirim secara manual.</p></div>
      </div>

      <div class="row g-4">
        <div class="col-lg-5">
          <div class="card-soft p-3 p-md-4">
            <h2 class="h6 mb-3"><i class="fa-brands fa-whatsapp text-success me-2"></i>Siapkan Pesan</h2>
            <div class="mb-3">
              <label class="form-label">Template Cepat</label>
              <select id="waTemplateSelect" class="form-select">
                <option value="">-- Pilih Template Pesan --</option>
                <option value="Halo {nama}, kami dari Bimbel Indonesia mengingatkan jadwal kelas online minggu ini. Jangan lupa cek tautan meeting di dashboard ya!">Pengingat Jadwal Kelas</option>
                <option value="Halo {nama}, terima kasih telah memilih paket belajar di Bimbel Indonesia. Silakan unggah bukti pembayaran agar akses kelasmu segera aktif.">Pengingat Pembayaran Invoice</option>
                <option value="Halo {nama}, Try Out terbaru sudah tersedia di dashboard Bimbel Indonesia. Yuk kerjakan sekarang untuk mengukur progres belajarmu!">Pengumuman Try Out Baru</option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label">Isi Pesan WhatsApp *</label>
              <textarea id="waBroadcastMessage" class="form-control" rows="6">Halo {nama}, semoga harimu menyenangkan! Jangan lupa cek jadwal dan materi terbaru di dashboard Bimbel Indonesia ya.</textarea>
              <div class="form-text">Gunakan variabel <code>{nama}</code> atau <code>{email}</code> untuk menyapa penerima secara otomatis.</div>
            </div>
          </div>
        </div>

        <div class="col-lg-7">
          <div class="card-soft p-3 p-md-4 mb-4">
            <h2 class="h6 mb-3">Pilih Penerima & Kirim Manual</h2>
            <div class="table-responsive">
              <table class="table table-hover align-middle">
                <thead><tr><th>Nama Penerima</th><th>Role</th><th>No. WhatsApp</th><th class="text-end">Kirim Manual</th></tr></thead>
                <tbody>
                  ${recipients.map(r => `
                    <tr>
                      <td>
                        <div class="small fw-semibold">${escapeHtml(r.nama)}</div>
                        <div class="text-muted" style="font-size:.7rem">${escapeHtml(r.email)}</div>
                      </td>
                      <td><span class="badge ${r.role === 'tutor' ? 'bg-info text-dark' : 'bg-primary'} text-capitalize">${escapeHtml(r.role)}</span></td>
                      <td class="small font-monospace">${escapeHtml(r.no_hp || '-')}</td>
                      <td class="text-end">
                        <button type="button" class="btn btn-success btn-sm rounded-pill btn-send-wa-row"
                          data-nama="${escapeHtml(r.nama)}" data-email="${escapeHtml(r.email)}" data-phone="${escapeHtml(r.no_hp || '')}">
                          <i class="fa-brands fa-whatsapp me-1"></i>Siapkan & Kirim
                        </button>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

          <div class="card-soft p-3 p-md-4">
            <h2 class="h6 mb-3">Riwayat Pesan WhatsApp</h2>
            <div class="table-responsive">
              <table class="table table-sm align-middle mb-0">
                <thead><tr><th>Penerima</th><th>No. HP</th><th>Pesan</th><th>Waktu</th></tr></thead>
                <tbody>
                  ${S.state.waLogs.map(log => `
                    <tr>
                      <td class="small fw-semibold">${escapeHtml(log.penerima_nama)}</td>
                      <td class="small">${escapeHtml(log.no_hp)}</td>
                      <td class="small text-muted">${escapeHtml(log.pesan)}</td>
                      <td class="small text-muted">${escapeHtml(log.tanggal)}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    `;

    return renderAdminShell('whatsapp', 'Pesan WhatsApp', user, content);
  }

  function renderPengaturan(params) {
    const user = ensureAdminUser();
    document.body.className = 'app-body admin-body';
    const activeTab = params.get('tab') || 'identitas';
    const st = S.state.settings;

    const tabs = [
      { id: 'identitas', icon: 'fa-globe', label: 'Identitas Website' },
      { id: 'kontak', icon: 'fa-address-book', label: 'Kontak & Sosial' },
      { id: 'pembayaran', icon: 'fa-credit-card', label: 'Metode Pembayaran' },
      { id: 'tampilan', icon: 'fa-wand-magic-sparkles', label: 'CTA & Beranda' },
      { id: 'sistem', icon: 'fa-gears', label: 'Preferensi Sistem' }
    ];

    const content = `
      <div class="page-heading">
        <div><h1>Pengaturan Website & Sistem</h1><p>Atur identitas website, kontak, metode pembayaran manual (rekening, e-wallet, QR), dan preferensi sistem.</p></div>
      </div>

      <ul class="nav settings-tabs mb-4" role="tablist">
        ${tabs.map(t => `
          <li class="nav-item" role="presentation">
            <button class="nav-link ${activeTab === t.id ? 'active' : ''}" data-bs-toggle="tab" data-bs-target="#setTab_${t.id}" type="button">
              <span class="settings-tab-icon"><i class="fa-solid ${t.icon}"></i></span>
              <span class="settings-tab-label">${t.label}</span>
              <i class="fa-solid fa-chevron-right settings-tab-arrow"></i>
            </button>
          </li>
        `).join('')}
      </ul>

      <div class="tab-content">
        <div class="tab-pane fade ${activeTab === 'identitas' ? 'show active' : ''}" id="setTab_identitas">
          <div class="card-soft p-3 p-md-4">
            <h2 class="h6 mb-3">Identitas Website</h2>
            <form id="adminSettingsIdentityForm">
              <div class="row g-3">
                <div class="col-md-6"><label class="form-label">Nama Website *</label><input type="text" name="site_name" class="form-control" value="${escapeHtml(st.site_name)}" required></div>
                <div class="col-md-6"><label class="form-label">Tagline Singkat *</label><input type="text" name="site_tagline" class="form-control" value="${escapeHtml(st.site_tagline)}" required></div>
                <div class="col-12"><label class="form-label">Deskripsi SEO</label><textarea name="site_description" class="form-control" rows="3">${escapeHtml(st.site_description)}</textarea></div>
                <div class="col-12"><label class="form-label">Kata Kunci (Keywords)</label><input type="text" name="site_keywords" class="form-control" value="${escapeHtml(st.site_keywords)}"></div>
              </div>
              <button type="submit" class="btn btn-brand rounded-pill px-4 mt-3"><i class="fa-solid fa-floppy-disk me-1"></i>Simpan Identitas</button>
            </form>
          </div>
        </div>

        <div class="tab-pane fade ${activeTab === 'kontak' ? 'show active' : ''}" id="setTab_kontak">
          <div class="card-soft p-3 p-md-4">
            <h2 class="h6 mb-3">Kontak & Sosial Media</h2>
            <form id="adminSettingsContactForm">
              <div class="row g-3">
                <div class="col-md-6"><label class="form-label">Email Resmi</label><input type="email" name="email" class="form-control" value="${escapeHtml(st.email)}"></div>
                <div class="col-md-6"><label class="form-label">Nomor Telepon / WhatsApp</label><input type="text" name="phone" class="form-control" value="${escapeHtml(st.phone)}"></div>
                <div class="col-12"><label class="form-label">Alamat Lengkap</label><input type="text" name="address" class="form-control" value="${escapeHtml(st.address)}"></div>
                <div class="col-md-4"><label class="form-label">Link Instagram</label><input type="url" name="instagram" class="form-control" value="${escapeHtml(st.instagram)}"></div>
                <div class="col-md-4"><label class="form-label">Link YouTube</label><input type="url" name="youtube" class="form-control" value="${escapeHtml(st.youtube)}"></div>
                <div class="col-md-4"><label class="form-label">Link WhatsApp</label><input type="url" name="whatsapp" class="form-control" value="${escapeHtml(st.whatsapp)}"></div>
              </div>
              <button type="submit" class="btn btn-brand rounded-pill px-4 mt-3"><i class="fa-solid fa-floppy-disk me-1"></i>Simpan Kontak</button>
            </form>
          </div>
        </div>

        <div class="tab-pane fade ${activeTab === 'pembayaran' ? 'show active' : ''}" id="setTab_pembayaran">
          <div class="card-soft payment-methods-panel">
            <div class="payment-methods-heading">
              <div class="d-flex align-items-center gap-3">
                <div class="payment-heading-icon"><i class="fa-solid fa-building-columns"></i></div>
                <div>
                  <h2 class="h5 mb-1">Metode Pembayaran Manual</h2>
                  <p class="small text-muted mb-0">Kelola daftar rekening bank, e-wallet, dan kode QRIS yang tampil saat siswa membayar invoice.</p>
                </div>
              </div>
              <button type="button" class="btn btn-brand rounded-pill" id="btnAddPaymentMethod"><i class="fa-solid fa-plus me-1"></i>Tambah Metode</button>
            </div>

            <div class="payment-info-note">
              <i class="fa-solid fa-circle-info"></i>
              <span>Semua metode berstatus <strong>Aktif</strong> akan otomatis ditampilkan kepada siswa pada halaman detail invoice dan instruksi transfer.</span>
            </div>

            <div class="payment-methods-list">
              ${S.state.paymentMethods.map((m, idx) => `
                <div class="payment-method-row">
                  <div class="payment-method-row-heading">
                    <div class="d-flex align-items-center gap-2">
                      <span class="payment-row-icon"><i class="fa-solid ${m.tipe === 'qris' ? 'fa-qrcode' : (m.tipe === 'ewallet' ? 'fa-wallet' : 'fa-building-columns')}"></i></span>
                      <strong>Metode #${idx + 1}: ${escapeHtml(m.nama)}</strong>
                      <span class="badge rounded-pill ${m.status === 'aktif' ? 'bg-success' : 'bg-secondary'}">${m.status}</span>
                    </div>
                    <div class="d-flex gap-2">
                      <button type="button" class="btn btn-soft btn-sm rounded-pill btn-edit-paymethod" data-id="${m.id}"><i class="fa-solid fa-pen me-1"></i>Edit</button>
                      <button type="button" class="btn btn-soft btn-sm text-danger rounded-pill btn-delete-paymethod" data-id="${m.id}"><i class="fa-solid fa-trash"></i></button>
                    </div>
                  </div>
                  <div class="row g-3 small">
                    <div class="col-md-3"><span class="text-muted d-block">Tipe</span><strong>${m.tipe === 'qris' ? 'QRIS' : (m.tipe === 'ewallet' ? 'E-Wallet' : 'Transfer Bank')}</strong></div>
                    <div class="col-md-3"><span class="text-muted d-block">Nomor Rekening / ID</span><strong class="font-monospace">${escapeHtml(m.nomor)}</strong></div>
                    <div class="col-md-3"><span class="text-muted d-block">Atas Nama</span><strong>${escapeHtml(m.atas_nama)}</strong></div>
                    <div class="col-md-3"><span class="text-muted d-block">Catatan</span><span>${escapeHtml(m.catatan || '-')}</span></div>
                  </div>
                  ${m.qr_image ? `<div class="payment-qr-current mt-2"><i class="fa-solid fa-circle-check"></i><span>Gambar QRIS tersimpan</span></div>` : ''}
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <div class="tab-pane fade ${activeTab === 'tampilan' ? 'show active' : ''}" id="setTab_tampilan">
          <div class="card-soft p-3 p-md-4">
            <h2 class="h6 mb-3">Pengaturan Call-To-Action (CTA) Halaman Depan</h2>
            <form id="adminSettingsCtaForm">
              <div class="row g-3">
                <div class="col-12"><label class="form-label">Judul CTA</label><input type="text" name="cta_title" class="form-control" value="${escapeHtml(st.cta_title || '')}"></div>
                <div class="col-12"><label class="form-label">Subjudul CTA</label><textarea name="cta_subtitle" class="form-control" rows="2">${escapeHtml(st.cta_subtitle || '')}</textarea></div>
              </div>
              <button type="submit" class="btn btn-brand rounded-pill px-4 mt-3"><i class="fa-solid fa-floppy-disk me-1"></i>Simpan Tampilan</button>
            </form>
          </div>
        </div>

        <div class="tab-pane fade ${activeTab === 'sistem' ? 'show active' : ''}" id="setTab_sistem">
          <div class="card-soft p-3 p-md-4">
            <h2 class="h6 mb-3">Preferensi Sistem</h2>
            <form id="adminSettingsSystemForm">
              <div class="row g-3">
                <div class="col-md-6"><label class="form-label">Tarif Honor Tutor Default per Jam (Rp)</label><input type="number" name="default_tutor_rate" class="form-control" value="${Number(st.default_tutor_rate) || 100000}"></div>
                <div class="col-md-6"><label class="form-label">Batas Ukuran Upload File (MB)</label><input type="number" name="max_upload_mb" class="form-control" value="${Number(st.max_upload_mb) || 5}"></div>
              </div>
              <div class="d-flex flex-wrap gap-2 mt-4">
                <button type="submit" class="btn btn-brand rounded-pill px-4"><i class="fa-solid fa-floppy-disk me-1"></i>Simpan Preferensi</button>
                <button type="button" class="btn btn-outline-danger rounded-pill px-4 ms-auto" id="btnResetDemoData"><i class="fa-solid fa-rotate-left me-1"></i>Reset Data ke Default Awal</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div class="modal fade" id="modalPayMethodAdmin" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header"><h5 class="modal-title">Form Metode Pembayaran Manual</h5><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div>
            <form id="adminPayMethodForm">
              <input type="hidden" name="id" id="pmId" value="">
              <div class="modal-body">
                <div class="row g-3">
                  <div class="col-md-6"><label class="form-label">Nama Bank / E-Wallet / QRIS *</label><input type="text" name="nama" id="pmNama" class="form-control" placeholder="BCA / Mandiri / QRIS" required></div>
                  <div class="col-md-6">
                    <label class="form-label">Tipe Metode</label>
                    <select name="tipe" id="pmTipe" class="form-select">
                      <option value="bank_transfer">Transfer Bank</option>
                      <option value="ewallet">E-Wallet</option>
                      <option value="qris">QRIS (Kode QR)</option>
                    </select>
                  </div>
                  <div class="col-md-6"><label class="form-label">Nomor Rekening / No. Tujuan *</label><input type="text" name="nomor" id="pmNomor" class="form-control" required></div>
                  <div class="col-md-6"><label class="form-label">Atas Nama *</label><input type="text" name="atas_nama" id="pmAtasNama" class="form-control" required></div>
                  <div class="col-12"><label class="form-label">Catatan / Instruksi</label><input type="text" name="catatan" id="pmCatatan" class="form-control" placeholder="Cantumkan nomor invoice pada berita transfer"></div>
                  <div class="col-md-8"><label class="form-label">Unggah Gambar Kode QR (Khusus QRIS)</label><input type="file" id="pmQrFile" class="form-control" accept="image/*"></div>
                  <div class="col-md-4"><label class="form-label">Status</label><select name="status" id="pmStatus" class="form-select"><option value="aktif">Aktif</option><option value="nonaktif">Nonaktif</option></select></div>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-soft rounded-pill" data-bs-dismiss="modal">Batal</button>
                <button type="submit" class="btn btn-brand rounded-pill px-4">Simpan Metode</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;

    return renderAdminShell('pengaturan', 'Pengaturan Website', user, content);
  }

  window.BimbelAdminViews = {
    renderDashboard,
    renderPengguna,
    renderProgram,
    renderKelas,
    renderMateriSoal,
    renderPembayaran,
    renderBanner,
    renderKonten,
    renderLaporan,
    renderWhatsapp,
    renderPengaturan
  };
})(window);
