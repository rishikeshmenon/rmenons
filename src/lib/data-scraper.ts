import { db } from './db'
import { Product, Category, Kit } from '@prisma/client'

interface ScrapedProduct {
  sku: string
  title: string
  brand: string
  category: string
  shortDesc: string
  longDesc: string
  priceCad: number
  priceUsd: number
  stock: number
  images: string[]
  protocol: string
  power: string
  roomTags: string[]
  beginnerFriendly: boolean
  worksGoogle: boolean
  worksAlexa: boolean
  worksHa: boolean
  worksMatter: boolean
  worksZigbee: boolean
  worksZwave: boolean
  worksThread: boolean
  requiresBridge: string[]
  source: string
  lastUpdated: Date
}

interface ScrapedCategory {
  name: string
  parent?: string
  description?: string
}

export class DataScraper {
  private baseUrl = 'https://api.smarthomeproducts.com' // Mock API endpoint
  private rateLimitDelay = 1000 // 1 second between requests

  async scrapeProducts(): Promise<ScrapedProduct[]> {
    const products: ScrapedProduct[] = []
    
    // Simulate scraping from multiple sources
    const sources = [
      'philips-hue',
      'lifx',
      'lutron',
      'aqara',
      'google-nest',
      'amazon-echo',
      'samsung-smartthings',
      'wyze',
      'ring',
      'ecobee'
    ]

    for (const source of sources) {
      try {
        const sourceProducts = await this.scrapeFromSource(source)
        products.push(...sourceProducts)
        await this.delay(this.rateLimitDelay)
      } catch (error) {
        console.error(`Error scraping from ${source}:`, error)
      }
    }

    return products
  }

  private async scrapeFromSource(source: string): Promise<ScrapedProduct[]> {
    // This would be replaced with actual scraping logic
    // For now, we'll use mock data based on real product information
    return this.getMockProductsForSource(source)
  }

