# ResiboCash

A Fetch Rewards-style receipt scanning rewards app built with React Native and Expo.

## Quick Start

### Mobile App
```bash
cd ResiboCash
npm install
npx expo start
```

### Mock API Server
```bash
cd server
npm install
npm run dev
```

Server runs at `http://localhost:3001`.

## Features

- Receipt scanning with camera
- Points system (1 pt per P10 spent)
- Rewards catalog (GCash, Maya, Mobile Load, Gift Cards)
- Scan history tracking
- Onboarding flow with phone verification
- Data persistence with AsyncStorage

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/receipts/upload | Scan a receipt (multipart form) |
| POST | /api/rewards/redeem | Redeem a reward |
| GET | /api/rewards | Get rewards catalog |
| GET | /api/health | Health check |

## Tech Stack

- React Native + Expo SDK 54
- React Navigation (Stack + Bottom Tabs)
- Expo Camera
- AsyncStorage for persistence
- Express.js mock backend
