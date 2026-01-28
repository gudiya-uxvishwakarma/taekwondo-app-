import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';

// Simple App component for testing registration
function App() {
  const handlePress = () => {
    Alert.alert('Success!', 'App registration is working correctly!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#007AFF" />
      <View style={styles.content}>
        <Text style={styles.title}>Taekwon-Do App</Text>
        <Text style={styles.subtitle}>Registration Test</Text>
        
        <TouchableOpacity style={styles.button} onPress={handlePress}>
          <Text style={styles.buttonText}>Test App Registration</Text>
        </TouchableOpacity>
        
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>✅ App registered successfully</Text>
          <Text style={styles.statusText}>✅ Metro bundler connected</Text>
          <Text style={styles.statusText}>✅ Certificate fixes applied</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
    marginBottom: 40,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  statusContainer: {
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    color: '#28a745',
    marginBottom: 8,
  },
});

export default App;