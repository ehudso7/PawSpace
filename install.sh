#!/bin/bash

# Installation script for Video Generation System

echo "🎬 Installing PawSpace Video Generation System..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm found"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if installation was successful
if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Check for .env file
if [ ! -f .env ]; then
    echo "⚠️  No .env file found. Creating from .env.example..."
    cp .env.example .env
    echo "📝 Please edit .env and add your Cloudinary credentials"
else
    echo "✅ .env file exists"
fi

echo ""
echo "✨ Installation complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env and add your Cloudinary credentials"
echo "2. Create Cloudinary upload preset named 'pet_uploads'"
echo "3. Run 'npm start' to launch the app"
echo ""
echo "For more information, see:"
echo "  - README.md for full documentation"
echo "  - SETUP.md for setup guide"
echo "  - TESTING.md for testing guide"
echo ""
