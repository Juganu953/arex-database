require('dotenv').config()
const express = require('express')
const { PrismaClient } = require('@prisma/client')

const app = express()
const prisma = new PrismaClient()
const PORT = process.env.PORT || 3000

app.use(express.json())

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'AREX Database API',
    version: '1.0.0',
    endpoints: [
      '/api/health',
      '/api/users',
      '/api/plans'
    ],
    status: 'operational'
  })
})

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    database: 'connected'
  })
})

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

app.get('/api/plans', async (req, res) => {
  try {
    const plans = await prisma.plan.findMany()
    res.json(plans)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

app.listen(PORT, () => {
  console.log('Server running on port ' + PORT)
})
