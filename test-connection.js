const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function testConnection() {
  // Verify the certificate path
  const certPath = path.join(process.cwd(), 'config', 'ca.pem');
  console.log(`📄 Certificate path: ${certPath}`);
  
  if (!fs.existsSync(certPath)) {
    console.error('❌ Certificate file not found at:', certPath);
    console.log('Please ensure ca.pem is in the config/ directory');
    return;
  }

  const client = new Client({
    host: process.env.PG_HOST,
    port: parseInt(process.env.PG_PORT),
    database: process.env.PG_DATABASE,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    ssl: {
      rejectUnauthorized: true,
      ca: fs.readFileSync(certPath).toString()
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
    console.log('\n🔧 Troubleshooting tips:');
    console.log('1. Check if the certificate is valid:');
    console.log('   openssl x509 -in config/ca.pem -text -noout');
    console.log('2. Try with rejectUnauthorized: false for testing');
    console.log('3. Verify your .env file has correct credentials');
  }
}

testConnection();
