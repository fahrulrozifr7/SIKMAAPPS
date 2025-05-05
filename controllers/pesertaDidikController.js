const PesertaDidik = require('../models/pesertaDidikModel');
const ExcelJS = require('exceljs');

const getAllPesertaDidik = async (req, res) => {
    try {
        const data = await PesertaDidik.getAll();
        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Terjadi kesalahan pada server", error: error.message });
    }
};

const getPesertaDidikByNISN = async (req, res) => {
    try {
        const { nisn } = req.params;
        const data = await PesertaDidik.getByNISN(nisn);

        if (!data) {
            return res.status(404).json({ success: false, message: "Peserta didik tidak ditemukan" });
        }

        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Terjadi kesalahan pada server", error: error.message });
    }
};

const createPesertaDidik = async (req, res) => {
    try {
        const {
            nisn, nik, nama, jenis_kelamin, tanggal_lahir, alamat,
            tingkat_kelas, lembaga_pendidikan, asal_organisasi,
            provinsi, kota, kecamatan, kelurahan
        } = req.body;

        if (
            !nisn?.trim() || !nik?.trim() || !nama?.trim() || !jenis_kelamin?.trim() ||
            !tanggal_lahir || !alamat?.trim() || !tingkat_kelas?.trim() ||
            !lembaga_pendidikan?.trim() || !asal_organisasi?.trim() ||
            !provinsi?.trim() || !kota?.trim() || !kecamatan?.trim() || !kelurahan?.trim()
        ) {
            return res.status(400).json({ success: false, message: "Semua field harus diisi" });
        }

        const newData = await PesertaDidik.create({
            nisn, nik, nama, jenis_kelamin, tanggal_lahir, alamat,
            tingkat_kelas, lembaga_pendidikan, asal_organisasi,
            provinsi, kota, kecamatan, kelurahan
        });

        res.status(201).json({ success: true, message: "Peserta didik berhasil ditambahkan", data: newData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Terjadi kesalahan pada server", error: error.message });
    }
};

const updatePesertaDidik = async (req, res) => {
    try {
        const { nisn } = req.params;
        const {
            nama, jenis_kelamin, tanggal_lahir, alamat,
            tingkat_kelas, lembaga_pendidikan, asal_organisasi,
            provinsi, kota, kecamatan, kelurahan
        } = req.body;

        if (
            !nama && !jenis_kelamin && !tanggal_lahir && !alamat &&
            !tingkat_kelas && !lembaga_pendidikan && !asal_organisasi &&
            !provinsi && !kota && !kecamatan && !kelurahan
        ) {
            return res.status(400).json({ success: false, message: "Minimal satu field harus diisi untuk update" });
        }

        const updatedData = await PesertaDidik.update(nisn, {
            nama, jenis_kelamin, tanggal_lahir, alamat,
            tingkat_kelas, lembaga_pendidikan, asal_organisasi,
            provinsi, kota, kecamatan, kelurahan
        });

        if (!updatedData) {
            return res.status(404).json({ success: false, message: "Peserta didik tidak ditemukan" });
        }

        res.status(200).json({ success: true, message: "Peserta didik berhasil diperbarui", data: updatedData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Terjadi kesalahan pada server", error: error.message });
    }
};

const deletePesertaDidik = async (req, res) => {
    try {
        const { nisn } = req.params;
        const existingData = await PesertaDidik.getByNISN(nisn);

        if (!existingData) {
            return res.status(404).json({ success: false, message: "Peserta didik tidak ditemukan" });
        }

        await PesertaDidik.delete(nisn);
        res.status(200).json({ success: true, message: "Peserta didik berhasil dihapus" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Terjadi kesalahan pada server", error: error.message });
    }
};

const getPesertaDidikStatistics = async (req, res) => {
    try {
        const data = await PesertaDidik.getAll();

        const countByField = (field) => {
            return data.reduce((acc, curr) => {
                const key = curr[field] || 'Tidak Diketahui';
                acc[key] = (acc[key] || 0) + 1;
                return acc;
            }, {});
        };

        const statistics = {
            jenis_kelamin: countByField('jenis_kelamin'),
            tingkat_kelas: countByField('tingkat_kelas'),
            lembaga_pendidikan: countByField('lembaga_pendidikan'),
            asal_organisasi: countByField('asal_organisasi'),
            provinsi: countByField('provinsi'),
            kota: countByField('kota'),
            kecamatan: countByField('kecamatan'),
            kelurahan: countByField('kelurahan'),
        };

        res.status(200).json({ success: true, statistics });
    } catch (error) {
        console.error('Error mengambil statistik peserta didik:', error);
        res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server', error: error.message });
    }
};

const exportPesertaDidikToExcel = async (req, res) => {
    try {
        const data = await PesertaDidik.getAll();

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Peserta Didik');

        worksheet.columns = [
            { header: 'NISN', key: 'nisn', width: 15 },
            { header: 'NIK', key: 'nik', width: 16 },
            { header: 'Nama', key: 'nama', width: 25 },
            { header: 'Jenis Kelamin', key: 'jenis_kelamin', width: 15 },
            { header: 'Tanggal Lahir', key: 'tanggal_lahir', width: 15 },
            { header: 'Alamat', key: 'alamat', width: 30 },
            { header: 'Tingkat Kelas', key: 'tingkat_kelas', width: 15 },
            { header: 'Lembaga Pendidikan', key: 'lembaga_pendidikan', width: 25 },
            { header: 'Asal Organisasi', key: 'asal_organisasi', width: 20 },
            { header: 'Provinsi', key: 'provinsi', width: 20 },
            { header: 'Kota', key: 'kota', width: 20 },
            { header: 'Kecamatan', key: 'kecamatan', width: 20 },
            { header: 'Kelurahan', key: 'kelurahan', width: 20 },
        ];

        data.forEach((item) => {
            worksheet.addRow(item);
        });

        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader(
            'Content-Disposition',
            'attachment; filename=PesertaDidik.xlsx'
        );

        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error('Error saat mengekspor Excel:', error);
        res.status(500).json({ success: false, message: "Terjadi kesalahan pada server", error: error.message });
    }
};

module.exports = {
    getAllPesertaDidik,
    getPesertaDidikByNISN,
    createPesertaDidik,
    updatePesertaDidik,
    deletePesertaDidik,
    exportPesertaDidikToExcel,
    getPesertaDidikStatistics,
};
