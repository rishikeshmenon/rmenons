import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Real smart home product data based on current market research
const realProducts = [
  // Philips Hue Products
  {
    sku: 'PHILIPS-HUE-A19-COLOR-001',
    title: 'Philips Hue White and Color Ambiance A19 Smart Bulb',
    brand: 'Philips',
    category: 'Smart Bulbs',
    shortDesc: '16 million colors, dimmable, works with Alexa and Google',
    longDesc: 'The Philips Hue White and Color Ambiance A19 Smart Bulb offers 16 million colors and dimmable white light. Perfect for creating the perfect ambiance in any room. Requires Hue Bridge for full functionality.',
    priceCad: 4999, // $49.99
    priceUsd: 3999, // $39.99
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
    requiresBridge: ['philips-hue-bridge']
  },
  {
    sku: 'PHILIPS-HUE-BRIDGE-001',
    title: 'Philips Hue Smart Bridge',
    brand: 'Philips',
    category: 'Hubs & Bridges',
    shortDesc: 'Required hub for Philips Hue smart lighting system',
    longDesc: 'The Philips Hue Smart Bridge is the central hub that connects all your Hue lights and accessories to your home network and the internet.',
    priceCad: 6999, // $69.99
    priceUsd: 5999, // $59.99
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
    requiresBridge: []
  },
  {
    sku: 'PHILIPS-HUE-MOTION-SENSOR-001',
    title: 'Philips Hue Motion Sensor',
    brand: 'Philips',
    category: 'Motion Sensors',
    shortDesc: 'Motion sensor for Hue lighting automation',
    longDesc: 'The Philips Hue Motion Sensor automatically turns your lights on when you enter a room and off when you leave. Works seamlessly with your Hue lighting system.',
    priceCad: 3999, // $39.99
    priceUsd: 3299, // $32.99
    stock: 30,
    images: ['/products/philips-hue-motion.jpg'],
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
    requiresBridge: ['philips-hue-bridge']
  },

  // LIFX Products
  {
    sku: 'LIFX-A19-COLOR-001',
    title: 'LIFX A19 Color Smart Bulb',
    brand: 'LIFX',
    category: 'Smart Bulbs',
    shortDesc: 'WiFi smart bulb, no hub required, 16 million colors',
    longDesc: 'The LIFX A19 Color Smart Bulb connects directly to your WiFi network without requiring a hub. Features 16 million colors and is compatible with major smart home platforms.',
    priceCad: 3999, // $39.99
    priceUsd: 3299, // $32.99
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
    requiresBridge: []
  },
  {
    sku: 'LIFX-MINI-COLOR-001',
    title: 'LIFX Mini Color Smart Bulb',
    brand: 'LIFX',
    category: 'Smart Bulbs',
    shortDesc: 'Compact WiFi smart bulb, perfect for small spaces',
    longDesc: 'The LIFX Mini Color Smart Bulb is a compact version of the popular LIFX bulb, perfect for smaller fixtures and spaces. No hub required.',
    priceCad: 2999, // $29.99
    priceUsd: 2499, // $24.99
    stock: 40,
    images: ['/products/lifx-mini-color.jpg'],
    protocol: 'wifi',
    power: '8W',
    roomTags: ['bedroom', 'bathroom', 'office'],
    beginnerFriendly: true,
    worksGoogle: true,
    worksAlexa: true,
    worksHa: true,
    worksMatter: true,
    worksZigbee: false,
    worksZwave: false,
    worksThread: false,
    requiresBridge: []
  },

  // Lutron Products
  {
    sku: 'LUTRON-CASETA-DIMMER-001',
    title: 'Lutron Caseta Smart Dimmer Switch',
    brand: 'Lutron',
    category: 'Smart Switches',
    shortDesc: 'Smart dimmer switch, works with existing wiring',
    longDesc: 'The Lutron Caseta Smart Dimmer Switch replaces your existing switch and provides smart control over your lights. Works with most dimmable LED bulbs.',
    priceCad: 6999, // $69.99
    priceUsd: 5999, // $59.99
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
    requiresBridge: ['lutron-caseta-hub']
  },
  {
    sku: 'LUTRON-CASETA-HUB-001',
    title: 'Lutron Caseta Smart Bridge',
    brand: 'Lutron',
    category: 'Hubs & Bridges',
    shortDesc: 'Required hub for Lutron Caseta smart switches',
    longDesc: 'The Lutron Caseta Smart Bridge connects your Caseta switches to your home network and enables smart home integration.',
    priceCad: 8999, // $89.99
    priceUsd: 7999, // $79.99
    stock: 15,
    images: ['/products/lutron-caseta-hub.jpg'],
    protocol: 'lutron',
    power: '5W',
    roomTags: ['office', 'server-room'],
    beginnerFriendly: false,
    worksGoogle: true,
    worksAlexa: true,
    worksHa: true,
    worksMatter: false,
    worksZigbee: false,
    worksZwave: false,
    worksThread: false,
    requiresBridge: []
  },

  // Aqara Products
  {
    sku: 'AQARA-MOTION-SENSOR-001',
    title: 'Aqara Motion Sensor',
    brand: 'Aqara',
    category: 'Motion Sensors',
    shortDesc: 'Zigbee motion sensor, 2-year battery life',
    longDesc: 'The Aqara Motion Sensor provides reliable motion detection with a 2-year battery life. Perfect for automating lights and security systems.',
    priceCad: 2499, // $24.99
    priceUsd: 1999, // $19.99
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
    requiresBridge: ['zigbee-hub']
  },
  {
    sku: 'AQARA-DOOR-SENSOR-001',
    title: 'Aqara Door/Window Sensor',
    brand: 'Aqara',
    category: 'Door/Window Sensors',
    shortDesc: 'Zigbee door/window sensor, magnetic contact',
    longDesc: 'The Aqara Door/Window Sensor uses magnetic contact to detect when doors or windows are opened or closed. Perfect for security and automation.',
    priceCad: 1999, // $19.99
    priceUsd: 1599, // $15.99
    stock: 35,
    images: ['/products/aqara-door-sensor.jpg'],
    protocol: 'zigbee',
    power: 'Battery',
    roomTags: ['living-room', 'bedroom', 'kitchen', 'garage', 'outdoor'],
    beginnerFriendly: true,
    worksGoogle: true,
    worksAlexa: true,
    worksHa: true,
    worksMatter: true,
    worksZigbee: true,
    worksZwave: false,
    worksThread: false,
    requiresBridge: ['zigbee-hub']
  },
  {
    sku: 'AQARA-TEMP-HUMIDITY-001',
    title: 'Aqara Temperature and Humidity Sensor',
    brand: 'Aqara',
    category: 'Temperature Sensors',
    shortDesc: 'Zigbee temperature and humidity sensor',
    longDesc: 'The Aqara Temperature and Humidity Sensor monitors environmental conditions and can trigger automations based on temperature and humidity changes.',
    priceCad: 2299, // $22.99
    priceUsd: 1899, // $18.99
    stock: 30,
    images: ['/products/aqara-temp-humidity.jpg'],
    protocol: 'zigbee',
    power: 'Battery',
    roomTags: ['living-room', 'bedroom', 'kitchen', 'garage'],
    beginnerFriendly: true,
    worksGoogle: true,
    worksAlexa: true,
    worksHa: true,
    worksMatter: true,
    worksZigbee: true,
    worksZwave: false,
    worksThread: false,
    requiresBridge: ['zigbee-hub']
  },

  // Google Nest Products
  {
    sku: 'GOOGLE-NEST-MINI-001',
    title: 'Google Nest Mini (2nd Gen)',
    brand: 'Google',
    category: 'Smart Speakers',
    shortDesc: 'Smart speaker with Google Assistant, voice control',
    longDesc: 'The Google Nest Mini is a compact smart speaker that brings Google Assistant to your home. Control your smart home devices with voice commands.',
    priceCad: 6999, // $69.99
    priceUsd: 4999, // $49.99
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
    requiresBridge: []
  },
  {
    sku: 'GOOGLE-NEST-HUB-001',
    title: 'Google Nest Hub (2nd Gen)',
    brand: 'Google',
    category: 'Smart Displays',
    shortDesc: 'Smart display with Google Assistant and touch screen',
    longDesc: 'The Google Nest Hub combines a smart speaker with a 7-inch touch screen, perfect for controlling your smart home and viewing information.',
    priceCad: 12999, // $129.99
    priceUsd: 9999, // $99.99
    stock: 15,
    images: ['/products/google-nest-hub.jpg'],
    protocol: 'wifi',
    power: '20W',
    roomTags: ['living-room', 'kitchen', 'bedroom'],
    beginnerFriendly: true,
    worksGoogle: true,
    worksAlexa: false,
    worksHa: true,
    worksMatter: true,
    worksZigbee: false,
    worksZwave: false,
    worksThread: false,
    requiresBridge: []
  },
  {
    sku: 'GOOGLE-NEST-THERMOSTAT-001',
    title: 'Google Nest Learning Thermostat',
    brand: 'Google Nest',
    category: 'Smart Thermostats',
    shortDesc: 'Learning thermostat, energy saving, works with Google Home',
    longDesc: 'The Google Nest Learning Thermostat learns your schedule and preferences to help save energy while keeping you comfortable.',
    priceCad: 29999, // $299.99
    priceUsd: 24999, // $249.99
    stock: 15,
    images: ['/products/nest-thermostat.jpg'],
    protocol: 'wifi',
    power: '24V',
    roomTags: ['living-room', 'bedroom', 'kitchen'],
    beginnerFriendly: true,
    worksGoogle: true,
    worksAlexa: true,
    worksHa: true,
    worksMatter: true,
    worksZigbee: false,
    worksZwave: false,
    worksThread: false,
    requiresBridge: []
  },

  // Amazon Echo Products
  {
    sku: 'AMAZON-ECHO-DOT-001',
    title: 'Amazon Echo Dot (5th Gen)',
    brand: 'Amazon',
    category: 'Smart Speakers',
    shortDesc: 'Smart speaker with Alexa, voice control',
    longDesc: 'The Amazon Echo Dot is a compact smart speaker that brings Alexa to your home. Control your smart home devices with voice commands.',
    priceCad: 5999, // $59.99
    priceUsd: 4999, // $49.99
    stock: 25,
    images: ['/products/amazon-echo-dot.jpg'],
    protocol: 'wifi',
    power: '15W',
    roomTags: ['living-room', 'bedroom', 'kitchen'],
    beginnerFriendly: true,
    worksGoogle: false,
    worksAlexa: true,
    worksHa: true,
    worksMatter: true,
    worksZigbee: false,
    worksZwave: false,
    worksThread: false,
    requiresBridge: []
  },
  {
    sku: 'AMAZON-ECHO-SHOW-001',
    title: 'Amazon Echo Show 8 (3rd Gen)',
    brand: 'Amazon',
    category: 'Smart Displays',
    shortDesc: 'Smart display with Alexa and 8-inch touch screen',
    longDesc: 'The Amazon Echo Show 8 combines a smart speaker with an 8-inch touch screen, perfect for controlling your smart home and video calls.',
    priceCad: 14999, // $149.99
    priceUsd: 12999, // $129.99
    stock: 12,
    images: ['/products/amazon-echo-show.jpg'],
    protocol: 'wifi',
    power: '25W',
    roomTags: ['living-room', 'kitchen', 'bedroom'],
    beginnerFriendly: true,
    worksGoogle: false,
    worksAlexa: true,
    worksHa: true,
    worksMatter: true,
    worksZigbee: false,
    worksZwave: false,
    worksThread: false,
    requiresBridge: []
  },

  // Samsung SmartThings Products
  {
    sku: 'SAMSUNG-SMARTTHINGS-HUB-001',
    title: 'Samsung SmartThings Hub',
    brand: 'Samsung',
    category: 'Hubs & Bridges',
    shortDesc: 'Universal smart home hub, supports multiple protocols',
    longDesc: 'The Samsung SmartThings Hub is a universal smart home hub that supports Zigbee, Z-Wave, and WiFi devices. Perfect for complex smart home setups.',
    priceCad: 9999, // $99.99
    priceUsd: 8999, // $89.99
    stock: 10,
    images: ['/products/samsung-smartthings-hub.jpg'],
    protocol: 'wifi',
    power: '10W',
    roomTags: ['office', 'server-room'],
    beginnerFriendly: false,
    worksGoogle: true,
    worksAlexa: true,
    worksHa: true,
    worksMatter: true,
    worksZigbee: true,
    worksZwave: true,
    worksThread: false,
    requiresBridge: []
  },

  // Wyze Products
  {
    sku: 'WYZE-CAM-V3-001',
    title: 'Wyze Cam v3',
    brand: 'Wyze',
    category: 'Security Cameras',
    shortDesc: 'Affordable indoor/outdoor security camera with night vision',
    longDesc: 'The Wyze Cam v3 is an affordable security camera with 1080p video, night vision, and two-way audio. Perfect for home security on a budget.',
    priceCad: 3999, // $39.99
    priceUsd: 3299, // $32.99
    stock: 35,
    images: ['/products/wyze-cam-v3.jpg'],
    protocol: 'wifi',
    power: '5W',
    roomTags: ['living-room', 'bedroom', 'garage', 'outdoor'],
    beginnerFriendly: true,
    worksGoogle: true,
    worksAlexa: true,
    worksHa: true,
    worksMatter: false,
    worksZigbee: false,
    worksZwave: false,
    worksThread: false,
    requiresBridge: []
  },

  // Ring Products
  {
    sku: 'RING-DOORBELL-001',
    title: 'Ring Video Doorbell (2nd Gen)',
    brand: 'Ring',
    category: 'Security Cameras',
    shortDesc: 'WiFi video doorbell with motion detection and two-way audio',
    longDesc: 'The Ring Video Doorbell lets you see, hear, and speak to visitors from anywhere. Features motion detection and works with Alexa.',
    priceCad: 9999, // $99.99
    priceUsd: 7999, // $79.99
    stock: 20,
    images: ['/products/ring-doorbell.jpg'],
    protocol: 'wifi',
    power: 'Battery',
    roomTags: ['outdoor', 'garage'],
    beginnerFriendly: true,
    worksGoogle: false,
    worksAlexa: true,
    worksHa: true,
    worksMatter: false,
    worksZigbee: false,
    worksZwave: false,
    worksThread: false,
    requiresBridge: []
  },

  // Ecobee Products
  {
    sku: 'ECOBEE-SMART-THERMOSTAT-001',
    title: 'Ecobee SmartThermostat with Voice Control',
    brand: 'Ecobee',
    category: 'Smart Thermostats',
    shortDesc: 'Smart thermostat with built-in Alexa and room sensors',
    longDesc: 'The Ecobee SmartThermostat features built-in Alexa, room sensors, and advanced energy-saving features. Perfect for whole-home comfort control.',
    priceCad: 24999, // $249.99
    priceUsd: 19999, // $199.99
    stock: 8,
    images: ['/products/ecobee-thermostat.jpg'],
    protocol: 'wifi',
    power: '24V',
    roomTags: ['living-room', 'bedroom', 'kitchen'],
    beginnerFriendly: true,
    worksGoogle: true,
    worksAlexa: true,
    worksHa: true,
    worksMatter: true,
    worksZigbee: false,
    worksZwave: false,
    worksThread: false,
    requiresBridge: []
  }
]

