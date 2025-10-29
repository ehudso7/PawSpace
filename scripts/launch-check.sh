#!/bin/bash

# PawSpace Launch Readiness Check Script
echo "🚀 PawSpace Launch Readiness Check"
echo "=================================="

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check functions
check_dependencies() {
    echo "📦 Checking dependencies..."
    
    if npm list --depth=0 > /dev/null 2>&1; then
        echo -e "${GREEN}✅ All dependencies installed${NC}"
        return 0
    else
        echo -e "${RED}❌ Missing dependencies. Run: npm install${NC}"
        return 1
    fi
}

check_typescript() {
    echo "🔍 Checking TypeScript compilation..."
    
    if npx tsc --noEmit --skipLibCheck > /dev/null 2>&1; then
        echo -e "${GREEN}✅ TypeScript compilation successful${NC}"
        return 0
    else
        echo -e "${RED}❌ TypeScript errors found${NC}"
        npx tsc --noEmit --skipLibCheck
        return 1
    fi
}

check_environment() {
    echo "🔧 Checking environment configuration..."
    
    if [ -f ".env" ]; then
        echo -e "${GREEN}✅ Environment file exists${NC}"
        
        # Check for required variables
        if grep -q "EXPO_PUBLIC_SUPABASE_URL" .env && grep -q "EXPO_PUBLIC_SUPABASE_ANON_KEY" .env; then
            echo -e "${GREEN}✅ Required environment variables present${NC}"
            return 0
        else
            echo -e "${YELLOW}⚠️  Missing required environment variables${NC}"
            echo "Please ensure .env contains:"
            echo "- EXPO_PUBLIC_SUPABASE_URL"
            echo "- EXPO_PUBLIC_SUPABASE_ANON_KEY"
            return 1
        fi
    else
        echo -e "${YELLOW}⚠️  No .env file found. Copy .env.example to .env and configure${NC}"
        return 1
    fi
}

check_build() {
    echo "🏗️  Checking build configuration..."
    
    if [ -f "app.json" ] && [ -f "package.json" ]; then
        echo -e "${GREEN}✅ Build configuration files present${NC}"
        return 0
    else
        echo -e "${RED}❌ Missing build configuration files${NC}"
        return 1
    fi
}

check_features() {
    echo "✨ Checking feature completeness..."
    
    # Check for key directories and files
    local features_complete=true
    
    if [ -d "src/screens" ]; then
        echo -e "${GREEN}✅ Screens directory exists${NC}"
    else
        echo -e "${RED}❌ Missing screens directory${NC}"
        features_complete=false
    fi
    
    if [ -d "src/components" ]; then
        echo -e "${GREEN}✅ Components directory exists${NC}"
    else
        echo -e "${RED}❌ Missing components directory${NC}"
        features_complete=false
    fi
    
    if [ -d "src/services" ]; then
        echo -e "${GREEN}✅ Services directory exists${NC}"
    else
        echo -e "${RED}❌ Missing services directory${NC}"
        features_complete=false
    fi
    
    if [ -d "src/navigation" ]; then
        echo -e "${GREEN}✅ Navigation directory exists${NC}"
    else
        echo -e "${RED}❌ Missing navigation directory${NC}"
        features_complete=false
    fi
    
    if $features_complete; then
        return 0
    else
        return 1
    fi
}

# Run all checks
echo "Starting comprehensive launch readiness check..."
echo ""

all_passed=true

check_dependencies || all_passed=false
echo ""

check_typescript || all_passed=false
echo ""

check_environment || all_passed=false
echo ""

check_build || all_passed=false
echo ""

check_features || all_passed=false
echo ""

# Final result
echo "=================================="
if $all_passed; then
    echo -e "${GREEN}🎉 LAUNCH READY! All checks passed${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Run: npm start (for development)"
    echo "2. Run: npm run build (for production build)"
    echo "3. Deploy to your preferred platform"
    exit 0
else
    echo -e "${RED}🚫 NOT READY FOR LAUNCH${NC}"
    echo ""
    echo "Please fix the issues above before launching."
    exit 1
fi