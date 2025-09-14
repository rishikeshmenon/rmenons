import { openai } from './openai'

interface WebSearchResult {
  title: string
  url: string
  snippet: string
  publishedDate?: string
}

interface AISearchResponse {
  summary: string
  keyPoints: string[]
  sources: WebSearchResult[]
  recommendations: string[]
}

export class AIWebSearch {
  private async searchWeb(query: string): Promise<WebSearchResult[]> {
    // Mock web search results - in production, integrate with real search API
    const mockResults: WebSearchResult[] = [
      {
        title: `Latest ${query} Trends in 2024`,
        url: 'https://example.com/trends',
        snippet: `Discover the latest trends and innovations in ${query} for 2024`,
        publishedDate: '2024-01-15'
      },
      {
        title: `Best ${query} Products This Year`,
        url: 'https://example.com/products',
        snippet: `Comprehensive review of the top ${query} products available now`,
        publishedDate: '2024-01-10'
      },
      {
        title: `${query} Setup Guide for Beginners`,
        url: 'https://example.com/guide',
        snippet: `Step-by-step guide to getting started with ${query}`,
        publishedDate: '2024-01-08'
      }
    ]

    return mockResults
  }

  async searchAndAnalyze(query: string): Promise<AISearchResponse> {
    try {
      // Get web search results
      const searchResults = await this.searchWeb(query)

      // Create context for AI analysis
      const searchContext = searchResults.map(result => 
        `Title: ${result.title}\nSnippet: ${result.snippet}\nURL: ${result.url}`
      ).join('\n\n')

      const systemPrompt = `You are a smart home expert and content analyst. Analyze the provided web search results and create a comprehensive summary with key insights, trends, and recommendations. Focus on practical, actionable information for smart home enthusiasts.`

      const userPrompt = `Analyze these search results about "${query}" and provide:

1. A comprehensive summary of the current state and trends
2. Key points that users should know
3. Practical recommendations based on the findings
4. Any important considerations or warnings

Search Results:
${searchContext}

Format your response as JSON with the following structure:
{
  "summary": "Comprehensive summary of findings",
  "keyPoints": ["Point 1", "Point 2", "Point 3"],
  "recommendations": ["Recommendation 1", "Recommendation 2"],
  "sources": [list of source objects with title, url, snippet]
}`

      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 2000,
        temperature: 0.7,
      })

      const content = completion.choices[0]?.message?.content

      if (!content) {
        throw new Error('Failed to analyze search results')
      }

      let analysis
      try {
        analysis = JSON.parse(content)
      } catch (parseError) {
        // Fallback response
        analysis = {
          summary: `Based on current information about ${query}, here are the key insights and trends in the smart home industry.`,
          keyPoints: [
            'Technology is rapidly evolving',
            'Compatibility is crucial',
            'User experience is improving',
            'Security remains a priority'
          ],
          recommendations: [
            'Research compatibility before purchasing',
            'Start with a solid foundation',
            'Consider future expansion',
            'Prioritize security features'
          ],
          sources: searchResults
        }
      }

      return {
        summary: analysis.summary,
        keyPoints: analysis.keyPoints || [],
        sources: analysis.sources || searchResults,
        recommendations: analysis.recommendations || []
      }

    } catch (error) {
      console.error('AI web search error:', error)
      throw new Error('Failed to search and analyze content')
    }
  }

  async generateTrendingContent(): Promise<{
    topics: string[]
    summaries: Record<string, string>
  }> {
    const trendingTopics = [
      'Matter Protocol 2024',
      'AI in Smart Homes',
      'Energy Efficient Devices',
      'Voice Control Advances',
      'Smart Security Trends'
    ]

    const summaries: Record<string, string> = {}

    for (const topic of trendingTopics) {
      try {
        const analysis = await this.searchAndAnalyze(topic)
        summaries[topic] = analysis.summary
      } catch (error) {
        console.error(`Failed to analyze topic ${topic}:`, error)
        summaries[topic] = `Latest trends and developments in ${topic} for smart home enthusiasts.`
      }
    }

    return {
      topics: trendingTopics,
      summaries
    }
  }
}

export const aiWebSearch = new AIWebSearch()