const categories = [
  { name: 'Smart Lighting', description: 'Smart bulbs, switches, and lighting controls' },
  { name: 'Smart Bulbs', parent: 'Smart Lighting', description: 'WiFi and Zigbee smart light bulbs' },
  { name: 'Smart Switches', parent: 'Smart Lighting', description: 'Smart wall switches and dimmers' },
  { name: 'Security & Monitoring', description: 'Security cameras, sensors, and monitoring devices' },
  { name: 'Motion Sensors', parent: 'Security & Monitoring', description: 'Motion detection sensors' },
  { name: 'Door/Window Sensors', parent: 'Security & Monitoring', description: 'Contact sensors for doors and windows' },
  { name: 'Temperature Sensors', parent: 'Security & Monitoring', description: 'Temperature and humidity sensors' },
  { name: 'Security Cameras', parent: 'Security & Monitoring', description: 'Indoor and outdoor security cameras' },
  { name: 'Climate Control', description: 'Smart thermostats and climate management' },
  { name: 'Smart Thermostats', parent: 'Climate Control', description: 'WiFi-enabled thermostats' },
  { name: 'Entertainment', description: 'Smart speakers, displays, and media devices' },
  { name: 'Smart Speakers', parent: 'Entertainment', description: 'Voice-controlled smart speakers' },
  { name: 'Smart Displays', parent: 'Entertainment', description: 'Touch screen smart displays' },
  { name: 'Hubs & Bridges', description: 'Central hubs and protocol bridges' },
  { name: 'Zigbee Hubs', parent: 'Hubs & Bridges', description: 'Zigbee protocol hubs and bridges' }
]

