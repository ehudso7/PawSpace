#!/bin/bash

# PawSpace Production Setup Script
# This script helps you set up your production environment

set -e

echo "?? PawSpace Production Setup"
echo "=============================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env file exists
if [ -f .env ]; then
    echo -e "${YELLOW}??  .env file already exists. Backing up to .env.backup${NC}"
    cp .env .env.backup
fi

# Copy .env.example to .env
echo "?? Creating .env file from .env.example..."
cp .env.example .env

echo ""
echo -e "${GREEN}? .env file created!${NC}"
echo ""
echo -e "${YELLOW}??  IMPORTANT: You need to fill in the following values in .env:${NC}"
echo ""
echo "Required variables:"
echo "  - EXPO_PUBLIC_SUPABASE_URL"
echo "  - EXPO_PUBLIC_SUPABASE_ANON_KEY"
echo "  - EXPO_PUBLIC_API_BASE_URL"
echo "  - EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY"
echo ""
echo "Optional variables:"
echo "  - EXPO_PUBLIC_GOOGLE_MAPS_API_KEY"
echo "  - EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME"
echo "  - EXPO_PUBLIC_CLOUDINARY_API_KEY"
echo ""
echo "Opening .env file for editing..."
echo ""

# Open .env file in default editor (if available)
if command -v nano &> /dev/null; then
    nano .env
elif command -v vi &> /dev/null; then
    vi .env
elif command -v code &> /dev/null; then
    code .env
else
    echo "Please edit .env file manually with your credentials"
fi

echo ""
echo "?? Installing dependencies..."
npm install

echo ""
echo "? Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Make sure all environment variables in .env are filled in"
echo "  2. Run 'npm run validate-env' to check your configuration"
echo "  3. Run 'eas init' to set up EAS project"
echo "  4. Test your app: 'npm start'"
echo ""
