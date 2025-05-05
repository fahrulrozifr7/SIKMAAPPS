const express = require("express");
const {
  registerController,
  loginController,
  updateUserController,
} = require("../controllers/userController");
const { requireSignIn } = require("../middleware/authMiddleware");
const pool = require("../config/pgConfig"); // ✅ Pastikan path ini benar

const router = express.Router();

// ✅ Tambahkan pengecekan jika controller tidak terdefinisi
if (!registerController || !loginController || !updateUserController) {
  throw new Error("Error: userController tidak mengandung fungsi yang diperlukan!");
}

// REGISTER || POST
router.post("/register", registerController);

// LOGIN || POST
router.post("/login", loginController);

// UPDATE USER || PUT
router.put("/update-user", requireSignIn, updateUserController);

// CHECK USERS || GET
router.get("/check-users", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT id, name, email, phoneNumber FROM users"); // ✅ Hindari mengambil password
    res.status(200).json({ success: true, users: rows });
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ success: false, message: "Error fetching users", error: error.message });
  }
});

module.exports = router;
