#!/bin/bash

# StreamVerse Quick Setup Script
# This script automates the setup process for the StreamVerse project

echo "🎬 StreamVerse Quick Setup"
echo "=========================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install
echo ""

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo "🔧 Creating .env.local..."
    cat > .env.local << 'EOF'
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000

# Optional: OAuth Credentials
# NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
# NEXT_PUBLIC_GITHUB_CLIENT_ID=your_github_client_id
EOF
    echo "✅ .env.local created. Please update with your Firebase credentials."
    echo ""
else
    echo "✅ .env.local already exists"
    echo ""
fi

echo "🚀 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env.local with your Firebase credentials"
echo "2. Run: npm run dev"
echo "3. Open: http://localhost:3000"
echo ""
echo "📚 Documentation: See README.md for more information"
echo "💬 Need help? Check IMPLEMENTATION.md for detailed info"
