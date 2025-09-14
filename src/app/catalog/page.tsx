'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Star,
  ShoppingCart,
  Heart,
  Eye
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface Product {
  id: string
  sku: string
  title: string
  brand: string
  category: string
  shortDesc: string
  priceCad: number
  priceUsd: number
  stock: number
  images: string[]
  compatibility: {
    google: boolean
    alexa: boolean
    ha: boolean
    matter: boolean
    zigbee: boolean
    zwave: boolean
    thread: boolean
  }
  beginnerFriendly: boolean
  roomTags: string[]
}

interface CatalogResponse {
  products: Product[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    category: 'all',
    priceMin: '',
    priceMax: '',
    protocol: 'all',
    works: 'all',
    room: 'all',
    beginner: '',
    sort: 'created_at'
  })
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  })
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const fetchProducts = async () => {
    setLoading(true)
    try {
      // Convert "all" values to empty strings for API
      const apiFilters = Object.fromEntries(
        Object.entries(filters).map(([key, value]) => [
          key, 
          value === 'all' ? '' : value
        ])
      )
      
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...apiFilters,
        q: searchQuery,
      })

      const response = await fetch(`/api/catalog?${params}`)
      const data: CatalogResponse = await response.json()
      
      setProducts(data.products)
      setPagination(data.pagination)
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [filters, pagination.page, searchQuery])

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPagination(prev => ({ ...prev, page: 1 }))
    fetchProducts()
  }

  const formatPrice = (priceCents: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
    }).format(priceCents / 100)
  }

  const getCompatibilityBadges = (compatibility: Product['compatibility']) => {
    const badges = []
    if (compatibility.google) badges.push({ label: 'Google', variant: 'default' as const })
    if (compatibility.alexa) badges.push({ label: 'Alexa', variant: 'secondary' as const })
    if (compatibility.ha) badges.push({ label: 'Home Assistant', variant: 'outline' as const })
    if (compatibility.matter) badges.push({ label: 'Matter', variant: 'destructive' as const })
    if (compatibility.zigbee) badges.push({ label: 'Zigbee', variant: 'outline' as const })
    if (compatibility.zwave) badges.push({ label: 'Z-Wave', variant: 'outline' as const })
    if (compatibility.thread) badges.push({ label: 'Thread', variant: 'outline' as const })
    return badges
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Smart Home Products</h1>
        <p className="text-muted-foreground">
          Discover our curated collection of smart home devices with advanced compatibility checking.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="lg:w-1/4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Search */}
              <form onSubmit={handleSearch} className="space-y-2">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button type="submit" className="w-full">
                  Search
                </Button>
              </form>

              {/* Category */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="lighting">Smart Lighting</SelectItem>
                    <SelectItem value="security">Security</SelectItem>
                    <SelectItem value="climate">Climate Control</SelectItem>
                    <SelectItem value="entertainment">Entertainment</SelectItem>
                    <SelectItem value="sensors">Sensors</SelectItem>
                    <SelectItem value="hubs">Hubs & Bridges</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Price Range</label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Min"
                    type="number"
                    value={filters.priceMin}
                    onChange={(e) => handleFilterChange('priceMin', e.target.value)}
                  />
                  <Input
                    placeholder="Max"
                    type="number"
                    value={filters.priceMax}
                    onChange={(e) => handleFilterChange('priceMax', e.target.value)}
                  />
                </div>
              </div>

              {/* Protocol */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Protocol</label>
                <Select value={filters.protocol} onValueChange={(value) => handleFilterChange('protocol', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Protocols" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Protocols</SelectItem>
                    <SelectItem value="wifi">Wi-Fi</SelectItem>
                    <SelectItem value="zigbee">Zigbee</SelectItem>
                    <SelectItem value="zwave">Z-Wave</SelectItem>
                    <SelectItem value="thread">Thread</SelectItem>
                    <SelectItem value="bluetooth">Bluetooth</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Ecosystem Compatibility */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Works With</label>
                <Select value={filters.works} onValueChange={(value) => handleFilterChange('works', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Ecosystems" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Ecosystems</SelectItem>
                    <SelectItem value="google">Google Home</SelectItem>
                    <SelectItem value="alexa">Alexa</SelectItem>
                    <SelectItem value="ha">Home Assistant</SelectItem>
                    <SelectItem value="matter">Matter</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Room */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Room</label>
                <Select value={filters.room} onValueChange={(value) => handleFilterChange('room', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Rooms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Rooms</SelectItem>
                    <SelectItem value="living-room">Living Room</SelectItem>
                    <SelectItem value="bedroom">Bedroom</SelectItem>
                    <SelectItem value="kitchen">Kitchen</SelectItem>
                    <SelectItem value="bathroom">Bathroom</SelectItem>
                    <SelectItem value="garage">Garage</SelectItem>
                    <SelectItem value="outdoor">Outdoor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Beginner Friendly */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="beginner"
                  checked={filters.beginner === 'true'}
                  onCheckedChange={(checked) => 
                    handleFilterChange('beginner', checked ? 'true' : '')
                  }
                />
                <label htmlFor="beginner" className="text-sm font-medium">
                  Beginner Friendly
                </label>
              </div>

              {/* Sort */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Sort By</label>
                <Select value={filters.sort} onValueChange={(value) => handleFilterChange('sort', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="created_at">Newest First</SelectItem>
                    <SelectItem value="price_asc">Price: Low to High</SelectItem>
                    <SelectItem value="price_desc">Price: High to Low</SelectItem>
                    <SelectItem value="name_asc">Name: A to Z</SelectItem>
                    <SelectItem value="name_desc">Name: Z to A</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Products Grid */}
        <div className="lg:w-3/4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <p className="text-sm text-muted-foreground">
                {pagination.total} products found
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-muted rounded-t-lg" />
                  <CardContent className="p-4">
                    <div className="h-4 bg-muted rounded mb-2" />
                    <div className="h-3 bg-muted rounded mb-4" />
                    <div className="h-6 bg-muted rounded" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No products found matching your criteria.</p>
            </div>
          ) : (
            <>
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {products.map((product) => (
                  <Card key={product.id} className="group hover:shadow-lg transition-all duration-300">
                    <div className="relative">
                      <div className="aspect-square relative overflow-hidden rounded-t-lg">
                        <Image
                          src={product.images[0] || '/placeholder-product.jpg'}
                          alt={product.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2 right-2 flex space-x-1">
                          <Button size="icon" variant="secondary" className="h-8 w-8">
                            <Heart className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="secondary" className="h-8 w-8">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                        {product.beginnerFriendly && (
                          <Badge className="absolute top-2 left-2" variant="secondary">
                            Beginner Friendly
                          </Badge>
                        )}
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs">
                            {product.brand}
                          </Badge>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm ml-1">4.5</span>
                          </div>
                        </div>
                        <h3 className="font-semibold line-clamp-2">{product.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {product.shortDesc}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {getCompatibilityBadges(product.compatibility).slice(0, 3).map((badge, index) => (
                            <Badge key={index} variant={badge.variant} className="text-xs">
                              {badge.label}
                            </Badge>
                          ))}
                          {getCompatibilityBadges(product.compatibility).length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{getCompatibilityBadges(product.compatibility).length - 3}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-lg font-bold">
                            {formatPrice(product.priceCad)}
                          </div>
                          <Button size="sm">
                            <ShoppingCart className="h-4 w-4 mr-1" />
                            Add to Cart
                          </Button>
                        </div>
                        {product.stock < 10 && product.stock > 0 && (
                          <p className="text-xs text-orange-600">
                            Only {product.stock} left in stock
                          </p>
                        )}
                        {product.stock === 0 && (
                          <p className="text-xs text-red-600">
                            Out of stock
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex justify-center mt-8">
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      disabled={pagination.page === 1}
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                    >
                      Previous
                    </Button>
                    {[...Array(pagination.pages)].map((_, i) => (
                      <Button
                        key={i + 1}
                        variant={pagination.page === i + 1 ? 'default' : 'outline'}
                        onClick={() => setPagination(prev => ({ ...prev, page: i + 1 }))}
                      >
                        {i + 1}
                      </Button>
                    ))}
                    <Button
                      variant="outline"
                      disabled={pagination.page === pagination.pages}
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
