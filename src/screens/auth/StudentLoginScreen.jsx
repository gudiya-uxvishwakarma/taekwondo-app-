import React, { useState, useEffect, useRef } from 'react';
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
  Image,
} from 'react-native';
import { useStudent } from '../../context/StudentContext';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { runNetworkDiagnostics } from '../../utils/networkDiagnostics';

// Icon component using react-native-vector-icons
const Icon = ({ name, size = 24, color = '#000' }) => {
  return <MaterialIcons name={name} size={size} color={color} />;
};

const StudentLoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useStudent();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const logoScale = useRef(new Animated.Value(0.9)).current;

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
        errorMessage = 'Network connection failed. Please check your connection and try the network diagnostics below.';
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

  const handleNetworkDiagnostics = async () => {
    Alert.alert(
      'Network Diagnostics',
      'Running network diagnostics to check backend connection...',
      [{ text: 'OK' }]
    );
    
    try {
      const results = await runNetworkDiagnostics();
      
      let message = 'Diagnostics Results:\n\n';
      
      Object.entries(results.tests).forEach(([key, test]) => {
        message += `${key}: ${test.success ? '✅ Success' : '❌ Failed'}\n`;
        if (test.error) {
          message += `  Error: ${test.error}\n`;
        }
      });
      
      message += '\nRecommendations:\n';
      results.recommendations.forEach(rec => {
        message += `• ${rec}\n`;
      });
      
      Alert.alert('Network Diagnostics Results', message, [{ text: 'OK' }]);
    } catch (error) {
      Alert.alert('Diagnostics Failed', `Error running diagnostics: ${error.message}`);
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
                source={require('../../assets/taekwondo-logo.png')}
                style={styles.logoImage}
                resizeMode="cover"
              />
            </View>
            <Text style={styles.welcomeEmoji}>👋</Text>
            <Text style={styles.welcomeTitle}>Welcome Back!</Text>
            <Text style={styles.welcomeSubtitle}>
              Sign in to continue your educational journey
            </Text>
          </Animated.View>

          {/* Login Form */}
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
                <Text style={styles.formIcon}>🔑</Text>
              </View>
              <Text style={styles.formTitle}>Student Login</Text>
              <Text style={styles.formSubtitle}>Enter your email and password</Text>
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
                  placeholder="Enter email"
                  placeholderTextColor="#9ca3af"
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                />
              </View>
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
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    marginBottom: 12,
    shadowColor: '#580303ff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  logoImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: 'rgba(239, 68, 68, 0.1)',
  },
  welcomeEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  welcomeTitle: {
    fontSize: 24,
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
    backgroundColor: '#ffffff',
    marginBottom: 12,
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 2,
    borderColor: 'rgba(239, 68, 68, 0.1)',
  },
  formIcon: {
    fontSize: 24,
  },
  formEmoji: {
    fontSize: 24,
    marginBottom: 8,
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
  diagnosticsButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  diagnosticsButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  diagnosticsButtonText: {
    color: '#6b7280',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default StudentLoginScreen;
