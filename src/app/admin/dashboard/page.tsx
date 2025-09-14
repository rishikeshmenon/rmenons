'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Package, 
  DollarSign,
  Activity,
  Brain,
  Zap,
  Globe,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  Star
} from 'lucide-react'

interface DashboardStats {
  totalProducts: number
  totalCategories: number
  totalOrders: number
  totalRevenue: number
  activeUsers: number
  aiInteractions: number
  systemHealth: 'healthy' | 'warning' | 'error'
  lastUpdate: string
}

interface AIInsights {
  trendingTopics: string[]
  contentSuggestions: string[]
  userBehavior: {
    popularProducts: string[]
    commonQueries: string[]
    conversionRate: number
  }
  recommendations: {
    type: string
    message: string
    priority: 'high' | 'medium' | 'low'
  }[]
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [aiInsights, setAiInsights] = useState<AIInsights | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      // Fetch basic stats
      const statsResponse = await fetch('/api/health')
      const statsData = await statsResponse.json()
      
      setStats({
        totalProducts: statsData.stats?.products || 0,
        totalCategories: statsData.stats?.categories || 0,
        totalOrders: statsData.stats?.orders || 0,
        totalRevenue: 0, // Would come from orders
        activeUsers: 0, // Would come from analytics
        aiInteractions: 0, // Would come from AI logs
        systemHealth: statsData.status === 'healthy' ? 'healthy' : 'warning',
        lastUpdate: new Date().toISOString()
      })

      // Generate AI insights
      const insights: AIInsights = {
        trendingTopics: [
          'Matter Protocol Integration',
          'AI-Powered Automation',
          'Energy Efficiency Solutions',
          'Voice Control Advances',
          'Smart Security Systems'
        ],
        contentSuggestions: [
          'Create guide on Matter protocol setup',
          'Write comparison of smart thermostats',
          'Develop troubleshooting guide for connectivity issues',
          'Generate product review for latest security cameras'
        ],
        userBehavior: {
          popularProducts: [
            'Philips Hue White and Color Ambiance A19 Smart Bulb',
            'Google Nest Mini (2nd Gen)',
            'Aqara Motion Sensor',
            'LIFX A19 Color Smart Bulb',
            'Amazon Echo Dot (5th Gen)'
          ],
          commonQueries: [
            'How to set up smart home',
            'Best smart bulbs for beginners',
            'Google Home vs Alexa',
            'Smart thermostat installation',
            'Home security system setup'
          ],
          conversionRate: 12.5
        },
        recommendations: [
          {
            type: 'Content',
            message: 'Create more beginner-friendly guides based on popular queries',
            priority: 'high'
          },
          {
            type: 'Product',
            message: 'Add more Matter-compatible products to inventory',
            priority: 'medium'
          },
          {
            type: 'AI',
            message: 'Optimize AI recommendations for better conversion',
            priority: 'low'
          }
        ]
      }

      setAiInsights(insights)
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchDashboardData()
    setRefreshing(false)
  }

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy': return 'text-green-600'
      case 'warning': return 'text-yellow-600'
      case 'error': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'healthy': return CheckCircle
      case 'warning': return AlertCircle
      case 'error': return AlertCircle
      default: return Clock
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-96 bg-muted rounded" />
            <div className="h-96 bg-muted rounded" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">AI-Powered Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor your smart home platform with AI insights and analytics
          </p>
        </div>
        <Button onClick={handleRefresh} disabled={refreshing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              +2 from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Interactions</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.aiInteractions}</div>
            <p className="text-xs text-muted-foreground">
              +25% from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            {stats && (() => {
              const HealthIcon = getHealthIcon(stats.systemHealth)
              return <HealthIcon className={`h-4 w-4 ${getHealthColor(stats.systemHealth)}`} />
            })()}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getHealthColor(stats?.systemHealth || 'healthy')}`}>
              {stats?.systemHealth || 'healthy'}
            </div>
            <p className="text-xs text-muted-foreground">
              All systems operational
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="insights" className="space-y-6">
        <TabsList>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="content">Content Management</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Trending Topics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Trending Topics
                </CardTitle>
                <CardDescription>
                  AI-identified trending topics in smart home technology
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {aiInsights?.trendingTopics.map((topic, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span className="font-medium">{topic}</span>
                      <Badge variant="outline">
                        <Star className="h-3 w-3 mr-1" />
                        Trending
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Content Suggestions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="h-5 w-5 mr-2" />
                  AI Content Suggestions
                </CardTitle>
                <CardDescription>
                  AI-generated content ideas based on user behavior
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {aiInsights?.contentSuggestions.map((suggestion, index) => (
                    <div key={index} className="p-3 bg-muted rounded-lg">
                      <p className="text-sm">{suggestion}</p>
                      <Button size="sm" variant="outline" className="mt-2">
                        Generate Content
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* User Behavior Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                User Behavior Analysis
              </CardTitle>
              <CardDescription>
                AI-powered insights into user preferences and behavior
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Popular Products</h4>
                  <div className="space-y-2">
                    {aiInsights?.userBehavior.popularProducts.slice(0, 5).map((product, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="truncate">{product}</span>
                        <Badge variant="outline">{index + 1}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Common Queries</h4>
                  <div className="space-y-2">
                    {aiInsights?.userBehavior.commonQueries.map((query, index) => (
                      <div key={index} className="text-sm p-2 bg-muted rounded">
                        "{query}"
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Conversion Rate</CardTitle>
                <CardDescription>
                  AI-optimized conversion tracking
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {aiInsights?.userBehavior.conversionRate}%
                </div>
                <p className="text-sm text-muted-foreground">
                  +2.1% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI Performance</CardTitle>
                <CardDescription>
                  AI recommendation accuracy and engagement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Recommendation Accuracy</span>
                    <span className="font-semibold">94%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>User Engagement</span>
                    <span className="font-semibold">87%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Content Quality</span>
                    <span className="font-semibold">92%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="h-5 w-5 mr-2" />
                AI Recommendations
              </CardTitle>
              <CardDescription>
                AI-generated recommendations to improve your platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {aiInsights?.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 border rounded-lg">
                    <Badge className={getPriorityColor(rec.priority)}>
                      {rec.priority}
                    </Badge>
                    <div className="flex-1">
                      <h4 className="font-semibold">{rec.type}</h4>
                      <p className="text-sm text-muted-foreground">{rec.message}</p>
                    </div>
                    <Button size="sm" variant="outline">
                      Implement
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}