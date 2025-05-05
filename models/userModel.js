const pool = require('../config/pgConfig');

const createUser = async (user) => {
  const { certificationId, name, email, phoneNumber, password } = user;
  const query = `
    INSERT INTO users (certificationid, name, email, phone_number, password)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;
  const values = [certificationId, name, email, phoneNumber, password];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const findUserByEmail = async (email) => {
  const query = 'SELECT * FROM users WHERE email = $1';
  const result = await pool.query(query, [email]);
  return result.rows[0];
};

const updateUser = async (email, updates) => {
  const { name, password } = updates;
  const query = `
    UPDATE users
    SET name = $1, password = $2
    WHERE email = $3
    RETURNING *;
  `;
  const values = [name, password, email];
  const result = await pool.query(query, values);
  return result.rows[0];
};

module.exports = {
  createUser,
  findUserByEmail,
  updateUser,
};