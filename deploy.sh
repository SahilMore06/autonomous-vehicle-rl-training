#!/bin/bash

# Autonomous Vehicle RL Dashboard - Quick Deployment Script
# Supports: Railway, Heroku, GitHub Pages, DigitalOcean

set -e

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Autonomous Vehicle RL Dashboard - Deployment Script       ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

show_menu() {
    echo -e "${BLUE}Choose your deployment platform:${NC}"
    echo ""
    echo "  1) Railway (Recommended - Free tier) ⭐"
    echo "  2) Heroku"
    echo "  3) GitHub Pages (Frontend only)"
    echo "  4) DigitalOcean"
    echo "  5) Show deployment guide (DEPLOYMENT.md)"
    echo "  6) Exit"
    echo ""
}

deploy_railway() {
    echo -e "${YELLOW}Deploying to Railway...${NC}"
    echo ""
    echo "Steps:"
    echo "1. Visit: https://railway.app"
    echo "2. Sign up with GitHub"
    echo "3. Click: New Project → GitHub Repo"
    echo "4. Select: autonomous-vehicle-rl-training"
    echo "5. Configure: PORT=3000"
    echo "6. Deploy!"
    echo ""
    echo -e "${GREEN}Or use Railway CLI:${NC}"
    echo ""
    echo "  npm install -g @railway/cli"
    echo "  railway login"
    echo "  cd /home/harsh/project-1"
    echo "  railway init"
    echo "  railway up"
    echo ""
}

deploy_heroku() {
    echo -e "${YELLOW}Deploying to Heroku...${NC}"
    echo ""
    echo "Steps:"
    echo "1. Create Heroku account: https://heroku.com"
    echo "2. Install Heroku CLI"
    echo "3. Run these commands:"
    echo ""
    echo "  heroku login"
    echo "  cd /home/harsh/project-1/rl-dashboard-nextgen"
    echo "  heroku create your-app-name"
    echo "  git push heroku main"
    echo ""
    echo -e "${YELLOW}Note: Heroku removed free tier. Railway is recommended.${NC}"
    echo ""
}

deploy_github_pages() {
    echo -e "${YELLOW}Deploying React frontend to GitHub Pages...${NC}"
    echo ""
    echo "Steps:"
    echo "1. Add to package.json:"
    echo '   "homepage": "https://hhnaidu.github.io/autonomous-vehicle-rl-training"'
    echo ""
    echo "2. Install gh-pages:"
    echo "   npm install --save-dev gh-pages"
    echo ""
    echo "3. Add scripts to package.json:"
    echo '   "predeploy": "npm run build",'
    echo '   "deploy": "gh-pages -d build"'
    echo ""
    echo "4. Deploy:"
    echo "   cd rl-dashboard-nextgen/client"
    echo "   npm run deploy"
    echo ""
    echo -e "${GREEN}Frontend will be at:${NC}"
    echo "https://hhnaidu.github.io/autonomous-vehicle-rl-training"
    echo ""
}

deploy_digitalocean() {
    echo -e "${YELLOW}Deploying to DigitalOcean App Platform...${NC}"
    echo ""
    echo "Steps:"
    echo "1. Create DigitalOcean account: https://digitalocean.com"
    echo "2. Create App Platform project"
    echo "3. Connect GitHub repository"
    echo "4. Set build command: npm install"
    echo "5. Set start command: cd rl-dashboard-nextgen && node server.js"
    echo "6. Set PORT environment variable: 3000"
    echo "7. Deploy!"
    echo ""
    echo -e "${YELLOW}Cost: ~\$5-12/month${NC}"
    echo ""
}

show_guide() {
    if [ -f "DEPLOYMENT.md" ]; then
        less DEPLOYMENT.md
    else
        echo -e "${RED}DEPLOYMENT.md not found${NC}"
        echo "Run this script from: /home/harsh/project-1/"
    fi
}

# Main loop
while true; do
    show_menu
    read -p "Enter choice (1-6): " choice
    echo ""
    
    case $choice in
        1)
            deploy_railway
            ;;
        2)
            deploy_heroku
            ;;
        3)
            deploy_github_pages
            ;;
        4)
            deploy_digitalocean
            ;;
        5)
            show_guide
            ;;
        6)
            echo -e "${GREEN}Goodbye!${NC}"
            exit 0
            ;;
        *)
            echo -e "${RED}Invalid choice. Please try again.${NC}"
            echo ""
            ;;
    esac
    
    read -p "Press Enter to continue..."
    clear
done
