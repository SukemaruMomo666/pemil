import { ELECTION_CONFIG } from '../data/electionConfig';
import { escapeHtml, renderPlaceholderAvatar } from '../utils/helpers';

/**
 * Render layar Surat Suara dengan 5 kotak kandidat (No. 03 Ali Kodir).
 * @param {{ selectedNumber: number | null }} props
 * @returns {string}
 */
export function renderBallotPaper({ selectedNumber }) {
    const selectedCandidate = ELECTION_CONFIG.candidates.find(
        (candidate) => candidate.number === selectedNumber
    );

    const cardsHtml = ELECTION_CONFIG.candidates
        .map((candidate) => {
            const isSelected = candidate.number === selectedNumber;
            const hasSelection = selectedNumber !== null;

            const cardStateClass = isSelected
                ? 'ring-4 ring-blue-600 border-blue-600 shadow-xl shadow-blue-700/15 -translate-y-1 sm:-translate-y-1.5 bg-blue-50/40 cursor-pointer'
                : hasSelection
                  ? 'border-slate-200 hover:border-blue-400 opacity-85 hover:opacity-100 bg-white cursor-pointer'
                  : 'border-slate-200 hover:border-blue-400 hover:-translate-y-1 hover:shadow-lg bg-white cursor-pointer';

            const numberHeaderClass = isSelected
                ? 'bg-blue-700 text-white border-blue-700'
                : 'bg-slate-100 text-slate-800 border-slate-200 group-hover:bg-blue-50 group-hover:text-blue-800';

            const photoMarkup = candidate.photo
                ? `<img
                        src="${escapeHtml(candidate.photo)}"
                        alt="${escapeHtml(candidate.name)}"
                        class="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.03]"
                   />`
                : renderPlaceholderAvatar(candidate.displayNumber);

            return `
                <button
                    type="button"
                    data-action="select-candidate"
                    data-number="${candidate.number}"
                    aria-pressed="${isSelected ? 'true' : 'false'}"
                    class="group relative min-w-0 flex flex-col rounded-2xl border-2 overflow-hidden transition-all duration-200 text-center focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/40 ${cardStateClass}"
                >
                    <!-- Nomor Urut -->
                    <div class="w-full py-1.5 sm:py-2.5 px-2 border-b font-extrabold text-lg sm:text-2xl tracking-wide transition-colors ${numberHeaderClass}">
                        ${escapeHtml(candidate.displayNumber)}
                    </div>

                    <!-- Foto Kandidat -->
                    <div class="relative w-full aspect-[3/4] bg-slate-100 overflow-hidden">
                        ${photoMarkup}

                        ${
                            isSelected
                                ? `<div class="absolute top-1.5 right-1.5 sm:top-2.5 sm:right-2.5 inline-flex items-center gap-1 p-1 sm:px-2.5 sm:py-1 rounded-full bg-blue-700 text-white text-xs font-bold tracking-wider shadow-md">
                                       <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                                           <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                       </svg>
                                       <span class="hidden sm:inline">DIPILIH</span>
                                   </div>`
                                : ''
                        }
                    </div>

                    <!-- Nama Kandidat -->
                    <div class="w-full px-1.5 py-2.5 sm:px-3 sm:py-3.5 bg-white border-t border-slate-100 flex-1 flex items-center justify-center">
                        <span class="text-xs sm:text-base font-extrabold tracking-wide uppercase leading-snug break-words ${
                            isSelected ? 'text-blue-800' : 'text-slate-800'
                        }">
                            ${escapeHtml(candidate.name)}
                        </span>
                    </div>
                </button>
            `;
        })
        .join('');

    const ctaDisabled = !selectedCandidate;
    const ctaClass = ctaDisabled
        ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
        : 'bg-blue-700 hover:bg-blue-800 active:scale-[0.99] text-white shadow-lg shadow-blue-700/25 cursor-pointer';

    const ctaText = selectedCandidate
        ? `PILIH KANDIDAT INI (NO. ${selectedCandidate.displayNumber})`
        : 'PILIH KANDIDAT INI';

    return `
        <section class="flex-1 flex flex-col justify-center max-w-4xl w-full mx-auto px-3 sm:px-4 py-4 sm:py-8 animate-fade-up">
            <!-- Petunjuk singkat pemilih -->
            <div class="text-center mb-4 sm:mb-6">
                <p class="inline-block px-4 py-2.5 rounded-2xl sm:rounded-full bg-white border border-slate-200 text-slate-700 text-sm sm:text-base font-medium leading-relaxed shadow-2xs">
                    <span class="inline-block w-2.5 h-2.5 rounded-full bg-red-600 mr-2 align-middle"></span>Ketuk kotak calon kepala desa pilihan Anda, lalu tekan tombol <strong class="text-slate-900 whitespace-nowrap">PILIH KANDIDAT INI</strong>.
                </p>
            </div>

            <!-- Lembar Surat Suara -->
            <div class="bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-900/5 p-3 sm:p-6 lg:p-8">
                <div class="grid grid-cols-3 gap-2.5 sm:gap-5 lg:gap-6 pt-1 items-stretch">
                    ${cardsHtml}
                </div>

                <!-- Tombol Aksi Pilih -->
                <div class="mt-6 sm:mt-8 flex flex-col items-center gap-2">
                    <button
                        type="button"
                        data-action="open-confirm"
                        ${ctaDisabled ? 'disabled' : ''}
                        class="w-full sm:w-auto min-w-0 sm:min-w-[280px] px-6 sm:px-8 py-4 rounded-2xl font-extrabold text-base sm:text-lg tracking-wide uppercase transition-all ${ctaClass}"
                    >
                        ${escapeHtml(ctaText)}
                    </button>
                    <p class="text-xs sm:text-sm text-slate-500">
                        ${
                            selectedCandidate
                                ? `Anda memilih: <strong class="text-slate-800">${escapeHtml(selectedCandidate.name)} (No. Urut ${escapeHtml(selectedCandidate.displayNumber)})</strong>`
                                : 'Belum ada kandidat yang dipilih'
                        }
                    </p>
                </div>
            </div>
        </section>
    `;
}
