const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const isProduction = process.env.NODE_ENV === 'production';
const certPath = path.join(__dirname, 'ca.pem');

if (!fs.existsSync(certPath)) {
  console.error('❌ PRODUCTION ERROR: Missing CA certificate at', certPath);
  console.error('   Download from Aiven Console → Service → Connection information');
  process.exit(1);
}

const poolConfig = {
  host: process.env.PG_HOST,
  port: parseInt(process.env.PG_PORT),
  database: process.env.PG_DATABASE,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  ssl: {
    rejectUnauthorized: isProduction,
    ca: fs.readFileSync(certPath).toString()
  },
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
  connectionTimeoutMillis: 5000, // How long to wait for a connection
};

const pool = new Pool(poolConfig);

// Log connection events
pool.on('connect', () => {
  if (isProduction) {
    console.log('🔄 New database connection established');
  }
});

pool.on('error', (err) => {
  console.error('❌ Database pool error:', err.message);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  getClient: () => pool.connect(),
  pool,
};
