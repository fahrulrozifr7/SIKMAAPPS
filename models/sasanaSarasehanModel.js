const pool = require('../config/pgConfig');

const SasanaSarasehan = {
    getAll: async () => {
        const result = await pool.query('SELECT * FROM sasana_sarasehan');
        return result.rows;
    },

    getById: async (nama) => {
        const result = await pool.query('SELECT * FROM sasana_sarasehan WHERE nama = $1', [nama]);
        return result.rows[0];
    },

    create: async (data) => {
        const keys = Object.keys(data);
        const values = Object.values(data);
        const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
        const query = `INSERT INTO sasana_sarasehan (${keys.join(', ')}) VALUES (${placeholders}) RETURNING *`;
        const result = await pool.query(query, values);
        return result.rows[0];
    },

    update: async (nama, data) => {
        let query = 'UPDATE sasana_sarasehan SET ';
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

        query += fields.join(', ') + ' WHERE nama = $' + index + ' RETURNING *';
        values.push(nama);

        const result = await pool.query(query, values);
        return result.rows[0];
    },

    delete: async (nama) => {
        await pool.query('DELETE FROM sasana_sarasehan WHERE nama = $1', [nama]);
        return { message: 'Sasana Sarasehan berhasil dihapus' };
    }
};

module.exports = SasanaSarasehan;