async function main() {
  console.log('🌱 Starting real data population...')

  // Create categories
  console.log('📁 Creating categories...')
  for (const categoryData of categories) {
    const existingCategory = await prisma.category.findFirst({
      where: { name: categoryData.name }
    })

    if (!existingCategory) {
      const parentId = categoryData.parent 
        ? (await prisma.category.findFirst({ where: { name: categoryData.parent } }))?.id
        : null

      await prisma.category.create({
        data: {
          name: categoryData.name,
          parentId: parentId
        }
      })
      console.log(`✅ Created category: ${categoryData.name}`)
    } else {
      console.log(`⏭️ Category already exists: ${categoryData.name}`)
    }
  }

  // Create products
  console.log('📦 Creating products...')
  for (const productData of realProducts) {
    // Find category
    const category = await prisma.category.findFirst({
      where: { name: productData.category }
    })

    if (!category) {
      console.warn(`⚠️ Category not found: ${productData.category}`)
      continue
    }

    // Check if product exists
    const existingProduct = await prisma.product.findFirst({
      where: { sku: productData.sku }
    })

    if (!existingProduct) {
      await prisma.product.create({
        data: {
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
      })
      console.log(`✅ Created product: ${productData.title}`)
    } else {
      console.log(`⏭️ Product already exists: ${productData.title}`)
    }
  }

  // Create updated starter kits with real products
  console.log('📦 Creating starter kits...')
  
  const googleKit = await prisma.kit.findFirst({
    where: { slug: 'google-starter-kit' }
  })

  if (googleKit) {
    // Update existing kit
    await prisma.kit.update({
      where: { id: googleKit.id },
      data: {
        includes: {
          hub: 'Google Nest Mini (2nd Gen)',
          devices: [
            '2x LIFX A19 Color Smart Bulbs',
            '1x Aqara Motion Sensor',
            '1x Aqara Door/Window Sensor'
          ],
          accessories: [
            'Setup Guide',
            'QR Code Quick Start',
            '1 Year Support'
          ]
        },
        priceCad: 19999, // $199.99
        priceUsd: 16999, // $169.99
      }
    })
    console.log('✅ Updated Google starter kit')
  }

  const alexaKit = await prisma.kit.findFirst({
    where: { slug: 'alexa-starter-kit' }
  })

  if (alexaKit) {
    // Update existing kit
    await prisma.kit.update({
      where: { id: alexaKit.id },
      data: {
        includes: {
          hub: 'Amazon Echo Dot (5th Gen)',
          devices: [
            '2x Philips Hue White and Color Bulbs',
            '1x Aqara Motion Sensor',
            '1x Aqara Door/Window Sensor'
          ],
          accessories: [
            'Setup Guide',
            'QR Code Quick Start',
            '1 Year Support'
          ]
        },
        priceCad: 18999, // $189.99
        priceUsd: 15999, // $159.99
      }
    })
    console.log('✅ Updated Alexa starter kit')
  }

  console.log('🎉 Real data population completed successfully!')
  console.log(`📊 Created ${categories.length} categories`)
  console.log(`📦 Created ${realProducts.length} products`)
}

main()
  .catch((e) => {
    console.error('❌ Error during data population:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
