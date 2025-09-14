import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const { productId, qty } = await request.json()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!productId || !qty || qty <= 0) {
      return NextResponse.json(
        { error: 'Invalid product ID or quantity' },
        { status: 400 }
      )
    }

    // Get or create cart
    let cart = await db.cart.findFirst({
      where: { userId: session.user.id },
    })

    if (!cart) {
      cart = await db.cart.create({
        data: {
          userId: session.user.id,
          currency: 'CAD',
        },
      })
    }

    // Get product details
    const product = await db.product.findUnique({
      where: { id: productId },
    })

    if (!product || !product.published) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    if (product.stock < qty) {
      return NextResponse.json(
        { error: 'Insufficient stock' },
        { status: 400 }
      )
    }

    // Check if item already exists in cart
    const existingItem = await db.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: productId,
      },
    })

    if (existingItem) {
      // Update quantity
      const updatedItem = await db.cartItem.update({
        where: { id: existingItem.id },
        data: { qty: existingItem.qty + qty },
        include: {
          product: {
            include: {
              category: true,
            },
          },
        },
      })

      return NextResponse.json({ cartItem: updatedItem })
    } else {
      // Add new item
      const cartItem = await db.cartItem.create({
        data: {
          cartId: cart.id,
          productId: productId,
          qty,
          unitPrice: product.priceCad,
        },
        include: {
          product: {
            include: {
              category: true,
            },
          },
        },
      })

      return NextResponse.json({ cartItem })
    }
  } catch (error) {
    console.error('Add to cart API error:', error)
    return NextResponse.json(
      { error: 'Failed to add item to cart' },
      { status: 500 }
    )
  }
}
