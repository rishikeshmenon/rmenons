'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Package, 
  Clock, 
  Star, 
  CheckCircle, 
  ArrowRight,
  Home,
  Shield,
  Zap,
  Users,
  Wrench
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface Kit {
  id: string
  slug: string
  title: string
  ecosystem: 'GOOGLE' | 'ALEXA'
  summary: string
  includes: any
  priceCad: number
  priceUsd: number
  skillLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  installTime: number
  images: string[]
  faq: any
}

export default function KitsPage() {
  const [kits, setKits] = useState<Kit[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEcosystem, setSelectedEcosystem] = useState<'all' | 'google' | 'alexa'>('all')

  useEffect(() => {
    // Mock data for now - replace with actual API call
    const mockKits: Kit[] = [
      {
        id: '1',
        slug: 'google-starter-kit',
        title: 'Google Home Starter Kit',
        ecosystem: 'GOOGLE',
        summary: 'Perfect introduction to smart home automation with Google Home integration.',
        includes: {
          hub: 'Google Nest Hub (2nd Gen)',
          devices: [
            '4x Smart Bulbs',
            '2x Smart Plugs',
            '1x Motion Sensor',
            '1x Door/Window Sensor'
          ],
          accessories: [
            'Setup Guide',
            'QR Code Quick Start',
            '1 Year Support'
          ]
        },
        priceCad: 29999, // $299.99
        priceUsd: 24999, // $249.99
        skillLevel: 'BEGINNER',
        installTime: 30,
        images: ['/kit-google.jpg'],
        faq: {}
      },
      {
        id: '2',
        slug: 'alexa-starter-kit',
        title: 'Alexa Smart Home Kit',
        ecosystem: 'ALEXA',
        summary: 'Complete Alexa-powered smart home setup with voice control and automation.',
        includes: {
          hub: 'Echo Dot (4th Gen)',
          devices: [
            '4x Smart Bulbs',
            '2x Smart Plugs',
            '1x Motion Sensor',
            '1x Door/Window Sensor'
          ],
          accessories: [
            'Setup Guide',
            'QR Code Quick Start',
            '1 Year Support'
          ]
        },
        priceCad: 27999, // $279.99
        priceUsd: 22999, // $229.99
        skillLevel: 'BEGINNER',
        installTime: 30,
        images: ['/kit-alexa.jpg'],
        faq: {}
      },
      {
        id: '3',
        slug: 'google-advanced-kit',
        title: 'Google Home Advanced Kit',
        ecosystem: 'GOOGLE',
        summary: 'Comprehensive smart home solution with advanced automation and security features.',
        includes: {
          hub: 'Google Nest Hub Max',
          devices: [
            '8x Smart Bulbs',
            '4x Smart Plugs',
            '2x Motion Sensors',
            '2x Door/Window Sensors',
            '1x Smart Thermostat',
            '1x Security Camera'
          ],
          accessories: [
            'Advanced Setup Guide',
            'Custom Automation Blueprints',
            '2 Year Support',
            'Installation Consultation'
          ]
        },
        priceCad: 59999, // $599.99
        priceUsd: 49999, // $499.99
        skillLevel: 'INTERMEDIATE',
        installTime: 90,
        images: ['/kit-google-advanced.jpg'],
        faq: {}
      }
    ]

    setKits(mockKits)
    setLoading(false)
  }, [])

  const filteredKits = kits.filter(kit => {
    if (selectedEcosystem === 'all') return true
    return kit.ecosystem.toLowerCase() === selectedEcosystem
  })

  const formatPrice = (priceCents: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
    }).format(priceCents / 100)
  }

  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case 'BEGINNER': return 'bg-green-100 text-green-800'
      case 'INTERMEDIATE': return 'bg-yellow-100 text-yellow-800'
      case 'ADVANCED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getEcosystemIcon = (ecosystem: string) => {
    switch (ecosystem) {
      case 'GOOGLE': return 'G'
      case 'ALEXA': return 'A'
      default: return '?'
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-muted rounded-t-lg" />
              <CardContent className="p-6">
                <div className="h-6 bg-muted rounded mb-2" />
                <div className="h-4 bg-muted rounded mb-4" />
                <div className="h-8 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Starter Kits</h1>
        <p className="text-muted-foreground">
          Pre-designed smart home kits that work perfectly with Google Home or Alexa out of the box.
        </p>
      </div>

      {/* Ecosystem Filter */}
      <div className="mb-8">
        <Tabs value={selectedEcosystem} onValueChange={(value) => setSelectedEcosystem(value as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Kits</TabsTrigger>
            <TabsTrigger value="google">Google Home</TabsTrigger>
            <TabsTrigger value="alexa">Alexa</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Kits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredKits.map((kit) => (
          <Card key={kit.id} className="group hover:shadow-lg transition-all duration-300">
            <div className="relative">
              <div className="aspect-video relative overflow-hidden rounded-t-lg">
                <Image
                  src={kit.images[0] || '/placeholder-kit.jpg'}
                  alt={kit.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <Badge className={`${getSkillLevelColor(kit.skillLevel)} font-semibold`}>
                    {kit.skillLevel}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4">
                  <div className="h-10 w-10 rounded-full bg-primary/90 flex items-center justify-center text-primary-foreground font-bold">
                    {getEcosystemIcon(kit.ecosystem)}
                  </div>
                </div>
              </div>
            </div>
            
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">{kit.title}</h3>
                  <p className="text-muted-foreground text-sm">{kit.summary}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-2" />
                    {kit.installTime} minutes setup
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="h-4 w-4 mr-2" />
                    {kit.skillLevel.toLowerCase()} level
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">What's Included:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li className="flex items-center">
                      <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                      {kit.includes.hub}
                    </li>
                    {kit.includes.devices.slice(0, 3).map((device: string, index: number) => (
                      <li key={index} className="flex items-center">
                        <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                        {device}
                      </li>
                    ))}
                    {kit.includes.devices.length > 3 && (
                      <li className="text-xs text-muted-foreground">
                        +{kit.includes.devices.length - 3} more devices
                      </li>
                    )}
                  </ul>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">
                    {formatPrice(kit.priceCad)}
                  </div>
                  <Button asChild>
                    <Link href={`/kits/${kit.slug}`}>
                      View Details
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Features Section */}
      <div className="mt-20 py-16 bg-muted/30 rounded-lg">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Our Starter Kits?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our carefully curated kits ensure everything works together seamlessly from day one.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Home className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Tested Compatibility</h3>
              <p className="text-muted-foreground">
                Every device in our kits is tested to work perfectly with your chosen ecosystem.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Wrench className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Setup</h3>
              <p className="text-muted-foreground">
                Step-by-step guides and QR codes make setup quick and frustration-free.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert Support</h3>
              <p className="text-muted-foreground">
                Get help when you need it with our included support and warranty coverage.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Need Something Custom?</h2>
        <p className="text-muted-foreground mb-6">
          Our experts can design a custom solution tailored to your specific needs and budget.
        </p>
        <Button asChild size="lg">
          <Link href="/consultation">
            Book a Consultation
            <ArrowRight className="h-5 w-5 ml-2" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
