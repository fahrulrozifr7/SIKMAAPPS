const Pemuka = require('../models/pemukaModel');
const ExcelJS = require('exceljs');

// Get all pemuka
const getAllPemuka = async (req, res) => {
    try {
        const data = await Pemuka.getAll();
        if (data.length === 0) {
            return res.status(404).json({ success: false, message: "Tidak ada data Pemuka ditemukan" });
        }
        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Terjadi kesalahan pada server", error: error.message });
    }
};

// Get pemuka by ID
const getPemukaById = async (req, res) => {
    try {
        const { id_pemuka } = req.params;
        const data = await Pemuka.getById(id_pemuka);

        if (!data) {
            return res.status(404).json({ success: false, message: "Pemuka tidak ditemukan" });
        }

        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Terjadi kesalahan pada server", error: error.message });
    }
};

// Create new pemuka
const createPemuka = async (req, res) => {
    try {
        const {
            id_pemuka, nik, nama, jenis_kelamin, tanggal_lahir,
            alamat, status, asal_organisasi,
            provinsi, kota, kecamatan, kelurahan
        } = req.body;

        if (!id_pemuka || !nik || !nama || !jenis_kelamin || !tanggal_lahir || !alamat || !status || !asal_organisasi || !provinsi || !kota || !kecamatan || !kelurahan) {
            return res.status(400).json({ success: false, message: "Semua field harus diisi, pastikan tidak ada yang kosong" });
        }

        const newData = await Pemuka.create({
            id_pemuka, nik, nama, jenis_kelamin, tanggal_lahir,
            alamat, status, asal_organisasi,
            provinsi, kota, kecamatan, kelurahan
        });

        res.status(201).json({ success: true, message: "Pemuka berhasil ditambahkan", data: newData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Terjadi kesalahan pada server", error: error.message });
    }
};

// Update pemuka
const updatePemuka = async (req, res) => {
    try {
        const { id_pemuka } = req.params;
        const {
            nik, nama, jenis_kelamin, tanggal_lahir,
            alamat, status, asal_organisasi,
            provinsi, kota, kecamatan, kelurahan
        } = req.body;

        if (!nik && !nama && !jenis_kelamin && !tanggal_lahir && !alamat && !status && !asal_organisasi && !provinsi && !kota && !kecamatan && !kelurahan) {
            return res.status(400).json({ success: false, message: "Minimal satu field harus diisi untuk update" });
        }

        const updatedData = await Pemuka.update(id_pemuka, {
            nik, nama, jenis_kelamin, tanggal_lahir,
            alamat, status, asal_organisasi,
            provinsi, kota, kecamatan, kelurahan
        });

        if (!updatedData) {
            return res.status(404).json({ success: false, message: "Pemuka tidak ditemukan" });
        }

        res.status(200).json({ success: true, message: "Pemuka berhasil diperbarui", data: updatedData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Terjadi kesalahan pada server", error: error.message });
    }
};

// Delete pemuka
const deletePemuka = async (req, res) => {
    try {
        const { id_pemuka } = req.params;
        const existingData = await Pemuka.getById(id_pemuka);

        if (!existingData) {
            return res.status(404).json({ success: false, message: "Pemuka tidak ditemukan" });
        }

        await Pemuka.delete(id_pemuka);
        res.status(200).json({ success: true, message: "Pemuka berhasil dihapus" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Terjadi kesalahan pada server", error: error.message });
    }
};

// Get statistics
const getStatistics = async (req, res) => {
    try {
        const all = await Pemuka.getAll();
        if (all.length === 0) {
            return res.status(404).json({ success: false, message: "Tidak ada data Pemuka untuk dihitung statistik" });
        }

        const total = all.length;
        const active = all.filter(item => item.status === 'Aktif').length;
        const inactive = all.filter(item => item.status === 'Tidak Aktif').length;
        const male = all.filter(item => item.jenis_kelamin === 'Laki-laki').length;
        const female = all.filter(item => item.jenis_kelamin === 'Perempuan').length;

        const organizations = all.reduce((acc, item) => {
            if (acc[item.asal_organisasi]) {
                acc[item.asal_organisasi]++;
            } else {
                acc[item.asal_organisasi] = 1;
            }
            return acc;
        }, {});

        res.status(200).json({
            success: true,
            statistics: {
                total,
                active,
                inactive,
                male,
                female,
                organizations
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Gagal mengambil statistik", error: error.message });
    }
};

// Export Pemuka to Excel
const exportPemukaExcel = async (req, res) => {
    try {
        const data = await Pemuka.getAll();

        if (data.length === 0) {
            return res.status(404).json({ success: false, message: "Tidak ada data Pemuka untuk diekspor" });
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Data Pemuka');

        worksheet.columns = [
            { header: 'ID Pemuka', key: 'id_pemuka' },
            { header: 'NIK', key: 'nik' },
            { header: 'Nama', key: 'nama' },
            { header: 'Jenis Kelamin', key: 'jenis_kelamin' },
            { header: 'Tanggal Lahir', key: 'tanggal_lahir' },
            { header: 'Alamat', key: 'alamat' },
            { header: 'Provinsi', key: 'provinsi' },
            { header: 'Kota', key: 'kota' },
            { header: 'Kecamatan', key: 'kecamatan' },
            { header: 'Kelurahan', key: 'kelurahan' },
            { header: 'Status', key: 'status' },
            { header: 'Asal Organisasi', key: 'asal_organisasi' },
        ];

        worksheet.addRows(data);

        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader(
            'Content-Disposition',
            'attachment; filename=pemuka.xlsx'
        );

        await workbook.xlsx.write(res);
        res.end();
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Gagal ekspor data", error: err.message });
    }
};

module.exports = {
    getAllPemuka,
    getPemukaById,
    createPemuka,
    updatePemuka,
    deletePemuka,
    exportPemukaExcel,
    getStatistics
};
