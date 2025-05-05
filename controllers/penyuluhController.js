const Penyuluh = require('../models/penyuluhModel');
const ExcelJS = require('exceljs');
const db = require('../config/pgConfig'); // untuk statistik

const getAllPenyuluh = async (req, res) => {
    try {
        const data = await Penyuluh.getAll();
        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: "Terjadi kesalahan pada server", error: error.message });
    }
};

const getPenyuluhByNoSertifikat = async (req, res) => {
    try {
        const { no_sertifikat } = req.params;
        const data = await Penyuluh.getByNoSertifikat(no_sertifikat);

        if (!data) {
            return res.status(404).json({ success: false, message: "Penyuluh tidak ditemukan" });
        }

        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: "Terjadi kesalahan pada server", error: error.message });
    }
};

const createPenyuluh = async (req, res) => {
    try {
        const {
            no_sertifikat, nama, alamat, nik, tanggal_lahir, pendidikan_terakhir,
            lembaga_pendidikan, pekerjaan, status_mengajar,
            jumlah_peserta_didik_sd, jumlah_peserta_didik_smp, jumlah_peserta_didik_sma,
            jumlah_peserta_didik_universitas, asal_organisasi,
            jenis_sertifikat, tahun_berlaku_sertifikat, tempat_mengajar, jenis_kendaraan,
            provinsi, kota, kecamatan, kelurahan
        } = req.body;

        if (
            !no_sertifikat || !nama || !alamat || !nik || !tanggal_lahir || !pendidikan_terakhir ||
            !lembaga_pendidikan || !pekerjaan || !status_mengajar ||
            jumlah_peserta_didik_sd === undefined || jumlah_peserta_didik_smp === undefined ||
            jumlah_peserta_didik_sma === undefined || jumlah_peserta_didik_universitas === undefined ||
            !asal_organisasi || !jenis_sertifikat || !tahun_berlaku_sertifikat ||
            !tempat_mengajar || !jenis_kendaraan || !provinsi || !kota || !kecamatan || !kelurahan
        ) {
            return res.status(400).json({ success: false, message: "Semua field harus diisi dengan benar" });
        }

        const newData = await Penyuluh.create({
            no_sertifikat, nama, alamat, nik, tanggal_lahir, pendidikan_terakhir,
            lembaga_pendidikan, pekerjaan, status_mengajar,
            jumlah_peserta_didik_sd, jumlah_peserta_didik_smp, jumlah_peserta_didik_sma,
            jumlah_peserta_didik_universitas, asal_organisasi,
            jenis_sertifikat, tahun_berlaku_sertifikat, tempat_mengajar, jenis_kendaraan,
            provinsi, kota, kecamatan, kelurahan
        });

        res.status(201).json({ success: true, message: "Penyuluh berhasil ditambahkan", data: newData });
    } catch (error) {
        res.status(500).json({ success: false, message: "Terjadi kesalahan pada server", error: error.message });
    }
};

const updatePenyuluh = async (req, res) => {
    try {
        const { no_sertifikat } = req.params;
        const {
            nama, alamat, nik, tanggal_lahir, pendidikan_terakhir,
            lembaga_pendidikan, pekerjaan, status_mengajar,
            jumlah_peserta_didik_sd, jumlah_peserta_didik_smp, jumlah_peserta_didik_sma,
            jumlah_peserta_didik_universitas, asal_organisasi,
            jenis_sertifikat, tahun_berlaku_sertifikat, tempat_mengajar, jenis_kendaraan,
            provinsi, kota, kecamatan, kelurahan
        } = req.body;

        const updatedData = await Penyuluh.update(no_sertifikat, {
            nama, alamat, nik, tanggal_lahir, pendidikan_terakhir,
            lembaga_pendidikan, pekerjaan, status_mengajar,
            jumlah_peserta_didik_sd, jumlah_peserta_didik_smp, jumlah_peserta_didik_sma,
            jumlah_peserta_didik_universitas, asal_organisasi,
            jenis_sertifikat, tahun_berlaku_sertifikat, tempat_mengajar, jenis_kendaraan,
            provinsi, kota, kecamatan, kelurahan
        });

        if (!updatedData) {
            return res.status(404).json({ success: false, message: "Penyuluh tidak ditemukan" });
        }

        res.status(200).json({ success: true, message: "Penyuluh berhasil diperbarui", data: updatedData });
    } catch (error) {
        res.status(500).json({ success: false, message: "Terjadi kesalahan pada server", error: error.message });
    }
};

