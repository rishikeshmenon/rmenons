import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔍 Verifying populated data...\n')

  // Get category count
  const categoryCount = await prisma.category.count()
  console.log(`📁 Categories: ${categoryCount}`)

  // Get product count
  const productCount = await prisma.product.count()
  console.log(`📦 Products: ${productCount}`)

  // Get published products
  const publishedProducts = await prisma.product.count({
    where: { published: true }
  })
  console.log(`✅ Published Products: ${publishedProducts}`)

  // Get products by brand
  const productsByBrand = await prisma.product.groupBy({
    by: ['brand'],
    _count: { brand: true }
  })

  console.log('\n🏷️ Products by Brand:')
  productsByBrand.forEach(brand => {
    console.log(`   ${brand.brand}: ${brand._count.brand} products`)
  })

  // Get products by category
  const productsByCategory = await prisma.product.groupBy({
    by: ['categoryId'],
    _count: { categoryId: true },
    _sum: { priceCad: true }
  })

  console.log('\n📂 Products by Category:')
  for (const category of productsByCategory) {
    const categoryName = await prisma.category.findUnique({
      where: { id: category.categoryId },
      select: { name: true }
    })
    const avgPrice = category._sum.priceCad ? (category._sum.priceCad / category._count.categoryId / 100).toFixed(2) : '0.00'
    console.log(`   ${categoryName?.name || 'Unknown'}: ${category._count.categoryId} products (avg: $${avgPrice} CAD)`)
  }

  // Get compatibility stats
  const compatibilityStats = await prisma.product.aggregate({
    _count: {
      worksGoogle: true,
      worksAlexa: true,
      worksHa: true,
      worksMatter: true,
      worksZigbee: true,
      worksZwave: true,
      worksThread: true
    },
    where: { published: true }
  })

  console.log('\n🔗 Compatibility Statistics:')
  console.log(`   Google Home: ${compatibilityStats._count.worksGoogle} products`)
  console.log(`   Alexa: ${compatibilityStats._count.worksAlexa} products`)
  console.log(`   Home Assistant: ${compatibilityStats._count.worksHa} products`)
  console.log(`   Matter: ${compatibilityStats._count.worksMatter} products`)
  console.log(`   Zigbee: ${compatibilityStats._count.worksZigbee} products`)
  console.log(`   Z-Wave: ${compatibilityStats._count.worksZwave} products`)
  console.log(`   Thread: ${compatibilityStats._count.worksThread} products`)

  // Get price range
  const priceStats = await prisma.product.aggregate({
    _min: { priceCad: true },
    _max: { priceCad: true },
    _avg: { priceCad: true },
    where: { published: true }
  })

  console.log('\n💰 Price Statistics:')
  console.log(`   Min Price: $${((priceStats._min.priceCad || 0) / 100).toFixed(2)} CAD`)
  console.log(`   Max Price: $${((priceStats._max.priceCad || 0) / 100).toFixed(2)} CAD`)
  console.log(`   Avg Price: $${((priceStats._avg.priceCad || 0) / 100).toFixed(2)} CAD`)

  // Get stock levels
  const stockStats = await prisma.product.aggregate({
    _sum: { stock: true },
    _avg: { stock: true },
    where: { published: true }
  })

  console.log('\n📦 Stock Statistics:')
  console.log(`   Total Stock: ${stockStats._sum.stock || 0} units`)
  console.log(`   Avg Stock per Product: ${(stockStats._avg.stock || 0).toFixed(1)} units`)

  // Get low stock products
  const lowStockProducts = await prisma.product.findMany({
    where: {
      published: true,
      stock: { lt: 10 }
    },
    select: {
      title: true,
      stock: true,
      priceCad: true
    }
  })

  if (lowStockProducts.length > 0) {
    console.log('\n⚠️ Low Stock Products:')
    lowStockProducts.forEach(product => {
      console.log(`   ${product.title}: ${product.stock} units ($${(product.priceCad / 100).toFixed(2)} CAD)`)
    })
  }

  console.log('\n🎉 Data verification completed!')
  console.log(`\n🌐 Platform is running at: http://localhost:3000`)
  console.log(`📊 Admin dashboard: http://localhost:3000/admin/dashboard`)
  console.log(`🛍️ Product catalog: http://localhost:3000/catalog`)
  console.log(`📦 Starter kits: http://localhost:3000/kits`)
  console.log(`📅 Consultation: http://localhost:3000/consultation`)
}

main()
  .catch((e) => {
    console.error('❌ Error during verification:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
