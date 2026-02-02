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
} from 'react-native';
import { colors, spacing } from '../theme';
import Icon from '../components/common/Icon';
import CertificateCard from '../components/certificates/CertificateCard';
import CertificateViewModal from './CertificateViewModal';
import { useStudent } from '../context/StudentContext';
import { useNavigation } from '../context/NavigationContext';
import CertificateService from '../services/CertificateService';
import API_CONFIG from '../config/api';
import { handleApiError } from '../utils/helpers';
import { Certificate } from '../models/Certificate';

const CertificatesScreen = () => {
  const { student } = useStudent();
  const { navigate } = useNavigation();
  
  // State management
  const [certificates, setCertificates] = useState([]);
  const [viewCertificate, setViewCertificate] = useState(null);
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

  // Load certificates from service
  const loadCertificates = useCallback(async () => {
    try {
      setError(null);
      console.log('� Loarding certificates from backend...');
      
      const fetchedCertificates = await CertificateService.getCertificates();
      console.log('✅ Certificates loaded:', fetchedCertificates.length);
      
      // Convert to Certificate objects with proper formatting
      const certificateObjects = fetchedCertificates.map(cert => {
        const certificateData = {
          ...cert,
          // Ensure proper formatting
          title: cert.title || cert.achievementType || 'Certificate',
          student: cert.student || cert.studentName || 'Student',
          type: cert.type || cert.category || 'Achievement',
          issueDate: cert.issueDate || cert.formattedIssueDate || new Date().toLocaleDateString(),
          status: cert.status || 'Active',
          verificationCode: cert.verificationCode || cert.id,
          description: cert.description || `Certificate for ${cert.title || cert.achievementType}`,
          instructor: cert.instructor || 'Academy Director',
          year: cert.year || new Date().getFullYear()
        };
        return new Certificate(certificateData);
      });
      
      setCertificates(certificateObjects);
      
      // Update filter counts
      const counts = updateFilterCounts(certificateObjects);
      filterOptions.forEach(option => {
        option.count = counts[option.value] || 0;
      });
    } catch (err) {
      console.error('❌ Failed to load certificates:', err);
      setError(handleApiError(err));
      
      // Show user-friendly error but don't block the UI
      console.log('🔄 Loading sample certificates as fallback...');
      
      // Load sample certificates as fallback
      const sampleCertificates = [
        {
          id: 'CERT-4125362',
          title: 'Yellow Belt',
          student: 'Student Name',
          type: 'Belt Promotion',
          issueDate: '2024-01-15',
          status: 'Active',
          verificationCode: 'CERT001',
          description: 'Yellow Belt Certificate',
          instructor: 'Master Kim',
          year: 2024
        }
      ].map(cert => new Certificate(cert));
      
      setCertificates(sampleCertificates);
      
      // Update filter counts for sample data
      const counts = updateFilterCounts(sampleCertificates);
      filterOptions.forEach(option => {
        option.count = counts[option.value] || 0;
      });
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

  // Event handlers
  const handleViewCertificate = useCallback((cert) => {
    setViewCertificate(cert);
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
              <CertificateCard
                key={cert.id}
                certificate={cert}
                onView={handleViewCertificate}
                testID={`certificate-card-${cert.id}`}
              />
            ))
          )}
        </View>
      </ScrollView>

      {/* Certificate View Modal */}
      <CertificateViewModal
        visible={viewCertificate !== null}
        certificate={viewCertificate}
        onClose={() => setViewCertificate(null)}
        testID="certificate-view-modal"
      />
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
});

export default CertificatesScreen;