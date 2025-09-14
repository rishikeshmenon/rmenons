'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
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
  Wrench,
  ShoppingCart,
  Heart,
  Share2
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface Kit {
  id: string
  slug: string
  title: string
  ecosystem: 'GOOGLE' | 'ALEXA'
  summary: string
  includes: {
    hub: string
    devices: string[]
    accessories: string[]
  }
  priceCad: number
  priceUsd: number
  skillLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  installTime: number
  images: string[]
  faq: any
}

export default function KitDetailPage() {
  const params = useParams()
  const [kit, setKit] = useState<Kit | null>(null)
  const [loading, setLoading] = useState(true)

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
        skillLevel: 'BEGINNER',
        installTime: 30,
        images: ['/kits/placeholder.svg'],
        faq: {}
      },
      {
        id: '2',
        slug: 'alexa-starter-kit',
        title: 'Alexa Smart Home Kit',
        ecosystem: 'ALEXA',
        summary: 'Complete Alexa-powered smart home setup with voice control and automation.',
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
        skillLevel: 'BEGINNER',
        installTime: 30,
        images: ['/kits/placeholder.svg'],
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
            '4x LIFX A19 Color Smart Bulbs',
            '2x Aqara Motion Sensors',
            '2x Aqara Door/Window Sensors',
            '1x Ecobee SmartThermostat',
            '1x Wyze Cam v3'
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
        images: ['/kits/placeholder.svg'],
        faq: {}
      }
    ]

    const foundKit = mockKits.find(k => k.slug === params.slug)
    setKit(foundKit || null)
    setLoading(false)
  }, [params.slug])

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded mb-4 w-1/3" />
          <div className="h-4 bg-muted rounded mb-8 w-1/2" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-96 bg-muted rounded" />
            <div className="space-y-4">
              <div className="h-6 bg-muted rounded" />
              <div className="h-4 bg-muted rounded" />
              <div className="h-4 bg-muted rounded" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!kit) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Kit Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The starter kit you're looking for doesn't exist.
          </p>
          <Button asChild>
            <Link href="/kits">
              <ArrowRight className="h-4 w-4 mr-2" />
              Back to Kits
            </Link>
          </Button>
        </div>
      </div>
    )
  }

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

  return (
    <div className="container mx-auto py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span>/</span>
        <Link href="/kits" className="hover:text-primary">Starter Kits</Link>
        <span>/</span>
        <span className="text-foreground">{kit.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-video relative overflow-hidden rounded-lg">
            <Image
              src={kit.images[0] || '/kits/placeholder.svg'}
              alt={kit.title}
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Badge className={`${getSkillLevelColor(kit.skillLevel)} font-semibold`}>
                {kit.skillLevel}
              </Badge>
              <Badge variant="outline" className="font-semibold">
                {kit.ecosystem}
              </Badge>
            </div>
            <h1 className="text-3xl font-bold mb-2">{kit.title}</h1>
            <p className="text-lg text-muted-foreground">{kit.summary}</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="h-4 w-4 mr-2" />
              {kit.installTime} minutes setup
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Users className="h-4 w-4 mr-2" />
              {kit.skillLevel.toLowerCase()} level
            </div>
          </div>

          <div className="text-3xl font-bold">
            {formatPrice(kit.priceCad)}
          </div>

          <div className="flex space-x-4">
            <Button size="lg" className="flex-1">
              <ShoppingCart className="h-5 w-5 mr-2" />
              Add to Cart
            </Button>
            <Button variant="outline" size="lg">
              <Heart className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mt-12">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="includes">What's Included</TabsTrigger>
            <TabsTrigger value="setup">Setup Guide</TabsTrigger>
            <TabsTrigger value="support">Support</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Kit Overview</CardTitle>
                <CardDescription>
                  Everything you need to get started with smart home automation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Perfect For</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      First-time smart home users
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      {kit.ecosystem} ecosystem integration
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Voice control and automation
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Easy setup and configuration
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Key Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <Home className="h-5 w-5 text-primary" />
                      <span>Complete home automation</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Shield className="h-5 w-5 text-primary" />
                      <span>Secure and reliable</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Zap className="h-5 w-5 text-primary" />
                      <span>Energy efficient</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Wrench className="h-5 w-5 text-primary" />
                      <span>Easy maintenance</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="includes" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>What's Included</CardTitle>
                <CardDescription>
                  Everything you need to get started
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Hub</h3>
                  <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>{kit.includes.hub}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Smart Devices</h3>
                  <div className="space-y-2">
                    {kit.includes.devices.map((device, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span>{device}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Accessories & Support</h3>
                  <div className="space-y-2">
                    {kit.includes.accessories.map((accessory, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span>{accessory}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="setup" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Setup Guide</CardTitle>
                <CardDescription>
                  Step-by-step instructions to get your kit up and running
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold">Unbox and Inventory</h4>
                      <p className="text-muted-foreground">Check that all items are included and in good condition.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold">Setup Hub</h4>
                      <p className="text-muted-foreground">Connect your {kit.includes.hub} to power and follow the setup wizard.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold">Add Devices</h4>
                      <p className="text-muted-foreground">Pair each smart device with your hub using the provided instructions.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                      4
                    </div>
                    <div>
                      <h4 className="font-semibold">Configure Automation</h4>
                      <p className="text-muted-foreground">Set up your first automations and test everything works correctly.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="support" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Support & Warranty</CardTitle>
                <CardDescription>
                  We're here to help you succeed
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Included Support</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Email support
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Video tutorials
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Setup guides
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Community forum
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Warranty</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        1 year hardware warranty
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Software updates
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Replacement parts
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Technical support
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <Button asChild>
                    <Link href="/consultation">
                      Get Expert Help
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
