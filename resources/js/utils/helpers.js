/**
 * Ambil URL aset agar tetap valid baik di root maupun di sub-path (/e-voting/).
 * @param {string} relativePath
 * @returns {string}
 */
export function assetUrl(relativePath) {
    const cleanPath = relativePath.replace(/^\/+/, '');
    const meta = document.querySelector('meta[name="asset-base"]');
    const base = meta ? meta.getAttribute('content') || '' : '';

    return base ? `${base}/${cleanPath}` : `/${cleanPath}`;
}

/**
 * Ambil path rute aplikasi agar navigasi (/ dan /cetak-qr) mendukung prefix /e-voting/.
 * @param {string} subpath
 * @returns {string}
 */
export function appRoute(subpath = '') {
    const cleanSub = subpath.replace(/^\/+/, '');
    const meta = document.querySelector('meta[name="app-base"]');
    const serverBase = meta ? meta.getAttribute('content') || '' : '';
    const pathname = window.location.pathname;

    let prefix = serverBase;
    if (!prefix && (pathname === '/e-voting' || pathname.startsWith('/e-voting/'))) {
        prefix = '/e-voting';
    }

    if (!cleanSub) {
        return prefix ? `${prefix}/` : '/';
    }

    return prefix ? `${prefix}/${cleanSub}` : `/${cleanSub}`;
}

/**
 * Escape string HTML untuk mencegah injeksi markup.
 * @param {string} value
 * @returns {string}
 */
export function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

/**
 * Buat kode audit unik untuk struk suara pemilih.
 * @param {string} tpsLabel
 * @returns {string}
 */
export function generateVoteCode(tpsLabel = 'TPS 1') {
    const tpsCode = tpsLabel.replace(/\s+/g, '').toUpperCase();
    const timestamp = Date.now().toString().slice(-10);
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let suffix = '';

    for (let i = 0; i < 4; i += 1) {
        suffix += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return `VOTE-${tpsCode}-${timestamp}-${suffix}`;
}

/**
 * Putar nada umpan balik singkat via Web Audio API saat scan atau konfirmasi suara.
 * @param {'scan' | 'confirm'} type
 */
export function playTone(type) {
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) {
            return;
        }

        const ctx = new AudioCtx();
        const now = ctx.currentTime;
        const notes = type === 'confirm' ? [523.25, 659.25, 783.99] : [660, 880];

        notes.forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + idx * 0.08);
            gain.gain.setValueAtTime(0.08, now + idx * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.14);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now + idx * 0.08);
            osc.stop(now + idx * 0.08 + 0.15);
        });

        setTimeout(() => {
            ctx.close().catch(() => {});
        }, 600);
    } catch {
        // Abaikan jika browser memblokir AudioContext
    }
}

/**
 * Toggle mode layar penuh browser.
 * @returns {Promise<void>}
 */
export async function toggleFullscreen() {
    try {
        if (!document.fullscreenElement) {
            await document.documentElement.requestFullscreen();
        } else {
            await document.exitFullscreen();
        }
    } catch {
        // Abaikan jika browser menolak requestFullscreen
    }
}

/**
 * Render ilustrasi placeholder resmi untuk slot kandidat tanpa foto.
 * @param {string} displayNumber
 * @returns {string}
 */
export function renderPlaceholderAvatar(displayNumber) {
    return `
        <div class="w-full h-full bg-gradient-to-b from-amber-300 via-amber-400 to-amber-500 flex flex-col items-center justify-end relative overflow-hidden select-none">
            <div class="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] [background-size:12px_12px]"></div>
            <svg viewBox="0 0 120 140" class="w-4/5 h-4/5 drop-shadow-sm" aria-hidden="true">
                <!-- Bahu & jas formal -->
                <path d="M14 140 C16 106, 36 96, 60 96 C84 96, 104 106, 106 140 Z" fill="#1E293B" />
                <!-- Kemeja putih -->
                <polygon points="48,96 72,96 60,128" fill="#F8FAFC" />
                <!-- Dasi merah -->
                <polygon points="57,102 63,102 65,134 60,140 55,134" fill="#DC2626" />
                <!-- Leher -->
                <rect x="51" y="79" width="18" height="20" rx="6" fill="#0F172A" />
                <!-- Kepala siluet -->
                <ellipse cx="60" cy="54" rx="22" ry="26" fill="#0F172A" />
                <!-- Tanda tanya -->
                <text x="60" y="64" text-anchor="middle" fill="#F8FAFC" font-size="26" font-weight="800" font-family="sans-serif">?</text>
            </svg>
            <span class="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-slate-900/20 text-[10px] font-bold text-slate-900 tracking-wider">
                NO. ${escapeHtml(displayNumber)}
            </span>
        </div>
    `;
}
