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
} from 'react-native';
import { useStudent } from '../../context/StudentContext';
import Icon from '../../components/common/Icon';
import Logo from '../../components/common/Logo';
import ApiService from '../../services/apiService';

const PracticalLoginScreen = ({ onBack, onLoginSuccess, onPaymentRequired }) => {
  const [tab, setTab] = useState('email'); // 'email' | 'phone'

  // Email login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Phone/OTP state
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [phoneError, setPhoneError] = useState('');

  const [loading, setLoading] = useState(false);
  const { login } = useStudent();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const logoScale = useRef(new Animated.Value(0.9)).current;
  const timerRef = useRef(null);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
      Animated.spring(logoScale, { toValue: 1, friction: 8, tension: 40, useNativeDriver: true }),
    ]).start();
    return () => clearInterval(timerRef.current);
  }, []);

  const startTimer = () => {
    setOtpTimer(300);
    timerRef.current = setInterval(() => {
      setOtpTimer(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setGeneratedOtp(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const formatTimer = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  const handleSendOtp = async () => {
    if (!phone || phone.length < 10) {
      setPhoneError('Please enter a valid 10-digit phone number');
      return;
    }
    setPhoneError('');
    setLoading(true);
    try {
      const response = await ApiService.post('/auth/check-phone', { phone });
      if (response?.status === 'success') {
        const newOtp = String(Math.floor(100000 + Math.random() * 900000));
        setGeneratedOtp(newOtp);
        setOtpSent(true);
        startTimer();
      } else {
        setPhoneError('This number is not registered. Please contact your instructor.');
      }
    } catch (error) {
      setPhoneError('This number is not registered. Please contact your instructor.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpLogin = async () => {
    if (!otp || otp.length !== 6) {
      Alert.alert('Invalid OTP', 'Please enter the 6-digit OTP');
      return;
    }
    if (otp !== generatedOtp) {
      Alert.alert('Wrong OTP', 'The OTP you entered is incorrect.');
      return;
    }
    setLoading(true);
    try {
      const response = await ApiService.post('/auth/login-phone', { phone });
      if (response?.status === 'success' && response?.data?.token) {
        const AsyncStorage = require('@react-native-async-storage/async-storage').default;
        await AsyncStorage.setItem('loginSource', 'practical');
        await login({ _otpLoginData: response.data });
        Alert.alert('Success', 'Login successful! Welcome to Practical Syllabus', [
          { text: 'Continue', onPress: () => onLoginSuccess && onLoginSuccess() },
        ]);
      } else {
        Alert.alert('Error', response?.message || 'Login failed');
      }
    } catch (error) {
      Alert.alert('Login Failed', 'Could not connect to server. Make sure you are on the same WiFi.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing Information', 'Please enter both email and password');
      return;
    }
    setLoading(true);
    try {
      const success = await login({ email, password });
      if (success) {
        const AsyncStorage = require('@react-native-async-storage/async-storage').default;
        await AsyncStorage.setItem('loginSource', 'practical');
        Alert.alert('Success', 'Login successful! Welcome to Practical Syllabus', [
          { text: 'Continue', onPress: () => onLoginSuccess && onLoginSuccess() },
        ]);
      } else {
        Alert.alert('Login Failed', 'Invalid email or password. Please check your credentials and try again.');
      }
    } catch (error) {
      let errorMessage = 'Invalid email or password';
      if (error.message?.includes('Network')) {
        errorMessage = 'Network connection failed. Please check your internet connection.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Invalid password. Please check your password and try again.';
      } else if (error.response?.status === 404) {
        errorMessage = 'Email not found. Please check your email address.';
      }
      Alert.alert('Login Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleNeedRegistration = () => {
    Alert.alert(
      'Not Registered?',
      'To access the Practical Syllabus, you need to register as a student and complete the payment.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Register & Pay', onPress: () => onPaymentRequired && onPaymentRequired() },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="rgba(245, 239, 239, 1)" />

      {onBack && (
        <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
          <Icon name="arrow-back" size={24} color="#006CB5" type="MaterialIcons" />
        </TouchableOpacity>
      )}

      <View style={styles.backgroundPattern}>
        <View style={styles.topLeftCircle} />
        <View style={styles.topRightCircle} />
        <View style={styles.bottomLeftCircle} />
        <View style={styles.bottomRightCircle} />
        <View style={styles.centerCircle} />
      </View>

      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false} bounces={false}>

          {/* Logo Section */}
          <Animated.View style={[styles.logoSection, { opacity: fadeAnim, transform: [{ scale: logoScale }, { translateY: slideAnim }] }]}>
            <View style={styles.logoContainer}>
              <Logo size="xlarge" showText={false} variant="login" />
            </View>
            <Text style={styles.welcomeEmoji}>🥋</Text>
            <Text style={styles.welcomeTitle}>Practical Syllabus</Text>
            <Text style={styles.welcomeSubtitle}>Login to access your practical training content</Text>
          </Animated.View>

          {/* Form Card */}
          <Animated.View style={[styles.formContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>

            {/* Tab Switcher */}
            <View style={styles.tabRow}>
              <TouchableOpacity
                style={[styles.tabBtn, tab === 'email' && styles.tabBtnActive]}
                onPress={() => setTab('email')}
              >
                <Icon name="email" size={15} color={tab === 'email' ? '#fff' : '#006CB5'} />
                <Text style={[styles.tabText, tab === 'email' && styles.tabTextActive]}>Email</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tabBtn, tab === 'phone' && styles.tabBtnActive]}
                onPress={() => setTab('phone')}
              >
                <Icon name="phone" size={15} color={tab === 'phone' ? '#fff' : '#006CB5'} type="MaterialIcons" />
                <Text style={[styles.tabText, tab === 'phone' && styles.tabTextActive]}>Phone OTP</Text>
              </TouchableOpacity>
            </View>

            {tab === 'email' ? (
              <>
                {/* Email Input */}
                <View style={styles.inputContainer}>
                  <View style={styles.inputWrapper}>
                    <View style={styles.inputIcon}>
                      <Icon name="email" size={18} color="#006CB5" />
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
                      <Icon name="lock" size={18} color="#006CB5" />
                    </View>
                    <TextInput
                      style={styles.textInput}
                      value={password}
                      onChangeText={setPassword}
                      placeholder="Enter password"
                      placeholderTextColor="#9ca3af"
                      secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity style={styles.eyeButton} onPress={() => setShowPassword(!showPassword)}>
                      <Icon name={showPassword ? 'visibility' : 'visibility-off'} size={20} color="#9ca3af" />
                    </TouchableOpacity>
                  </View>
                </View>

                <TouchableOpacity style={styles.loginButton} onPress={handleEmailLogin} disabled={loading} activeOpacity={0.8}>
                  {loading ? (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator size="small" color="#fff" />
                      <Text style={[styles.loginButtonText, { marginLeft: 10 }]}>Signing in...</Text>
                    </View>
                  ) : (
                    <View style={styles.loginButtonContent}>
                      <Text style={styles.loginButtonText}>Login</Text>
                      <Text style={styles.loginButtonEmoji}>✨</Text>
                    </View>
                  )}
                </TouchableOpacity>

                {/* Registration Link */}
                <View style={styles.registerContainer}>
                  <Text style={styles.registerText}>Not registered yet?</Text>
                  <TouchableOpacity onPress={handleNeedRegistration}>
                    <Text style={styles.registerLink}>Register & Pay</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                {/* Phone Input */}
                <View style={styles.inputContainer}>
                  <View style={styles.inputWrapper}>
                    <View style={styles.inputIcon}>
                      <Icon name="phone" size={18} color="#006CB5" type="MaterialIcons" />
                    </View>
                    <TextInput
                      style={styles.textInput}
                      value={phone}
                      onChangeText={(v) => { setPhone(v); setPhoneError(''); }}
                      placeholder="Enter phone number"
                      placeholderTextColor="#9ca3af"
                      keyboardType="phone-pad"
                      maxLength={10}
                      editable={!otpSent}
                    />
                  </View>
                </View>

                {phoneError ? (
                  <View style={styles.errorBox}>
                    <Text style={styles.errorIcon}>⚠️</Text>
                    <Text style={styles.errorText}>{phoneError}</Text>
                  </View>
                ) : null}

                {/* OTP Display Box */}
                {generatedOtp && (
                  <View style={styles.otpDisplayBox}>
                    <View style={styles.otpDisplayRow}>
                      <Icon name="lock-open" size={14} color="#006CB5" type="MaterialIcons" />
                      <Text style={styles.otpDisplayLabel}>Your OTP</Text>
                      <Text style={styles.otpDisplayCode}>{generatedOtp}</Text>
                      <View style={styles.otpTimerBadge}>
                        <Text style={styles.otpTimer}>{formatTimer(otpTimer)}</Text>
                      </View>
                    </View>
                  </View>
                )}

                {/* OTP Input */}
                {otpSent && (
                  <View style={styles.inputContainer}>
                    <View style={styles.inputWrapper}>
                      <View style={styles.inputIcon}>
                        <Icon name="lock" size={18} color="#006CB5" />
                      </View>
                      <TextInput
                        style={styles.textInput}
                        value={otp}
                        onChangeText={setOtp}
                        placeholder="Enter 6-digit OTP"
                        placeholderTextColor="#9ca3af"
                        keyboardType="number-pad"
                        maxLength={6}
                      />
                    </View>
                  </View>
                )}

                {!otpSent ? (
                  <TouchableOpacity style={styles.loginButton} onPress={handleSendOtp} disabled={loading} activeOpacity={0.8}>
                    {loading ? (
                      <View style={styles.loadingContainer}>
                        <ActivityIndicator size="small" color="#fff" />
                        <Text style={[styles.loginButtonText, { marginLeft: 10 }]}>Sending...</Text>
                      </View>
                    ) : (
                      <Text style={styles.loginButtonText}>Send OTP</Text>
                    )}
                  </TouchableOpacity>
                ) : (
                  <View>
                    <TouchableOpacity style={styles.loginButton} onPress={handleOtpLogin} disabled={loading} activeOpacity={0.8}>
                      {loading ? (
                        <View style={styles.loadingContainer}>
                          <ActivityIndicator size="small" color="#fff" />
                          <Text style={[styles.loginButtonText, { marginLeft: 10 }]}>Verifying...</Text>
                        </View>
                      ) : (
                        <Text style={styles.loginButtonText}>Verify & Login</Text>
                      )}
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.resendBtn}
                      onPress={() => { setOtpSent(false); setOtp(''); setGeneratedOtp(null); clearInterval(timerRef.current); }}
                    >
                      <Text style={styles.resendText}>Change number / Resend OTP</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {/* Registration Link */}
                <View style={styles.registerContainer}>
                  <Text style={styles.registerText}>Not registered yet?</Text>
                  <TouchableOpacity onPress={handleNeedRegistration}>
                    <Text style={styles.registerLink}>Register & Pay</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {/* Info Box */}
            <View style={styles.infoBox}>
              <Icon name="info" size={20} color="#006CB5" type="MaterialIcons" />
              <Text style={styles.infoText}>
                Only registered students can access the Practical Syllabus
              </Text>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: 'rgba(250, 244, 244, 1)' },
  backButton: {
    position: 'absolute', top: 50, left: 20, zIndex: 100,
    width: 44, height: 44, borderRadius: 22, backgroundColor: '#ffffff',
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2, shadowRadius: 4, elevation: 5,
  },
  container: { flex: 1, backgroundColor: 'transparent' },
  backgroundPattern: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(244, 240, 240, 1)',
  },
  topLeftCircle: { position: 'absolute', top: -80, left: -60, width: 160, height: 160, borderRadius: 80, backgroundColor: 'rgba(177, 33, 33, 0.08)' },
  topRightCircle: { position: 'absolute', top: -50, right: -40, width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(251, 191, 36, 0.06)' },
  bottomLeftCircle: { position: 'absolute', bottom: -70, left: -50, width: 140, height: 140, borderRadius: 70, backgroundColor: 'rgba(21, 246, 104, 0.05)' },
  bottomRightCircle: { position: 'absolute', bottom: -60, right: -30, width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(131, 9, 246, 0.04)' },
  centerCircle: { position: 'absolute', top: '40%', left: '70%', width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(3, 53, 135, 0.03)' },
  scrollContainer: { flexGrow: 1, paddingHorizontal: 20, paddingVertical: 40, justifyContent: 'center' },
  logoSection: { alignItems: 'center', marginBottom: 30 },
  logoContainer: {
    width: 110, height: 110, borderRadius: 55, justifyContent: 'center', alignItems: 'center',
    backgroundColor: '#ffffff', marginBottom: 15,
    shadowColor: '#006CB5', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.2, shadowRadius: 15, elevation: 10,
    borderWidth: 4, borderColor: '#ffffff',
  },
  welcomeEmoji: { fontSize: 32, marginBottom: 8 },
  welcomeTitle: { fontSize: 26, fontWeight: '800', color: '#1f2937', textAlign: 'center', marginBottom: 8 },
  welcomeSubtitle: { fontSize: 15, color: '#2d3035ff', textAlign: 'center', lineHeight: 20 },
  formContainer: {
    backgroundColor: '#ffffff', borderRadius: 20, padding: 24, marginHorizontal: 4,
    shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 6,
  },
  tabRow: { flexDirection: 'row', backgroundColor: '#f1f5f9', borderRadius: 12, padding: 4, marginBottom: 20 },
  tabBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderRadius: 10, gap: 6 },
  tabBtnActive: { backgroundColor: '#006CB5' },
  tabText: { fontSize: 14, fontWeight: '600', color: '#006CB5' },
  tabTextActive: { color: '#fff' },
  inputContainer: { marginBottom: 16 },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#f9fafb',
    borderRadius: 12, borderWidth: 1, borderColor: '#e5e7eb', paddingHorizontal: 16, height: 52,
  },
  inputIcon: { marginRight: 12 },
  textInput: { flex: 1, fontSize: 16, color: '#1f2937', fontWeight: '500', paddingVertical: 0 },
  eyeButton: { padding: 6 },
  otpDisplayBox: {
    flexDirection: 'row', backgroundColor: '#eff6ff', borderRadius: 10,
    paddingVertical: 8, paddingHorizontal: 14, marginBottom: 12,
    borderWidth: 1, borderColor: '#bfdbfe', alignItems: 'center',
  },
  otpDisplayRow: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
  otpDisplayLabel: { fontSize: 12, color: '#6b7280', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  otpDisplayCode: { flex: 1, fontSize: 20, fontWeight: '800', color: '#006CB5', letterSpacing: 4, textAlign: 'center' },
  otpTimerBadge: { backgroundColor: '#dbeafe', borderRadius: 6, paddingHorizontal: 7, paddingVertical: 3 },
  otpTimer: { fontSize: 11, color: '#3b82f6', fontWeight: '700' },
  loginButton: {
    backgroundColor: '#006CB5', borderRadius: 12, height: 52,
    justifyContent: 'center', alignItems: 'center', marginTop: 4,
    shadowColor: '#006CB5', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6,
  },
  loginButtonContent: { flexDirection: 'row', alignItems: 'center' },
  loginButtonText: { color: '#ffffff', fontSize: 17, fontWeight: '700', marginRight: 6 },
  loginButtonEmoji: { fontSize: 16 },
  loadingContainer: { flexDirection: 'row', alignItems: 'center' },
  resendBtn: { alignItems: 'center', marginTop: 14 },
  resendText: { color: '#006CB5', fontSize: 14, fontWeight: '600' },
  errorBox: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#fef2f2', borderRadius: 10, padding: 10, marginBottom: 12,
    borderWidth: 1, borderColor: '#fecaca',
  },
  errorIcon: { fontSize: 14 },
  errorText: { flex: 1, fontSize: 13, color: '#dc2626', fontWeight: '500', lineHeight: 18 },
  registerContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20, marginBottom: 4 },
  registerText: { fontSize: 14, color: '#6b7280', marginRight: 6 },
  registerLink: { fontSize: 14, color: '#006CB5', fontWeight: '700' },
  infoBox: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#eff6ff',
    padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#bfdbfe', marginTop: 16,
  },
  infoText: { flex: 1, fontSize: 13, color: '#1e40af', marginLeft: 8, lineHeight: 18 },
});

export default PracticalLoginScreen;
