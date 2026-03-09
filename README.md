# MyCycle

A privacy-first menstrual cycle tracking app built with React Native and Expo. All data stays on your device. Nothing is sent to a server.

## Why I Built This

Cycle tracking apps typically sync data to the cloud. That design choice became a serious concern when legal environments around reproductive healthcare started shifting. Health data that lives on a server can be subpoenaed, sold, or exposed in a breach. Health data that only exists on your phone cannot.

I built this app with a single non-negotiable design constraint: no network requests, no cloud storage, no external services. Your data stays where you put it.

## Features

- **Cycle tracking**: Log period start and end, configure your typical cycle length, luteal phase, and period duration
- **Phase calendar**: Color-coded view of menstrual, follicular, ovulation, and luteal phases with predictions based on your history
- **Daily logging**: Record temperature, mood, symptoms, and notes for any day
- **Cycle history**: View past cycles and statistics over time
- **Data export**: Export your data as CSV for backup or your own analysis
- **Fully offline**: No internet connection required, ever

## Tech Stack

- React Native (Expo)
- TypeScript
- Context API for state management
- AsyncStorage for local data persistence
- React Native Paper (UI components)
- React Native Calendars

## Local Setup

### Prerequisites

- Node.js v14+
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app on your phone, or an iOS/Android simulator

### Install and run

```bash
git clone https://github.com/hadleychin/cycle-tracker.git
cd cycle-tracker
npm install
npm start
```

Then scan the QR code with Expo Go, or press `i` for iOS simulator / `a` for Android.

### Run tests

```bash
npm test
```

The `CycleEngine` has unit tests covering phase calculation and date prediction logic.

## Project Structure

```
cycle-tracker/
├── app/
│   ├── context/          # CycleContext - central state management
│   ├── navigation/       # Tab and stack navigation
│   ├── screens/          # HomeScreen, HistoryScreen, SettingsScreen, OnboardingScreen
│   ├── types/            # TypeScript types
│   └── utils/
│       ├── CycleEngine.ts            # Core phase calculation and prediction logic
│       ├── storage.ts                # AsyncStorage wrapper
│       └── __tests__/
│           └── CycleEngine.test.ts   # Unit tests
├── assets/
└── App.tsx
```

## Privacy

This app makes zero network requests. There is no backend, no analytics, no crash reporting, no third-party SDKs that phone home. The only storage is `AsyncStorage` on your device.

If you want to verify this, you can review the source. There are no `fetch`, `axios`, or `XMLHttpRequest` calls outside of Expo's internal development tooling.

## License

MIT
