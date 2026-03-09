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
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { useNavigation } from '../context/NavigationContext';
import { StudentService } from '../services';
import Icon from '../components/common/Icon';
import api from '../services/api';

const FeesScreen = () => {
  const { navigate } = useNavigation();
  const [feesData, setFeesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [dataSource, setDataSource] = useState('api');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [transactionId, setTransactionId] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [processingPayment, setProcessingPayment] = useState(false);

  // Load fees data from API
  useEffect(() => {
    loadFeesData();
  }, []);

  const loadFeesData = async () => {
    try {
      setLoading(true);
      console.log('📊 Loading fees data from API...');
      
      // Fetch real data from backend
      const response = await StudentService.getFees();
      
      if (response && response.status === 'success') {
        let fees = [];
        
        // Extract fees array from response
        if (response.data && response.data.fees) {
          fees = response.data.fees;
        } else if (response.fees) {
          fees = response.fees;
        } else if (Array.isArray(response.data)) {
          fees = response.data;
        }
        
        console.log('📊 Raw fees from backend:', fees);
        
        // Transform fees to match screen format
        const transformedFees = fees.map(fee => {
          const amount = parseFloat(fee.amount || 0);
          const totalPaidAmount = parseFloat(fee.totalPaidAmount || 0);
          const lateFeeAmount = parseFloat(fee.lateFee?.amount || 0);
          const discountAmount = parseFloat(fee.discount?.amount || 0);
          
          // Calculate total amount including late fee and discount
          const totalAmount = amount + lateFeeAmount - discountAmount;
          
          // Calculate pending amount
          const pendingAmount = Math.max(0, totalAmount - totalPaidAmount);
          
          console.log(`📊 Fee ${fee.feeId}:`, {
            amount,
            totalPaidAmount,
            lateFeeAmount,
            discountAmount,
            totalAmount,
            pendingAmount,
            status: fee.status
          });
          
          return {
            _id: fee._id || fee.feeId,
            feeId: fee.feeId || fee._id,
            studentName: fee.studentName || 'Unknown',
            course: fee.course || 'N/A',
            feeType: fee.feeType || fee.course,
            amount: totalAmount,
            paidAmount: totalPaidAmount,
            pendingAmount: pendingAmount,
            dueDate: fee.dueDate ? new Date(fee.dueDate) : new Date(),
            status: fee.status || 'Pending',
          };
        });
        
        console.log('📊 Transformed fees:', transformedFees);
        
        setFeesData(transformedFees);
        setDataSource('api');
        console.log(`✅ Loaded ${transformedFees.length} fees from API`);
      } else {
        console.log('⚠️ No fees data in response, using empty array');
        setFeesData([]);
      }
      
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

  const handlePayFee = (fee) => {
    setSelectedFee(fee);
    setPaymentAmount(fee.pendingAmount?.toString() || fee.amount?.toString() || '');
    setTransactionId('');
    setPaymentMethod('UPI');
    setShowPaymentModal(true);
  };

  const handlePaymentSubmit = async () => {
    try {
      if (!paymentMethod) {
        Alert.alert('Error', 'Please select a payment method');
        return;
      }

      const amount = parseFloat(paymentAmount);
      if (isNaN(amount) || amount <= 0) {
        Alert.alert('Error', 'Please enter a valid payment amount');
        return;
      }

      const pendingAmount = selectedFee.pendingAmount || (selectedFee.amount - selectedFee.paidAmount);
      if (amount > pendingAmount) {
        Alert.alert('Error', `Payment amount cannot exceed pending amount (₹${pendingAmount})`);
        return;
      }

      setProcessingPayment(true);

      // Auto-generate transaction ID
      const autoTransactionId = `${paymentMethod.toUpperCase()}-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

      console.log('💳 Submitting payment:', {
        feeId: selectedFee._id,
        amount,
        paymentMethod,
        transactionId: autoTransactionId
      });

      // Call payment API
      const response = await api.post(`/fees/${selectedFee._id}/payment`, {
        amount,
        paymentMethod,
        transactionId: autoTransactionId,
        paidDate: new Date().toISOString(),
        notes: `Payment made via mobile app - ${paymentMethod}`
      });

      console.log('✅ Payment response:', response);

      if (response.status === 'success') {
        Alert.alert(
          'Payment Successful',
          response.message || 'Your payment has been recorded successfully',
          [
            {
              text: 'OK',
              onPress: () => {
                setShowPaymentModal(false);
                setSelectedFee(null);
                loadFeesData(); // Reload fees data
              }
            }
          ]
        );
      } else {
        throw new Error(response.message || 'Payment failed');
      }
    } catch (error) {
      console.error('❌ Payment error:', error);
      Alert.alert(
        'Payment Failed',
        error.message || 'Failed to process payment. Please try again.'
      );
    } finally {
      setProcessingPayment(false);
    }
  };

  const handleCancelPayment = () => {
    setShowPaymentModal(false);
    setSelectedFee(null);
    setTransactionId('');
    setPaymentAmount('');
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
        case 'overdue': return '#006CB5';
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
        <StatusBar barStyle="light-content" backgroundColor="#006CB5" />
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <Icon name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Fees</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#006CB5" />
          <Text style={styles.loadingText}>Loading fees...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#006CB5" />
      
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
            colors={['#006CB5']}
            tintColor="#006CB5"
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
            <Icon name="pending" size={20} color="#006CB5" type="MaterialIcons" />
            <Text style={[styles.statValue, { color: '#006CB5' }]}>₹{totals.pendingAmount.toLocaleString()}</Text>
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
                    <Icon name="pending" size={16} color="#006CB5" type="MaterialIcons" />
                    <Text style={styles.feeLabel}>Pending:</Text>
                    <Text style={[styles.feeValue, { color: '#006CB5' }]}>₹{parseFloat(fee?.pendingAmount || 0).toLocaleString()}</Text>
                  </View>
                )}
                
                <View style={styles.feeRow}>
                  <Icon name="calendar-today" size={16} color="#666" type="MaterialIcons" />
                  <Text style={styles.feeLabel}>Due Date:</Text>
                  <Text style={styles.feeValue}>{formatDate(fee?.dueDate)}</Text>
                </View>
              </View>

              {/* Pay Button - Show only for Pending/Partial/Overdue fees */}
              {(fee?.status === 'Pending' || fee?.status === 'Partial' || fee?.status === 'Overdue') && (
                <TouchableOpacity
                  style={styles.payButton}
                  onPress={() => handlePayFee(fee)}
                  activeOpacity={0.7}
                >
                  <Icon name="payment" size={18} color="#fff" type="MaterialIcons" />
                  <Text style={styles.payButtonText}>Pay Now</Text>
                </TouchableOpacity>
              )}
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

      {/* Payment Modal */}
      <Modal
        visible={showPaymentModal}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCancelPayment}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Make Payment</Text>
              <TouchableOpacity onPress={handleCancelPayment} style={styles.modalCloseButton}>
                <Icon name="close" size={24} color="#666" type="MaterialIcons" />
              </TouchableOpacity>
            </View>

            {selectedFee && (
              <>
                <View style={styles.modalFeeInfo}>
                  <Text style={styles.modalFeeTitle}>{selectedFee.course}</Text>
                  <Text style={styles.modalFeeAmount}>
                    Pending: ₹{(selectedFee.pendingAmount || (selectedFee.amount - selectedFee.paidAmount)).toLocaleString()}
                  </Text>
                </View>

                <View style={styles.modalForm}>
                  <Text style={styles.modalLabel}>Payment Amount</Text>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="Enter amount"
                    keyboardType="numeric"
                    value={paymentAmount}
                    onChangeText={setPaymentAmount}
                  />

                  <Text style={styles.modalLabel}>Payment Method</Text>
                  <View style={styles.paymentMethodContainer}>
                    {['UPI', 'Cash', 'Bank Transfer', 'Card'].map((method) => (
                      <TouchableOpacity
                        key={method}
                        style={[
                          styles.paymentMethodButton,
                          paymentMethod === method && styles.paymentMethodButtonActive
                        ]}
                        onPress={() => setPaymentMethod(method)}
                      >
                        <Text style={[
                          styles.paymentMethodText,
                          paymentMethod === method && styles.paymentMethodTextActive
                        ]}>
                          {method}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <View style={styles.modalActions}>
                    <TouchableOpacity
                      style={styles.modalCancelButton}
                      onPress={handleCancelPayment}
                      disabled={processingPayment}
                    >
                      <Text style={styles.modalCancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.modalSubmitButton, processingPayment && styles.modalSubmitButtonDisabled]}
                      onPress={handlePaymentSubmit}
                      disabled={processingPayment}
                    >
                      {processingPayment ? (
                        <ActivityIndicator size="small" color="#fff" />
                      ) : (
                        <Text style={styles.modalSubmitButtonText}>Submit Payment</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#006CB5',
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
  payButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 12,
    gap: 8,
  },
  payButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  modalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalFeeInfo: {
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalFeeTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  modalFeeAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#006CB5',
  },
  modalForm: {
    padding: 20,
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
    marginTop: 12,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: '#333',
    backgroundColor: '#fff',
  },
  paymentMethodContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  paymentMethodButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  paymentMethodButtonActive: {
    backgroundColor: '#006CB5',
    borderColor: '#006CB5',
  },
  paymentMethodText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  paymentMethodTextActive: {
    color: '#fff',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  modalCancelButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#666',
  },
  modalSubmitButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
  },
  modalSubmitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  modalSubmitButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
});

export default FeesScreen;
