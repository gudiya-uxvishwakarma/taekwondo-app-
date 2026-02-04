
import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  TextInput,
  StatusBar,
  SafeAreaView,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import { useStudent } from '../../context/StudentContext';
import Icon from '../../components/common/Icon';
import { logo } from '../../assets'; 

// Updated: Using Logo component properly - displays logo.png from assets
// Last updated: 2026-02-04 - Logo improvements

const StudentLoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showEmailSuggestions, setShowEmailSuggestions] = useState(false);
  const { login } = useStudent();

  // Admin credentials - only one option
  const adminCredentials = {
    email: 'admin@combatwarrior.com',
    password: 'admin123'
  };

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const logoScale = useRef(new Animated.Value(0.9)).current; 

  // Component mount and animations
  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Handle admin credentials selection
  const handleAdminCredentialsSelect = () => {
    setEmail(adminCredentials.email);
    setPassword(adminCredentials.password);
    setShowEmailSuggestions(false);
    console.log('✅ Admin credentials selected');
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing Information', 'Please enter both email and password');
      return;
    }
    
    setLoading(true);
    
    try {
      console.log('🔐 Starting login process...');
      console.log('📧 Email:', email);
      
      // Direct login through context - this handles both AuthService and context
      const success = await login({ email, password });
      
      if (success) {
        console.log('✅ Login successful');
        Alert.alert('Success', 'Login successful!');
      } else {
        console.log('❌ Login failed');
        Alert.alert('Login Failed', 'Invalid email or password. Please try again.');
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      
      let errorMessage = 'Invalid email or password. Please try again.';
      
      if (error.message.includes('Network request failed')) {
        errorMessage = 'Network connection failed. Please check your connection.';
      } else if (error.message.includes('401')) {
        errorMessage = 'Invalid email or password';
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Connection timeout. Please try again.';
      } else {
        errorMessage = 'Login failed. Please check your credentials.';
      }
      
      Alert.alert('Login Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="rgba(245, 239, 239, 1)" />
      
      {/* Enhanced Background Pattern */}
      <View style={styles.backgroundPattern}>
        <View style={styles.topLeftCircle} />
        <View style={styles.topRightCircle} />
        <View style={styles.bottomLeftCircle} />
        <View style={styles.bottomRightCircle} />
        <View style={styles.centerCircle} />
      </View>

      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Logo Section */}
          <Animated.View 
            style={[
              styles.logoSection,
              {
                opacity: fadeAnim,
                transform: [
                  { scale: logoScale },
                  { translateY: slideAnim },
                ],
              },
            ]}
          >
            <View style={styles.logoContainer}>
              <Image
                source={logo}
                style={styles.logoImage}
                resizeMode="contain"
                testID="login-logo"
              />
            </View>
            <Text style={styles.welcomeEmoji}>👋</Text>
            <Text style={styles.welcomeTitle}>Welcome Back!</Text>
            <Text style={styles.welcomeSubtitle}>
              Sign in to continue your educational journey
            </Text>
          </Animated.View>

          {/* Login Form */}
          <TouchableWithoutFeedback onPress={() => setShowEmailSuggestions(false)}>
            <Animated.View 
              style={[
                styles.formContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
            <View style={styles.formHeader}>
              <View style={styles.formLogoContainer}>
                <Icon name="person" size={24} color="#ef4444" type="MaterialIcons" />
              </View>
              <Text style={styles.formTitle}>Student Login</Text>
              <Text style={styles.formSubtitle}>
                Enter your email and password
              </Text>
            </View>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <View style={styles.inputIcon}>
                  <Icon name="email" size={18} color="#ef4444" />
                </View>
                <TextInput
                  style={styles.textInput}
                  value={email}
                  onChangeText={setEmail}
                  onFocus={() => setShowEmailSuggestions(true)}
                  placeholder="Enter email"
                  placeholderTextColor="#9ca3af"
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                />
                <TouchableOpacity 
                  style={styles.suggestionButton}
                  onPress={() => setShowEmailSuggestions(!showEmailSuggestions)}
                >
                  <Icon name="arrow-drop-down" size={20} color="#9ca3af" />
                </TouchableOpacity>
              </View>
              
              {/* Admin Credentials Suggestion */}
              {showEmailSuggestions && (
                <View style={styles.suggestionsContainer}>
                  <TouchableOpacity 
                    style={styles.suggestionItem}
                    onPress={handleAdminCredentialsSelect}
                    activeOpacity={0.7}
                  >
                    <View style={styles.suggestionContent}>
                      <View style={styles.suggestionIcon}>
                        <Icon name="admin-panel-settings" size={16} color="#ef4444" />
                      </View>
                      <View style={styles.suggestionText}>
                        <Text style={styles.suggestionEmail}>{adminCredentials.email}</Text>
                        <Text style={styles.suggestionLabel}>Admin Account</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <View style={styles.inputIcon}>
                  <Icon name="lock" size={18} color="#ef4444" />
                </View>
                <TextInput
                  style={styles.textInput}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter password"
                  placeholderTextColor="#9ca3af"
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity 
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Icon 
                    name={showPassword ? 'visibility' : 'visibility-off'} 
                    size={20} 
                    color="#9ca3af" 
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Login Button */}
            <TouchableOpacity 
              style={styles.loginButton}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color="#ffffff" />
                  <Text style={[styles.loginButtonText, { marginLeft: 10 }]}>
                    Signing in...
                  </Text>
                </View>
              ) : (
                <View style={styles.loginButtonContent}>
                  <Text style={styles.loginButtonText}>Login</Text>
                  <Text style={styles.loginButtonEmoji}>✨</Text>
                </View>
              )}
            </TouchableOpacity>

            </Animated.View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'rgba(250, 244, 244, 1)',
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(244, 240, 240, 1)',
  },
  topLeftCircle: {
    position: 'absolute',
    top: -80,
    left: -60,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(177, 33, 33, 0.08)',
  },
  topRightCircle: {
    position: 'absolute',
    top: -50,
    right: -40,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(251, 191, 36, 0.06)',
  },
  bottomLeftCircle: {
    position: 'absolute',
    bottom: -70,
    left: -50,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(21, 246, 104, 0.05)',
  },
  bottomRightCircle: {
    position: 'absolute',
    bottom: -60,
    right: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(131, 9, 246, 0.04)',
  },
  centerCircle: {
    position: 'absolute',
    top: '40%',
    left: '70%',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(3, 53, 135, 0.03)',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 40,
    justifyContent: 'center',
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    marginBottom: 15,
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 10,
    borderWidth: 4,
    borderColor: '#ffffff',
  },
  logoImage: {
    width: 85,
    height: 85,
    borderRadius: 42,
  },
  welcomeEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  welcomeTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 15,
    color: '#2d3035ff',
    textAlign: 'center',
    lineHeight: 20,
  },
  formContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 6,
  },
  formHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  formLogoContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    marginBottom: 12,
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 2,
    borderColor: 'rgba(239, 68, 68, 0.1)',
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  formSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 18,
  },
  inputContainer: {
    marginBottom: 18,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 16,
    height: 52,
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '500',
    paddingVertical: 0,
  },
  eyeButton: {
    padding: 6,
  },
  suggestionButton: {
    padding: 6,
  },
  suggestionsContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginTop: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  suggestionItem: {
    padding: 12,
    borderRadius: 8,
  },
  suggestionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  suggestionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fef2f2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  suggestionText: {
    flex: 1,
  },
  suggestionEmail: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  suggestionLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: '#ef4444',
    borderRadius: 12,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  loginButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#f1efefff',
    fontSize: 17,
    fontWeight: '700',
    marginRight: 6,
  },
  loginButtonEmoji: {
    fontSize: 16,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default StudentLoginScreen;
