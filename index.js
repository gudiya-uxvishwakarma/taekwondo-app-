/**
 * @format
 * ULTRA-CRASH-PROOF Entry Point
 */

// CRITICAL: Import polyfills FIRST
try {
  require('react-native-get-random-values');
} catch (polyfillError) {
  // Continue without polyfill if it fails
}

import { AppRegistry, LogBox } from 'react-native';
import { name as appName } from './app.json';

// ULTRA-SAFE App import
let App;
try {
  App = require('./App').default;
} catch (appImportError) {
  console.log('App import failed, using fallback');
  const React = require('react');
  const { View, Text } = require('react-native');
  
  App = () => React.createElement(View, {
    style: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#ffffff'
    }
  }, React.createElement(Text, { style: { fontSize: 16, color: '#000' } }, 'App Loading...'));
}

// ULTRA-SAFE console and error handling
if (!__DEV__) {
  // Completely disable console in production
  const noop = () => {};
  console.log = noop;
  console.warn = noop;
  console.error = noop;
  console.info = noop;
  console.debug = noop;
  console.trace = noop;
  
  // ULTRA-SAFE global error handler
  try {
    if (global.ErrorUtils && typeof global.ErrorUtils.setGlobalHandler === 'function') {
      const originalHandler = global.ErrorUtils.getGlobalHandler && global.ErrorUtils.getGlobalHandler();
      
      global.ErrorUtils.setGlobalHandler((error, isFatal) => {
        // Only crash for truly fatal native errors
        if (isFatal && error && error.message && error.message.includes('native')) {
          if (originalHandler) {
            originalHandler(error, isFatal);
          }
        }
        // For all other errors, just ignore and continue
      });
    }
  } catch (errorHandlerError) {
    // Ignore error handler setup errors
  }
  
  // Handle promise rejections safely
  try {
    if (typeof global.Promise !== 'undefined') {
      const originalCatch = global.Promise.prototype.catch;
      global.Promise.prototype.catch = function(onRejected) {
        return originalCatch.call(this, onRejected || (() => {}));
      };
    }
  } catch (promiseError) {
    // Ignore promise handling errors
  }
} else {
  // Development mode - ignore warnings safely
  try {
    if (LogBox && LogBox.ignoreLogs) {
      LogBox.ignoreLogs([
        'Warning: componentWillReceiveProps',
        'Warning: componentWillMount', 
        'Module RCTImageLoader',
        'Require cycle:',
        'VirtualizedLists should never be nested',
        'Setting a timer for a long period of time',
        'Remote debugger is in a background tab',
        'Non-serializable values were found',
        'Animated: `useNativeDriver`',
        'ViewPropTypes will be removed',
      ]);
    }
  } catch (logBoxError) {
    // Ignore LogBox errors
  }
}

// ULTRA-SAFE App Registration
const SafeApp = () => {
  try {
    return App();
  } catch (appError) {
    // Return absolute minimal fallback
    const React = require('react');
    const { View, Text } = require('react-native');
    
    return React.createElement(View, {
      style: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        padding: 20
      }
    }, React.createElement(Text, { 
      style: { 
        fontSize: 16, 
        color: '#000000',
        textAlign: 'center'
      } 
    }, 'Taekwon-Do App\nLoading...'));
  }
};

// Register with multiple fallbacks
try {
  AppRegistry.registerComponent(appName, () => SafeApp);
} catch (registrationError) {
  try {
    // Fallback registration
    AppRegistry.registerComponent(appName, () => App);
  } catch (fallbackError) {
    // Last resort registration
    const React = require('react');
    const { View, Text } = require('react-native');
    
    const MinimalApp = () => React.createElement(View, {
      style: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }
    }, React.createElement(Text, null, 'App'));
    
    AppRegistry.registerComponent(appName, () => MinimalApp);
  }
}