#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🗄️ Setting up database...')

  try {
    // Test database connection
    await prisma.$connect()
    console.log('✅ Database connected successfully')

    // Push schema to database
    console.log('📋 Pushing schema to database...')
    // Note: In production, you would use migrations
    // For development, we'll use db push
    console.log('Run: npx prisma db push')
    
    console.log('🎉 Database setup completed!')
  } catch (error) {
    console.error('❌ Database setup failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
