
import React, { useState, useEffect } from 'react';
import {
  StatusBar,
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
  LogBox,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StudentProvider, useStudent } from './src/context/StudentContext';
import StudentLoginScreen from './src/screens/auth/StudentLoginScreen';
import TheoryLoginScreen from './src/screens/auth/TheoryLoginScreen';
import TheorySyllabusScreen from './src/screens/TheorySyllabusScreen';
import PracticalLoginScreen from './src/screens/auth/PracticalLoginScreen';
import SelectionScreen from './src/screens/SelectionScreen';
import MainTabNavigator from './src/navigation/MainTabNavigator';
import FlashcardScreen from './src/screens/FlashcardScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import PracticalSyllabusScreen from './src/screens/PracticalSyllabusScreen';
import PracticalDashboardScreen from './src/screens/PracticalDashboardScreen';
import BeltDetailScreen from './src/screens/BeltDetailScreen';
import PracticalPaymentScreen from './src/screens/PracticalPaymentScreen';
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

const AppContent = ({ onRegisterGoToSelection }) => {
  const { isAuthenticated, loading, logout } = useStudent();
  const [showFlashcard, setShowFlashcard] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showSelection, setShowSelection] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);
  const [showPracticalPayment, setShowPracticalPayment] = useState(false);
  const [practicalLoginAfterPayment, setPracticalLoginAfterPayment] = useState(false);
  const [selectedBelt, setSelectedBelt] = useState(null);

  useEffect(() => {
    checkOnboardingStatus();
    checkSavedAccountType(); // Check if user has a saved account type
  }, []);

  const checkSavedAccountType = async () => {
    try {
      const savedType = await AsyncStorage.getItem('accountType');
      if (savedType) {
        console.log('Found saved account type:', savedType);
        setSelectedType(savedType);
        setShowSelection(false);
      }
    } catch (error) {
      console.log('Error checking saved account type:', error);
    }
  };

  const checkOnboardingStatus = async () => {
    try {
      // TEMPORARY: Always show onboarding for testing
      // Remove this line later to make it show only once
      setShowOnboarding(true);
      
      // Original code (uncomment later):
      // const hasSeenOnboarding = await AsyncStorage.getItem('hasSeenOnboarding');
      // if (!hasSeenOnboarding) {
      //   setShowOnboarding(true);
      // }
    } catch (error) {
      console.log('Error checking onboarding status:', error);
    } finally {
      setCheckingOnboarding(false);
    }
  };

  const handleOnboardingFinish = async () => {
    try {
      await AsyncStorage.setItem('hasSeenOnboarding', 'true');
      setShowOnboarding(false);
      setShowSelection(true); // Show selection screen after onboarding
    } catch (error) {
      console.log('Error saving onboarding status:', error);
      setShowOnboarding(false);
      setShowSelection(true);
    }
  };

  const handleSelection = async (type) => {
    console.log('Selected type:', type);
    setSelectedType(type);
    setShowSelection(false);
    
    // Save account type selection
    try {
      await AsyncStorage.setItem('accountType', type);
      console.log('Saved account type:', type);
    } catch (error) {
      console.log('Error saving account type:', error);
    }
  };

  const handleBackToSelection = async () => {
    setSelectedType(null);
    setShowSelection(true);
    
    // Clear saved account type when going back to selection
    try {
      await AsyncStorage.removeItem('accountType');
      console.log('Cleared account type');
    } catch (error) {
      console.log('Error clearing account type:', error);
    }
  };

  useEffect(() => {
    if (onRegisterGoToSelection) onRegisterGoToSelection(() => handleBackToSelection);
  }, []);

  const handlePaymentRequired = () => {
    // Show payment screen for practical syllabus
    setShowPracticalPayment(true);
  };

  const handlePaymentSuccess = (data) => {
    setShowPracticalPayment(false);
    setPracticalLoginAfterPayment(true);
  };

  const handlePracticalLoginSuccess = () => {
    // After successful login, show dashboard
    setPracticalLoginAfterPayment(false);
    // isAuthenticated will be true now, so it will show dashboard
  };

  const handleBackFromPayment = () => {
    setShowPracticalPayment(false);
    setSelectedType(null);
    setShowSelection(true);
  };

  const handlePracticalLogout = async () => {
    // Logout from practical syllabus - go to login page
    logout();
    setSelectedType('practical');
    setShowOnboarding(false);
    setShowSelection(false);
    
    // Keep the account type saved so they stay in practical mode
    // Don't remove it - they're just logging out, not switching accounts
  };

  const handleSelectBelt = (belt) => {
    setSelectedBelt(belt);
  };

  const handleBackFromBelt = () => {
    setSelectedBelt(null);
  };

  // Show flashcard screen first
  if (showFlashcard) {
    return <FlashcardScreen onFinish={() => setShowFlashcard(false)} />;
  }

  // Show onboarding if user hasn't seen it
  if (checkingOnboarding) {
    return null; // Or a simple loading indicator
  }

  if (showOnboarding) {
    return <OnboardingScreen onFinish={handleOnboardingFinish} />;
  }

  // Show selection screen
  if (showSelection) {
    return <SelectionScreen onSelect={handleSelection} />;
  }

  // Show Theory Syllabus Screen (no login needed)
  if (selectedType === 'theory') {
    return <TheorySyllabusScreen onBack={handleBackToSelection} />;
  }

  // Show Payment Screen for Practical Syllabus
  if (showPracticalPayment) {
    return (
      <PracticalPaymentScreen
        onBack={handleBackFromPayment}
        onPaymentSuccess={handlePaymentSuccess}
      />
    );
  }

  // Show Practical Login after payment or direct access
  if (selectedType === 'practical' || practicalLoginAfterPayment) {
    // If already authenticated, show dashboard directly
    if (isAuthenticated) {
      // Show belt detail if one is selected
      if (selectedBelt) {
        return (
          <BeltDetailScreen 
            belt={selectedBelt}
            onBack={handleBackFromBelt}
          />
        );
      }

      return (
        <PracticalDashboardScreen 
          onBack={handleBackToSelection}
          onLogout={handlePracticalLogout}
          onSelectBelt={handleSelectBelt}
        />
      );
    }
    
    // Otherwise show login screen
    return (
      <PracticalLoginScreen
        onBack={handleBackToSelection}
        onLoginSuccess={handlePracticalLoginSuccess}
        onPaymentRequired={handlePaymentRequired}
      />
    );
  }

  // Show Student Data Screen (requires login)
  if (selectedType === 'student') {
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
      return <StudentLoginScreen onBack={handleBackToSelection} />;
    }

    return <MainTabNavigator />;
  }

  // Default: show selection
  return <SelectionScreen onSelect={handleSelection} />;
};

function App() {
  // TEMPORARY: Uncomment below line to test icons directly
  // return <IconTestScreen />;
  const [goToSelectionFn, setGoToSelectionFn] = useState(null);

  return (
    <ErrorBoundary>
      <StudentProvider onGoToSelection={goToSelectionFn}>
        <View style={styles.container}>
          <StatusBar 
            barStyle="light-content" 
            backgroundColor={colors.primary} 
            translucent={false}
            hidden={false}
          />
          <AppContent onRegisterGoToSelection={setGoToSelectionFn} />
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