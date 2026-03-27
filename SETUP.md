# ResiboCash - Azure Deployment Setup

## Prerequisites

- [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli) installed
- [Node.js 20+](https://nodejs.org/) installed
- An Azure subscription
- A GitHub account (for CI/CD)

## Quick Deploy (Manual)

### 1. Deploy Infrastructure
```bash
cd infra
chmod +x deploy.sh
./deploy.sh
```

This creates:
- **App Service Plan (F1 Free)** - $0/month
- **App Service (Linux Node.js)** - Hosts the Express API
- **Storage Account (Standard LRS)** - ~$0.02/GB/month for receipt images
- **Cosmos DB (Free Tier)** - 1000 RU/s + 25GB free

### 2. Deploy Server Code
```bash
cd server
npm install
zip -r /tmp/server.zip . -x "node_modules/*"
az webapp deploy --resource-group rg-resibocash-dev --name <APP_NAME> --src-path /tmp/server.zip --type zip
```

### 3. Run Mobile App
```bash
cd ResiboCash
npm install
npx expo start
```

## CI/CD Setup (GitHub Actions)

### Required Secrets

Add these to your GitHub repository settings (Settings > Secrets > Actions):

| Secret | How to get it |
|--------|---------------|
| `AZURE_CREDENTIALS` | `az ad sp create-for-rbac --name "resibocash-cicd" --role contributor --scopes /subscriptions/{sub-id} --sdk-auth` |
| `AZURE_WEBAPP_NAME` | From the Bicep deployment output (e.g., `app-resibocash-dev-xxxxx`) |
| `EXPO_TOKEN` | From [expo.dev](https://expo.dev) > Account Settings > Access Tokens |

### Workflows

| Workflow | Trigger | What it does |
|----------|---------|--------------|
| `deploy-infra.yml` | Changes to `infra/` or manual | Deploys Azure resources via Bicep |
| `deploy-server.yml` | Changes to `server/` or manual | Deploys Express API to App Service |
| `build-mobile.yml` | Changes to `ResiboCash/` | Runs type checks + EAS Build |

## Cost Breakdown

| Resource | SKU | Monthly Cost |
|----------|-----|-------------|
| App Service Plan | F1 Free | $0 |
| Storage Account | Standard LRS | ~$0.02/GB |
| Cosmos DB | Free Tier | $0 (1000 RU/s + 25GB) |
| **Total** | | **~$0/month** |
