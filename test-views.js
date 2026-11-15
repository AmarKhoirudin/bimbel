const fs = require('fs');
const vm = require('vm');

const mockLocalStorage = {
  data: {},
  getItem(k) { return this.data[k] || null; },
  setItem(k, v) { this.data[k] = String(v); },
  removeItem(k) { delete this.data[k]; },
  clear() { this.data = {}; }
};

const context = {
  window: {},
  console: console,
  localStorage: mockLocalStorage,
  setTimeout: setTimeout,
  clearTimeout: clearTimeout,
  setInterval: setInterval,
  clearInterval: clearInterval,
  URL: {
    createObjectURL: () => 'blob:mock',
    revokeObjectURL: () => {}
  }
};
context.window = context;

vm.createContext(context);

// Load store.js
const storeCode = fs.readFileSync('assets/js/store.js', 'utf8');
vm.runInContext(storeCode, context);
console.log('store.js loaded. BimbelStore available:', !!context.BimbelStore);

// Load views-public.js
const publicCode = fs.readFileSync('assets/js/views-public.js', 'utf8');
vm.runInContext(publicCode, context);
console.log('views-public.js loaded. BimbelPublicViews available:', !!context.BimbelPublicViews);

// Load views-siswa.js
const siswaCode = fs.readFileSync('assets/js/views-siswa.js', 'utf8');
vm.runInContext(siswaCode, context);
console.log('views-siswa.js loaded. BimbelSiswaViews available:', !!context.BimbelSiswaViews);

// Load views-tutor.js
const tutorCode = fs.readFileSync('assets/js/views-tutor.js', 'utf8');
vm.runInContext(tutorCode, context);
console.log('views-tutor.js loaded. BimbelTutorViews available:', !!context.BimbelTutorViews);

// Load views-admin.js
const adminCode = fs.readFileSync('assets/js/views-admin.js', 'utf8');
vm.runInContext(adminCode, context);
console.log('views-admin.js loaded. BimbelAdminViews available:', !!context.BimbelAdminViews);

// Now test executing every render function
const params = new URLSearchParams('');

// Public tests
console.log('Testing Public Views...');
const homeHtml = context.BimbelPublicViews.renderHome(params);
console.log('  renderHome output length:', homeHtml.length);
const blogHtml = context.BimbelPublicViews.renderBlog(params);
console.log('  renderBlog output length:', blogHtml.length);
const loginHtml = context.BimbelPublicViews.renderLogin(params);
console.log('  renderLogin output length:', loginHtml.length);
const regHtml = context.BimbelPublicViews.renderRegister(params);
console.log('  renderRegister output length:', regHtml.length);

// Siswa tests (login as siswa ID 9)
console.log('Testing Siswa Views...');
context.BimbelStore.setCurrentUser(9);
console.log('  Current user:', context.BimbelStore.getCurrentUser().nama);
console.log('  siswa dashboard length:', context.BimbelSiswaViews.renderDashboard(params).length);
console.log('  siswa katalog length:', context.BimbelSiswaViews.renderKatalog(params).length);
console.log('  siswa checkout length:', context.BimbelSiswaViews.renderCheckout(new URLSearchParams('paket=1')).length);
console.log('  siswa pembayaran length:', context.BimbelSiswaViews.renderPembayaran(params).length);
console.log('  siswa kelas length:', context.BimbelSiswaViews.renderKelas(params).length);
console.log('  siswa materi length:', context.BimbelSiswaViews.renderMateri(params).length);
console.log('  siswa riwayat length:', context.BimbelSiswaViews.renderRiwayat(params).length);
console.log('  siswa profil length:', context.BimbelSiswaViews.renderProfil(params).length);

// Tutor tests (login as tutor ID 2)
console.log('Testing Tutor Views...');
context.BimbelStore.setCurrentUser(2);
console.log('  Current user:', context.BimbelStore.getCurrentUser().nama);
console.log('  tutor dashboard length:', context.BimbelTutorViews.renderDashboard(params).length);
console.log('  tutor jadwal length:', context.BimbelTutorViews.renderJadwal(params).length);
console.log('  tutor absensi length:', context.BimbelTutorViews.renderAbsensi(params).length);
console.log('  tutor siswa length:', context.BimbelTutorViews.renderSiswa(params).length);
console.log('  tutor materi length:', context.BimbelTutorViews.renderMateri(params).length);
console.log('  tutor soal length:', context.BimbelTutorViews.renderSoal(params).length);
console.log('  tutor nilai length:', context.BimbelTutorViews.renderNilai(params).length);
console.log('  tutor honor length:', context.BimbelTutorViews.renderHonor(params).length);
console.log('  tutor profil length:', context.BimbelTutorViews.renderProfil(params).length);

// Admin tests (login as admin ID 1)
console.log('Testing Admin Views...');
context.BimbelStore.setCurrentUser(1);
console.log('  Current user:', context.BimbelStore.getCurrentUser().nama);
console.log('  admin dashboard length:', context.BimbelAdminViews.renderDashboard(params).length);
console.log('  admin pengguna length:', context.BimbelAdminViews.renderPengguna(params).length);
console.log('  admin program length:', context.BimbelAdminViews.renderProgram(params).length);
console.log('  admin kelas length:', context.BimbelAdminViews.renderKelas(params).length);
console.log('  admin materi-soal length:', context.BimbelAdminViews.renderMateriSoal(params).length);
console.log('  admin pembayaran length:', context.BimbelAdminViews.renderPembayaran(params).length);
console.log('  admin banner length:', context.BimbelAdminViews.renderBanner(params).length);
console.log('  admin konten length:', context.BimbelAdminViews.renderKonten(params).length);
console.log('  admin laporan length:', context.BimbelAdminViews.renderLaporan(params).length);
console.log('  admin whatsapp length:', context.BimbelAdminViews.renderWhatsapp(params).length);
console.log('  admin pengaturan length:', context.BimbelAdminViews.renderPengaturan(params).length);

console.log('ALL VIEWS RENDERED SUCCESSFULLY WITH ZERO ERRORS!');
