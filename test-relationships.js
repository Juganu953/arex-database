const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testRelationships() {
  try {
    console.log('🔗 Testing Database Relationships...')
    
    // Get user with all related data
    const userWithRelations = await prisma.user.findFirst({
      include: {
        currentPlan: true,
        businessProfile: true,
        leads: true,
        transactions: true
      }
    })
    
    console.log('\n📋 User Details:')
    console.log('- User:', userWithRelations?.name || 'No user found')
    console.log('- Email:', userWithRelations?.email || 'N/A')
    console.log('- Role:', userWithRelations?.role || 'N/A')
    console.log('- Plan:', userWithRelations?.currentPlan?.name || 'No plan')
    if (userWithRelations?.currentPlan?.price) {
      console.log('- Plan Price: $' + userWithRelations.currentPlan.price)
    }
    console.log('- Leads Count:', userWithRelations?.leads?.length || 0)
    console.log('- Transactions Count:', userWithRelations?.transactions?.length || 0)
    
    // Show all users
    const allUsers = await prisma.user.findMany({
      include: { 
        currentPlan: true,
        businessProfile: true 
      }
    })
    
    console.log('\n📊 All Users in Database:')
    if (allUsers.length === 0) {
      console.log('No users found')
    } else {
      allUsers.forEach((user, index) => {
        console.log('\nUser #' + (index + 1) + ':')
        console.log('  Name:', user.name || 'N/A')
        console.log('  Email:', user.email)
        console.log('  Role:', user.role)
        console.log('  Trial:', user.isTrial ? 'Yes' : 'No')
        console.log('  Plan:', user.currentPlan?.name || 'None')
        if (user.businessProfile) {
          console.log('  Business:', user.businessProfile.businessName)
          console.log('  Industry:', user.businessProfile.industry)
        }
      })
    }
    
    // Show all plans
    const allPlans = await prisma.plan.findMany()
    console.log('\n💎 All Available Plans:')
    allPlans.forEach(plan => {
      console.log('- ' + plan.name + ': $' + plan.price + ' (' + (plan.leadsLimit || 'Unlimited') + ' leads)')
      console.log('  Features:', plan.features.join(', '))
    })
    
    // Show table counts
    console.log('\n📊 Database Statistics:')
    const userCount = await prisma.user.count()
    const planCount = await prisma.plan.count()
    const leadCount = await prisma.lead.count()
    const transactionCount = await prisma.transaction.count()
    
    console.log('- Users:', userCount)
    console.log('- Plans:', planCount)
    console.log('- Leads:', leadCount)
    console.log('- Transactions:', transactionCount)
    
    // Check if we need to create a business profile for the test user
    if (userCount > 0 && planCount > 0) {
      const firstUser = await prisma.user.findFirst()
      const hasBusinessProfile = await prisma.businessProfile.findFirst({
        where: { userId: firstUser.id }
      })
      
      if (!hasBusinessProfile) {
        console.log('\n⚠️  Test user has no business profile. Creating one...')
        await prisma.businessProfile.create({
          data: {
            userId: firstUser.id,
            businessName: 'Test Business',
            industry: 'Technology',
            size: 'SMALL',
            location: 'Nairobi, Kenya'
          }
        })
        console.log('✅ Business profile created for test user')
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await prisma.$disconnect()
    console.log('\n✅ Test completed. Database connection closed.')
  }
}

// Run the test
testRelationships()
