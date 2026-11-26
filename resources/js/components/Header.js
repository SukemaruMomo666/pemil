import { ELECTION_CONFIG } from '../data/electionConfig';
import { escapeHtml } from '../utils/helpers';

/**
 * Render isi tombol Layar Penuh (ikon + label).
 * @param {boolean} isFullscreen
 * @returns {string}
 */
export function renderFullscreenButtonContent(isFullscreen) {
    const fullscreenLabel = isFullscreen ? 'KELUAR LAYAR PENUH' : 'LAYAR PENUH';
    const fullscreenIcon = isFullscreen
        ? `<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
             <path stroke-linecap="round" stroke-linejoin="round" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
           </svg>`
        : `<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
             <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
           </svg>`;

    return `${fullscreenIcon}<span class="hidden sm:inline">${fullscreenLabel}</span>`;
}

/**
 * Render header navigasi atas sesuai layar aktif.
 * @param {{ screen: 'standby' | 'ballot' | 'receipt', isFullscreen: boolean, isAbstainSelected?: boolean }} state
 * @returns {string}
 */
export function renderHeader({ screen, isFullscreen, isAbstainSelected = false }) {
    const btnContent = renderFullscreenButtonContent(isFullscreen);

    if (screen === 'ballot') {
        return `
            <header class="relative bg-gradient-to-b from-[#D4112B] via-[#C8102E] to-[#A50B22] text-white shadow-md border-b border-red-950/30">
                <div class="max-w-7xl mx-auto px-3 sm:px-6 pt-3 pb-4 sm:py-5 relative flex flex-col items-center text-center">
                    <!-- Pojok Kiri Atas: Tombol Layar Penuh -->
                    <div class="absolute top-3 left-3 sm:top-4 sm:left-6">
                        <button
                            type="button"
                            data-action="toggle-fullscreen"
                            class="inline-flex items-center gap-1.5 px-2.5 py-2 rounded-lg bg-white/15 hover:bg-white/25 active:scale-[0.98] border border-white/30 text-[11px] font-bold tracking-wider transition cursor-pointer"
                            title="Layar Penuh"
                        >
                            ${btnContent}
                        </button>
                    </div>

                    <!-- Pojok Kanan Atas: Kotak Pilihan ABSTAIN -->
                    <div class="absolute top-3 right-3 sm:top-4 sm:right-6">
                        <button
                            type="button"
                            data-action="select-abstain"
                            aria-pressed="${isAbstainSelected ? 'true' : 'false'}"
                            class="inline-flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl font-extrabold text-xs sm:text-sm tracking-wider uppercase shadow-md transition-all cursor-pointer border-2 ${
                                isAbstainSelected
                                    ? 'bg-blue-700 text-white border-white ring-4 ring-white/40 scale-[1.02]'
                                    : 'bg-white text-slate-900 border-white/90 hover:bg-red-50 hover:scale-[1.02] active:scale-[0.98]'
                            }"
                        >
                            <span class="w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 ${
                                isAbstainSelected ? 'border-white bg-blue-600' : 'border-slate-400 bg-white'
                            }">
                                ${
                                    isAbstainSelected
                                        ? `<svg class="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                                               <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                           </svg>`
                                        : ''
                                }
                            </span>
                            <span>ABSTAIN</span>
                        </button>
                    </div>

                    <!-- Tengah: Logo Subang & Judul Surat Suara -->
                    <div class="mt-8 sm:mt-0 flex flex-col items-center px-2">
                        <img
                            src="${escapeHtml(ELECTION_CONFIG.logos.subang)}"
                            alt="Lambang Kabupaten Subang"
                            class="h-11 w-11 sm:h-16 sm:w-16 object-contain drop-shadow-[0_2px_6px_rgba(0,0,0,0.28)]"
                        />
                        <h1 class="mt-1.5 sm:mt-2 text-lg sm:text-3xl font-extrabold tracking-wide leading-tight uppercase">
                            ${escapeHtml(ELECTION_CONFIG.ballotTitle)}
                        </h1>
                        <p class="mt-0.5 text-[11px] sm:text-sm font-bold tracking-wide text-red-50 uppercase">
                            ${escapeHtml(ELECTION_CONFIG.ballotSubtitle)}
                        </p>
                        <p class="text-[10px] sm:text-xs font-medium text-red-100/90">
                            ${escapeHtml(ELECTION_CONFIG.regionSubtitle)}
                        </p>
                    </div>
                </div>
            </header>
        `;
    }

    return `
        <header class="print:hidden bg-gradient-to-r from-[#0B2252] via-[#123275] to-[#19439A] text-white shadow-md border-b border-blue-950/30">
            <div class="max-w-7xl mx-auto px-3 sm:px-6 py-3 flex items-center justify-between gap-3 sm:gap-4">
                <div class="flex items-center gap-2.5 sm:gap-3 min-w-0">
                    <img
                        src="${escapeHtml(ELECTION_CONFIG.logos.subang)}"
                        alt="Lambang Kabupaten Subang"
                        class="shrink-0 h-9 w-9 sm:h-10 sm:w-10 object-contain drop-shadow-[0_2px_5px_rgba(0,0,0,0.3)]"
                    />
                    <div class="min-w-0">
                        <h1 class="text-xs sm:text-base font-extrabold tracking-wide uppercase leading-tight">
                            ${escapeHtml(ELECTION_CONFIG.appTitle)}
                        </h1>
                        <p class="mt-0.5 text-[10px] sm:text-xs text-blue-100/90 leading-snug">
                            Desa Bendungan • ${escapeHtml(ELECTION_CONFIG.regionSubtitle)}
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    data-action="toggle-fullscreen"
                    class="shrink-0 inline-flex items-center gap-2 px-2.5 sm:px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 active:scale-[0.98] border border-white/25 text-xs font-bold tracking-wider transition cursor-pointer"
                >
                    ${btnContent}
                </button>
            </div>
        </header>
    `;
}
