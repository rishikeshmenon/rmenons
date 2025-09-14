import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { db } from '@/lib/db'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        
        // Get cart and create order
        const cart = await db.cart.findUnique({
          where: { id: session.metadata?.cartId },
          include: {
            cartItems: {
              include: {
                product: true,
              },
            },
          },
        })

        if (!cart) {
          console.error('Cart not found for session:', session.id)
          break
        }

        // Create order
        const order = await db.order.create({
          data: {
            userId: session.metadata?.userId!,
            totalCents: session.amount_total!,
            currency: session.currency!.toUpperCase(),
            status: 'PROCESSING',
            stripePi: session.payment_intent as string,
            shippingAddr: session.shipping_details || {},
            billingAddr: session.customer_details || {},
          },
        })

        // Create order items
        await Promise.all(
          cart.cartItems.map(item =>
            db.orderItem.create({
              data: {
                orderId: order.id,
                productId: item.productId,
                qty: item.qty,
                unitPrice: item.unitPrice,
              },
            })
          )
        )

        // Update product stock
        await Promise.all(
          cart.cartItems.map(item =>
            db.product.update({
              where: { id: item.productId },
              data: {
                stock: {
                  decrement: item.qty,
                },
              },
            })
          )
        )

        // Clear cart
        await db.cartItem.deleteMany({
          where: { cartId: cart.id },
        })

        console.log('Order created:', order.id)
        break
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        
        // Update order status
        await db.order.updateMany({
          where: { stripePi: paymentIntent.id },
          data: { status: 'PROCESSING' },
        })

        console.log('Payment succeeded for:', paymentIntent.id)
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        
        // Update order status
        await db.order.updateMany({
          where: { stripePi: paymentIntent.id },
          data: { status: 'CANCELLED' },
        })

        console.log('Payment failed for:', paymentIntent.id)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
