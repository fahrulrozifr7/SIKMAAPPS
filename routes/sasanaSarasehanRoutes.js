const express = require('express');
const router = express.Router();
const sasanaSarasehanController = require('../controllers/sasanaSarasehanController'); // ✅ Tanpa destructuring

// Pastikan semua fungsi tersedia untuk menghindari error runtime
if (
    !sasanaSarasehanController.getAllSasanaSarasehan ||
    !sasanaSarasehanController.getSasanaSarasehanByNama ||
    !sasanaSarasehanController.createSasanaSarasehan ||
    !sasanaSarasehanController.updateSasanaSarasehan ||
    !sasanaSarasehanController.deleteSasanaSarasehan ||
    !sasanaSarasehanController.exportSasanaSarasehanToExcel // Pastikan fungsi ini ada
) {
    throw new Error("Error: sasanaSarasehanController tidak mengandung fungsi yang diperlukan!");
}

// Rute untuk sasana sarasehan
router.get('/statistics', sasanaSarasehanController.getSasanaSarasehanStatistics); // Ganti dengan fungsi yang benar
router.get('/export/excel', sasanaSarasehanController.exportSasanaSarasehanToExcel); // Ganti dengan fungsi yang benar
router.get('/', sasanaSarasehanController.getAllSasanaSarasehan);
router.get('/:nama', sasanaSarasehanController.getSasanaSarasehanByNama);
router.post('/', sasanaSarasehanController.createSasanaSarasehan);
router.put('/:nama', sasanaSarasehanController.updateSasanaSarasehan);
router.delete('/:nama', sasanaSarasehanController.deleteSasanaSarasehan);

module.exports = router;
