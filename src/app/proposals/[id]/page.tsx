'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { 
  Download, 
  ShoppingCart, 
  Calendar, 
  DollarSign, 
  Package, 
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

interface Proposal {
  id: string
  status: 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REJECTED'
  bom: Array<{
    id: string
    name: string
    description: string
    quantity: number
    price: number
    category: string
  }>
  laborHoursEst: number
  priceRange: {
    min: number
    max: number
    labor: number
  }
  pdfUrl?: string
  createdAt: string
  updatedAt: string
  booking: {
    id: string
    slotStart: string
    slotEnd: string
    status: string
  }
}

export default function ProposalPage() {
  const params = useParams()
  const [proposal, setProposal] = useState<Proposal | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProposal = async () => {
      try {
        const response = await fetch(`/api/proposals/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setProposal(data.proposal)
        }
      } catch (error) {
        console.error('Failed to fetch proposal:', error)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchProposal()
    }
  }, [params.id])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
    }).format(price)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT': return 'bg-yellow-100 text-yellow-800'
      case 'SENT': return 'bg-blue-100 text-blue-800'
      case 'ACCEPTED': return 'bg-green-100 text-green-800'
      case 'REJECTED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleDownloadPDF = async () => {
    try {
      const response = await fetch(`/api/proposals/${params.id}/pdf`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `proposal-${proposal?.id.slice(-8)}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Failed to download PDF:', error)
    }
  }

  const handleAddToCart = async () => {
    try {
      const response = await fetch('/api/cart/add-proposal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proposalId: proposal?.id }),
      })
      
      if (response.ok) {
        // Redirect to cart or show success message
        window.location.href = '/cart'
      }
    } catch (error) {
      console.error('Failed to add to cart:', error)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="h-4 bg-muted rounded w-1/2" />
          <div className="h-64 bg-muted rounded" />
        </div>
      </div>
    )
  }

  if (!proposal) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Proposal Not Found</h1>
          <p className="text-muted-foreground">
            The proposal you're looking for doesn't exist or you don't have access to it.
          </p>
        </div>
      </div>
    )
  }

  const totalProducts = proposal.bom.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const totalWithLabor = totalProducts + proposal.priceRange.labor

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Custom Smart Home Proposal</h1>
            <p className="text-muted-foreground">
              Proposal #{proposal.id.slice(-8)} • Created {new Date(proposal.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={getStatusColor(proposal.status)}>
              {proposal.status}
            </Badge>
            <Button variant="outline" onClick={handleDownloadPDF}>
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>

        {/* Status Alert */}
        {proposal.status === 'DRAFT' && (
          <Card className="mb-6 border-yellow-200 bg-yellow-50">
            <CardContent className="pt-6">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                <p className="text-yellow-800">
                  This is a draft proposal. Please review and contact us if you have any questions.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Bill of Materials */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Bill of Materials
            </CardTitle>
            <CardDescription>
              Complete list of products recommended for your smart home setup
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead className="w-20">Qty</TableHead>
                  <TableHead className="w-24 text-right">Unit Price</TableHead>
                  <TableHead className="w-24 text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {proposal.bom.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-muted-foreground">{item.description}</div>
                        <Badge variant="outline" className="mt-1 text-xs">
                          {item.category}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell className="text-right">{formatPrice(item.price)}</TableCell>
                    <TableCell className="text-right font-medium">
                      {formatPrice(item.price * item.quantity)}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-muted/50">
                  <TableCell colSpan={3} className="font-medium">Subtotal</TableCell>
                  <TableCell className="text-right font-bold">{formatPrice(totalProducts)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Pricing Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              Pricing Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Products Subtotal:</span>
                <span className="font-medium">{formatPrice(totalProducts)}</span>
              </div>
              {proposal.laborHoursEst > 0 && (
                <div className="flex justify-between items-center">
                  <span>Installation Labor ({proposal.laborHoursEst} hours @ $75/hr):</span>
                  <span className="font-medium">{formatPrice(proposal.priceRange.labor)}</span>
                </div>
              )}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total Estimated Cost:</span>
                  <span>{formatPrice(totalWithLabor)}</span>
                </div>
                <div className="text-sm text-muted-foreground mt-2">
                  Price Range: {formatPrice(proposal.priceRange.min)} - {formatPrice(proposal.priceRange.max)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Installation Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Installation & Setup
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                <div>
                  <div className="font-medium">Compatibility Testing</div>
                  <div className="text-sm text-muted-foreground">
                    All products will be tested for compatibility before shipping
                  </div>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                <div>
                  <div className="font-medium">Basic Setup & Configuration</div>
                  <div className="text-sm text-muted-foreground">
                    Installation includes basic setup and configuration
                  </div>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                <div>
                  <div className="font-medium">Custom Home Assistant Blueprints</div>
                  <div className="text-sm text-muted-foreground">
                    Personalized automation blueprints will be provided
                  </div>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                <div>
                  <div className="font-medium">Support & Warranty</div>
                  <div className="text-sm text-muted-foreground">
                    30-day support included, 1-year warranty on all products
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button size="lg" onClick={handleAddToCart} className="flex-1">
            <ShoppingCart className="h-5 w-5 mr-2" />
            Add All to Cart
          </Button>
          <Button variant="outline" size="lg" asChild>
            <a href="/consultation">
              <Calendar className="h-5 w-5 mr-2" />
              Schedule Follow-up
            </a>
          </Button>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            This proposal is valid for 30 days from the date of issue. 
            For questions or to proceed with this proposal, contact us at support@smarthomesolutions.ca
          </p>
        </div>
      </div>
    </div>
  )
}
