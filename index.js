/**
 * @format
 */

// Import polyfills for React Native
import 'react-native-get-random-values';

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

console.log('📱 Registering app with name:', appName);
AppRegistry.registerComponent(appName, () => App);
console.log('✅ App registered successfully');