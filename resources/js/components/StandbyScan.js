import { Html5Qrcode } from 'html5-qrcode';
import { appRoute, escapeHtml } from '../utils/helpers';

/**
 * Pengelola layar Standby Scan & kamera QR Code menggunakan html5-qrcode.
 */
export class StandbyScannerController {
    constructor({ onScanSuccess, onSimulateClick }) {
        this.onScanSuccess = onScanSuccess;
        this.onSimulateClick = onSimulateClick;
        this.scanner = null;
        this.cameras = [];
        this.currentCameraIndex = 0;
        this.isRunning = false;
        this.hasTriggeredScan = false;
        this.isSwitching = false;
    }

    /**
     * Render markup layar Standby Scan.
     * @returns {string}
     */
    render() {
        return `
            <section class="flex-1 flex flex-col items-center justify-center px-4 py-6 sm:py-8 animate-fade-up">
                <!-- Peringatan orientasi untuk layar portrait/mobile -->
                <div class="landscape:hidden mb-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium shadow-2xs">
                    <svg class="w-4 h-4 shrink-0 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                    </svg>
                    <span>Putar perangkat ke posisi landscape untuk tampilan terbaik.</span>
                </div>

                <div class="w-full max-w-lg bg-white rounded-3xl shadow-xl shadow-slate-900/5 border border-slate-200/80 p-5 sm:p-8 text-center">
                    <!-- Badge status kamera -->
                    <div id="scanner-badge" class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold mb-4">
                        <span id="scanner-dot" class="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                        <span id="scanner-badge-text">Menyiapkan kamera...</span>
                    </div>

                    <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F2D6B]">
                        STANDBY SCAN
                    </h2>
                    <p class="mt-1.5 text-xs sm:text-sm text-slate-600">
                        Arahkan kamera ke <span class="font-semibold text-slate-800">QR Code</span> untuk memulai pemilihan.
                    </p>

                    <!-- Viewfinder kamera QR -->
                    <div class="relative mx-auto mt-5 sm:mt-6 w-56 h-56 sm:w-68 sm:h-68 rounded-2xl bg-slate-950 overflow-hidden shadow-lg ring-4 ring-slate-100">
                        <div id="qr-reader" class="w-full h-full"></div>

                        <!-- Bingkai sudut pemindaian & garis laser -->
                        <div id="scanner-hud" class="pointer-events-none absolute inset-0 z-10">
                            <div class="absolute top-3.5 left-3.5 w-7 h-7 border-t-[3px] border-l-[3px] border-emerald-400 rounded-tl-lg"></div>
                            <div class="absolute top-3.5 right-3.5 w-7 h-7 border-t-[3px] border-r-[3px] border-emerald-400 rounded-tr-lg"></div>
                            <div class="absolute bottom-3.5 left-3.5 w-7 h-7 border-b-[3px] border-l-[3px] border-emerald-400 rounded-bl-lg"></div>
                            <div class="absolute bottom-3.5 right-3.5 w-7 h-7 border-b-[3px] border-r-[3px] border-emerald-400 rounded-br-lg"></div>

                            <div id="scan-laser" class="hidden absolute inset-x-4 top-3 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_2px_rgba(52,211,153,0.7)] animate-scan-beam"></div>
                        </div>

                        <!-- Fallback ketika kamera belum aktif / tidak tersedia -->
                        <div id="scanner-fallback" class="absolute inset-0 z-20 flex flex-col items-center justify-center p-5 bg-slate-900/95 text-slate-200 text-center">
                            <div class="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center mb-3 border border-slate-700">
                                <svg class="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                                </svg>
                            </div>
                            <p id="scanner-fallback-title" class="text-xs font-semibold text-white">Mengaktifkan Kamera...</p>
                            <p id="scanner-fallback-desc" class="mt-1 text-[11px] text-slate-400 leading-relaxed">
                                Izinkan akses kamera atau gunakan tombol <strong class="text-slate-200">Simulasi Memilih</strong>.
                            </p>
                        </div>
                    </div>

                    <p id="scanner-status-text" class="mt-4 text-xs sm:text-sm font-medium text-slate-500">
                        Menghubungkan ke kamera perangkat...
                    </p>

                    <!-- Tombol aksi -->
                    <div class="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
                        <button
                            type="button"
                            id="btn-switch-camera"
                            class="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 active:scale-[0.98] text-slate-700 border border-slate-300 shadow-2xs text-sm font-semibold transition cursor-pointer"
                        >
                            <svg class="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                            </svg>
                            <span>Tukar Kamera</span>
                        </button>

                        <button
                            type="button"
                            id="btn-simulate-vote"
                            class="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 active:scale-[0.98] text-white shadow-md shadow-blue-700/20 text-sm font-semibold transition cursor-pointer"
                        >
                            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z" />
                            </svg>
                            <span>Simulasi Memilih</span>
                        </button>
                    </div>

                    <div class="mt-5 pt-4 border-t border-slate-100">
                        <a
                            href="${escapeHtml(appRoute('cetak-qr'))}"
                            class="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-800 hover:underline"
                        >
                            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
                            </svg>
                            <span>Cetak / Unduh QR Code untuk Simulasi</span>
                        </a>
                    </div>
                </div>
            </section>
        `;
    }

