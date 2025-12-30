const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function testConnection() {
  console.log('🔧 Loading PRODUCTION configuration...');
  console.log(`   Host: ${process.env.PG_HOST}`);
  console.log(`   Port: ${process.env.PG_PORT}`);
  console.log(`   Database: ${process.env.PG_DATABASE}`);
  console.log(`   User: ${process.env.PG_USER}`);
  console.log(`   Node Env: ${process.env.NODE_ENV}`);

  // Production SSL configuration
  const isProduction = process.env.NODE_ENV === 'production';
  const certPath = path.join(process.cwd(), 'config', 'ca.pem');
  
  console.log(`   Certificate path: ${certPath}`);
  console.log(`   Certificate exists: ${fs.existsSync(certPath)}`);
  console.log(`   SSL Strict: ${isProduction}`);
  
  const client = new Client({
    host: process.env.PG_HOST,
    port: parseInt(process.env.PG_PORT),
    database: process.env.PG_DATABASE,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    ssl: isProduction ? {
      rejectUnauthorized: true,  // STRICT in production
      ca: fs.readFileSync(certPath).toString()
    } : {
      rejectUnauthorized: false  // Relaxed in development
    },
    connectionTimeoutMillis: 10000,  // 10 second timeout
    query_timeout: 30000,  // 30 second query timeout
  });

  try {
    console.log('\n🔗 Attempting PRODUCTION connection...');
    await client.connect();
    console.log('✅ PRODUCTION Connected successfully!');
    
    // Verify SSL is actually being used
    const sslResult = await client.query('SELECT ssl_is_used()');
    console.log(`   SSL in use: ${sslResult.rows[0].ssl_is_used}`);
    
    // Get version
    const version = await client.query('SELECT version()');
    console.log(`   PostgreSQL: ${version.rows[0].version}`);
    
    // Get current user and database
    const current = await client.query('SELECT current_user, current_database()');
    console.log(`   User: ${current.rows[0].current_user}`);
    console.log(`   Database: ${current.rows[0].current_database}`);
    
    // Test write operation
    await client.query(`
      CREATE TABLE IF NOT EXISTS production_test (
        id SERIAL PRIMARY KEY,
        test_value TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);
    console.log('✅ Production test table verified');
    
    await client.query(
      'INSERT INTO production_test (test_value) VALUES ($1) RETURNING id',
      ['Production connection test at ' + new Date().toISOString()]
    );
    console.log('✅ Write operation successful');
    
    await client.end();
    console.log('👋 PRODUCTION Connection verified and closed');
  } catch (error) {
    console.error('❌ PRODUCTION Connection failed:', error.message);
    console.log('\n🔧 If SSL fails in production, temporarily use:');
    console.log('   ssl: { rejectUnauthorized: false }');
    console.log('   Then get the correct certificate from Aiven Console tomorrow.');
  }
}

testConnection();
