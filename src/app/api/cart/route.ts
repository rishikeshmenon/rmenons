import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const cart = await db.cart.findFirst({
      where: { userId: session.user.id },
      include: {
        cartItems: {
          include: {
            product: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    })

    if (!cart) {
      // Create new cart if none exists
      const newCart = await db.cart.create({
        data: {
          userId: session.user.id,
          currency: 'CAD',
        },
        include: {
          cartItems: {
            include: {
              product: {
                include: {
                  category: true,
                },
              },
            },
          },
        },
      })
      return NextResponse.json({ cart: newCart })
    }

    return NextResponse.json({ cart })
  } catch (error) {
    console.error('Cart GET API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const { currency = 'CAD' } = await request.json()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if cart already exists
    const existingCart = await db.cart.findFirst({
      where: { userId: session.user.id },
    })

    if (existingCart) {
      return NextResponse.json({ cart: existingCart })
    }

    // Create new cart
    const cart = await db.cart.create({
      data: {
        userId: session.user.id,
        currency,
      },
    })

    return NextResponse.json({ cart })
  } catch (error) {
    console.error('Cart POST API error:', error)
    return NextResponse.json(
      { error: 'Failed to create cart' },
      { status: 500 }
    )
  }
}