    /**
     * Pasang event listener dan nyalakan pemindai QR setelah DOM dirender.
     * @returns {Promise<void>}
     */
    async mount() {
        this.hasTriggeredScan = false;

        const switchBtn = document.getElementById('btn-switch-camera');
        const simulateBtn = document.getElementById('btn-simulate-vote');

        switchBtn?.addEventListener('click', () => this.switchCamera());
        simulateBtn?.addEventListener('click', async () => {
            await this.stop();
            this.onSimulateClick();
        });

        await this.start();
    }

    updateUIState({ badgeText, statusText, active = false, fallbackTitle = '', fallbackDesc = '' }) {
        const badge = document.getElementById('scanner-badge');
        const dot = document.getElementById('scanner-dot');
        const badgeEl = document.getElementById('scanner-badge-text');
        const statusEl = document.getElementById('scanner-status-text');
        const fallbackEl = document.getElementById('scanner-fallback');
        const fallbackTitleEl = document.getElementById('scanner-fallback-title');
        const fallbackDescEl = document.getElementById('scanner-fallback-desc');
        const laserEl = document.getElementById('scan-laser');

        if (badgeEl) badgeEl.textContent = badgeText;
        if (statusEl) statusEl.textContent = statusText;

        if (badge && dot) {
            if (active) {
                badge.className = 'inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold mb-4';
                dot.className = 'w-2 h-2 rounded-full bg-emerald-500 animate-pulse';
            } else {
                badge.className = 'inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-xs font-semibold mb-4';
                dot.className = 'w-2 h-2 rounded-full bg-amber-500';
            }
        }

        if (fallbackEl) {
            fallbackEl.classList.toggle('hidden', active);
        }
        if (laserEl) {
            laserEl.classList.toggle('hidden', !active);
        }
        if (fallbackTitleEl && fallbackTitle) {
            fallbackTitleEl.textContent = fallbackTitle;
        }
        if (fallbackDescEl && fallbackDesc) {
            fallbackDescEl.innerHTML = escapeHtml(fallbackDesc);
        }
    }

