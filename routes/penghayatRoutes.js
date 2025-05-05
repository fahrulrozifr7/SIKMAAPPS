const express = require('express');
const router = express.Router();
const penghayatController = require('../controllers/penghayatController');

// Validasi fungsi controller
if (
    !penghayatController.getAllPenghayat ||
    !penghayatController.getPenghayatByNIK ||
    !penghayatController.createPenghayat ||
    !penghayatController.updatePenghayat ||
    !penghayatController.deletePenghayat ||
    !penghayatController.getPenghayatStatistics ||
    !penghayatController.exportPenghayatExcel
) {
    throw new Error("Error: penghayatController tidak mengandung semua fungsi yang diperlukan!");
}

// Rute spesifik dulu
router.get('/statistics', penghayatController.getPenghayatStatistics);
router.get('/export/excel', penghayatController.exportPenghayatExcel);

// Rute dinamis dan umum setelahnya
router.get('/', penghayatController.getAllPenghayat);
router.get('/:nik', penghayatController.getPenghayatByNIK);
router.post('/', penghayatController.createPenghayat);
router.put('/:nik', penghayatController.updatePenghayat);
router.delete('/:nik', penghayatController.deletePenghayat);

module.exports = router;
