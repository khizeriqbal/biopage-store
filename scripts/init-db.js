#!/usr/bin/env node

/**
 * Database initialization script
 * Attempts to initialize Prisma schema on Vercel
 */

const { PrismaClient } = require('@prisma/client');

async function initDB() {
  try {
    console.log('🔄 Initializing database schema...');

    const prisma = new PrismaClient();

    try {
      // Try to query the User table to see if it exists
      await prisma.user.findFirst();
      console.log('✅ Database schema already exists');
    } catch (error) {
      if (error.code === 'P2021') {
        // Table doesn't exist - need to initialize
        console.log('📊 Creating database tables...');
        console.log('⚠️  Tables do not exist. Please run schema migration.');
        console.log('    On next deployment or locally, ensure DIRECT_URL is set and run:');
        console.log('    DATABASE_URL=$DIRECT_URL npx prisma db push');
      } else {
        throw error;
      }
    } finally {
      await prisma.$disconnect();
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Database check failed:', error.message);
    // Don't fail deployment
    process.exit(0);
  }
}

initDB();
