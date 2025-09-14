import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Extract query parameters
    const q = searchParams.get('q') || ''
    const category = searchParams.get('category')
    const priceMin = searchParams.get('price_min')
    const priceMax = searchParams.get('price_max')
    const protocol = searchParams.get('protocol')
    const works = searchParams.get('works') // ecosystem compatibility
    const room = searchParams.get('room')
    const beginner = searchParams.get('beginner')
    const sort = searchParams.get('sort') || 'created_at'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    
    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {
      published: true,
    }

    // Text search
    if (q) {
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { shortDesc: { contains: q, mode: 'insensitive' } },
        { longDesc: { contains: q, mode: 'insensitive' } },
        { brand: { contains: q, mode: 'insensitive' } },
      ]
    }

    // Category filter
    if (category) {
      where.categoryId = category
    }

    // Price range filter
    if (priceMin || priceMax) {
      where.AND = where.AND || []
      if (priceMin) {
        where.AND.push({ priceCad: { gte: parseInt(priceMin) * 100 } })
      }
      if (priceMax) {
        where.AND.push({ priceCad: { lte: parseInt(priceMax) * 100 } })
      }
    }

    // Protocol filter
    if (protocol) {
      where.protocol = protocol
    }

    // Ecosystem compatibility filter
    if (works) {
      const ecosystem = works.toLowerCase()
      if (ecosystem === 'google') {
        where.worksGoogle = true
      } else if (ecosystem === 'alexa') {
        where.worksAlexa = true
      } else if (ecosystem === 'ha') {
        where.worksHa = true
      } else if (ecosystem === 'matter') {
        where.worksMatter = true
      } else if (ecosystem === 'zigbee') {
        where.worksZigbee = true
      } else if (ecosystem === 'zwave') {
        where.worksZwave = true
      } else if (ecosystem === 'thread') {
        where.worksThread = true
      }
    }

    // Room filter
    if (room) {
      where.roomTags = {
        has: room
      }
    }

    // Beginner friendly filter
    if (beginner === 'true') {
      where.beginnerFriendly = true
    }

    // Build orderBy clause
    let orderBy: any = { createdAt: 'desc' }
    if (sort === 'price_asc') {
      orderBy = { priceCad: 'asc' }
    } else if (sort === 'price_desc') {
      orderBy = { priceCad: 'desc' }
    } else if (sort === 'name_asc') {
      orderBy = { title: 'asc' }
    } else if (sort === 'name_desc') {
      orderBy = { title: 'desc' }
    }

    // Execute query
    const [products, total] = await Promise.all([
      db.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          category: true,
        },
      }),
      db.product.count({ where }),
    ])

    // Format response
    const formattedProducts = products.map(product => ({
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
    }))

    return NextResponse.json({
      products: formattedProducts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Catalog API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}
