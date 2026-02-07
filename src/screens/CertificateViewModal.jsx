import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { colors, spacing } from '../theme';
import Icon from '../components/common/Icon';
import Logo from '../components/common/Logo';
import CertificatePDFService from '../services/CertificatePDFService';

const { width: screenWidth } = Dimensions.get('window');

const CertificateViewModal = ({ visible, certificate, onClose, testID }) => {
  const [downloading, setDownloading] = useState(false);
  const [modalError, setModalError] = useState(null);
  
  // Reset errors when modal opens - MUST be at top level
  React.useEffect(() => {
    if (visible) {
      setModalError(null);
    }
  }, [visible]);
  
  // Early return AFTER all hooks - but still render modal structure
  if (!certificate) {
    console.log('⚠️ Certificate data is null or undefined');
    if (!visible) return null;
    
    return (
      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={onClose}
        testID={testID}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Icon name="close" size={24} color={colors.white} type="MaterialIcons" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Certificate View</Text>
            <View style={styles.headerSpacer} />
          </View>
          
          <View style={styles.errorContainer}>
            <Icon name="error" size={48} color="#FF5722" type="MaterialIcons" />
            <Text style={styles.errorTitle}>No Certificate Data</Text>
            <Text style={styles.errorText}>Certificate information is not available.</Text>
            <TouchableOpacity 
              style={styles.retryButton} 
              onPress={onClose}
            >
              <Text style={styles.retryButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  // Add error handling for certificate data
  const safeGetValue = (value, fallback = '') => {
    try {
      if (value === null || value === undefined) {
        return fallback;
      }
      return value || fallback;
    } catch (error) {
      console.log('Error accessing certificate value:', error);
      setModalError('Error loading certificate data');
      return fallback;
    }
  };

  const handleDownloadCertificate = async () => {
    try {
      console.log('📥 Starting certificate PDF download from modal:', safeGetValue(certificate.title, 'Certificate'));
      setDownloading(true);
      
      // Use the main download method - same as card
      const result = await CertificatePDFService.downloadCertificatePDF(certificate);
      
      if (result.success) {
        console.log('✅ Certificate PDF download completed from modal:', result.fileName);
        Alert.alert(
          'Download Successful! 🎉',
          `Certificate PDF downloaded successfully!\n\nFile: ${result.fileName}`,
          [{ text: 'Great!' }]
        );
      } else {
        console.error('❌ Certificate download failed from modal:', result.error);
        if (result.fallback) {
          Alert.alert(
            'PDF Feature Unavailable',
            'PDF download is temporarily unavailable, but you can still view this certificate on screen.',
            [{ text: 'OK' }]
          );
        } else {
          Alert.alert(
            'Download Failed',
            'Failed to download certificate PDF. Please try again.',
            [{ text: 'Retry', onPress: handleDownloadCertificate }, { text: 'OK' }]
          );
        }
      }
    } catch (error) {
      console.error('❌ Certificate download failed from modal:', error);
      Alert.alert(
        'Download Error',
        'An unexpected error occurred while downloading the certificate PDF.',
        [{ text: 'Retry', onPress: handleDownloadCertificate }, { text: 'OK' }]
      );
    } finally {
      setDownloading(false);
    }
  };

  const getBeltColor = (title) => {
    try {
      const titleLower = safeGetValue(title, '').toLowerCase();
      if (titleLower.includes('yellow')) return '#FFD700';
      if (titleLower.includes('orange')) return '#FFA500';
      if (titleLower.includes('green')) return '#32CD32';
      if (titleLower.includes('blue')) return '#1E90FF';
      if (titleLower.includes('brown')) return '#8B4513';
      if (titleLower.includes('red')) return '#DC143C';
      if (titleLower.includes('black')) return '#000000';
      return '#FFD700'; // Default yellow
    } catch (error) {
      console.log('Error getting belt color:', error);
      return '#FFD700';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) {
      const today = new Date();
      const day = today.getDate();
      const month = today.toLocaleDateString('en-GB', { month: 'long' });
      const year = today.getFullYear();
      return `${day}${day === 1 ? 'st' : day === 2 ? 'nd' : day === 3 ? 'rd' : 'th'} ${month} ${year}`;
    }
    
    try {
      const date = new Date(dateString);
      const day = date.getDate();
      const month = date.toLocaleDateString('en-GB', { month: 'long' });
      const year = date.getFullYear();
      return `${day}${day === 1 ? 'st' : day === 2 ? 'nd' : day === 3 ? 'rd' : 'th'} ${month} ${year}`;
    } catch {
      return dateString;
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
      testID={testID}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Icon name="close" size={24} color={colors.white} type="MaterialIcons" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Certificate View</Text>
          <TouchableOpacity 
            style={styles.downloadButton} 
            onPress={handleDownloadCertificate}
            activeOpacity={0.7}
            disabled={downloading}
          >
            {downloading ? (
              <ActivityIndicator size={20} color={colors.white} />
            ) : (
              <Icon name="download" size={24} color={colors.white} type="MaterialIcons" />
            )}
          </TouchableOpacity>
        </View>

        {modalError ? (
          <View style={styles.errorContainer}>
            <Icon name="error" size={48} color="#FF5722" type="MaterialIcons" />
            <Text style={styles.errorTitle}>Something went wrong</Text>
            <Text style={styles.errorText}>{modalError}</Text>
            <TouchableOpacity 
              style={styles.retryButton} 
              onPress={() => setModalError(null)}
            >
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Professional Certificate Design - Enhanced Beautiful Layout */}
          <View style={styles.certificateContainer}>
            {/* Outer decorative border with gradient effect */}
            <View style={styles.outerBorder}>
              {/* Main certificate background */}
              <View style={styles.certificateBackground}>
                
                {/* Decorative corner elements */}
                <View style={styles.cornerTopLeft} />
                <View style={styles.cornerTopRight} />
                <View style={styles.cornerBottomLeft} />
                <View style={styles.cornerBottomRight} />
                
                {/* Header Section with Logo and Title */}
                <View style={styles.certificateHeader}>
                  <View style={styles.logoSection}>
                    <View style={styles.logoContainer}>
                      <Logo size="large" showText={false} variant="certificate" />
                    </View>
                  </View>
                  
                  <View style={styles.titleSection}>
                    <Text style={styles.mainTitle}>CERTIFICATE</Text>
                    <View style={styles.titleDivider} />
                    <Text style={styles.subTitle}>OF ACHIEVEMENT</Text>
                    <Text style={styles.discipline}>IN TAEKWONDO</Text>
                  </View>
                </View>

                {/* Decorative Taekwondo Elements */}
                <View style={styles.martialArtsSection}>
                  
                  <View style={styles.centerOrnament}>
                    <Text style={styles.ornament}>⚡</Text>
                  </View>
                  <View style={styles.rightFigure}>
                    <Text style={styles.figureText}>🏆</Text>
                  </View>
                </View>

                {/* Student Information Section */}
                <View style={styles.studentSection}>
                  <Text style={styles.presentedTo}>Proudly Presented To</Text>
                  <Text style={styles.studentNameLarge}>
                    {safeGetValue(certificate.student, 'STUDENT NAME').toUpperCase()}
                  </Text>
                  <Text style={styles.achievementDescription}>
                    For Outstanding Performance & Dedication in Taekwondo
                  </Text>
                </View>

                {/* Award Details Section */}
                <View style={styles.awardSection}>
                  <Text style={styles.awardedLabel}>Awarded This</Text>
                  <Text style={styles.dateDisplay}>{formatDate(safeGetValue(certificate.issueDate))}</Text>
                </View>

                {/* Belt Level Section with Medal Design */}
                <View style={styles.beltSection}>
                  
                  <Text style={styles.levelText}>
                    LEVEL: <Text style={[styles.beltLevel, { color: getBeltColor(certificate.title) }]}>
                      {safeGetValue(certificate.title, 'YELLOW BELT').toUpperCase()}
                    </Text>
                  </Text>
                  <Text style={styles.rankText}>RANK: 4TH GUP</Text>
                </View>

                {/* QR Code and Verification */}
                <View style={styles.verificationSection}>
                  <View style={styles.qrCodeContainer}>
                    <View style={styles.qrCodeBox}>
                      <View style={styles.qrPattern}>
                        <View style={styles.qrGrid}>
                          <View style={[styles.qrDot, styles.qrDotActive]} />
                          <View style={[styles.qrDot]} />
                          <View style={[styles.qrDot, styles.qrDotActive]} />
                          <View style={[styles.qrDot, styles.qrDotActive]} />
                          <View style={[styles.qrDot]} />
                          <View style={[styles.qrDot, styles.qrDotActive]} />
                          <View style={[styles.qrDot, styles.qrDotActive]} />
                          <View style={[styles.qrDot, styles.qrDotActive]} />
                          <View style={[styles.qrDot]} />
                        </View>
                      </View>
                    </View>
                    <Text style={styles.verifyText}>VERIFY CERTIFICATE</Text>
                  </View>
                </View>

                {/* Official Dojang Section */}
                <View style={styles.dojangSection}>
                  <View style={styles.officialSeal}>
                    <Text style={styles.sealText}>OFFICIAL DOJANG</Text>
                  </View>
                </View>

                {/* Signatures Section */}
                <View style={styles.signaturesRow}>
                  <View style={styles.signatureBlock}>
                    <Text style={styles.signatureLabel}>Master Instructor</Text>
                    <View style={styles.signatureLineStyle} />
                    <Text style={styles.signerName}>Master Kim</Text>
                  </View>
                  
                  <View style={styles.signatureBlock}>
                    <Text style={styles.signatureLabel}>Academy Director</Text>
                    <View style={styles.signatureLineStyle} />
                    <Text style={styles.signerName}>David Lee</Text>
                  </View>
                </View>

                {/* Footer Information */}
                <View style={styles.footerSection}>
                  <Text style={styles.certificateIdText}>
                    CERTIFICATE ID: {safeGetValue(certificate.verificationCode) || safeGetValue(certificate.id) || 'TKD20264578'}
                  </Text>
                  <Text style={styles.websiteText}>www.verifycertificate.com</Text>
                </View>

              </View>
            </View>
          </View>
        </ScrollView>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    paddingTop: spacing.lg + 10,
    backgroundColor: colors.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.white,
    letterSpacing: 0.5,
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 44,
  },
  downloadButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  content: {
    flex: 1,
    padding: spacing.sm,
  },
  
  // Enhanced Certificate Design - Beautiful Professional Layout
  certificateContainer: {
    marginBottom: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
    alignSelf: 'center',
    width: screenWidth - 21,
    maxWidth: 480,
  },
  
  // Outer decorative border
  outerBorder: {
    backgroundColor: '#8B4513',
    borderRadius: 16,
    padding: 2,
    borderWidth: 2,
    borderColor: '#654321',
  },
  
  // Main certificate background
  certificateBackground: {
    backgroundColor: '#FFF8DC',
    borderRadius: 12,
    padding: spacing.lg,
    position: 'relative',
    minHeight: 200,
    borderWidth: 3,
    borderColor: '#DAA520',
  },
  
  // Decorative corner elements
  cornerTopLeft: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: 24,
    height: 24,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#DAA520',
    borderTopLeftRadius: 8,
  },
  cornerTopRight: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 24,
    height: 24,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: '#DAA520',
    borderTopRightRadius: 8,
  },
  cornerBottomLeft: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    width: 24,
    height: 24,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#DAA520',
    borderBottomLeftRadius: 8,
  },
  cornerBottomRight: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 24,
    height: 24,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: '#DAA520',
    borderBottomRightRadius: 8,
  },
  
  // Header Section
  certificateHeader: {
    alignItems: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  logoSection: {
    marginBottom: spacing.md,
  },
  logoContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#8B4513',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  titleSection: {
    alignItems: 'center',
  },
  mainTitle: {
    fontSize: 42,
    fontWeight: '900',
    color: '#8B4513',
    letterSpacing: 6,
    textAlign: 'center',
    textShadowColor: 'rgba(139, 69, 19, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  titleDivider: {
    width: 200,
    height: 4,
    backgroundColor: '#DAA520',
    marginVertical: spacing.sm,
    borderRadius: 2,
  },
  subTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#8B4513',
    letterSpacing: 3,
    textAlign: 'center',
  },
  discipline: {
    fontSize: 18,
    fontWeight: '600',
    color: '#DC143C',
    letterSpacing: 2,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  
  // Martial Arts Decorative Section
  martialArtsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
  },
  leftFigure: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(220, 20, 60, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#c4072cff',
  },
  centerOrnament: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(218, 165, 32, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightFigure: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  figureText: {
    fontSize: 28,
  },
  ornament: {
    fontSize: 24,
    color: '#DAA520',
     width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(246, 214, 35, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  
  // Student Information Section
  studentSection: {
    alignItems: 'center',
    marginVertical: spacing.xl,
    paddingVertical: spacing.lg,
    backgroundColor: 'rgba(255, 248, 220, 0.8)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(218, 165, 32, 0.3)',
  },
  presentedTo: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8B4513',
    fontStyle: 'italic',
    marginBottom: spacing.md,
    letterSpacing: 1,
  },
  studentNameLarge: {
    fontSize: 32,
    fontWeight: '900',
    color: '#2C1810',
    textAlign: 'center',
    letterSpacing: 3,
    marginBottom: spacing.md,
    textShadowColor: 'rgba(44, 24, 16, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  achievementDescription: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B4513',
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 22,
    paddingHorizontal: spacing.lg,
  },
  
  // Award Details Section
  awardSection: {
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  awardedLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B4513',
    marginBottom: spacing.sm,
    letterSpacing: 1,
  },
  dateDisplay: {
    fontSize: 24,
    fontWeight: '800',
    color: '#DC143C',
    letterSpacing: 2,
    textShadowColor: 'rgba(220, 20, 60, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  
  // Belt Level Section with Medal
  beltSection: {
    alignItems: 'center',
    marginVertical: spacing.xl,
    paddingVertical: spacing.lg,
    backgroundColor: 'rgba(218, 165, 32, 0.1)',
    borderRadius: 16,
    borderWidth: 3,
    borderColor: '#DAA520',
  },
  medalContainer: {
    marginBottom: spacing.md,
  },
  medal: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#DAA520',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  medalText: {
    fontSize: 32,
  },
  levelText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2C1810',
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  beltLevel: {
    fontWeight: '900',
    fontSize: 20,
  },
  rankText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#8B4513',
    letterSpacing: 1,
  },
  
  // QR Code and Verification Section
  verificationSection: {
    position: 'absolute',
    right: 20,
    top: '50%',
    alignItems: 'center',
  },
  qrCodeContainer: {
    alignItems: 'center',
  },
  qrCodeBox: {
    width: 70,
    height: 70,
    backgroundColor: '#fff',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
    borderWidth: 3,
    borderColor: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  qrPattern: {
    width: 55,
    height: 55,
    backgroundColor: '#333',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 36,
    height: 36,
  },
  qrDot: {
    width: 10,
    height: 10,
    backgroundColor: 'transparent',
    margin: 1,
  },
  qrDotActive: {
    backgroundColor: '#fff',
  },
  verifyText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    lineHeight: 12,
  },
  
  // Official Dojang Section
  dojangSection: {
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  officialSeal: {
    backgroundColor: '#8B4513',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#DAA520',
  },
  sealText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFD700',
    letterSpacing: 1,
  },
  
  // Signatures Section
  signaturesRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  signatureBlock: {
    alignItems: 'center',
    flex: 1,
  },
  signatureLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B4513',
    fontStyle: 'italic',
    marginBottom: spacing.md,
    letterSpacing: 0.5,
  },
  signatureLineStyle: {
    width: 120,
    height: 2,
    backgroundColor: '#8B4513',
    marginBottom: spacing.sm,
  },
  signerName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2C1810',
    letterSpacing: 1,
  },
  
  // Footer Section
  footerSection: {
    alignItems: 'center',
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(218, 165, 32, 0.3)',
  },
  certificateIdText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#8B4513',
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  websiteText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#B8860B',
    letterSpacing: 0.5,
  },
  
  // Error handling styles
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: '#f5f5f5',
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF5722',
    marginTop: spacing.lg,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 24,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 12,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CertificateViewModal;