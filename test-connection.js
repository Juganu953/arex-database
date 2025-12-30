const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function testConnection() {
  console.log('🔧 Loading configuration...');
  console.log(`   Host: ${process.env.PG_HOST}`);
  console.log(`   Port: ${process.env.PG_PORT}`);
  console.log(`   Database: ${process.env.PG_DATABASE}`);
  console.log(`   User: ${process.env.PG_USER}`);

  const client = new Client({
    host: process.env.PG_HOST,
    port: parseInt(process.env.PG_PORT),
    database: process.env.PG_DATABASE,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    // CHANGE THIS ONE LINE:
    ssl: {
      rejectUnauthorized: false  // CHANGE true TO false
    }
  });

  try {
    console.log('\n🔗 Attempting to connect to Aiven PostgreSQL...');
    await client.connect();
    console.log('✅ Connected successfully!');
    
    // Test query
    const result = await client.query('SELECT version()');
    console.log('PostgreSQL Version:', result.rows[0].version);
    
    await client.end();
    console.log('👋 Connection closed');
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  }
}

testConnection();
