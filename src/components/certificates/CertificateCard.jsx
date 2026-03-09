import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  Alert,
  Linking,
  Modal,
  Image,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { colors, spacing } from '../../theme';
import Icon from '../common/Icon';
import CertificatePDFService from '../../services/CertificatePDFService';
import RNFS from 'react-native-fs';
import API_CONFIG from '../../config/api';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CertificateCard = ({ certificate, onView, testID }) => {
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  if (!certificate) return null;

  const getBeltColor = (title) => {
    const titleLower = title?.toLowerCase() || '';
    if (titleLower.includes('yellow')) return '#FFD700';
    if (titleLower.includes('orange')) return '#FFA500';
    if (titleLower.includes('green')) return '#32CD32';
    if (titleLower.includes('blue')) return '#1E90FF';
    if (titleLower.includes('brown')) return '#8B4513';
    if (titleLower.includes('red')) return '#DC143C';
    if (titleLower.includes('black')) return '#000000';
    return '#FFD700'; // Default yellow
  };

  const formatDate = (dateString) => {
    if (!dateString) return new Date().toLocaleDateString();
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  const handleDownload = async () => {
    try {
      console.log('📥 Starting certificate download:', certificate.title);
      
      // Use the main download method - direct PDF download with exact view design
      const result = await CertificatePDFService.downloadCertificatePDF(certificate);
      
      if (result.success) {
        console.log('✅ Certificate PDF download completed:', result.fileName);
        // Success message is already shown by the service
      } else {
        console.error('❌ Certificate download failed:', result.error);
        Alert.alert(
          'Download Failed', 
          'Failed to download certificate. Please try again.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('❌ Certificate download error:', error);
      Alert.alert(
        'Download Error', 
        'Failed to download certificate. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleViewUploaded = () => {
    if (!certificate.imageUrl) {
      // If no uploaded file, show the generated certificate view
      onView && onView(certificate);
      return;
    }

    const fileUrl = certificate.imageUrl.startsWith('http') 
      ? certificate.imageUrl 
      : `${API_CONFIG.BASE_URL}${certificate.imageUrl}`;

    console.log('👁️ Viewing uploaded certificate:', fileUrl);

    // Check if it's a PDF
    if (fileUrl.toLowerCase().endsWith('.pdf')) {
      // Open PDF in browser
      Linking.openURL(fileUrl).catch(err => {
        console.error('❌ Error opening PDF:', err);
        Alert.alert('Error', 'Failed to open PDF file');
      });
    } else {
      // Show image in modal
      setShowImageModal(true);
    }
  };

  const handleDownloadUploaded = async () => {
    if (!certificate.imageUrl) return;

    try {
      setDownloading(true);
      const fileUrl = certificate.imageUrl.startsWith('http') 
        ? certificate.imageUrl 
        : `${API_CONFIG.BASE_URL}${certificate.imageUrl}`;

      console.log('📥 Downloading uploaded certificate:', fileUrl);

      const filename = certificate.imageUrl.split('/').pop();
      const ext = filename.split('.').pop();
      const downloadFilename = `certificate_${certificate.student.replace(/\s+/g, '_')}_${certificate.id}.${ext}`;
      const downloadPath = `${RNFS.DownloadDirectoryPath}/${downloadFilename}`;

      console.log('📁 Download path:', downloadPath);

      // Try all possible URLs
      const urls = [
        fileUrl,
        `${API_CONFIG.FALLBACK_URLS[0]}${certificate.imageUrl}`,
        `${API_CONFIG.FALLBACK_URLS[1]}${certificate.imageUrl}`,
      ];

      let downloaded = false;
      for (const url of urls) {
        try {
          console.log('🔄 Trying URL:', url);
          const result = await RNFS.downloadFile({
            fromUrl: url,
            toFile: downloadPath,
          }).promise;

          if (result.statusCode === 200 && result.bytesWritten > 0) {
            console.log('✅ Download successful:', downloadPath);
            Alert.alert(
              'Download Complete',
              `Certificate downloaded to Downloads folder:\n${downloadFilename}`,
              [{ text: 'OK' }]
            );
            downloaded = true;
            break;
          }
        } catch (err) {
          console.log('⚠️ Failed to download from:', url, err.message);
        }
      }

      if (!downloaded) {
        throw new Error('Certificate file not found on server');
      }
    } catch (error) {
      console.error('❌ Error downloading certificate:', error);
      Alert.alert('Download Failed', 'Failed to download certificate file');
    } finally {
      setDownloading(false);
    }
  };

  const beltColor = getBeltColor(certificate.title);
  const hasUploadedFile = !!certificate.imageUrl;

  return (
    <>
      <View style={styles.certificateCard} testID={testID}>
        {/* Certificate Icon */}
        <View style={[styles.iconContainer, { backgroundColor: beltColor + '20' }]}>
          <Icon 
            name="certificate" 
            size={32} 
            color={beltColor} 
            type="MaterialCommunityIcons" 
          />
        </View>

        {/* Certificate Content */}
        <View style={styles.contentContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.certificateTitle} numberOfLines={1}>
              {certificate.title || 'Certificate'}
            </Text>
            <View style={[styles.statusBadge, { backgroundColor: beltColor + '15' }]}>
              <Text style={[styles.statusText, { color: beltColor }]}>
                {certificate.status || 'Active'}
              </Text>
            </View>
          </View>

          <Text style={styles.studentName} numberOfLines={1}>
            Student: {certificate.student || 'Student Name'}
          </Text>
          
          <Text style={styles.certificateType} numberOfLines={1}>
            {certificate.type || 'Achievement'}
          </Text>
          
          <Text style={styles.issueDate}>
            Issued: {formatDate(certificate.issueDate)}
          </Text>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            {hasUploadedFile ? (
              // If uploaded file exists, show it directly
              <>
                <TouchableOpacity 
                  style={styles.viewButton} 
                  onPress={handleViewUploaded}
                  activeOpacity={0.7}
                  accessibilityLabel="View uploaded certificate"
                  accessibilityRole="button"
                >
                  <Icon name="visibility" size={18} color={colors.primary} type="MaterialIcons" />
                  <Text style={styles.viewButtonText}>View Certificate</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.downloadButton} 
                  onPress={handleDownloadUploaded}
                  activeOpacity={0.7}
                  accessibilityLabel="Download certificate file"
                  accessibilityRole="button"
                  disabled={downloading}
                >
                  {downloading ? (
                    <ActivityIndicator size="small" color={colors.white} />
                  ) : (
                    <>
                      <Icon name="file-download" size={18} color={colors.white} type="MaterialIcons" />
                      <Text style={styles.downloadButtonText}>Download</Text>
                    </>
                  )}
                </TouchableOpacity>
              </>
            ) : (
              // If no uploaded file, show generated certificate options
              <>
                <TouchableOpacity 
                  style={styles.viewButton} 
                  onPress={() => onView && onView(certificate)}
                  activeOpacity={0.7}
                  accessibilityLabel="View certificate"
                  accessibilityRole="button"
                >
                  <Icon name="visibility" size={18} color={colors.primary} type="MaterialIcons" />
                  <Text style={styles.viewButtonText}>View</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.downloadButton} 
                  onPress={handleDownload}
                  activeOpacity={0.7}
                  accessibilityLabel="Download certificate as PDF"
                  accessibilityRole="button"
                >
                  <Icon name="file-download" size={18} color={colors.white} type="MaterialIcons" />
                  <Text style={styles.downloadButtonText}>Download PDF</Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          {/* Remove the separate uploaded section since we're showing it in main buttons */}
        </View>
      </View>

      {/* Image Modal */}
      {hasUploadedFile && !certificate.imageUrl.toLowerCase().endsWith('.pdf') && (
        <Modal
          visible={showImageModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowImageModal(false)}
        >
          <View style={styles.modalContainer}>
            <TouchableOpacity 
              style={styles.modalOverlay} 
              activeOpacity={1} 
              onPress={() => setShowImageModal(false)}
            >
              <View style={styles.modalContent}>
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={() => setShowImageModal(false)}
                >
                  <Icon name="close" size={24} color={colors.white} type="MaterialIcons" />
                </TouchableOpacity>

                {imageLoading && (
                  <ActivityIndicator size="large" color={colors.primary} style={styles.imageLoader} />
                )}

                <Image
                  source={{ 
                    uri: certificate.imageUrl.startsWith('http') 
                      ? certificate.imageUrl 
                      : `${API_CONFIG.BASE_URL}${certificate.imageUrl}`
                  }}
                  style={styles.modalImage}
                  resizeMode="contain"
                  onLoadStart={() => setImageLoading(true)}
                  onLoadEnd={() => setImageLoading(false)}
                  onError={(error) => {
                    console.error('❌ Image load error:', error);
                    setImageLoading(false);
                    Alert.alert('Error', 'Failed to load certificate image');
                    setShowImageModal(false);
                  }}
                />
              </View>
            </TouchableOpacity>
          </View>
        </Modal>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  certificateCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  contentContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  certificateTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1a1a2e',
    flex: 1,
    marginRight: spacing.sm,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  studentName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  certificateType: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  issueDate: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textMuted,
    marginBottom: spacing.md,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary + '15',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 12,
    gap: spacing.xs,
    flex: 1,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.primary + '30',
  },
  viewButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.success,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 12,
    gap: spacing.xs,
    flex: 1,
    justifyContent: 'center',
    shadowColor: colors.success,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  downloadButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.white,
  },
  // Uploaded Certificate Section
  uploadedSection: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  uploadedLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  uploadedButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  uploadedViewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.success + '15',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 12,
    gap: spacing.xs,
    flex: 1,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.success + '30',
  },
  uploadedViewText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.success,
  },
  uploadedDownloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B35',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 12,
    gap: spacing.xs,
    flex: 1,
    justifyContent: 'center',
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  uploadedDownloadText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.white,
  },
  // Image Modal
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: SCREEN_WIDTH - 40,
    maxHeight: '80%',
    backgroundColor: '#000',
    borderRadius: 16,
    overflow: 'hidden',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: '100%',
    height: 500,
  },
  imageLoader: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -20,
    marginTop: -20,
    zIndex: 5,
  },
});

export default CertificateCard;