targetScope = 'resourceGroup'

@description('Environment name')
@allowed(['dev', 'staging', 'prod'])
param environment string = 'dev'

@description('Azure region')
param location string = resourceGroup().location

@description('App name prefix')
param appName string = 'resibocash'

@description('Budget alert email')
param budgetAlertEmail string

var uniqueSuffix = uniqueString(resourceGroup().id)
var appServicePlanName = 'asp-${appName}-${environment}'
var appServiceName = 'app-${appName}-${environment}-${uniqueSuffix}'
var storageAccountName = '${take(replace(appName, '-', ''), 10)}${environment}${take(uniqueSuffix, 6)}'
var cosmosAccountName = 'cosmos-${appName}-${environment}-${uniqueSuffix}'

// App Service Plan - F1 Free tier (cheapest possible)
resource appServicePlan 'Microsoft.Web/serverfarms@2023-12-01' = {
  name: appServicePlanName
  location: location
  kind: 'linux'
  properties: {
    reserved: true // Required for Linux
  }
  sku: {
    name: 'F1'
    tier: 'Free'
    size: 'F1'
    family: 'F'
    capacity: 1
  }
}

// App Service - Linux Node.js for Express backend
resource appService 'Microsoft.Web/sites@2023-12-01' = {
  name: appServiceName
  location: location
  kind: 'app,linux'
  properties: {
    serverFarmId: appServicePlan.id
    httpsOnly: true
    siteConfig: {
      linuxFxVersion: 'NODE|20-lts'
      appSettings: [
        {
          name: 'WEBSITE_NODE_DEFAULT_VERSION'
          value: '~20'
        }
        {
          name: 'SCM_DO_BUILD_DURING_DEPLOYMENT'
          value: 'true'
        }
        {
          name: 'COSMOS_CONNECTION_STRING'
          value: cosmosAccount.listConnectionStrings().connectionStrings[0].connectionString
        }
        {
          name: 'STORAGE_CONNECTION_STRING'
          value: 'DefaultEndpointsProtocol=https;AccountName=${storageAccount.name};AccountKey=${storageAccount.listKeys().keys[0].value};EndpointSuffix=core.windows.net'
        }
        {
          name: 'NODE_ENV'
          value: environment == 'prod' ? 'production' : 'development'
        }
      ]
      ftpsState: 'Disabled'
      minTlsVersion: '1.2'
    }
  }
}

// Storage Account - Standard LRS (cheapest tier)
resource storageAccount 'Microsoft.Storage/storageAccounts@2023-05-01' = {
  name: storageAccountName
  location: location
  kind: 'StorageV2'
  sku: {
    name: 'Standard_LRS' // Locally redundant - cheapest
  }
  properties: {
    accessTier: 'Hot'
    supportsHttpsTrafficOnly: true
    minimumTlsVersion: 'TLS1_2'
    allowBlobPublicAccess: false
  }
}

// Blob container for receipt images
resource blobService 'Microsoft.Storage/storageAccounts/blobServices@2023-05-01' = {
  parent: storageAccount
  name: 'default'
}

resource receiptContainer 'Microsoft.Storage/storageAccounts/blobServices/containers@2023-05-01' = {
  parent: blobService
  name: 'receipts'
  properties: {
    publicAccess: 'None'
  }
}

// Cosmos DB - Free tier (1000 RU/s free)
resource cosmosAccount 'Microsoft.DocumentDB/databaseAccounts@2024-02-15-preview' = {
  name: cosmosAccountName
  location: location
  kind: 'GlobalDocumentDB'
  properties: {
    enableFreeTier: true // FREE TIER - 1000 RU/s + 25GB free
    databaseAccountOfferType: 'Standard'
    consistencyPolicy: {
      defaultConsistencyLevel: 'Session'
    }
    locations: [
      {
        locationName: location
        failoverPriority: 0
        isZoneRedundant: false
      }
    ]
    capabilities: [
      {
        name: 'EnableServerless' // Serverless = pay per request, cheapest for low traffic
      }
    ]
  }
}

// Cosmos DB Database
resource cosmosDatabase 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases@2024-02-15-preview' = {
  parent: cosmosAccount
  name: 'resibocash'
  properties: {
    resource: {
      id: 'resibocash'
    }
  }
}

// Cosmos DB Containers
resource receiptsContainer 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers@2024-02-15-preview' = {
  parent: cosmosDatabase
  name: 'receipts'
  properties: {
    resource: {
      id: 'receipts'
      partitionKey: {
        paths: ['/userId']
        kind: 'Hash'
      }
    }
  }
}

resource usersContainer 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers@2024-02-15-preview' = {
  parent: cosmosDatabase
  name: 'users'
  properties: {
    resource: {
      id: 'users'
      partitionKey: {
        paths: ['/id']
        kind: 'Hash'
      }
    }
  }
}

resource rewardsContainer 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers@2024-02-15-preview' = {
  parent: cosmosDatabase
  name: 'rewards'
  properties: {
    resource: {
      id: 'rewards'
      partitionKey: {
        paths: ['/category']
        kind: 'Hash'
      }
    }
  }
}

// Budget - $150 cap on Azure spend with alerts at 50%, 80%, 100%
resource budget 'Microsoft.Consumption/budgets@2023-11-01' = {
  name: 'budget-${appName}-${environment}'
  properties: {
    category: 'Cost'
    amount: 150
    timeGrain: 'Monthly'
    timePeriod: {
      startDate: '2026-04-01'
    }
    notifications: {
      fiftyPercent: {
        enabled: true
        operator: 'GreaterThanOrEqualTo'
        threshold: 50
        contactEmails: [budgetAlertEmail]
        contactRoles: ['Owner']
        thresholdType: 'Actual'
      }
      eightyPercent: {
        enabled: true
        operator: 'GreaterThanOrEqualTo'
        threshold: 80
        contactEmails: [budgetAlertEmail]
        contactRoles: ['Owner']
        thresholdType: 'Actual'
      }
      hundredPercent: {
        enabled: true
        operator: 'GreaterThanOrEqualTo'
        threshold: 100
        contactEmails: [budgetAlertEmail]
        contactRoles: ['Owner']
        thresholdType: 'Actual'
      }
    }
  }
}

// Outputs
output appServiceUrl string = 'https://${appService.properties.defaultHostName}'
output appServiceName string = appService.name
output storageAccountName string = storageAccount.name
output cosmosAccountName string = cosmosAccount.name
output resourceGroupName string = resourceGroup().name
