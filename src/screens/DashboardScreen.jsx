import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
  StatusBar,
  Modal,
  Image,
} from 'react-native';
import { useNavigation } from '../context/NavigationContext';
import { StudentService } from '../services';
import IconVerificationScreen from './IconVerificationScreen';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

// Icon component using react-native-vector-icons
const Icon = ({ name, size = 24, color = '#000', type = 'MaterialIcons' }) => {
  const IconComponent = {
    MaterialIcons,
    MaterialCommunityIcons,
    Ionicons,
    FontAwesome,
  }[type];

  return <IconComponent name={name} size={size} color={color} />;
};

const { width } = Dimensions.get('window');

const DashboardScreen = () => {
  const { navigate } = useNavigation();
  const [showIconTest, setShowIconTest] = useState(false);

  // Quick Overview Data - Updated with dynamic calculations
  const [pendingFees, setPendingFees] = useState(3); // This will be dynamic from API
  const [totalEvents, setTotalEvents] = useState(25); // This will be dynamic from API
  const [attendancePercentage, setAttendancePercentage] = useState(95); // This will be dynamic from API

  // Simulate fetching real data - Replace with actual API calls
  useEffect(() => {
    // Simulate API calls to get real data
    const fetchDashboardData = async () => {
      try {
        // Replace these with actual API calls
        // const studentsResponse = await fetch('/api/students/count');
        // const eventsResponse = await fetch('/api/events/count');
        // const attendanceResponse = await fetch('/api/attendance/percentage');
        
        // Try to get real pending fees count from StudentService
        try {
          const feesResponse = await StudentService.getFees();
          if (feesResponse && feesResponse.status === 'success') {
            let feesArray = [];
            
            if (feesResponse.data && feesResponse.data.fees) {
              feesArray = feesResponse.data.fees;
            } else if (feesResponse.fees) {
              feesArray = feesResponse.fees;
            }
            
            // Count pending fees
            const pendingCount = feesArray.filter(fee => 
              fee.status && (fee.status.toLowerCase() === 'pending' || fee.status.toLowerCase() === 'overdue')
            ).length;
            
            setPendingFees(pendingCount);
          } else {
            // Fallback to mock data
            const mockPendingFees = Math.floor(Math.random() * 6); // 0-5 pending fees
            setPendingFees(mockPendingFees);
          }
        } catch (feesError) {
          console.log('Could not fetch fees data for dashboard:', feesError.message);
          // Fallback to mock data
          const mockPendingFees = Math.floor(Math.random() * 6); // 0-5 pending fees
          setPendingFees(mockPendingFees);
        }
        
        // For now, using mock data for other metrics
        const mockEvents = Math.floor(Math.random() * 15) + 20; // 20-35 events
        const mockAttendance = Math.floor(Math.random() * 20) + 80; // 80-100% attendance
        
        setTotalEvents(mockEvents);
        setAttendancePercentage(mockAttendance);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  const quickOverview = [
    { 
      title: `${pendingFees}`, 
      subtitle: 'Pending Fees', 
      icon: 'account-balance-wallet', 
      color: pendingFees > 0 ? '#f39c12' : '#27ae60', // Orange if pending, green if none
      bgColor: pendingFees > 0 ? '#fef9e7' : '#eafaf1', // Light orange/green background
      route: 'Fees'
    },
    { 
      title: `${totalEvents}`, 
      subtitle: 'Total Events', 
      icon: 'event', 
      color: '#e74c3c',
      bgColor: '#ffeaea',
      route: 'Events'
    },
    { 
      title: `${attendancePercentage}%`, 
      subtitle: 'Attendance', 
      icon: 'assignment-turned-in', 
      color: '#e74c3c',
      bgColor: '#ffeaea',
      route: 'Attendance'
    },
  ];

  // Quick Access Data - Updated with only requested options
  const quickAccess = [
    { title: 'Attendance', icon: 'assignment-turned-in', color: '#e74c3c', route: 'Attendance' },
    { title: 'Level/Belt', icon: 'military-tech', color: '#e74c3c', route: 'Level' },
    { title: 'Events', icon: 'event', color: '#e74c3c', route: 'Events' },
    { title: 'Certificates', icon: 'card-membership', color: '#e74c3c', route: 'Certificates' },
    { title: 'Fees', icon: 'account-balance-wallet', color: '#e74c3c', route: 'Fees' },
    { title: 'Online Payment', icon: 'payment', color: '#e74c3c', route: 'OnlinePayment' },
  ];

  const handleQuickOverviewPress = (item) => {
    console.log('Quick Overview pressed:', item.subtitle);
    console.log('Navigating to:', item.route);
    
    // Navigate to the screen using the route property
    if (item.route && ['Fees', 'Events', 'Attendance'].includes(item.route)) {
      navigate(item.route);
    } else {
      Alert.alert('Coming Soon', `${item.subtitle} feature will be available soon!`);
    }
  };

  const handleQuickAccessPress = (item) => {
    console.log('Navigating to:', item.route);
    // Navigate to existing screens
    if (['Attendance', 'Level', 'Events', 'Certificates', 'Fees'].includes(item.route)) {
      navigate(item.route);
    } else {
      // For features not yet implemented
      Alert.alert('Coming Soon', `${item.title} feature will be available soon!`);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#e74c3c" />
      
      {/* Custom Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.leftSection}>
            <View style={styles.avatarContainer}>
              <Image
                source={require('../assets/taekwondo-logo.png')}
                style={styles.logoImage}
                resizeMode="cover"
              />
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.greeting}>Hello!</Text>
                    <Text style={styles.greeting}>Adarsh</Text>
            </View>
          </View>
          <View style={styles.rightSection}>
            <TouchableOpacity style={styles.notificationButton}>
              <Icon name="notifications" size={24} color="#fff" type="MaterialIcons" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        {/* Quick Overview Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Overview</Text>
          <View style={styles.overviewGrid}>
            {quickOverview.map((item, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.overviewCard}
                onPress={() => handleQuickOverviewPress(item)}
                activeOpacity={0.6}
                underlayColor="#f0f0f0"
              >
                <View style={[styles.overviewIconContainer, { backgroundColor: item.bgColor }]}>
                  <Icon name={item.icon} size={20} color={item.color} type="MaterialIcons" />
                </View>
                <Text style={styles.overviewValue}>{item.title}</Text>
                <Text style={styles.overviewLabel}>{item.subtitle}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Quick Access Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Access</Text>
          <View style={styles.accessGrid}>
            {quickAccess.map((item, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.accessCard}
                onPress={() => handleQuickAccessPress(item)}
                activeOpacity={0.7}
              >
                <View style={styles.accessIconContainer}>
                  <Icon name={item.icon} size={28} color={item.color} type="MaterialIcons" />
                </View>
                <Text style={styles.accessLabel}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Icon Test Modal */}
      <Modal visible={showIconTest} animationType="slide" onRequestClose={() => setShowIconTest(false)}>
        <IconVerificationScreen onClose={() => setShowIconTest(false)} />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f5f5f5' 
  },
  
  // Custom Header
  header: {
    backgroundColor: '#e74c3c',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarContainer: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#fff3cd', // Changed from white to a light yellow/cream color
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#ffd700', // Added golden border
  },
  logoImage: {
    width: 51,
    height: 51,
    borderRadius: 20.5,
  },

  userDetails: {
    flex: 1,
  },
  greeting: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
    opacity: 0.9,
  },
  userName: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '800',
    marginTop: 2,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Scroll View
  scrollView: {
    flex: 1,
  },
  scrollContent: { 
    paddingBottom: 100 
  },

  // Section
  section: {
    paddingHorizontal: 20,
    marginTop: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2c3e50',
    marginBottom: 15,
  },

  // Quick Overview - Reduced height
  overviewGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  overviewCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#e74c3c',
    minHeight: 100,
  },
  overviewIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  overviewValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#2c3e50',
    marginBottom: 4,
  },
  overviewLabel: {
    fontSize: 11,
    color: '#7f8c8d',
    fontWeight: '600',
    textAlign: 'center',
  },

  // Quick Access - Updated for 3x2 grid (6 items)
  accessGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 15,
  },
  accessCard: {
    width: (width - 70) / 3,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 15,
    minHeight: 90,
  },
  accessIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ffeaea',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  accessLabel: {
    fontSize: 11,
    color: '#2c3e50',
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 14,
  },
});

export default DashboardScreen;