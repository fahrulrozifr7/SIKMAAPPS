const express = require('express');
const router = express.Router();
const pesertaDidikController = require('../controllers/pesertaDidikController'); // ✅ Tanpa destructuring

// Pastikan semua fungsi tersedia untuk menghindari error runtime
if (
    !pesertaDidikController.getAllPesertaDidik ||
    !pesertaDidikController.getPesertaDidikByNISN ||
    !pesertaDidikController.createPesertaDidik ||
    !pesertaDidikController.updatePesertaDidik ||
    !pesertaDidikController.deletePesertaDidik ||
    !pesertaDidikController.exportPesertaDidikToExcel // Pastikan nama fungsi ini benar
) {
    throw new Error("Error: pesertaDidikController tidak mengandung fungsi yang diperlukan!");
}

// Rute untuk peserta didik
router.get('/statistics', pesertaDidikController.getPesertaDidikStatistics);
router.get('/export/excel', pesertaDidikController.exportPesertaDidikToExcel); // Menggunakan fungsi yang benar
router.get('/', pesertaDidikController.getAllPesertaDidik);
router.get('/:nisn', pesertaDidikController.getPesertaDidikByNISN);
router.post('/', pesertaDidikController.createPesertaDidik);
router.put('/:nisn', pesertaDidikController.updatePesertaDidik);
router.delete('/:nisn', pesertaDidikController.deletePesertaDidik);

module.exports = router;
