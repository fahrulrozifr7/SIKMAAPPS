const express = require('express');
const router = express.Router();
const organisasiController = require('../controllers/organisasiController');

// Pastikan fungsi-fungsi berikut ada di organisasiController.js
if (!organisasiController.getAllOrganisasi ||
    !organisasiController.getOrganisasiById ||
    !organisasiController.createOrganisasi ||
    !organisasiController.updateOrganisasi ||
    !organisasiController.deleteOrganisasi) {
    throw new Error("Error: organisasiController tidak mengandung fungsi yang diperlukan!");
}

// Rute API
router.get('/export/excel', organisasiController.exportOrganisasiExcel);
router.get('/statistics', organisasiController.getStatistics); // Menambahkan rute untuk statistik
router.get('/', organisasiController.getAllOrganisasi);
router.get('/:no_inventarisasi', organisasiController.getOrganisasiById);
router.post('/', organisasiController.createOrganisasi);
router.put('/:no_inventarisasi', organisasiController.updateOrganisasi);
router.delete('/:no_inventarisasi', organisasiController.deleteOrganisasi);


module.exports = router;

