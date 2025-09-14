// Database population endpoint for Vercel
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    // Check if data already exists
    const existingProducts = await prisma.product.count()
    
    if (existingProducts > 0) {
      return res.status(200).json({ 
        message: 'Database already populated',
        products: existingProducts
      })
    }

    // Import and run the population script
    const { populateDatabase } = await import('../scripts/populate-sqlite.js')
    
    await populateDatabase()
    
    // Get final counts
    const categoryCount = await prisma.category.count()
    const productCount = await prisma.product.count()
    const kitCount = await prisma.kit.count()
    
    await prisma.$disconnect()
    
    res.status(200).json({ 
      message: 'Database populated successfully',
      stats: {
        categories: categoryCount,
        products: productCount,
        kits: kitCount
      }
    })
  } catch (error) {
    console.error('Database population error:', error)
    res.status(500).json({ 
      error: 'Database population failed',
      details: error.message 
    })
  }
}