  private getMockProductsForSource(source: string): ScrapedProduct[] {
    const baseProducts = {
      'philips-hue': [
        {
          sku: 'PHILIPS-HUE-A19-COLOR-001',
          title: 'Philips Hue White and Color Ambiance A19 Smart Bulb',
          brand: 'Philips',
          category: 'Smart Bulbs',
          shortDesc: '16 million colors, dimmable, works with Alexa and Google',
          longDesc: 'The Philips Hue White and Color Ambiance A19 Smart Bulb offers 16 million colors and dimmable white light. Perfect for creating the perfect ambiance in any room. Requires Hue Bridge for full functionality.',
          priceCad: 4999,
          priceUsd: 3999,
          stock: 50,
          images: ['/products/philips-hue-a19-color.jpg'],
          protocol: 'zigbee',
          power: '9W',
          roomTags: ['living-room', 'bedroom', 'kitchen'],
          beginnerFriendly: true,
          worksGoogle: true,
          worksAlexa: true,
          worksHa: true,
          worksMatter: true,
          worksZigbee: true,
          worksZwave: false,
          worksThread: false,
          requiresBridge: ['philips-hue-bridge'],
          source: 'philips-hue',
          lastUpdated: new Date()
        },
        {
          sku: 'PHILIPS-HUE-BRIDGE-001',
          title: 'Philips Hue Smart Bridge',
          brand: 'Philips',
          category: 'Hubs & Bridges',
          shortDesc: 'Required hub for Philips Hue smart lighting system',
          longDesc: 'The Philips Hue Smart Bridge is the central hub that connects all your Hue lights and accessories to your home network and the internet.',
          priceCad: 6999,
          priceUsd: 5999,
          stock: 25,
          images: ['/products/philips-hue-bridge.jpg'],
          protocol: 'zigbee',
          power: '5W',
          roomTags: ['office', 'server-room'],
          beginnerFriendly: true,
          worksGoogle: true,
          worksAlexa: true,
          worksHa: true,
          worksMatter: true,
          worksZigbee: true,
          worksZwave: false,
          worksThread: false,
          requiresBridge: [],
          source: 'philips-hue',
          lastUpdated: new Date()
        }
      ],
      'lifx': [
        {
          sku: 'LIFX-A19-COLOR-001',
          title: 'LIFX A19 Color Smart Bulb',
          brand: 'LIFX',
          category: 'Smart Bulbs',
          shortDesc: 'WiFi smart bulb, no hub required, 16 million colors',
          longDesc: 'The LIFX A19 Color Smart Bulb connects directly to your WiFi network without requiring a hub. Features 16 million colors and is compatible with major smart home platforms.',
          priceCad: 3999,
          priceUsd: 3299,
          stock: 30,
          images: ['/products/lifx-a19-color.jpg'],
          protocol: 'wifi',
          power: '11W',
          roomTags: ['living-room', 'bedroom', 'kitchen'],
          beginnerFriendly: true,
          worksGoogle: true,
          worksAlexa: true,
          worksHa: true,
          worksMatter: true,
          worksZigbee: false,
          worksZwave: false,
          worksThread: false,
          requiresBridge: [],
          source: 'lifx',
          lastUpdated: new Date()
        }
      ],
      'lutron': [
        {
          sku: 'LUTRON-CASETA-DIMMER-001',
          title: 'Lutron Caseta Smart Dimmer Switch',
          brand: 'Lutron',
          category: 'Smart Switches',
          shortDesc: 'Smart dimmer switch, works with existing wiring',
          longDesc: 'The Lutron Caseta Smart Dimmer Switch replaces your existing switch and provides smart control over your lights. Works with most dimmable LED bulbs.',
          priceCad: 6999,
          priceUsd: 5999,
          stock: 25,
          images: ['/products/lutron-caseta-dimmer.jpg'],
          protocol: 'lutron',
          power: 'N/A',
          roomTags: ['living-room', 'bedroom', 'kitchen'],
          beginnerFriendly: false,
          worksGoogle: true,
          worksAlexa: true,
          worksHa: true,
          worksMatter: false,
          worksZigbee: false,
          worksZwave: false,
          worksThread: false,
          requiresBridge: ['lutron-caseta-hub'],
          source: 'lutron',
          lastUpdated: new Date()
        }
      ],
      'aqara': [
        {
          sku: 'AQARA-MOTION-SENSOR-001',
          title: 'Aqara Motion Sensor',
          brand: 'Aqara',
          category: 'Motion Sensors',
          shortDesc: 'Zigbee motion sensor, 2-year battery life',
          longDesc: 'The Aqara Motion Sensor provides reliable motion detection with a 2-year battery life. Perfect for automating lights and security systems.',
          priceCad: 2499,
          priceUsd: 1999,
          stock: 40,
          images: ['/products/aqara-motion-sensor.jpg'],
          protocol: 'zigbee',
          power: 'Battery',
          roomTags: ['living-room', 'bedroom', 'kitchen', 'bathroom', 'garage'],
          beginnerFriendly: true,
          worksGoogle: true,
          worksAlexa: true,
          worksHa: true,
          worksMatter: true,
          worksZigbee: true,
          worksZwave: false,
          worksThread: false,
          requiresBridge: ['zigbee-hub'],
          source: 'aqara',
          lastUpdated: new Date()
        }
      ],
      'google-nest': [
        {
          sku: 'GOOGLE-NEST-MINI-001',
          title: 'Google Nest Mini (2nd Gen)',
          brand: 'Google',
          category: 'Smart Speakers',
          shortDesc: 'Smart speaker with Google Assistant, voice control',
          longDesc: 'The Google Nest Mini is a compact smart speaker that brings Google Assistant to your home. Control your smart home devices with voice commands.',
          priceCad: 6999,
          priceUsd: 4999,
          stock: 20,
          images: ['/products/google-nest-mini.jpg'],
          protocol: 'wifi',
          power: '15W',
          roomTags: ['living-room', 'bedroom', 'kitchen'],
          beginnerFriendly: true,
          worksGoogle: true,
          worksAlexa: false,
          worksHa: true,
          worksMatter: true,
          worksZigbee: false,
          worksZwave: false,
          worksThread: false,
          requiresBridge: [],
          source: 'google-nest',
          lastUpdated: new Date()
        }
      ]
    }

    return baseProducts[source] || []
  }

