const tls = require('tls');
const fs = require('fs');
const path = require('path');

async function diagnoseSSL() {
  const certPath = path.join(process.cwd(), 'config', 'ca.pem');
  console.log('🔍 SSL Diagnosis');
  console.log('================');
  
  // Check file
  console.log(`1. Certificate file: ${certPath}`);
  if (fs.existsSync(certPath)) {
    const stats = fs.statSync(certPath);
    console.log(`   ✅ Exists, size: ${stats.size} bytes`);
    
    const certContent = fs.readFileSync(certPath, 'utf8');
    console.log(`   ✅ Content starts with: ${certContent.substring(0, 50)}...`);
    
    // Test certificate
    const socket = tls.connect({
      host: process.env.PG_HOST,
      port: parseInt(process.env.PG_PORT),
      ca: fs.readFileSync(certPath),
      servername: process.env.PG_HOST,
      rejectUnauthorized: false // For testing only
    });
    
    socket.on('secureConnect', () => {
      console.log('\n2. SSL Handshake:');
      console.log('   ✅ Connected via SSL/TLS');
      console.log('   Protocol:', socket.getProtocol());
      console.log('   Cipher:', socket.getCipher());
      console.log('   Authorized:', socket.authorized);
      
      if (!socket.authorized) {
        console.log('   ❌ Authorization error:', socket.authorizationError);
      }
      
      socket.end();
    });
    
    socket.on('error', (error) => {
      console.log('\n2. SSL Handshake:');
      console.log('   ❌ Error:', error.message);
    });
    
    socket.on('close', () => {
      console.log('\n3. Recommendations:');
      console.log('   If SSL handshake worked but authorization failed:');
      console.log('   - Your certificate might be outdated');
      console.log('   - Download a fresh one from Aiven Console');
      console.log('\n   If connection failed:');
      console.log('   - Check firewall/network access');
      console.log('   - Verify host/port in .env');
    });
    
  } else {
    console.log('   ❌ File not found!');
    console.log('\n   Please download from Aiven Console:');
    console.log('   1. Go to your PostgreSQL service');
    console.log('   2. Click "Connection information"');
    console.log('   3. Click "Download CA certificate"');
    console.log('   4. Save as config/ca.pem');
  }
}

diagnoseSSL();
