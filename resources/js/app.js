import QRCode from 'qrcode';
import { ELECTION_CONFIG } from './data/electionConfig';
import { renderHeader, renderFullscreenButtonContent } from './components/Header';
import { StandbyScannerController } from './components/StandbyScan';
import { renderBallotPaper } from './components/BallotPaper';
import { renderConfirmModal } from './components/ConfirmModal';
import { renderAuditReceipt } from './components/AuditReceipt';
import { renderPrintQrSheet } from './components/PrintQrSheet';
import { generateVoteCode, playTone, toggleFullscreen } from './utils/helpers';

const isPrintQrRoute = window.location.pathname.replace(/\/+$/, '').endsWith('/cetak-qr');

/**
 * State utama aplikasi Simulasi Pilkades Bendungan.
 */
const state = {
    screen: isPrintQrRoute ? 'print-qr' : 'standby', // 'standby' | 'ballot' | 'receipt' | 'print-qr'
    selectedNumber: null,
    isAbstain: false,
    showConfirmModal: false,
    receipt: null,
    qrSheet: null,
    isFullscreen: Boolean(document.fullscreenElement),
};

const rootEl = document.getElementById('app');

const scannerController = new StandbyScannerController({
    onScanSuccess: () => {
        playTone('scan');
        goToBallot();
    },
    onSimulateClick: () => {
        playTone('scan');
        goToBallot();
    },
});

function goToBallot() {
    state.screen = 'ballot';
    state.selectedNumber = null;
    state.isAbstain = false;
    state.showConfirmModal = false;
    state.receipt = null;
    renderApp();
}

async function submitVote() {
    const selectedCandidate = ELECTION_CONFIG.candidates.find(
        (candidate) => candidate.number === state.selectedNumber
    );
    if (!selectedCandidate && !state.isAbstain) {
        return;
    }

    playTone('confirm');

    const voteCode = generateVoteCode(ELECTION_CONFIG.tpsLabel);
    const qrPayload = JSON.stringify({
        code: voteCode,
        event: ELECTION_CONFIG.auditEvent,
        tps: ELECTION_CONFIG.tpsLabel,
        bilik: ELECTION_CONFIG.bilikLabel,
    });

    const qrDataUrl = await QRCode.toDataURL(qrPayload, {
        width: 192,
        margin: 1,
        color: {
            dark: '#0F172A',
            light: '#FFFFFF',
        },
    });

    state.showConfirmModal = false;
    state.screen = 'receipt';
    state.receipt = {
        voteCode,
        qrDataUrl,
    };

    renderApp();
}

async function resetToStandby() {
    state.screen = 'standby';
    state.selectedNumber = null;
    state.isAbstain = false;
    state.showConfirmModal = false;
    state.receipt = null;
    await renderApp();
}

async function buildPrintQrSheetData() {
    const items = [
        { code: 'PILKADES-BENDUNGAN-01', label: 'TPS 1 • KARTU 01' },
        { code: 'PILKADES-BENDUNGAN-02', label: 'TPS 1 • KARTU 02' },
        { code: 'PILKADES-BENDUNGAN-03', label: 'TPS 1 • KARTU 03' },
        { code: 'PILKADES-BENDUNGAN-04', label: 'TPS 1 • KARTU 04' },
    ];

    const cards = await Promise.all(
        items.map(async (item) => ({
            ...item,
            qrDataUrl: await QRCode.toDataURL(item.code, {
                width: 400,
                margin: 2,
                color: {
                    dark: '#0F172A',
                    light: '#FFFFFF',
                },
            }),
        }))
    );

    return {
        cards,
        singleDownloadUrl: cards[0].qrDataUrl,
    };
}

async function renderApp() {
    if (!rootEl) return;

    if (state.screen !== 'standby') {
        await scannerController.stop();
    }

    if (state.screen === 'print-qr' && !state.qrSheet) {
        state.qrSheet = await buildPrintQrSheetData();
    }

    const headerHtml = renderHeader({
        screen: state.screen,
        isFullscreen: state.isFullscreen,
        isAbstainSelected: state.isAbstain,
    });

    let bodyHtml = '';
    if (state.screen === 'standby') {
        bodyHtml = scannerController.render();
    } else if (state.screen === 'ballot') {
        bodyHtml = renderBallotPaper({
            selectedNumber: state.selectedNumber,
        });
    } else if (state.screen === 'receipt' && state.receipt) {
        bodyHtml = renderAuditReceipt(state.receipt);
    } else if (state.screen === 'print-qr' && state.qrSheet) {
        bodyHtml = renderPrintQrSheet(state.qrSheet);
    }

    const selectedCandidate = ELECTION_CONFIG.candidates.find(
        (candidate) => candidate.number === state.selectedNumber
    );
    const modalHtml =
        state.screen === 'ballot' && state.showConfirmModal
            ? renderConfirmModal({
                  candidate: selectedCandidate || null,
                  isAbstain: state.isAbstain,
              })
            : '';

    rootEl.innerHTML = `
        <div class="min-h-screen flex flex-col bg-slate-100">
            ${headerHtml}
            <main class="flex-1 flex flex-col">
                ${bodyHtml}
            </main>
            ${modalHtml}
        </div>
    `;

    if (state.screen === 'standby') {
        await scannerController.mount();
    }
}

// Delegasi event klik terpusat agar rapi dan bebas duplikasi listener
document.addEventListener('click', (event) => {
    const target = event.target.closest('[data-action]');
    if (!target) {
        if (event.target.id === 'confirm-modal-backdrop') {
            state.showConfirmModal = false;
            state.isAbstain = false;
            renderApp();
        }
        return;
    }

    const action = target.dataset.action;

    if (action === 'toggle-fullscreen') {
        toggleFullscreen();
        return;
    }

    if (action === 'select-candidate') {
        const number = Number(target.dataset.number);
        const candidate = ELECTION_CONFIG.candidates.find((item) => item.number === number);
        if (candidate) {
            state.selectedNumber = number;
            state.isAbstain = false;
            renderApp();
        }
        return;
    }

    if (action === 'select-abstain') {
        state.selectedNumber = null;
        state.isAbstain = true;
        state.showConfirmModal = true;
        renderApp();
        return;
    }

    if (action === 'open-confirm') {
        if (state.selectedNumber !== null) {
            state.isAbstain = false;
            state.showConfirmModal = true;
            renderApp();
        }
        return;
    }

    if (action === 'cancel-confirm') {
        state.showConfirmModal = false;
        state.isAbstain = false;
        renderApp();
        return;
    }

    if (action === 'submit-vote') {
        submitVote();
        return;
    }

    if (action === 'next-voter') {
        resetToStandby();
        return;
    }

    if (action === 'print-qr') {
        window.print();
    }
});

// Tutup modal konfirmasi saat tombol Escape ditekan
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && state.showConfirmModal) {
        state.showConfirmModal = false;
        state.isAbstain = false;
        renderApp();
    }
});

// Sinkronkan ikon & label tombol Layar Penuh saat status fullscreen berubah
document.addEventListener('fullscreenchange', () => {
    state.isFullscreen = Boolean(document.fullscreenElement);
    const fsBtn = document.querySelector('[data-action="toggle-fullscreen"]');
    if (fsBtn) {
        fsBtn.innerHTML = renderFullscreenButtonContent(state.isFullscreen);
    }
});

// Render awal aplikasi
renderApp();
