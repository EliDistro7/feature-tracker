// seed.js — Run with: node seed.js
// Seeds the features table with sample data.
// Works both locally (XAMPP) and in production (Aiven).

const mysql = require('mysql2/promise');
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';

const SEED_DATA = [
  {
    title: 'User Authentication',
    description: 'Implement login, registration, and JWT-based auth system with refresh tokens.',
    priority: 'High',
    status: 'Completed',
  },
  {
    title: 'Dashboard Analytics',
    description: 'Add charts and KPIs to the main dashboard for better insights into feature progress.',
    priority: 'High',
    status: 'In Progress',
  },
  {
    title: 'Export to CSV',
    description: 'Allow users to export feature request lists to CSV files for offline reporting.',
    priority: 'Medium',
    status: 'Open',
  },
  {
    title: 'Dark Mode Support',
    description: 'Provide a dark theme toggle across the entire application for better accessibility.',
    priority: 'Medium',
    status: 'Open',
  },
  {
    title: 'Email Notifications',
    description: 'Send email alerts when a feature request status changes or is assigned.',
    priority: 'Low',
    status: 'Open',
  },
  {
    title: 'Advanced Search & Filter',
    description: 'Global search bar and advanced filter panel for the feature list with multi-select.',
    priority: 'High',
    status: 'In Progress',
  },
  {
    title: 'Role-Based Access Control',
    description: 'Define Admin, Manager, and Viewer roles with different permissions per resource.',
    priority: 'High',
    status: 'Open',
  },
  {
    title: 'Audit Log',
    description: 'Track all create, update, and delete actions for compliance and debugging.',
    priority: 'Low',
    status: 'Open',
  },
  {
    title: 'Mobile Responsive UI',
    description: 'Ensure all screens are fully responsive and usable on mobile devices.',
    priority: 'Medium',
    status: 'Completed',
  },
  {
    title: 'API Rate Limiting',
    description: 'Add rate limiting middleware to prevent abuse and protect the backend API.',
    priority: 'Medium',
    status: 'Open',
  },
];

async function seed() {
  let connection;

  try {
    console.log('🌱 Connecting to database…');

    connection = await mysql.createConnection({
      host:     process.env.DB_HOST     || 'localhost',
      port:     parseInt(process.env.DB_PORT) || 3306,
      user:     process.env.DB_USER     || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME     || 'feature_tracker',
      ...(isProduction && { ssl: { rejectUnauthorized: false } }),
    });

    console.log(`✅ Connected (${isProduction ? 'production/Aiven' : 'local/XAMPP'})\n`);

    // Check if table exists — create it if not
    console.log('📋 Ensuring features table exists…');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS features (
        id          INT             NOT NULL AUTO_INCREMENT,
        title       VARCHAR(255)    NOT NULL,
        description TEXT            NOT NULL,
        priority    ENUM('Low', 'Medium', 'High')               NOT NULL DEFAULT 'Medium',
        status      ENUM('Open', 'In Progress', 'Completed')    NOT NULL DEFAULT 'Open',
        created_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Table ready\n');

    // Check existing rows
    const [existing] = await connection.execute('SELECT COUNT(*) as count FROM features');
    const count = existing[0].count;

    if (count > 0) {
      console.log(`⚠️  Table already has ${count} row(s).`);
      console.log('   Options:');
      console.log('   • node seed.js --fresh   → clears existing data then seeds');
      console.log('   • node seed.js --append  → adds seed data on top of existing\n');

      const flag = process.argv[2];
      if (!flag) {
        console.log('No flag provided — exiting without changes.');
        return;
      }

      if (flag === '--fresh') {
        await connection.execute('DELETE FROM features');
        await connection.execute('ALTER TABLE features AUTO_INCREMENT = 1');
        console.log('🗑️  Cleared existing data\n');
      } else if (flag === '--append') {
        console.log('➕ Appending seed data to existing rows\n');
      } else {
        console.log(`Unknown flag "${flag}" — use --fresh or --append`);
        return;
      }
    }

    // Insert seed data
    console.log('🌱 Inserting seed data…\n');

    const insertSQL = `
      INSERT INTO features (title, description, priority, status)
      VALUES (?, ?, ?, ?)
    `;

    for (const item of SEED_DATA) {
      await connection.execute(insertSQL, [
        item.title,
        item.description,
        item.priority,
        item.status,
      ]);
      console.log(`  ✓ ${item.title}`);
    }

    // Summary
    const [final] = await connection.execute('SELECT COUNT(*) as count FROM features');
    console.log(`\n✅ Done — ${SEED_DATA.length} features inserted`);
    console.log(`📊 Total rows in table: ${final[0].count}`);

  } catch (err) {
    console.error('\n❌ Seeder failed:', err.message);
    process.exit(1);
  } finally {
    if (connection) await connection.end();
    process.exit(0);
  }
}

seed();
