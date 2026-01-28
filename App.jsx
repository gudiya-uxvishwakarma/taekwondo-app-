import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
} from 'react-native';
import { StudentProvider, useStudent } from './src/context/StudentContext';
import StudentLoginScreen from './src/screens/auth/StudentLoginScreen';
import MainTabNavigator from './src/navigation/MainTabNavigator';
import { colors, typography, spacing } from './src/theme';

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