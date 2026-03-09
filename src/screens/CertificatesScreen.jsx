import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
  Alert,
  Linking,
  Platform,
  PermissionsAndroid,
  Modal,
  Image,
  Dimensions,
} from 'react-native';
import RNFS from 'react-native-fs';
import { colors, spacing } from '../theme';
import Icon from '../components/common/Icon';
import { useStudent } from '../context/StudentContext';
import { useNavigation } from '../context/NavigationContext';
import CertificateService from '../services/CertificateService';
import API_CONFIG from '../config/api';
import { handleApiError } from '../utils/helpers';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CertificatesScreen = () => {
  const { student } = useStudent();
  const { navigate, route } = useNavigation();
  
  // State management
  const [certificates, setCertificates] = useState([]);
  const [viewingCertificate, setViewingCertificate] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  
  // Filter states
  const [selectedFilter, setSelectedFilter] = useState('All');

  // Filter options
  const filterOptions = [
    { label: 'All', value: 'All', count: 0 },
    { label: '2025', value: '2025', count: 0 },
    { label: '2026', value: '2026', count: 0 },
    { label: 'Awards', value: 'Awards', count: 0 },
    { label: 'Belt Promotion', value: 'Belt Promotion', count: 0 },
    { label: 'Achievement', value: 'Achievement', count: 0 },
    { label: 'Tournament', value: 'Tournament', count: 0 },
  ];

  // Handle back navigation
  const handleBackPress = useCallback(() => {
    navigate('Dashboard');
  }, [navigate]);

  // Load certificates on component mount
  useEffect(() => {
    loadCertificates();
  }, [student]);

  // Handle view certificate - show in modal for images, open browser for PDFs
  const handleViewCertificate = async (certificate) => {
    try {
      console.log('👁️ Viewing certificate:', certificate);
      
      if (!certificate.imageUrl) {
        Alert.alert('No Certificate File', 'This certificate does not have an uploaded file.');
        return;
      }

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
        // Show image in modal
        setImageLoading(false);
        setImageError(false);

        setViewingCertificate({
          url: fullUrl,
          code: certificate.verificationCode || certificate.id,
          title: certificate.title,
          student: certificate.student,
          isPdf: false,
        });
      }
    } catch (error) {
      console.error('❌ Error viewing certificate:', error);
      Alert.alert('Error', 'Unable to view certificate');
    }
  };

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

  // Handle certificate download
  const handleDownloadCertificate = async (certificate) => {
    try {
      console.log('📥 Downloading certificate:', certificate);
      
      if (!certificate.imageUrl) {
        Alert.alert('No Certificate File', 'This certificate does not have an uploaded file to download.');
        return;
      }

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
      Alert.alert('Downloading', 'Please wait while we download your certificate...');

      // Try all fallback URLs from API_CONFIG
      let downloadSuccess = false;
      let lastError = null;

      // Try multiple possible paths for the certificate
      const possiblePaths = [];
      
      if (certificateUrl.startsWith('http://') || certificateUrl.startsWith('https://')) {
        // Already a full URL (Cloudinary), use it directly
        possiblePaths.push(certificateUrl);
      } else if (certificateUrl.startsWith('/')) {
        possiblePaths.push(certificateUrl);
      } else {
        // Try different possible folder structures
        possiblePaths.push(`/uploads/${certificateUrl}`);
        possiblePaths.push(`/${certificateUrl}`);
        possiblePaths.push(`/uploads/certificates/${certificateUrl}`);
        possiblePaths.push(`/uploads/students/${certificateUrl}`);
        possiblePaths.push(`/public/uploads/${certificateUrl}`);
      }

      // If we have a full URL, try it directly first
      if (certificateUrl.startsWith('http://') || certificateUrl.startsWith('https://')) {
        try {
          console.log('🔄 Trying direct Cloudinary URL:', certificateUrl);

          const downloadResult = await RNFS.downloadFile({
            fromUrl: certificateUrl,
            toFile: downloadPath,
            background: true,
            discretionary: true,
            cacheable: true,
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
            console.log('✅ Certificate downloaded successfully from Cloudinary');
            downloadSuccess = true;
          }
        } catch (error) {
          console.log('⚠️ Cloudinary direct download failed:', error.message);
          lastError = error;
        }
      }

      // If direct download failed or not a full URL, try with base URLs
      if (!downloadSuccess) {
        // Filter out full URLs from possiblePaths for fallback attempts
        const relativePaths = possiblePaths.filter(p => !p.startsWith('http://') && !p.startsWith('https://'));
        
        for (const baseUrl of API_CONFIG.FALLBACK_URLS) {
          for (const path of relativePaths) {
            try {
              // Construct URL
              const tryUrl = `${baseUrl.replace('/api', '')}${path}`;
              
              console.log('🔄 Trying URL:', tryUrl);

              // Build headers with authentication if token exists
              const AsyncStorage = require('@react-native-async-storage/async-storage').default;
              const token = await AsyncStorage.getItem('auth_token');
              
              const headers = {
                'Accept': 'image/jpeg,image/png,image/jpg,application/pdf,*/*',
              };
              
              if (token) {
                headers['Authorization'] = `Bearer ${token}`;
              }

              const downloadResult = await RNFS.downloadFile({
                fromUrl: tryUrl,
                toFile: downloadPath,
                background: true,
                discretionary: true,
                cacheable: true,
                headers: headers,
                connectionTimeout: 15000,
                readTimeout: 15000,
                progress: (res) => {
                  if (res.contentLength > 0) {
                    const progress = (res.bytesWritten / res.contentLength) * 100;
                    console.log(`📊 Download progress: ${progress.toFixed(0)}%`);
                  }
                },
              }).promise;

              console.log('✅ Download result:', downloadResult);

              if (downloadResult.statusCode === 200 && downloadResult.bytesWritten > 0) {
                console.log('✅ Certificate downloaded successfully from:', tryUrl);
                downloadSuccess = true;
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
          
          if (downloadSuccess) break;
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

    } catch (error) {
      console.error('❌ Error downloading certificate:', error);
      Alert.alert(
        'Download Failed',
        error.message === 'Certificate file not found on server'
          ? 'This certificate file is not available on the server. Please contact your administrator.'
          : 'Unable to download certificate. Please check your internet connection and try again.'
      );
    }
  };

  // Load certificates on component mount
  useEffect(() => {
    loadCertificates();
  }, [student]);

  // Load certificates from service
  const loadCertificates = useCallback(async () => {
    try {
      setError(null);
      console.log('🔄 Loading certificates from backend...');
      
      const fetchedCertificates = await CertificateService.getCertificates();
      console.log('✅ Certificates loaded:', fetchedCertificates.length);
      
      // Keep certificates as-is with imageUrl
      setCertificates(fetchedCertificates);
      
      // Update filter counts
      const counts = updateFilterCounts(fetchedCertificates);
      filterOptions.forEach(option => {
        option.count = counts[option.value] || 0;
      });
    } catch (err) {
      console.error('❌ Failed to load certificates:', err);
      setError(handleApiError(err));
      setCertificates([]);
    } finally {
      setIsLoading(false);
    }
  }, [student]);


  // Handle refresh
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await loadCertificates();
    setIsRefreshing(false);
  }, [loadCertificates]);

  // Show filtered certificates
  const filteredCertificates = useMemo(() => {
    if (!certificates) return [];
    
    let filtered = certificates;
    
    if (selectedFilter !== 'All') {
      filtered = certificates.filter(cert => {
        // Filter by year
        if (selectedFilter === '2025' || selectedFilter === '2026') {
          const certYear = cert.year || new Date(cert.issueDate).getFullYear() || new Date().getFullYear();
          return certYear.toString() === selectedFilter;
        }
        
        // Filter by type
        if (selectedFilter === 'Awards') {
          return cert.type?.toLowerCase().includes('award') || 
                 cert.title?.toLowerCase().includes('award') ||
                 cert.title?.toLowerCase().includes('medal');
        }
        
        if (selectedFilter === 'Belt Promotion') {
          return cert.type?.toLowerCase().includes('belt') || 
                 cert.title?.toLowerCase().includes('belt');
        }
        
        if (selectedFilter === 'Achievement') {
          return cert.type?.toLowerCase().includes('achievement');
        }
        
        if (selectedFilter === 'Tournament') {
          return cert.type?.toLowerCase().includes('tournament') ||
                 cert.title?.toLowerCase().includes('tournament');
        }
        
        return cert.type?.toLowerCase() === selectedFilter.toLowerCase();
      });
    }
    
    return filtered;
  }, [certificates, selectedFilter]);

  // Update filter counts
  const updateFilterCounts = useCallback((certs) => {
    const counts = {
      'All': certs.length,
      '2025': 0,
      '2026': 0,
      'Awards': 0,
      'Belt Promotion': 0,
      'Achievement': 0,
      'Tournament': 0,
    };
    
    certs.forEach(cert => {
      const certYear = cert.year || new Date(cert.issueDate).getFullYear() || new Date().getFullYear();
      if (certYear.toString() === '2025') counts['2025']++;
      if (certYear.toString() === '2026') counts['2026']++;
      
      if (cert.type?.toLowerCase().includes('award') || 
          cert.title?.toLowerCase().includes('award') ||
          cert.title?.toLowerCase().includes('medal')) {
        counts['Awards']++;
      }
      
      if (cert.type?.toLowerCase().includes('belt') || 
          cert.title?.toLowerCase().includes('belt')) {
        counts['Belt Promotion']++;
      }
      
      if (cert.type?.toLowerCase().includes('achievement')) {
        counts['Achievement']++;
      }
      
      if (cert.type?.toLowerCase().includes('tournament') ||
          cert.title?.toLowerCase().includes('tournament')) {
        counts['Tournament']++;
      }
    });
    
    return counts;
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
        {/* Custom Header */}
        <View style={styles.customHeader}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={handleBackPress}
            activeOpacity={0.7}
            accessibilityLabel="Go back to dashboard"
            accessibilityRole="button"
          >
            <Icon name="arrow-back" size={24} color={colors.white} type="MaterialIcons" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Certificates</Text>
          <View style={styles.headerIconContainer}>
            <Icon name="certificate" size={24} color={colors.white} type="MaterialCommunityIcons" />
          </View>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading certificates...</Text>
        </View>
      </View>
    );
  }

  // Error state
  if (error && certificates.length === 0) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
        {/* Custom Header */}
        <View style={styles.customHeader}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={handleBackPress}
            activeOpacity={0.7}
            accessibilityLabel="Go back to dashboard"
            accessibilityRole="button"
          >
            <Icon name="arrow-back" size={24} color={colors.white} type="MaterialIcons" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Certificates</Text>
          <View style={styles.headerIconContainer}>
            <Icon name="certificate" size={24} color={colors.white} type="MaterialCommunityIcons" />
          </View>
        </View>
        <View style={styles.errorContainer}>
          <Icon name="error-outline" size={64} color={colors.error} type="MaterialIcons" />
          <Text style={styles.errorText}>Failed to load certificates</Text>
          <Text style={styles.errorSubtext}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadCertificates}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      
      {/* Custom Header */}
      <View style={styles.customHeader}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={handleBackPress}
          activeOpacity={0.7}
          accessibilityLabel="Go back to dashboard"
          accessibilityRole="button"
        >
          <Icon name="arrow-back" size={24} color={colors.white} type="MaterialIcons" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Certificates</Text>
        <View style={styles.headerIconContainer}>
          <Icon name="certificate" size={24} color={colors.white} type="MaterialCommunityIcons" />
        </View>
      </View>

      {/* Filter Section */}
      <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>Filter Certificates</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScrollContainer}
        >
          {filterOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.filterButton,
                selectedFilter === option.value && styles.filterButtonActive
              ]}
              onPress={() => setSelectedFilter(option.value)}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.filterButtonText,
                selectedFilter === option.value && styles.filterButtonTextActive
              ]}>
                {option.label}
              </Text>
              {option.count > 0 && (
                <View style={[
                  styles.filterBadge,
                  selectedFilter === option.value && styles.filterBadgeActive
                ]}>
                  <Text style={[
                    styles.filterBadgeText,
                    selectedFilter === option.value && styles.filterBadgeTextActive
                  ]}>
                    {option.count}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Certificates List */}
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        <View style={styles.certificatesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {selectedFilter === 'All' ? 'All Certificates' : `${selectedFilter} Certificates`}
            </Text>
            <Text style={styles.certificateCount}>
              {filteredCertificates.length} certificate{filteredCertificates.length !== 1 ? 's' : ''}
            </Text>
          </View>
          
          {filteredCertificates.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconContainer}>
                <Icon name="certificate" color={colors.textMuted} size={64} type="MaterialCommunityIcons" />
              </View>
              <Text style={styles.emptyText}>No certificates found</Text>
              <Text style={styles.emptySubtext}>Your certificates will appear here once issued</Text>
            </View>
          ) : (
            filteredCertificates.map((cert) => (
              <View key={cert.id} style={styles.certificateCard}>
                <View style={styles.certificateHeader}>
                  <View style={styles.certificateIcon}>
                    <Icon name="card-membership" size={24} color={colors.primary} type="MaterialIcons" />
                  </View>
                  <View style={styles.certificateInfo}>
                    <Text style={styles.certificateTitle}>{cert.title || 'Certificate'}</Text>
                    <Text style={styles.certificateStudent}>{cert.student || 'Student'}</Text>
                    <Text style={styles.certificateType}>{cert.type || 'Achievement'}</Text>
                    <Text style={styles.certificateDate}>Issued: {cert.issueDate}</Text>
                    {cert.verificationCode && (
                      <Text style={styles.certificateCode}>Code: {cert.verificationCode}</Text>
                    )}
                  </View>
                </View>
                
                {cert.imageUrl && (
                  <View style={styles.certificateActions}>
                    <TouchableOpacity 
                      style={styles.viewButton}
                      onPress={() => handleViewCertificate(cert)}
                    >
                      <Icon name="visibility" size={16} color="#fff" type="MaterialIcons" />
                      <Text style={styles.buttonText}>View</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={styles.downloadButton}
                      onPress={() => handleDownloadCertificate(cert)}
                    >
                      <Icon name="file-download" size={16} color="#fff" type="MaterialIcons" />
                      <Text style={styles.buttonText}>Download</Text>
                    </TouchableOpacity>
                  </View>
                )}
                
                {!cert.imageUrl && (
                  <View style={styles.noFileContainer}>
                    <Text style={styles.noFileText}>No certificate file uploaded</Text>
                  </View>
                )}
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Certificate View Modal */}
      {viewingCertificate && (
        <Modal
          visible={viewingCertificate !== null}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setViewingCertificate(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderInfo}>
                <Text style={styles.modalTitle}>Certificate</Text>
                {viewingCertificate && (
                  <Text style={styles.modalSubtitle}>
                    {viewingCertificate.student} - {viewingCertificate.title}
                  </Text>
                )}
              </View>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setViewingCertificate(null)}
              >
                <Icon name="close" size={24} color="#fff" type="MaterialIcons" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalContent}>
              {viewingCertificate && (
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
                    </View>
                  )}

                  <Image
                    source={{ 
                      uri: viewingCertificate.url,
                      headers: {
                        'Accept': 'image/jpeg,image/png,image/jpg,*/*',
                      },
                    }}
                    style={styles.modalImage}
                    resizeMode="contain"
                    onLoadStart={() => {
                      console.log('📸 Image loading started:', viewingCertificate.url);
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
                    }}
                  />
                </>
              )}
            </View>

            {viewingCertificate && (
              <View style={styles.modalFooter}>
                <Text style={styles.certificateCodeText}>
                  Code: {viewingCertificate.code}
                </Text>
              </View>
            )}
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.white // Change to white to match filter and certificates sections
  },
  
  // Custom Header Styles
  customHeader: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    paddingTop: spacing.lg + 10, // Extra padding for status bar
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
    color: colors.white,
    letterSpacing: 0.5,
    textAlign: 'center',
    flex: 1,
  },
  headerIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(248, 232, 232, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  
  // Header Info Section
  headerInfoSection: {
    backgroundColor: colors.white,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm, // Reduced from spacing.lg
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginTop: -12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    borderTopWidth: 0,
  },
  headerInfoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm, // Reduced from spacing.md
  },
  headerInfoIcon: {
    width: 48, // Reduced from 56
    height: 48, // Reduced from 56
    borderRadius: 24, // Reduced from 28
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary + '30',
  },
  headerInfoText: {
    flex: 1,
  },
  headerInfoTitle: {
    fontSize: 22, // Reduced from 20
    fontWeight: '900',
    color: '#1a1a2e',
    marginBottom: 2, // Reduced from 4
  },
  headerInfoSubtitle: {
    fontSize: 13, // Reduced from 14
    color: colors.textSecondary,
    fontWeight: '500',
  },
  
  // Loading and Error States
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.error,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  errorSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 12,
    marginTop: spacing.lg,
  },
  retryButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '800',
  },
  
  // Filter Section
  filterSection: { 
    paddingHorizontal: spacing.lg, 
    paddingVertical: spacing.sm,
    backgroundColor: colors.white, 
    marginTop: 0, // Remove top margin
    marginHorizontal: 0, // Remove horizontal margins
    marginBottom: 0, // Remove bottom margin
    borderRadius: 0, // Remove border radius for seamless connection
    borderWidth: 0, // Remove border
    borderColor: 'transparent',
  },
  filterLabel: { 
    fontSize: 11, // Reduced from 12
    fontWeight: '700', 
    color: colors.textSecondary, 
    marginBottom: spacing.xs, 
    textTransform: 'uppercase', 
    letterSpacing: 0.5 
  },
  filterDropdown: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#f8f9fc', 
    paddingHorizontal: spacing.md, 
    paddingVertical: spacing.xs, // Reduced from spacing.sm
    borderRadius: 12, 
    borderWidth: 2, 
    borderColor: colors.primary, 
    gap: spacing.sm 
  },
  filterText: { 
    flex: 1, 
    fontSize: 15, 
    fontWeight: '800', 
    color: '#1a1a2e' 
  },
  filterBadge: { 
    backgroundColor: colors.primary, 
    paddingHorizontal: 8, 
    paddingVertical: 2, 
    borderRadius: 10 
  },
  filterBadgeText: { 
    color: colors.white, 
    fontSize: 11, 
    fontWeight: '800' 
  },
  
  // Filter Section
  filterSection: { 
    paddingHorizontal: spacing.lg, 
    paddingVertical: spacing.md,
    backgroundColor: colors.white, 
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  filterLabel: { 
    fontSize: 12, 
    fontWeight: '700', 
    color: colors.textSecondary, 
    marginBottom: spacing.sm, 
    textTransform: 'uppercase', 
    letterSpacing: 0.5 
  },
  filterScrollContainer: {
    paddingRight: spacing.lg,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fc',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    marginRight: spacing.sm,
    borderWidth: 2,
    borderColor: 'transparent',
    gap: spacing.xs,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#666',
  },
  filterButtonTextActive: {
    color: colors.white,
  },
  filterBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center',
  },
  filterBadgeActive: {
    backgroundColor: colors.white,
  },
  filterBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.white,
  },
  filterBadgeTextActive: {
    color: colors.primary,
  },
  
  // Content Area
  scrollContent: { 
    paddingBottom: 100 
  },
  certificatesSection: { 
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    backgroundColor: colors.white,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  sectionTitle: { 
    fontSize: 28, 
    fontWeight: '900', 
    color: '#1a1a2e', 
    flex: 1,
  },
  certificateCount: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    backgroundColor: '#f8f9fc',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  
  // Empty State
  emptyState: { 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingVertical: spacing.xxl 
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    backgroundColor: colors.lightGray,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  emptyText: { 
    fontSize: 18, 
    fontWeight: '800', 
    color: colors.textSecondary, 
    marginTop: spacing.md 
  },
  emptySubtext: { 
    fontSize: 14, 
    color: colors.textMuted, 
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  
  // Certificate Card Styles
  certificateCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  certificateHeader: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  certificateIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  certificateInfo: {
    flex: 1,
  },
  certificateTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1a1a2e',
    marginBottom: spacing.xs,
  },
  certificateStudent: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  certificateType: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  certificateDate: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  certificateCode: {
    fontSize: 11,
    color: colors.textMuted,
    fontFamily: 'monospace',
  },
  certificateActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  viewButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 12,
    gap: spacing.xs,
  },
  downloadButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.success,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 12,
    gap: spacing.xs,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  noFileContainer: {
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  noFileText: {
    fontSize: 13,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
  
  // Modal Styles
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
  },
  imageErrorText: {
    color: colors.error,
    marginTop: spacing.md,
    fontSize: 14,
  },
  modalFooter: {
    padding: spacing.lg,
    alignItems: 'center',
  },
  certificateCodeText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    fontFamily: 'monospace',
  },
});

export default CertificatesScreen;