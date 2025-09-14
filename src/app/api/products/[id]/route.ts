import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await db.product.findUnique({
      where: { id: params.id },
      include: {
        category: true,
      },
    })

    if (!product || !product.published) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Get related products (same category, different products)
    const relatedProducts = await db.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id },
        published: true,
      },
      take: 4,
      include: {
        category: true,
      },
    })

    // Format response
    const formattedProduct = {
      id: product.id,
      sku: product.sku,
      title: product.title,
      brand: product.brand,
      category: product.category.name,
      shortDesc: product.shortDesc,
      longDesc: product.longDesc,
      priceCad: product.priceCad,
      priceUsd: product.priceUsd,
      stock: product.stock,
      images: product.images,
      protocol: product.protocol,
      power: product.power,
      roomTags: product.roomTags,
      beginnerFriendly: product.beginnerFriendly,
      compatibility: {
        google: product.worksGoogle,
        alexa: product.worksAlexa,
        ha: product.worksHa,
        matter: product.worksMatter,
        zigbee: product.worksZigbee,
        zwave: product.worksZwave,
        thread: product.worksThread,
      },
      requiresBridge: product.requiresBridge,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }

    const formattedRelated = relatedProducts.map(p => ({
      id: p.id,
      sku: p.sku,
      title: p.title,
      brand: p.brand,
      priceCad: p.priceCad,
      priceUsd: p.priceUsd,
      images: p.images,
      compatibility: {
        google: p.worksGoogle,
        alexa: p.worksAlexa,
        ha: p.worksHa,
        matter: p.worksMatter,
        zigbee: p.worksZigbee,
        zwave: p.worksZwave,
        thread: p.worksThread,
      },
    }))

    return NextResponse.json({
      product: formattedProduct,
      relatedProducts: formattedRelated,
    })
  } catch (error) {
    console.error('Product detail API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}
