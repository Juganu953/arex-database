// Add this after your version check in test-connection.js:

// Test 1: List databases
const dbs = await client.query('SELECT datname FROM pg_database WHERE datistemplate = false');
console.log('\n📊 Available databases:');
dbs.rows.forEach(row => console.log('  -', row.datname));

// Test 2: Create a test table
await client.query(`
  CREATE TABLE IF NOT EXISTS test_table (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
  )
`);
console.log('✅ Test table created/verified');

// Test 3: Insert some data
await client.query("INSERT INTO test_table (name) VALUES ('Test User')");
console.log('✅ Data inserted');

// Test 4: Query the data
const results = await client.query('SELECT * FROM test_table ORDER BY id DESC LIMIT 5');
console.log('\n📝 Recent test records:');
results.rows.forEach(row => console.log(`  ID: ${row.id}, Name: ${row.name}, Created: ${row.created_at}`));
