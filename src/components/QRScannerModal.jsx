import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Alert,
  TextInput,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const QRScannerModal = ({ visible, onClose, onScanResult }) => {
  const [manualCode, setManualCode] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const handleManualVerification = async () => {
    if (!manualCode.trim()) {
      Alert.alert('Error', 'Please enter a certificate ID or verification code');
      return;
    }

    try {
      setIsScanning(true);
      
      // Simulate verification process
      setTimeout(() => {
        setIsScanning(false);
        
        // Mock verification result
        const mockCertificate = {
          id: manualCode.trim(),
          student: 'John Doe',
          title: 'Black Belt Achievement',
          type: 'Belt Promotion',
          issueDate: 'January 28, 2025',
          instructor: 'Master Kim',
          verificationCode: `VERIFY-${manualCode.trim()}`,
          isValid: true,
          verifiedAt: new Date().toISOString(),
        };
        
        onScanResult(mockCertificate);
        setManualCode('');
      }, 2000);
      
    } catch (error) {
      setIsScanning(false);
      Alert.alert('Verification Error', 'Failed to verify certificate. Please try again.');
    }
  };

  const handleQRScan = () => {
    // Simulate QR scan
    Alert.alert(
      'QR Scanner',
      'QR Scanner would open here. For demo purposes, we\'ll use manual entry.',
      [
        { text: 'OK', onPress: () => {} }
      ]
    );
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>🔍 Verify Certificate</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            {/* QR Scanner Section */}
            <View style={styles.scannerSection}>
              <View style={styles.scannerPlaceholder}>
                <Icon name="qr-code-scanner" size={80} color="#007AFF" />
                <Text style={styles.scannerText}>QR Code Scanner</Text>
                <Text style={styles.scannerSubtext}>
                  Point your camera at the QR code on the certificate
                </Text>
              </View>
              
              <TouchableOpacity 
                style={styles.scanButton}
                onPress={handleQRScan}
              >
                <Icon name="camera-alt" size={20} color="#fff" />
                <Text style={styles.scanButtonText}>Start QR Scan</Text>
              </TouchableOpacity>
            </View>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Manual Entry Section */}
            <View style={styles.manualSection}>
              <Text style={styles.manualTitle}>Manual Verification</Text>
              <Text style={styles.manualSubtext}>
                Enter the Certificate ID or Verification Code
              </Text>
              
              <TextInput
                style={styles.input}
                placeholder="Enter Certificate ID (e.g., CERT-123456)"
                value={manualCode}
                onChangeText={setManualCode}
                autoCapitalize="characters"
                autoCorrect={false}
              />
              
              <TouchableOpacity 
                style={[styles.verifyButton, isScanning && styles.verifyButtonDisabled]}
                onPress={handleManualVerification}
                disabled={isScanning}
              >
                {isScanning ? (
                  <>
                    <Icon name="hourglass-empty" size={20} color="#fff" />
                    <Text style={styles.verifyButtonText}>Verifying...</Text>
                  </>
                ) : (
                  <>
                    <Icon name="verified" size={20} color="#fff" />
                    <Text style={styles.verifyButtonText}>Verify Certificate</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            {/* Instructions */}
            <View style={styles.instructionsSection}>
              <Text style={styles.instructionsTitle}>📋 How to Verify</Text>
              <View style={styles.instructionItem}>
                <Icon name="qr-code" size={16} color="#007AFF" />
                <Text style={styles.instructionText}>
                  Scan the QR code on the certificate using the camera
                </Text>
              </View>
              <View style={styles.instructionItem}>
                <Icon name="edit" size={16} color="#007AFF" />
                <Text style={styles.instructionText}>
                  Or manually enter the Certificate ID or Verification Code
                </Text>
              </View>
              <View style={styles.instructionItem}>
                <Icon name="verified" size={16} color="#28a745" />
                <Text style={styles.instructionText}>
                  Get instant verification results with certificate details
                </Text>
              </View>
            </View>
          </ScrollView>

          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={onClose}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  scannerSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  scannerPlaceholder: {
    width: 250,
    height: 200,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#007AFF',
    borderStyle: 'dashed',
    marginBottom: 20,
  },
  scannerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
    marginTop: 10,
  },
  scannerSubtext: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
    paddingHorizontal: 20,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 30,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  dividerText: {
    fontSize: 14,
    color: '#666',
    marginHorizontal: 15,
    fontWeight: '500',
  },
  manualSection: {
    marginBottom: 30,
  },
  manualTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  manualSubtext: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: '#f8f9fa',
  },
  verifyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#28a745',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    gap: 8,
  },
  verifyButtonDisabled: {
    backgroundColor: '#6c757d',
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  instructionsSection: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 15,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 10,
  },
  instructionText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
    lineHeight: 20,
  },
  cancelButton: {
    marginHorizontal: 20,
    marginVertical: 20,
    paddingVertical: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
});

export default QRScannerModal;