require('dotenv').config()
console.log('DATABASE_URL loaded:', process.env.DATABASE_URL ? 'Yes' : 'No')
console.log('First 20 chars of URL:', process.env.DATABASE_URL?.substring(0, 20) + '...')
