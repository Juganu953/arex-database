require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function dbSummary() {
  console.log('🗃️  DATABASE SUMMARY')
  console.log('='.repeat(40))
  
  // Count all records
  const userCount = await prisma.user.count()
  const planCount = await prisma.plan.count()
  const leadCount = await prisma.lead.count()
  const transactionCount = await prisma.transaction.count()
  const businessProfileCount = await prisma.businessProfile.count()
  const agentProfileCount = await prisma.agentProfile.count()
  
  console.log('\n📈 Record Counts:')
  console.log('  Users:           ' + userCount)
  console.log('  Plans:           ' + planCount)
  console.log('  Leads:           ' + leadCount)
  console.log('  Transactions:    ' + transactionCount)
  console.log('  Business Profiles: ' + businessProfileCount)
  console.log('  Agent Profiles:   ' + agentProfileCount)
  
  if (userCount > 0) {
    console.log('\n👥 User Details:')
    const users = await prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' }
    })
    
    users.forEach((user, i) => {
      console.log('\n  User ' + (i + 1) + ':')
      console.log('    Email: ' + user.email)
      console.log('    Role: ' + user.role)
      console.log('    Trial: ' + (user.isTrial ? 'Yes' : 'No'))
      console.log('    Created: ' + user.createdAt.toISOString().split('T')[0])
    })
  }
  
  if (planCount > 0) {
    console.log('\n💎 Available Plans:')
    const plans = await prisma.plan.findMany()
    plans.forEach(plan => {
      console.log('  - ' + plan.name + ': $' + plan.price)
    })
  }
  
  console.log('\n✅ Database schema is fully deployed and operational')
  console.log('✅ Prisma Client is properly generated')
  console.log('✅ Connection to Vercel Postgres is working')
  console.log('\n📝 Next steps:')
  console.log('   1. Build your application API')
  console.log('   2. Add authentication (NextAuth.js recommended)')
  console.log('   3. Deploy to Vercel with environment variables set')
}

dbSummary()
  .catch(e => console.error('Error:', e.message))
  .finally(() => prisma.$disconnect())
