// PDF Generator - Simplified for build compatibility
export interface ProposalData {
  id: string
  title: string
  bom: Array<{
    name: string
    description: string
    quantity: number
    price: number
  }>
  priceRange: {
    min: number
    max: number
    labor: number
  }
  timeline: {
    weeks: number
    description: string
  }
  notes?: string
  createdAt: string
}

export const generateProposalPDF = (data: ProposalData) => {
  // PDF generation temporarily disabled for build compatibility
  // This will be re-implemented with a proper PDF library
  return null
}