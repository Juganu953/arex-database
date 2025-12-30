const { Client } = require('pg');
require('dotenv').config();

async function testConnection() {
  const client = new Client({
    host: process.env.PG_HOST,
    port: parseInt(process.env.PG_PORT),
    database: process.env.PG_DATABASE,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    // SIMPLE SOLUTION THAT WILL WORK:
    ssl: true
    // OR if you want to keep your certificate:
    // ssl: {
    //   rejectUnauthorized: false
    // }
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
