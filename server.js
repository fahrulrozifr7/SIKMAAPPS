const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const pool = require('./config/pgConfig');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const organisasiRoutes = require('./routes/organisasiRoutes');
const penyuluhRoutes = require('./routes/penyuluhRoutes');
const pesertaDidikRoutes = require('./routes/pesertaDidikRoutes');
const penghayatRoutes = require('./routes/penghayatRoutes');
const pemukaRoutes = require('./routes/pemukaRoutes');
const sekolahRoutes = require('./routes/sekolahRoutes');
const sasanaSarasehanRoutes = require('./routes/sasanaSarasehanRoutes');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Sudah cukup, tidak perlu bodyParser

// Database connection
pool.connect()
  .then(() => console.log('✅ Connected to PostgreSQL Database'))
  .catch(err => console.error('❌ Database connection error:', err));

// Routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/organisasi', organisasiRoutes);
app.use('/penyuluh', penyuluhRoutes);
app.use('/peserta-didik', pesertaDidikRoutes);
app.use('/penghayat', penghayatRoutes);
app.use('/pemuka', pemukaRoutes);
app.use('/sekolah', sekolahRoutes);
app.use('/sasana-sarasehan', sasanaSarasehanRoutes);

// Default Route
app.get('/', (req, res) => {
  res.send('🚀 API is running...');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on localhost:${PORT}`);
});
