import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { dataScraper } from '@/lib/data-scraper'

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

    console.log('🔄 Starting data update process...')
    
    // Update the database with scraped data
    await dataScraper.updateDatabase()
    
    console.log('✅ Data update process completed')

    return NextResponse.json({ 
      success: true, 
      message: 'Database updated successfully',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ Data update error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to update database',
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

    // Return status information
    return NextResponse.json({
      status: 'Data update endpoint is active',
      lastUpdate: new Date().toISOString(),
      endpoints: {
        update: 'POST /api/admin/update-data',
        status: 'GET /api/admin/update-data'
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
