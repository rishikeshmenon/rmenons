'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Bot, 
  User, 
  Send, 
  ShoppingCart, 
  Lightbulb,
  Loader2,
  X
} from 'lucide-react'

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
  recommendations?: {
    products: Array<{
      id: string
      name: string
      brand: string
      description: string
      price: number
      compatibility: Record<string, boolean>
      beginnerFriendly: boolean
      images: string[]
    }>
    reasoning: string
    requiredBridges: string[]
    estimatedCost: number
    skillLevel: string
    setupTime: string
  }
}

interface AIChatProps {
  isOpen: boolean
  onClose: () => void
  context?: {
    ecosystem?: string
    budget?: string
    homeSize?: string
    rooms?: string[]
  }
}

export function AIChat({ isOpen, onClose, context }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hi! I'm your smart home assistant. I can help you find the perfect products for your home automation needs. What would you like to automate?",
      timestamp: new Date(),
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/ai/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: input,
          ...context,
        }),
      })

      const data = await response.json()
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: data.recommendations?.reasoning || 'I found some great products for you!',
        timestamp: new Date(),
        recommendations: data.recommendations,
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Failed to get AI response:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
    }).format(price / 100)
  }

  const getCompatibilityBadges = (compatibility: Record<string, boolean>) => {
    const badges = []
    if (compatibility.google) badges.push({ label: 'Google', variant: 'default' as const })
    if (compatibility.alexa) badges.push({ label: 'Alexa', variant: 'secondary' as const })
    if (compatibility.ha) badges.push({ label: 'Home Assistant', variant: 'outline' as const })
    if (compatibility.matter) badges.push({ label: 'Matter', variant: 'destructive' as const })
    return badges
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl h-[80vh] flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center">
            <Bot className="h-5 w-5 mr-2" />
            Smart Home Assistant
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.type === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {message.type === 'assistant' && (
                        <Bot className="h-4 w-4 mt-1 flex-shrink-0" />
                      )}
                      {message.type === 'user' && (
                        <User className="h-4 w-4 mt-1 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm">{message.content}</p>
                        
                        {/* Recommendations */}
                        {message.recommendations && (
                          <div className="mt-4 space-y-4">
                            {/* Summary */}
                            <div className="bg-background/50 rounded-lg p-3">
                              <div className="flex items-center mb-2">
                                <Lightbulb className="h-4 w-4 mr-2" />
                                <span className="font-medium text-sm">Recommendation Summary</span>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                                <div>Estimated Cost: {formatPrice(message.recommendations.estimatedCost)}</div>
                                <div>Skill Level: {message.recommendations.skillLevel}</div>
                                <div>Setup Time: {message.recommendations.setupTime}</div>
                                <div>Products: {message.recommendations.products.length}</div>
                              </div>
                            </div>

                            {/* Products */}
                            {message.recommendations.products.length > 0 && (
                              <div className="space-y-2">
                                <h4 className="font-medium text-sm">Recommended Products:</h4>
                                {message.recommendations.products.slice(0, 3).map((product) => (
                                  <div key={product.id} className="bg-background/50 rounded-lg p-3">
                                    <div className="flex items-start justify-between">
                                      <div className="flex-1">
                                        <h5 className="font-medium text-sm">{product.name}</h5>
                                        <p className="text-xs text-muted-foreground mb-2">
                                          {product.brand} • {product.description}
                                        </p>
                                        <div className="flex flex-wrap gap-1 mb-2">
                                          {getCompatibilityBadges(product.compatibility).map((badge, index) => (
                                            <Badge key={index} variant={badge.variant} className="text-xs">
                                              {badge.label}
                                            </Badge>
                                          ))}
                                          {product.beginnerFriendly && (
                                            <Badge variant="outline" className="text-xs">
                                              Beginner Friendly
                                            </Badge>
                                          )}
                                        </div>
                                      </div>
                                      <div className="text-right ml-4">
                                        <div className="font-medium text-sm">
                                          {formatPrice(product.price)}
                                        </div>
                                        <Button size="sm" className="mt-2">
                                          <ShoppingCart className="h-3 w-3 mr-1" />
                                          Add
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                                {message.recommendations.products.length > 3 && (
                                  <p className="text-xs text-muted-foreground text-center">
                                    +{message.recommendations.products.length - 3} more products
                                  </p>
                                )}
                              </div>
                            )}

                            {/* Required Bridges */}
                            {message.recommendations.requiredBridges.length > 0 && (
                              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                                <h4 className="font-medium text-sm text-amber-800 mb-1">
                                  Required Bridges/Hubs:
                                </h4>
                                <p className="text-xs text-amber-700">
                                  {message.recommendations.requiredBridges.join(', ')}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <Bot className="h-4 w-4" />
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          
          <div className="border-t p-4">
            <div className="flex space-x-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about smart home products..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button onClick={handleSend} disabled={!input.trim() || isLoading}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
