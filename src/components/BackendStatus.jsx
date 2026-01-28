// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
// import { testBackendConnection, testAllConnections } from '../utils/testConnection';

// const BackendStatus = () => {
//   const [status, setStatus] = useState('checking');
//   const [message, setMessage] = useState('Checking backend connection...');
//   const [detailedResults, setDetailedResults] = useState(null);

//   useEffect(() => {
//     checkConnection();
//   }, []);

//   const checkConnection = async () => {
//     setStatus('checking');
//     setMessage('Checking backend connection...');
    
//     // Test main connection
//     const result = await testBackendConnection();
    
//     // Test all connection methods
//     const allResults = await testAllConnections();
//     setDetailedResults(allResults);
    
//     if (result.success) {
//       setStatus('connected');
//       setMessage('✅ Backend connected successfully');
//     } else {
//       setStatus('error');
//       setMessage(`❌ Backend connection failed: ${result.error}`);
//     }
//   };

//   const getStatusColor = () => {
//     switch (status) {
//       case 'connected': return '#4CAF50';
//       case 'error': return '#F44336';
//       default: return '#FF9800';
//     }
//   };

//   const renderDetailedResults = () => {
//     if (!detailedResults) return null;
    
//     return (
//       <View style={styles.detailsContainer}>
//         <Text style={styles.detailsTitle}>Connection Test Results:</Text>
//         <Text style={styles.detailItem}>
//           🔗 Emulator IP (10.0.2.2): {detailedResults.emulatorIP ? '✅' : '❌'}
//         </Text>
//         <Text style={styles.detailItem}>
//           🏠 Localhost: {detailedResults.localhost ? '✅' : '❌'}
//         </Text>
//         <Text style={styles.detailItem}>
//           🌐 127.0.0.1: {detailedResults.networkIP ? '✅' : '❌'}
//         </Text>
//       </View>
//     );
//   };

//   return (
//     <ScrollView style={styles.container}>
//       <View style={styles.statusRow}>
//         <View style={[styles.statusIndicator, { backgroundColor: getStatusColor() }]} />
//         <Text style={styles.message}>{message}</Text>
//         <TouchableOpacity style={styles.retryButton} onPress={checkConnection}>
//           <Text style={styles.retryText}>Test Again</Text>
//         </TouchableOpacity>
//       </View>
      
//       {renderDetailedResults()}
      
//       {status === 'error' && (
//         <View style={styles.troubleshootContainer}>
//           <Text style={styles.troubleshootTitle}>💡 Troubleshooting:</Text>
//           <Text style={styles.troubleshootItem}>1. Make sure backend is running: npm start</Text>
//           <Text style={styles.troubleshootItem}>2. Check backend URL: http://10.0.2.2:5000</Text>
//           <Text style={styles.troubleshootItem}>3. Restart Metro bundler if needed</Text>
//           <Text style={styles.troubleshootItem}>4. Check firewall settings</Text>
//         </View>
//       )}
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: '#f5f5f5',
//     borderRadius: 8,
//     margin: 10,
//     maxHeight: 200,
//   },
//   statusRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 12,
//   },
//   statusIndicator: {
//     width: 12,
//     height: 12,
//     borderRadius: 6,
//     marginRight: 10,
//   },
//   message: {
//     flex: 1,
//     fontSize: 14,
//     color: '#333',
//   },
//   retryButton: {
//     backgroundColor: '#e74c3c',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 4,
//   },
//   retryText: {
//     color: '#fff',
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   detailsContainer: {
//     paddingHorizontal: 12,
//     paddingBottom: 8,
//   },
//   detailsTitle: {
//     fontSize: 12,
//     fontWeight: '600',
//     color: '#666',
//     marginBottom: 4,
//   },
//   detailItem: {
//     fontSize: 11,
//     color: '#666',
//     marginBottom: 2,
//   },
//   troubleshootContainer: {
//     paddingHorizontal: 12,
//     paddingBottom: 12,
//     backgroundColor: '#fff3cd',
//     margin: 8,
//     borderRadius: 4,
//   },
//   troubleshootTitle: {
//     fontSize: 12,
//     fontWeight: '600',
//     color: '#856404',
//     marginBottom: 4,
//   },
//   troubleshootItem: {
//     fontSize: 11,
//     color: '#856404',
//     marginBottom: 2,
//   },
// });

// export default BackendStatus;