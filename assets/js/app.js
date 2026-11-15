/* ==========================================================================
   Bimbel Indonesia - Main Application Router & Interactive Controller
   ========================================================================== */
(function (window) {
  'use strict';

  const S = window.BimbelStore;
  const PublicViews = window.BimbelPublicViews;
  const SiswaViews = window.BimbelSiswaViews;
  const TutorViews = window.BimbelTutorViews;
  const AdminViews = window.BimbelAdminViews;
  const escapeHtml = PublicViews.escapeHtml;

  let activeChart = null;
  let currentTryoutTimer = null;

  function toast(title, text, icon = 'success') {
    if (window.Swal) {
      Swal.fire({
        icon,
        title,
        text: text || undefined,
        timer: 1800,
        showConfirmButton: false
      });
    } else {
      alert(title + (text ? '\n' + text : ''));
    }
  }

  function confirmAction(message) {
    if (window.Swal) {
      return Swal.fire({
        icon: 'warning',
        title: 'Konfirmasi',
        text: message || 'Yakin ingin melanjutkan?',
        showCancelButton: true,
        confirmButtonColor: '#dc2626',
        cancelButtonColor: '#64748b',
        confirmButtonText: 'Ya, lanjutkan',
        cancelButtonText: 'Batal'
      }).then(res => !!res.isConfirmed);
    }
    return Promise.resolve(window.confirm(message || 'Yakin ingin melanjutkan?'));
  }

  function parseHash() {
    let raw = window.location.hash || '#/home';
    if (raw.startsWith('#')) raw = raw.slice(1);
    if (!raw.startsWith('/')) raw = '/' + raw;
    const [pathPart, queryPart] = raw.split('?');
    const path = pathPart.replace(/^\//, '').replace(/\.php$|\.html$/, '') || 'home';
    const params = new URLSearchParams(queryPart || '');
    return { path, params };
  }

  function navigate(hashUrl) {
    if (!hashUrl.startsWith('#')) hashUrl = '#' + (hashUrl.startsWith('/') ? hashUrl : '/' + hashUrl);
    if (window.location.hash === hashUrl) {
      renderCurrentRoute();
    } else {
      window.location.hash = hashUrl;
    }
  }

  function cleanupModals() {
    document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
    document.body.classList.remove('modal-open');
    document.body.style.removeProperty('overflow');
    document.body.style.removeProperty('padding-right');
  }

  function renderGlobalModalsAndSwitcher(currentPath) {
    const user = S.getCurrentUser();
    const role = currentPath.startsWith('admin')
      ? 'admin'
      : (currentPath.startsWith('tutor') ? 'tutor' : (currentPath.startsWith('siswa') ? 'siswa' : 'public'));

    return `
      <!-- Global WhatsApp Modal -->
      <div class="modal fade" id="waModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title"><i class="fa-brands fa-whatsapp text-success me-2"></i>Kirim WhatsApp</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Tutup"></button>
            </div>
            <form id="waForm">
              <div class="modal-body">
                <input type="hidden" id="waUserId" value="">
                <div class="mb-3">
                  <label class="form-label">Nama Penerima</label>
                  <input type="text" class="form-control" id="waNama" readonly>
                </div>
                <div class="mb-3">
                  <label class="form-label">Nomor WhatsApp</label>
                  <input type="text" class="form-control" id="waNoHp" placeholder="628xxxxxxxxxx" required>
                  <div class="form-text">Gunakan format 62xxx. Nomor dapat diubah sebelum dikirim.</div>
                </div>
                <div class="mb-2">
                  <label class="form-label">Pesan</label>
                  <textarea class="form-control" id="waPesan" rows="6" required></textarea>
                </div>
                <div class="alert alert-light border small mb-0">
                  <i class="fa-solid fa-circle-info me-1 text-primary"></i>
                  Pesan akan tercatat di log dan dapat langsung dibuka di WhatsApp Web/App.
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-soft rounded-pill" data-bs-dismiss="modal">Batal</button>
                <button type="submit" class="btn btn-success rounded-pill px-4"><i class="fa-brands fa-whatsapp me-1"></i>Kirim Sekarang</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Global Bukti Pembayaran Preview Modal -->
      <div class="modal fade" id="modalPreviewBukti" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title"><i class="fa-solid fa-receipt me-2 text-primary"></i>Bukti Pembayaran: <span id="previewBuktiInvoice"></span></h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body text-center">
              <img id="previewBuktiImg" src="" alt="Bukti Transfer" class="img-fluid rounded-3 border" style="max-height:460px">
            </div>
          </div>
        </div>
      </div>

      <!-- Global Online Try Out Interactive Runner Modal -->
      <div class="modal fade" id="modalRunTryout" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
          <div class="modal-content">
            <div class="modal-header d-flex justify-content-between align-items-center">
              <h5 class="modal-title" id="runTryoutTitle"><i class="fa-solid fa-clipboard-check me-2 text-brand"></i>Try Out Online</h5>
              <span class="tryout-timer ms-auto me-2" id="runTryoutTimer">20:00</span>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <form id="runTryoutForm">
              <input type="hidden" id="runTryoutExamId" value="">
              <div class="modal-body" id="runTryoutBody"></div>
              <div class="modal-footer">
                <button type="button" class="btn btn-soft rounded-pill" data-bs-dismiss="modal">Batal</button>
                <button type="submit" class="btn btn-brand rounded-pill px-4"><i class="fa-solid fa-paper-plane me-1"></i>Kumpulkan Jawaban</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Floating Quick Role Switcher Bar -->
      <div class="position-fixed bottom-0 end-0 p-3" style="z-index:1080">
        <div class="d-flex align-items-center gap-1 p-1 rounded-pill shadow-lg border" style="background:rgba(15,23,42,.92);backdrop-filter:blur(10px)">
          <span class="small text-white-50 px-2 d-none d-md-inline" style="font-size:.72rem"><i class="fa-solid fa-layer-group me-1"></i>Panel:</span>
          <a href="#/home" class="btn btn-sm rounded-pill py-1 px-2 ${role === 'public' ? 'btn-warning text-dark fw-bold' : 'text-white'}" style="font-size:.75rem"><i class="fa-solid fa-globe me-1"></i>Publik</a>
          <button type="button" class="btn btn-sm rounded-pill py-1 px-2 ${role === 'siswa' ? 'btn-warning text-dark fw-bold' : 'text-white'}" style="font-size:.75rem" data-quick-login="siswa"><i class="fa-solid fa-user-graduate me-1"></i>Siswa</button>
          <button type="button" class="btn btn-sm rounded-pill py-1 px-2 ${role === 'tutor' ? 'btn-warning text-dark fw-bold' : 'text-white'}" style="font-size:.75rem" data-quick-login="tutor"><i class="fa-solid fa-chalkboard-user me-1"></i>Tutor</button>
          <button type="button" class="btn btn-sm rounded-pill py-1 px-2 ${role === 'admin' ? 'btn-warning text-dark fw-bold' : 'text-white'}" style="font-size:.75rem" data-quick-login="admin"><i class="fa-solid fa-user-shield me-1"></i>Admin</button>
        </div>
      </div>
    `;
  }

  function renderCurrentRoute() {
    cleanupModals();
    if (currentTryoutTimer) {
      clearInterval(currentTryoutTimer);
      currentTryoutTimer = null;
    }

    const { path, params } = parseHash();
    const appRoot = document.getElementById('appRoot');
    if (!appRoot) return;

    let viewHtml = '';
    switch (path) {
      case 'home':
      case 'index':
        viewHtml = PublicViews.renderHome(params);
        break;
      case 'blog':
        viewHtml = PublicViews.renderBlog(params);
        break;
      case 'auth/login':
      case 'login':
        viewHtml = PublicViews.renderLogin(params);
        break;
      case 'auth/register':
      case 'register':
        viewHtml = PublicViews.renderRegister(params);
        break;

      // Siswa Routes
      case 'siswa':
      case 'siswa/dashboard':
        viewHtml = SiswaViews.renderDashboard(params);
        break;
      case 'siswa/katalog':
        viewHtml = SiswaViews.renderKatalog(params);
        break;
      case 'siswa/checkout':
        viewHtml = SiswaViews.renderCheckout(params);
        break;
      case 'siswa/pembayaran':
        viewHtml = SiswaViews.renderPembayaran(params);
        break;
      case 'siswa/kelas':
        viewHtml = SiswaViews.renderKelas(params);
        break;
      case 'siswa/materi':
        viewHtml = SiswaViews.renderMateri(params);
        break;
      case 'siswa/riwayat':
        viewHtml = SiswaViews.renderRiwayat(params);
        break;
      case 'siswa/profil':
        viewHtml = SiswaViews.renderProfil(params);
        break;

      // Tutor Routes
      case 'tutor':
      case 'tutor/dashboard':
        viewHtml = TutorViews.renderDashboard(params);
        break;
      case 'tutor/jadwal':
        viewHtml = TutorViews.renderJadwal(params);
        break;
      case 'tutor/absensi':
        viewHtml = TutorViews.renderAbsensi(params);
        break;
      case 'tutor/siswa':
        viewHtml = TutorViews.renderSiswa(params);
        break;
      case 'tutor/materi':
        viewHtml = TutorViews.renderMateri(params);
        break;
      case 'tutor/soal':
        viewHtml = TutorViews.renderSoal(params);
        break;
      case 'tutor/nilai':
        viewHtml = TutorViews.renderNilai(params);
        break;
      case 'tutor/honor':
        viewHtml = TutorViews.renderHonor(params);
        break;
      case 'tutor/profil':
        viewHtml = TutorViews.renderProfil(params);
        break;

      // Admin Routes
      case 'admin':
      case 'admin/dashboard':
        viewHtml = AdminViews.renderDashboard(params);
        break;
      case 'admin/pengguna':
        viewHtml = AdminViews.renderPengguna(params);
        break;
      case 'admin/program':
        viewHtml = AdminViews.renderProgram(params);
        break;
      case 'admin/kelas':
        viewHtml = AdminViews.renderKelas(params);
        break;
      case 'admin/materi-soal':
        viewHtml = AdminViews.renderMateriSoal(params);
        break;
      case 'admin/pembayaran':
        viewHtml = AdminViews.renderPembayaran(params);
        break;
      case 'admin/banner':
        viewHtml = AdminViews.renderBanner(params);
        break;
      case 'admin/konten':
        viewHtml = AdminViews.renderKonten(params);
        break;
      case 'admin/laporan':
        viewHtml = AdminViews.renderLaporan(params);
        break;
      case 'admin/whatsapp':
        viewHtml = AdminViews.renderWhatsapp(params);
        break;
      case 'admin/pengaturan':
        viewHtml = AdminViews.renderPengaturan(params);
        break;

      default:
        viewHtml = PublicViews.renderHome(params);
        break;
    }

    appRoot.innerHTML = viewHtml + renderGlobalModalsAndSwitcher(path);
    window.scrollTo({ top: 0, behavior: 'instant' });
    enhanceCurrentDOM(path);
  }

  function enhanceCurrentDOM(path) {
    // Initialize DataTables
    if (window.jQuery && jQuery.fn && jQuery.fn.dataTable) {
      jQuery('table.datatable').each(function () {
        if (!jQuery.fn.dataTable.isDataTable(this)) {
          jQuery(this).DataTable({
            language: {
              search: 'Cari:',
              lengthMenu: 'Tampilkan _MENU_ data',
              info: 'Menampilkan _START_–_END_ dari _TOTAL_ data',
              infoEmpty: 'Tidak ada data',
              zeroRecords: 'Data tidak ditemukan',
              paginate: { previous: 'Sebelumnya', next: 'Berikutnya' }
            },
            pageLength: 10,
            order: []
          });
        }
      });
    }

    // Initialize Admin Revenue Chart
    const chartCanvas = document.getElementById('adminRevenueChart');
    if (chartCanvas && window.Chart) {
      if (activeChart) activeChart.destroy();
      const paidTotal = S.state.payments
        .filter(p => p.status === 'lunas')
        .reduce((s, p) => s + (Number(p.nominal) || 0), 0);
      activeChart = new Chart(chartCanvas, {
        type: 'bar',
        data: {
          labels: ['Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov'],
          datasets: [
            {
              label: 'Pendapatan (Rp)',
              data: [850000, 1200000, 1450000, 1800000, 2150000, paidTotal || 1150000],
              backgroundColor: 'rgba(37, 99, 235, 0.82)',
              borderRadius: 8
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: {
              ticks: {
                callback: val => 'Rp ' + Number(val).toLocaleString('id-ID')
              }
            }
          }
        }
      });
    }

    // Coupon check on Siswa Checkout
    const btnApplyKupon = document.getElementById('btnApplyKupon');
    if (btnApplyKupon) {
      btnApplyKupon.addEventListener('click', function () {
        const input = document.getElementById('checkoutKuponInput');
        const basePrice = Number(input.dataset.basePrice) || 0;
        const code = (input.value || '').trim().toUpperCase();
        const coupon = S.state.coupons.find(c => c.kode.toUpperCase() === code && c.status === 'aktif');
        const row = document.getElementById('checkoutDiskonRow');
        const dText = document.getElementById('checkoutDiskonText');
        const tText = document.getElementById('checkoutTotalText');
        const fb = document.getElementById('kuponFeedback');

        if (!coupon) {
          row.classList.add('d-none');
          tText.textContent = S.formatRupiah(basePrice);
          fb.innerHTML = '<span class="text-danger">Kode kupon tidak ditemukan atau sudah tidak aktif.</span>';
          return;
        }
        const disc = coupon.tipe === 'persen' ? Math.round(basePrice * (Number(coupon.nilai) / 100)) : Number(coupon.nilai);
        const finalPrice = Math.max(0, basePrice - disc);
        row.classList.remove('d-none');
        dText.textContent = '-' + S.formatRupiah(disc);
        tText.textContent = S.formatRupiah(finalPrice);
        fb.innerHTML = `<span class="text-success fw-semibold"><i class="fa-solid fa-circle-check me-1"></i>Kupon ${escapeHtml(coupon.kode)} diterapkan! Hemat ${S.formatRupiah(disc)}.</span>`;
      });
    }

    // Tutor Materi type switch
    const materiTipe = document.getElementById('materiTipe');
    if (materiTipe) {
      materiTipe.addEventListener('change', function () {
        const isFile = this.value === 'file';
        document.getElementById('materiFileWrap')?.classList.toggle('d-none', !isFile);
        document.getElementById('materiLinkWrap')?.classList.toggle('d-none', isFile);
      });
    }

    // Slider Upload Live Preview
    const sliderImageInput = document.getElementById('sliderImageInput');
    if (sliderImageInput) {
      sliderImageInput.addEventListener('change', async function () {
        const file = this.files && this.files[0];
        if (!file) return;
        const dataUrl = await S.readFileAsDataURL(file);
        const img = document.getElementById('sliderUploadPreviewImg');
        const ph = document.getElementById('sliderPreviewPlaceholder');
        if (img && dataUrl) {
          img.src = dataUrl;
          img.hidden = false;
          if (ph) ph.hidden = true;
        }
      });
    }

    // WhatsApp template select in Admin
    const waTemplateSelect = document.getElementById('waTemplateSelect');
    if (waTemplateSelect) {
      waTemplateSelect.addEventListener('change', function () {
        if (this.value) {
          document.getElementById('waBroadcastMessage').value = this.value;
        }
      });
    }

    // Modal Bukti trigger population
    const modalBuktiEl = document.getElementById('modalBukti');
    if (modalBuktiEl) {
      modalBuktiEl.addEventListener('show.bs.modal', function (ev) {
        const btn = ev.relatedTarget;
        if (!btn) return;
        document.getElementById('buktiPaymentId').value = btn.getAttribute('data-payment') || '';
        document.getElementById('buktiInvoice').textContent = btn.getAttribute('data-invoice') || '';
      });
    }
  }

  // Global Delegated Click Listener
  document.addEventListener('click', async function (event) {
    // 1. Scroll-to section on landing page
    const scrollLink = event.target.closest('[data-scroll-to]');
    if (scrollLink) {
      const selector = scrollLink.getAttribute('data-scroll-to');
      const { path } = parseHash();
      if (path !== 'home' && path !== 'index') {
        event.preventDefault();
        navigate('#/home');
        setTimeout(() => {
          document.querySelector(selector)?.scrollIntoView({ behavior: 'smooth' });
        }, 120);
        return;
      }
      const el = document.querySelector(selector);
      if (el) {
        event.preventDefault();
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }

    // 2. Sidebar toggle on mobile
    const sidebarToggle = event.target.closest('[data-sidebar-toggle]');
    if (sidebarToggle) {
      event.preventDefault();
      document.querySelector('.app-sidebar')?.classList.toggle('show');
      document.querySelector('.sidebar-overlay')?.classList.toggle('show');
      return;
    }
    if (event.target.classList.contains('sidebar-overlay')) {
      document.querySelector('.app-sidebar')?.classList.remove('show');
      document.querySelector('.sidebar-overlay')?.classList.remove('show');
      return;
    }

    // 3. Password visibility toggle
    const pwToggle = event.target.closest('[data-password-toggle]');
    if (pwToggle) {
      const target = document.querySelector(pwToggle.getAttribute('data-password-toggle'));
      if (target) {
        const isPw = target.type === 'password';
        target.type = isPw ? 'text' : 'password';
        const ic = pwToggle.querySelector('i');
        if (ic) ic.className = isPw ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye';
      }
      return;
    }

    // 4. Copy to clipboard
    const copyBtn = event.target.closest('[data-copy]');
    if (copyBtn) {
      const text = copyBtn.getAttribute('data-copy') || '';
      navigator.clipboard?.writeText(text);
      toast('Disalin!', text + ' berhasil disalin ke clipboard.');
      return;
    }

    // 5. Quick Role Login
    const quickLoginBtn = event.target.closest('[data-quick-login]');
    if (quickLoginBtn) {
      event.preventDefault();
      const role = quickLoginBtn.getAttribute('data-quick-login');
      const targetUser = S.state.users.find(u => u.role === role);
      if (targetUser) {
        S.setCurrentUser(targetUser.id);
        const dest = role === 'admin' ? '#/admin/dashboard' : (role === 'tutor' ? '#/tutor/dashboard' : '#/siswa/dashboard');
        navigate(dest);
        toast(`Masuk sebagai ${targetUser.nama}`, `Mode ${role.toUpperCase()} aktif penuh.`);
      }
      return;
    }

    // 6. Logout
    const logoutBtn = event.target.closest('[data-action="logout"]');
    if (logoutBtn) {
      event.preventDefault();
      S.setCurrentUser(null);
      navigate('#/auth/login');
      toast('Berhasil Keluar', 'Sampai jumpa kembali di Bimbel Indonesia.');
      return;
    }

    // 7. Forgot password
    if (event.target.closest('[data-action="forgot-password"]')) {
      event.preventDefault();
      toast('Reset Password', 'Gunakan password default: password123 atau masuk melalui tombol Akses Cepat.', 'info');
      return;
    }

    // 8. Clear notifications
    if (event.target.closest('[data-action="clear-notifs"]')) {
      const user = S.getCurrentUser();
      if (user) {
        S.state.notifications.forEach(n => {
          if (Number(n.user_id) === Number(user.id)) n.dibaca = true;
        });
        S.save();
        renderCurrentRoute();
        toast('Notifikasi ditandai sudah dibaca');
      }
      return;
    }

    // 9. Download Invoice PNG
    const dlInvBtn = event.target.closest('.btn-download-invoice');
    if (dlInvBtn) {
      event.preventDefault();
      const payId = Number(dlInvBtn.getAttribute('data-payment-id'));
      const payment = S.state.payments.find(p => Number(p.id) === payId);
      if (!payment) return;
      dlInvBtn.disabled = true;
      try {
        await S.downloadInvoicePng(payment);
        toast('Invoice PNG Diunduh', `File invoice-${payment.invoice}.png berhasil dibuat.`);
      } catch (err) {
        toast('Gagal Membuat Invoice', err.message, 'error');
      } finally {
        dlInvBtn.disabled = false;
      }
      return;
    }

    // 10. Preview Bukti Pembayaran
    const prevBuktiBtn = event.target.closest('.btn-preview-bukti');
    if (prevBuktiBtn) {
      event.preventDefault();
      document.getElementById('previewBuktiInvoice').textContent = prevBuktiBtn.getAttribute('data-invoice') || '';
      document.getElementById('previewBuktiImg').src = prevBuktiBtn.getAttribute('data-bukti') || '';
      new bootstrap.Modal(document.getElementById('modalPreviewBukti')).show();
      return;
    }

    // 11. Open Material (simulate download if local/hash URL)
    const openMatBtn = event.target.closest('[data-open-material]');
    if (openMatBtn) {
      const href = openMatBtn.getAttribute('href') || '';
      if (!href || href.startsWith('#')) {
        event.preventDefault();
        const matId = Number(openMatBtn.getAttribute('data-open-material'));
        const mat = S.state.materials.find(m => Number(m.id) === matId);
        toast('Membuka Materi', mat ? `${mat.judul} (${mat.file_name || mat.tipe})` : 'Materi dibuka', 'info');
      }
      return;
    }

    // 12. Start Online Try Out
    const startTryoutBtn = event.target.closest('.btn-start-tryout');
    if (startTryoutBtn) {
      event.preventDefault();
      const examId = Number(startTryoutBtn.getAttribute('data-exam-id'));
      const exam = S.state.exams.find(e => Number(e.id) === examId) || S.state.exams[0];
      if (!exam) return;
      let questions = S.state.questions.filter(q => Number(q.class_id) === Number(exam.class_id) && q.status === 'aktif');
      if (questions.length === 0) questions = S.state.questions.filter(q => q.status === 'aktif');

      document.getElementById('runTryoutExamId').value = exam.id;
      document.getElementById('runTryoutTitle').innerHTML = `<i class="fa-solid fa-clipboard-check me-2 text-brand"></i>${escapeHtml(exam.judul)}`;
      document.getElementById('runTryoutBody').innerHTML = questions.map((q, idx) => `
        <div class="mb-4 p-3 border rounded-4 bg-light bg-opacity-50">
          <div class="fw-semibold small mb-2">${idx + 1}. ${escapeHtml(q.pertanyaan)}</div>
          <div class="d-grid gap-2">
            ${['A', 'B', 'C', 'D'].map(opt => {
              const optVal = q['opsi_' + opt.toLowerCase()];
              return `
              <label class="d-flex align-items-center gap-2 small p-2 border rounded-3 bg-white" style="cursor:pointer">
                <input type="radio" name="q_${q.id}" value="${opt}" required>
                <span><strong>${opt}.</strong> ${escapeHtml(optVal)}</span>
              </label>`;
            }).join('')}
          </div>
        </div>
      `).join('');

      let secondsLeft = (Number(exam.durasi_menit) || 20) * 60;
      const timerEl = document.getElementById('runTryoutTimer');
      if (currentTryoutTimer) clearInterval(currentTryoutTimer);
      currentTryoutTimer = setInterval(() => {
        secondsLeft = Math.max(0, secondsLeft - 1);
        const m = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
        const s = String(secondsLeft % 60).padStart(2, '0');
        if (timerEl) timerEl.textContent = `${m}:${s}`;
      }, 1000);

      new bootstrap.Modal(document.getElementById('modalRunTryout')).show();
      return;
    }

    // 13. WhatsApp Modal Trigger (.btn-kirim-wa & .btn-send-wa-row)
    const waBtn = event.target.closest('.btn-kirim-wa');
    if (waBtn) {
      event.preventDefault();
      document.getElementById('waUserId').value = waBtn.getAttribute('data-wa-user-id') || '';
      document.getElementById('waNama').value = waBtn.getAttribute('data-wa-nama') || '';
      document.getElementById('waNoHp').value = waBtn.getAttribute('data-wa-phone') || '';
      document.getElementById('waPesan').value = waBtn.getAttribute('data-wa-pesan') || '';
      new bootstrap.Modal(document.getElementById('waModal')).show();
      return;
    }

    const waRowBtn = event.target.closest('.btn-send-wa-row');
    if (waRowBtn) {
      event.preventDefault();
      const nama = waRowBtn.getAttribute('data-nama') || '';
      const email = waRowBtn.getAttribute('data-email') || '';
      const phone = waRowBtn.getAttribute('data-phone') || '';
      const rawTemplate = document.getElementById('waBroadcastMessage')?.value || 'Halo {nama}!';
      const personalized = rawTemplate.replace(/\{nama\}/g, nama).replace(/\{email\}/g, email);
      document.getElementById('waNama').value = nama;
      document.getElementById('waNoHp').value = phone;
      document.getElementById('waPesan').value = personalized;
      new bootstrap.Modal(document.getElementById('waModal')).show();
      return;
    }

    // 14. Tutor/Admin Schedule buttons
    if (event.target.closest('#btnAddJadwalTutor') || event.target.closest('#btnAddScheduleAdmin')) {
      const form = document.getElementById('tutorJadwalForm');
      if (form) {
        form.reset();
        document.getElementById('jadwalId').value = '';
        new bootstrap.Modal(document.getElementById('modalJadwal')).show();
      }
      return;
    }

    const editJadwalBtn = event.target.closest('.btn-edit-jadwal');
    if (editJadwalBtn) {
      const d = editJadwalBtn.dataset;
      document.getElementById('jadwalId').value = d.id || '';
      document.getElementById('jadwalKelas').value = d.class || '';
      document.getElementById('jadwalTanggal').value = d.tanggal || '';
      document.getElementById('jadwalMulai').value = d.mulai || '';
      document.getElementById('jadwalSelesai').value = d.selesai || '';
      document.getElementById('jadwalTopik').value = d.topik || '';
      document.getElementById('jadwalLink').value = d.link || '';
      document.getElementById('jadwalStatus').value = d.status || 'terjadwal';
      new bootstrap.Modal(document.getElementById('modalJadwal')).show();
      return;
    }

    const finishJadwalBtn = event.target.closest('.btn-finish-jadwal');
    if (finishJadwalBtn) {
      const id = Number(finishJadwalBtn.dataset.id);
      if (await confirmAction('Tandai pertemuan ini selesai?')) {
        const sc = S.state.schedules.find(s => Number(s.id) === id);
        if (sc) {
          sc.status = 'selesai';
          S.save();
          renderCurrentRoute();
          toast('Pertemuan Selesai', 'Status pertemuan dan perhitungan honor telah diperbarui.');
        }
      }
      return;
    }

    const delJadwalBtn = event.target.closest('.btn-delete-jadwal');
    if (delJadwalBtn) {
      const id = Number(delJadwalBtn.dataset.id);
      if (await confirmAction('Hapus jadwal pertemuan ini?')) {
        S.state.schedules = S.state.schedules.filter(s => Number(s.id) !== id);
        S.save();
        renderCurrentRoute();
        toast('Jadwal Dihapus');
      }
      return;
    }

    // 15. Tutor Materi buttons
    if (event.target.closest('#btnAddMateriTutor')) {
      const form = document.getElementById('tutorMateriForm');
      if (form) {
        form.reset();
        document.getElementById('materiId').value = '';
        new bootstrap.Modal(document.getElementById('modalMateri')).show();
      }
      return;
    }

    const editMateriBtn = event.target.closest('.btn-edit-materi');
    if (editMateriBtn) {
      const id = Number(editMateriBtn.dataset.id);
      const m = S.state.materials.find(item => Number(item.id) === id);
      if (m) {
        document.getElementById('materiId').value = m.id;
        document.getElementById('materiKelas').value = m.class_id;
        document.getElementById('materiTipe').value = m.tipe;
        document.getElementById('materiJudul').value = m.judul;
        document.getElementById('materiDeskripsi').value = m.deskripsi || '';
        document.getElementById('materiUrl').value = m.url || '';
        new bootstrap.Modal(document.getElementById('modalMateri')).show();
      }
      return;
    }

    const delMateriBtn = event.target.closest('.btn-delete-materi');
    if (delMateriBtn) {
      const id = Number(delMateriBtn.dataset.id);
      if (await confirmAction('Hapus materi belajar ini?')) {
        S.state.materials = S.state.materials.filter(m => Number(m.id) !== id);
        S.save();
        renderCurrentRoute();
        toast('Materi Dihapus');
      }
      return;
    }

    // 16. Tutor/Admin Bank Soal buttons
    if (event.target.closest('#btnAddSoalTutor')) {
      const form = document.getElementById('tutorSoalForm');
      if (form) {
        form.reset();
        document.getElementById('soalId').value = '';
        new bootstrap.Modal(document.getElementById('modalSoal')).show();
      }
      return;
    }

    const viewQBtn = event.target.closest('.btn-view-question');
    if (viewQBtn) {
      const id = Number(viewQBtn.dataset.id);
      const q = S.state.questions.find(item => Number(item.id) === id);
      if (q) {
        document.getElementById('lihatSoalBody').innerHTML = `
          <p class="fw-semibold">${escapeHtml(q.pertanyaan)}</p>
          <ol type="A" class="small">
            <li>${escapeHtml(q.opsi_a)}</li>
            <li>${escapeHtml(q.opsi_b)}</li>
            <li>${escapeHtml(q.opsi_c)}</li>
            <li>${escapeHtml(q.opsi_d)}</li>
          </ol>
          <div class="alert alert-success small mb-2">Jawaban Benar: <strong>${escapeHtml(q.jawaban_benar)}</strong></div>
          <div class="small text-muted">${q.pembahasan ? '<strong>Pembahasan:</strong> ' + escapeHtml(q.pembahasan) : ''}</div>
        `;
        new bootstrap.Modal(document.getElementById('modalLihatSoal')).show();
      }
      return;
    }

    const editQBtn = event.target.closest('.btn-edit-question');
    if (editQBtn) {
      const id = Number(editQBtn.dataset.id);
      const q = S.state.questions.find(item => Number(item.id) === id);
      if (q) {
        document.getElementById('soalId').value = q.id;
        document.getElementById('soalKelas').value = q.class_id;
        document.getElementById('soalJawaban').value = q.jawaban_benar;
        document.getElementById('soalStatus').value = q.status;
        document.getElementById('soalPertanyaan').value = q.pertanyaan;
        document.getElementById('soalOpsiA').value = q.opsi_a;
        document.getElementById('soalOpsiB').value = q.opsi_b;
        document.getElementById('soalOpsiC').value = q.opsi_c;
        document.getElementById('soalOpsiD').value = q.opsi_d;
        document.getElementById('soalPembahasan').value = q.pembahasan || '';
        new bootstrap.Modal(document.getElementById('modalSoal')).show();
      }
      return;
    }

    const delQBtn = event.target.closest('.btn-delete-question');
    if (delQBtn) {
      const id = Number(delQBtn.dataset.id);
      if (await confirmAction('Hapus soal pilihan ganda ini?')) {
        S.state.questions = S.state.questions.filter(q => Number(q.id) !== id);
        S.save();
        renderCurrentRoute();
        toast('Soal Dihapus');
      }
      return;
    }

    // 17. Tutor Tryout & Nilai buttons
    if (event.target.closest('#btnAddTryoutTutor')) {
      document.getElementById('tutorTryoutForm')?.reset();
      new bootstrap.Modal(document.getElementById('modalTryout')).show();
      return;
    }

    const delExamBtn = event.target.closest('.btn-delete-exam');
    if (delExamBtn) {
      const id = Number(delExamBtn.dataset.id);
      if (await confirmAction('Hapus try out ini beserta riwayat nilainya?')) {
        S.state.exams = S.state.exams.filter(e => Number(e.id) !== id);
        S.state.examResults = S.state.examResults.filter(r => Number(r.exam_id) !== id);
        S.save();
        renderCurrentRoute();
        toast('Try Out Dihapus');
      }
      return;
    }

    const delResBtn = event.target.closest('.btn-delete-result');
    if (delResBtn) {
      const id = Number(delResBtn.dataset.id);
      if (await confirmAction('Hapus data nilai ini?')) {
        S.state.examResults = S.state.examResults.filter(r => Number(r.id) !== id);
        S.save();
        renderCurrentRoute();
        toast('Nilai Dihapus');
      }
      return;
    }

    // 18. Admin Users CRUD
    if (event.target.closest('#btnAddUserAdmin')) {
      document.getElementById('adminUserForm')?.reset();
      document.getElementById('adminUserId').value = '';
      new bootstrap.Modal(document.getElementById('modalUserAdmin')).show();
      return;
    }

    const editUserBtn = event.target.closest('.btn-edit-user');
    if (editUserBtn) {
      const u = S.state.users.find(item => Number(item.id) === Number(editUserBtn.dataset.id));
      if (u) {
        document.getElementById('adminUserId').value = u.id;
        document.getElementById('adminUserRole').value = u.role;
        document.getElementById('adminUserStatus').value = u.status || 'aktif';
        document.getElementById('adminUserPassword').value = u.password || 'password123';
        document.getElementById('adminUserNama').value = u.nama || '';
        document.getElementById('adminUserEmail').value = u.email || '';
        document.getElementById('adminUserHp').value = u.no_hp || '';
        document.getElementById('adminUserKelas').value = u.kelas || '';
        document.getElementById('adminUserSekolah').value = u.sekolah || '';
        document.getElementById('adminUserSpesialisasi').value = u.spesialisasi || '';
        document.getElementById('adminUserPendidikan').value = u.pendidikan || '';
        document.getElementById('adminUserHonor').value = u.honor_per_jam || 100000;
        document.getElementById('adminUserBio').value = u.bio || '';
        new bootstrap.Modal(document.getElementById('modalUserAdmin')).show();
      }
      return;
    }

    const delUserBtn = event.target.closest('.btn-delete-user');
    if (delUserBtn) {
      const id = Number(delUserBtn.dataset.id);
      if (await confirmAction('Hapus akun pengguna ini?')) {
        S.state.users = S.state.users.filter(u => Number(u.id) !== id);
        S.save();
        renderCurrentRoute();
        toast('Akun Pengguna Dihapus');
      }
      return;
    }

    // 19. Admin Program & Package CRUD
    if (event.target.closest('#btnAddProgramAdmin')) {
      document.getElementById('adminProgramForm')?.reset();
      document.getElementById('progId').value = '';
      new bootstrap.Modal(document.getElementById('modalProgramAdmin')).show();
      return;
    }

    const editProgBtn = event.target.closest('.btn-edit-program');
    if (editProgBtn) {
      const p = S.state.programs.find(item => Number(item.id) === Number(editProgBtn.dataset.id));
      if (p) {
        document.getElementById('progId').value = p.id;
        document.getElementById('progNama').value = p.nama;
        document.getElementById('progKategori').value = p.kategori || 'Sains';
        document.getElementById('progHarga').value = p.harga_mulai || 400000;
        document.getElementById('progStatus').value = p.status || 'aktif';
        document.getElementById('progDeskripsi').value = p.deskripsi || '';
        new bootstrap.Modal(document.getElementById('modalProgramAdmin')).show();
      }
      return;
    }

    const delProgBtn = event.target.closest('.btn-delete-program');
    if (delProgBtn) {
      const id = Number(delProgBtn.dataset.id);
      if (await confirmAction('Hapus program belajar ini?')) {
        S.state.programs = S.state.programs.filter(p => Number(p.id) !== id);
        S.save();
        renderCurrentRoute();
        toast('Program Dihapus');
      }
      return;
    }

    if (event.target.closest('#btnAddPackageAdmin')) {
      document.getElementById('adminPackageForm')?.reset();
      document.getElementById('pkgId').value = '';
      new bootstrap.Modal(document.getElementById('modalPackageAdmin')).show();
      return;
    }

    const editPkgBtn = event.target.closest('.btn-edit-package');
    if (editPkgBtn) {
      const pkg = S.state.packages.find(item => Number(item.id) === Number(editPkgBtn.dataset.id));
      if (pkg) {
        document.getElementById('pkgId').value = pkg.id;
        document.getElementById('pkgProgram').value = pkg.program_id;
        document.getElementById('pkgNama').value = pkg.nama;
        document.getElementById('pkgHarga').value = pkg.harga;
        document.getElementById('pkgDurasi').value = pkg.durasi_bulan;
        document.getElementById('pkgPertemuan').value = pkg.jumlah_pertemuan;
        document.getElementById('pkgDeskripsi').value = pkg.deskripsi || '';
        document.getElementById('pkgFitur').value = (pkg.fitur || []).join(', ');
        document.getElementById('pkgStatus').value = pkg.status || 'aktif';
        document.getElementById('pkgPopular').checked = !!pkg.is_popular;
        new bootstrap.Modal(document.getElementById('modalPackageAdmin')).show();
      }
      return;
    }

    const delPkgBtn = event.target.closest('.btn-delete-package');
    if (delPkgBtn) {
      const id = Number(delPkgBtn.dataset.id);
      if (await confirmAction('Hapus paket belajar ini?')) {
        S.state.packages = S.state.packages.filter(p => Number(p.id) !== id);
        S.save();
        renderCurrentRoute();
        toast('Paket Belajar Dihapus');
      }
      return;
    }

    // 20. Admin Class CRUD
    if (event.target.closest('#btnAddClassAdmin')) {
      document.getElementById('adminClassForm')?.reset();
      document.getElementById('clsId').value = '';
      new bootstrap.Modal(document.getElementById('modalClassAdmin')).show();
      return;
    }

    const editClsBtn = event.target.closest('.btn-edit-class');
    if (editClsBtn) {
      const cls = S.state.classes.find(item => Number(item.id) === Number(editClsBtn.dataset.id));
      if (cls) {
        document.getElementById('clsId').value = cls.id;
        document.getElementById('clsNama').value = cls.nama;
        document.getElementById('clsPackage').value = cls.package_id;
        document.getElementById('clsTutor').value = cls.tutor_id;
        document.getElementById('clsJenjang').value = cls.jenjang || 'SMP';
        document.getElementById('clsKapasitas').value = cls.kapasitas || 20;
        document.getElementById('clsDeskripsi').value = cls.deskripsi || '';
        document.getElementById('clsStatus').value = cls.status || 'aktif';
        new bootstrap.Modal(document.getElementById('modalClassAdmin')).show();
      }
      return;
    }

    const delClsBtn = event.target.closest('.btn-delete-class');
    if (delClsBtn) {
      const id = Number(delClsBtn.dataset.id);
      if (await confirmAction('Hapus kelas ini?')) {
        S.state.classes = S.state.classes.filter(c => Number(c.id) !== id);
        S.save();
        renderCurrentRoute();
        toast('Kelas Dihapus');
      }
      return;
    }

    // 21. Admin Verify / Reject Payment
    const verifyPayBtn = event.target.closest('.btn-verify-payment');
    if (verifyPayBtn) {
      const id = Number(verifyPayBtn.dataset.id);
      const newStatus = verifyPayBtn.dataset.status;
      const p = S.state.payments.find(item => Number(item.id) === id);
      if (!p) return;

      const msg = newStatus === 'lunas'
        ? `Verifikasi pembayaran invoice ${p.invoice} sebagai LUNAS dan aktifkan kelas siswa?`
        : `Tolak bukti pembayaran untuk invoice ${p.invoice}?`;
      if (await confirmAction(msg)) {
        p.status = newStatus;
        if (newStatus === 'lunas') {
          p.paid_at = '15 November 2026';
          p.catatan_admin = 'Pembayaran telah diverifikasi oleh Admin.';
          const existsEnroll = S.state.enrollments.find(e => Number(e.siswa_id) === Number(p.siswa_id) && Number(e.class_id) === Number(p.class_id));
          if (!existsEnroll && p.class_id) {
            S.state.enrollments.push({
              id: S.nextId('enrollments'),
              siswa_id: Number(p.siswa_id),
              class_id: Number(p.class_id),
              package_id: Number(p.package_id),
              status: 'aktif',
              created_at: '2026-11-15'
            });
          }
          S.state.notifications.unshift({
            id: S.nextId('notifications'),
            user_id: Number(p.siswa_id),
            judul: 'Pembayaran Lunas & Diverifikasi',
            pesan: `Invoice ${p.invoice} telah diverifikasi oleh Admin. Akses kelas dan unduhan Invoice PNG sudah aktif!`,
            dibaca: false,
            tanggal: '15 November 2026'
          });
        } else {
          p.catatan_admin = 'Bukti transfer kurang jelas / belum sesuai nominal. Silakan unggah ulang.';
        }
        S.save();
        renderCurrentRoute();
        toast(newStatus === 'lunas' ? 'Pembayaran Diverifikasi (Lunas)' : 'Pembayaran Ditolak');
      }
      return;
    }

    // 22. Admin Slider Order / Toggle / Delete
    const moveSliderBtn = event.target.closest('.btn-move-slider');
    if (moveSliderBtn) {
      const id = Number(moveSliderBtn.dataset.id);
      const dir = moveSliderBtn.dataset.dir;
      const sorted = [...S.state.sliders].sort((a, b) => Number(a.urutan) - Number(b.urutan));
      const idx = sorted.findIndex(s => Number(s.id) === id);
      const swapIdx = dir === 'up' ? idx - 1 : idx + 1;
      if (idx >= 0 && swapIdx >= 0 && swapIdx < sorted.length) {
        const tmp = sorted[idx].urutan;
        sorted[idx].urutan = sorted[swapIdx].urutan;
        sorted[swapIdx].urutan = tmp;
        S.save();
        renderCurrentRoute();
      }
      return;
    }

    const toggleSliderBtn = event.target.closest('.btn-toggle-slider');
    if (toggleSliderBtn) {
      const s = S.state.sliders.find(item => Number(item.id) === Number(toggleSliderBtn.dataset.id));
      if (s) {
        s.status = s.status === 'aktif' ? 'nonaktif' : 'aktif';
        S.save();
        renderCurrentRoute();
        toast(`Status Banner: ${s.status.toUpperCase()}`);
      }
      return;
    }

    const delSliderBtn = event.target.closest('.btn-delete-slider');
    if (delSliderBtn) {
      const id = Number(delSliderBtn.dataset.id);
      if (await confirmAction('Hapus banner promosi ini?')) {
        S.state.sliders = S.state.sliders.filter(s => Number(s.id) !== id);
        S.save();
        renderCurrentRoute();
        toast('Banner Dihapus');
      }
      return;
    }

    // 23. Admin Blog, Testimoni, Coupon, FAQ triggers
    if (event.target.closest('#btnAddBlogAdmin')) {
      document.getElementById('adminBlogForm')?.reset();
      document.getElementById('blogId').value = '';
      new bootstrap.Modal(document.getElementById('modalBlogAdmin')).show();
      return;
    }
    const editBlogBtn = event.target.closest('.btn-edit-blog');
    if (editBlogBtn) {
      const b = S.state.blogs.find(item => Number(item.id) === Number(editBlogBtn.dataset.id));
      if (b) {
        document.getElementById('blogId').value = b.id;
        document.getElementById('blogJudul').value = b.judul;
        document.getElementById('blogPenulis').value = b.penulis;
        document.getElementById('blogRingkasan').value = b.ringkasan;
        document.getElementById('blogKonten').value = b.konten;
        document.getElementById('blogStatus').value = b.status;
        new bootstrap.Modal(document.getElementById('modalBlogAdmin')).show();
      }
      return;
    }
    const delBlogBtn = event.target.closest('.btn-delete-blog');
    if (delBlogBtn) {
      const id = Number(delBlogBtn.dataset.id);
      if (await confirmAction('Hapus artikel blog ini?')) {
        S.state.blogs = S.state.blogs.filter(b => Number(b.id) !== id);
        S.save();
        renderCurrentRoute();
        toast('Artikel Dihapus');
      }
      return;
    }

    if (event.target.closest('#btnAddTestiAdmin')) {
      document.getElementById('adminTestiForm')?.reset();
      document.getElementById('testiId').value = '';
      new bootstrap.Modal(document.getElementById('modalTestiAdmin')).show();
      return;
    }
    const editTestiBtn = event.target.closest('.btn-edit-testi');
    if (editTestiBtn) {
      const t = S.state.testimonials.find(item => Number(item.id) === Number(editTestiBtn.dataset.id));
      if (t) {
        document.getElementById('testiId').value = t.id;
        document.getElementById('testiNama').value = t.nama;
        document.getElementById('testiInfo').value = t.info;
        document.getElementById('testiPesan').value = t.pesan;
        document.getElementById('testiRating').value = t.rating || 5;
        document.getElementById('testiStatus').value = t.status || 'aktif';
        new bootstrap.Modal(document.getElementById('modalTestiAdmin')).show();
      }
      return;
    }
    const delTestiBtn = event.target.closest('.btn-delete-testi');
    if (delTestiBtn) {
      const id = Number(delTestiBtn.dataset.id);
      if (await confirmAction('Hapus testimoni ini?')) {
        S.state.testimonials = S.state.testimonials.filter(t => Number(t.id) !== id);
        S.save();
        renderCurrentRoute();
        toast('Testimoni Dihapus');
      }
      return;
    }

    if (event.target.closest('#btnAddCouponAdmin')) {
      document.getElementById('adminCouponForm')?.reset();
      document.getElementById('couponId').value = '';
      new bootstrap.Modal(document.getElementById('modalCouponAdmin')).show();
      return;
    }
    const editCouponBtn = event.target.closest('.btn-edit-coupon');
    if (editCouponBtn) {
      const c = S.state.coupons.find(item => Number(item.id) === Number(editCouponBtn.dataset.id));
      if (c) {
        document.getElementById('couponId').value = c.id;
        document.getElementById('couponKode').value = c.kode;
        document.getElementById('couponTipe').value = c.tipe;
        document.getElementById('couponNilai').value = c.nilai;
        document.getElementById('couponKuota').value = c.kuota;
        document.getElementById('couponExp').value = c.berlaku_sampai;
        document.getElementById('couponStatus').value = c.status;
        new bootstrap.Modal(document.getElementById('modalCouponAdmin')).show();
      }
      return;
    }
    const delCouponBtn = event.target.closest('.btn-delete-coupon');
    if (delCouponBtn) {
      const id = Number(delCouponBtn.dataset.id);
      if (await confirmAction('Hapus kupon diskon ini?')) {
        S.state.coupons = S.state.coupons.filter(c => Number(c.id) !== id);
        S.save();
        renderCurrentRoute();
        toast('Kupon Dihapus');
      }
      return;
    }

    if (event.target.closest('#btnAddFaqAdmin')) {
      document.getElementById('adminFaqForm')?.reset();
      new bootstrap.Modal(document.getElementById('modalFaqAdmin')).show();
      return;
    }
    const delFaqBtn = event.target.closest('.btn-delete-faq');
    if (delFaqBtn) {
      const id = Number(delFaqBtn.dataset.id);
      if (await confirmAction('Hapus FAQ ini?')) {
        S.state.faqs = S.state.faqs.filter(f => Number(f.id) !== id);
        S.save();
        renderCurrentRoute();
        toast('FAQ Dihapus');
      }
      return;
    }

    // 24. Admin Payment Methods CRUD
    if (event.target.closest('#btnAddPaymentMethod')) {
      document.getElementById('adminPayMethodForm')?.reset();
      document.getElementById('pmId').value = '';
      new bootstrap.Modal(document.getElementById('modalPayMethodAdmin')).show();
      return;
    }
    const editPmBtn = event.target.closest('.btn-edit-paymethod');
    if (editPmBtn) {
      const pm = S.state.paymentMethods.find(item => Number(item.id) === Number(editPmBtn.dataset.id));
      if (pm) {
        document.getElementById('pmId').value = pm.id;
        document.getElementById('pmNama').value = pm.nama;
        document.getElementById('pmTipe').value = pm.tipe;
        document.getElementById('pmNomor').value = pm.nomor;
        document.getElementById('pmAtasNama').value = pm.atas_nama;
        document.getElementById('pmCatatan').value = pm.catatan || '';
        document.getElementById('pmStatus').value = pm.status || 'aktif';
        new bootstrap.Modal(document.getElementById('modalPayMethodAdmin')).show();
      }
      return;
    }
    const delPmBtn = event.target.closest('.btn-delete-paymethod');
    if (delPmBtn) {
      const id = Number(delPmBtn.dataset.id);
      if (await confirmAction('Hapus metode pembayaran manual ini?')) {
        S.state.paymentMethods = S.state.paymentMethods.filter(m => Number(m.id) !== id);
        S.save();
        navigate('#/admin/pengaturan?tab=pembayaran');
        renderCurrentRoute();
        toast('Metode Pembayaran Dihapus');
      }
      return;
    }

    // 25. Reset Demo Data
    if (event.target.closest('#btnResetDemoData')) {
      if (await confirmAction('Kembalikan seluruh data aplikasi ke kondisi awal (default)?')) {
        S.reset();
        navigate('#/admin/dashboard');
        toast('Data Berhasil Direset');
      }
      return;
    }
  });

  // Global Delegated Form Submit Listener
  document.addEventListener('submit', async function (event) {
    const form = event.target;

    // 1. Login Form
    if (form.id === 'loginForm') {
      event.preventDefault();
      const email = (form.email.value || '').trim().toLowerCase();
      const user = S.state.users.find(u => u.email.toLowerCase() === email) || S.state.users.find(u => u.role === 'siswa');
      if (user) {
        S.setCurrentUser(user.id);
        const dest = user.role === 'admin' ? '#/admin/dashboard' : (user.role === 'tutor' ? '#/tutor/dashboard' : '#/siswa/dashboard');
        navigate(dest);
        toast(`Selamat datang, ${user.nama}!`);
      }
      return;
    }

    // 2. Register Form
    if (form.id === 'registerForm') {
      event.preventDefault();
      const nama = (form.nama.value || '').trim();
      const email = (form.email.value || '').trim();
      const no_hp = (form.no_hp.value || '').trim();
      const kelas = form.kelas.value || 'Kelas 10';
      const sekolah = (form.sekolah.value || '').trim() || 'SMA Indonesia';
      const password = form.password.value || 'password123';

      if (nama.length < 3 || !email) {
        toast('Data belum lengkap', 'Pastikan nama dan email diisi dengan benar.', 'warning');
        return;
      }
      const newUser = {
        id: S.nextId('users'),
        role: 'siswa',
        nama,
        email,
        password,
        no_hp,
        kelas,
        sekolah,
        kota: 'Jakarta',
        alamat: '',
        status: 'aktif',
        avatar: 'assets/img/avatar.svg',
        created_at: '2026-11-15'
      };
      S.state.users.push(newUser);
      S.setCurrentUser(newUser.id);
      S.save();
      navigate('#/siswa/dashboard');
      toast('Pendaftaran Berhasil!', `Selamat bergabung di Bimbel Indonesia, ${nama}.`);
      return;
    }

    // 3. Blog Search Form
    if (form.id === 'blogSearchForm') {
      event.preventDefault();
      const q = encodeURIComponent((form.q.value || '').trim());
      navigate(`#/blog?q=${q}`);
      return;
    }

    // 4. Siswa Checkout Form -> Create Invoice
    if (form.id === 'siswaCheckoutForm') {
      event.preventDefault();
      const user = S.getCurrentUser() || S.state.users.find(u => u.role === 'siswa');
      const pkgId = Number(form.package_id.value);
      const classId = Number(form.class_id.value);
      const metode = form.metode?.value || 'bank_transfer';
      const code = (form.kupon.value || '').trim().toUpperCase();
      const pkg = S.state.packages.find(p => Number(p.id) === pkgId) || S.state.packages[0];

      let diskon = 0;
      let usedCode = '';
      if (code) {
        const coupon = S.state.coupons.find(c => c.kode.toUpperCase() === code && c.status === 'aktif');
        if (coupon) {
          diskon = coupon.tipe === 'persen' ? Math.round(pkg.harga * (Number(coupon.nilai) / 100)) : Number(coupon.nilai);
          usedCode = coupon.kode;
          coupon.terpakai = (Number(coupon.terpakai) || 0) + 1;
        }
      }

      const nominal = Math.max(0, Number(pkg.harga) - diskon);
      const randHex = Math.floor(100000 + Math.random() * 900000).toString(16).toUpperCase();
      const newPayment = {
        id: S.nextId('payments'),
        invoice: `INV-20261115-${randHex}`,
        siswa_id: user.id,
        package_id: pkg.id,
        class_id: classId,
        harga_awal: pkg.harga,
        diskon,
        kupon: usedCode,
        nominal,
        metode,
        status: 'pending',
        tanggal: '2026-11-15',
        paid_at: '',
        bukti: '',
        catatan_admin: ''
      };
      S.state.payments.unshift(newPayment);
      S.save();
      navigate(`#/siswa/pembayaran?invoice=${newPayment.id}`);
      toast('Invoice Berhasil Dibuat!', `Nomor Invoice: ${newPayment.invoice}`);
      return;
    }

    // 5. Siswa Upload Bukti Pembayaran Form
    if (form.id === 'uploadBuktiForm') {
      event.preventDefault();
      const payId = Number(form.payment_id.value);
      const payment = S.state.payments.find(p => Number(p.id) === payId);
      if (!payment) return;

      const fileInput = document.getElementById('buktiFileInput');
      const file = fileInput?.files?.[0];
      let dataUrl = '';
      if (file) {
        dataUrl = await S.readFileAsDataURL(file);
      } else {
        dataUrl = 'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="400" height="520" viewBox="0 0 400 520"><rect width="400" height="520" rx="18" fill="#f8fafc" stroke="#cbd5e1" stroke-width="3"/><rect x="28" y="28" width="344" height="70" rx="12" fill="#176b59"/><text x="50" y="62" fill="#fff" font-family="Arial" font-weight="bold" font-size="18">BUKTI TRANSFER SISWA</text><text x="50" y="84" fill="#d1fae5" font-family="Arial" font-size="12">15/11/2026 · ${payment.invoice}</text><text x="40" y="160" fill="#64748b" font-family="Arial" font-size="12">NOMINAL</text><text x="40" y="195" fill="#047857" font-family="Arial" font-weight="bold" font-size="26">Rp ${Number(payment.nominal).toLocaleString('id-ID')}</text><text x="40" y="260" fill="#0f172a" font-family="Arial" font-weight="bold" font-size="14">Menunggu Verifikasi Admin</text></svg>`);
      }

      payment.bukti = dataUrl;
      payment.metode = form.metode?.value || payment.metode || 'bank_transfer';
      payment.status = 'menunggu_verifikasi';
      S.save();
      navigate(`#/siswa/pembayaran?invoice=${payment.id}`);
      renderCurrentRoute();
      toast('Bukti Pembayaran Diunggah!', 'Admin akan segera memverifikasi pembayaran Anda.');
      return;
    }

    // 6. Siswa Materi Filter
    if (form.id === 'siswaMateriFilterForm') {
      event.preventDefault();
      const q = encodeURIComponent(form.q.value || '');
      const cid = form.class_id.value || '0';
      navigate(`#/siswa/materi?q=${q}&class_id=${cid}`);
      return;
    }

    // 7. Siswa Profile & Password Forms
    if (form.id === 'siswaProfileForm') {
      event.preventDefault();
      const user = S.getCurrentUser();
      if (!user) return;
      user.nama = form.nama.value;
      user.email = form.email.value;
      user.no_hp = form.no_hp.value;
      user.tanggal_lahir = form.tanggal_lahir.value;
      user.kelas = form.kelas.value;
      user.sekolah = form.sekolah.value;
      user.kota = form.kota.value;
      user.alamat = form.alamat.value;
      const file = document.getElementById('siswaAvatarInput')?.files?.[0];
      if (file) {
        user.avatar = await S.readFileAsDataURL(file);
      }
      S.save();
      renderCurrentRoute();
      toast('Profil Berhasil Disimpan');
      return;
    }

    if (form.id === 'siswaPasswordForm' || form.id === 'tutorPasswordForm') {
      event.preventDefault();
      if (form.new_password.value !== form.confirm_password.value) {
        toast('Konfirmasi password tidak cocok', '', 'error');
        return;
      }
      const user = S.getCurrentUser();
      if (user) {
        user.password = form.new_password.value;
        S.save();
      }
      form.reset();
      toast('Password Berhasil Diperbarui');
      return;
    }

    // 8. Run Online Try Out Submit
    if (form.id === 'runTryoutForm') {
      event.preventDefault();
      const user = S.getCurrentUser() || S.state.users.find(u => u.role === 'siswa');
      const examId = Number(document.getElementById('runTryoutExamId').value);
      const exam = S.state.exams.find(e => Number(e.id) === examId);
      let questions = S.state.questions.filter(q => exam && Number(q.class_id) === Number(exam.class_id) && q.status === 'aktif');
      if (questions.length === 0) questions = S.state.questions.filter(q => q.status === 'aktif');

      let correct = 0;
      questions.forEach(q => {
        const chosen = form.querySelector(`input[name="q_${q.id}"]:checked`)?.value;
        if (chosen && chosen.toUpperCase() === String(q.jawaban_benar).toUpperCase()) {
          correct++;
        }
      });
      const score = questions.length ? +((correct / questions.length) * 100).toFixed(2) : 100;
      S.state.examResults.unshift({
        id: S.nextId('examResults'),
        exam_id: examId,
        siswa_id: user.id,
        nilai: score,
        tanggal: '2026-11-15'
      });
      S.save();
      navigate('#/siswa/riwayat');
      renderCurrentRoute();
      toast(`Try Out Selesai! Nilai: ${score}`, `Benar ${correct} dari ${questions.length} soal.`);
      return;
    }

    // 9. Tutor / Admin Jadwal Form
    if (form.id === 'tutorJadwalForm') {
      event.preventDefault();
      const user = S.getCurrentUser();
      const id = Number(form.id.value);
      const cls = S.state.classes.find(c => Number(c.id) === Number(form.class_id.value));
      const payload = {
        class_id: Number(form.class_id.value),
        tutor_id: cls ? Number(cls.tutor_id) : (user ? user.id : 2),
        tanggal: form.tanggal.value,
        jam_mulai: form.jam_mulai.value,
        jam_selesai: form.jam_selesai.value,
        topik: form.topik.value,
        meeting_link: form.meeting_link.value || 'https://meet.google.com/bimbel-kelas-online',
        status: form.status.value || 'terjadwal'
      };
      if (id) {
        const existing = S.state.schedules.find(s => Number(s.id) === id);
        if (existing) Object.assign(existing, payload);
      } else {
        S.state.schedules.unshift(Object.assign({ id: S.nextId('schedules') }, payload));
      }
      S.save();
      renderCurrentRoute();
      toast('Jadwal Pertemuan Disimpan');
      return;
    }

    // 10. Tutor Absensi Form
    if (form.id === 'tutorAbsensiForm') {
      event.preventDefault();
      const scheduleId = Number(form.schedule_id.value);
      form.querySelectorAll('tr[data-siswa-row]').forEach(row => {
        const siswaId = Number(row.getAttribute('data-siswa-row'));
        const status = form.querySelector(`input[name="status_${siswaId}"]:checked`)?.value || 'hadir';
        const catatan = form.querySelector(`input[name="catatan_${siswaId}"]`)?.value || '';
        const existing = S.state.attendance.find(a => Number(a.schedule_id) === scheduleId && Number(a.siswa_id) === siswaId);
        if (existing) {
          existing.status = status;
          existing.catatan = catatan;
        } else {
          S.state.attendance.push({
            id: S.nextId('attendance'),
            schedule_id: scheduleId,
            siswa_id: siswaId,
            status,
            catatan
          });
        }
      });
      S.save();
      renderCurrentRoute();
      toast('Absensi Pertemuan Berhasil Disimpan');
      return;
    }

    // 11. Tutor Siswa Filter & Honor Filter
    if (form.id === 'tutorSiswaFilterForm') {
      event.preventDefault();
      navigate(`#/tutor/siswa?class_id=${form.class_id.value}`);
      return;
    }
    if (form.id === 'tutorHonorFilterForm') {
      event.preventDefault();
      navigate(`#/tutor/honor?bulan=${form.bulan.value}`);
      return;
    }

    // 12. Tutor Materi Form
    if (form.id === 'tutorMateriForm') {
      event.preventDefault();
      const user = S.getCurrentUser();
      const id = Number(form.id.value);
      const file = document.getElementById('materiFileInput')?.files?.[0];
      let url = form.url.value || 'https://example.com/materi-belajar';
      let file_name = '';
      if (file) {
        url = await S.readFileAsDataURL(file);
        file_name = file.name;
      }
      const payload = {
        class_id: Number(form.class_id.value),
        tutor_id: user ? user.id : 2,
        tipe: form.tipe.value,
        judul: form.judul.value,
        deskripsi: form.deskripsi.value,
        url,
        file_name,
        created_at: '2026-11-15'
      };
      if (id) {
        const existing = S.state.materials.find(m => Number(m.id) === id);
        if (existing) Object.assign(existing, payload);
      } else {
        S.state.materials.unshift(Object.assign({ id: S.nextId('materials') }, payload));
      }
      S.save();
      renderCurrentRoute();
      toast('Materi Belajar Disimpan');
      return;
    }

    // 13. Tutor Soal Form
    if (form.id === 'tutorSoalForm') {
      event.preventDefault();
      const user = S.getCurrentUser();
      const id = Number(form.id.value);
      const payload = {
        class_id: Number(form.class_id.value),
        tutor_id: user ? user.id : 2,
        pertanyaan: form.pertanyaan.value,
        opsi_a: form.opsi_a.value,
        opsi_b: form.opsi_b.value,
        opsi_c: form.opsi_c.value,
        opsi_d: form.opsi_d.value,
        jawaban_benar: form.jawaban_benar.value,
        pembahasan: form.pembahasan.value,
        status: form.status.value,
        created_at: '2026-11-15'
      };
      if (id) {
        const existing = S.state.questions.find(q => Number(q.id) === id);
        if (existing) Object.assign(existing, payload);
      } else {
        S.state.questions.unshift(Object.assign({ id: S.nextId('questions') }, payload));
      }
      S.save();
      renderCurrentRoute();
      toast('Soal Pilihan Ganda Disimpan');
      return;
    }

    // 14. Tutor Tryout & Nilai Forms
    if (form.id === 'tutorTryoutForm') {
      event.preventDefault();
      const user = S.getCurrentUser();
      S.state.exams.unshift({
        id: S.nextId('exams'),
        class_id: Number(form.class_id.value),
        tutor_id: user ? user.id : 2,
        judul: form.judul.value,
        deskripsi: form.deskripsi.value,
        durasi_menit: Number(form.durasi_menit.value) || 30,
        jumlah_soal: Number(form.jumlah_soal.value) || 10,
        status: form.status.value || 'aktif',
        created_at: '2026-11-15'
      });
      S.save();
      renderCurrentRoute();
      toast('Try Out Baru Dibuat');
      return;
    }

    if (form.id === 'tutorNilaiForm') {
      event.preventDefault();
      S.state.examResults.unshift({
        id: S.nextId('examResults'),
        exam_id: Number(form.exam_id.value),
        siswa_id: Number(form.siswa_id.value),
        nilai: Number(form.nilai.value) || 0,
        tanggal: '2026-11-15'
      });
      S.save();
      renderCurrentRoute();
      toast('Nilai Siswa Berhasil Disimpan');
      return;
    }

    // 15. Tutor Profile Form
    if (form.id === 'tutorProfileForm') {
      event.preventDefault();
      const user = S.getCurrentUser();
      if (!user) return;
      user.nama = form.nama.value;
      user.email = form.email.value;
      user.no_hp = form.no_hp.value;
      user.spesialisasi = form.spesialisasi.value;
      user.pendidikan = form.pendidikan.value;
      user.bio = form.bio.value;
      const file = document.getElementById('tutorAvatarInput')?.files?.[0];
      if (file) {
        user.avatar = await S.readFileAsDataURL(file);
      }
      S.save();
      renderCurrentRoute();
      toast('Profil Tutor Disimpan');
      return;
    }

    // 16. Global WhatsApp Form
    if (form.id === 'waForm') {
      event.preventDefault();
      const nama = document.getElementById('waNama').value || 'Penerima';
      const phone = (document.getElementById('waNoHp').value || '').replace(/[^0-9]/g, '');
      const pesan = document.getElementById('waPesan').value || '';
      const sender = S.getCurrentUser();

      S.state.waLogs.unshift({
        id: S.nextId('waLogs'),
        penerima_nama: nama,
        no_hp: phone,
        pesan,
        pengirim: sender ? `${sender.nama} (${sender.role})` : 'Sistem',
        tanggal: '15 November 2026 14:30'
      });
      S.save();

      const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(pesan)}`;
      window.open(waUrl, '_blank', 'noopener');
      renderCurrentRoute();
      toast('WhatsApp Siap Dikirim', `Membuka percakapan WhatsApp ke ${nama} (${phone}).`);
      return;
    }

    // 17. Admin User Form
    if (form.id === 'adminUserForm') {
      event.preventDefault();
      const id = Number(form.id.value);
      const payload = {
        role: form.role.value,
        status: form.status.value,
        password: form.password.value || 'password123',
        nama: form.nama.value,
        email: form.email.value,
        no_hp: form.no_hp.value,
        kelas: form.kelas.value,
        sekolah: form.sekolah.value,
        spesialisasi: form.spesialisasi.value,
        pendidikan: form.pendidikan.value,
        honor_per_jam: Number(form.honor_per_jam.value) || 100000,
        bio: form.bio.value
      };
      if (id) {
        const u = S.state.users.find(item => Number(item.id) === id);
        if (u) Object.assign(u, payload);
      } else {
        S.state.users.push(Object.assign({
          id: S.nextId('users'),
          avatar: 'assets/img/avatar.svg',
          created_at: '2026-11-15'
        }, payload));
      }
      S.save();
      renderCurrentRoute();
      toast('Data Pengguna Disimpan');
      return;
    }

    // 18. Admin Program & Package Forms
    if (form.id === 'adminProgramForm') {
      event.preventDefault();
      const id = Number(form.id.value);
      const file = document.getElementById('progThumbFile')?.files?.[0];
      const existing = id ? S.state.programs.find(p => Number(p.id) === id) : null;
      let thumbnail = existing ? existing.thumbnail : 'uploads/programs/program-matematika.svg';
      if (file) thumbnail = await S.readFileAsDataURL(file);

      const payload = {
        nama: form.nama.value,
        kategori: form.kategori.value,
        harga_mulai: Number(form.harga_mulai.value) || 400000,
        status: form.status.value,
        deskripsi: form.deskripsi.value,
        thumbnail
      };
      if (existing) {
        Object.assign(existing, payload);
      } else {
        S.state.programs.push(Object.assign({ id: S.nextId('programs') }, payload));
      }
      S.save();
      renderCurrentRoute();
      toast('Program Belajar Disimpan');
      return;
    }

    if (form.id === 'adminPackageForm') {
      event.preventDefault();
      const id = Number(form.id.value);
      const fitur = (form.fitur.value || '').split(',').map(s => s.trim()).filter(Boolean);
      const payload = {
        program_id: Number(form.program_id.value),
        nama: form.nama.value,
        harga: Number(form.harga.value) || 450000,
        durasi_bulan: Number(form.durasi_bulan.value) || 3,
        jumlah_pertemuan: Number(form.jumlah_pertemuan.value) || 12,
        deskripsi: form.deskripsi.value,
        fitur,
        status: form.status.value,
        is_popular: !!form.is_popular.checked
      };
      if (id) {
        const existing = S.state.packages.find(p => Number(p.id) === id);
        if (existing) Object.assign(existing, payload);
      } else {
        S.state.packages.push(Object.assign({ id: S.nextId('packages') }, payload));
      }
      S.save();
      renderCurrentRoute();
      toast('Paket Belajar Disimpan');
      return;
    }

    // 19. Admin Class Form
    if (form.id === 'adminClassForm') {
      event.preventDefault();
      const id = Number(form.id.value);
      const pkg = S.state.packages.find(p => Number(p.id) === Number(form.package_id.value));
      const payload = {
        nama: form.nama.value,
        package_id: Number(form.package_id.value),
        program_id: pkg ? Number(pkg.program_id) : 1,
        tutor_id: Number(form.tutor_id.value),
        jenjang: form.jenjang.value,
        kapasitas: Number(form.kapasitas.value) || 20,
        deskripsi: form.deskripsi.value,
        status: form.status.value
      };
      if (id) {
        const existing = S.state.classes.find(c => Number(c.id) === id);
        if (existing) Object.assign(existing, payload);
      } else {
        S.state.classes.push(Object.assign({ id: S.nextId('classes') }, payload));
      }
      S.save();
      renderCurrentRoute();
      toast('Data Kelas Disimpan');
      return;
    }

    // 20. Admin Banner / Slider Upload Form
    if (form.id === 'adminSliderForm') {
      event.preventDefault();
      const file = document.getElementById('sliderImageInput')?.files?.[0];
      let image = 'uploads/sliders/banner-1.jpg';
      if (file) {
        image = await S.readFileAsDataURL(file);
      }
      S.state.sliders.push({
        id: S.nextId('sliders'),
        title: form.title.value,
        image,
        urutan: Number(form.urutan.value) || (S.state.sliders.length + 1),
        status: form.status.value || 'aktif',
        created_at: '2026-11-15'
      });
      S.save();
      renderCurrentRoute();
      toast('Banner Berhasil Diunggah!');
      return;
    }

    // 21. Admin Blog, Testimoni, Coupon, FAQ Forms
    if (form.id === 'adminBlogForm') {
      event.preventDefault();
      const id = Number(form.id.value);
      const file = document.getElementById('blogThumbFile')?.files?.[0];
      const existing = id ? S.state.blogs.find(b => Number(b.id) === id) : null;
      let thumbnail = existing ? existing.thumbnail : 'uploads/blog/blog-belajar.svg';
      if (file) thumbnail = await S.readFileAsDataURL(file);

      const judul = form.judul.value;
      const slug = judul.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      const payload = {
        judul,
        slug,
        penulis: form.penulis.value || 'Tim Bimbel Indonesia',
        tanggal: '15 November 2026',
        thumbnail,
        ringkasan: form.ringkasan.value,
        konten: form.konten.value,
        status: form.status.value
      };
      if (existing) Object.assign(existing, payload);
      else S.state.blogs.unshift(Object.assign({ id: S.nextId('blogs') }, payload));
      S.save();
      renderCurrentRoute();
      toast('Artikel Blog Disimpan');
      return;
    }

    if (form.id === 'adminTestiForm') {
      event.preventDefault();
      const id = Number(form.id.value);
      const payload = {
        nama: form.nama.value,
        info: form.info.value,
        pesan: form.pesan.value,
        rating: Number(form.rating.value) || 5,
        avatar: 'assets/img/avatar.svg',
        status: form.status.value
      };
      if (id) {
        const existing = S.state.testimonials.find(t => Number(t.id) === id);
        if (existing) Object.assign(existing, payload);
      } else {
        S.state.testimonials.push(Object.assign({ id: S.nextId('testimonials') }, payload));
      }
      S.save();
      renderCurrentRoute();
      toast('Testimoni Disimpan');
      return;
    }

    if (form.id === 'adminCouponForm') {
      event.preventDefault();
      const id = Number(form.id.value);
      const payload = {
        kode: form.kode.value.trim().toUpperCase(),
        tipe: form.tipe.value,
        nilai: Number(form.nilai.value) || 0,
        kuota: Number(form.kuota.value) || 50,
        terpakai: 0,
        berlaku_sampai: form.berlaku_sampai.value,
        status: form.status.value
      };
      if (id) {
        const existing = S.state.coupons.find(c => Number(c.id) === id);
        if (existing) Object.assign(existing, payload);
      } else {
        S.state.coupons.push(Object.assign({ id: S.nextId('coupons') }, payload));
      }
      S.save();
      renderCurrentRoute();
      toast('Kupon Diskon Disimpan');
      return;
    }

    if (form.id === 'adminFaqForm') {
      event.preventDefault();
      S.state.faqs.push({
        id: S.nextId('faqs'),
        pertanyaan: form.pertanyaan.value,
        jawaban: form.jawaban.value
      });
      S.save();
      renderCurrentRoute();
      toast('FAQ Ditambahkan');
      return;
    }

    // 22. Admin Settings Forms
    if (
      form.id === 'adminSettingsIdentityForm' ||
      form.id === 'adminSettingsContactForm' ||
      form.id === 'adminSettingsCtaForm' ||
      form.id === 'adminSettingsSystemForm'
    ) {
      event.preventDefault();
      const fd = new FormData(form);
      fd.forEach((value, key) => {
        S.state.settings[key] = value;
      });
      S.save();
      renderCurrentRoute();
      toast('Pengaturan Berhasil Disimpan');
      return;
    }

    if (form.id === 'adminPayMethodForm') {
      event.preventDefault();
      const id = Number(form.id.value);
      const file = document.getElementById('pmQrFile')?.files?.[0];
      const existing = id ? S.state.paymentMethods.find(m => Number(m.id) === id) : null;
      let qr_image = existing ? existing.qr_image : '';
      if (file) qr_image = await S.readFileAsDataURL(file);

      const payload = {
        nama: form.nama.value,
        tipe: form.tipe.value,
        nomor: form.nomor.value,
        atas_nama: form.atas_nama.value,
        catatan: form.catatan.value,
        qr_image,
        status: form.status.value
      };
      if (existing) Object.assign(existing, payload);
      else S.state.paymentMethods.push(Object.assign({ id: S.nextId('paymentMethods') }, payload));
      S.save();
      navigate('#/admin/pengaturan?tab=pembayaran');
      renderCurrentRoute();
      toast('Metode Pembayaran Disimpan');
      return;
    }
  });

  window.addEventListener('hashchange', renderCurrentRoute);
  window.addEventListener('DOMContentLoaded', renderCurrentRoute);
})(window);
