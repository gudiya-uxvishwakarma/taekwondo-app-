import { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
  ScrollView,
  Image,
} from 'react-native';
import { useNavigation } from '../../context/NavigationContext';
import { useStudent } from '../../context/StudentContext';
import { colors } from '../../theme';
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

const Navbar = () => {
  const navigation = useNavigation();
  const { logout } = useStudent();
  const [menuVisible, setMenuVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(width)).current;

  const menuItems = [
    { id: 1, title: 'Dashboard', iconType: 'MaterialIcons', iconName: 'dashboard', route: 'Dashboard' },
    { id: 2, title: 'Attendance', iconType: 'MaterialIcons', iconName: 'assignment', route: 'Attendance' },
    { id: 3, title: 'Level / Belt', iconType: 'MaterialIcons', iconName: 'military-tech', route: 'Level' },
    { id: 4, title: 'Events', iconType: 'MaterialIcons', iconName: 'event', route: 'Events' },
    { id: 5, title: 'Certificates', iconType: 'MaterialIcons', iconName: 'workspace-premium', route: 'Certificates' },
    { id: 6, title: 'Fee Summary', iconType: 'MaterialIcons', iconName: 'account-balance-wallet', route: 'Fees' },
    { id: 7, title: 'Profile', iconType: 'MaterialIcons', iconName: 'person', route: 'Profile' },
  ];

  const renderIcon = (iconType, iconName, size = 24, color = '#ff6b6b') => {
    switch (iconType) {
      case 'MaterialIcons':
        return <Icon name={iconName} size={size} color={color} type="MaterialIcons" />;
      case 'MaterialCommunityIcons':
        return <Icon name={iconName} size={size} color={color} type="MaterialCommunityIcons" />;
      case 'Ionicons':
        return <Icon name={iconName} size={size} color={color} type="Ionicons" />;
      default:
        return <Icon name="sports-martial-arts" size={size} color={color} type="MaterialIcons" />;
    }
  };

  const openMenu = () => {
    setMenuVisible(true);
    Animated.spring(slideAnim, {
      toValue: 0,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const closeMenu = () => {
    Animated.timing(slideAnim, {
      toValue: width,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setMenuVisible(false);
    });
  };

  const handleMenuItemPress = (route) => {
    console.log('Navigating to:', route); // Debug log
    closeMenu();
    
    // Handle navigation using our custom navigation context
    setTimeout(() => {
      try {
        navigation.navigate(route);
      } catch (error) {
        console.error('Navigation error:', error);
      }
    }, 300);
  };

  const handleLogout = () => {
    closeMenu();
    setTimeout(() => {
      logout();
    }, 300);
  };

  return (
    <>
      {/* Enhanced Professional Navbar */}
      <View style={styles.navbar}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/taekwondo-logo.png')}
            style={styles.logoImage}
            resizeMode="cover"
          />
        </View>


        {/* Modern Attractive Hamburger Menu Button */}
        <TouchableOpacity
          style={styles.hamburgerButton}
          onPress={openMenu}
          activeOpacity={0.7}
        >
          <View style={styles.modernHamburger}>
            <View style={styles.hamburgerLine} />
            <View style={styles.hamburgerLine} />
            <View style={styles.hamburgerLine} />
          </View>
        </TouchableOpacity>
      </View>

      {/* Enhanced Professional Side Menu Modal */}
      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="none"
        onRequestClose={closeMenu}
      >
        <View style={styles.modalOverlay}>
          {/* Overlay - Click to close */}
          <TouchableOpacity
            style={styles.overlayTouchable}
            activeOpacity={1}
            onPress={closeMenu}
          />

          {/* Sliding Menu from Right */}
          <Animated.View
            style={[
              styles.menuContainer,
              {
                transform: [{ translateX: slideAnim }],
              },
            ]}
          >
            <View style={styles.menuContent}>
              {/* Enhanced Menu Header */}
              <View style={styles.menuHeader}>
                <View style={styles.logoSection}>
                  <View style={styles.menuLogoContainer}>
                    <Image
                      source={require('../../assets/taekwondo-logo.png')}
                      style={styles.menuLogoImage}
                      resizeMode="contain"
                    />
                  </View>
                  <Text style={styles.menuHeaderTitle}>Taekwon-Do Association</Text>
                  <Text style={styles.menuHeaderSubtitle}>Karnataka</Text>
                </View>

                {/* Enhanced Close Button */}
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={closeMenu}
                  activeOpacity={0.7}
                >
                  <Icon name="close" size={26} color={colors.white} type="MaterialIcons" />
                </TouchableOpacity>
              </View>

              {/* Enhanced Menu Items */}
              <ScrollView
                style={styles.menuScroll}
                showsVerticalScrollIndicator={false}
              >
                {menuItems.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.menuItem}
                    onPress={() => handleMenuItemPress(item.route)}
                    activeOpacity={0.6}
                  >
                    <View style={styles.menuIconContainer}>
                      {renderIcon(item.iconType, item.iconName, 24, '#ff6b6b')}
                    </View>
                    <Text style={styles.menuText}>{item.title}</Text>
                    <Icon name="chevron-right" size={24} color="#94a3b8" type="MaterialIcons" />
                  </TouchableOpacity>
                ))}

                {/* Enhanced Divider */}
                <View style={styles.divider} />

                {/* Enhanced Logout Button */}
                <TouchableOpacity
                  style={styles.logoutButton}
                  onPress={handleLogout}
                  activeOpacity={0.6}
                >
                  <View style={styles.logoutIconContainer}>
                    <Icon name="logout" size={20} color={colors.white} type="MaterialIcons" />
                  </View>
                  <Text style={styles.logoutText}>Logout</Text>
                  <Icon name="chevron-right" size={24} color="#dc2626" type="MaterialIcons" />
                </TouchableOpacity>
              </ScrollView>

              {/* Enhanced Menu Footer */}
              <View style={styles.menuFooter}>
                <Text style={styles.footerText}>Taekwon-Do Association of Karnataka</Text>
                <Text style={styles.footerCopyright}>© 2026 All Rights Reserved</Text>
              </View>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  navbar: {
    height: 80,
    backgroundColor: '#e10d0dff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  logoContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fff3cd', // Changed from white to cream/yellow
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#ffd700', // Changed to golden border
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  logoImage: {
    width: 58,
    height: 58,
    borderRadius: 29,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 20,
  },
  titleText: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.white,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    letterSpacing: 1,
  },
  subtitleText: {
    fontSize: 14,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.95)',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    letterSpacing: 0.5,
    marginTop: 2,
  },
  hamburgerButton: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  modernHamburger: {
    width: 24,
    height: 18,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hamburgerLine: {
    width: 24,
    height: 3,
    backgroundColor: colors.white,
    borderRadius: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    flexDirection: 'row',
  },
  overlayTouchable: {
    flex: 1,
  },
  menuContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: width * 0.85,
    maxWidth: 360,
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: { width: -8, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 30,
  },
  menuContent: {
    flex: 1,
  },
  menuHeader: {
    backgroundColor: '#ff6b6b',
    paddingTop: 40,
    paddingBottom: 30,
    paddingHorizontal: 24,
    position: 'relative',
    alignItems: 'center',
  },
  logoSection: {
    alignItems: 'center',
  },
  menuLogoContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#fff3cd', // Changed from white to cream/yellow
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#ffd700', // Changed to golden border
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
    marginBottom: 12,
  },
  menuLogoImage: {
    width: 74,
    height: 74,
    borderRadius: 37,
  },
  menuHeaderTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.white,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  menuHeaderSubtitle: {
    fontSize: 13,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.9)',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    letterSpacing: 0.5,
  },
  closeButton: {
    position: 'absolute',
    top: 30,
    right: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
  menuScroll: {
    flex: 1,
    paddingTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 22,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    backgroundColor: colors.white,
  },
  menuIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fef2f2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 18,
    shadowColor: '#ff6b6b',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  menuText: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
  },
  divider: {
    height: 20,
    backgroundColor: '#f8fafc',
    marginVertical: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 22,
    paddingHorizontal: 24,
    backgroundColor: '#fef2f2',
    borderTopWidth: 2,
    borderTopColor: '#fecaca',
  },
  logoutIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 18,
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  logoutText: {
    flex: 1,
    fontSize: 18,
    fontWeight: '800',
    color: '#dc2626',
  },
  menuFooter: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  footerText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#ff6b6b',
    marginBottom: 6,
  },
  footerCopyright: {
    fontSize: 13,
    color: '#94a3b8',
    fontWeight: '600',
  },
});

export default Navbar;
