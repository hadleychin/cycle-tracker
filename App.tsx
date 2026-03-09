import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { CycleProvider } from './app/context/CycleContext';
import Navigation from './app/navigation';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#FF6B6B',  // Soft coral as specified in requirements
    menstrual: '#FFD3D3', // Light red for menstrual phase
    follicular: '#D3E5FF', // Light blue for follicular phase
    ovulation: '#FFF4D3', // Light yellow for ovulation
    luteal: '#EBD3FF',   // Light purple for luteal phase
    background: '#FFFFFF',
  },
  roundness: 12, // Rounded cards as specified
};

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <CycleProvider>
          <StatusBar style="auto" />
          <Navigation />
        </CycleProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
} 