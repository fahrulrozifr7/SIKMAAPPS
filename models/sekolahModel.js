const pool = require('../config/pgConfig');

const Sekolah = {
    getAll: async () => {
        const result = await pool.query('SELECT * FROM sekolah');
        return result.rows;
    },

    getById: async (npsn) => {
        const result = await pool.query('SELECT * FROM sekolah WHERE npsn = $1', [npsn]);
        return result.rows[0];
    },

    create: async (data) => {
        const keys = Object.keys(data);
        const values = Object.values(data);
        const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
        const query = `INSERT INTO sekolah (${keys.join(', ')}) VALUES (${placeholders}) RETURNING *`;
        const result = await pool.query(query, values);
        return result.rows[0];
    },

    update: async (npsn, data) => {
        let query = 'UPDATE sekolah SET ';
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

        query += fields.join(', ') + ' WHERE npsn = $' + index + ' RETURNING *';
        values.push(npsn);

        const result = await pool.query(query, values);
        return result.rows[0];
    },

    delete: async (npsn) => {
        await pool.query('DELETE FROM sekolah WHERE npsn = $1', [npsn]);
        return { message: 'Sekolah berhasil dihapus' };
    }
};

module.exports = Sekolah;
