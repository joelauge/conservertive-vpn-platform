#!/bin/bash

# ConSERVERtive Environment Management Script

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}ConSERVERtive Environment Setup${NC}"
echo "=================================="

# Function to check if file exists
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1 exists"
        return 0
    else
        echo -e "${RED}✗${NC} $1 missing"
        return 1
    fi
}

# Function to show environment status
show_status() {
    echo -e "\n${YELLOW}Environment File Status:${NC}"
    echo "Frontend:"
    check_file "apps/frontend/.env.local"
    check_file "apps/frontend/.env"
    check_file "apps/frontend/.env.example"
    
    echo -e "\nBackend:"
    check_file "apps/backend/.env.local"
    check_file "apps/backend/.env"
}

# Function to setup local development
setup_local() {
    echo -e "\n${YELLOW}Setting up local development environment...${NC}"
    
    # Copy example files if they don't exist
    if [ ! -f "apps/frontend/.env.local" ]; then
        cp apps/frontend/.env.example apps/frontend/.env.local
        echo -e "${GREEN}✓${NC} Created apps/frontend/.env.local"
    fi
    
    if [ ! -f "apps/backend/.env.local" ]; then
        echo -e "${YELLOW}⚠${NC} Backend .env.local needs to be created manually"
    fi
    
    echo -e "\n${GREEN}Local development setup complete!${NC}"
    echo -e "${BLUE}Next steps:${NC}"
    echo "1. Update apps/frontend/.env.local with your TEST keys"
    echo "2. Update apps/backend/.env.local with your TEST keys"
    echo "3. Start development servers:"
    echo "   - Frontend: cd apps/frontend && npm run dev"
    echo "   - Backend: cd apps/backend && npm run start:dev"
}

# Function to validate keys
validate_keys() {
    echo -e "\n${YELLOW}Validating environment keys...${NC}"
    
    if [ -f "apps/frontend/.env.local" ]; then
        echo "Frontend (.env.local):"
        if grep -q "pk_test_" apps/frontend/.env.local; then
            echo -e "${GREEN}✓${NC} Using TEST Clerk keys"
        elif grep -q "pk_live_" apps/frontend/.env.local; then
            echo -e "${RED}⚠${NC} Using LIVE Clerk keys in local environment!"
        fi
        
        if grep -q "pk_test_" apps/frontend/.env.local; then
            echo -e "${GREEN}✓${NC} Using TEST Stripe keys"
        elif grep -q "pk_live_" apps/frontend/.env.local; then
            echo -e "${RED}⚠${NC} Using LIVE Stripe keys in local environment!"
        fi
    fi
}

# Main menu
case "${1:-status}" in
    "status")
        show_status
        validate_keys
        ;;
    "setup")
        setup_local
        ;;
    "help")
        echo -e "${BLUE}Usage:${NC}"
        echo "  $0 status    - Show environment file status"
        echo "  $0 setup     - Setup local development environment"
        echo "  $0 help      - Show this help message"
        ;;
    *)
        echo -e "${RED}Unknown command: $1${NC}"
        echo "Use '$0 help' for usage information"
        exit 1
        ;;
esac
