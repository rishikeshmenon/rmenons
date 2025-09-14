import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Smart Lighting',
        children: {
          create: [
            { name: 'Smart Bulbs' },
            { name: 'Smart Switches' },
            { name: 'Smart Dimmers' },
            { name: 'LED Strips' }
          ]
        }
      }
    }),
    prisma.category.create({
      data: {
        name: 'Security & Monitoring',
        children: {
          create: [
            { name: 'Security Cameras' },
            { name: 'Door Locks' },
            { name: 'Motion Sensors' },
            { name: 'Door/Window Sensors' },
            { name: 'Alarm Systems' }
          ]
        }
      }
    }),
    prisma.category.create({
      data: {
        name: 'Climate Control',
        children: {
          create: [
            { name: 'Smart Thermostats' },
            { name: 'Smart Vents' },
            { name: 'Air Quality Monitors' },
            { name: 'Humidity Sensors' }
          ]
        }
      }
    }),
    prisma.category.create({
      data: {
        name: 'Entertainment',
        children: {
          create: [
            { name: 'Smart Speakers' },
            { name: 'Smart Displays' },
            { name: 'Media Players' },
            { name: 'Sound Systems' }
          ]
        }
      }
    }),
    prisma.category.create({
      data: {
        name: 'Hubs & Bridges',
        children: {
          create: [
            { name: 'Zigbee Hubs' },
            { name: 'Z-Wave Controllers' },
            { name: 'Matter Bridges' },
            { name: 'Universal Hubs' }
          ]
        }
      }
    })
  ])

  console.log('✅ Categories created')

  // Create sample products
  const products = await Promise.all([
    // Smart Bulbs
    prisma.product.create({
      data: {
        sku: 'PHILIPS-HUE-A19-001',
        title: 'Philips Hue White and Color Ambiance A19 Smart Bulb',
        brand: 'Philips',
        categoryId: categories[0].children[0].id,
        shortDesc: '16 million colors, dimmable, works with Alexa and Google',
        longDesc: 'The Philips Hue White and Color Ambiance A19 Smart Bulb offers 16 million colors and dimmable white light. Perfect for creating the perfect ambiance in any room.',
        priceCad: 4999, // $49.99
        priceUsd: 3999, // $39.99
        stock: 50,
        images: ['/products/philips-hue-a19.jpg'],
        protocol: 'zigbee',
        power: '9W',
        roomTags: ['living-room', 'bedroom', 'kitchen'],
        beginnerFriendly: true,
        worksGoogle: true,
        worksAlexa: true,
        worksHa: true,
        worksMatter: true,
        worksZigbee: true,
        requiresBridge: ['philips-hue-bridge'],
        published: true
      }
    }),
    prisma.product.create({
      data: {
        sku: 'LIFX-A19-001',
        title: 'LIFX A19 Smart Bulb',
        brand: 'LIFX',
        categoryId: categories[0].children[0].id,
        shortDesc: 'WiFi smart bulb, no hub required, 16 million colors',
        longDesc: 'The LIFX A19 Smart Bulb connects directly to your WiFi network without requiring a hub. Features 16 million colors and is compatible with major smart home platforms.',
        priceCad: 3999, // $39.99
        priceUsd: 3299, // $32.99
        stock: 30,
        images: ['/products/lifx-a19.jpg'],
        protocol: 'wifi',
        power: '11W',
        roomTags: ['living-room', 'bedroom', 'kitchen'],
        beginnerFriendly: true,
        worksGoogle: true,
        worksAlexa: true,
        worksHa: true,
        worksMatter: true,
        published: true
      }
    }),
    // Smart Switches
    prisma.product.create({
      data: {
        sku: 'LUTRON-CASETA-001',
        title: 'Lutron Caseta Smart Dimmer Switch',
        brand: 'Lutron',
        categoryId: categories[0].children[1].id,
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
        worksZigbee: false,
        requiresBridge: ['lutron-caseta-hub'],
        published: true
      }
    }),
    // Motion Sensors
    prisma.product.create({
      data: {
        sku: 'AQUARA-MOTION-001',
        title: 'Aqara Motion Sensor',
        brand: 'Aqara',
        categoryId: categories[1].children[2].id,
        shortDesc: 'Zigbee motion sensor, 2-year battery life',
        longDesc: 'The Aqara Motion Sensor provides reliable motion detection with a 2-year battery life. Perfect for automating lights and security systems.',
        priceCad: 2499, // $24.99
        priceUsd: 1999, // $19.99
        stock: 40,
        images: ['/products/aqara-motion.jpg'],
        protocol: 'zigbee',
        power: 'Battery',
        roomTags: ['living-room', 'bedroom', 'kitchen', 'bathroom', 'garage'],
        beginnerFriendly: true,
        worksGoogle: true,
        worksAlexa: true,
        worksHa: true,
        worksMatter: true,
        worksZigbee: true,
        requiresBridge: ['zigbee-hub'],
        published: true
      }
    }),
    // Door Sensors
    prisma.product.create({
      data: {
        sku: 'AQUARA-DOOR-001',
        title: 'Aqara Door/Window Sensor',
        brand: 'Aqara',
        categoryId: categories[1].children[3].id,
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
        requiresBridge: ['zigbee-hub'],
        published: true
      }
    }),
    // Smart Thermostat
    prisma.product.create({
      data: {
        sku: 'NEST-THERMOSTAT-001',
        title: 'Google Nest Learning Thermostat',
        brand: 'Google Nest',
        categoryId: categories[2].children[0].id,
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
        published: true
      }
    }),
    // Smart Speaker
    prisma.product.create({
      data: {
        sku: 'GOOGLE-NEST-MINI-001',
        title: 'Google Nest Mini (2nd Gen)',
        brand: 'Google',
        categoryId: categories[3].children[0].id,
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
        published: true
      }
    }),
    // Zigbee Hub
    prisma.product.create({
      data: {
        sku: 'CONBEE-II-001',
        title: 'ConBee II USB Zigbee Gateway',
        brand: 'dresden elektronik',
        categoryId: categories[4].children[0].id,
        shortDesc: 'USB Zigbee gateway for Home Assistant and other platforms',
        longDesc: 'The ConBee II USB Zigbee Gateway allows you to connect Zigbee devices to Home Assistant and other smart home platforms.',
        priceCad: 8999, // $89.99
        priceUsd: 7999, // $79.99
        stock: 10,
        images: ['/products/conbee-ii.jpg'],
        protocol: 'zigbee',
        power: 'USB',
        roomTags: ['office', 'server-room'],
        beginnerFriendly: false,
        worksGoogle: false,
        worksAlexa: false,
        worksHa: true,
        worksMatter: false,
        worksZigbee: true,
        published: true
      }
    })
  ])

  console.log('✅ Products created')

  // Create sample starter kits
  const kits = await Promise.all([
    prisma.kit.create({
      data: {
        slug: 'google-starter-kit',
        title: 'Google Home Starter Kit',
        ecosystem: 'GOOGLE',
        summary: 'Perfect introduction to smart home automation with Google Home integration.',
        includes: {
          hub: 'Google Nest Mini (2nd Gen)',
          devices: [
            '2x LIFX A19 Smart Bulbs',
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
        skillLevel: 'BEGINNER',
        installTime: 30,
        images: ['/kits/google-starter.jpg'],
        faq: {
          questions: [
            {
              question: 'Do I need a hub for this kit?',
              answer: 'No, all devices connect directly to your WiFi network.'
            },
            {
              question: 'How long does setup take?',
              answer: 'Most users can complete setup in 30 minutes or less.'
            }
          ]
        },
        published: true,
        kitProducts: {
          create: [
            { productId: products[6].id, qty: 1 }, // Google Nest Mini
            { productId: products[1].id, qty: 2 }, // LIFX bulbs
            { productId: products[3].id, qty: 1 }, // Motion sensor
            { productId: products[4].id, qty: 1 }  // Door sensor
          ]
        }
      }
    }),
    prisma.kit.create({
      data: {
        slug: 'alexa-starter-kit',
        title: 'Alexa Smart Home Kit',
        ecosystem: 'ALEXA',
        summary: 'Complete Alexa-powered smart home setup with voice control and automation.',
        includes: {
          hub: 'Echo Dot (4th Gen)',
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
        skillLevel: 'BEGINNER',
        installTime: 30,
        images: ['/kits/alexa-starter.jpg'],
        faq: {
          questions: [
            {
              question: 'What Echo device is included?',
              answer: 'This kit includes the Echo Dot (4th Gen) with improved audio.'
            },
            {
              question: 'Do I need the Philips Hue Bridge?',
              answer: 'Yes, the Philips Hue bulbs require the Hue Bridge for full functionality.'
            }
          ]
        },
        published: true,
        kitProducts: {
          create: [
            { productId: products[0].id, qty: 2 }, // Philips Hue bulbs
            { productId: products[3].id, qty: 1 }, // Motion sensor
            { productId: products[4].id, qty: 1 }  // Door sensor
          ]
        }
      }
    })
  ])

  console.log('✅ Starter kits created')

  // Create sample content
  await prisma.content.createMany({
    data: [
      {
        slug: 'getting-started-smart-home',
        type: 'GUIDE',
        title: 'Getting Started with Smart Home Automation',
        body: {
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Welcome to the world of smart home automation! This guide will help you get started with your first smart home setup.'
                }
              ]
            }
          ]
        },
        seo: {
          title: 'Smart Home Automation Guide | SmartHome Solutions',
          description: 'Learn how to get started with smart home automation. Complete guide for beginners.',
          keywords: ['smart home', 'automation', 'beginner guide', 'home assistant']
        },
        published: true
      },
      {
        slug: 'zigbee-vs-zwave-comparison',
        type: 'BLOG',
        title: 'Zigbee vs Z-Wave: Which Protocol Should You Choose?',
        body: {
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'When building a smart home, choosing the right wireless protocol is crucial. Here\'s a detailed comparison of Zigbee and Z-Wave.'
                }
              ]
            }
          ]
        },
        seo: {
          title: 'Zigbee vs Z-Wave Comparison | SmartHome Solutions',
          description: 'Compare Zigbee and Z-Wave protocols for smart home automation. Learn the pros and cons of each.',
          keywords: ['zigbee', 'z-wave', 'smart home protocol', 'comparison']
        },
        published: true
      },
      {
        slug: 'home-assistant-setup',
        type: 'FAQ',
        title: 'How do I set up Home Assistant?',
        body: {
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Setting up Home Assistant is easier than you might think. Follow these steps to get started.'
                }
              ]
            }
          ]
        },
        seo: {
          title: 'Home Assistant Setup FAQ | SmartHome Solutions',
          description: 'Learn how to set up Home Assistant for your smart home automation needs.',
          keywords: ['home assistant', 'setup', 'tutorial', 'smart home']
        },
        published: true
      }
    ]
  })

  console.log('✅ Content created')

  console.log('🎉 Database seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error during database seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
