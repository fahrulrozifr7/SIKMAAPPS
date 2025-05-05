const express = require('express');
const router = express.Router();
const penyuluhController = require('../controllers/penyuluhController'); // ✅ Tanpa destructuring

// Pastikan semua fungsi tersedia untuk menghindari error runtime
if (
    !penyuluhController.getAllPenyuluh ||
    !penyuluhController.getPenyuluhByNoSertifikat ||
    !penyuluhController.createPenyuluh ||
    !penyuluhController.updatePenyuluh ||
    !penyuluhController.deletePenyuluh
) {
    throw new Error("Error: penyuluhController tidak mengandung fungsi yang diperlukan!");
}

// Rute untuk penyuluh
router.get('/statistics', penyuluhController.getPenyuluhStatistics);
router.get('/export/excel', penyuluhController.exportPenyuluhExcel);
router.get('/', penyuluhController.getAllPenyuluh);
router.get('/:no_sertifikat', penyuluhController.getPenyuluhByNoSertifikat);
router.post('/', penyuluhController.createPenyuluh);
router.put('/:no_sertifikat', penyuluhController.updatePenyuluh);
router.delete('/:no_sertifikat', penyuluhController.deletePenyuluh);
module.exports = router;
