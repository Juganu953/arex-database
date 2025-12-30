const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function setupDatabase() {
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
    await client.connect();
    console.log('🔗 Connected to database');
    
    // Create a sample table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Created users table');
    
    // Insert sample data
    await client.query(`
      INSERT INTO users (name, email) 
      VALUES 
        ('John Doe', 'john@example.com'),
        ('Jane Smith', 'jane@example.com'),
        ('Bob Johnson', 'bob@example.com')
      ON CONFLICT (email) DO NOTHING
    `);
    console.log('✅ Inserted sample data');
    
    // Query the data
    const result = await client.query('SELECT * FROM users ORDER BY id');
    console.log('📋 Users in database:');
    result.rows.forEach(user => {
      console.log(`   - ${user.id}: ${user.name} (${user.email})`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
    console.log('👋 Connection closed');
  }
}

setupDatabase();
