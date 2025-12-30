const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function testConnection() {
  const client = new Client({
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    database: process.env.PG_DATABASE,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    ssl: {
      rejectUnauthorized: true,
      ca: fs.readFileSync(path.join(process.cwd(), 'config/ca.pem')).toString()
    }
  });

  try {
    console.log('🔗 Attempting to connect to Aiven PostgreSQL...');
    await client.connect();
    console.log('✅ Connected successfully!');
    
    // Test query
    const result = await client.query('SELECT version(), NOW() as server_time, current_user');
    console.log('📊 Database Info:', {
      version: result.rows[0].version.split(',')[0],
      serverTime: result.rows[0].server_time,
      currentUser: result.rows[0].current_user
    });
    
    // List all tables in public schema
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log(`📋 Tables in public schema: ${tablesResult.rows.length}`);
    tablesResult.rows.forEach(row => console.log(`   - ${row.table_name}`));
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  } finally {
    await client.end();
    console.log('👋 Connection closed');
  }
}

// Run the function
testConnection();
