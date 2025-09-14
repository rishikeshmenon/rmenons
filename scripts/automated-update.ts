#!/usr/bin/env tsx

import { dataScraper } from '../src/lib/data-scraper'
import { priceMonitor } from '../src/lib/price-monitor'
import { webScraper } from '../src/lib/web-scraper'
import { db } from '../src/lib/db'

interface UpdateStats {
  productsUpdated: number
  pricesUpdated: number
  newProductsAdded: number
  categoriesUpdated: number
  errors: string[]
  startTime: Date
  endTime: Date
  duration: number
}

class AutomatedUpdater {
  private stats: UpdateStats = {
    productsUpdated: 0,
    pricesUpdated: 0,
    newProductsAdded: 0,
    categoriesUpdated: 0,
    errors: [],
    startTime: new Date(),
    endTime: new Date(),
    duration: 0
  }

  async runFullUpdate(): Promise<void> {
    console.log('🚀 Starting automated platform update...')
    this.stats.startTime = new Date()

    try {
      // Step 1: Update categories
      await this.updateCategories()
      
      // Step 2: Update existing products
      await this.updateProducts()
      
      // Step 3: Update prices
      await this.updatePrices()
      
      // Step 4: Check stock levels
      await this.updateStockLevels()
      
      // Step 5: Search for new products
      await this.searchNewProducts()
      
      // Step 6: Web scraping for real-time data
      await this.performWebScraping()
      
      // Step 7: Update product availability
      await this.updateAvailability()
      
      // Step 8: Generate analytics report
      await this.generateAnalyticsReport()

    } catch (error) {
      console.error('❌ Error during automated update:', error)
      this.stats.errors.push(error instanceof Error ? error.message : 'Unknown error')
    } finally {
      this.stats.endTime = new Date()
      this.stats.duration = this.stats.endTime.getTime() - this.stats.startTime.getTime()
      
      await this.logUpdateResults()
    }
  }

  private async updateCategories(): Promise<void> {
    console.log('📁 Updating categories...')
    try {
      await dataScraper.updateCategories()
      this.stats.categoriesUpdated++
      console.log('✅ Categories updated successfully')
    } catch (error) {
      console.error('❌ Error updating categories:', error)
      this.stats.errors.push('Category update failed')
    }
  }

  private async updateProducts(): Promise<void> {
    console.log('📦 Updating products...')
    try {
      await dataScraper.updateDatabase()
      this.stats.productsUpdated++
      console.log('✅ Products updated successfully')
    } catch (error) {
      console.error('❌ Error updating products:', error)
      this.stats.errors.push('Product update failed')
    }
  }

  private async updatePrices(): Promise<void> {
    console.log('💰 Updating prices...')
    try {
      await priceMonitor.updatePrices()
      this.stats.pricesUpdated++
      console.log('✅ Prices updated successfully')
    } catch (error) {
      console.error('❌ Error updating prices:', error)
      this.stats.errors.push('Price update failed')
    }
  }

  private async updateStockLevels(): Promise<void> {
    console.log('📦 Updating stock levels...')
    try {
      await priceMonitor.checkStockLevels()
      console.log('✅ Stock levels updated successfully')
    } catch (error) {
      console.error('❌ Error updating stock levels:', error)
      this.stats.errors.push('Stock update failed')
    }
  }

  private async searchNewProducts(): Promise<void> {
    console.log('🔍 Searching for new products...')
    try {
      await webScraper.scrapeNewProducts()
      this.stats.newProductsAdded++
      console.log('✅ New product search completed')
    } catch (error) {
      console.error('❌ Error searching for new products:', error)
      this.stats.errors.push('New product search failed')
    }
  }

  private async performWebScraping(): Promise<void> {
    console.log('🕷️ Performing web scraping...')
    try {
      await webScraper.scrapeAllProducts()
      console.log('✅ Web scraping completed')
    } catch (error) {
      console.error('❌ Error during web scraping:', error)
      this.stats.errors.push('Web scraping failed')
    }
  }

  private async updateAvailability(): Promise<void> {
    console.log('🔄 Updating product availability...')
    try {
      await priceMonitor.updateProductAvailability()
      console.log('✅ Product availability updated')
    } catch (error) {
      console.error('❌ Error updating availability:', error)
      this.stats.errors.push('Availability update failed')
    }
  }

  private async generateAnalyticsReport(): Promise<void> {
    console.log('📊 Generating analytics report...')
    try {
      const totalProducts = await db.product.count({ where: { published: true } })
      const totalCategories = await db.category.count()
      const lowStockProducts = await db.product.count({ 
        where: { 
          published: true, 
          stock: { lt: 10 } 
        } 
      })
      const outOfStockProducts = await db.product.count({ 
        where: { 
          published: true, 
          stock: 0 
        } 
      })

      const report = {
        timestamp: new Date().toISOString(),
        totalProducts,
        totalCategories,
        lowStockProducts,
        outOfStockProducts,
        updateStats: this.stats
      }

      console.log('📈 Analytics Report:')
      console.log(`   Total Products: ${totalProducts}`)
      console.log(`   Total Categories: ${totalCategories}`)
      console.log(`   Low Stock Products: ${lowStockProducts}`)
      console.log(`   Out of Stock Products: ${outOfStockProducts}`)
      console.log(`   Update Duration: ${(this.stats.duration / 1000).toFixed(2)}s`)
      console.log(`   Errors: ${this.stats.errors.length}`)

    } catch (error) {
      console.error('❌ Error generating analytics report:', error)
      this.stats.errors.push('Analytics report generation failed')
    }
  }

  private async logUpdateResults(): Promise<void> {
    console.log('\n🎉 Automated Update Completed!')
    console.log('=' .repeat(50))
    console.log(`⏱️  Duration: ${(this.stats.duration / 1000).toFixed(2)}s`)
    console.log(`📦 Products Updated: ${this.stats.productsUpdated}`)
    console.log(`💰 Prices Updated: ${this.stats.pricesUpdated}`)
    console.log(`🆕 New Products Added: ${this.stats.newProductsAdded}`)
    console.log(`📁 Categories Updated: ${this.stats.categoriesUpdated}`)
    console.log(`❌ Errors: ${this.stats.errors.length}`)
    
    if (this.stats.errors.length > 0) {
      console.log('\n🚨 Errors encountered:')
      this.stats.errors.forEach((error, index) => {
        console.log(`   ${index + 1}. ${error}`)
      })
    }
    
    console.log('=' .repeat(50))
  }
}

// Main execution
async function main() {
  const updater = new AutomatedUpdater()
  
  // Check if running as a script
  if (require.main === module) {
    await updater.runFullUpdate()
    process.exit(0)
  }
}

// Export for use in other modules
export { AutomatedUpdater }

// Run if called directly
if (require.main === module) {
  main().catch((error) => {
    console.error('❌ Fatal error:', error)
    process.exit(1)
  })
}
