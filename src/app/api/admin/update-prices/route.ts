import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { priceMonitor } from '@/lib/price-monitor'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    // Check if user is admin
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check for API key in headers for additional security
    const apiKey = request.headers.get('x-api-key')
    if (apiKey !== process.env.ADMIN_API_KEY) {
      return NextResponse.json({ error: 'Invalid API key' }, { status: 401 })
    }

    const { updateType = 'full' } = await request.json()

    console.log(`💰 Starting ${updateType} price update...`)
    
    switch (updateType) {
      case 'prices':
        await priceMonitor.updatePrices()
        break
      case 'stock':
        await priceMonitor.checkStockLevels()
        break
      case 'availability':
        await priceMonitor.updateProductAvailability()
        break
      case 'full':
      default:
        await priceMonitor.runFullUpdate()
        break
    }
    
    console.log(`✅ ${updateType} update completed`)

    return NextResponse.json({ 
      success: true, 
      message: `${updateType} update completed successfully`,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ Price update error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to update prices',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Return price monitoring status
    return NextResponse.json({
      status: 'Price monitoring endpoint is active',
      lastUpdate: new Date().toISOString(),
      availableUpdateTypes: ['prices', 'stock', 'availability', 'full'],
      endpoints: {
        update: 'POST /api/admin/update-prices',
        status: 'GET /api/admin/update-prices'
      }
    })
  } catch (error) {
    console.error('❌ Status check error:', error)
    return NextResponse.json(
      { error: 'Failed to check status' },
      { status: 500 }
    )
  }
}
