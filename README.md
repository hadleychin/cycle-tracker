# MyCycle - Period & Cycle Tracking App

A React Native (Expo) mobile application for tracking menstrual cycles and related health data.

## Features

- **Cycle Tracking**: Track your menstrual cycle with customizable cycle length, luteal phase, and period duration
- **Calendar View**: Visual calendar with color-coded phases (menstrual, follicular, ovulation, luteal)
- **Daily Logging**: Record temperature, mood, symptoms, and notes for each day
- **Cycle Analytics**: View history and statistics about your cycles
- **Data Export**: Export your data as CSV for backup or further analysis
- **Private & Secure**: All data is stored locally on your device

## Tech Stack

- React Native (Expo)
- TypeScript
- Context API for state management
- AsyncStorage for local data persistence
- React Native Paper for UI components
- React Native Calendars for the calendar view

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS) or Android Emulator (for Android)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/MyCycle.git
   cd MyCycle
   ```

2. Install dependencies:
   ```
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```
   npm start
   # or
   yarn start
   ```

4. Open the app:
   - Press `i` to open in iOS simulator
   - Press `a` to open in Android emulator
   - Scan the QR code with the Expo Go app on your device

## Structure

- `app/` - Main application code
  - `components/` - Reusable UI components
  - `context/` - React Context for state management
  - `hooks/` - Custom React hooks
  - `navigation/` - Navigation setup
  - `screens/` - App screens
  - `types/` - TypeScript type definitions
  - `utils/` - Utility functions including the CycleEngine

## Customization

### Colors

The app uses a soft color palette that can be customized in the `App.tsx` file:

- Primary: `#FF6B6B` (soft coral)
- Menstrual phase: `#FFD3D3` (light red)
- Follicular phase: `#D3E5FF` (light blue)
- Ovulation phase: `#FFF4D3` (light yellow)
- Luteal phase: `#EBD3FF` (light purple)

## Testing

Run the unit tests with:

```
npm test
# or
yarn test
```

## Future Enhancements

- Firebase integration for cloud backup
- Push notifications for cycle predictions
- More detailed analytics and charts
- Symptom pattern recognition

## License

This project is licensed under the MIT License.

## Acknowledgments

- [React Native Paper](https://callstack.github.io/react-native-paper/)
- [React Native Calendars](https://github.com/wix/react-native-calendars) 