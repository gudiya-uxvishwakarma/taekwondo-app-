import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  Alert,
} from 'react-native';
import { colors, spacing } from '../../theme';
import Icon from '../common/Icon';
import CertificatePDFService from '../../services/CertificatePDFService';

const CertificateCard = ({ certificate, onView, testID }) => {
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

  const beltColor = getBeltColor(certificate.title);

  return (
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
            <Icon name="download" size={18} color={colors.white} type="MaterialIcons" />
            <Text style={styles.downloadButtonText}>Download PDF</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
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
});

export default CertificateCard;