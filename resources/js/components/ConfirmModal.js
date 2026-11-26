import { escapeHtml, renderPlaceholderAvatar } from '../utils/helpers';

/**
 * Render modal Konfirmasi Pemilihan sebelum suara disimpan.
 * @param {{ candidate: object | null, isAbstain?: boolean }} props
 * @returns {string}
 */
export function renderConfirmModal({ candidate, isAbstain = false }) {
    if (!candidate && !isAbstain) {
        return '';
    }

    const previewMedia = isAbstain
        ? `<div class="w-full h-full bg-slate-100 flex flex-col items-center justify-center p-3 text-slate-600">
               <svg class="w-10 h-10 text-slate-400 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                   <path stroke-linecap="round" stroke-linejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
               </svg>
               <span class="text-xs font-extrabold tracking-widest text-slate-700">ABSTAIN</span>
           </div>`
        : candidate.photo
          ? `<img
                src="${escapeHtml(candidate.photo)}"
                alt="${escapeHtml(candidate.name)}"
                class="w-full h-full object-cover object-top"
             />`
          : renderPlaceholderAvatar(candidate.displayNumber);

    const promptText = isAbstain
        ? 'Apakah Anda yakin akan memilih ABSTAIN?'
        : 'Apakah Anda yakin akan memilih kandidat ini?';

    const badgeText = isAbstain
        ? 'Pilihan Surat Suara'
        : `Kandidat No. ${escapeHtml(candidate.displayNumber)}`;

    const titleText = isAbstain ? 'ABSTAIN' : escapeHtml(candidate.name);

    return `
        <div
            id="confirm-modal-backdrop"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-modal-title"
            class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
        >
            <div class="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-modal-pop">
                <!-- Header Modal -->
                <div class="bg-gradient-to-r from-blue-700 to-blue-600 px-6 py-4 flex items-center gap-2.5 text-white">
                    <svg class="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                    </svg>
                    <h3 id="confirm-modal-title" class="text-base sm:text-lg font-bold tracking-wide">
                        Konfirmasi Pemilihan
                    </h3>
                </div>

                <!-- Isi Konfirmasi -->
                <div class="px-6 py-6 text-center">
                    <p class="text-sm sm:text-base text-slate-600">
                        ${promptText}
                    </p>

                    <div class="mt-5 mx-auto w-28 h-36 rounded-2xl overflow-hidden border-2 border-slate-200 shadow-md bg-slate-100">
                        ${previewMedia}
                    </div>

                    <div class="mt-4">
                        <span class="inline-block px-3 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold tracking-wide">
                            ${badgeText}
                        </span>
                        <h4 class="mt-2 text-xl sm:text-2xl font-extrabold text-slate-900 uppercase tracking-tight">
                            ${titleText}
                        </h4>
                    </div>

                    <!-- Tombol Aksi -->
                    <div class="mt-7 grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            data-action="cancel-confirm"
                            class="py-3 px-4 rounded-xl bg-rose-50 hover:bg-rose-100 active:scale-[0.98] text-rose-600 border border-rose-200 font-bold text-sm tracking-wide uppercase transition cursor-pointer"
                        >
                            ULANGI
                        </button>
                        <button
                            type="button"
                            data-action="submit-vote"
                            class="py-3 px-4 rounded-xl bg-blue-700 hover:bg-blue-800 active:scale-[0.98] text-white shadow-md shadow-blue-700/20 font-bold text-sm tracking-wide uppercase transition cursor-pointer"
                        >
                            PILIH
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}
