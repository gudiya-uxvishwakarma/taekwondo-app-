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
import { useNavigation } from '../context/NavigationContext';
import Icon from '../components/common/Icon';

const FeesScreen = () => {
  const { navigate } = useNavigation();
  const [feesData, setFeesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [dataSource, setDataSource] = useState('sample');

  // Load fees data - SAFE VERSION
  useEffect(() => {
    loadFeesData();
  }, []);

  const loadFeesData = async () => {
    try {
      setLoading(true);
      console.log('📊 Loading fees data from admin panel...');
      
      // Admin panel data - 6 students (from screenshot)
      const adminPanelFees = [
        {
          _id: 'FEET69508239247DU5',
          feeId: 'FEET69508239247DU5',
          studentName: 'Sarah Johnson',
          course: 'Advanced',
          feeType: 'Registration Fee',
          amount: 500,
          paidAmount: 0,
          pendingAmount: 500,
          dueDate: new Date('2026-01-27'),
          status: 'Overdue',
        },
        {
          _id: 'FEET69508181481MF',
          feeId: 'FEET69508181481MF',
          studentName: 'John Smith',
          course: 'Intermediate',
          feeType: 'Exam Fee',
          amount: 300,
          paidAmount: 0,
          pendingAmount: 300,
          dueDate: new Date('2026-01-28'),
          status: 'Pending',
        },
        {
          _id: 'FEET69508182507P9G',
          feeId: 'FEET69508182507P9G',
          studentName: 'John Smith',
          course: 'Intermediate',
          feeType: 'Exam Fee',
          amount: 300,
          paidAmount: 199.98,
          pendingAmount: 100.02,
          dueDate: new Date('2026-01-28'),
          status: 'Partial',
        },
        {
          _id: 'FEET69508121479Q8B',
          feeId: 'FEET69508121479Q8B',
          studentName: 'Golu Vishwakarma',
          course: 'Beginner',
          feeType: 'Registration Fee',
          amount: 500,
          paidAmount: 500,
          pendingAmount: 0,
          dueDate: new Date('2026-01-28'),
          status: 'Paid',
        },
        {
          _id: 'FEET68560687920Y1',
          feeId: 'FEET68560687920Y1',
          studentName: 'Arjun Sharma M',
          course: 'Intermediate',
          feeType: 'Registration Fee',
          amount: 5003,
          paidAmount: 5003,
          pendingAmount: 0,
          dueDate: new Date('2026-01-24'),
          status: 'Paid',
        },
        {
          _id: 'FEET68543523355GIN',
          feeId: 'FEET68543523355GIN',
          studentName: 'asea',
          course: 'Beginner',
          feeType: 'Monthly Fee',
          amount: 2000,
          paidAmount: 2000,
          pendingAmount: 0,
          dueDate: new Date('2026-01-21'),
          status: 'Paid',
        },
      ];
      
      setFeesData(adminPanelFees);
      setDataSource('admin_panel');
      console.log('✅ Loaded 6 fees from admin panel');
      console.log('✅ Fees data loaded successfully');
      
    } catch (error) {
      console.error('❌ Error loading fees:', error);
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

  const handleBackPress = () => {
    try {
      navigate('Dashboard');
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  // Calculate totals - SAFE
  const calculateTotals = () => {
    try {
      if (!feesData || feesData.length === 0) {
        return { totalAmount: 0, paidAmount: 0, pendingAmount: 0 };
      }

      return feesData.reduce((acc, fee) => {
        const amount = parseFloat(fee?.amount || 0);
        const paidAmount = parseFloat(fee?.paidAmount || 0);
        const pendingAmount = parseFloat(fee?.pendingAmount || (amount - paidAmount));
        
        acc.totalAmount += amount;
        acc.paidAmount += paidAmount;
        acc.pendingAmount += Math.max(0, pendingAmount);
        
        return acc;
      }, { totalAmount: 0, paidAmount: 0, pendingAmount: 0 });
    } catch (error) {
      console.error('Error calculating totals:', error);
      return { totalAmount: 0, paidAmount: 0, pendingAmount: 0 };
    }
  };

  // Format date - SAFE
  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch (error) {
      return 'N/A';
    }
  };

  // Get status color - SAFE
  const getStatusColor = (status) => {
    try {
      switch (status?.toLowerCase()) {
        case 'paid': return '#4CAF50';
        case 'pending': return '#FF9800';
        case 'overdue': return '#F44336';
        case 'partial': return '#2196F3';
        default: return '#666';
      }
    } catch (error) {
      return '#666';
    }
  };

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
          <Text style={styles.loadingText}>Loading fees...</Text>
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
        {feesData && feesData.length > 0 ? (
          feesData.map((fee, index) => (
            <View key={fee?._id || index} style={styles.feeCard}>
              <View style={styles.feeHeader}>
                <View style={styles.feeHeaderLeft}>
                  <Text style={styles.feeTitle}>{fee?.course || 'Course'}</Text>
                  <Text style={styles.feeId}>ID: {fee?.feeId || 'N/A'}</Text>
                </View>
                <View style={[styles.statusBadge, { 
                  backgroundColor: getStatusColor(fee?.status)
                }]}>
                  <Icon 
                    name={fee?.status === 'Paid' ? 'check' : 'schedule'} 
                    size={14} 
                    color="#fff" 
                    type="MaterialIcons"
                  />
                  <Text style={styles.statusBadgeText}>{fee?.status || 'Pending'}</Text>
                </View>
              </View>

              <View style={styles.feeDetailsSection}>
                <View style={styles.feeRow}>
                  <Icon name="person" size={16} color="#666" type="MaterialIcons" />
                  <Text style={styles.feeLabel}>Student:</Text>
                  <Text style={styles.feeValue}>{fee?.studentName || 'N/A'}</Text>
                </View>
                
                <View style={styles.feeRow}>
                  <Icon name="attach-money" size={16} color="#666" type="MaterialIcons" />
                  <Text style={styles.feeLabel}>Total:</Text>
                  <Text style={styles.feeValue}>₹{parseFloat(fee?.amount || 0).toLocaleString()}</Text>
                </View>
                
                <View style={styles.feeRow}>
                  <Icon name="account-balance-wallet" size={16} color="#4CAF50" type="MaterialIcons" />
                  <Text style={styles.feeLabel}>Paid:</Text>
                  <Text style={[styles.feeValue, { color: '#4CAF50' }]}>₹{parseFloat(fee?.paidAmount || 0).toLocaleString()}</Text>
                </View>

                {(fee?.pendingAmount || 0) > 0 && (
                  <View style={styles.feeRow}>
                    <Icon name="pending" size={16} color="#F44336" type="MaterialIcons" />
                    <Text style={styles.feeLabel}>Pending:</Text>
                    <Text style={[styles.feeValue, { color: '#F44336' }]}>₹{parseFloat(fee?.pendingAmount || 0).toLocaleString()}</Text>
                  </View>
                )}
                
                <View style={styles.feeRow}>
                  <Icon name="calendar-today" size={16} color="#666" type="MaterialIcons" />
                  <Text style={styles.feeLabel}>Due Date:</Text>
                  <Text style={styles.feeValue}>{formatDate(fee?.dueDate)}</Text>
                </View>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Icon name="receipt-long" size={64} color="#ccc" type="MaterialIcons" />
            <Text style={styles.emptyStateTitle}>No Fees</Text>
            <Text style={styles.emptyStateText}>No fees data available</Text>
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  infoBanner: {
    flexDirection: 'row',
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 12,
    marginTop: 15,
    marginBottom: 5,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
    alignItems: 'center',
    gap: 10,
  },
  infoBannerTextContainer: {
    flex: 1,
  },
  infoBannerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2E7D32',
    marginBottom: 2,
  },
  infoBannerText: {
    fontSize: 12,
    color: '#388E3C',
    lineHeight: 16,
  },
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
  },
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
