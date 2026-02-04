/**
 * @format
 */

// Import polyfills for React Native
import 'react-native-get-random-values';

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

// Global error handler for unhandled promise rejections
if (!__DEV__) {
  const originalHandler = ErrorUtils.getGlobalHandler();
  ErrorUtils.setGlobalHandler((error, isFatal) => {
    // In production, log errors but don't crash for non-fatal errors
    if (!isFatal) {
      return;
    }
    
    // For fatal errors, still call the original handler
    originalHandler(error, isFatal);
  });
}

// Register the main app component
AppRegistry.registerComponent(appName, () => App);