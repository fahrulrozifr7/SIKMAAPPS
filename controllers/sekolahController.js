const Sekolah = require('../models/sekolahModel');
const ExcelJS = require('exceljs');
const pool = require('../config/pgConfig');

// Mendapatkan semua data sekolah
const getAllSekolah = async (req, res) => {
    try {
        const data = await Sekolah.getAll();
        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error('Error mendapatkan data sekolah:', error);
        res.status(500).json({ success: false, message: "Terjadi kesalahan pada server", error: error.message });
    }
};

// Mendapatkan data sekolah berdasarkan NPSN
const getSekolahByNPSN = async (req, res) => {
    try {
        const { npsn } = req.params;
        const data = await Sekolah.getById(npsn);

        if (!data) {
            return res.status(404).json({ success: false, message: "Sekolah tidak ditemukan" });
        }

        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error('Error mendapatkan data sekolah berdasarkan NPSN:', error);
        res.status(500).json({ success: false, message: "Terjadi kesalahan pada server", error: error.message });
    }
};

// Menambahkan data sekolah baru
const createSekolah = async (req, res) => {
    try {
        const {
            npsn,
            nama,
            alamat,
            tingkat,
            provinsi,
            kota,
            kecamatan,
            kelurahan
        } = req.body;

        // Validasi input
        if (!npsn || !nama || !alamat || !tingkat || !provinsi || !kota || !kecamatan || !kelurahan) {
            return res.status(400).json({ success: false, message: "Semua field harus diisi" });
        }

        const newData = await Sekolah.create({
            npsn,
            nama,
            alamat,
            tingkat,
            provinsi,
            kota,
            kecamatan,
            kelurahan
        });

        res.status(201).json({ success: true, message: "Sekolah berhasil ditambahkan", data: newData });
    } catch (error) {
        console.error('Error menambahkan data sekolah:', error);
        res.status(500).json({ success: false, message: "Terjadi kesalahan pada server", error: error.message });
    }
};

// Memperbarui data sekolah berdasarkan NPSN
const updateSekolah = async (req, res) => {
    try {
        const { npsn } = req.params;
        const {
            nama,
            alamat,
            tingkat,
            provinsi,
            kota,
            kecamatan,
            kelurahan
        } = req.body;

        // Validasi input
        if (!nama && !alamat && !tingkat && !provinsi && !kota && !kecamatan && !kelurahan) {
            return res.status(400).json({ success: false, message: "Minimal satu field harus diisi untuk update" });
        }

        const updatedData = await Sekolah.update(npsn, {
            nama,
            alamat,
            tingkat,
            provinsi,
            kota,
            kecamatan,
            kelurahan
        });

        if (!updatedData) {
            return res.status(404).json({ success: false, message: "Sekolah tidak ditemukan" });
        }

        res.status(200).json({ success: true, message: "Sekolah berhasil diperbarui", data: updatedData });
    } catch (error) {
        console.error('Error memperbarui data sekolah:', error);
        res.status(500).json({ success: false, message: "Terjadi kesalahan pada server", error: error.message });
    }
};

// Menghapus data sekolah berdasarkan NPSN
const deleteSekolah = async (req, res) => {
    try {
        const { npsn } = req.params;
        const existing = await Sekolah.getById(npsn);

        if (!existing) {
            return res.status(404).json({ success: false, message: "Sekolah tidak ditemukan" });
        }

        await Sekolah.delete(npsn);
        res.status(200).json({ success: true, message: "Sekolah berhasil dihapus" });
    } catch (error) {
        console.error('Error menghapus data sekolah:', error);
        res.status(500).json({ success: false, message: "Terjadi kesalahan pada server", error: error.message });
    }
};

// Mendapatkan statistik jumlah sekolah berdasarkan tingkat
const getSekolahStatistics = async (req, res) => {
    try {
        const query = `
            SELECT tingkat, COUNT(*) AS jumlah
            FROM sekolah
            GROUP BY tingkat
            ORDER BY tingkat;
        `;

        const { rows } = await pool.query(query);

        if (!rows || rows.length === 0) {
            return res.status(404).json({ success: false, message: "Tidak ada data sekolah ditemukan" });
        }

        res.status(200).json({ success: true, data: rows });
    } catch (error) {
        console.error('Error mendapatkan statistik sekolah berdasarkan tingkat:', error);
        res.status(500).json({ success: false, message: "Terjadi kesalahan pada server", error: error.message });
    }
};

// Mengekspor data sekolah ke dalam file Excel
const exportSekolahToExcel = async (req, res) => {
    try {
        const data = await Sekolah.getAll();

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Sekolah');

        // Menentukan kolom untuk Excel
        worksheet.columns = [
            { header: 'NPSN', key: 'npsn', width: 15 },
            { header: 'Nama', key: 'nama', width: 25 },
            { header: 'Alamat', key: 'alamat', width: 30 },
            { header: 'Tingkat', key: 'tingkat', width: 15 },
            { header: 'Provinsi', key: 'provinsi', width: 20 },
            { header: 'Kota', key: 'kota', width: 20 },
            { header: 'Kecamatan', key: 'kecamatan', width: 20 },
            { header: 'Kelurahan', key: 'kelurahan', width: 20 },
        ];

        // Tambahkan data baris
        data.forEach((item) => {
            worksheet.addRow(item);
        });

        // Nama file dengan timestamp
        const filename = `Sekolah-${Date.now()}.xlsx`;

        // Set header response
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

        // Tulis workbook ke stream
        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error('Error saat mengekspor data sekolah ke Excel:', error);
        res.status(500).json({ success: false, message: "Terjadi kesalahan saat mengekspor data", error: error.message });
    }
};

module.exports = {
    getAllSekolah,
    getSekolahByNPSN,
    createSekolah,
    updateSekolah,
    deleteSekolah,
    getSekolahStatistics,
    exportSekolahToExcel,
};
