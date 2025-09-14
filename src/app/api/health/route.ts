import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    // Check database connection
    await db.$queryRaw`SELECT 1`
    
    // Get basic stats
    const [productCount, categoryCount, orderCount] = await Promise.all([
      db.product.count({ where: { published: true } }),
      db.category.count(),
      db.order.count()
    ])

    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      stats: {
        products: productCount,
        categories: categoryCount,
        orders: orderCount
      },
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0'
    }

    return NextResponse.json(health)
  } catch (error) {
    console.error('Health check failed:', error)
    
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        database: 'disconnected',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 503 }
    )
  }
}