  async scrapeCategories(): Promise<ScrapedCategory[]> {
    return [
      { name: 'Smart Lighting', description: 'Smart bulbs, switches, and lighting controls' },
      { name: 'Smart Bulbs', parent: 'Smart Lighting', description: 'WiFi and Zigbee smart light bulbs' },
      { name: 'Smart Switches', parent: 'Smart Lighting', description: 'Smart wall switches and dimmers' },
      { name: 'Security & Monitoring', description: 'Security cameras, sensors, and monitoring devices' },
      { name: 'Motion Sensors', parent: 'Security & Monitoring', description: 'Motion detection sensors' },
      { name: 'Door/Window Sensors', parent: 'Security & Monitoring', description: 'Contact sensors for doors and windows' },
      { name: 'Climate Control', description: 'Smart thermostats and climate management' },
      { name: 'Smart Thermostats', parent: 'Climate Control', description: 'WiFi-enabled thermostats' },
      { name: 'Entertainment', description: 'Smart speakers, displays, and media devices' },
      { name: 'Smart Speakers', parent: 'Entertainment', description: 'Voice-controlled smart speakers' },
      { name: 'Hubs & Bridges', description: 'Central hubs and protocol bridges' },
      { name: 'Zigbee Hubs', parent: 'Hubs & Bridges', description: 'Zigbee protocol hubs and bridges' }
    ]
  }

  async updateDatabase(): Promise<void> {
    console.log('🔄 Starting database update...')

    // Update categories
    await this.updateCategories()
    
    // Update products
    await this.updateProducts()

    console.log('✅ Database update completed')
  }

  private async updateCategories(): Promise<void> {
    const scrapedCategories = await this.scrapeCategories()
    
    for (const categoryData of scrapedCategories) {
      const existingCategory = await db.category.findFirst({
        where: { name: categoryData.name }
      })

      if (!existingCategory) {
        const parentId = categoryData.parent 
          ? (await db.category.findFirst({ where: { name: categoryData.parent } }))?.id
          : null

        await db.category.create({
          data: {
            name: categoryData.name,
            parentId: parentId
          }
        })
        console.log(`✅ Created category: ${categoryData.name}`)
      }
    }
  }

  private async updateProducts(): Promise<void> {
    const scrapedProducts = await this.scrapeProducts()
    
    for (const productData of scrapedProducts) {
      // Find or create category
      const category = await db.category.findFirst({
        where: { name: productData.category }
      })

      if (!category) {
        console.warn(`⚠️ Category not found: ${productData.category}`)
        continue
      }

      // Check if product exists
      const existingProduct = await db.product.findFirst({
        where: { sku: productData.sku }
      })

      const productDataToSave = {
        sku: productData.sku,
        title: productData.title,
        brand: productData.brand,
        categoryId: category.id,
        shortDesc: productData.shortDesc,
        longDesc: productData.longDesc,
        priceCad: productData.priceCad,
        priceUsd: productData.priceUsd,
        stock: productData.stock,
        images: productData.images,
        protocol: productData.protocol,
        power: productData.power,
        roomTags: productData.roomTags,
        beginnerFriendly: productData.beginnerFriendly,
        worksGoogle: productData.worksGoogle,
        worksAlexa: productData.worksAlexa,
        worksHa: productData.worksHa,
        worksMatter: productData.worksMatter,
        worksZigbee: productData.worksZigbee,
        worksZwave: productData.worksZwave,
        worksThread: productData.worksThread,
        requiresBridge: productData.requiresBridge,
        published: true
      }

      if (existingProduct) {
        // Update existing product
        await db.product.update({
          where: { id: existingProduct.id },
          data: productDataToSave
        })
        console.log(`🔄 Updated product: ${productData.title}`)
      } else {
        // Create new product
        await db.product.create({
          data: productDataToSave
        })
        console.log(`✅ Created product: ${productData.title}`)
      }
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export const dataScraper = new DataScraper()
