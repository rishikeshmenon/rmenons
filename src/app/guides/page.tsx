'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Search, 
  BookOpen, 
  Lightbulb, 
  Settings, 
  Shield, 
  Zap,
  Home,
  Smartphone,
  Wifi,
  Camera,
  Thermometer,
  Lock,
  Volume2,
  Eye,
  Clock,
  Star,
  ArrowRight,
  ExternalLink
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface Guide {
  id: string
  title: string
  summary: string
  content: string
  category: string
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  readTime: number
  tags: string[]
  image: string
  author: string
  publishedAt: string
  aiGenerated: boolean
}

export default function GuidesPage() {
  const [guides, setGuides] = useState<Guide[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    // AI-generated guides based on current smart home trends
    const aiGuides: Guide[] = [
      {
        id: '1',
        title: 'Complete Smart Home Setup Guide for Beginners',
        summary: 'Everything you need to know to transform your home into a smart home, from choosing the right ecosystem to setting up your first devices.',
        content: 'This comprehensive guide covers the fundamentals of smart home automation...',
        category: 'Getting Started',
        difficulty: 'BEGINNER',
        readTime: 15,
        tags: ['setup', 'beginners', 'ecosystem', 'planning'],
        image: '/guides/smart-home-setup.jpg',
        author: 'AI Assistant',
        publishedAt: '2024-01-15',
        aiGenerated: true
      },
      {
        id: '2',
        title: 'Google Home vs Alexa: Which Smart Assistant is Right for You?',
        summary: 'A detailed comparison of Google Home and Amazon Alexa ecosystems to help you choose the best smart assistant for your needs.',
        content: 'When choosing between Google Home and Alexa, consider factors like...',
        category: 'Ecosystems',
        difficulty: 'BEGINNER',
        readTime: 12,
        tags: ['google', 'alexa', 'comparison', 'assistant'],
        image: '/guides/google-vs-alexa.jpg',
        author: 'AI Assistant',
        publishedAt: '2024-01-14',
        aiGenerated: true
      },
      {
        id: '3',
        title: 'Home Assistant Advanced Automation: Creating Complex Scenarios',
        summary: 'Learn how to create sophisticated automations in Home Assistant using YAML, templates, and advanced triggers.',
        content: 'Home Assistant offers powerful automation capabilities that go beyond...',
        category: 'Home Assistant',
        difficulty: 'ADVANCED',
        readTime: 25,
        tags: ['home-assistant', 'automation', 'yaml', 'advanced'],
        image: '/guides/ha-automation.jpg',
        author: 'AI Assistant',
        publishedAt: '2024-01-13',
        aiGenerated: true
      },
      {
        id: '4',
        title: 'Smart Security: Building a Comprehensive Home Security System',
        summary: 'Design and implement a complete smart security system with cameras, sensors, and monitoring solutions.',
        content: 'A robust smart security system combines multiple layers of protection...',
        category: 'Security',
        difficulty: 'INTERMEDIATE',
        readTime: 20,
        tags: ['security', 'cameras', 'sensors', 'monitoring'],
        image: '/guides/smart-security.jpg',
        author: 'AI Assistant',
        publishedAt: '2024-01-12',
        aiGenerated: true
      },
      {
        id: '5',
        title: 'Energy Efficiency with Smart Home Devices',
        summary: 'Maximize energy savings and reduce your carbon footprint with smart thermostats, lighting, and power management.',
        content: 'Smart home devices can significantly reduce your energy consumption...',
        category: 'Energy',
        difficulty: 'INTERMEDIATE',
        readTime: 18,
        tags: ['energy', 'efficiency', 'thermostat', 'lighting'],
        image: '/guides/energy-efficiency.jpg',
        author: 'AI Assistant',
        publishedAt: '2024-01-11',
        aiGenerated: true
      },
      {
        id: '6',
        title: 'Matter Protocol: The Future of Smart Home Interoperability',
        summary: 'Understanding Matter protocol and how it will revolutionize smart home device compatibility and setup.',
        content: 'Matter is a new connectivity standard that promises to solve...',
        category: 'Protocols',
        difficulty: 'INTERMEDIATE',
        readTime: 16,
        tags: ['matter', 'protocol', 'interoperability', 'future'],
        image: '/guides/matter-protocol.jpg',
        author: 'AI Assistant',
        publishedAt: '2024-01-10',
        aiGenerated: true
      },
      {
        id: '7',
        title: 'Voice Control Mastery: Advanced Commands and Routines',
        summary: 'Master voice control with advanced commands, custom routines, and integration techniques for Google and Alexa.',
        content: 'Voice control goes beyond simple on/off commands. Learn how to...',
        category: 'Voice Control',
        difficulty: 'INTERMEDIATE',
        readTime: 14,
        tags: ['voice', 'commands', 'routines', 'integration'],
        image: '/guides/voice-control.jpg',
        author: 'AI Assistant',
        publishedAt: '2024-01-09',
        aiGenerated: true
      },
      {
        id: '8',
        title: 'Smart Lighting Design: Creating the Perfect Ambiance',
        summary: 'Design a smart lighting system that enhances your home\'s atmosphere with color, brightness, and automation.',
        content: 'Smart lighting is about more than just convenience. It\'s about creating...',
        category: 'Lighting',
        difficulty: 'BEGINNER',
        readTime: 13,
        tags: ['lighting', 'design', 'ambiance', 'color'],
        image: '/guides/smart-lighting.jpg',
        author: 'AI Assistant',
        publishedAt: '2024-01-08',
        aiGenerated: true
      }
    ]

    setGuides(aiGuides)
    setLoading(false)
  }, [])

  const categories = [
    { id: 'all', name: 'All Guides', icon: BookOpen },
    { id: 'Getting Started', name: 'Getting Started', icon: Home },
    { id: 'Ecosystems', name: 'Ecosystems', icon: Smartphone },
    { id: 'Home Assistant', name: 'Home Assistant', icon: Settings },
    { id: 'Security', name: 'Security', icon: Shield },
    { id: 'Energy', name: 'Energy', icon: Zap },
    { id: 'Protocols', name: 'Protocols', icon: Wifi },
    { id: 'Voice Control', name: 'Voice Control', icon: Volume2 },
    { id: 'Lighting', name: 'Lighting', icon: Lightbulb }
  ]

  const filteredGuides = guides.filter(guide => {
    const matchesSearch = guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         guide.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         guide.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || guide.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'BEGINNER': return 'bg-green-100 text-green-800'
      case 'INTERMEDIATE': return 'bg-yellow-100 text-yellow-800'
      case 'ADVANCED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryIcon = (category: string) => {
    const categoryData = categories.find(c => c.id === category)
    return categoryData?.icon || BookOpen
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
        <h1 className="text-3xl font-bold mb-2">Smart Home Guides</h1>
        <p className="text-muted-foreground">
          AI-powered guides and tutorials to help you master smart home automation
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search guides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-5 lg:grid-cols-9">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <TabsTrigger key={category.id} value={category.id} className="flex items-center space-x-2">
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{category.name}</span>
                </TabsTrigger>
              )
            })}
          </TabsList>
        </Tabs>
      </div>

      {/* Guides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGuides.map((guide) => {
          const CategoryIcon = getCategoryIcon(guide.category)
          return (
            <Card key={guide.id} className="group hover:shadow-lg transition-all duration-300">
              <div className="relative">
                <div className="aspect-video relative overflow-hidden rounded-t-lg">
                  <Image
                    src={guide.image || '/guides/placeholder.svg'}
                    alt={guide.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className={`${getDifficultyColor(guide.difficulty)} font-semibold`}>
                      {guide.difficulty}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary" className="font-semibold">
                      <CategoryIcon className="h-3 w-3 mr-1" />
                      {guide.category}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2 line-clamp-2">{guide.title}</h3>
                    <p className="text-muted-foreground text-sm line-clamp-3">{guide.summary}</p>
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {guide.readTime} min read
                      </div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 mr-1" />
                        4.8
                      </div>
                    </div>
                    {guide.aiGenerated && (
                      <Badge variant="outline" className="text-xs">
                        AI Generated
                      </Badge>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {guide.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {guide.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{guide.tags.length - 3}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      By {guide.author}
                    </div>
                    <Button asChild size="sm">
                      <Link href={`/guides/${guide.id}`}>
                        Read More
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredGuides.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No guides found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search or filter criteria
          </p>
          <Button onClick={() => { setSearchQuery(''); setSelectedCategory('all') }}>
            Clear Filters
          </Button>
        </div>
      )}

      {/* AI-Powered Features */}
      <div className="mt-16 py-16 bg-muted/30 rounded-lg">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">AI-Powered Learning</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our guides are generated using AI and updated with the latest smart home trends and technologies.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Lightbulb className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-Generated Content</h3>
              <p className="text-muted-foreground">
                Fresh, relevant content generated using the latest AI technology and current market data.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Settings className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Personalized Learning</h3>
              <p className="text-muted-foreground">
                Get recommendations based on your skill level, interests, and smart home setup.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <ExternalLink className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-time Updates</h3>
              <p className="text-muted-foreground">
                Content is continuously updated with the latest products, protocols, and best practices.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
