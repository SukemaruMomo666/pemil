import { assetUrl } from '../utils/helpers';

/**
 * Konfigurasi utama Simulasi Pemilihan Kepala Desa Bendungan.
 * Seluruh rincian paslon dan metadata wilayah dikelola di sini.
 */
export const ELECTION_CONFIG = {
    appTitle: 'SIMULASI PEMILIHAN KEPALA DESA',
    ballotTitle: 'SURAT SUARA',
    ballotSubtitle: 'SIMULASI PEMILIHAN KEPALA DESA BENDUNGAN',
    regionSubtitle: 'Kecamatan Pagaden Barat, Kabupaten Subang',
    auditTitle: 'SURAT AUDIT',
    auditEvent: 'PILKADES BENDUNGAN',
    tpsLabel: 'TPS 1',
    bilikLabel: 'BILIK 1',
    logos: {
        subang: assetUrl('images/logo-subang.png'),
        kpu: assetUrl('images/logo-kpu.png'),
    },
    candidates: [
        {
            number: 1,
            displayNumber: '01',
            name: 'KANDIDAT 1',
            photo: assetUrl('images/kandidat-placeholder.webp'),
            isPlaceholder: true,
        },
        {
            number: 2,
            displayNumber: '02',
            name: 'KANDIDAT 2',
            photo: assetUrl('images/kandidat-placeholder.webp'),
            isPlaceholder: true,
        },
        {
            number: 3,
            displayNumber: '03',
            name: 'ALI KODIR',
            photo: assetUrl('images/kandidat-3.jpg'),
            isPlaceholder: false,
        },
    ],
};
