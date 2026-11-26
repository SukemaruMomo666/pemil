import { ELECTION_CONFIG } from '../data/electionConfig';
import { appRoute, escapeHtml } from '../utils/helpers';

/**
 * Render halaman cetak & unduh QR Code untuk memulai pemilihan.
 * @param {{ cards: Array<{ code: string, label: string, qrDataUrl: string }>, singleDownloadUrl: string }} props
 * @returns {string}
 */
export function renderPrintQrSheet({ cards, singleDownloadUrl }) {
    const cardsHtml = cards
        .map(
            (card) => `
            <div class="bg-white rounded-2xl border-2 border-dashed border-slate-300 p-5 sm:p-6 flex flex-col items-center text-center shadow-xs print:shadow-none print:border-slate-400 break-inside-avoid">
                <div class="flex items-center gap-2 mb-3">
                    <img
                        src="${escapeHtml(ELECTION_CONFIG.logos.subang)}"
                        alt="Lambang Kabupaten Subang"
                        class="h-8 w-8 object-contain"
                    />
                    <div class="text-left">
                        <p class="text-[11px] font-extrabold tracking-wide text-slate-900 uppercase leading-tight">
                            KARTU QR PEMILIH
                        </p>
                        <p class="text-[10px] font-semibold text-slate-500">
                            ${escapeHtml(ELECTION_CONFIG.auditEvent)}
                        </p>
                    </div>
                </div>

                <div class="p-3 rounded-xl bg-white border border-slate-200">
                    <img
                        src="${escapeHtml(card.qrDataUrl)}"
                        alt="QR Code ${escapeHtml(card.label)}"
                        class="w-44 h-44 sm:w-48 sm:h-48 object-contain"
                    />
                </div>

                <p class="mt-3 text-xs font-extrabold text-slate-800 tracking-wider uppercase">
                    ${escapeHtml(card.label)}
                </p>
                <p class="mt-0.5 font-mono text-[11px] font-semibold text-slate-500">
                    ${escapeHtml(card.code)}
                </p>
                <p class="mt-2 text-[10px] text-slate-500">
                    Arahkan QR ini ke kamera pada layar <strong>STANDBY SCAN</strong>
                </p>
            </div>
        `
        )
        .join('');

    return `
        <section class="flex-1 max-w-4xl w-full mx-auto px-4 py-6 sm:py-8">
            <!-- Panel kontrol (disembunyikan saat print) -->
            <div class="print:hidden bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 class="text-lg sm:text-xl font-extrabold text-slate-900">
                        Cetak / Unduh QR Code Pemilih
                    </h2>
                    <p class="text-xs sm:text-sm text-slate-600 mt-0.5">
                        Cetak kartu QR di bawah ini atau unduh gambar PNG untuk discan pada kamera Standby Scan.
                    </p>
                </div>

                <div class="flex flex-wrap items-center gap-2.5 shrink-0">
                    <a
                        href="${escapeHtml(appRoute())}"
                        class="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold transition"
                    >
                        ← Kembali Scan
                    </a>
                    <a
                        href="${escapeHtml(singleDownloadUrl)}"
                        download="qr-pilkades-bendungan.png"
                        class="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-sm transition"
                    >
                        Unduh PNG
                    </a>
                    <button
                        type="button"
                        data-action="print-qr"
                        class="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs sm:text-sm font-bold shadow-sm transition cursor-pointer"
                    >
                        Cetak (Print)
                    </button>
                </div>
            </div>

            <!-- Grid Kartu QR Siap Cetak A4 -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5 print:grid-cols-2 print:gap-4">
                ${cardsHtml}
            </div>
        </section>
    `;
}
