#!/bin/bash

# Zigmaxmolt Deployment Script
# This script builds and deploys the skill to Moltbot

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
MOLTBOT_SKILLS_DIR="$HOME/.moltbot/skills"
SKILL_NAME="zigma-oracle"
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo -e "${GREEN}=== Zigmaxmolt Deployment Script ===${NC}\n"

# Check prerequisites
echo "Checking prerequisites..."

if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js is not installed${NC}"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo -e "${RED}Error: npm is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Node.js and npm found${NC}\n"

# Check environment variables
echo "Checking environment variables..."

if [ -z "$ZIGMA_API_KEY" ]; then
    echo -e "${YELLOW}Warning: ZIGMA_API_KEY not set${NC}"
    echo "Set it with: export ZIGMA_API_KEY=your_key"
fi

if [ -z "$ZIGMA_API_URL" ]; then
    echo -e "${YELLOW}Warning: ZIGMA_API_URL not set, using default${NC}"
fi

echo ""

# Build the project
echo "Building project..."
cd "$PROJECT_ROOT"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Build failed${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Build successful${NC}\n"

# Run tests
echo "Running tests..."
npm test

if [ $? -ne 0 ]; then
    echo -e "${YELLOW}Warning: Tests failed, but continuing deployment${NC}"
fi

echo ""

# Create Moltbot skills directory if it doesn't exist
if [ ! -d "$MOLTBOT_SKILLS_DIR" ]; then
    echo "Creating Moltbot skills directory..."
    mkdir -p "$MOLTBOT_SKILLS_DIR"
fi

# Deploy to Moltbot
echo "Deploying to Moltbot..."

SKILL_DIR="$MOLTBOT_SKILLS_DIR/$SKILL_NAME"

# Remove existing skill directory
if [ -d "$SKILL_DIR" ]; then
    echo "Removing existing skill directory..."
    rm -rf "$SKILL_DIR"
fi

# Create skill directory
mkdir -p "$SKILL_DIR"

# Copy files
echo "Copying files..."
cp -r dist/* "$SKILL_DIR/"
cp package.json "$SKILL_DIR/"
cp README.md "$SKILL_DIR/"

echo -e "${GREEN}✓ Deployed to $SKILL_DIR${NC}\n"

# Verify deployment
echo "Verifying deployment..."

if [ ! -f "$SKILL_DIR/index.js" ]; then
    echo -e "${RED}Error: Deployment verification failed${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Deployment verified${NC}\n"

# Summary
echo -e "${GREEN}=== Deployment Complete ===${NC}"
echo ""
echo "Skill installed at: $SKILL_DIR"
echo ""
echo "Next steps:"
echo "1. Enable the skill in Moltbot:"
echo "   hey moltbot, enable the zigma-oracle skill"
echo ""
echo "2. Test the skill:"
echo "   zigma alpha"
echo ""
echo "3. For more information, see:"
echo "   - QUICKSTART.md"
echo "   - DEPLOYMENT.md"
echo "   - BACKEND_INTEGRATION.md"
echo ""
echo -e "${GREEN}Happy trading! 🚀${NC}"
