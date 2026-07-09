import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { WordProvider } from './src/context/WordContext';
import { AppNavigator } from './src/navigation/AppNavigator';

/**
 * Einstiegspunkt der App „DialektWörterbuch Groß-Umstadt".
 * Stellt Datenkontext bereit und startet die Tab-Navigation.
 */
export default function App() {
  return (
    <SafeAreaProvider>
      <WordProvider>
        <StatusBar style="dark" />
        <AppNavigator />
      </WordProvider>
    </SafeAreaProvider>
  );
}
