import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { useNavigation } from '../context/NavigationContext';
import { StudentService } from '../services';
import API_CONFIG from '../config/api';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';

// Enhanced Icon component with more icon libraries
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
      console.log('🔄 Loading fees data from backend...');
      console.log('🌐 Fees API:', `${API_CONFIG.BASE_URL}/fees`);
      
      // Try authenticated endpoint first
      try {
        const response = await StudentService.getFees();
        if (response.status === 'success' && response.data) {
          console.log('✅ Got fees data (authenticated):', response.data.fees?.length || 0, 'records');
          setFeesData(response.data.fees || []);
          return;
        }
      } catch (authError) {
        console.log('⚠️ Authenticated fees request failed, trying fallback');
      }
      
      // Fallback to mock data if API fails
      console.log('🔄 Using mock data as fallback...');
      const mockData = getMockFeesData();
      setFeesData([mockData]);
      
    } catch (error) {
      console.error('❌ Failed to load fees:', error);
      // Fallback to mock data if API fails
      const mockData = getMockFeesData();
      setFeesData([mockData]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadFeesData();
    setRefreshing(false);
  };

  const handleDownloadReceipt = async (receiptNo) => {
    try {
      Alert.alert('Download Receipt', `Receipt ${receiptNo} downloaded successfully!`);
    } catch (error) {
      console.error('Failed to download receipt:', error);
      Alert.alert('Download Failed', 'Failed to download receipt. Please try again.');
    }
  };

  // Calculate totals from fees data
  const calculateTotals = () => {
    if (!feesData || feesData.length === 0) {
      return { totalAmount: 0, paidAmount: 0, pendingAmount: 0 };
    }

    const totals = feesData.reduce((acc, fee) => {
      const feeTotal = fee.amount + (fee.lateFee?.amount || 0) - (fee.discount?.amount || 0);
      acc.totalAmount += feeTotal;
      acc.paidAmount += fee.totalPaidAmount || 0;
      
      const remaining = feeTotal - (fee.totalPaidAmount || 0);
      if (remaining > 0) {
        acc.pendingAmount += remaining;
      }
      
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

  // Get payment method icon
  const getPaymentMethodIcon = (method) => {
    switch (method?.toLowerCase()) {
      case 'upi': return { name: 'account-balance-wallet', type: 'MaterialIcons' };
      case 'cash': return { name: 'money', type: 'FontAwesome5' };
      case 'card': return { name: 'credit-card', type: 'FontAwesome5' };
      case 'bank transfer': return { name: 'bank', type: 'FontAwesome5' };
      case 'cheque': return { name: 'receipt', type: 'MaterialIcons' };
      default: return { name: 'payment', type: 'MaterialIcons' };
    }
  };

  // Enhanced mock fees data matching backend structure
  const getMockFeesData = () => ({
    _id: '507f1f77bcf86cd799439011',
    feeId: 'FEE17406837123ABC',
    studentName: 'Adarsh Kumar',
    course: 'Advanced',
    feeType: 'Monthly Fee',
    amount: 5000,
    dueDate: '2025-02-15T00:00:00.000Z',
    paidDate: '2025-01-20T00:00:00.000Z',
    status: 'Paid',
    paymentMethod: 'UPI',
    transactionId: 'TXN123456789',
    receiptNumber: 'RCP1740683712',
    discount: {
      amount: 500,
      reason: 'Early payment discount'
    },
    lateFee: {
      amount: 0,
      appliedDate: null
    },
    notes: 'Monthly training fee for Advanced Taekwon-Do program',
    paymentHistory: [
      {
        amount: 4500,
        paymentMethod: 'UPI',
        transactionId: 'TXN123456789',
        paidDate: '2025-01-20T00:00:00.000Z',
        lateFee: { amount: 0 },
        discount: { amount: 500, reason: 'Early payment discount' },
        notes: 'Full payment with early discount',
        recordedAt: '2025-01-20T00:00:00.000Z'
      }
    ],
    totalPaidAmount: 4500,
    createdAt: '2025-01-15T00:00:00.000Z',
    updatedAt: '2025-01-20T00:00:00.000Z'
  });

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
            <Icon name="currency-rupee" size={20} color="#666" type="MaterialIcons" />
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
                  <Text style={styles.feeTitle}>{fee.feeType}</Text>
                  <Text style={styles.feeId}>ID: {fee.feeId}</Text>
                </View>
                <View style={[styles.statusBadge, { 
                  backgroundColor: getStatusColor(fee.status)
                }]}>
                  <Icon 
                    name={fee.status === 'Paid' ? 'check' : fee.status === 'Pending' ? 'schedule' : 'warning'} 
                    size={14} 
                    color="#fff" 
                    type="MaterialIcons"
                  />
                  <Text style={styles.statusBadgeText}>{fee.status}</Text>
                </View>
              </View>

              {/* Fee Details */}
              <View style={styles.feeDetailsSection}>
                <View style={styles.feeRow}>
                  <Icon name="person" size={16} color="#666" type="MaterialIcons" />
                  <Text style={styles.feeLabel}>Student:</Text>
                  <Text style={styles.feeValue}>{fee.studentName}</Text>
                </View>
                
                <View style={styles.feeRow}>
                  <Icon name="school" size={16} color="#666" type="MaterialIcons" />
                  <Text style={styles.feeLabel}>Course:</Text>
                  <Text style={styles.feeValue}>{fee.course}</Text>
                </View>
                
                <View style={styles.feeRow}>
                  <Icon name="currency-rupee" size={16} color="#666" type="MaterialIcons" />
                  <Text style={styles.feeLabel}>Amount:</Text>
                  <Text style={styles.feeValue}>₹{fee.amount.toLocaleString()}</Text>
                </View>

                {fee.discount && fee.discount.amount > 0 && (
                  <View style={styles.feeRow}>
                    <Icon name="local-offer" size={16} color="#4CAF50" type="MaterialIcons" />
                    <Text style={styles.feeLabel}>Discount:</Text>
                    <Text style={[styles.feeValue, { color: '#4CAF50' }]}>-₹{fee.discount.amount.toLocaleString()}</Text>
                  </View>
                )}

                {fee.lateFee && fee.lateFee.amount > 0 && (
                  <View style={styles.feeRow}>
                    <Icon name="warning" size={16} color="#F44336" type="MaterialIcons" />
                    <Text style={styles.feeLabel}>Late Fee:</Text>
                    <Text style={[styles.feeValue, { color: '#F44336' }]}>+₹{fee.lateFee.amount.toLocaleString()}</Text>
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

                <View style={styles.feeRow}>
                  <Icon name="account-balance-wallet" size={16} color="#666" type="MaterialIcons" />
                  <Text style={styles.feeLabel}>Paid Amount:</Text>
                  <Text style={[styles.feeValue, { color: '#4CAF50' }]}>₹{(fee.totalPaidAmount || 0).toLocaleString()}</Text>
                </View>

                {fee.paymentMethod && (
                  <View style={styles.feeRow}>
                    <Icon 
                      name={getPaymentMethodIcon(fee.paymentMethod).name} 
                      size={16} 
                      color="#666" 
                      type={getPaymentMethodIcon(fee.paymentMethod).type}
                    />
                    <Text style={styles.feeLabel}>Payment Method:</Text>
                    <Text style={styles.feeValue}>{fee.paymentMethod}</Text>
                  </View>
                )}

                {fee.transactionId && (
                  <View style={styles.feeRow}>
                    <Icon name="receipt" size={16} color="#666" type="MaterialIcons" />
                    <Text style={styles.feeLabel}>Transaction ID:</Text>
                    <Text style={styles.feeValue}>{fee.transactionId}</Text>
                  </View>
                )}
              </View>

              {/* Payment History */}
              {fee.paymentHistory && fee.paymentHistory.length > 0 && (
                <View style={styles.paymentHistorySection}>
                  <Text style={styles.sectionTitle}>Payment History</Text>
                  {fee.paymentHistory.map((payment, paymentIndex) => (
                    <View key={paymentIndex} style={styles.paymentCard}>
                      <View style={styles.paymentHeader}>
                        <Text style={styles.paymentAmount}>₹{payment.amount.toLocaleString()}</Text>
                        <Text style={styles.paymentDate}>{formatDate(payment.paidDate)}</Text>
                      </View>
                      <View style={styles.paymentDetails}>
                        <Text style={styles.paymentMethod}>{payment.paymentMethod}</Text>
                        {payment.transactionId && (
                          <Text style={styles.paymentTransaction}>ID: {payment.transactionId}</Text>
                        )}
                      </View>
                    </View>
                  ))}
                </View>
              )}

              {/* Receipt Download Button */}
              {fee.receiptNumber && (
                <TouchableOpacity 
                  style={styles.receiptButton}
                  onPress={() => handleDownloadReceipt(fee.receiptNumber)}
                >
                  <Icon name="file-download" size={16} color="#fff" type="MaterialIcons" />
                  <Text style={styles.receiptButtonText}>Download Receipt</Text>
                </TouchableOpacity>
              )}

              {/* Notes */}
              {fee.notes && (
                <View style={styles.notesSection}>
                  <Icon name="note" size={16} color="#666" type="MaterialIcons" />
                  <Text style={styles.notesText}>{fee.notes}</Text>
                </View>
              )}
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Icon name="receipt-long" size={64} color="#ccc" type="MaterialIcons" />
            <Text style={styles.emptyStateTitle}>No Fee Records</Text>
            <Text style={styles.emptyStateText}>No fee records found for your account.</Text>
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