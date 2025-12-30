const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting comprehensive seed...')
  
  // Clear existing data (optional - for development)
  console.log('Clearing existing data...')
  await prisma.transaction.deleteMany()
  await prisma.lead.deleteMany()
  await prisma.businessProfile.deleteMany()
  await prisma.agentProfile.deleteMany()
  await prisma.account.deleteMany()
  await prisma.session.deleteMany()
  await prisma.user.deleteMany()
  await prisma.plan.deleteMany()
  
  console.log('Creating plans...')
  // Create plans
  const plans = [
    {
      name: "Gold Tier",
      price: 99.99,
      leadsLimit: 1000,
      description: "Basic business plan",
      features: ["1000 leads/month", "Basic analytics", "Email support"]
    },
    {
      name: "Platinum Tier",
      price: 199.99,
      leadsLimit: 5000,
      description: "Advanced business plan",
      features: ["5000 leads/month", "Advanced analytics", "Priority support", "API access"]
    },
    {
      name: "Diamond Tier",
      price: 499.99,
      leadsLimit: null, // Unlimited
      description: "Enterprise plan",
      features: ["Unlimited leads", "Enterprise analytics", "24/7 support", "Custom API", "Dedicated account manager"]
    }
  ]
  
  for (const planData of plans) {
    await prisma.plan.upsert({
      where: { name: planData.name },
      update: {},
      create: planData
    })
    console.log('✅ Plan: ' + planData.name)
  }
  
  console.log('Creating users...')
  // Create users
  const users = [
    {
      email: "business@example.com",
      name: "Business Owner",
      password: "$2b$10$hashedpassword1", // Hash properly in production!
      role: "BUSINESS",
      planName: "Platinum Tier"
    },
    {
      email: "agent@example.com",
      name: "Sales Agent",
      password: "$2b$10$hashedpassword2",
      role: "AGENT"
    },
    {
      email: "admin@example.com",
      name: "System Admin",
      password: "$2b$10$hashedpassword3",
      role: "ADMIN"
    }
  ]
  
  for (const userData of users) {
    const plan = userData.planName ? await prisma.plan.findUnique({
      where: { name: userData.planName }
    }) : null
    
    const user = await prisma.user.create({
      data: {
        email: userData.email,
        name: userData.name,
        password: userData.password,
        role: userData.role,
        isTrial: !plan,
        trialLeadsTotal: 100,
        trialLeadsUsed: 0,
        planId: plan ? plan.id : null,
        planStartDate: plan ? new Date() : null,
        planExpiryDate: plan ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : null
      }
    })
    
    console.log('✅ User: ' + user.email + ' (' + user.role + ')')
    
    // Create business profile for BUSINESS users
    if (user.role === "BUSINESS") {
      await prisma.businessProfile.create({
        data: {
          userId: user.id,
          businessName: user.name + "'s Business",
          industry: "Technology",
          size: "MEDIUM",
          location: "Nairobi, Kenya"
        }
      })
      console.log('  Business profile created')
    }
    
    // Create agent profile for AGENT users
    if (user.role === "AGENT") {
      await prisma.agentProfile.create({
        data: {
          userId: user.id,
          agentId: 'AGT-' + Date.now(),
          tier: "SILVER",
          mpesaNumber: "+254700000000"
        }
      })
      console.log('  Agent profile created')
    }
  }
  
  console.log('🎉 Comprehensive seed completed!')
  console.log('Run "npm run db:summary" to verify data')
}

main()
  .catch(e => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
