import { NextRequest, NextResponse } from 'next/server'
import { openai } from '@/lib/openai'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    if (!openai) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }

    const { query, preferences, budget, ecosystem } = await request.json()

    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      )
    }

    // Get products from database
    const products = await prisma.product.findMany({
      where: { published: true },
      include: { category: true }
    })

    // Create product context for AI
    const productContext = products.map(product => ({
      id: product.id,
      title: product.title,
      brand: product.brand,
      category: product.category.name,
      price: product.priceCad,
      features: {
        worksGoogle: product.worksGoogle,
        worksAlexa: product.worksAlexa,
        worksHa: product.worksHa,
        worksMatter: product.worksMatter,
        worksZigbee: product.worksZigbee,
        worksZwave: product.worksZwave,
        worksThread: product.worksThread,
        beginnerFriendly: product.beginnerFriendly
      },
      description: product.shortDesc
    }))

    const systemPrompt = `You are an expert smart home consultant. Analyze the user's query and recommend the best products from the available inventory. Consider compatibility, budget, user preferences, and ecosystem requirements.`

    const userPrompt = `User Query: "${query}"
    
    Preferences: ${preferences || 'Not specified'}
    Budget: ${budget || 'Not specified'}
    Ecosystem: ${ecosystem || 'Not specified'}
    
    Available Products:
    ${JSON.stringify(productContext, null, 2)}
    
    Please recommend 3-5 products that best match the user's needs. For each recommendation, provide:
    1. Product ID
    2. Why it's a good fit
    3. Key benefits
    4. Any considerations or requirements
    5. Compatibility notes
    
    Format your response as JSON with an array of recommendations.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 1500,
      temperature: 0.7,
    })

    const content = completion.choices[0]?.message?.content

    if (!content) {
      throw new Error('Failed to generate recommendations')
    }

    // Parse AI response and get full product details
    let recommendations
    try {
      recommendations = JSON.parse(content)
    } catch (parseError) {
      // Fallback: create recommendations based on query keywords
      const queryLower = query.toLowerCase()
      const filteredProducts = products.filter(product => 
        product.title.toLowerCase().includes(queryLower) ||
        product.brand.toLowerCase().includes(queryLower) ||
        product.shortDesc.toLowerCase().includes(queryLower)
      ).slice(0, 5)

      recommendations = filteredProducts.map(product => ({
        productId: product.id,
        title: product.title,
        brand: product.brand,
        price: product.priceCad,
        reason: `Matches your search for "${query}"`,
        benefits: product.shortDesc,
        considerations: product.requiresBridge.length > 0 ? 'Requires additional hub' : 'No additional requirements'
      }))
    }

    return NextResponse.json({
      recommendations,
      query,
      generatedAt: new Date().toISOString(),
      model: 'gpt-4'
    })

  } catch (error) {
    console.error('AI recommendations error:', error)
    return NextResponse.json(
      { error: 'Failed to generate recommendations' },
      { status: 500 }
    )
  }
}