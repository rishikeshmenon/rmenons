// Database deployment endpoint for Vercel
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    // Test database connection
    await prisma.$connect()
    
    // Test basic queries
    const categoryCount = await prisma.category.count()
    const productCount = await prisma.product.count()
    
    await prisma.$disconnect()
    
    res.status(200).json({ 
      message: 'Database schema deployed successfully',
      stats: {
        categories: categoryCount,
        products: productCount
      }
    })
  } catch (error) {
    console.error('Database deployment error:', error)
    res.status(500).json({ 
      error: 'Database deployment failed',
      details: error.message 
    })
  }
}
