import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer'

// Register fonts
Font.register({
  family: 'Inter',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2' },
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fAZ9hiJ-Ek-_EeA.woff2', fontWeight: 'bold' },
  ],
})

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontFamily: 'Inter',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#E5E7EB',
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 30,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 15,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tableHeader: {
    backgroundColor: '#F9FAFB',
    fontWeight: 'bold',
  },
  tableCell: {
    padding: 8,
    fontSize: 12,
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
  },
  productName: {
    width: '40%',
  },
  quantity: {
    width: '15%',
    textAlign: 'center',
  },
  price: {
    width: '20%',
    textAlign: 'right',
  },
  total: {
    width: '25%',
    textAlign: 'right',
  },
  totalRow: {
    backgroundColor: '#F3F4F6',
    fontWeight: 'bold',
  },
  priceSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    padding: 15,
    backgroundColor: '#F9FAFB',
    borderRadius: 5,
  },
  priceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  priceLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  priceValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 10,
    marginTop: 10,
  },
  notes: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 1.5,
    marginTop: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 10,
    color: '#9CA3AF',
  },
})

interface ProposalData {
  id: string
  title: string
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
  notes?: string
  createdAt: string
}

export const generateProposalPDF = (data: ProposalData) => {
  const totalProducts = data.bom.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const totalWithLabor = totalProducts + data.priceRange.labor

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>SmartHome Solutions</Text>
          <Text style={{ fontSize: 12, color: '#6B7280' }}>
            Proposal #{data.id.slice(-8)}
          </Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>{data.title}</Text>
        <Text style={styles.subtitle}>
          Custom Smart Home Solution Proposal
        </Text>

        {/* Bill of Materials */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bill of Materials</Text>
          <View style={styles.table}>
            {/* Table Header */}
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCell, styles.productName]}>Product</Text>
              <Text style={[styles.tableCell, styles.quantity]}>Qty</Text>
              <Text style={[styles.tableCell, styles.price]}>Unit Price</Text>
              <Text style={[styles.tableCell, styles.total]}>Total</Text>
            </View>

            {/* Table Rows */}
            {data.bom.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <View style={[styles.tableCell, styles.productName]}>
                  <Text style={{ fontWeight: 'bold', marginBottom: 2 }}>{item.name}</Text>
                  <Text style={{ fontSize: 10, color: '#6B7280' }}>{item.description}</Text>
                </View>
                <Text style={[styles.tableCell, styles.quantity]}>{item.quantity}</Text>
                <Text style={[styles.tableCell, styles.price]}>
                  ${item.price.toFixed(2)}
                </Text>
                <Text style={[styles.tableCell, styles.total]}>
                  ${(item.price * item.quantity).toFixed(2)}
                </Text>
              </View>
            ))}

            {/* Total Row */}
            <View style={[styles.tableRow, styles.totalRow]}>
              <Text style={[styles.tableCell, styles.productName]}>Subtotal</Text>
              <Text style={[styles.tableCell, styles.quantity]}></Text>
              <Text style={[styles.tableCell, styles.price]}></Text>
              <Text style={[styles.tableCell, styles.total]}>
                ${totalProducts.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        {/* Price Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pricing Summary</Text>
          <View style={styles.priceSummary}>
            <View style={styles.priceItem}>
              <Text style={styles.priceLabel}>Products Subtotal:</Text>
              <Text style={styles.priceValue}>${totalProducts.toFixed(2)}</Text>
            </View>
            {data.laborHoursEst > 0 && (
              <View style={styles.priceItem}>
                <Text style={styles.priceLabel}>Installation Labor ({data.laborHoursEst} hours @ $75/hr):</Text>
                <Text style={styles.priceValue}>${data.priceRange.labor.toFixed(2)}</Text>
              </View>
            )}
            <View style={[styles.priceItem, styles.totalPrice]}>
              <Text style={styles.priceLabel}>Total Estimated Cost:</Text>
              <Text style={styles.priceValue}>${totalWithLabor.toFixed(2)}</Text>
            </View>
            <View style={styles.priceItem}>
              <Text style={[styles.priceLabel, { fontSize: 12 }]}>
                Price Range: ${data.priceRange.min.toFixed(2)} - ${data.priceRange.max.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        {/* Installation Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Installation & Setup</Text>
          <Text style={styles.notes}>
            • All products will be tested for compatibility before shipping{'\n'}
            • Installation includes basic setup and configuration{'\n'}
            • Custom Home Assistant blueprints will be provided{'\n'}
            • 30-day support included with installation{'\n'}
            • 1-year warranty on all products{'\n'}
            • Professional installation available for additional fee
          </Text>
        </View>

        {/* Additional Notes */}
        {data.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Notes</Text>
            <Text style={styles.notes}>{data.notes}</Text>
          </View>
        )}

        {/* Footer */}
        <Text style={styles.footer}>
          This proposal is valid for 30 days from the date of issue. 
          For questions or to proceed with this proposal, contact us at support@smarthomesolutions.ca
        </Text>
      </Page>
    </Document>
  )
}
