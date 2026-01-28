import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  ScrollView,
  Dimensions
} from 'react-native';
import { colors, spacing } from '../theme';
import Icon from '../components/common/Icon';
import CertificatePDFService from '../services/CertificatePDFService';

const { width: screenWidth } = Dimensions.get('window');
const CERTIFICATE_DIMENSIONS = CertificatePDFService.getCertificateDimensions();

const CertificateViewModal = ({ visible, certificate, onClose, onDownload, testID }) => {
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
            onPress={() => onDownload && onDownload(certificate)}
            activeOpacity={0.7}
          >
            <Icon name="picture-as-pdf" size={24} color={colors.white} type="MaterialIcons" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Beautiful Certificate Design - Exactly matching the provided image */}
          <View style={styles.certificateContainer}>
            {/* Outer decorative frame */}
            <View style={styles.outerFrame}>
              {/* Inner certificate content */}
              <View style={styles.innerFrame}>
                
                {/* Top decorative corners */}
                <View style={styles.topCorners}>
                  <View style={styles.cornerDecoration} />
                  <View style={styles.cornerDecoration} />
                </View>

                {/* Certificate Header with proper logo placement */}
                <View style={styles.certificateHeader}>
                  {/* Left Side - Taekwondo Association Logo */}
                  <View style={styles.leftLogoContainer}>
                    <View style={styles.logoCircle}>
                      <View style={styles.logoInnerCircle}>
                        {/* TF Symbol at top */}
                        <Text style={styles.tfSymbol}>TF</Text>
                        
                        {/* Left martial artist figure */}
                        <View style={styles.leftMartialArtist}>
                          <Text style={styles.martialArtistEmoji}>🥋</Text>
                        </View>
                        
                        {/* Center figure */}
                        <View style={styles.centerFigure}>
                          <Text style={styles.centerFigureEmoji}>🥋</Text>
                        </View>
                        
                        {/* Right martial artist figure */}
                        <View style={styles.rightMartialArtist}>
                          <Text style={styles.martialArtistEmoji}>🥋</Text>
                        </View>
                        
                        {/* Kannada text at bottom */}
                        <Text style={styles.kannadaText}>ಕರ್ನಾಟಕ</Text>
                      </View>
                      
                      {/* Circular text around the logo */}
                      <Text style={styles.circularTextTop}>TAEKWON-DO ASSOCIATION</Text>
                      <Text style={styles.circularTextBottom}>OF KARNATAKA</Text>
                      
                      {/* Small decorative circles */}
                      <View style={styles.decorativeCircleLeft} />
                      <View style={styles.decorativeCircleRight} />
                    </View>
                  </View>
                  
                  {/* Center Title */}
                  <View style={styles.centerTitleContainer}>
                    <Text style={styles.mainTitle}>CERTIFICATE</Text>
                    <View style={styles.titleDivider} />
                    <Text style={styles.subTitle}>OF ACHIEVEMENT</Text>
                    <Text style={styles.disciplineTitle}>IN TAEKWONDO</Text>
                  </View>
                  
                  {/* Right Side - Mirror logo or decorative element */}
                  <View style={styles.rightDecorationContainer}>
                    <View style={styles.rightDecorativeCircle}>
                      <Text style={styles.rightDecorationText}>🏆</Text>
                    </View>
                  </View>
                </View>

                {/* Decorative gold line */}
                <View style={styles.goldLine} />

                {/* Presented To Section */}
                <View style={styles.presentedSection}>
                  <Text style={styles.presentedText}>Proudly Presented To</Text>
                  <Text style={styles.studentName}>{(certificate.student || 'RAHUL SHARMA').toUpperCase()}</Text>
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
                    </Text> • RANK: <Text style={styles.rankValue}>
                      4<Text style={styles.superscript}>TH</Text> GUP
                    </Text>
                  </Text>
                </View>

                {/* Bottom Section with Medal, Seal, and QR */}
                <View style={styles.bottomSection}>
                  {/* Left Medal */}
                  <View style={styles.medalSection}>
                    <View style={[styles.medalCircle, { backgroundColor: getBeltColor(certificate.title) }]}>
                      <Icon name="military-tech" size={20} color="#fff" type="MaterialIcons" />
                    </View>
                    <Text style={styles.medalLabel}>TAEKWONDO</Text>
                  </View>

                  {/* Center Academy Seal - Enhanced Design */}
                  <View style={styles.sealSection}>
                    <View style={styles.sealCircle}>
                      <View style={styles.sealInner}>
                        {/* Taekwondo symbol with better design */}
                        <View style={styles.sealSymbolContainer}>
                          <Text style={styles.sealSymbol}>☯</Text>
                          <Text style={styles.sealSubText}>TKD</Text>
                        </View>
                      </View>
                    </View>
                    <Text style={styles.sealLabel}>OFFICIAL DOJANG</Text>
                    <Text style={styles.sealSubLabel}>KARNATAKA</Text>
                  </View>

                  {/* Right QR Code */}
                  <View style={styles.qrSection}>
                    <View style={styles.qrContainer}>
                      <View style={styles.qrCode}>
                        <View style={styles.qrPattern}>
                          <Text style={styles.qrText}>⚡</Text>
                        </View>
                      </View>
                      <Text style={styles.qrLabel}>VERIFY CERTIFICATE</Text>
                    </View>
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
                    <Text style={styles.signatureTitle}>David Lee</Text>
                    <View style={styles.signatureLine} />
                    <Text style={styles.signatureName}>David Lee</Text>
                  </View>
                </View>

                {/* Certificate Footer */}
                <View style={styles.certificateFooter}>
                  <View style={styles.footerDivider} />
                  <Text style={styles.certificateId}>
                    CERTIFICATE ID: {certificate.verificationCode || certificate.id || 'TKD20264578'}
                  </Text>
                  <Text style={styles.websiteUrl}>www.verifycertificate.com</Text>
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
    padding: spacing.lg,
  },
  
  // Certificate Design - Matching the exact image with consistent dimensions
  certificateContainer: {
    marginBottom: spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 15,
    alignSelf: 'center',
    width: Math.min(screenWidth - 40, CERTIFICATE_DIMENSIONS.width * 0.9),
    height: Math.min(screenWidth - 20, CERTIFICATE_DIMENSIONS.width * 0.9) / CERTIFICATE_DIMENSIONS.aspectRatio,
  },
  
  // Outer decorative frame (brown border)
  outerFrame: {
    backgroundColor: '#8B4513', // Brown border color
    borderRadius: 20,
    padding: 12,
  },
  
  // Inner certificate frame (cream background)
  innerFrame: {
    backgroundColor: '#FFF8DC', // Cream background
    borderRadius: 12,
    padding: spacing.xl,
    position: 'relative',
  },
  
  // Decorative corners
  topCorners: {
    position: 'absolute',
    top: 15,
    left: 15,
    right: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bottomCorners: {
    position: 'absolute',
    bottom: 15,
    left: 15,
    right: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cornerDecoration: {
    width: 30,
    height: 30,
    borderWidth: 2,
    borderColor: '#DAA520',
    borderRadius: 4,
    backgroundColor: 'rgba(218, 165, 32, 0.1)',
  },
  
  // Certificate Header
  certificateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
    marginTop: spacing.md,
  },
  
  // Left Logo Container - Taekwondo Association Logo
  leftLogoContainer: {
    width: 120,
    alignItems: 'center',
  },
  logoCircle: {
    width: 110,
    height: 50,
    borderRadius: 55,
    backgroundColor: '#FFF8DC',
    borderWidth: 4,
    borderColor: '#8B4513',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  logoInnerCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#FFD700', // Yellow background
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderWidth: 2,
    borderColor: '#8B4513',
  },
  
  // TF Symbol at top
  tfSymbol: {
    position: 'absolute',
    top: 8,
    fontSize: 14,
    fontWeight: '900',
    color: '#8B4513',
    letterSpacing: 1,
  },
  
  // Martial artist figures
  leftMartialArtist: {
    position: 'absolute',
    left: 15,
    top: 25,
  },
  centerFigure: {
    position: 'absolute',
    top: 20,
  },
  rightMartialArtist: {
    position: 'absolute',
    right: 15,
    top: 25,
  },
  martialArtistEmoji: {
    fontSize: 16,
    color: '#8B4513',
  },
  centerFigureEmoji: {
    fontSize: 18,
    color: '#8B4513',
  },
  
  // Kannada text at bottom
  kannadaText: {
    position: 'absolute',
    bottom: 8,
    fontSize: 12,
    fontWeight: '700',
    color: '#8B4513',
  },
  
  // Circular text around logo
  circularTextTop: {
    position: 'absolute',
    top: -25,
    fontSize: 10,
    fontWeight: '700',
    color: '#8B4513',
    letterSpacing: 1,
    textAlign: 'center',
    width: 120,
  },
  circularTextBottom: {
    position: 'absolute',
    bottom: -25,
    fontSize: 10,
    fontWeight: '700',
    color: '#8B4513',
    letterSpacing: 1,
    textAlign: 'center',
    width: 120,
  },
  
  // Decorative circles
  decorativeCircleLeft: {
    position: 'absolute',
    left: -15,
    top: '50%',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFD700',
    borderWidth: 2,
    borderColor: '#8B4513',
  },
  decorativeCircleRight: {
    position: 'absolute',
    right: -15,
    top: '50%',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFD700',
    borderWidth: 2,
    borderColor: '#8B4513',
  },
  
  // Right decoration
  rightDecorationContainer: {
    width: 120,
    alignItems: 'center',
  },
  rightDecorativeCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#DAA520',
  },
  rightDecorationText: {
    fontSize: 32,
  },
  
  centerTitleContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
  mainTitle: {
    fontSize: 36,
    fontWeight: '900',
    color: '#2C1810',
    letterSpacing: 3,
    textAlign: 'center',
  },
  titleDivider: {
    width: 150,
    height: 3,
    backgroundColor: '#8B4513',
    marginVertical: spacing.sm,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#8B4513',
    letterSpacing: 2,
    textAlign: 'center',
  },
  disciplineTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#B8860B',
    letterSpacing: 1,
    textAlign: 'center',
    marginTop: 4,
  },
  
  // Gold decorative line
  goldLine: {
    height: 3,
    backgroundColor: '#DAA520',
    marginVertical: spacing.lg,
    borderRadius: 2,
  },
  
  // Presented To Section
  presentedSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  presentedText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#8B4513',
    fontStyle: 'italic',
    marginBottom: spacing.md,
    fontFamily: 'serif',
  },
  studentName: {
    fontSize: 32,
    fontWeight: '900',
    color: '#2C1810',
    textAlign: 'center',
    letterSpacing: 2,
    marginBottom: spacing.lg,
  },
  achievementText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8B4513',
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 24,
    fontFamily: 'serif',
  },
  
  // Date Section
  dateSection: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  awardedText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8B4513',
    marginBottom: spacing.sm,
    fontFamily: 'serif',
  },
  dateText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#B8860B',
    letterSpacing: 1,
  },
  
  // Level and Rank Section
  levelRankSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    backgroundColor: '#F5F5DC',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 15,
    borderWidth: 3,
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
    fontSize: 18,
  },
  rankValue: {
    fontWeight: '900',
    color: '#8B4513',
    fontSize: 18,
  },
  superscript: {
    fontSize: 12,
    lineHeight: 12,
  },
  
  // Bottom Section (Medal, Seal, QR)
  bottomSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.sm,
  },
  
  medalSection: {
    alignItems: 'center',
    flex: 1,
  },
  medalCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
    borderWidth: 4,
    borderColor: '#DAA520',
  },
  medalLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8B4513',
    textAlign: 'center',
  },
  
  sealSection: {
    alignItems: 'center',
    flex: 1,
  },
  sealCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#8B4513',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
    borderWidth: 5,
    borderColor: '#DAA520',
  },
  sealInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFF8DC',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#8B4513',
  },
  sealSymbolContainer: {
    alignItems: 'center',
  },
  sealSymbol: {
    fontSize: 20,
    color: '#8B4513',
  },
  sealSubText: {
    fontSize: 8,
    fontWeight: '900',
    color: '#8B4513',
    letterSpacing: 1,
    marginTop: -2,
  },
  sealLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#8B4513',
    textAlign: 'center',
  },
  sealSubLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: '#B8860B',
    textAlign: 'center',
    marginTop: 2,
  },
  
  qrSection: {
    alignItems: 'center',
    flex: 1,
  },
  qrContainer: {
    alignItems: 'center',
  },
  qrCode: {
    width: 60,
    height: 60,
    backgroundColor: '#fff',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
    borderWidth: 3,
    borderColor: '#333',
  },
  qrPattern: {
    width: 40,
    height: 40,
    backgroundColor: '#333',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrText: {
    fontSize: 20,
    color: '#fff',
  },
  qrLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
  },
  
  // Signatures Section
  signaturesSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.xl,
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
    fontSize: 14,
    fontWeight: '600',
    color: '#8B4513',
    fontStyle: 'italic',
    marginBottom: spacing.sm,
    fontFamily: 'serif',
  },
  signatureLine: {
    width: 120,
    height: 2,
    backgroundColor: '#8B4513',
    marginBottom: spacing.sm,
  },
  signatureName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2C1810',
  },
  
  // Certificate Footer
  certificateFooter: {
    alignItems: 'center',
    marginTop: spacing.md,
  },
  footerDivider: {
    width: '100%',
    height: 3,
    backgroundColor: '#DAA520',
    marginBottom: spacing.md,
  },
  certificateId: {
    fontSize: 14,
    fontWeight: '700',
    color: '#8B4513',
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  websiteUrl: {
    fontSize: 12,
    fontWeight: '600',
    color: '#B8860B',
  },
});

export default CertificateViewModal;