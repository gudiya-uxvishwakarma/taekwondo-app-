import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  Image,
  Dimensions,
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import RNFS from 'react-native-fs';
import { colors, spacing } from '../theme';
import Icon from '../components/common/Icon';
import API_CONFIG from '../config/api';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CertificateViewModal = ({ visible, certificate, onClose, testID }) => {
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [downloading, setDownloading] = useState(false);
  
  // Reset states when modal opens
  React.useEffect(() => {
    if (visible) {
      setImageLoading(false);
      setImageError(false);
    }
  }, [visible]);
  
  // Early return if no certificate
  if (!certificate) {
    if (!visible) return null;
    
    return (
      <Modal
        visible={visible}
        animationType="fade"
        transparent={true}
        onRequestClose={onClose}
        testID={testID}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.errorContainer}>
            <Icon name="error-outline" size={64} color={colors.error} type="MaterialIcons" />
            <Text style={styles.errorTitle}>No Certificate Data</Text>
            <Text style={styles.errorText}>Certificate information is not available.</Text>
            <TouchableOpacity style={styles.closeButtonBottom} onPress={onClose}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  // Check if certificate has uploaded file
  if (!certificate.imageUrl) {
    return (
      <Modal
        visible={visible}
        animationType="fade"
        transparent={true}
        onRequestClose={onClose}
        testID={testID}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalHeader}>
            <View style={styles.modalHeaderInfo}>
              <Text style={styles.modalTitle}>Certificate</Text>
              <Text style={styles.modalSubtitle}>
                {certificate.student} - {certificate.title}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={onClose}
            >
              <Icon name="close" size={24} color="#fff" type="MaterialIcons" />
            </TouchableOpacity>
          </View>

          <View style={styles.noFileContainer}>
            <Icon name="insert-drive-file" size={64} color="#999" type="MaterialIcons" />
            <Text style={styles.noFileTitle}>No Certificate File</Text>
            <Text style={styles.noFileText}>
              This certificate does not have an uploaded file.
            </Text>
            <TouchableOpacity style={styles.closeButtonBottom} onPress={onClose}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  // Get full URL for certificate
  const certificateUrl = certificate.imageUrl;
  let fullUrl = certificateUrl;
  if (certificateUrl.startsWith('/')) {
    const serverUrl = API_CONFIG.BASE_URL.replace('/api', '');
    fullUrl = `${serverUrl}${certificateUrl}`;
  }

  // Check if it's a PDF
  const isPdf = certificateUrl.toLowerCase().endsWith('.pdf');

  // Request storage permission for Android
  const requestStoragePermission = async () => {
    if (Platform.OS !== 'android') {
      return true;
    }

    try {
      if (Platform.Version >= 33) {
        return true;
      }

      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'App needs access to your storage to download certificates',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );

      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn('Permission error:', err);
      return false;
    }
  };

  // Handle download
  const handleDownload = async () => {
    try {
      setDownloading(true);
      console.log('📥 Downloading certificate:', fullUrl);

      // Request permission
      const hasPermission = await requestStoragePermission();
      if (!hasPermission) {
        Alert.alert('Permission Denied', 'Storage permission is required to download certificates');
        return;
      }

      // Get file extension
      const fileExtension = certificateUrl.split('.').pop() || 'jpg';
      const fileName = `certificate_${certificate.student.replace(/\s+/g, '_')}_${certificate.verificationCode || certificate.id}.${fileExtension}`;
      
      // Determine download path based on platform
      let downloadPath;
      if (Platform.OS === 'ios') {
        downloadPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
      } else {
        // For Android, try multiple download locations
        const possibleDirs = [
          `${RNFS.ExternalStorageDirectoryPath}/Download`,
          `${RNFS.ExternalStorageDirectoryPath}/Downloads`,
          RNFS.DownloadDirectoryPath,
          RNFS.DocumentDirectoryPath
        ];
        
        let downloadDir = null;
        
        // Try to find or create a working directory
        for (const dir of possibleDirs) {
          try {
            const dirExists = await RNFS.exists(dir);
            if (dirExists) {
              downloadDir = dir;
              console.log('✅ Using existing directory:', dir);
              break;
            } else {
              // Try to create it
              await RNFS.mkdir(dir);
              downloadDir = dir;
              console.log('✅ Created directory:', dir);
              break;
            }
          } catch (err) {
            console.log('⚠️ Cannot use directory:', dir, err.message);
          }
        }
        
        if (!downloadDir) {
          // Fallback to document directory which should always work
          downloadDir = RNFS.DocumentDirectoryPath;
          console.log('⚠️ Using fallback directory:', downloadDir);
        }
        
        downloadPath = `${downloadDir}/${fileName}`;
      }

      console.log('📁 Download path:', downloadPath);

      // Try all fallback URLs
      let downloadSuccess = false;
      let lastError = null;

      for (const baseUrl of API_CONFIG.FALLBACK_URLS) {
        try {
          const tryUrl = `${baseUrl.replace('/api', '')}${certificateUrl}`;
          console.log('🔄 Trying URL:', tryUrl);

          const downloadResult = await RNFS.downloadFile({
            fromUrl: tryUrl,
            toFile: downloadPath,
            background: true,
            discretionary: true,
            cacheable: false,
            headers: {
              'Accept': 'image/jpeg,image/png,image/jpg,application/pdf,*/*',
            },
            connectionTimeout: 15000,
            readTimeout: 15000,
          }).promise;

          if (downloadResult.statusCode === 200) {
            console.log('✅ Certificate downloaded successfully');
            downloadSuccess = true;
            
            Alert.alert(
              'Download Complete',
              `Certificate has been saved to your Downloads folder.\n\nFile: ${fileName}`,
              [{ text: 'OK' }]
            );
            break;
          }
        } catch (urlError) {
          console.log('⚠️ Failed to download from:', baseUrl, urlError.message);
          lastError = urlError;
        }
      }

      if (!downloadSuccess) {
        throw lastError || new Error('Failed to download from all available servers');
      }
    } catch (error) {
      console.error('❌ Error downloading certificate:', error);
      Alert.alert('Download Failed', 'Unable to download certificate. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  // Handle PDF view
  const handleViewPdf = async () => {
    try {
      console.log('📄 Opening PDF:', fullUrl);
      await Linking.openURL(fullUrl);
    } catch (error) {
      console.error('❌ Failed to open PDF:', error);
      Alert.alert('Error', 'Unable to open PDF file');
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
      testID={testID}
    >
      <View style={styles.modalOverlay}>
        {/* Header */}
        <View style={styles.modalHeader}>
          <View style={styles.modalHeaderInfo}>
            <Text style={styles.modalTitle}>Certificate</Text>
            {certificate && (
              <Text style={styles.modalSubtitle}>
                {certificate.student} - {certificate.title}
              </Text>
            )}
          </View>
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={onClose}
          >
            <Icon name="close" size={24} color="#fff" type="MaterialIcons" />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.modalContent}>
          {isPdf ? (
            // PDF View
            <View style={styles.pdfContainer}>
              <Icon name="picture-as-pdf" size={80} color={colors.error} type="MaterialIcons" />
              <Text style={styles.pdfTitle}>PDF Certificate</Text>
              <Text style={styles.pdfText}>
                This is a PDF file. Click the button below to open it in your browser.
              </Text>
              <TouchableOpacity style={styles.openPdfButton} onPress={handleViewPdf}>
                <Icon name="open-in-browser" size={20} color="#fff" type="MaterialIcons" />
                <Text style={styles.openPdfButtonText}>Open PDF</Text>
              </TouchableOpacity>
            </View>
          ) : (
            // Image View
            <>
              {imageLoading && (
                <View style={styles.imageLoadingContainer}>
                  <ActivityIndicator size="large" color={colors.primary} />
                  <Text style={styles.imageLoadingText}>Loading certificate...</Text>
                </View>
              )}

              {imageError && (
                <View style={styles.imageErrorContainer}>
                  <Icon name="error-outline" size={48} color={colors.error} type="MaterialIcons" />
                  <Text style={styles.imageErrorText}>Failed to load certificate</Text>
                  <Text style={styles.imageErrorSubtext}>
                    The certificate file may be missing from the server.
                  </Text>
                  <Text style={styles.imageErrorSubtext}>
                    Please contact the admin to re-upload this certificate.
                  </Text>
                </View>
              )}

              <Image
                source={{ 
                  uri: fullUrl,
                  headers: {
                    'Accept': 'image/jpeg,image/png,image/jpg,*/*',
                  },
                }}
                style={styles.modalImage}
                resizeMode="contain"
                onLoadStart={() => {
                  console.log('📸 Image loading started:', fullUrl);
                  setImageLoading(true);
                  setImageError(false);
                }}
                onLoadEnd={() => {
                  console.log('✅ Image loaded successfully');
                  setImageLoading(false);
                }}
                onError={(error) => {
                  console.error('❌ Image load error:', error.nativeEvent.error);
                  setImageLoading(false);
                  setImageError(true);
                  
                  // Show helpful alert for 404 errors
                  if (error.nativeEvent.error && error.nativeEvent.error.includes('404')) {
                    Alert.alert(
                      'Certificate File Not Found',
                      'The certificate file is missing from the server. Please ask the admin to re-upload this certificate.',
                      [{ text: 'OK', onPress: onClose }]
                    );
                  }
                }}
              />
            </>
          )}
        </View>

        {/* Footer */}
        {certificate && (
          <View style={styles.modalFooter}>
            <Text style={styles.certificateCodeText}>
              Code: {certificate.verificationCode || certificate.id}
            </Text>
            <TouchableOpacity 
              style={styles.downloadButtonFooter} 
              onPress={handleDownload}
              disabled={downloading}
            >
              {downloading ? (
                <ActivityIndicator size={20} color="#fff" />
              ) : (
                <>
                  <Icon name="file-download" size={20} color="#fff" type="MaterialIcons" />
                  <Text style={styles.downloadButtonText}>Download</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },
  modalHeaderInfo: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
    marginBottom: spacing.xs,
  },
  modalSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  modalCloseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalImage: {
    width: SCREEN_WIDTH - 40,
    height: '100%',
  },
  imageLoadingContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageLoadingText: {
    color: '#fff',
    marginTop: spacing.md,
    fontSize: 14,
  },
  imageErrorContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  imageErrorText: {
    color: colors.error,
    marginTop: spacing.md,
    fontSize: 16,
    fontWeight: '700',
  },
  imageErrorSubtext: {
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: spacing.xs,
    fontSize: 14,
    textAlign: 'center',
  },
  pdfContainer: {
    alignItems: 'center',
    padding: spacing.xl,
  },
  pdfTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  pdfText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 24,
  },
  openPdfButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 12,
    gap: spacing.sm,
  },
  openPdfButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  certificateCodeText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    fontFamily: 'monospace',
    flex: 1,
  },
  downloadButtonFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.success,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 12,
    gap: spacing.xs,
  },
  downloadButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  errorText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  noFileContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  noFileTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  noFileText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 24,
  },
  closeButtonBottom: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 12,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default CertificateViewModal;
