import { ELECTION_CONFIG } from '../data/electionConfig';
import { escapeHtml } from '../utils/helpers';

/**
 * Render layar selesai & animasi cetak Struk Surat Audit.
 * @param {{ voteCode: string, qrDataUrl: string }} props
 * @returns {string}
 */
export function renderAuditReceipt({ voteCode, qrDataUrl }) {
    return `
        <section class="flex-1 flex flex-col items-center justify-center px-4 py-6 sm:py-8 animate-fade-up">
            <!-- Judul Konfirmasi -->
            <div class="flex flex-col items-center text-center mb-6">
                <div class="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3 shadow-xs border border-emerald-200">
                    <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                </div>
                <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Suara Berhasil Disimpan!
                </h2>
            </div>

            <!-- Unit Slot Printer & Kertas Struk Audit -->
            <div class="w-full max-w-[320px] sm:max-w-sm flex flex-col items-center">
                <!-- Slot Printer -->
                <div class="w-full h-6 rounded-full bg-slate-900 shadow-lg flex items-center justify-center px-5 z-10 border-b border-slate-700">
                    <div class="w-full h-1.5 rounded-full bg-slate-950 shadow-inner"></div>
                </div>

                <!-- Mask Animasi Keluarnya Kertas Struk -->
                <div class="w-[88%] overflow-hidden -mt-2 pt-2 pb-4 px-1">
                    <div class="bg-white rounded-b-2xl border-x border-b border-slate-200 shadow-xl px-5 pt-6 pb-6 text-center relative animate-print-receipt">
                        <img
                            src="${escapeHtml(ELECTION_CONFIG.logos.kpu)}"
                            alt="Logo KPU"
                            class="h-11 w-auto mx-auto mb-3 object-contain"
                        />

                        <p class="text-xs font-extrabold tracking-widest text-slate-900 uppercase">
                            ${escapeHtml(ELECTION_CONFIG.auditTitle)}
                        </p>
                        <p class="text-sm font-extrabold text-slate-900 uppercase mt-0.5">
                            ${escapeHtml(ELECTION_CONFIG.auditEvent)}
                        </p>
                        <p class="text-[11px] font-medium text-slate-500 mt-0.5">
                            ${escapeHtml(ELECTION_CONFIG.regionSubtitle)}
                        </p>

                        <div class="mt-2.5 inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-[11px] font-bold text-slate-700 tracking-wider">
                            <span>${escapeHtml(ELECTION_CONFIG.tpsLabel)}</span>
                            <span class="text-slate-400">•</span>
                            <span>${escapeHtml(ELECTION_CONFIG.bilikLabel)}</span>
                        </div>

                        <!-- Garis Perforasi Struk -->
                        <div class="relative my-4 flex items-center">
                            <div class="w-4 h-4 rounded-full bg-slate-100 border-r border-slate-200 -ml-7 shrink-0"></div>
                            <div class="flex-1 border-t-2 border-dashed border-slate-300"></div>
                            <div class="w-4 h-4 rounded-full bg-slate-100 border-l border-slate-200 -mr-7 shrink-0"></div>
                        </div>

                        <!-- QR Code Audit -->
                        <div class="flex flex-col items-center">
                            <div class="p-2 rounded-xl bg-white border border-slate-200 shadow-2xs">
                                <img
                                    src="${escapeHtml(qrDataUrl)}"
                                    alt="QR Code Struk Audit"
                                    class="w-24 h-24 object-contain"
                                />
                            </div>
                            <p class="mt-2.5 font-mono text-[11px] font-semibold text-slate-500 tracking-tight break-all">
                                ${escapeHtml(voteCode)}
                            </p>
                        </div>

                        <p class="mt-5 text-sm font-extrabold tracking-widest text-slate-900 uppercase">
                            TERIMA KASIH
                        </p>
                    </div>
                </div>
            </div>

            <p class="mt-2 text-sm text-slate-600 text-center">
                Silakan ambil struk ini dan masukkan ke kotak audit.
            </p>

            <button
                type="button"
                data-action="next-voter"
                class="mt-5 inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 active:scale-[0.98] text-white font-bold text-sm tracking-wide shadow-lg shadow-blue-700/25 transition cursor-pointer"
            >
                <span>Pemilih Selanjutnya</span>
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
            </button>
        </section>
    `;
}
