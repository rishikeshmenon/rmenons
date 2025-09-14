import { NextRequest, NextResponse } from 'next/server'
import { openai } from '@/lib/openai'

export async function POST(request: NextRequest) {
  try {
    const { type, topic, context } = await request.json()

    if (!type || !topic) {
      return NextResponse.json(
        { error: 'Type and topic are required' },
        { status: 400 }
      )
    }

    let prompt = ''
    let systemPrompt = ''

    switch (type) {
      case 'guide':
        systemPrompt = `You are an expert smart home consultant and technical writer. Create comprehensive, accurate, and helpful guides about smart home technology. Focus on practical advice, current technology, and real-world applications.`
        prompt = `Create a detailed smart home guide about "${topic}". Include:
        - Introduction and overview
        - Step-by-step instructions
        - Common challenges and solutions
        - Best practices
        - Product recommendations
        - Safety considerations
        - Future trends
        
        Make it beginner-friendly but comprehensive. Use current technology and real products.`
        break

      case 'product_review':
        systemPrompt = `You are a smart home product expert and reviewer. Provide detailed, unbiased reviews of smart home products based on current market data and user experiences.`
        prompt = `Write a comprehensive product review for "${topic}". Include:
        - Product overview and specifications
        - Pros and cons
        - Performance analysis
        - Compatibility information
        - Value for money
        - User experience
        - Comparison with alternatives
        - Final recommendation`
        break

      case 'troubleshooting':
        systemPrompt = `You are a smart home technical support specialist. Help users solve common smart home problems with clear, step-by-step solutions.`
        prompt = `Create a troubleshooting guide for "${topic}". Include:
        - Problem identification
        - Step-by-step solutions
        - Common causes
        - Prevention tips
        - When to contact support
        - Alternative solutions`
        break

      case 'comparison':
        systemPrompt = `You are a smart home technology analyst. Provide detailed comparisons between smart home products, ecosystems, and technologies.`
        prompt = `Create a detailed comparison for "${topic}". Include:
        - Feature comparison
        - Pros and cons of each option
        - Use case recommendations
        - Price analysis
        - Compatibility considerations
        - Future-proofing
        - Final recommendation`
        break

      default:
        return NextResponse.json(
          { error: 'Invalid content type' },
          { status: 400 }
        )
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      max_tokens: 2000,
      temperature: 0.7,
    })

    const content = completion.choices[0]?.message?.content

    if (!content) {
      throw new Error('Failed to generate content')
    }

    return NextResponse.json({
      content,
      type,
      topic,
      generatedAt: new Date().toISOString(),
      model: 'gpt-4'
    })

  } catch (error) {
    console.error('AI content generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    )
  }
}
