import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
} from 'react-native';

// Safe imports with error handling
let StudentProvider, useStudent, StudentLoginScreen, MainTabNavigator;
let colors, typography, spacing;

try {
  const studentContext = require('./src/context/StudentContext');
  StudentProvider = studentContext.StudentProvider;
  useStudent = studentContext.useStudent;
  
  StudentLoginScreen = require('./src/screens/auth/StudentLoginScreen').default;
  MainTabNavigator = require('./src/navigation/MainTabNavigator').default;
  
  const theme = require('./src/theme');
  colors = theme.colors || { primary: '#007AFF', background: '#fff', textSecondary: '#666' };
  typography = theme.typography || { fontSize: { md: 16 }, fontWeight: { medium: '500' } };
  spacing = theme.spacing || { xl: 24, lg: 16, md: 12 };
} catch (error) {
  console.error('Import error:', error);
  // Fallback values
  colors = { primary: '#007AFF', background: '#fff', textSecondary: '#666' };
  typography = { fontSize: { md: 16 }, fontWeight: { medium: '500' } };
  spacing = { xl: 24, lg: 16, md: 12 };
}

const AppContent = () => {
  if (!useStudent) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Loading app components...</Text>
      </View>
    );
  }

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

  if (!isAuthenticated && StudentLoginScreen) {
    return <StudentLoginScreen />;
  }

  if (MainTabNavigator) {
    return <MainTabNavigator />;
  }

  return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>App components not loaded</Text>
    </View>
  );
};

function App() {
  if (!StudentProvider) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#007AFF" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Initializing app...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <StudentProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar 
          barStyle="dark-content" 
          backgroundColor={colors.primary} 
          translucent={false}
        />
        <AppContent />
      </SafeAreaView>
    </StudentProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 24,
  },
  loadingSpinner: {
    marginVertical: 16,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 24,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default App;