import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { runNetworkDiagnostics } from '../utils/networkDiagnostics';

const NetworkDiagnostics = () => {
  const [diagnostics, setDiagnostics] = useState(null);
  const [loading, setLoading] = useState(false);

  const runDiagnostics = async () => {
    setLoading(true);
    try {
      const results = await runNetworkDiagnostics();
      setDiagnostics(results);
    } catch (error) {
      console.error('Diagnostics failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const testDirectConnection = async () => {
    console.log('🧪 Testing direct backend connection...');
    
    try {
      const response = await fetch('http://localhost:5000/api/health', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Direct connection successful:', data);
        alert('✅ Backend connection successful!');
      } else {
        console.log('❌ Direct connection failed:', response.status);
        alert(`❌ Connection failed: ${response.status}`);
      }
    } catch (error) {
      console.error('❌ Direct connection error:', error);
      alert(`❌ Connection error: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Network Diagnostics</Text>
      
      <TouchableOpacity 
        style={styles.button} 
        onPress={runDiagnostics}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Run Full Diagnostics</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, styles.testButton]} 
        onPress={testDirectConnection}
      >
        <Text style={styles.buttonText}>Test Direct Connection</Text>
      </TouchableOpacity>

      {diagnostics && (
        <ScrollView style={styles.results}>
          <Text style={styles.resultsTitle}>Diagnostics Results:</Text>
          
          {Object.entries(diagnostics.tests).map(([key, test]) => (
            <View key={key} style={styles.testResult}>
              <Text style={styles.testName}>{key}:</Text>
              <Text style={test.success ? styles.success : styles.failure}>
                {test.success ? '✅ Success' : '❌ Failed'}
              </Text>
              {test.error && (
                <Text style={styles.error}>Error: {test.error}</Text>
              )}
            </View>
          ))}

          <View style={styles.recommendations}>
            <Text style={styles.recommendationsTitle}>Recommendations:</Text>
            {diagnostics.recommendations.map((rec, index) => (
              <Text key={index} style={styles.recommendation}>
                {rec}
              </Text>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  testButton: {
    backgroundColor: '#28a745',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  results: {
    marginTop: 20,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    maxHeight: 400,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  testResult: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 5,
  },
  testName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  success: {
    color: '#28a745',
    fontWeight: 'bold',
  },
  failure: {
    color: '#dc3545',
    fontWeight: 'bold',
  },
  error: {
    color: '#dc3545',
    fontSize: 12,
    marginTop: 5,
  },
  recommendations: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#e9ecef',
    borderRadius: 5,
  },
  recommendationsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  recommendation: {
    fontSize: 14,
    marginBottom: 5,
    lineHeight: 20,
  },
});

export default NetworkDiagnostics;