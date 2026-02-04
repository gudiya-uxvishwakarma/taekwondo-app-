// import React from 'react';
// import { View, Text, StyleSheet, ScrollView } from 'react-native';
// import Icon from './common/Icon';

// const VectorIconTest = () => {
//   const iconTests = [
//     { name: 'home', type: 'MaterialIcons', label: 'Home (Material)' },
//     { name: 'heart', type: 'AntDesign', label: 'Heart (AntDesign)' },
//     { name: 'user', type: 'Feather', label: 'User (Feather)' },
//     { name: 'home-outline', type: 'Ionicons', label: 'Home (Ionicons)' },
//     { name: 'account', type: 'MaterialCommunityIcons', label: 'Account (MaterialCommunity)' },
//     { name: 'star', type: 'FontAwesome', label: 'Star (FontAwesome)' },
//     { name: 'star', type: 'FontAwesome5', label: 'Star (FontAwesome5)' },
//     { name: 'home', type: 'Entypo', label: 'Home (Entypo)' },
//   ];

//   return (
//     <ScrollView style={styles.container}>
//       <Text style={styles.title}>Vector Icons Test</Text>
//       <Text style={styles.subtitle}>Testing react-native-vector-icons implementation</Text>
      
//       <View style={styles.iconGrid}>
//         {iconTests.map((iconTest, index) => (
//           <View key={index} style={styles.iconItem}>
           
//             <Text style={styles.iconLabel}>{iconTest.label}</Text>
//           </View>
//         ))}
//       </View>
      
//       <View style={styles.statusContainer}>
//         <Text style={styles.statusText}>
//           If you can see all icons above, vector icons are working correctly!
//         </Text>
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#f5f5f5',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 10,
//     color: '#333',
//   },
//   subtitle: {
//     fontSize: 16,
//     textAlign: 'center',
//     marginBottom: 30,
//     color: '#666',
//   },
//   iconGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-around',
//   },
//   iconItem: {
//     alignItems: 'center',
//     margin: 15,
//     width: 120,
//   },
//   iconContainer: {
//     width: 60,
//     height: 60,
//     backgroundColor: '#fff',
//     borderRadius: 30,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 10,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.1,
//     shadowRadius: 3.84,
//     elevation: 5,
//   },
//   iconLabel: {
//     fontSize: 12,
//     textAlign: 'center',
//     color: '#333',
//     fontWeight: '500',
//   },
//   statusContainer: {
//     marginTop: 30,
//     padding: 20,
//     backgroundColor: '#e8f5e8',
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: '#4caf50',
//   },
//   statusText: {
//     fontSize: 16,
//     textAlign: 'center',
//     color: '#2e7d32',
//     fontWeight: '500',
//   },
// });

// export default VectorIconTest;