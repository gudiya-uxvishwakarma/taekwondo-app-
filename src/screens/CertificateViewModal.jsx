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
} from 'react-native';
import { colors, spacing } from '../theme';
import Icon from '../components/common/Icon';
import Logo from '../components/common/Logo';
import CertificatePDFService from '../services/CertificatePDFService';

const { width: screenWidth } = Dimensions.get('window');

const CertificateViewModal = ({ visible, certificate, onClose, testID }) => {
  const [downloading, setDownloading] = useState(false);
  
  if (!certificate) return null;

  const handleDownloadCertificate = async () => {
    try {
      console.log('📥 Downloading certificate PDF from modal:', certificate.title);
      setDownloading(true);
      
      // Use the main download method - direct PDF download only
      const result = await CertificatePDFService.downloadCertificatePDF(certificate);
      
      if (result.success) {
        console.log('✅ Certificate PDF download completed from modal:', result.fileName);
      } else {
        console.error('❌ Certificate download failed from modal:', result.error);
      }
    } catch (error) {
      console.error('❌ Certificate download failed from modal:', error);
    } finally {
      setDownloading(false);
    }
  };

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

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Professional Certificate Design - Clean View Only */}
          <View style={styles.certificateContainer}>
            {/* Outer golden decorative frame */}
            <View style={styles.outerFrame}>
              {/* Inner certificate content with cream background */}
              <View style={styles.innerFrame}>
              
              {/* Top decorative corners */}
              <View style={styles.topCorners}>
                <View style={styles.cornerDecoration} />
                <View style={styles.cornerDecoration} />
              </View>

              {/* Header with Logo Integration */}
              <View style={styles.headerSection}>
                <Logo size="medium" showText={false} />
                <Text style={styles.organizationName}>TAEKWON-DO ASSOCIATION OF KARNATAKA</Text>
              </View>

              {/* Certificate Title Section */}
              <View style={styles.certificateTitleSection}>
                <Text style={styles.certificateMainTitle}>CERTIFICATE</Text>
                <View style={styles.titleUnderline} />
                <Text style={styles.certificateSubTitle}>OF ACHIEVEMENT</Text>
                <Text style={styles.certificateDiscipline}>IN TAEKWONDO</Text>
              </View>

              {/* Decorative ornament */}
              <View style={styles.decorativeOrnament}>
                <Text style={styles.ornamentText}>❋</Text>
              </View>

              {/* Presented To Section */}
              <View style={styles.presentedSection}>
                <Text style={styles.presentedText}>Proudly Presented To</Text>
                <Text style={styles.studentName}>{(certificate.student || 'STUDENT NAME').toUpperCase()}</Text>
                <Text style={styles.achievementText}>
                  For Outstanding Performance & Dedication in Taekwondo
                </Text>
              </View>

              {/* Award Date Section */}
              <View style={styles.dateSection}>
                <Text style={styles.awardedText}>Awarded This</Text>
                <Text style={styles.dateText}>{formatDate(certificate.issueDate)}</Text>
              </View>

              {/* Level and Rank Section */}
              <View style={styles.levelRankSection}>
                <Text style={styles.levelRankText}>
                  LEVEL: <Text style={[styles.levelValue, { color: getBeltColor(certificate.title) }]}>
                    {(certificate.title || 'YELLOW BELT').toUpperCase()}
                  </Text>
                </Text>
              </View>

              {/* QR Code Section - Positioned on the right side */}
              <View style={styles.qrSection}>
                <View style={styles.qrContainer}>
                  <View style={styles.qrCode}>
                    <View style={styles.qrPattern}>
                      {/* QR Pattern Grid */}
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
                  <Text style={styles.qrLabel}>VERIFY{'\n'}CERTIFICATE</Text>
                  <Text style={styles.qrCodeText}>{certificate.verificationCode || certificate.id || 'TKD2026'}</Text>
                </View>
              </View>

              {/* Signatures Section */}
              <View style={styles.signaturesSection}>
                <View style={styles.signatureLeft}>
                  <Text style={styles.signatureTitle}>Master Instructor</Text>
                  <View style={styles.signatureLine} />
                  <Text style={styles.signatureName}>Master Kim</Text>
                </View>
                
                <View style={styles.signatureRight}>
                  <Text style={styles.signatureTitle}>Academy Director</Text>
                  <View style={styles.signatureLine} />
                  <Text style={styles.signatureName}>David Lee</Text>
                </View>
              </View>

              {/* Certificate Footer */}
              <View style={styles.certificateFooter}>
                <Text style={styles.certificateId}>
                  CERTIFICATE ID: {certificate.verificationCode || certificate.id || 'TKD20264578'}
                </Text>
              </View>

              {/* Bottom decorative corners */}
              <View style={styles.bottomCorners}>
                <View style={styles.cornerDecoration} />
                <View style={styles.cornerDecoration} />
              </View>
            </View>
          </View>
        </View>
        </ScrollView>
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
  headerActions: {
    flexDirection: 'row',
    gap: spacing.sm,
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
  
  // Certificate Design - Professional Layout
  certificateContainer: {
    marginBottom: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 10,
    alignSelf: 'center',
    width: screenWidth - 20,
    minHeight: 600,
    maxWidth: 450,
  },
  
  // Outer golden decorative frame
  outerFrame: {
    backgroundColor: '#DAA520',
    borderRadius: 20,
    padding: 8,
    flex: 1,
    borderWidth: 3,
    borderColor: '#B8860B',
  },
  
  // Inner certificate frame (cream background)
  innerFrame: {
    backgroundColor: '#FFF8DC',
    borderRadius: 12,
    padding: spacing.lg,
    position: 'relative',
    minHeight: 580,
    borderWidth: 2,
    borderColor: '#DAA520',
  },
  
  // Decorative corners
  topCorners: {
    position: 'absolute',
    top: 8,
    left: 8,
    right: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bottomCorners: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    right: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cornerDecoration: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#DAA520',
    borderRadius: 3,
    backgroundColor: 'rgba(218, 165, 32, 0.2)',
  },
  
  // Header Section with Logo
  headerSection: {
    alignItems: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  organizationName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#8B4513',
    letterSpacing: 1,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  
  // Certificate Title Section
  certificateTitleSection: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  certificateMainTitle: {
    fontSize: 36,
    fontWeight: '900',
    color: '#8B4513',
    letterSpacing: 4,
    textAlign: 'center',
  },
  titleUnderline: {
    width: 180,
    height: 3,
    backgroundColor: '#8B4513',
    marginVertical: 8,
  },
  certificateSubTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#8B4513',
    letterSpacing: 2,
    textAlign: 'center',
  },
  certificateDiscipline: {
    fontSize: 16,
    fontWeight: '600',
    color: '#DC143C',
    letterSpacing: 1.5,
    textAlign: 'center',
    marginTop: 4,
  },
  
  // Decorative ornament
  decorativeOrnament: {
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  ornamentText: {
    fontSize: 24,
    color: '#DAA520',
  },
  
  // Presented To Section
  presentedSection: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  presentedText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B4513',
    fontStyle: 'italic',
    marginBottom: spacing.sm,
    fontFamily: 'serif',
  },
  studentName: {
    fontSize: 28,
    fontWeight: '900',
    color: '#2C1810',
    textAlign: 'center',
    letterSpacing: 2,
    marginBottom: spacing.sm,
  },
  achievementText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B4513',
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 20,
    fontFamily: 'serif',
  },
  
  // Date Section
  dateSection: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  awardedText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B4513',
    marginBottom: spacing.sm,
    fontFamily: 'serif',
  },
  dateText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#DC143C',
    letterSpacing: 1,
  },
  
  // Level and Rank Section
  levelRankSection: {
    alignItems: 'center',
    marginBottom: spacing.lg,
    backgroundColor: 'rgba(218, 165, 32, 0.1)',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: 12,
    borderWidth: 10,
    borderColor: '#DAA520',
  },
  levelRankText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2C1810',
    letterSpacing: 1,
    textAlign: 'center',
  },
  levelValue: {
    fontWeight: '900',
    fontSize: 17,
  },
  rankValue: {
    fontWeight: '900',
    color: '#8B4513',
    fontSize: 17,
  },
  superscript: {
    fontSize: 12,
    lineHeight: 22,
  },
  
  // QR Code Section - Positioned on the right side
  qrSection: {
    position: 'absolute',
    right: 20,
    top: '45%',
    alignItems: 'center',
  },
  qrContainer: {
    alignItems: 'center',
  },
  qrCode: {
    width: 60,
    height: 60,
    backgroundColor: '#fff',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    borderWidth: 3,
    borderColor: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  qrPattern: {
    width: 45,
    height: 45,
    backgroundColor: '#333',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 30,
    height: 30,
  },
  qrDot: {
    width: 8,
    height: 8,
    backgroundColor: 'transparent',
    margin: 1,
  },
  qrDotActive: {
    backgroundColor: '#fff',
  },
  qrLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    lineHeight: 11,
    marginBottom: 4,
  },
  qrCodeText: {
    fontSize: 8,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
  },
  
  // Signatures Section
  signaturesSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.xl,
    marginTop: spacing.xl,
  },
  signatureLeft: {
    alignItems: 'center',
    flex: 1,
  },
  signatureRight: {
    alignItems: 'center',
    flex: 1,
  },
  signatureTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8B4513',
    fontStyle: 'italic',
    marginBottom: spacing.sm,
    fontFamily: 'serif',
  },
  signatureLine: {
    width: 100,
    height: 2,
    backgroundColor: '#8B4513',
    marginBottom: spacing.sm,
  },
  signatureName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2C1810',
  },
  
  // Certificate Footer
  certificateFooter: {
    alignItems: 'center',
    marginTop: spacing.md,
  },
  certificateId: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8B4513',
    letterSpacing: 1,
    marginBottom: 4,
  },
  websiteUrl: {
    fontSize: 10,
    fontWeight: '600',
    color: '#B8860B',
  },
});

export default CertificateViewModal;