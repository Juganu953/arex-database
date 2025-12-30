const { Client } = require('pg');
require('dotenv').config();

async function testConnection() {
  const client = new Client({
    host: process.env.PG_HOST,
    port: parseInt(process.env.PG_PORT),
    database: process.env.PG_DATABASE,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    ssl: true  // JUST THIS LINE - SIMPLE AND WORKS
  });

  try {
    console.log('\n🔗 Attempting to connect...');
    await client.connect();
    console.log('✅ Connected successfully!');
    const result = await client.query('SELECT version()');
    console.log('Version:', result.rows[0].version);
    await client.end();
    console.log('👋 Closed');
  } catch (error) {
    console.error('❌ Failed:', error.message);
  }
}

testConnection();
  