    /**
     * Inisialisasi kamera dan mulai scan QR.
     * @returns {Promise<void>}
     */
    async start() {
        const readerEl = document.getElementById('qr-reader');
        if (!readerEl) return;

        try {
            const devices = await Html5Qrcode.getCameras();
            this.cameras = devices || [];

            if (this.cameras.length === 0) {
                this.updateUIState({
                    active: false,
                    badgeText: 'Kamera Tidak Ditemukan',
                    statusText: 'Kamera tidak terdeteksi. Gunakan tombol Simulasi Memilih.',
                    fallbackTitle: 'Kamera Tidak Tersedia',
                    fallbackDesc: 'Tidak ada kamera terdeteksi. Klik Simulasi Memilih untuk melanjutkan.',
                });
                return;
            }

            // Pilih kamera belakang secara default jika tersedia
            if (this.currentCameraIndex >= this.cameras.length) {
                this.currentCameraIndex = 0;
            }
            const backCamIdx = this.cameras.findIndex((cam) =>
                /back|rear|environment|belakang/i.test(cam.label || '')
            );
            if (backCamIdx !== -1 && this.currentCameraIndex === 0 && this.cameras.length > 1) {
                this.currentCameraIndex = backCamIdx;
            }

            await this.startWithCamera(this.cameras[this.currentCameraIndex].id);
        } catch (err) {
            const isPermissionErr = /permission|denied|notallowed/i.test(String(err));
            this.updateUIState({
                active: false,
                badgeText: isPermissionErr ? 'Izin Kamera Ditolak' : 'Kamera Tidak Aktif',
                statusText: isPermissionErr
                    ? 'Akses kamera ditolak. Izinkan kamera atau tekan Simulasi Memilih.'
                    : 'Kamera belum siap. Gunakan tombol Simulasi Memilih untuk uji coba.',
                fallbackTitle: isPermissionErr ? 'Akses Kamera Ditolak' : 'Kamera Tidak Dapat Dibuka',
                fallbackDesc: 'Pastikan izin kamera aktif atau gunakan tombol Simulasi Memilih di bawah.',
            });
        }
    }

    async startWithCamera(cameraId) {
        const readerEl = document.getElementById('qr-reader');
        if (!readerEl) return;

        await this.stop();

        this.scanner = new Html5Qrcode('qr-reader', { verbose: false });

        await this.scanner.start(
            cameraId,
            {
                fps: 10,
                qrbox: { width: 200, height: 200 },
                aspectRatio: 1,
            },
            async (decodedText) => {
                if (this.hasTriggeredScan) return;
                this.hasTriggeredScan = true;
                await this.stop();
                this.onScanSuccess(decodedText);
            },
            () => {
                // Abaikan error per-frame saat mencari QR
            }
        );

        this.isRunning = true;
        const activeCam = this.cameras[this.currentCameraIndex];
        const camLabel = activeCam?.label ? ` (${activeCam.label.split('(')[0].trim()})` : '';

        this.updateUIState({
            active: true,
            badgeText: 'Kamera Aktif • Siap Memindai',
            statusText: `Kamera aktif${camLabel}. Arahkan ke QR Code.`,
        });
    }

    /**
     * Ganti kamera jika perangkat memiliki lebih dari satu kamera.
     * @returns {Promise<void>}
     */
    async switchCamera() {
        if (this.isSwitching) return;
        this.isSwitching = true;

        try {
            if (this.cameras.length <= 1) {
                // Coba deteksi ulang atau restart kamera saat ini
                await this.start();
                return;
            }

            this.currentCameraIndex = (this.currentCameraIndex + 1) % this.cameras.length;
            this.updateUIState({
                active: false,
                badgeText: 'Mengganti Kamera...',
                statusText: 'Memindahkan ke kamera berikutnya...',
                fallbackTitle: 'Mengganti Kamera...',
                fallbackDesc: 'Mohon tunggu sebentar.',
            });

            await this.startWithCamera(this.cameras[this.currentCameraIndex].id);
        } catch {
            this.updateUIState({
                active: false,
                badgeText: 'Gagal Tukar Kamera',
                statusText: 'Gagal mengganti kamera. Silakan coba lagi atau gunakan Simulasi Memilih.',
                fallbackTitle: 'Gagal Membuka Kamera',
                fallbackDesc: 'Gunakan kamera lain atau klik Simulasi Memilih.',
            });
        } finally {
            this.isSwitching = false;
        }
    }

    /**
     * Hentikan kamera dengan aman agar tidak meninggalkan stream terbuka.
     * @returns {Promise<void>}
     */
    async stop() {
        if (this.scanner && this.isRunning) {
            try {
                await this.scanner.stop();
            } catch {
                // Abaikan jika sudah berhenti
            }
            try {
                this.scanner.clear();
            } catch {
                // Abaikan
            }
        }
        this.isRunning = false;
        this.scanner = null;
    }
}
