const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController'); // ✅ Pastikan path ini benar

// Pastikan semua fungsi tersedia
if (!authController.registerController || !authController.loginController) {
    throw new Error("Error: authController tidak mengandung fungsi yang diperlukan!");
}

// Register route
router.post('/register', authController.registerController);

// Login route
router.post('/login', authController.loginController);

module.exports = router;
