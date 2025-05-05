const pool = require('../config/pgConfig');

const PesertaDidik = {
    getAll: async () => {
        const result = await pool.query('SELECT * FROM peserta_didik');
        return result.rows;
    },

    getByNISN: async (nisn) => {
        const result = await pool.query('SELECT * FROM peserta_didik WHERE nisn = $1', [nisn]);
        return result.rows[0];
    },

    create: async (data) => {
        const keys = Object.keys(data);
        const values = Object.values(data);
        const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
        const query = `INSERT INTO peserta_didik (${keys.join(', ')}) VALUES (${placeholders}) RETURNING *`;
        const result = await pool.query(query, values);
        return result.rows[0];
    },

    update: async (nisn, data) => {
        let query = 'UPDATE peserta_didik SET ';
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

        query += fields.join(', ') + ' WHERE nisn = $' + index + ' RETURNING *';
        values.push(nisn);

        const result = await pool.query(query, values);
        return result.rows[0];
    },

    delete: async (nisn) => {
        await pool.query('DELETE FROM peserta_didik WHERE nisn = $1', [nisn]);
        return { message: 'Peserta didik berhasil dihapus' };
    }
};

module.exports = PesertaDidik;
