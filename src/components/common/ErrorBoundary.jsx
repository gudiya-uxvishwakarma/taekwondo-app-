import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

// Safe theme import with fallbacks
let colors, typography, spacing;
try {
  const theme = require('../../theme');
  colors = theme.colors;
  typography = theme.typography;
  spacing = theme.spacing;
} catch (e) {
  colors = { 
    primary: '#007AFF', 
    background: '#fff', 
    textPrimary: '#000',
    textSecondary: '#666' 
  };
  typography = { 
    fontSize: { xl: 20, md: 16 }, 
    fontWeight: { bold: 'bold', semiBold: '600' } 
  };
  spacing = { xl: 24, lg: 16, md: 12, sm: 8 };
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      retryCount: 0 
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error for debugging
    if (__DEV__) {
      console.error('❌ Error Boundary caught an error:', error);
      console.error('❌ Error Info:', errorInfo);
      console.error('❌ Component Stack:', errorInfo.componentStack);
    }
    
    // Store error info for display
    this.setState({ errorInfo });
    
    // In production, you might want to send this to a crash reporting service
    // Example: Crashlytics.recordError(error);
  }

  handleRetry = () => {
    this.setState(prevState => ({ 
      hasError: false, 
      error: null, 
      errorInfo: null,
      retryCount: prevState.retryCount + 1
    }));
  };

  handleForceRestart = () => {
    // Clear all state and force a complete restart
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null,
      retryCount: 0
    });
    
    // Force re-render of the entire app
    if (this.props.onRestart) {
      this.props.onRestart();
    }
  };

  render() {
    if (this.state.hasError) {
      const { retryCount } = this.state;
      const showDetails = __DEV__ && this.state.error;
      
      return (
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.errorContainer}>
              <Text style={styles.errorEmoji}>⚠️</Text>
              <Text style={styles.errorTitle}>Something went wrong</Text>
              <Text style={styles.errorMessage}>
                The app encountered an unexpected error. Please try again.
              </Text>
              
              {retryCount > 2 && (
                <Text style={styles.persistentErrorMessage}>
                  If the problem persists, try restarting the app completely.
                </Text>
              )}
              
              {showDetails && (
                <View style={styles.errorDetails}>
                  <Text style={styles.errorDetailsTitle}>Error Details (Debug):</Text>
                  <Text style={styles.errorDetailsText}>
                    {this.state.error.toString()}
                  </Text>
                  {this.state.errorInfo && (
                    <Text style={styles.errorDetailsText}>
                      {this.state.errorInfo.componentStack}
                    </Text>
                  )}
                </View>
              )}
              
              <View style={styles.buttonContainer}>
                <TouchableOpacity 
                  style={styles.retryButton}
                  onPress={this.handleRetry}
                >
                  <Text style={styles.retryButtonText}>
                    Try Again {retryCount > 0 && `(${retryCount})`}
                  </Text>
                </TouchableOpacity>
                
                {retryCount > 1 && (
                  <TouchableOpacity 
                    style={[styles.retryButton, styles.restartButton]}
                    onPress={this.handleForceRestart}
                  >
                    <Text style={styles.retryButtonText}>Force Restart</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </ScrollView>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  errorContainer: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: spacing.xl,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    maxWidth: '90%',
  },
  errorEmoji: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  errorTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  persistentErrorMessage: {
    fontSize: 14,
    color: '#FF6B6B',
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: spacing.lg,
  },
  errorDetails: {
    backgroundColor: '#f5f5f5',
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.lg,
    maxWidth: '100%',
  },
  errorDetailsTitle: {
    fontSize: 14,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  errorDetailsText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: 'monospace',
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.md,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 8,
    minWidth: 120,
  },
  restartButton: {
    backgroundColor: '#FF6B6B',
  },
  retryButtonText: {
    color: '#fff',
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semiBold,
    textAlign: 'center',
  },
});

export default ErrorBoundary;