const pool = require('../config/pgConfig');

const Pemuka = {
    // Get all pemuka
    getAll: async () => {
        const result = await pool.query('SELECT * FROM pemuka');
        return result.rows;
    },

    // Get pemuka by ID
    getById: async (id_pemuka) => {
        const result = await pool.query('SELECT * FROM pemuka WHERE id_pemuka = $1', [id_pemuka]);
        return result.rows[0];
    },

    // Create a new pemuka
    create: async (data) => {
        const { id_pemuka, nik, nama, jenis_kelamin, tanggal_lahir, alamat, status, asal_organisasi, provinsi, kota, kecamatan, kelurahan } = data;
        const result = await pool.query(
            `INSERT INTO pemuka (id_pemuka, nik, nama, jenis_kelamin, tanggal_lahir, alamat, status, asal_organisasi, provinsi, kota, kecamatan, kelurahan) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
            [id_pemuka, nik, nama, jenis_kelamin, tanggal_lahir, alamat, status, asal_organisasi, provinsi, kota, kecamatan, kelurahan]
        );
        return result.rows[0];
    },

    // Update pemuka data
    update: async (id_pemuka, data) => {
        let query = 'UPDATE pemuka SET ';
        const fields = [];
        const values = [];
        let index = 1;

        // Loop through the fields to dynamically build the query
        for (const key in data) {
            if (data[key] !== undefined && data[key] !== null) {
                fields.push(`${key} = $${index}`);
                values.push(data[key]);
                index++;
            }
        }

        // If no fields are provided for update, return null
        if (fields.length === 0) return null;

        query += fields.join(', ') + ' WHERE id_pemuka = $' + index + ' RETURNING *';
        values.push(id_pemuka);

        const result = await pool.query(query, values);
        return result.rows[0];
    },

    // Delete pemuka by ID
    delete: async (id_pemuka) => {
        await pool.query('DELETE FROM pemuka WHERE id_pemuka = $1', [id_pemuka]);
        return { message: 'Pemuka berhasil dihapus' };
    }
};

module.exports = Pemuka;
