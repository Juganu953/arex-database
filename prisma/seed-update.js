const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Updating seed data...')
  
  // Check if plan already exists
  let plan = await prisma.plan.findUnique({
    where: { name: "Gold Tier" }
  })
  
  if (!plan) {
    plan = await prisma.plan.create({
      data: {
        name: "Gold Tier",
        price: 99.99,
        leadsLimit: 1000,
        description: "Basic business plan",
        features: ["1000 leads/month", "Basic analytics", "Email support"]
      }
    })
    console.log(`✅ Created plan: ${plan.name}`)
  } else {
    console.log(`📋 Plan already exists: ${plan.name}`)
  }
  
  // Check if user already exists
  let user = await prisma.user.findUnique({
    where: { email: "test@example.com" }
  })
  
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: "test@example.com",
        password: "$2b$10$YourHashedPasswordHere", // Use bcrypt in production
        name: "Test User",
        role: "BUSINESS",
        isTrial: true,
        trialLeadsTotal: 100,
        trialLeadsUsed: 0,
        planId: plan.id
      }
    })
    console.log(`✅ Created user: ${user.email}`)
  } else {
    console.log(`📋 User already exists: ${user.email}`)
  }
  
  // Add more sample data
  await prisma.plan.upsert({
    where: { name: "Platinum Tier" },
    update: {},
    create: {
      name: "Platinum Tier",
      price: 199.99,
      leadsLimit: 5000,
      description: "Advanced business plan",
      features: ["5000 leads/month", "Advanced analytics", "Priority support", "API access"]
    }
  })
  
  console.log('🎉 Seed update completed!')
}

main()
  .catch(e => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
