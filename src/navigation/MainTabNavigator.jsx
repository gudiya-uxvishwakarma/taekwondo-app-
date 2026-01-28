import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { colors } from '../theme';
import { NavigationProvider, useNavigation } from '../context/NavigationContext';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// Import screens
import DashboardScreen from '../screens/DashboardScreen';
import AttendanceScreen from '../screens/AttendanceScreen';
import FeesScreen from '../screens/FeesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LevelStatusScreen from '../screens/LevelStatusScreen';
import EventsScreen from '../screens/EventsScreen';
import CertificateCardScreen from '../screens/CertificateCardScreen';



// Icon component using react-native-vector-icons
const TabIcon = ({ name, focused }) => {
  const iconColor = focused ? colors.primary : '#8B8B8B';
  const iconSize = 26;
  
  let iconName = 'dashboard';
  
  switch (name) {
    case 'Dashboard':
      iconName = 'dashboard';
      break;
    case 'Attendance':
      iconName = 'assignment-turned-in';
      break;
    case 'Fees':
      iconName = 'account-balance-wallet';
      break;
    case 'Events':
      iconName = 'event';
      break;
    case 'Profile':
      iconName = 'person';
      break;
    default:
      iconName = 'help';
  }
  
  return (
    <View style={[
      styles.iconContainer,
      focused && styles.activeIconContainer
    ]}>
      <MaterialIcons name={iconName} size={iconSize} color={iconColor} />
    </View>
  );
};

const TabNavigatorContent = () => {
  const { currentScreen, navigate } = useNavigation();

  const tabs = [
    { name: 'Dashboard', component: DashboardScreen, label: 'Dashboard' },
    { name: 'Attendance', component: AttendanceScreen, label: 'Attendance' },
    { name: 'Fees', component: FeesScreen, label: 'Fees' },
    { name: 'Events', component: EventsScreen, label: 'Events' },
    { name: 'Profile', component: ProfileScreen, label: 'Profile' },
  ];

  const allScreens = {
    Dashboard: DashboardScreen,
    Attendance: AttendanceScreen,
    Fees: FeesScreen,
    Profile: ProfileScreen,
    Level: LevelStatusScreen,
    Events: EventsScreen,
    Certificates: CertificateCardScreen,
   
  };

  const renderActiveScreen = () => {
    const Component = allScreens[currentScreen] || DashboardScreen;
    return <Component />;
  };

  const isTabScreen = tabs.some(tab => tab.name === currentScreen);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.screenContainer}>
        {renderActiveScreen()}
      </View>
      
      {isTabScreen && (
        <View style={styles.tabBar}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.name}
              style={styles.tabButton}
              onPress={() => navigate(tab.name)}
              activeOpacity={0.7}
            >
              <TabIcon name={tab.name} focused={currentScreen === tab.name} />
              <Text style={[
                styles.tabLabel,
                { color: currentScreen === tab.name ? colors.primary : '#8B8B8B' }
              ]}>
                {tab.label || tab.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </SafeAreaView>
  );
};

const MainTabNavigator = () => {
  return (
    <NavigationProvider>
      <TabNavigatorContent />
    </NavigationProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screenContainer: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    height: 75,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 25,
    borderTopWidth: 0,
    paddingBottom: 8,
    paddingTop: 12,
    paddingHorizontal: 8,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    borderRadius: 16,
    marginHorizontal: 4,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 48,
    borderRadius: 24,
    marginBottom: 2,
  },
  activeIconContainer: {
    backgroundColor: colors.primary + '15',
    borderWidth: 2,
    borderColor: colors.primary + '30',
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginTop: 2,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
    letterSpacing: 0.3,
  },
});

export default MainTabNavigator;