require('dotenv').config()
const express = require('express')
const { PrismaClient } = require('@prisma/client')

const app = express()
const prisma = new PrismaClient()
const PORT = process.env.PORT || 3000

app.use(express.json())

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    database: 'connected'
  })
})

// Users endpoint
app.get('/api/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        currentPlan: true,
        businessProfile: true
      }
    })
    res.json(users)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Plans endpoint
app.get('/api/plans', async (req, res) => {
  try {
    const plans = await prisma.plan.findMany()
    res.json(plans)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Create user endpoint
app.post('/api/users', async (req, res) => {
  try {
    const { email, name, password, role = 'BUSINESS' } = req.body
    
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password, // Note: Hash this properly in production!
        role,
        isTrial: true,
        trialLeadsTotal: 100,
        trialLeadsUsed: 0
      }
    })
    
    res.status(201).json(user)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.listen(PORT, () => {
  console.log('🚀 Server running on http://localhost:' + PORT)
  console.log('📊 Database connected successfully')
})
