const SasanaSarasehan = require('../models/sasanaSarasehanModel');
const ExcelJS = require('exceljs');

const getAllSasanaSarasehan = async (req, res) => {
    try {
        const data = await SasanaSarasehan.getAll();
        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Terjadi kesalahan pada server", error: error.message });
    }
};

const getSasanaSarasehanByNama = async (req, res) => {
    try {
        const { nama } = req.params;
        const data = await SasanaSarasehan.getById(nama);

        if (!data) {
            return res.status(404).json({ success: false, message: "Sasana Sarasehan tidak ditemukan" });
        }

        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Terjadi kesalahan pada server", error: error.message });
    }
};

const createSasanaSarasehan = async (req, res) => {
    try {
        const {
            nama, asal_organisasi, luas, alamat,
            kelurahan, kecamatan, kota, provinsi,
            longitude, latitude
        } = req.body;

        if (!nama || !asal_organisasi || !luas || !alamat || !kelurahan || !kecamatan || !kota || !provinsi || !longitude || !latitude) {
            return res.status(400).json({ success: false, message: "Semua field harus diisi" });
        }

        const newData = await SasanaSarasehan.create({
            nama, asal_organisasi, luas, alamat,
            kelurahan, kecamatan, kota, provinsi,
            longitude, latitude
        });

        res.status(201).json({ success: true, message: "Sasana Sarasehan berhasil ditambahkan", data: newData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Terjadi kesalahan pada server", error: error.message });
    }
};

const updateSasanaSarasehan = async (req, res) => {
    try {
        const { nama } = req.params;
        const {
            asal_organisasi, luas, alamat,
            kelurahan, kecamatan, kota, provinsi,
            longitude, latitude
        } = req.body;

        if (!asal_organisasi && !luas && !alamat && !kelurahan && !kecamatan && !kota && !provinsi && !longitude && !latitude) {
            return res.status(400).json({ success: false, message: "Minimal satu field harus diisi untuk update" });
        }

        const updatedData = await SasanaSarasehan.update(nama, {
            asal_organisasi, luas, alamat,
            kelurahan, kecamatan, kota, provinsi,
            longitude, latitude
        });

        if (!updatedData) {
            return res.status(404).json({ success: false, message: "Sasana Sarasehan tidak ditemukan" });
        }

        res.status(200).json({ success: true, message: "Sasana Sarasehan berhasil diperbarui", data: updatedData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Terjadi kesalahan pada server", error: error.message });
    }
};

const deleteSasanaSarasehan = async (req, res) => {
    try {
        const { nama } = req.params;
        const existingData = await SasanaSarasehan.getById(nama);

        if (!existingData) {
            return res.status(404).json({ success: false, message: "Sasana Sarasehan tidak ditemukan" });
        }

        await SasanaSarasehan.delete(nama);
        res.status(200).json({ success: true, message: "Sasana Sarasehan berhasil dihapus" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Terjadi kesalahan pada server", error: error.message });
    }
};

const getSasanaSarasehanStatistics = async (req, res) => {
    try {
        const allData = await SasanaSarasehan.getAll();

        const completeData = allData.filter(item =>
            item.kelurahan?.trim() && item.kecamatan?.trim() && item.kota?.trim() && item.provinsi?.trim()
        );

        const totalComplete = completeData.length;

        const locationStats = {
            kelurahan: completeData.filter(item => item.kelurahan?.trim()).length,
            kecamatan: completeData.filter(item => item.kecamatan?.trim()).length,
            kota: completeData.filter(item => item.kota?.trim()).length,
            provinsi: completeData.filter(item => item.provinsi?.trim()).length,
        };

        res.status(200).json({
            success: true,
            data: {
                totalComplete,
                locationStats,
            }
        });
    } catch (error) {
        console.error("Error statistik Sasana Sarasehan:", error);
        res.status(500).json({ success: false, message: "Gagal mengambil statistik Sasana Sarasehan", error: error.message });
    }
};

const exportSasanaSarasehanToExcel = async (req, res) => {
    try {
        const data = await SasanaSarasehan.getAll();

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Sasana Sarasehan');

        worksheet.columns = [
            { header: 'Nama', key: 'nama', width: 25 },
            { header: 'Asal Organisasi', key: 'asal_organisasi', width: 25 },
            { header: 'Luas (m2)', key: 'luas', width: 12 },
            { header: 'Alamat', key: 'alamat', width: 30 },
            { header: 'Kelurahan', key: 'kelurahan', width: 15 },
            { header: 'Kecamatan', key: 'kecamatan', width: 15 },
            { header: 'Kota', key: 'kota', width: 20 },
            { header: 'Provinsi', key: 'provinsi', width: 20 },
            { header: 'Longitude', key: 'longitude', width: 15 },
            { header: 'Latitude', key: 'latitude', width: 15 },
        ];

        data.forEach(item => {
            worksheet.addRow(item);
        });

        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader(
            'Content-Disposition',
            'attachment; filename=SasanaSarasehan.xlsx'
        );

        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error('Error saat mengekspor Excel:', error);
        res.status(500).json({ success: false, message: "Terjadi kesalahan pada server", error: error.message });
    }
};

module.exports = {
    getAllSasanaSarasehan,
    getSasanaSarasehanByNama,
    createSasanaSarasehan,
    updateSasanaSarasehan,
    deleteSasanaSarasehan,
    getSasanaSarasehanStatistics,
    exportSasanaSarasehanToExcel,
};
