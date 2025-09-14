'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  BookOpen, 
  Clock, 
  Star, 
  ArrowRight,
  Share2,
  Heart,
  Bookmark,
  User,
  Calendar,
  Tag,
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
  Eye
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
  sections: {
    title: string
    content: string
    subsections?: {
      title: string
      content: string
    }[]
  }[]
}

export default function GuideDetailPage() {
  const params = useParams()
  const [guide, setGuide] = useState<Guide | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // AI-generated guide content
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
        aiGenerated: true,
        sections: [
          {
            title: 'Introduction to Smart Homes',
            content: 'Smart homes use internet-connected devices to automate and control various aspects of your living space. These devices can be controlled remotely through smartphone apps, voice commands, or automated schedules.',
            subsections: [
              {
                title: 'What Makes a Home Smart?',
                content: 'A smart home typically includes devices that can communicate with each other and be controlled remotely. This includes smart lights, thermostats, security systems, and entertainment devices.'
              },
              {
                title: 'Benefits of Smart Home Technology',
                content: 'Smart homes offer convenience, energy efficiency, security, and accessibility. They can help reduce energy costs, provide peace of mind, and make daily tasks easier.'
              }
            ]
          },
          {
            title: 'Choosing Your Smart Home Ecosystem',
            content: 'The first step in setting up a smart home is choosing an ecosystem. The main options are Google Home, Amazon Alexa, and Apple HomeKit.',
            subsections: [
              {
                title: 'Google Home Ecosystem',
                content: 'Google Home offers excellent integration with Google services and provides natural language processing. It works well with Android devices and Google services.'
              },
              {
                title: 'Amazon Alexa Ecosystem',
                content: 'Alexa has the largest selection of compatible devices and skills. It offers great value and works with a wide range of third-party products.'
              },
              {
                title: 'Apple HomeKit Ecosystem',
                content: 'HomeKit focuses on privacy and security, with all data processed locally. It integrates seamlessly with Apple devices but has a smaller selection of compatible products.'
              }
            ]
          },
          {
            title: 'Essential Smart Home Devices',
            content: 'Start with these essential devices to build a solid foundation for your smart home.',
            subsections: [
              {
                title: 'Smart Hub or Assistant',
                content: 'A smart hub or assistant is the central control point for your smart home. Choose based on your preferred ecosystem.'
              },
              {
                title: 'Smart Lighting',
                content: 'Smart bulbs and switches are often the first devices people add. They provide immediate benefits and are relatively easy to install.'
              },
              {
                title: 'Smart Thermostat',
                content: 'A smart thermostat can significantly reduce energy costs by learning your schedule and optimizing temperature settings.'
              }
            ]
          },
          {
            title: 'Installation and Setup',
            content: 'Follow these steps to set up your smart home devices safely and efficiently.',
            subsections: [
              {
                title: 'Planning Your Setup',
                content: 'Before installing devices, plan your network coverage, device placement, and automation routines.'
              },
              {
                title: 'Network Requirements',
                content: 'Ensure you have a strong, reliable Wi-Fi network. Consider upgrading to a mesh system for better coverage.'
              },
              {
                title: 'Device Installation',
                content: 'Follow manufacturer instructions carefully. Start with simple devices and gradually add more complex ones.'
              }
            ]
          }
        ]
      }
    ]

    const foundGuide = aiGuides.find(g => g.id === params.id)
    setGuide(foundGuide || null)
    setLoading(false)
  }, [params.id])

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded mb-4 w-2/3" />
          <div className="h-4 bg-muted rounded mb-8 w-1/2" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-64 bg-muted rounded" />
              <div className="h-4 bg-muted rounded" />
              <div className="h-4 bg-muted rounded" />
              <div className="h-4 bg-muted rounded" />
            </div>
            <div className="space-y-4">
              <div className="h-32 bg-muted rounded" />
              <div className="h-32 bg-muted rounded" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!guide) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Guide Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The guide you're looking for doesn't exist.
          </p>
          <Button asChild>
            <Link href="/guides">
              <ArrowRight className="h-4 w-4 mr-2" />
              Back to Guides
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'BEGINNER': return 'bg-green-100 text-green-800'
      case 'INTERMEDIATE': return 'bg-yellow-100 text-yellow-800'
      case 'ADVANCED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Getting Started': return Home
      case 'Ecosystems': return Smartphone
      case 'Home Assistant': return Settings
      case 'Security': return Shield
      case 'Energy': return Zap
      case 'Protocols': return Wifi
      case 'Voice Control': return Volume2
      case 'Lighting': return Lightbulb
      default: return BookOpen
    }
  }

  const CategoryIcon = getCategoryIcon(guide.category)

  return (
    <div className="container mx-auto py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span>/</span>
        <Link href="/guides" className="hover:text-primary">Guides</Link>
        <span>/</span>
        <span className="text-foreground">{guide.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Badge className={`${getDifficultyColor(guide.difficulty)} font-semibold`}>
                {guide.difficulty}
              </Badge>
              <Badge variant="outline" className="font-semibold">
                <CategoryIcon className="h-3 w-3 mr-1" />
                {guide.category}
              </Badge>
              {guide.aiGenerated && (
                <Badge variant="secondary" className="font-semibold">
                  AI Generated
                </Badge>
              )}
            </div>
            <h1 className="text-4xl font-bold mb-4">{guide.title}</h1>
            <p className="text-xl text-muted-foreground mb-6">{guide.summary}</p>
            
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                {guide.author}
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                {new Date(guide.publishedAt).toLocaleDateString()}
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                {guide.readTime} min read
              </div>
              <div className="flex items-center">
                <Star className="h-4 w-4 mr-2" />
                4.8
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="aspect-video relative overflow-hidden rounded-lg">
            <Image
              src={guide.image || '/guides/placeholder.svg'}
              alt={guide.title}
              fill
              className="object-cover"
            />
          </div>

          {/* Content Sections */}
          <div className="prose prose-lg max-w-none">
            {guide.sections.map((section, index) => (
              <div key={index} className="mb-8">
                <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
                <p className="text-muted-foreground mb-4">{section.content}</p>
                
                {section.subsections && (
                  <div className="space-y-4">
                    {section.subsections.map((subsection, subIndex) => (
                      <div key={subIndex} className="pl-4 border-l-2 border-primary/20">
                        <h3 className="text-xl font-semibold mb-2">{subsection.title}</h3>
                        <p className="text-muted-foreground">{subsection.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Tags */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {guide.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-sm">
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full">
                <Heart className="h-4 w-4 mr-2" />
                Like Guide
              </Button>
              <Button variant="outline" className="w-full">
                <Bookmark className="h-4 w-4 mr-2" />
                Save for Later
              </Button>
              <Button variant="outline" className="w-full">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </CardContent>
          </Card>

          {/* Table of Contents */}
          <Card>
            <CardHeader>
              <CardTitle>Table of Contents</CardTitle>
            </CardHeader>
            <CardContent>
              <nav className="space-y-2">
                {guide.sections.map((section, index) => (
                  <a
                    key={index}
                    href={`#section-${index}`}
                    className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {index + 1}. {section.title}
                  </a>
                ))}
              </nav>
            </CardContent>
          </Card>

          {/* Related Guides */}
          <Card>
            <CardHeader>
              <CardTitle>Related Guides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Link href="/guides/2" className="block text-sm hover:text-primary transition-colors">
                  Google Home vs Alexa: Which Smart Assistant is Right for You?
                </Link>
                <Link href="/guides/3" className="block text-sm hover:text-primary transition-colors">
                  Home Assistant Advanced Automation: Creating Complex Scenarios
                </Link>
                <Link href="/guides/4" className="block text-sm hover:text-primary transition-colors">
                  Smart Security: Building a Comprehensive Home Security System
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
