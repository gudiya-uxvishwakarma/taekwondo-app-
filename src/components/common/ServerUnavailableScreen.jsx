import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ServerUnavailableScreen = ({ onRetry, error }) => {
  const [retrying, setRetrying] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleRetry = async () => {
    setRetrying(true);
    setCountdown(5);
    try {
      await onRetry();
    } finally {
      setRetrying(false);
    }
  };

  const is503Error = error?.message?.includes('503') || error?.includes('503');

  return (
    <View style={styles.container}>
      <Icon name="server-off" size={80} color="#FF6B6B" />
      
      <Text style={styles.title}>
        {is503Error ? 'Server Unavailable' : 'Connection Error'}
      </Text>
      
      <Text style={styles.message}>
        {is503Error 
          ? 'The server is temporarily unavailable. This usually means the server is down or undergoing maintenance.'
          : error?.message || 'Unable to connect to the server. Please check your internet connection.'}
      </Text>

      {is503Error && (
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>What does this mean?</Text>
          <Text style={styles.infoText}>• The backend server may be restarting</Text>
          <Text style={styles.infoText}>• Server maintenance is in progress</Text>
          <Text style={styles.infoText}>• Server resources are exhausted</Text>
          <Text style={styles.infoText}>• Network configuration issues</Text>
        </View>
      )}

      <TouchableOpacity
        style={[styles.retryButton, retrying && styles.retryButtonDisabled]}
        onPress={handleRetry}
        disabled={retrying || countdown > 0}
      >
        {retrying ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <>
            <Icon name="refresh" size={20} color="#FFF" style={styles.retryIcon} />
            <Text style={styles.retryText}>
              {countdown > 0 ? `Retry in ${countdown}s` : 'Retry Connection'}
            </Text>
          </>
        )}
      </TouchableOpacity>

      <Text style={styles.helpText}>
        If the problem persists, please contact support or try again later.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  infoBox: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    width: '100%',
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B6B',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
    lineHeight: 20,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4A90E2',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginBottom: 15,
  },
  retryButtonDisabled: {
    backgroundColor: '#CCC',
  },
  retryIcon: {
    marginRight: 8,
  },
  retryText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  helpText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default ServerUnavailableScreen;
