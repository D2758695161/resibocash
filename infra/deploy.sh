#!/bin/bash
set -e

RESOURCE_GROUP="rg-resibocash-dev"
LOCATION="eastus"
ENVIRONMENT="dev"

echo "=== ResiboCash Azure Deployment ==="
echo "Resource Group: $RESOURCE_GROUP"
echo "Location: $LOCATION"
echo "Environment: $ENVIRONMENT"
echo ""

# Create resource group if it doesn't exist
echo "Creating resource group..."
az group create \
  --name "$RESOURCE_GROUP" \
  --location "$LOCATION" \
  --output none

# Deploy Bicep template
echo "Deploying infrastructure..."
DEPLOY_OUTPUT=$(az deployment group create \
  --resource-group "$RESOURCE_GROUP" \
  --template-file main.bicep \
  --parameters parameters.dev.json \
  --output json)

# Extract outputs
APP_NAME=$(echo "$DEPLOY_OUTPUT" | jq -r '.properties.outputs.appServiceName.value')
APP_URL=$(echo "$DEPLOY_OUTPUT" | jq -r '.properties.outputs.appServiceUrl.value')

echo ""
echo "=== Deployment Complete ==="
echo "App Service: $APP_NAME"
echo "URL: $APP_URL"
echo ""

# Deploy code to App Service
echo "Deploying server code..."
cd ../server
zip -r /tmp/resibocash-server.zip . -x "node_modules/*" "uploads/*"
az webapp deploy \
  --resource-group "$RESOURCE_GROUP" \
  --name "$APP_NAME" \
  --src-path /tmp/resibocash-server.zip \
  --type zip
rm /tmp/resibocash-server.zip

echo ""
echo "=== Server Deployed ==="
echo "API URL: $APP_URL/api/health"
echo ""
echo "Cost estimate:"
echo "  App Service Plan (F1): FREE"
echo "  Storage (LRS):         ~\$0.02/GB/month"
echo "  Cosmos DB (Free tier): FREE (1000 RU/s + 25GB)"
echo "  Total:                 ~\$0/month for MVP"
