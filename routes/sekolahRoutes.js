const express = require('express');
const router = express.Router();
const sekolahController = require('../controllers/sekolahController'); // ✅ Tanpa destructuring

// Pastikan semua fungsi tersedia untuk menghindari error runtime
if (
    !sekolahController.getAllSekolah ||
    !sekolahController.getSekolahByNPSN ||
    !sekolahController.createSekolah ||
    !sekolahController.updateSekolah ||
    !sekolahController.deleteSekolah ||
    !sekolahController.exportSekolahToExcel // Sesuaikan dengan nama fungsi di controller
) {
    throw new Error("Error: sekolahController tidak mengandung fungsi yang diperlukan!");
}

// Rute untuk sekolah
router.get('/statistics', sekolahController.getSekolahStatistics); // Ganti dengan fungsi yang benar
router.get('/export/excel', sekolahController.exportSekolahToExcel); // Sesuaikan nama fungsi
router.get('/', sekolahController.getAllSekolah);
router.get('/:npsn', sekolahController.getSekolahByNPSN);
router.post('/', sekolahController.createSekolah);
router.put('/:npsn', sekolahController.updateSekolah);
router.delete('/:npsn', sekolahController.deleteSekolah);

module.exports = router;
