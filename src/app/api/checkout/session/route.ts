import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { stripe } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const { currency = 'CAD' } = await request.json()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get cart with items
    const cart = await db.cart.findFirst({
      where: { userId: session.user.id },
      include: {
        cartItems: {
          include: {
            product: true,
          },
        },
      },
    })

    if (!cart || cart.cartItems.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      )
    }

    // Validate cart items and check stock
    for (const item of cart.cartItems) {
      if (item.product.stock < item.qty) {
        return NextResponse.json(
          { error: `Insufficient stock for ${item.product.title}` },
          { status: 400 }
        )
      }
    }

    // Calculate total
    const total = cart.cartItems.reduce(
      (sum, item) => sum + (item.unitPrice * item.qty),
      0
    )

    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: cart.cartItems.map(item => ({
        price_data: {
          currency: currency.toLowerCase(),
          product_data: {
            name: item.product.title,
            description: item.product.shortDesc,
            images: item.product.images.slice(0, 1), // Stripe allows max 1 image
          },
          unit_amount: item.unitPrice,
        },
        quantity: item.qty,
      })),
      mode: 'payment',
      success_url: `${process.env.NEXTAUTH_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/checkout/cancel`,
      metadata: {
        cartId: cart.id,
        userId: session.user.id,
      },
    })

    return NextResponse.json({ 
      checkoutUrl: checkoutSession.url,
      sessionId: checkoutSession.id 
    })
  } catch (error) {
    console.error('Checkout session API error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
