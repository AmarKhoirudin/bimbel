/* ==========================================================================
   Bimbel Indonesia - Panel Tutor Views
   ========================================================================== */
(function (window) {
  'use strict';

  const S = window.BimbelStore;
  const escapeHtml = window.BimbelPublicViews.escapeHtml;

  function ensureTutorUser() {
    let user = S.getCurrentUser();
    if (!user || user.role !== 'tutor') {
      user = S.state.users.find(u => u.role === 'tutor') || S.state.users[1];
      if (user) S.setCurrentUser(user.id);
    }
    return user;
  }

  function calcDurationHours(mulai, selesai) {
    if (!mulai || !selesai) return 1.5;
    const [h1, m1] = String(mulai).split(':').map(Number);
    const [h2, m2] = String(selesai).split(':').map(Number);
    const diff = (h2 * 60 + (m2 || 0)) - (h1 * 60 + (m1 || 0));
    return diff > 0 ? +(diff / 60).toFixed(2) : 1.5;
  }

  function renderTutorShell(activeMenu, title, user, contentHtml) {
    const st = S.state.settings;
    const menus = [
      { id: 'dashboard', href: '#/tutor/dashboard', icon: 'fa-table-columns', label: 'Dashboard' },
      { id: 'jadwal', href: '#/tutor/jadwal', icon: 'fa-calendar-days', label: 'Jadwal Saya' },
      { id: 'siswa', href: '#/tutor/siswa', icon: 'fa-user-group', label: 'Siswa Saya' },
      { id: 'materi', href: '#/tutor/materi', icon: 'fa-book-open', label: 'Materi' },
      { id: 'soal', href: '#/tutor/soal', icon: 'fa-circle-question', label: 'Soal' },
      { id: 'nilai', href: '#/tutor/nilai', icon: 'fa-clipboard-check', label: 'Nilai' },
      { id: 'honor', href: '#/tutor/honor', icon: 'fa-wallet', label: 'Honor' },
      { id: 'profil', href: '#/tutor/profil', icon: 'fa-user', label: 'Profil' }
    ];

    return `
    <div class="app-shell">
      <aside class="app-sidebar">
        <div class="sidebar-brand">
          <span class="brand-icon"><i class="fa-solid fa-chalkboard-user"></i></span>
          <div>
            <div class="name">${escapeHtml(st.site_name)}</div>
            <div class="role">Panel Tutor</div>
          </div>
        </div>
        <div class="sidebar-scroll">
          <div class="sidebar-label">Menu Tutor</div>
          <ul class="sidebar-nav">
            ${menus.map(m => `
              <li>
                <a href="${m.href}" class="${activeMenu === m.id ? 'active' : ''}">
                  <i class="fa-solid ${m.icon}"></i><span>${m.label}</span>
                </a>
              </li>
            `).join('')}
          </ul>
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
            <div class="role">Tutor</div>
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
            <span class="badge py-2 px-3 d-none d-md-inline-flex align-items-center gap-2" style="background:#ccfbf1;color:#0f766e">
              <i class="fa-solid fa-chalkboard-user"></i> Tutor
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
                <li><a class="dropdown-item" href="#/tutor/profil"><i class="fa-solid fa-user me-2"></i>Profil Saya</a></li>
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
          <span>Panel Tutor v1.0.0</span>
        </footer>
      </div>
    </div>`;
  }

  function getTutorClasses(tutorId) {
    return S.state.classes.filter(c => Number(c.tutor_id) === Number(tutorId));
  }

  function renderDashboard() {
    const user = ensureTutorUser();
    document.body.className = 'app-body tutor-body';
    const firstName = (user.nama || 'Tutor').split(' ')[0];

    const myClasses = getTutorClasses(user.id);
    const myClassIds = myClasses.map(c => Number(c.id));
    const myEnrollments = S.state.enrollments.filter(e => myClassIds.includes(Number(e.class_id)) && e.status === 'aktif');
    const uniqueStudentIds = [...new Set(myEnrollments.map(e => Number(e.siswa_id)))];

    const mySchedules = S.state.schedules.filter(sc => myClassIds.includes(Number(sc.class_id)));
    const finishedSchedules = mySchedules.filter(sc => sc.status === 'selesai');
    const upcomingSchedules = mySchedules
      .filter(sc => sc.status === 'terjadwal')
      .sort((a, b) => String(a.tanggal).localeCompare(String(b.tanggal)));

    const rate = Number(user.honor_per_jam) || Number(S.state.settings.default_tutor_rate) || 100000;
    const totalHours = finishedSchedules.reduce((sum, sc) => sum + calcDurationHours(sc.jam_mulai, sc.jam_selesai), 0);
    const estHonor = Math.round(totalHours * rate);

    const myMaterials = S.state.materials.filter(m => myClassIds.includes(Number(m.class_id)));
    const myQuestions = S.state.questions.filter(q => myClassIds.includes(Number(q.class_id)) || Number(q.tutor_id) === Number(user.id));

    const content = `
      <div class="page-heading">
        <div><h1>Selamat pagi, ${escapeHtml(firstName)}!</h1><p>Berikut ringkasan aktivitas mengajar Anda.</p></div>
        <a href="#/tutor/jadwal" class="btn btn-brand rounded-pill"><i class="fa-solid fa-calendar-plus me-1"></i>Kelola Jadwal</a>
      </div>

      <div class="row g-3 mb-4">
        <div class="col-sm-6 col-xl-3"><div class="stat-card"><div class="icon icon-blue"><i class="fa-solid fa-chalkboard-user"></i></div><div class="value mt-3">${myClasses.length}</div><div class="label">Kelas Diampu</div></div></div>
        <div class="col-sm-6 col-xl-3"><div class="stat-card"><div class="icon icon-blue"><i class="fa-solid fa-user-group"></i></div><div class="value mt-3">${uniqueStudentIds.length}</div><div class="label">Siswa Aktif</div></div></div>
        <div class="col-sm-6 col-xl-3"><div class="stat-card"><div class="icon icon-green"><i class="fa-solid fa-circle-check"></i></div><div class="value mt-3">${finishedSchedules.length}</div><div class="label">Pertemuan Selesai</div></div></div>
        <div class="col-sm-6 col-xl-3"><div class="stat-card"><div class="icon icon-yellow"><i class="fa-solid fa-wallet"></i></div><div class="value mt-3" style="font-size:1.15rem">${S.formatRupiah(estHonor)}</div><div class="label">Estimasi Honor</div></div></div>
      </div>

      <div class="row g-4">
        <div class="col-lg-7">
          <div class="card-soft p-3 p-md-4 h-100">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h2 class="h6 mb-0">Jadwal Terdekat</h2>
              <a href="#/tutor/jadwal" class="small text-decoration-none text-brand fw-semibold">Semua jadwal <i class="fa-solid fa-arrow-right ms-1"></i></a>
            </div>
            ${upcomingSchedules.length === 0 ? `
              <div class="empty-state py-4"><i class="fa-solid fa-calendar-xmark"></i><p class="mb-0">Belum ada jadwal terdekat.</p></div>
            ` : `
              <div class="d-grid gap-2">
                ${upcomingSchedules.map(sc => {
                  const cls = S.state.classes.find(c => Number(c.id) === Number(sc.class_id));
                  return `
                  <div class="schedule-card d-flex flex-wrap align-items-center justify-content-between gap-2">
                    <div>
                      <div class="small fw-semibold">${escapeHtml(sc.topik)}</div>
                      <div class="text-muted" style="font-size:.75rem">${escapeHtml(cls ? cls.nama : '')} &middot; ${S.formatDateId(sc.tanggal, true)} &middot; ${escapeHtml(sc.jam_mulai)}–${escapeHtml(sc.jam_selesai)} WIB</div>
                    </div>
                    <div class="d-flex gap-2">
                      <a href="#/tutor/absensi?schedule_id=${sc.id}" class="btn btn-soft btn-sm rounded-pill"><i class="fa-solid fa-clipboard-user me-1"></i>Absensi</a>
                      <a href="${escapeHtml(sc.meeting_link || 'https://meet.google.com')}" target="_blank" class="btn btn-brand btn-sm rounded-pill"><i class="fa-solid fa-video me-1"></i>Meeting</a>
                    </div>
                  </div>`;
                }).join('')}
              </div>
            `}
          </div>
        </div>
        <div class="col-lg-5">
          <div class="card-soft p-3 p-md-4 h-100">
            <h2 class="h6 mb-3">Kelas Saya</h2>
            ${myClasses.map(cls => {
              const count = S.state.enrollments.filter(e => Number(e.class_id) === Number(cls.id) && e.status === 'aktif').length;
              return `
              <div class="d-flex align-items-center gap-2 py-2 border-bottom">
                <div class="icon icon-blue" style="width:38px;height:38px;border-radius:10px;font-size:.85rem;display:grid;place-items:center;background:#ccfbf1;color:#0d9488"><i class="fa-solid fa-chalkboard"></i></div>
                <div class="flex-grow-1 overflow-hidden">
                  <div class="small fw-semibold text-truncate">${escapeHtml(cls.nama)}</div>
                  <div class="text-muted" style="font-size:.7rem">${count} siswa &middot; ${escapeHtml(cls.jenjang || 'SMP')}</div>
                </div>
                <a href="#/tutor/siswa?class_id=${cls.id}" class="btn btn-soft btn-sm rounded-circle"><i class="fa-solid fa-arrow-right"></i></a>
              </div>`;
            }).join('')}
          </div>
        </div>
      </div>

      <div class="row g-4 mt-1">
        <div class="col-md-6"><div class="card-soft p-3 p-md-4 d-flex align-items-center gap-3"><div class="icon icon-blue" style="width:48px;height:48px;border-radius:14px;display:grid;place-items:center;background:#ccfbf1;color:#0d9488"><i class="fa-solid fa-book-open"></i></div><div><div class="fw-semibold">${myMaterials.length} Materi</div><div class="small text-muted">Unggah materi untuk siswa Anda.</div></div><a href="#/tutor/materi" class="btn btn-soft btn-sm rounded-pill ms-auto">Kelola</a></div></div>
        <div class="col-md-6"><div class="card-soft p-3 p-md-4 d-flex align-items-center gap-3"><div class="icon icon-purple" style="width:48px;height:48px;border-radius:14px;display:grid;place-items:center;background:#f5f3ff;color:#7c3aed"><i class="fa-solid fa-circle-question"></i></div><div><div class="fw-semibold">${myQuestions.length} Soal</div><div class="small text-muted">Tambah soal ke bank soal.</div></div><a href="#/tutor/soal" class="btn btn-soft btn-sm rounded-pill ms-auto">Kelola</a></div></div>
      </div>
    `;

    return renderTutorShell('dashboard', 'Dashboard Tutor', user, content);
  }

  function renderJadwal() {
    const user = ensureTutorUser();
    document.body.className = 'app-body tutor-body';
    const myClasses = getTutorClasses(user.id);
    const myClassIds = myClasses.map(c => Number(c.id));
    const mySchedules = S.state.schedules
      .filter(sc => myClassIds.includes(Number(sc.class_id)) || Number(sc.tutor_id) === Number(user.id))
      .sort((a, b) => String(b.tanggal).localeCompare(String(a.tanggal)));

    const content = `
      <div class="page-heading">
        <div><h1>Jadwal Saya</h1><p>Atur pertemuan, tautan kelas online, dan status pertemuan.</p></div>
        <button type="button" class="btn btn-brand rounded-pill" id="btnAddJadwalTutor"><i class="fa-solid fa-calendar-plus me-1"></i>Tambah Jadwal</button>
      </div>

      <div class="card-soft p-3 p-md-4">
        <div class="table-responsive">
          <table class="table table-hover datatable align-middle">
            <thead><tr><th>Tanggal</th><th>Jam</th><th>Kelas</th><th>Topik</th><th>Hadir</th><th>Status</th><th class="text-end">Aksi</th></tr></thead>
            <tbody>
              ${mySchedules.map(sc => {
                const cls = S.state.classes.find(c => Number(c.id) === Number(sc.class_id));
                const hadirCount = S.state.attendance.filter(a => Number(a.schedule_id) === Number(sc.id) && a.status === 'hadir').length;
                const badge = sc.status === 'selesai'
                  ? '<span class="badge rounded-pill bg-success">Selesai</span>'
                  : (sc.status === 'batal' ? '<span class="badge rounded-pill bg-danger">Batal</span>' : '<span class="badge rounded-pill bg-primary">Terjadwal</span>');
                return `
                <tr>
                  <td class="small">${S.formatDateId(sc.tanggal, true)}</td>
                  <td class="small">${escapeHtml(sc.jam_mulai)}–${escapeHtml(sc.jam_selesai)}</td>
                  <td class="small fw-semibold">${escapeHtml(cls ? cls.nama : '-')}</td>
                  <td class="small">${escapeHtml(sc.topik)}</td>
                  <td class="small">${hadirCount} siswa</td>
                  <td>${badge}</td>
                  <td class="text-end table-actions">
                    <a href="#/tutor/absensi?schedule_id=${sc.id}" class="btn btn-soft btn-sm" title="Catat Absensi"><i class="fa-solid fa-clipboard-user"></i></a>
                    <a href="${escapeHtml(sc.meeting_link || 'https://meet.google.com')}" target="_blank" class="btn btn-soft btn-sm" title="Buka Meeting"><i class="fa-solid fa-video"></i></a>
                    ${sc.status !== 'selesai' ? `
                      <button type="button" class="btn btn-soft btn-sm text-success btn-finish-jadwal" data-id="${sc.id}" title="Tandai Selesai"><i class="fa-solid fa-check"></i></button>
                    ` : ''}
                    <button type="button" class="btn btn-soft btn-sm btn-edit-jadwal"
                      data-id="${sc.id}" data-class="${sc.class_id}" data-tanggal="${escapeHtml(sc.tanggal)}"
                      data-mulai="${escapeHtml(sc.jam_mulai)}" data-selesai="${escapeHtml(sc.jam_selesai)}"
                      data-topik="${escapeHtml(sc.topik)}" data-link="${escapeHtml(sc.meeting_link || '')}"
                      data-status="${escapeHtml(sc.status)}" title="Edit"><i class="fa-solid fa-pen"></i></button>
                    <button type="button" class="btn btn-soft btn-sm text-danger btn-delete-jadwal" data-id="${sc.id}" title="Hapus"><i class="fa-solid fa-trash"></i></button>
                  </td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <div class="modal fade" id="modalJadwal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header"><h5 class="modal-title"><i class="fa-solid fa-calendar-plus me-2 text-brand"></i>Form Jadwal Pertemuan</h5><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div>
            <form id="tutorJadwalForm">
              <input type="hidden" name="id" id="jadwalId" value="">
              <div class="modal-body">
                <div class="row g-3">
                  <div class="col-md-6">
                    <label class="form-label">Kelas *</label>
                    <select name="class_id" id="jadwalKelas" class="form-select" required>
                      <option value="">Pilih kelas</option>
                      ${myClasses.map(c => `<option value="${c.id}">${escapeHtml(c.nama)}</option>`).join('')}
                    </select>
                  </div>
                  <div class="col-md-6"><label class="form-label">Tanggal *</label><input type="date" name="tanggal" id="jadwalTanggal" class="form-control" value="2026-11-20" required></div>
                  <div class="col-md-6"><label class="form-label">Jam Mulai</label><input type="time" name="jam_mulai" id="jadwalMulai" class="form-control" value="16:00" required></div>
                  <div class="col-md-6"><label class="form-label">Jam Selesai</label><input type="time" name="jam_selesai" id="jadwalSelesai" class="form-control" value="17:30" required></div>
                  <div class="col-12"><label class="form-label">Topik Pertemuan *</label><input type="text" name="topik" id="jadwalTopik" class="form-control" placeholder="Contoh: Persamaan Kuadrat & Diskriminan" required></div>
                  <div class="col-12"><label class="form-label">Meeting Link</label><input type="url" name="meeting_link" id="jadwalLink" class="form-control" placeholder="https://meet.google.com/..."></div>
                  <div class="col-md-6">
                    <label class="form-label">Status</label>
                    <select name="status" id="jadwalStatus" class="form-select">
                      <option value="terjadwal">Terjadwal</option>
                      <option value="selesai">Selesai</option>
                      <option value="batal">Batal</option>
                    </select>
                  </div>
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

    return renderTutorShell('jadwal', 'Jadwal Saya', user, content);
  }

  function renderAbsensi(params) {
    const user = ensureTutorUser();
    document.body.className = 'app-body tutor-body';
    const scheduleId = Number(params.get('schedule_id')) || 6;
    const sc = S.state.schedules.find(s => Number(s.id) === scheduleId) || S.state.schedules[0];
    const cls = sc ? S.state.classes.find(c => Number(c.id) === Number(sc.class_id)) : null;

    const enrolls = cls ? S.state.enrollments.filter(e => Number(e.class_id) === Number(cls.id) && e.status === 'aktif') : [];
    const students = enrolls.map(e => S.state.users.find(u => Number(u.id) === Number(e.siswa_id))).filter(Boolean);

    const content = `
      <div class="page-heading">
        <div>
          <h1>Absensi Pertemuan</h1>
          <p>${escapeHtml(cls ? cls.nama : 'Kelas')} &middot; ${S.formatDateId(sc ? sc.tanggal : '', true)} &middot; ${escapeHtml(sc ? sc.jam_mulai : '')} WIB (${escapeHtml(sc ? sc.topik : '')})</p>
        </div>
        <a href="#/tutor/jadwal" class="btn btn-soft rounded-pill"><i class="fa-solid fa-arrow-left me-1"></i>Kembali</a>
      </div>

      <form id="tutorAbsensiForm" class="card-soft p-3 p-md-4">
        <input type="hidden" name="schedule_id" value="${sc ? sc.id : 0}">
        <div class="table-responsive">
          <table class="table align-middle">
            <thead><tr><th>Siswa</th><th>Kelas / Sekolah</th><th style="width:280px">Status Kehadiran</th><th>Catatan</th></tr></thead>
            <tbody>
              ${students.length === 0 ? `<tr><td colspan="4" class="text-center text-muted py-4">Belum ada siswa terdaftar di kelas ini.</td></tr>` : students.map(st => {
                const rec = S.state.attendance.find(a => Number(a.schedule_id) === Number(sc.id) && Number(a.siswa_id) === Number(st.id));
                const curStatus = rec ? rec.status : 'hadir';
                const curNote = rec ? rec.catatan : '';
                return `
                <tr data-siswa-row="${st.id}">
                  <td>
                    <div class="small fw-semibold">${escapeHtml(st.nama)}</div>
                    <div class="text-muted" style="font-size:.7rem">${escapeHtml(st.email)}</div>
                  </td>
                  <td class="small">${escapeHtml(st.kelas || '-')} &middot; ${escapeHtml(st.sekolah || '-')}</td>
                  <td>
                    <div class="btn-group btn-group-sm w-100" role="group">
                      ${['hadir', 'izin', 'sakit', 'alpa'].map(opt => `
                        <input type="radio" class="btn-check" name="status_${st.id}" id="status_${st.id}_${opt}" value="${opt}" ${curStatus === opt ? 'checked' : ''}>
                        <label class="btn btn-outline-secondary text-capitalize" for="status_${st.id}_${opt}">${opt}</label>
                      `).join('')}
                    </div>
                  </td>
                  <td>
                    <input type="text" name="catatan_${st.id}" class="form-control form-control-sm" value="${escapeHtml(curNote)}" placeholder="Catatan opsional">
                  </td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
        <div class="mt-3 d-flex gap-2">
          <button type="submit" class="btn btn-brand rounded-pill px-4"><i class="fa-solid fa-floppy-disk me-1"></i>Simpan Absensi</button>
          <a href="#/tutor/jadwal" class="btn btn-soft rounded-pill px-4">Kembali ke Jadwal</a>
        </div>
      </form>
    `;

    return renderTutorShell('jadwal', 'Absensi Pertemuan', user, content);
  }

  function renderSiswa(params) {
    const user = ensureTutorUser();
    document.body.className = 'app-body tutor-body';
    const myClasses = getTutorClasses(user.id);
    const myClassIds = myClasses.map(c => Number(c.id));
    const filterClassId = Number(params.get('class_id')) || 0;

    const enrolls = S.state.enrollments.filter(e => {
      if (e.status !== 'aktif') return false;
      if (filterClassId) return Number(e.class_id) === filterClassId;
      return myClassIds.includes(Number(e.class_id));
    });

    const rows = enrolls.map(e => {
      const st = S.state.users.find(u => Number(u.id) === Number(e.siswa_id));
      const cls = S.state.classes.find(c => Number(c.id) === Number(e.class_id));
      return st && cls ? { student: st, cls } : null;
    }).filter(Boolean);

    const content = `
      <div class="page-heading">
        <div><h1>Siswa Saya</h1><p>Daftar siswa aktif dari kelas yang Anda ampu.</p></div>
      </div>

      <div class="card-soft p-3 mb-4">
        <form id="tutorSiswaFilterForm" class="row g-2 align-items-end">
          <div class="col-md-5">
            <label class="form-label small mb-1">Filter Kelas</label>
            <select name="class_id" class="form-select">
              <option value="0">Semua kelas (${myClasses.length})</option>
              ${myClasses.map(c => `<option value="${c.id}" ${Number(c.id) === filterClassId ? 'selected' : ''}>${escapeHtml(c.nama)}</option>`).join('')}
            </select>
          </div>
          <div class="col-md-3"><button type="submit" class="btn btn-brand rounded-pill w-100">Terapkan</button></div>
          <div class="col-md-4 text-md-end"><span class="small text-muted">${rows.length} siswa ditemukan</span></div>
        </form>
      </div>

      <div class="card-soft p-3 p-md-4">
        <div class="table-responsive">
          <table class="table table-hover datatable align-middle">
            <thead><tr><th>Nama</th><th>Kontak</th><th>Kelas / Sekolah</th><th>Kelas Diampu</th><th>Status</th><th class="text-end">Aksi</th></tr></thead>
            <tbody>
              ${rows.map(({ student, cls }) => {
                const nextSched = S.state.schedules.find(s => Number(s.class_id) === Number(cls.id) && s.status === 'terjadwal');
                const waMsg = `Halo ${student.nama},\n\nBagaimana kabar belajarmu? Kami dari Bimbel Indonesia ingin mengingatkan jadwal kelas:\nKelas: ${cls.nama}\nTanggal: ${nextSched ? S.formatDateId(nextSched.tanggal, true) : '-'}\nJam: ${nextSched ? nextSched.jam_mulai + ' WIB' : '-'}\n\nJangan lupa hadir tepat waktu ya. Semangat!`;
                return `
                <tr>
                  <td>
                    <div class="d-flex align-items-center gap-2">
                      <img src="${escapeHtml(student.avatar || 'assets/img/avatar.svg')}" class="avatar-sm" alt="">
                      <div>
                        <div class="small fw-semibold">${escapeHtml(student.nama)}</div>
                        <div class="text-muted" style="font-size:.7rem">${escapeHtml(student.email)}</div>
                      </div>
                    </div>
                  </td>
                  <td class="small">${escapeHtml(student.no_hp || '-')}</td>
                  <td class="small">${escapeHtml(student.kelas || '-')}<div class="text-muted" style="font-size:.7rem">${escapeHtml(student.sekolah || '-')}</div></td>
                  <td><span class="chip chip-brand">${escapeHtml(cls.nama)}</span></td>
                  <td><span class="badge rounded-pill bg-success">Aktif</span></td>
                  <td class="text-end">
                    <button type="button" class="btn btn-soft btn-sm btn-kirim-wa"
                      data-wa-user-id="${student.id}"
                      data-wa-nama="${escapeHtml(student.nama)}"
                      data-wa-phone="${escapeHtml(student.no_hp || '')}"
                      data-wa-pesan="${escapeHtml(waMsg)}">
                      <i class="fa-brands fa-whatsapp text-success me-1"></i>WA
                    </button>
                  </td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    return renderTutorShell('siswa', 'Siswa Saya', user, content);
  }

  function renderMateri() {
    const user = ensureTutorUser();
    document.body.className = 'app-body tutor-body';
    const myClasses = getTutorClasses(user.id);
    const myClassIds = myClasses.map(c => Number(c.id));
    const myMaterials = S.state.materials.filter(m => myClassIds.includes(Number(m.class_id)) || Number(m.tutor_id) === Number(user.id));

    const content = `
      <div class="page-heading">
        <div><h1>Materi Kelas</h1><p>Bagikan file, tautan, atau video pembelajaran untuk siswa.</p></div>
        <button type="button" class="btn btn-brand rounded-pill" id="btnAddMateriTutor"><i class="fa-solid fa-upload me-1"></i>Tambah Materi</button>
      </div>

      <div class="row g-4">
        ${myMaterials.length === 0 ? `<div class="col-12"><div class="card-soft p-5"><div class="empty-state"><i class="fa-solid fa-book-open"></i><p class="mb-0">Belum ada materi yang diunggah.</p></div></div></div>` : myMaterials.map(m => {
          const cls = S.state.classes.find(c => Number(c.id) === Number(m.class_id));
          const ic = m.tipe === 'video' ? 'fa-circle-play' : (m.tipe === 'file' ? 'fa-file-pdf' : 'fa-link');
          const kindLabel = m.tipe === 'video' ? 'Video' : (m.tipe === 'file' ? 'File' : 'Link');
          return `
          <div class="col-md-6 col-xl-4">
            <div class="card-soft p-3 h-100 d-flex flex-column">
              <div class="d-flex justify-content-between align-items-start mb-2">
                <span class="icon icon-blue" style="width:42px;height:42px;border-radius:12px;display:grid;place-items:center;background:#ccfbf1;color:#0d9488"><i class="fa-solid ${ic}"></i></span>
                <span class="chip chip-brand">${kindLabel}</span>
              </div>
              <h2 class="h6 mb-1">${escapeHtml(m.judul)}</h2>
              <div class="text-muted small mb-1">${escapeHtml(cls ? cls.nama : 'Kelas')}</div>
              <p class="small text-muted flex-grow-1">${escapeHtml(m.deskripsi)}</p>
              <div class="d-flex gap-2 mt-2">
                <a href="${escapeHtml(m.url || '#')}" target="_blank" class="btn btn-soft btn-sm rounded-pill flex-grow-1" data-open-material="${m.id}"><i class="fa-solid fa-arrow-up-right-from-square me-1"></i>Buka</a>
                <button type="button" class="btn btn-soft btn-sm rounded-pill btn-edit-materi" data-id="${m.id}" title="Edit"><i class="fa-solid fa-pen"></i></button>
                <button type="button" class="btn btn-soft btn-sm text-danger rounded-pill btn-delete-materi" data-id="${m.id}" title="Hapus"><i class="fa-solid fa-trash"></i></button>
              </div>
            </div>
          </div>`;
        }).join('')}
      </div>

      <div class="modal fade" id="modalMateri" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header"><h5 class="modal-title"><i class="fa-solid fa-upload me-2 text-brand"></i>Form Materi Belajar</h5><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div>
            <form id="tutorMateriForm">
              <input type="hidden" name="id" id="materiId" value="">
              <div class="modal-body">
                <div class="row g-3">
                  <div class="col-md-6">
                    <label class="form-label">Kelas *</label>
                    <select name="class_id" id="materiKelas" class="form-select" required>
                      <option value="">Pilih kelas</option>
                      ${myClasses.map(c => `<option value="${c.id}">${escapeHtml(c.nama)}</option>`).join('')}
                    </select>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Tipe Materi</label>
                    <select name="tipe" id="materiTipe" class="form-select">
                      <option value="link">Link / Tautan Modul</option>
                      <option value="file">File Dokumen (PDF/DOCX)</option>
                      <option value="video">Video Pembelajaran (YouTube/MP4)</option>
                    </select>
                  </div>
                  <div class="col-12"><label class="form-label">Judul Materi *</label><input type="text" name="judul" id="materiJudul" class="form-control" required placeholder="Contoh: Modul Aljabar Linear & Pembahasan"></div>
                  <div class="col-12"><label class="form-label">Deskripsi</label><textarea name="deskripsi" id="materiDeskripsi" class="form-control" rows="3" placeholder="Ringkasan isi materi untuk siswa"></textarea></div>
                  <div class="col-12 d-none" id="materiFileWrap">
                    <label class="form-label">Unggah File</label>
                    <input type="file" name="file" id="materiFileInput" class="form-control" accept=".pdf,.doc,.docx,.mp4,image/*">
                    <div class="form-text">Maksimal 5 MB. PDF, DOC/DOCX, atau MP4.</div>
                  </div>
                  <div class="col-12" id="materiLinkWrap">
                    <label class="form-label">Tautan / URL Materi</label>
                    <input type="url" name="url" id="materiUrl" class="form-control" placeholder="https://...">
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-soft rounded-pill" data-bs-dismiss="modal">Batal</button>
                <button type="submit" class="btn btn-brand rounded-pill px-4">Simpan Materi</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;

    return renderTutorShell('materi', 'Materi Kelas', user, content);
  }

  function renderSoal() {
    const user = ensureTutorUser();
    document.body.className = 'app-body tutor-body';
    const myClasses = getTutorClasses(user.id);
    const myClassIds = myClasses.map(c => Number(c.id));
    const myQuestions = S.state.questions.filter(q => myClassIds.includes(Number(q.class_id)) || Number(q.tutor_id) === Number(user.id) || Number(q.class_id) === 0);

    const content = `
      <div class="page-heading">
        <div><h1>Bank Soal</h1><p>Kelola soal pilihan ganda untuk latihan dan try out siswa.</p></div>
        <button type="button" class="btn btn-brand rounded-pill" id="btnAddSoalTutor"><i class="fa-solid fa-plus me-1"></i>Tambah Soal</button>
      </div>

      <div class="card-soft p-3 p-md-4">
        <div class="table-responsive">
          <table class="table table-hover datatable align-middle">
            <thead><tr><th>Pertanyaan</th><th>Kelas</th><th>Jawaban</th><th>Status</th><th>Dibuat</th><th class="text-end">Aksi</th></tr></thead>
            <tbody>
              ${myQuestions.map(q => {
                const cls = S.state.classes.find(c => Number(c.id) === Number(q.class_id));
                return `
                <tr>
                  <td class="small" style="max-width:460px">${escapeHtml(q.pertanyaan)}</td>
                  <td class="small">${escapeHtml(cls ? cls.nama : 'Umum')}</td>
                  <td><span class="badge bg-primary">${escapeHtml(q.jawaban_benar)}</span></td>
                  <td><span class="badge rounded-pill ${q.status === 'aktif' ? 'bg-success' : 'bg-secondary'}">${q.status === 'aktif' ? 'Aktif' : 'Nonaktif'}</span></td>
                  <td class="small">${S.formatDateId(q.created_at)}</td>
                  <td class="text-end table-actions">
                    <button type="button" class="btn btn-soft btn-sm btn-view-question" data-id="${q.id}" title="Lihat Detail"><i class="fa-solid fa-eye"></i></button>
                    <button type="button" class="btn btn-soft btn-sm btn-edit-question" data-id="${q.id}" title="Edit"><i class="fa-solid fa-pen"></i></button>
                    <button type="button" class="btn btn-soft btn-sm text-danger btn-delete-question" data-id="${q.id}" title="Hapus"><i class="fa-solid fa-trash"></i></button>
                  </td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <div class="modal fade" id="modalSoal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
          <div class="modal-content">
            <div class="modal-header"><h5 class="modal-title"><i class="fa-solid fa-circle-question me-2 text-brand"></i>Form Soal Pilihan Ganda</h5><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div>
            <form id="tutorSoalForm">
              <input type="hidden" name="id" id="soalId" value="">
              <div class="modal-body">
                <div class="row g-3">
                  <div class="col-md-6">
                    <label class="form-label">Kelas</label>
                    <select name="class_id" id="soalKelas" class="form-select">
                      <option value="0">Umum (tanpa kelas)</option>
                      ${myClasses.map(c => `<option value="${c.id}">${escapeHtml(c.nama)}</option>`).join('')}
                    </select>
                  </div>
                  <div class="col-md-3">
                    <label class="form-label">Jawaban Benar *</label>
                    <select name="jawaban_benar" id="soalJawaban" class="form-select">
                      <option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option>
                    </select>
                  </div>
                  <div class="col-md-3">
                    <label class="form-label">Status</label>
                    <select name="status" id="soalStatus" class="form-select">
                      <option value="aktif">Aktif</option><option value="nonaktif">Nonaktif</option>
                    </select>
                  </div>
                  <div class="col-12"><label class="form-label">Pertanyaan *</label><textarea name="pertanyaan" id="soalPertanyaan" class="form-control" rows="3" required></textarea></div>
                  <div class="col-md-6"><label class="form-label">Opsi A *</label><input type="text" name="opsi_a" id="soalOpsiA" class="form-control" required></div>
                  <div class="col-md-6"><label class="form-label">Opsi B *</label><input type="text" name="opsi_b" id="soalOpsiB" class="form-control" required></div>
                  <div class="col-md-6"><label class="form-label">Opsi C *</label><input type="text" name="opsi_c" id="soalOpsiC" class="form-control" required></div>
                  <div class="col-md-6"><label class="form-label">Opsi D *</label><input type="text" name="opsi_d" id="soalOpsiD" class="form-control" required></div>
                  <div class="col-12"><label class="form-label">Pembahasan</label><textarea name="pembahasan" id="soalPembahasan" class="form-control" rows="3"></textarea></div>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-soft rounded-pill" data-bs-dismiss="modal">Batal</button>
                <button type="submit" class="btn btn-brand rounded-pill px-4">Simpan Soal</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div class="modal fade" id="modalLihatSoal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header"><h5 class="modal-title">Detail Soal</h5><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div>
            <div class="modal-body" id="lihatSoalBody"></div>
          </div>
        </div>
      </div>
    `;

    return renderTutorShell('soal', 'Bank Soal', user, content);
  }

  function renderNilai() {
    const user = ensureTutorUser();
    document.body.className = 'app-body tutor-body';
    const myClasses = getTutorClasses(user.id);
    const myClassIds = myClasses.map(c => Number(c.id));
    const myExams = S.state.exams.filter(ex => myClassIds.includes(Number(ex.class_id)) || Number(ex.tutor_id) === Number(user.id));
    const myExamIds = myExams.map(e => Number(e.id));
    const myResults = S.state.examResults.filter(r => myExamIds.includes(Number(r.exam_id)));

    const enrolls = S.state.enrollments.filter(e => myClassIds.includes(Number(e.class_id)) && e.status === 'aktif');
    const studentIds = [...new Set(enrolls.map(e => Number(e.siswa_id)))];
    const myStudents = S.state.users.filter(u => studentIds.includes(Number(u.id)) || u.role === 'siswa');

    const content = `
      <div class="page-heading">
        <div><h1>Nilai & Try Out</h1><p>Buat try out dan masukkan nilai siswa.</p></div>
        <div class="d-flex gap-2">
          <button type="button" class="btn btn-soft rounded-pill" data-bs-toggle="modal" data-bs-target="#modalNilai"><i class="fa-solid fa-pen-to-square me-1"></i>Input Nilai</button>
          <button type="button" class="btn btn-brand rounded-pill" id="btnAddTryoutTutor"><i class="fa-solid fa-plus me-1"></i>Buat Try Out</button>
        </div>
      </div>

      <div class="card-soft p-3 p-md-4 mb-4">
        <h2 class="h6 mb-3">Daftar Try Out</h2>
        <div class="table-responsive">
          <table class="table table-hover datatable align-middle">
            <thead><tr><th>Judul</th><th>Kelas</th><th>Durasi</th><th>Soal</th><th>Peserta</th><th>Rata-rata</th><th>Status</th><th class="text-end">Aksi</th></tr></thead>
            <tbody>
              ${myExams.map(ex => {
                const cls = S.state.classes.find(c => Number(c.id) === Number(ex.class_id));
                const res = S.state.examResults.filter(r => Number(r.exam_id) === Number(ex.id));
                const avg = res.length ? (res.reduce((s, r) => s + Number(r.nilai), 0) / res.length).toFixed(1) : '0.0';
                return `
                <tr>
                  <td class="small fw-semibold">${escapeHtml(ex.judul)}</td>
                  <td class="small">${escapeHtml(cls ? cls.nama : '-')}</td>
                  <td class="small">${ex.durasi_menit} menit</td>
                  <td class="small">${ex.jumlah_soal}</td>
                  <td class="small">${res.length}</td>
                  <td class="small fw-semibold">${avg}</td>
                  <td><span class="badge rounded-pill ${ex.status === 'aktif' ? 'bg-success' : 'bg-secondary'} text-capitalize">${escapeHtml(ex.status)}</span></td>
                  <td class="text-end table-actions">
                    <button type="button" class="btn btn-soft btn-sm text-danger btn-delete-exam" data-id="${ex.id}" title="Hapus"><i class="fa-solid fa-trash"></i></button>
                  </td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <div class="card-soft p-3 p-md-4">
        <h2 class="h6 mb-3">Nilai Terbaru</h2>
        <div class="table-responsive">
          <table class="table table-hover datatable align-middle">
            <thead><tr><th>Siswa</th><th>Try Out</th><th>Kelas</th><th>Nilai</th><th>Tanggal</th><th class="text-end">Aksi</th></tr></thead>
            <tbody>
              ${myResults.map(r => {
                const st = S.state.users.find(u => Number(u.id) === Number(r.siswa_id));
                const ex = S.state.exams.find(e => Number(e.id) === Number(r.exam_id));
                const cls = ex ? S.state.classes.find(c => Number(c.id) === Number(ex.class_id)) : null;
                return `
                <tr>
                  <td class="small fw-semibold">${escapeHtml(st ? st.nama : '-')}</td>
                  <td class="small">${escapeHtml(ex ? ex.judul : '-')}</td>
                  <td class="small">${escapeHtml(cls ? cls.nama : '-')}</td>
                  <td><span class="badge bg-success">${Number(r.nilai).toFixed(2)}</span></td>
                  <td class="small">${S.formatDateId(r.tanggal)}</td>
                  <td class="text-end">
                    <button type="button" class="btn btn-soft btn-sm text-danger btn-delete-result" data-id="${r.id}"><i class="fa-solid fa-trash"></i></button>
                  </td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <div class="modal fade" id="modalTryout" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header"><h5 class="modal-title"><i class="fa-solid fa-clipboard-list me-2 text-brand"></i>Buat Try Out</h5><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div>
            <form id="tutorTryoutForm">
              <div class="modal-body">
                <div class="row g-3">
                  <div class="col-md-6">
                    <label class="form-label">Kelas *</label>
                    <select name="class_id" class="form-select" required>
                      <option value="">Pilih kelas</option>
                      ${myClasses.map(c => `<option value="${c.id}">${escapeHtml(c.nama)}</option>`).join('')}
                    </select>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Status</label>
                    <select name="status" class="form-select">
                      <option value="aktif">Aktif</option><option value="draft">Draft</option><option value="selesai">Selesai</option>
                    </select>
                  </div>
                  <div class="col-12"><label class="form-label">Judul Try Out *</label><input type="text" name="judul" class="form-control" required placeholder="Contoh: Try Out Matematika Bab 3"></div>
                  <div class="col-12"><label class="form-label">Deskripsi</label><textarea name="deskripsi" class="form-control" rows="2"></textarea></div>
                  <div class="col-md-6"><label class="form-label">Durasi (menit)</label><input type="number" name="durasi_menit" class="form-control" min="1" value="30"></div>
                  <div class="col-md-6"><label class="form-label">Jumlah Soal</label><input type="number" name="jumlah_soal" class="form-control" min="1" value="10"></div>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-soft rounded-pill" data-bs-dismiss="modal">Batal</button>
                <button type="submit" class="btn btn-brand rounded-pill px-4">Simpan Try Out</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div class="modal fade" id="modalNilai" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header"><h5 class="modal-title"><i class="fa-solid fa-pen-to-square me-2 text-brand"></i>Input Nilai Siswa</h5><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div>
            <form id="tutorNilaiForm">
              <div class="modal-body">
                <div class="row g-3">
                  <div class="col-12">
                    <label class="form-label">Try Out *</label>
                    <select name="exam_id" class="form-select" required>
                      <option value="">Pilih try out</option>
                      ${myExams.map(ex => {
                        const cls = S.state.classes.find(c => Number(c.id) === Number(ex.class_id));
                        return `<option value="${ex.id}">${escapeHtml(ex.judul)} - ${escapeHtml(cls ? cls.nama : '')}</option>`;
                      }).join('')}
                    </select>
                  </div>
                  <div class="col-12">
                    <label class="form-label">Siswa *</label>
                    <select name="siswa_id" class="form-select" required>
                      <option value="">Pilih siswa</option>
                      ${myStudents.map(s => `<option value="${s.id}">${escapeHtml(s.nama)} (${escapeHtml(s.kelas || 'Siswa')})</option>`).join('')}
                    </select>
                  </div>
                  <div class="col-12"><label class="form-label">Nilai (0-100) *</label><input type="number" name="nilai" class="form-control" min="0" max="100" step="0.5" value="90" required></div>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-soft rounded-pill" data-bs-dismiss="modal">Batal</button>
                <button type="submit" class="btn btn-brand rounded-pill px-4">Simpan Nilai</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;

    return renderTutorShell('nilai', 'Nilai & Try Out', user, content);
  }

  function renderHonor(params) {
    const user = ensureTutorUser();
    document.body.className = 'app-body tutor-body';
    const bulan = params.get('bulan') || '2026-11';
    const myClasses = getTutorClasses(user.id);
    const myClassIds = myClasses.map(c => Number(c.id));

    const rate = Number(user.honor_per_jam) || Number(S.state.settings.default_tutor_rate) || 100000;
    const finishedSchedules = S.state.schedules.filter(sc =>
      (myClassIds.includes(Number(sc.class_id)) || Number(sc.tutor_id) === Number(user.id)) &&
      sc.status === 'selesai' &&
      (!bulan || String(sc.tanggal).startsWith(bulan))
    );

    const totalHours = finishedSchedules.reduce((sum, sc) => sum + calcDurationHours(sc.jam_mulai, sc.jam_selesai), 0);
    const totalHonor = Math.round(totalHours * rate);

    const content = `
      <div class="page-heading">
        <div><h1>Honor Mengajar</h1><p>Rekap honor dari pertemuan yang sudah ditandai selesai.</p></div>
        <form id="tutorHonorFilterForm" class="d-flex gap-2">
          <input type="month" name="bulan" class="form-control" value="${escapeHtml(bulan)}">
          <button type="submit" class="btn btn-brand rounded-pill">Tampilkan</button>
        </form>
      </div>

      <div class="row g-3 mb-4">
        <div class="col-sm-6 col-xl-3"><div class="stat-card"><div class="icon icon-blue"><i class="fa-solid fa-calendar-check"></i></div><div class="value mt-3">${finishedSchedules.length}</div><div class="label">Pertemuan Selesai</div></div></div>
        <div class="col-sm-6 col-xl-3"><div class="stat-card"><div class="icon icon-blue"><i class="fa-regular fa-clock"></i></div><div class="value mt-3">${totalHours.toFixed(1).replace('.', ',')} jam</div><div class="label">Total Jam Mengajar</div></div></div>
        <div class="col-sm-6 col-xl-3"><div class="stat-card"><div class="icon icon-purple"><i class="fa-solid fa-money-bill"></i></div><div class="value mt-3" style="font-size:1.1rem">${S.formatRupiah(rate)}</div><div class="label">Honor per Jam</div></div></div>
        <div class="col-sm-6 col-xl-3"><div class="stat-card"><div class="icon icon-green"><i class="fa-solid fa-wallet"></i></div><div class="value mt-3" style="font-size:1.15rem">${S.formatRupiah(totalHonor)}</div><div class="label">Estimasi Honor Bulan Ini</div></div></div>
      </div>

      <div class="row g-4">
        <div class="col-lg-5">
          <div class="card-soft p-3 p-md-4 h-100">
            <h2 class="h6 mb-3">Rekap per Kelas</h2>
            <div class="table-responsive">
              <table class="table align-middle">
                <thead><tr><th>Kelas</th><th>Pertemuan</th><th>Jam</th><th>Honor</th></tr></thead>
                <tbody>
                  ${myClasses.map(cls => {
                    const clsScheds = finishedSchedules.filter(sc => Number(sc.class_id) === Number(cls.id));
                    const hrs = clsScheds.reduce((s, sc) => s + calcDurationHours(sc.jam_mulai, sc.jam_selesai), 0);
                    return `
                    <tr>
                      <td class="small fw-semibold">${escapeHtml(cls.nama)}</td>
                      <td>${clsScheds.length}</td>
                      <td class="small">${hrs.toFixed(1).replace('.', ',')}</td>
                      <td class="small fw-semibold">${S.formatRupiah(Math.round(hrs * rate))}</td>
                    </tr>`;
                  }).join('')}
                </tbody>
              </table>
            </div>
            <div class="alert alert-info small mb-0"><i class="fa-solid fa-circle-info me-2"></i>Honor dihitung dari durasi pertemuan berstatus selesai &times; tarif per jam. Hubungi admin jika ada ketidaksesuaian.</div>
          </div>
        </div>
        <div class="col-lg-7">
          <div class="card-soft p-3 p-md-4 h-100">
            <h2 class="h6 mb-3">Detail Pertemuan Selesai</h2>
            <div class="table-responsive">
              <table class="table table-hover datatable align-middle">
                <thead><tr><th>Tanggal</th><th>Kelas</th><th>Topik</th><th>Durasi</th><th>Honor</th></tr></thead>
                <tbody>
                  ${finishedSchedules.map(sc => {
                    const cls = S.state.classes.find(c => Number(c.id) === Number(sc.class_id));
                    const hrs = calcDurationHours(sc.jam_mulai, sc.jam_selesai);
                    return `
                    <tr>
                      <td class="small">${S.formatDateId(sc.tanggal)}</td>
                      <td class="small">${escapeHtml(cls ? cls.nama : '-')}</td>
                      <td class="small">${escapeHtml(sc.topik)}</td>
                      <td class="small">${hrs.toFixed(1).replace('.', ',')} jam</td>
                      <td class="small fw-semibold">${S.formatRupiah(Math.round(hrs * rate))}</td>
                    </tr>`;
                  }).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    `;

    return renderTutorShell('honor', 'Honor Mengajar', user, content);
  }

  function renderProfil() {
    const user = ensureTutorUser();
    document.body.className = 'app-body tutor-body';
    const rate = Number(user.honor_per_jam) || Number(S.state.settings.default_tutor_rate) || 100000;

    const content = `
      <div class="page-heading">
        <div><h1>Profil Tutor</h1><p>Perbarui data diri, keahlian, dan keamanan akun.</p></div>
      </div>

      <div class="row g-4">
        <div class="col-lg-4">
          <div class="card-soft p-4 text-center h-100">
            <img src="${escapeHtml(user.avatar || 'assets/img/avatar.svg')}" alt="Foto profil" class="rounded-circle mx-auto mb-3" style="width:110px;height:110px;object-fit:cover;border:4px solid #ccfbf1">
            <h2 class="h5 mb-1">${escapeHtml(user.nama)}</h2>
            <p class="small text-muted mb-2">${escapeHtml(user.spesialisasi || 'Tutor Bimbel')}</p>
            <span class="badge rounded-pill bg-success">Aktif</span>
            <hr>
            <div class="text-start small">
              <div class="d-flex justify-content-between py-1"><span class="text-muted">Email</span><span>${escapeHtml(user.email)}</span></div>
              <div class="d-flex justify-content-between py-1"><span class="text-muted">WhatsApp</span><span>${escapeHtml(user.no_hp || '-')}</span></div>
              <div class="d-flex justify-content-between py-1"><span class="text-muted">Pendidikan</span><span>${escapeHtml(user.pendidikan || '-')}</span></div>
              <div class="d-flex justify-content-between py-1"><span class="text-muted">Honor/jam</span><span>${S.formatRupiah(rate)}</span></div>
            </div>
          </div>
        </div>
        <div class="col-lg-8">
          <div class="card-soft p-3 p-md-4 mb-4">
            <h2 class="h6 mb-3">Data Profil & Keahlian</h2>
            <form id="tutorProfileForm">
              <div class="row g-3">
                <div class="col-md-6"><label class="form-label">Nama Lengkap *</label><input type="text" name="nama" class="form-control" value="${escapeHtml(user.nama)}" required></div>
                <div class="col-md-6"><label class="form-label">Email *</label><input type="email" name="email" class="form-control" value="${escapeHtml(user.email)}" required></div>
                <div class="col-md-6"><label class="form-label">No. WhatsApp</label><input type="text" name="no_hp" class="form-control" value="${escapeHtml(user.no_hp || '')}" placeholder="628xxxxxxxxxx"></div>
                <div class="col-md-6"><label class="form-label">Spesialisasi / Keahlian</label><input type="text" name="spesialisasi" class="form-control" value="${escapeHtml(user.spesialisasi || '')}" placeholder="Matematika, Fisika"></div>
                <div class="col-md-6"><label class="form-label">Pendidikan</label><input type="text" name="pendidikan" class="form-control" value="${escapeHtml(user.pendidikan || '')}" placeholder="S1 Pendidikan Matematika"></div>
                <div class="col-md-6"><label class="form-label">Foto Profil</label><input type="file" name="foto" id="tutorAvatarInput" class="form-control" accept="image/jpeg,image/png,image/webp"></div>
                <div class="col-12"><label class="form-label">Bio Singkat</label><textarea name="bio" class="form-control" rows="4">${escapeHtml(user.bio || '')}</textarea></div>
              </div>
              <button type="submit" class="btn btn-brand rounded-pill px-4 mt-3"><i class="fa-solid fa-floppy-disk me-1"></i>Simpan Profil</button>
            </form>
          </div>

          <div class="card-soft p-3 p-md-4">
            <h2 class="h6 mb-3">Ubah Password</h2>
            <form id="tutorPasswordForm">
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
    `;

    return renderTutorShell('profil', 'Profil Tutor', user, content);
  }

  window.BimbelTutorViews = {
    renderDashboard,
    renderJadwal,
    renderAbsensi,
    renderSiswa,
    renderMateri,
    renderSoal,
    renderNilai,
    renderHonor,
    renderProfil,
    calcDurationHours
  };
})(window);
