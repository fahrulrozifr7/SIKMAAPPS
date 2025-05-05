const pool = require('../config/pgConfig');

const Organisasi = {
    getAll: async () => {
        const result = await pool.query('SELECT * FROM organisasi');
        return result.rows;
    },

    getById: async (no_inventarisasi) => {
        const result = await pool.query('SELECT * FROM organisasi WHERE no_inventarisasi = $1', [no_inventarisasi]);
        return result.rows[0];
    },

    create: async (data) => {
        const keys = Object.keys(data);
        const values = Object.values(data);
        const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
        const query = `INSERT INTO organisasi (${keys.join(', ')}) VALUES (${placeholders}) RETURNING *`;
        const result = await pool.query(query, values);
        return result.rows[0];
    },

    update: async (no_inventarisasi, data) => {
        let query = 'UPDATE organisasi SET ';
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

        query += fields.join(', ') + ' WHERE no_inventarisasi = $' + index + ' RETURNING *';
        values.push(no_inventarisasi);

        const result = await pool.query(query, values);
        return result.rows[0];
    },

    delete: async (no_inventarisasi) => {
        await pool.query('DELETE FROM organisasi WHERE no_inventarisasi = $1', [no_inventarisasi]);
        return { message: 'Organisasi berhasil dihapus' };
    }
};

module.exports = Organisasi;
