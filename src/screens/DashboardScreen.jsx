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
} from 'react-native';
import { useNavigation } from '../context/NavigationContext';
import { StudentService } from '../services';
import Icon from '../components/common/Icon';
import Logo from '../components/common/Logo';
import VectorIconTest from '../components/VectorIconTest';

const { width } = Dimensions.get('window');

const DashboardScreen = () => {
  const { navigate } = useNavigation();
  const [showIconTest, setShowIconTest] = useState(false);

  // Quick Overview Data - Updated with dynamic calculations
  const [pendingFees, setPendingFees] = useState(0);
  const [totalEvents, setTotalEvents] = useState(0);
  const [attendancePercentage, setAttendancePercentage] = useState(0);
  const [currentBeltLevel, setCurrentBeltLevel] = useState('Loading...');
  const [studentName, setStudentName] = useState('Student');

  // Fetch dashboard data - with authentication handling
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Get student profile first to get name and belt level
        try {
          const profileResponse = await StudentService.getProfile();
          if (profileResponse) {
            setStudentName(profileResponse.fullName || profileResponse.name || 'Student');
            setCurrentBeltLevel(profileResponse.currentBeltLevel || 'N/A');
            console.log('✅ Profile loaded:', profileResponse.fullName, 'Belt:', profileResponse.currentBeltLevel);
          }
        } catch (profileError) {
          console.log('⚠️ Could not fetch profile:', profileError.message);
        }

        // Get attendance data to calculate individual percentage
        try {
          const attendanceResponse = await StudentService.getAttendance();
          if (attendanceResponse && attendanceResponse.status === 'success') {
            const attendanceRecords = attendanceResponse.data?.attendance || [];
            
            if (attendanceRecords.length > 0) {
              // Calculate attendance percentage
              const presentCount = attendanceRecords.filter(record => 
                record.status && (record.status.toLowerCase() === 'present' || record.status.toLowerCase() === 'late')
              ).length;
              
              const percentage = Math.round((presentCount / attendanceRecords.length) * 100);
              setAttendancePercentage(percentage);
              console.log('✅ Attendance calculated:', percentage + '%', `(${presentCount}/${attendanceRecords.length})`);
            } else {
              setAttendancePercentage(0);
            }
          }
        } catch (attendanceError) {
          console.log('⚠️ Could not fetch attendance:', attendanceError.message);
          setAttendancePercentage(0);
        }
        
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
            console.log('✅ Fees data loaded:', pendingCount, 'pending');
          } else {
            setPendingFees(0);
          }
        } catch (feesError) {
          console.log('⚠️ Could not fetch fees data:', feesError.message);
          setPendingFees(0);
        }

        // Get events count
        try {
          const eventsResponse = await StudentService.getEvents();
          if (eventsResponse && eventsResponse.status === 'success') {
            const eventsArray = eventsResponse.data?.events || [];
            setTotalEvents(eventsArray.length);
            console.log('✅ Events loaded:', eventsArray.length);
          } else {
            setTotalEvents(0);
          }
        } catch (eventsError) {
          console.log('⚠️ Could not fetch events:', eventsError.message);
          setTotalEvents(0);
        }
      } catch (error) {
        console.error('❌ Error fetching dashboard data:', error);
        // Set fallback values to prevent crashes
        setPendingFees(0);
        setTotalEvents(0);
        setAttendancePercentage(0);
        setCurrentBeltLevel('N/A');
      }
    };

    fetchDashboardData();
  }, []);

  const quickOverview = [
    { 
      title: `${pendingFees}`, 
      subtitle: 'Pending Fees', 
      icon: 'account-balance-wallet', 
      color: pendingFees > 0 ? '#f39c12' : '#27ae60',
      bgColor: pendingFees > 0 ? '#fef9e7' : '#eafaf1',
      route: 'Fees'
    },
    { 
      title: `${totalEvents}`, 
      subtitle: 'Total Events', 
      icon: 'event', 
      color: '#006CB5',
      bgColor: '#e3f2fd',
      route: 'Events'
    },
    { 
      title: `${attendancePercentage}%`, 
      subtitle: 'My Attendance', 
      icon: 'assignment-turned-in', 
      color: attendancePercentage >= 75 ? '#27ae60' : '#f39c12',
      bgColor: attendancePercentage >= 75 ? '#eafaf1' : '#fef9e7',
      route: 'Attendance'
    },
    { 
      title: currentBeltLevel, 
      subtitle: 'My Belt Level', 
      icon: 'military-tech', 
      color: '#8e44ad',
      bgColor: '#f4ecf7',
      route: 'Level'
    },
  ];

  // Quick Access Data - Updated: Removed Online Payment, Added Gallery
  const quickAccess = [
    { title: 'Attendance', icon: 'assignment-turned-in', color: '#006CB5', route: 'Attendance' },
    { title: 'Level/Belt', icon: 'military-tech', color: '#006CB5', route: 'Level' },
    { title: 'Events', icon: 'event', color: '#006CB5', route: 'Events' },
    { title: 'Certificates', icon: 'card-membership', color: '#006CB5', route: 'Certificates' },
    { title: 'Fees', icon: 'account-balance-wallet', color: '#006CB5', route: 'Fees' },
    { title: 'Gallery', icon: 'photo-library', color: '#006CB5', route: 'Gallery' },
  ];

  const handleQuickOverviewPress = (item) => {
    try {
      console.log('Quick Overview pressed:', item.subtitle);
      console.log('Navigating to:', item.route);
      
      // Navigate to the screen using the route property
      // Commented out belt level navigation as requested
      if (item.route && ['Fees', 'Events', 'Attendance'].includes(item.route)) {
        navigate(item.route);
      } else if (item.route === 'Level') {
        // Navigate to Level Status screen
        console.log('Navigating to Level Status screen');
        navigate('Level');
      } else {
        Alert.alert('Coming Soon', `${item.subtitle} feature will be available soon!`);
      }
    } catch (error) {
      console.error('❌ Navigation error:', error);
      Alert.alert('Error', 'Unable to navigate. Please try again.');
    }
  };

  const handleQuickAccessPress = (item) => {
    try {
      console.log('Navigating to:', item.route);
      // Navigate to existing screens
      // Commented out belt level navigation as requested
      if (['Attendance', 'Events', 'Certificates', 'Fees', 'Gallery'].includes(item.route)) {
        navigate(item.route);
      } else if (item.route === 'Level') {
        // Navigate to Level Status screen
        console.log('Navigating to Level Status screen');
        navigate('Level');
      } else {
        // For features not yet implemented
        Alert.alert('Coming Soon', `${item.title} feature will be available soon!`);
      }
    } catch (error) {
      console.error('❌ Navigation error:', error);
      Alert.alert('Error', 'Unable to navigate. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#006CB5" />
      
      {/* Custom Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.leftSection}>
            <View style={styles.avatarContainer}>
              <Logo size="small" showText={false} variant="navbar" />
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.greeting}>Hello!</Text>
              <Text style={styles.userName}>{studentName}</Text>
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

      {/* Vector Icon Test Modal */}
      <Modal visible={showIconTest} animationType="slide" onRequestClose={() => setShowIconTest(false)}>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: '#006CB5' }}>
            <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>Vector Icons Test</Text>
            <TouchableOpacity onPress={() => setShowIconTest(false)}>
              <Icon name="close" size={24} color="#fff" type="MaterialIcons" />
            </TouchableOpacity>
          </View>
          <VectorIconTest />
        </View>
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
    backgroundColor: '#006CB5',
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
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#ffd700',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userName: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '800',
    marginTop: 2,
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

  // Quick Overview - Now 4 cards in 2x2 grid
  overviewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  overviewCard: {
    width: (width - 52) / 2,
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
    borderLeftColor: '#006CB5',
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
    backgroundColor: '#e3f2fd',
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