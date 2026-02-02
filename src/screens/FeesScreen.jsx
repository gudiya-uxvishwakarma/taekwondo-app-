import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import FeesService from '../services/feesService';
import { useNavigation } from '../context/NavigationContext';
// Vector Icons
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';

// Icon component with proper vector icons
const Icon = ({ name, size = 24, color = '#000', type = 'MaterialIcons' }) => {
  const IconComponent = {
    MaterialIcons,
    MaterialCommunityIcons,
    Ionicons,
    FontAwesome5,
    AntDesign,
    Feather,
  }[type];

  return <IconComponent name={name} size={size} color={color} />;
};

const FeesScreen = () => {
  const { navigate } = useNavigation();
  const [feesData, setFeesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Load fees data from backend
  useEffect(() => {
    loadFeesData();
  }, []);

  const loadFeesData = async () => {
    try {
      setLoading(true);
      console.log('Loading fees data from backend...');
      
      // Use FeesService for backend integration
      const result = await FeesService.getFees();
      
      console.log('FeesService result:', {
        success: result.success,
        dataLength: result.data?.length || 0,
        source: result.source,
        message: result.message
      });
      
      if (result.success && result.data && result.data.length > 0) {
        console.log('Data loaded successfully - Got', result.data.length, 'fees records');

        console.log('� All mfee records:', result.data);
        

        setFeesData(result.data);
        console.log('Data integrated successfully from source:', result.source);
      } else {
        console.log('No data available');
        setFeesData([]);
      }
      
    } catch (error) {
      console.error('Failed to load fees data:', error);
      setFeesData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadFeesData();
    setRefreshing(false);
  };

  // Calculate totals from fees data
  const calculateTotals = () => {
    if (!feesData || feesData.length === 0) {
      return { totalAmount: 0, paidAmount: 0, pendingAmount: 0 };
    }

    const totals = feesData.reduce((acc, fee) => {
      const amount = parseFloat(fee.amount || 0);
      const paidAmount = parseFloat(fee.paidAmount || 0);
      const pendingAmount = parseFloat(fee.pendingAmount || (amount - paidAmount));
      
      acc.totalAmount += amount;
      acc.paidAmount += paidAmount;
      acc.pendingAmount += Math.max(0, pendingAmount); // Ensure no negative pending
      
      return acc;
    }, { totalAmount: 0, paidAmount: 0, pendingAmount: 0 });

    return totals;
  };

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid': return '#4CAF50';
      case 'pending': return '#FF9800';
      case 'overdue': return '#F44336';
      case 'partial': return '#2196F3';
      case 'cancelled': return '#9E9E9E';
      default: return '#666';
    }
  };

  const handleBackPress = () => {
    navigate('Dashboard');
  };

  // Calculate totals for display
  const totals = calculateTotals();

  // Loading state
  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#e74c3c" />
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <Icon name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Fees</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#e74c3c" />
          <Text style={styles.loadingText}>Loading fees data...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#e74c3c" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Fees</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#e74c3c']}
            tintColor="#e74c3c"
          />
        }
      >
        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Icon name="attach-money" size={20} color="#666" type="MaterialIcons" />
            <Text style={styles.statValue}>₹{totals.totalAmount.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Total Fees</Text>
          </View>
          <View style={styles.statCard}>
            <Icon name="check-circle" size={20} color="#4CAF50" type="MaterialIcons" />
            <Text style={[styles.statValue, { color: '#4CAF50' }]}>₹{totals.paidAmount.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Paid</Text>
          </View>
          <View style={styles.statCard}>
            <Icon name="pending" size={20} color="#F44336" type="MaterialIcons" />
            <Text style={[styles.statValue, { color: '#F44336' }]}>₹{totals.pendingAmount.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
        </View>

        {/* Fee Records */}
        {feesData.length > 0 ? (
          feesData.map((fee, index) => (
            <View key={fee._id || index} style={styles.feeCard}>
              <View style={styles.feeHeader}>
                <View style={styles.feeHeaderLeft}>
                  <Text style={styles.feeTitle}>{fee.course}</Text>
                  <Text style={styles.feeId}>ID: {fee.feeId}</Text>
                </View>
                <View style={[styles.statusBadge, { 
                  backgroundColor: getStatusColor(fee.status)
                }]}>
                  <Icon 
                    name={fee.status === 'Paid' ? 'check' : fee.status === 'Pending' ? 'schedule' : fee.status === 'Overdue' ? 'warning' : 'info'} 
                    size={14} 
                    color="#fff" 
                    type="MaterialIcons"
                  />
                  <Text style={styles.statusBadgeText}>{fee.status}</Text>
                </View>
              </View>

              {/* Essential Fee Details - Simplified */}
              <View style={styles.feeDetailsSection}>
                <View style={styles.feeRow}>
                  <Icon name="person" size={16} color="#666" type="MaterialIcons" />
                  <Text style={styles.feeLabel}>Student Name:</Text>
                  <Text style={styles.feeValue}>{fee.studentName}</Text>
                </View>
                
                <View style={styles.feeRow}>
                  <Icon name="badge" size={16} color="#666" type="MaterialIcons" />
                  <Text style={styles.feeLabel}>ID:</Text>
                  <Text style={styles.feeValue}>{fee.feeId}</Text>
                </View>
                
                <View style={styles.feeRow}>
                  <Icon name="attach-money" size={16} color="#666" type="MaterialIcons" />
                  <Text style={styles.feeLabel}>Total Fees:</Text>
                  <Text style={styles.feeValue}>₹{parseFloat(fee.amount || 0).toLocaleString()}</Text>
                </View>
                
                <View style={styles.feeRow}>
                  <Icon name="account-balance-wallet" size={16} color="#4CAF50" type="MaterialIcons" />
                  <Text style={styles.feeLabel}>Paid:</Text>
                  <Text style={[styles.feeValue, { color: '#4CAF50' }]}>₹{parseFloat(fee.paidAmount || 0).toLocaleString()}</Text>
                </View>

                {fee.pendingAmount > 0 && (
                  <View style={styles.feeRow}>
                    <Icon name="pending" size={16} color="#F44336" type="MaterialIcons" />
                    <Text style={styles.feeLabel}>Pending:</Text>
                    <Text style={[styles.feeValue, { color: '#F44336' }]}>₹{parseFloat(fee.pendingAmount || 0).toLocaleString()}</Text>
                  </View>
                )}
                
                <View style={styles.feeRow}>
                  <Icon name="calendar-today" size={16} color="#666" type="MaterialIcons" />
                  <Text style={styles.feeLabel}>Due Date:</Text>
                  <Text style={styles.feeValue}>{formatDate(fee.dueDate)}</Text>
                </View>

                {fee.paidDate && (
                  <View style={styles.feeRow}>
                    <Icon name="event-available" size={16} color="#4CAF50" type="MaterialIcons" />
                    <Text style={styles.feeLabel}>Paid Date:</Text>
                    <Text style={[styles.feeValue, { color: '#4CAF50' }]}>{formatDate(fee.paidDate)}</Text>
                  </View>
                )}
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Icon name="receipt-long" size={64} color="#ccc" type="MaterialIcons" />
            <Text style={styles.emptyStateTitle}>No Fee Records</Text>
            <Text style={styles.emptyStateText}>No fees data available at the moment</Text>
            <TouchableOpacity onPress={handleRefresh} style={styles.retryButton}>
              <Icon name="refresh" size={16} color="#fff" type="MaterialIcons" />
              <Text style={styles.retryButtonText}>Refresh</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  
  // Header
  header: {
    backgroundColor: '#e74c3c',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },

  // Content
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },

  // Stats Cards
  statsContainer: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    minHeight: 80,
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '800',
    marginTop: 6,
    marginBottom: 2,
    textAlign: 'center',
    color: '#333',
  },
  statLabel: {
    fontSize: 11,
    color: '#666',
    fontWeight: '600',
    textAlign: 'center',
  },

  // Fee Card
  feeCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginTop: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  feeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  feeHeaderLeft: {
    flex: 1,
  },
  feeTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 2,
  },
  feeId: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 4,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
  },

  // Fee Details Section
  feeDetailsSection: {
    marginBottom: 15,
  },
  feeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingVertical: 2,
  },
  feeLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    flex: 1,
    marginLeft: 8,
  },
  feeValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    textAlign: 'right',
  },

  // Section Titles
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
    marginTop: 5,
  },

  // Payment History
  paymentHistorySection: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  paymentCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  paymentAmount: {
    fontSize: 15,
    fontWeight: '700',
    color: '#4CAF50',
  },
  paymentDate: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  paymentDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentMethod: {
    fontSize: 13,
    color: '#333',
    fontWeight: '600',
  },
  paymentTransaction: {
    fontSize: 11,
    color: '#666',
    fontWeight: '500',
  },

  // Receipt Button
  receiptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e74c3c',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
    marginTop: 12,
  },
  receiptButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
  },

  // Notes Section
  notesSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  notesText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
    marginLeft: 8,
    flex: 1,
    lineHeight: 18,
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e74c3c',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },

  // Loading States
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7f8c8d',
    marginTop: 16,
  },
});

export default FeesScreen;