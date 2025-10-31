#!/bin/bash

# ?? PawSpace Instant Launch Script
# This script sets up everything automatically for immediate launch

set -e

echo "?? PawSpace Instant Launch Setup"
echo "=================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${BLUE}?? Creating .env file...${NC}"
    cp .env.example .env
    echo -e "${GREEN}? .env file created${NC}"
else
    echo -e "${YELLOW}??  .env file already exists${NC}"
fi

echo ""
echo -e "${BLUE}?? Installing dependencies...${NC}"
npm install

echo ""
echo -e "${GREEN}? Dependencies installed${NC}"
echo ""
echo -e "${YELLOW}??  IMPORTANT: You need to configure these in .env before launching:${NC}"
echo ""
echo "REQUIRED:"
echo "  - EXPO_PUBLIC_SUPABASE_URL"
echo "  - EXPO_PUBLIC_SUPABASE_ANON_KEY"
echo ""
echo "OPTIONAL (for full functionality):"
echo "  - EXPO_PUBLIC_API_BASE_URL (for booking API)"
echo "  - EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY (for payments)"
echo ""
echo -e "${BLUE}?? Quick Setup Guide:${NC}"
echo ""
echo "1. Get Supabase credentials:"
echo "   ? Go to https://supabase.com"
echo "   ? Create project ? Settings ? API"
echo "   ? Copy URL and anon key to .env"
echo ""
echo "2. (Optional) Get Stripe key:"
echo "   ? Go to https://stripe.com"
echo "   ? Developers ? API keys"
echo "   ? Copy publishable key to .env"
echo ""
echo "3. (Optional) Set up backend API:"
echo "   ? Deploy your backend"
echo "   ? Add API URL to .env"
echo ""
echo -e "${GREEN}? Setup complete!${NC}"
echo ""
echo "Next steps:"
echo "  1. Edit .env file with your credentials"
echo "  2. Run: npm start"
echo "  3. Test the app"
echo "  4. When ready: eas build --platform all --profile production"
echo ""
