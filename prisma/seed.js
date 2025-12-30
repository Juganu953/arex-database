const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')
  
  // Create a sample plan
  const plan = await prisma.plan.create({
    data: {
      name: "Gold Tier",
      price: 99.99,
      leadsLimit: 1000,
      description: "Basic business plan",
      features: ["1000 leads/month", "Basic analytics", "Email support"]
    }
  })
  
  console.log(`✅ Created plan: ${plan.name}`)
  
  // Create a sample user
  const user = await prisma.user.create({
    data: {
      email: "test@example.com",
      password: "hashed_password_here", // In production, use bcrypt to hash
      name: "Test User",
      role: "BUSINESS",
      isTrial: true,
      trialLeadsTotal: 100,
      trialLeadsUsed: 0,
      planId: plan.id
    }
  })
  
  console.log(`✅ Created user: ${user.email}`)
  
  // Create a business profile for the user
  const businessProfile = await prisma.businessProfile.create({
    data: {
      userId: user.id,
      businessName: "Test Business",
      industry: "Technology",
      size: "SMALL",
      location: "Nairobi, Kenya"
    }
  })
  
  console.log(`✅ Created business profile: ${businessProfile.businessName}`)
  
  // Create a sample lead
  const lead = await prisma.lead.create({
    data: {
      userId: user.id,
      source: "trial",
      status: "NEW",
      value: 150.50,
      metadata: { source: "website", campaign: "test" }
    }
  })
  
  console.log(`✅ Created lead with value: $${lead.value}`)
  
  console.log('🎉 Seed completed successfully!')
}

main()
  .catch(e => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
