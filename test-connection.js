const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function test() {
  try {
    console.log('Testing database connection...')
    
    // Test 1: Raw query
    const result = await prisma.$queryRaw`SELECT version() as version`
    console.log('✅ Database version:', result[0].version)
    
    // Test 2: Count tables
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `
    console.log('📋 Available tables:', tables.map(t => t.table_name))
    
    // Test 3: Check if tables are empty
    const userCount = await prisma.user.count()
    console.log(`👥 User count: ${userCount}`)
    
    const planCount = await prisma.plan.count()
    console.log(`📋 Plan count: ${planCount}`)
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

test()
