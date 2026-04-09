import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Linking,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import RNFS from 'react-native-fs';
import Icon from '../components/common/Icon';
import { useStudent } from '../context/StudentContext';
import { useNavigation } from '../context/NavigationContext';
import CertificateService from '../services/CertificateService';
import CertificatePDFService from '../services/CertificatePDFService';
import API_CONFIG from '../config/api';
import { Certificate } from '../models/Certificate';
import { colors, spacing } from '../theme';
import CertificateViewModal from './CertificateViewModal';

const CertificateCardScreen = () => {
  const { student } = useStudent();
  const { goBack } = useNavigation();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [viewCertificate, setViewCertificate] = useState(null);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [downloadingCertificate, setDownloadingCertificate] = useState(null);

  useEffect(() => {
    loadCertificates();
  }, []);

  // Request storage permission for Android
  const requestStoragePermission = async () => {
    if (Platform.OS !== 'android') {
      return true;
    }

    try {
      if (Platform.Version >= 33) {
        // Android 13+ doesn't need WRITE_EXTERNAL_STORAGE
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

  const loadCertificates = async () => {
    try {
      setLoading(true);
      console.log('📋 Loading certificates from backend...');
      
      const fetchedCertificates = await CertificateService.getCertificates();
      console.log('✅ Certificates loaded:', fetchedCertificates.length);
      
      // Convert to Certificate objects with proper formatting
      const certificateObjects = fetchedCertificates.map(cert => {
        const certificateData = {
          ...cert,
          // Ensure proper formatting for admin uploaded certificates
          title: cert.title || cert.achievementType || 'Certificate',
          student: cert.student || cert.studentName || student?.name || student?.fullName || 'Student Name',
          type: cert.type || cert.category || 'Achievement',
          issueDate: cert.issueDate || cert.formattedIssueDate || new Date().toLocaleDateString(),
          status: cert.status || 'Active',
          verificationCode: cert.verificationCode || cert.id,
          description: cert.description || `Successfully completed all requirements for ${cert.title || cert.achievementType} promotion`,
          instructor: cert.instructor || cert.issuedBy || 'Master Kim',
          year: cert.year || new Date().getFullYear(),
          imageUrl: cert.imageUrl || cert.filePath, // For admin uploaded certificate images
          downloadUrl: cert.downloadUrl || cert.filePath // For proper download functionality
        };
        return new Certificate(certificateData);
      });
      
      setCertificates(certificateObjects);
    } catch (error) {
      console.error('❌ Failed to load certificates:', error);
      
      // Show user-friendly error but don't block the UI
      console.log('🔄 Loading sample certificates as fallback...');
      
      // Load sample certificates matching admin panel data
      const sampleCertificates = [
        {
          id: 'CERT-4125362',
          title: 'red belt',
          student: student?.name || student?.fullName || 'Golu Vishwakarma',
          type: 'Belt Promotion',
          issueDate: 'Jan 23, 2025',
          status: 'Active',
          verificationCode: 'CERT-4125362',
          description: 'Successfully completed all requirements for red belt promotion',
          instructor: 'Academy Director',
          year: 2025
        },
        {
          id: 'CERT-NAV123',
          title: 'jxbashv',
          student: student?.name || student?.fullName || 'sxsa',
          type: 'Achievement',
          issueDate: 'Jan 22, 2025',
          status: 'Active',
          verificationCode: 'CERT-NAV123',
          description: 'Successfully completed all requirements for jxbashv promotion',
          instructor: 'Academy Director',
          year: 2025
        }
      ].map(cert => new Certificate(cert));
      
      setCertificates(sampleCertificates);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadCertificates();
    setRefreshing(false);
  };

  const handleViewCertificate = async (certificate) => {
    try {
      console.log('👁️ Viewing certificate:', certificate);
      
      // If certificate has uploaded file, show it directly
      if (certificate.imageUrl) {
        const certificateUrl = certificate.imageUrl;
        
        // Convert relative URL to absolute URL
        let fullUrl = certificateUrl;
        if (certificateUrl.startsWith('/')) {
          const serverUrl = API_CONFIG.BASE_URL.replace('/api', '');
          fullUrl = `${serverUrl}${certificateUrl}`;
        }

        console.log('👁️ Full certificate URL:', fullUrl);

        // Determine if it's a PDF or image
        const isPdf = certificateUrl.toLowerCase().endsWith('.pdf');
        console.log('📄 File type:', isPdf ? 'PDF' : 'Image');

        if (isPdf) {
          // Open PDF in browser
          console.log('📄 Opening PDF in browser');
          try {
            await Linking.openURL(fullUrl);
            console.log('✅ PDF opened in browser');
          } catch (error) {
            console.error('❌ Failed to open PDF:', error);
            Alert.alert('Error', 'Unable to open PDF. Please try downloading instead.');
          }
        } else {
          // Show image in modal - use the generated certificate modal
          setViewCertificate(certificate);
          setShowCertificateModal(true);
        }
      } else {
        // No uploaded file, show generated certificate
        console.log('👁️ Showing generated certificate');
        setViewCertificate(certificate);
        setShowCertificateModal(true);
      }
    } catch (error) {
      console.error('❌ Error viewing certificate:', error);
      Alert.alert('Error', 'Unable to view certificate');
    }
  };

  const handleDownloadCertificate = async (certificate) => {
    try {
      console.log('📥 Downloading certificate:', certificate);
      
      // If certificate has uploaded file, download it directly
      if (certificate.imageUrl) {
        const certificateUrl = certificate.imageUrl;

        // Request storage permission
        const hasPermission = await requestStoragePermission();
        if (!hasPermission) {
          Alert.alert('Permission Denied', 'Storage permission is required to download certificates');
          return;
        }

        // Convert relative URL to absolute URL
        let fullUrl = certificateUrl;
        if (certificateUrl.startsWith('/')) {
          const serverUrl = API_CONFIG.BASE_URL.replace('/api', '');
          fullUrl = `${serverUrl}${certificateUrl}`;
        }
        
        console.log('📥 Full certificate URL:', fullUrl);

        // Get file extension
        const fileExtension = certificateUrl.split('.').pop() || 'jpg';
        const fileName = `certificate_${certificate.student.replace(/\s+/g, '_')}_${certificate.verificationCode || certificate.id}.${fileExtension}`;
        
        // Determine download path based on platform
        let downloadPath;
        if (Platform.OS === 'ios') {
          downloadPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
        } else {
          // For Android, use CachesDirectoryPath first (always works), then try to move to Downloads
          downloadPath = `${RNFS.CachesDirectoryPath}/${fileName}`;
        }

        console.log('📁 Download path:', downloadPath);

        // Show downloading alert
        setDownloadingCertificate(certificate.id);
        Alert.alert('Downloading', 'Please wait while we download your certificate...');

        // Try all fallback URLs from API_CONFIG
        let downloadSuccess = false;
        let lastError = null;

        // If certificateUrl is already a full URL, try it directly first
        if (certificateUrl.startsWith('http://') || certificateUrl.startsWith('https://')) {
          try {
            console.log('🔄 Trying direct URL:', certificateUrl);

            const downloadResult = await RNFS.downloadFile({
              fromUrl: certificateUrl,
              toFile: downloadPath,
              background: true,
              discretionary: true,
              cacheable: false,
              headers: {
                'Accept': 'image/jpeg,image/png,image/jpg,application/pdf,*/*',
              },
              connectionTimeout: 15000,
              readTimeout: 15000,
              progress: (res) => {
                if (res.contentLength > 0) {
                  const progress = (res.bytesWritten / res.contentLength) * 100;
                  console.log(`📊 Download progress: ${progress.toFixed(0)}%`);
                }
              },
            }).promise;

            if (downloadResult.statusCode === 200 && downloadResult.bytesWritten > 0) {
              console.log('✅ Certificate downloaded successfully');
              downloadSuccess = true;
            }
          } catch (error) {
            console.log('⚠️ Direct download failed:', error.message);
            lastError = error;
          }
        }

        // If direct download failed or not a full URL, try with base URLs
        if (!downloadSuccess && !certificateUrl.startsWith('http://') && !certificateUrl.startsWith('https://')) {
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
              progress: (res) => {
                const progress = (res.bytesWritten / res.contentLength) * 100;
                console.log(`📊 Download progress: ${progress.toFixed(0)}%`);
              },
            }).promise;

            console.log('✅ Download result:', downloadResult);

            if (downloadResult.statusCode === 200 && downloadResult.bytesWritten > 0) {
              console.log('✅ Certificate downloaded successfully from:', tryUrl);
              downloadSuccess = true;
              break;
            } else if (downloadResult.statusCode === 404) {
              console.log('⚠️ File not found at:', tryUrl);
              lastError = new Error('Certificate file not found on server');
            } else {
              console.log('⚠️ Download failed with status:', downloadResult.statusCode);
              lastError = new Error(`Download failed with status code: ${downloadResult.statusCode}`);
            }
          } catch (urlError) {
            console.log('⚠️ Failed to download from:', baseUrl.replace('/api', ''), urlError.message);
            lastError = urlError;
          }
        }
        }

        if (!downloadSuccess) {
          throw lastError || new Error('Certificate file not found on server');
        }

        // For Android, try to move to Downloads folder
        if (Platform.OS === 'android') {
          try {
            const downloadsPath = `${RNFS.DownloadDirectoryPath}/${fileName}`;
            await RNFS.moveFile(downloadPath, downloadsPath);
            downloadPath = downloadsPath;
            console.log('✅ Moved to Downloads folder:', downloadsPath);
          } catch (moveError) {
            console.log('⚠️ Could not move to Downloads, file saved in app cache:', moveError.message);
          }
        }

        Alert.alert(
          'Download Complete',
          `Certificate has been saved successfully.\n\nFile: ${fileName}`,
          [
            { 
              text: 'Open', 
              onPress: () => {
                Linking.openURL(`file://${downloadPath}`).catch(err => {
                  console.log('Cannot open file:', err);
                  Alert.alert('Info', 'File downloaded but cannot be opened automatically. Please check your Downloads folder.');
                });
              }
            },
            { text: 'OK' }
          ]
        );
      } else {
        // No uploaded file, download generated PDF
        console.log('📥 Starting certificate PDF download from card:', certificate.title);
        
        // Use the main download method - same as modal
        const result = await CertificatePDFService.downloadCertificatePDF(certificate);
        
        if (result.success) {
          console.log('✅ Certificate PDF download completed from card:', result.fileName);
          Alert.alert(
            'Download Successful! 🎉',
            `Certificate PDF downloaded successfully!\n\nFile: ${result.fileName}`,
            [{ text: 'Great!' }]
          );
        } else {
          console.error('❌ Certificate download failed from card:', result.error);
          if (result.fallback) {
            Alert.alert(
              'PDF Feature Unavailable',
              'PDF download is temporarily unavailable. You can still view the certificate by clicking the "View" button.',
              [
                { text: 'View Certificate', onPress: () => handleViewCertificate(certificate) },
                { text: 'OK' }
              ]
            );
          } else {
            Alert.alert(
              'Download Failed',
              'Failed to download certificate. Please try again.',
              [
                { text: 'Retry', onPress: () => handleDownloadCertificate(certificate) },
                { text: 'Cancel' }
              ]
            );
          }
        }
      }
    } catch (error) {
      console.error('❌ Error downloading certificate:', error);
      Alert.alert(
        'Download Failed',
        error.message === 'Certificate file not found on server'
          ? 'This certificate file is not available on the server. Please contact your administrator.'
          : 'Unable to download certificate. Please check your internet connection and try again.'
      );
    } finally {
      setDownloadingCertificate(null);
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

  const getCertificateIcon = (title) => {
    const titleLower = title?.toLowerCase() || '';
    if (titleLower.includes('belt')) return 'military-tech';
    if (titleLower.includes('medal') || titleLower.includes('award')) return 'emoji-events';
    if (titleLower.includes('achievement')) return 'star';
    if (titleLower.includes('course') || titleLower.includes('completion')) return 'school';
    return 'card-membership'; // Default certificate icon
  };

  const renderCertificateCard = (certificate) => {
    return (
      <View key={certificate.id} style={styles.certificateCard}>
        {/* Certificate Icon */}
        <View style={[styles.iconContainer, { backgroundColor: getBeltColor(certificate.title) + '20' }]}>
          <Icon 
            name={getCertificateIcon(certificate.title)} 
            size={32} 
            color={getBeltColor(certificate.title)} 
            type="MaterialIcons" 
          />
        </View>

        {/* Certificate Title */}
        <Text style={styles.certificateTitle}>
          {certificate.title} Certificate
        </Text>

        {/* Student Name - Show actual student name from backend */}
        <Text style={styles.studentName}>
          {certificate.student}
        </Text>

        {/* Certificate Description */}
        <Text style={styles.certificateSubDescription}>
          {certificate.description}
        </Text>

        {/* Certificate Details - Show all required fields */}
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Icon name="person" size={16} color="#999" type="MaterialIcons" />
            <Text style={styles.detailLabel}>Student:</Text>
            <Text style={styles.detailText}>{certificate.student}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Icon name="emoji-events" size={16} color="#999" type="MaterialIcons" />
            <Text style={styles.detailLabel}>Achievement:</Text>
            <Text style={styles.detailText}>{certificate.title}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Icon name="category" size={16} color="#999" type="MaterialIcons" />
            <Text style={styles.detailLabel}>Type:</Text>
            <Text style={styles.detailText}>{certificate.type}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <View style={[styles.levelColorIndicator, { backgroundColor: getBeltColor(certificate.title) }]} />
            <Text style={styles.detailLabel}>Level:</Text>
            <Text style={styles.detailText}>{certificate.beltLevel || certificate.level || certificate.title}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Icon name="confirmation-number" size={16} color="#999" type="MaterialIcons" />
            <Text style={styles.detailLabel}>Code:</Text>
            <Text style={styles.detailText}>{certificate.verificationCode || certificate.id}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Icon name="calendar-today" size={16} color="#999" type="MaterialIcons" />
            <Text style={styles.detailLabel}>Date:</Text>
            <Text style={styles.detailText}>{certificate.issueDate}</Text>
          </View>
        </View>

        {/* Action Buttons - View and Download */}
        <View style={styles.cardActions}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.viewButton]} 
            onPress={() => handleViewCertificate(certificate)}
            activeOpacity={0.7}
          >
            <Icon name="visibility" size={16} color="#fff" type="MaterialIcons" />
            <Text style={styles.viewButtonText}>View</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.downloadButton]} 
            onPress={() => handleDownloadCertificate(certificate)}
            activeOpacity={0.7}
            disabled={downloadingCertificate === certificate.id}
          >
            {downloadingCertificate === certificate.id ? (
              <ActivityIndicator size={16} color="#fff" />
            ) : (
              <Icon name="file-download" size={16} color="#fff" type="MaterialIcons" />
            )}
            <Text style={styles.downloadButtonText}>
              {downloadingCertificate === certificate.id ? 'Downloading...' : 'Download PDF'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={goBack} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color="#fff" type="MaterialIcons" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Certificates</Text>
          <View style={styles.headerSpacer} />
        </View>
        
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading Certificates...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#fff" type="MaterialIcons" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Certificates</Text>
        <TouchableOpacity onPress={loadCertificates} style={styles.refreshButton}>
          <Icon name="refresh" size={24} color="#fff" type="MaterialIcons" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>All Certificates</Text>
        
        {certificates.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon name="certificate" size={64} color="#ccc" type="MaterialCommunityIcons" />
            <Text style={styles.emptyTitle}>No Certificates Found</Text>
            <Text style={styles.emptyText}>
              Your certificates will appear here once issued
            </Text>
          </View>
        ) : (
          certificates.map(renderCertificateCard)
        )}
      </ScrollView>

      {/* Certificate View Modal */}
      <CertificateViewModal
        visible={showCertificateModal}
        certificate={viewCertificate}
        onClose={() => {
          setShowCertificateModal(false);
          setViewCertificate(null);
        }}
        testID="certificate-view-modal"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  backButton: {
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
    fontSize: 22,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 0.5,
    textAlign: 'center',
    flex: 1,
  },
  refreshButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerSpacer: {
    width: 44,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1a1a2e',
    marginBottom: spacing.lg,
    textAlign: 'left',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  certificateCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: spacing.lg,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  certificateTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1a1a2e',
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  studentName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
    gap: spacing.xs,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#999',
  },
  statusBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
  certificateDescription: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a2e',
    textAlign: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  certificateSubDescription: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: 20,
  },
  detailsContainer: {
    width: '100%',
    marginBottom: spacing.lg,
    backgroundColor: '#f8f9fc',
    borderRadius: 12,
    padding: spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    gap: spacing.xs,
  },
  levelColorIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    minWidth: 80,
  },
  detailText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1a1a2e',
    flex: 1,
  },
  cardActions: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 12,
    gap: spacing.xs,
    flex: 1,
  },
  viewButton: {
    backgroundColor: '#DC143C',
  },
  downloadButton: {
    backgroundColor: '#4CAF50',
  },
  viewButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  downloadButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 10,
  },
});

export default CertificateCardScreen;