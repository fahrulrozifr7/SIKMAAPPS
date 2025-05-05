const pool = require('../config/pgConfig');

const Penghayat = {
    getAll: async () => {
        const result = await pool.query('SELECT * FROM penghayat');
        return result.rows;
    },

    getByNIK: async (nik) => {
        const result = await pool.query('SELECT * FROM penghayat WHERE nik = $1', [nik]);
        return result.rows[0];
    },

    create: async (data) => {
        const { nik, nama, jenis_kelamin, tanggal_lahir, alamat, asal_organisasi, provinsi, kota, kecamatan, kelurahan } = data;
        const result = await pool.query(
            `INSERT INTO penghayat 
            (nik, nama, jenis_kelamin, tanggal_lahir, alamat, asal_organisasi, provinsi, kota, kecamatan, kelurahan) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
            [nik, nama, jenis_kelamin, tanggal_lahir, alamat, asal_organisasi, provinsi, kota, kecamatan, kelurahan]
        );
        return result.rows[0];
    },

    update: async (nik, data) => {
        let query = 'UPDATE penghayat SET ';
        const fields = [];
        const values = [];
        let index = 1;

        for (const key in data) {
            if (data[key] !== undefined && data[key] !== null) {
                fields.push(`${key} = $${index}`);
                values.push(data[key]);
                index++;
            }
        }

        if (fields.length === 0) return null;

        query += fields.join(', ') + ' WHERE nik = $' + index + ' RETURNING *';
        values.push(nik);

        const result = await pool.query(query, values);
        return result.rows[0];
    },

    delete: async (nik) => {
        await pool.query('DELETE FROM penghayat WHERE nik = $1', [nik]);
        return { message: 'Penghayat berhasil dihapus' };
    }
};

module.exports = Penghayat;
