// controllers/userController.js
const { createUser, findUserByEmail, updateUser } = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Daftar Certification ID yang diperbolehkan
const validCertificationIds = ["SIKMA1234", "SIKMA5678", "SIKMA91011"]; // Ganti dengan daftar yang sesuai

// Register
const registerController = async (req, res) => {
  const { certificationId, name, email, phoneNumber, password } = req.body;

  try {
    // Validasi apakah semua field sudah diisi
    if (!certificationId || !name || !email || !phoneNumber || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Perbaikan validasi Certification ID
    if (!validCertificationIds.includes(certificationId.trim())) {
      console.log("Invalid Certification ID detected:", certificationId);
      return res.status(400).json({ success: false, message: "Invalid Certification ID" });
    }

    // Cek apakah email sudah terdaftar
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Buat user baru
    const user = await createUser({
      certificationId: certificationId.trim(), // Pastikan ID yang disimpan bersih dari spasi tambahan
      name,
      email,
      phoneNumber,
      password: hashedPassword,
    });

    res.status(201).json({ success: true, message: "Registration successful", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error in registration", error });
  }
};

// Login
const loginController = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Cari user berdasarkan email
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    // Bandingkan password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({ success: true, message: "Login successful", token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error in login", error });
  }
};

// Update User
const updateUserController = async (req, res) => {
  const { email, name, password } = req.body;

  try {
    // Hash password baru jika ada
    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

    // Update user
    const updatedUser = await updateUser(email, { name, password: hashedPassword });

    res.status(200).json({ success: true, message: "Profile updated", updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error in updating profile", error });
  }
};

module.exports = {
  registerController,
  loginController,
  updateUserController,
};
