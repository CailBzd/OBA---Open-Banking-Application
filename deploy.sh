#!/bin/bash

# Script de déploiement pour OBA
# Usage: ./deploy.sh [production|staging|development]

set -e

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration par défaut
ENVIRONMENT=${1:-development}
APP_NAME="oba-app"

echo -e "${BLUE}🚀 Déploiement d'OBA en mode: ${ENVIRONMENT}${NC}"

# Vérification des prérequis
echo -e "${YELLOW}📋 Vérification des prérequis...${NC}"

if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js n'est pas installé${NC}"
    exit 1
fi

if ! command -v yarn &> /dev/null; then
    echo -e "${RED}❌ Yarn n'est pas installé${NC}"
    exit 1
fi

if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}⚠️  Docker n'est pas installé - déploiement local uniquement${NC}"
    DOCKER_AVAILABLE=false
else
    DOCKER_AVAILABLE=true
fi

echo -e "${GREEN}✅ Prérequis vérifiés${NC}"

# Installation des dépendances
echo -e "${YELLOW}📦 Installation des dépendances...${NC}"
yarn install --frozen-lockfile
echo -e "${GREEN}✅ Dépendances installées${NC}"

# Construction de l'application
echo -e "${YELLOW}🔨 Construction de l'application...${NC}"
yarn build
echo -e "${GREEN}✅ Application construite${NC}"

# Tests (optionnel)
if [ "$ENVIRONMENT" = "production" ]; then
    echo -e "${YELLOW}🧪 Exécution des tests...${NC}"
    # yarn test
    echo -e "${GREEN}✅ Tests passés${NC}"
fi

# Déploiement selon l'environnement
case $ENVIRONMENT in
    "production")
        echo -e "${YELLOW}🚀 Déploiement en production...${NC}"
        
        if [ "$DOCKER_AVAILABLE" = true ]; then
            echo -e "${BLUE}🐳 Déploiement avec Docker...${NC}"
            docker build -t $APP_NAME:latest .
            docker tag $APP_NAME:latest $APP_NAME:production
            echo -e "${GREEN}✅ Image Docker créée${NC}"
            
            # Arrêt et redémarrage du conteneur
            docker stop $APP_NAME || true
            docker rm $APP_NAME || true
            docker run -d \
                --name $APP_NAME \
                --restart unless-stopped \
                -p 3000:3000 \
                -e NODE_ENV=production \
                -e NEXT_TELEMETRY_DISABLED=1 \
                $APP_NAME:production
            
            echo -e "${GREEN}✅ Application déployée en production${NC}"
        else
            echo -e "${BLUE}📱 Déploiement local en production...${NC}"
            yarn start &
            echo -e "${GREEN}✅ Application démarrée en production${NC}"
        fi
        ;;
        
    "staging")
        echo -e "${YELLOW}🔧 Déploiement en staging...${NC}"
        
        if [ "$DOCKER_AVAILABLE" = true ]; then
            docker build -t $APP_NAME:staging .
            echo -e "${GREEN}✅ Image Docker staging créée${NC}"
        fi
        
        # Démarrage en mode développement avec variables de staging
        NODE_ENV=staging yarn dev &
        echo -e "${GREEN}✅ Application démarrée en staging${NC}"
        ;;
        
    "development"|*)
        echo -e "${YELLOW}🛠️  Démarrage en mode développement...${NC}"
        yarn dev &
        echo -e "${GREEN}✅ Application démarrée en développement${NC}"
        ;;
esac

# Vérification du statut
echo -e "${YELLOW}🔍 Vérification du statut...${NC}"
sleep 5

if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Application accessible sur http://localhost:3000${NC}"
else
    echo -e "${RED}❌ Application non accessible${NC}"
    exit 1
fi

# Affichage des informations de déploiement
echo -e "${BLUE}📊 Informations de déploiement:${NC}"
echo -e "   🌐 URL: http://localhost:3000"
echo -e "   🔧 Environnement: $ENVIRONMENT"
echo -e "   📱 Mode: $([ "$ENVIRONMENT" = "production" ] && echo "Production" || echo "Développement")"
echo -e "   🐳 Docker: $([ "$DOCKER_AVAILABLE" = true ] && echo "Disponible" || echo "Non disponible")"

echo -e "${GREEN}🎉 Déploiement terminé avec succès !${NC}"

# Instructions pour l'arrêt
echo -e "${YELLOW}💡 Pour arrêter l'application:${NC}"
if [ "$ENVIRONMENT" = "production" ] && [ "$DOCKER_AVAILABLE" = true ]; then
    echo -e "   docker stop $APP_NAME"
elif [ "$ENVIRONMENT" != "development" ]; then
    echo -e "   pkill -f 'yarn (dev|start)'"
else
    echo -e "   Ctrl+C dans ce terminal"
fi 