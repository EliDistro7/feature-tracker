const mysql = require('mysql2/promise');
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';

const pool = mysql.createPool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     parseInt(process.env.DB_PORT) || 3306,
  user:     process.env.DB_USER     || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME     || 'feature_tracker',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // SSL only in production (Aiven requires it, XAMPP doesn't support it)
  ...(isProduction && { ssl: { rejectUnauthorized: false } }),
});

pool.getConnection()
  .then(conn => {
    console.log(`✅ Database connected (${isProduction ? 'production' : 'local'})`);
    conn.release();
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err.message);
  });

module.exports = pool;