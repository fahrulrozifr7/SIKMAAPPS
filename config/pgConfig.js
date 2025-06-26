const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.PG_USER || 'xxxx',
  host: process.env.PG_HOST || 'xxxxx',
  database: process.env.PG_DATABASE || 'xxxxx',
  password: process.env.PG_PASSWORD || 'xxxxxx',
  port: process.env.PG_PORT || 5432,
});

module.exports = pool;
