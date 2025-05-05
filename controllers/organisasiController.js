const Organisasi = require('../models/organisasiModel');
const ExcelJS = require('exceljs');
const pool = require('../config/pgConfig');

// Fungsi untuk mendapatkan semua data organisasi
const getAllOrganisasi = async (req, res) => {
    try {
        const data = await Organisasi.getAll();
        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Terjadi kesalahan pada server", error: error.message });
    }
};

// Fungsi untuk mendapatkan organisasi berdasarkan ID
const getOrganisasiById = async (req, res) => {
    try {
        const { no_inventarisasi } = req.params;
        const data = await Organisasi.getById(no_inventarisasi);

        if (!data) {
            return res.status(404).json({ success: false, message: "Organisasi tidak ditemukan" });
        }

        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Terjadi kesalahan pada server", error: error.message });
    }
};

// Fungsi untuk menambahkan data organisasi baru
const createOrganisasi = async (req, res) => {
    try {
        const {
            no_inventarisasi, nama, alamat, ketua, status,
            provinsi, kota, kecamatan, kelurahan
        } = req.body;

        if (!no_inventarisasi || !nama || !alamat || !ketua || !status || !provinsi || !kota || !kecamatan || !kelurahan) {
            return res.status(400).json({ success: false, message: "Semua field harus diisi" });
        }

        const newData = await Organisasi.create({
            no_inventarisasi, nama, alamat, ketua, status,
            provinsi, kota, kecamatan, kelurahan
        });

        res.status(201).json({ success: true, message: "Organisasi berhasil ditambahkan", data: newData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Terjadi kesalahan pada server", error: error.message });
    }
};

// Fungsi untuk memperbarui data organisasi
const updateOrganisasi = async (req, res) => {
    try {
        const { no_inventarisasi } = req.params;
        const {
            nama, alamat, ketua, status,
            provinsi, kota, kecamatan, kelurahan
        } = req.body;

        if (!nama && !alamat && !ketua && !status && !provinsi && !kota && !kecamatan && !kelurahan) {
            return res.status(400).json({ success: false, message: "Minimal satu field harus diisi untuk update" });
        }

        const updatedData = await Organisasi.update(no_inventarisasi, {
            nama, alamat, ketua, status,
            provinsi, kota, kecamatan, kelurahan
        });

        if (!updatedData) {
            return res.status(404).json({ success: false, message: "Organisasi tidak ditemukan" });
        }

        res.status(200).json({ success: true, message: "Organisasi berhasil diperbarui", data: updatedData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Terjadi kesalahan pada server", error: error.message });
    }
};

// Fungsi untuk menghapus data organisasi
const deleteOrganisasi = async (req, res) => {
    try {
        const { no_inventarisasi } = req.params;
        const existingData = await Organisasi.getById(no_inventarisasi);

        if (!existingData) {
            return res.status(404).json({ success: false, message: "Organisasi tidak ditemukan" });
        }

        await Organisasi.delete(no_inventarisasi);
        res.status(200).json({ success: true, message: "Organisasi berhasil dihapus" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Terjadi kesalahan pada server", error: error.message });
    }
};

// Fungsi untuk ekspor data organisasi ke Excel
const exportOrganisasiExcel = async (req, res) => {
    try {
        const data = await Organisasi.getAll();

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Data Organisasi');

        worksheet.columns = [
            { header: 'No Inventarisasi', key: 'no_inventarisasi' },
            { header: 'Nama Organisasi', key: 'nama' },
            { header: 'Alamat', key: 'alamat' },
            { header: 'Ketua', key: 'ketua' },
            { header: 'Status', key: 'status' },
            { header: 'Provinsi', key: 'provinsi' },
            { header: 'Kota', key: 'kota' },
            { header: 'Kecamatan', key: 'kecamatan' },
            { header: 'Kelurahan', key: 'kelurahan' },
        ];

        worksheet.addRows(data);

        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader(
            'Content-Disposition',
            'attachment; filename=organisasi.xlsx'
        );

        await workbook.xlsx.write(res);
        res.end();
    } catch (err) {
        res.status(500).json({ success: false, message: "Gagal ekspor data", error: err.message });
    }
};

// Fungsi untuk mendapatkan statistik jumlah organisasi
const getStatistics = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                COUNT(*) as total, 
                COUNT(CASE WHEN status = 'Aktif' THEN 1 END) as active, 
                COUNT(CASE WHEN status = 'Non-Aktif' THEN 1 END) as inactive 
            FROM organisasi
        `);

        res.status(200).json({ success: true, statistics: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Terjadi kesalahan pada server", error: error.message });
    }
};

module.exports = {
    getAllOrganisasi,
    getOrganisasiById,
    createOrganisasi,
    updateOrganisasi,
    deleteOrganisasi,
    exportOrganisasiExcel,
    getStatistics,
};
