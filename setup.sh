#!/bin/bash

echo "🚀 Setting up AMD Telephony System..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

echo "✅ Node.js and Docker are installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Start PostgreSQL
echo "🐘 Starting PostgreSQL..."
docker-compose up -d

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 10

# Setup database
echo "🗄️ Setting up database..."
npx prisma generate
npx prisma db push

echo "✅ Setup complete!"
echo ""
echo "🎯 Next steps:"
echo "1. Update .env.local with your Twilio credentials"
echo "2. Run: npm run dev"
echo "3. Open: http://localhost:3000"
echo ""
echo "📞 Test with these numbers:"
echo "   Costco: +18007742678"
echo "   Nike: +18008066453"
echo "   PayPal: +18882211161"