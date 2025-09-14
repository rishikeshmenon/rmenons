import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const { bookingId, bom, laborHoursEst, notes } = await request.json()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify booking exists and belongs to user
    const booking = await db.booking.findFirst({
      where: {
        id: bookingId,
        userId: session.user.id,
      },
    })

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    // Calculate price range based on BOM
    const totalCost = bom.reduce((sum: number, item: any) => {
      return sum + (item.price * item.quantity)
    }, 0)

    const priceRange = {
      min: Math.round(totalCost * 0.9), // 10% discount
      max: Math.round(totalCost * 1.1), // 10% markup
      labor: laborHoursEst ? Math.round(laborHoursEst * 75) : 0, // $75/hour
    }

    // Create proposal
    const proposal = await db.proposal.create({
      data: {
        userId: session.user.id,
        bookingId,
        bom,
        laborHoursEst,
        priceRange,
        status: 'DRAFT',
      },
    })

    return NextResponse.json({ proposal })
  } catch (error) {
    console.error('Create proposal API error:', error)
    return NextResponse.json(
      { error: 'Failed to create proposal' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const proposals = await db.proposal.findMany({
      where: { userId: session.user.id },
      include: {
        booking: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ proposals })
  } catch (error) {
    console.error('Get proposals API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch proposals' },
      { status: 500 }
    )
  }
}