const deletePenyuluh = async (req, res) => {
    try {
        const { no_sertifikat } = req.params;
        const existingData = await Penyuluh.getByNoSertifikat(no_sertifikat);

        if (!existingData) {
            return res.status(404).json({ success: false, message: "Penyuluh tidak ditemukan" });
        }

        await Penyuluh.delete(no_sertifikat);
        res.status(200).json({ success: true, message: "Penyuluh berhasil dihapus" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Terjadi kesalahan pada server", error: error.message });
    }
};

const getPenyuluhStatistics = async (req, res) => {
    try {
        const stats = {};

        const queries = [
            { key: 'pendidikan_terakhir', sql: 'SELECT pendidikan_terakhir AS key, COUNT(*) AS count FROM penyuluh GROUP BY key' },
            { key: 'lembaga_pendidikan', sql: 'SELECT lembaga_pendidikan AS key, COUNT(*) AS count FROM penyuluh GROUP BY key' },
            { key: 'pekerjaan', sql: 'SELECT pekerjaan AS key, COUNT(*) AS count FROM penyuluh GROUP BY key' },
            { key: 'status_mengajar', sql: 'SELECT status_mengajar AS key, COUNT(*) AS count FROM penyuluh GROUP BY key' },
            { key: 'asal_organisasi', sql: 'SELECT asal_organisasi AS key, COUNT(*) AS count FROM penyuluh GROUP BY key' },
            { key: 'tempat_mengajar', sql: 'SELECT tempat_mengajar AS key, COUNT(*) AS count FROM penyuluh GROUP BY key' },
            { key: 'jenis_kendaraan', sql: 'SELECT jenis_kendaraan AS key, COUNT(*) AS count FROM penyuluh GROUP BY key' },
        ];

        for (const { key, sql } of queries) {
            const result = await db.query(sql);
            stats[key] = {};
            result.rows.forEach(row => {
                stats[key][row.key || 'Tidak Diketahui'] = parseInt(row.count, 10);
            });
        }

        const pesertaResult = await db.query(`
            SELECT
                SUM(jumlah_peserta_didik_sd) AS sd,
                SUM(jumlah_peserta_didik_smp) AS smp,
                SUM(jumlah_peserta_didik_sma) AS sma,
                SUM(jumlah_peserta_didik_universitas) AS universitas
            FROM penyuluh
        `);

        stats.jumlah_peserta_didik = pesertaResult.rows[0];

        res.json({ statistics: stats });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
};

const exportPenyuluhExcel = async (req, res) => {
    try {
        const data = await Penyuluh.getAll();

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Data Penyuluh');

        worksheet.columns = [
            { header: 'No Sertifikat', key: 'no_sertifikat' },
            { header: 'Nama', key: 'nama' },
            { header: 'Alamat', key: 'alamat' },
            { header: 'NIK', key: 'nik' },
            { header: 'Tanggal Lahir', key: 'tanggal_lahir' },
            { header: 'Pendidikan Terakhir', key: 'pendidikan_terakhir' },
            { header: 'Lembaga Pendidikan', key: 'lembaga_pendidikan' },
            { header: 'Pekerjaan', key: 'pekerjaan' },
            { header: 'Status Mengajar', key: 'status_mengajar' },
            { header: 'Peserta SD', key: 'jumlah_peserta_didik_sd' },
            { header: 'Peserta SMP', key: 'jumlah_peserta_didik_smp' },
            { header: 'Peserta SMA', key: 'jumlah_peserta_didik_sma' },
            { header: 'Peserta Universitas', key: 'jumlah_peserta_didik_universitas' },
            { header: 'Asal Organisasi', key: 'asal_organisasi' },
            { header: 'Jenis Sertifikat', key: 'jenis_sertifikat' },
            { header: 'Tahun Berlaku Sertifikat', key: 'tahun_berlaku_sertifikat' },
            { header: 'Tempat Mengajar', key: 'tempat_mengajar' },
            { header: 'Jenis Kendaraan', key: 'jenis_kendaraan' },
            { header: 'Provinsi', key: 'provinsi' },
            { header: 'Kota', key: 'kota' },
            { header: 'Kecamatan', key: 'kecamatan' },
            { header: 'Kelurahan', key: 'kelurahan' }
        ];

        worksheet.addRows(data);

        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader(
            'Content-Disposition',
            'attachment; filename=penyuluh.xlsx'
        );

        await workbook.xlsx.write(res);
        res.end();
    } catch (err) {
        res.status(500).json({ success: false, message: "Gagal ekspor data", error: err.message });
    }
};

module.exports = {
    getAllPenyuluh,
    getPenyuluhByNoSertifikat,
    createPenyuluh,
    updatePenyuluh,
    deletePenyuluh,
    exportPenyuluhExcel,
    getPenyuluhStatistics
};
