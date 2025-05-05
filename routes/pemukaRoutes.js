const express = require('express');
const router = express.Router();
const pemukaController = require('../controllers/pemukaController');

// Cek jika fungsi ada
if (
    !pemukaController.getAllPemuka ||
    !pemukaController.getPemukaById ||
    !pemukaController.createPemuka ||
    !pemukaController.updatePemuka ||
    !pemukaController.deletePemuka
) {
    throw new Error("Error: pemukaController tidak mengandung fungsi yang diperlukan!");
}

// Endpoint routes
router.get('/statistics', pemukaController.getStatistics);
router.get('/export/excel', pemukaController.exportPemukaExcel);
router.get('/', pemukaController.getAllPemuka);
router.get('/:id_pemuka', pemukaController.getPemukaById);
router.post('/', pemukaController.createPemuka);
router.put('/:id_pemuka', pemukaController.updatePemuka);
router.delete('/:id_pemuka', pemukaController.deletePemuka);


module.exports = router;
