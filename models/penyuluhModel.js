const pool = require('../config/pgConfig');

const Penyuluh = {
    getAll: async () => {
        const result = await pool.query('SELECT * FROM penyuluh');
        return result.rows;
    },

    getByNoSertifikat: async (no_sertifikat) => {
        const result = await pool.query('SELECT * FROM penyuluh WHERE no_sertifikat = $1', [no_sertifikat]);
        return result.rows[0];
    },

    create: async (data) => {
        const keys = Object.keys(data);
        const values = Object.values(data);
        const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
        const query = `INSERT INTO penyuluh (${keys.join(', ')}) VALUES (${placeholders}) RETURNING *`;
        const result = await pool.query(query, values);
        return result.rows[0];
    },

    update: async (no_sertifikat, data) => {
        let query = 'UPDATE penyuluh SET ';
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

        if (fields.length === 0) {
            return null;
        }

        query += fields.join(', ') + ' WHERE no_sertifikat = $' + index + ' RETURNING *';
        values.push(no_sertifikat);

        const result = await pool.query(query, values);
        return result.rows[0];
    },

    delete: async (no_sertifikat) => {
        await pool.query('DELETE FROM penyuluh WHERE no_sertifikat = $1', [no_sertifikat]);
        return { message: 'Penyuluh berhasil dihapus' };
    }
};

module.exports = Penyuluh;
