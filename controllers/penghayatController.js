const Penghayat = require('../models/penghayatModel');
const ExcelJS = require('exceljs');

const getAllPenghayat = async (req, res) => {
    try {
        const data = await Penghayat.getAll();
        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Terjadi kesalahan pada server", error: error.message });
    }
};

const getPenghayatByNIK = async (req, res) => {
    try {
        const { nik } = req.params;
        const data = await Penghayat.getByNIK(nik);

        if (!data) {
            return res.status(404).json({ success: false, message: "Penghayat tidak ditemukan" });
        }

        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Terjadi kesalahan pada server", error: error.message });
    }
};

const createPenghayat = async (req, res) => {
    try {
        const {
            nik, nama, jenis_kelamin, tanggal_lahir,
            alamat, asal_organisasi, provinsi, kota, kecamatan, kelurahan
        } = req.body;

        if (!nik || !nama || !jenis_kelamin || !tanggal_lahir || !alamat || !asal_organisasi || !provinsi || !kota || !kecamatan || !kelurahan) {
            return res.status(400).json({ success: false, message: "Semua field harus diisi" });
        }

        const newData = await Penghayat.create({
            nik, nama, jenis_kelamin, tanggal_lahir,
            alamat, asal_organisasi, provinsi, kota, kecamatan, kelurahan
        });

        res.status(201).json({ success: true, message: "Penghayat berhasil ditambahkan", data: newData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Terjadi kesalahan pada server", error: error.message });
    }
};

const updatePenghayat = async (req, res) => {
    try {
        const { nik } = req.params;
        const {
            nama, jenis_kelamin, tanggal_lahir,
            alamat, asal_organisasi, provinsi, kota, kecamatan, kelurahan
        } = req.body;

        if (!nama && !jenis_kelamin && !tanggal_lahir && !alamat && !asal_organisasi && !provinsi && !kota && !kecamatan && !kelurahan) {
            return res.status(400).json({ success: false, message: "Minimal satu field harus diisi untuk update" });
        }

        const updatedData = await Penghayat.update(nik, {
            nama, jenis_kelamin, tanggal_lahir,
            alamat, asal_organisasi, provinsi, kota, kecamatan, kelurahan
        });

        if (!updatedData) {
            return res.status(404).json({ success: false, message: "Penghayat tidak ditemukan" });
        }

        res.status(200).json({ success: true, message: "Penghayat berhasil diperbarui", data: updatedData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Terjadi kesalahan pada server", error: error.message });
    }
};

const deletePenghayat = async (req, res) => {
    try {
        const { nik } = req.params;
        const existingData = await Penghayat.getByNIK(nik);

        if (!existingData) {
            return res.status(404).json({ success: false, message: "Penghayat tidak ditemukan" });
        }

        await Penghayat.delete(nik);
        res.status(200).json({ success: true, message: "Penghayat berhasil dihapus" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Terjadi kesalahan pada server", error: error.message });
    }
};

const getPenghayatStatistics = async (req, res) => {
    try {
        const data = await Penghayat.getAll();

        const stats = {
            total: data.length,
            male: data.filter(p => p.jenis_kelamin === 'Laki-laki').length,
            female: data.filter(p => p.jenis_kelamin === 'Perempuan').length,
            organizations: {},
        };

        data.forEach(p => {
            if (!stats.organizations[p.asal_organisasi]) {
                stats.organizations[p.asal_organisasi] = 0;
            }
            stats.organizations[p.asal_organisasi]++;
        });

        res.status(200).json({ success: true, statistics: stats });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Gagal memuat statistik", error: err.message });
    }
};

const exportPenghayatExcel = async (req, res) => {
    try {
        const data = await Penghayat.getAll();

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Data Penghayat');

        worksheet.columns = [
            { header: 'NIK', key: 'nik' },
            { header: 'Nama', key: 'nama' },
            { header: 'Jenis Kelamin', key: 'jenis_kelamin' },
            { header: 'Tanggal Lahir', key: 'tanggal_lahir' },
            { header: 'Alamat', key: 'alamat' },
            { header: 'Asal Organisasi', key: 'asal_organisasi' },
            { header: 'Provinsi', key: 'provinsi' },
            { header: 'Kota', key: 'kota' },
            { header: 'Kecamatan', key: 'kecamatan' },
            { header: 'Kelurahan', key: 'kelurahan' },
        ];

        worksheet.addRows(data);

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=penghayat.xlsx');

        await workbook.xlsx.write(res);
        res.end();
    } catch (err) {
        res.status(500).json({ success: false, message: "Gagal ekspor data", error: err.message });
    }
};

module.exports = {
    getAllPenghayat,
    getPenghayatByNIK,
    createPenghayat,
    updatePenghayat,
    deletePenghayat,
    getPenghayatStatistics,
    exportPenghayatExcel,
};
