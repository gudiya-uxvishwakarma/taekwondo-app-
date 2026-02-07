
import React from 'react';
import {
  StatusBar,
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
  LogBox,
} from 'react-native';
import { StudentProvider, useStudent } from './src/context/StudentContext';
import StudentLoginScreen from './src/screens/auth/StudentLoginScreen';
import MainTabNavigator from './src/navigation/MainTabNavigator';
import ErrorBoundary from './src/components/common/ErrorBoundary';
import { colors, typography, spacing } from './src/theme';
import IconTestScreen from './src/screens/IconTestScreen'; // TEMPORARY FOR TESTING

// Ignore specific warnings that might cause issues
if (__DEV__) {
  LogBox.ignoreLogs([
    'Warning: componentWillReceiveProps',
    'Warning: componentWillMount',
    'Module RCTImageLoader',
    'Require cycle:',
    'VirtualizedLists should never be nested',
    'Setting a timer for a long period of time',
    'Remote debugger is in a background tab',
  ]);
} else {
  // Disable all console logs in production
  console.log = () => {};
  console.warn = () => {};
  console.error = () => {};
}

const AppContent = () => {
  const { isAuthenticated, loading } = useStudent();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator 
          size="large" 
          color={colors.primary} 
          style={styles.loadingSpinner}
        />
        <Text style={styles.loadingText}>Loading Taekwon-Do App...</Text>
      </View>
    );
  }

  if (!isAuthenticated) {
    return <StudentLoginScreen />;
  }

  return <MainTabNavigator />;
};

function App() {
  // TEMPORARY: Uncomment below line to test icons directly
  // return <IconTestScreen />;
  
  return (
    <ErrorBoundary>
      <StudentProvider>
        <View style={styles.container}>
          <StatusBar 
            barStyle="light-content" 
            backgroundColor={colors.primary} 
            translucent={false}
            hidden={false}
          />
          <AppContent />
        </View>
      </StudentProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: spacing.xl,
  },
  loadingSpinner: {
    marginVertical: spacing.lg,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.medium,
  },
});



export default App;