import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Animated,
  Dimensions,
} from 'react-native';
import { colors, spacing } from '../theme';
import Icon from '../components/common/Icon';

const { width } = Dimensions.get('window');

const BELTS = [
  { label: 'White',  color: '#f3f4f6', text: '#374151' },
  { label: 'Yellow', color: '#fef08a', text: '#713f12' },
  { label: 'Green',  color: '#bbf7d0', text: '#14532d' },
  { label: 'Blue',   color: '#bfdbfe', text: '#1e3a8a' },
  { label: 'Red',    color: '#fecaca', text: '#7f1d1d' },
  { label: 'Black',  color: '#1f2937', text: '#fff'    },
];

const FEATURES = [
  { icon: 'menu-book',        label: 'Full Syllabus',      desc: 'All belt levels covered' },
  { icon: 'sports-martial-arts', label: 'Techniques',      desc: '300+ moves & patterns'  },
  { icon: 'emoji-events',     label: 'Grading Guide',      desc: 'Exam prep & tips'        },
  { icon: 'trending-up',      label: 'Track Progress',     desc: 'Monitor your journey'    },
];

const PracticalPaymentScreen = ({ onBack, onPaymentSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(null);
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', belt: '' });

  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async () => {
    const { fullName, email, phone } = form;
    if (!fullName || !email || !phone) {
      Alert.alert('Missing Fields', 'Please fill in Name, Email and Phone.');
      return;
    }
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }
    if (phone.length < 10) {
      Alert.alert('Invalid Phone', 'Please enter a valid phone number.');
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1400));
    setLoading(false);
    if (onPaymentSuccess) onPaymentSuccess(form);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      {/* Header */}
      <View style={styles.header}>
        {onBack && (
          <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
            <Icon name="arrow-back" size={22} color="#fff" type="MaterialIcons" />
          </TouchableOpacity>
        )}
        <Text style={styles.headerTitle}>Get Access</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero */}
        <Animated.View style={[styles.hero, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.heroIconWrap}>
            <Text style={styles.heroEmoji}>🥋</Text>
          </View>
          <Text style={styles.heroTitle}>Practical Syllabus</Text>
          <Text style={styles.heroSub}>Everything you need to master Taekwon-Do</Text>

          {/* Price pill */}
          <View style={styles.pricePill}>
            <Text style={styles.priceText}>₹499</Text>
            <Text style={styles.priceSlash}> / </Text>
            <Text style={styles.priceMonth}>month</Text>
          </View>
        </Animated.View>

        {/* Features grid */}
        <Animated.View style={[styles.featuresGrid, { opacity: fadeAnim }]}>
          {FEATURES.map((f, i) => (
            <View key={i} style={styles.featureCard}>
              <View style={styles.featureIconBubble}>
                <Icon name={f.icon} size={22} color={colors.primary} type="MaterialIcons" />
              </View>
              <Text style={styles.featureLabel}>{f.label}</Text>
              <Text style={styles.featureDesc}>{f.desc}</Text>
            </View>
          ))}
        </Animated.View>

        {/* Divider */}
        <View style={styles.sectionDivider}>
          <View style={styles.divLine} />
          <Text style={styles.divLabel}>Register to continue</Text>
          <View style={styles.divLine} />
        </View>

        {/* Form card */}
        <View style={styles.formCard}>

          {/* Full Name */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Full Name <Text style={styles.req}>*</Text></Text>
            <View style={[styles.inputRow, focused === 'fullName' && styles.inputFocused]}>
              <Icon name="person-outline" size={18} color={focused === 'fullName' ? colors.primary : '#9ca3af'} type="MaterialIcons" />
              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                placeholderTextColor="#9ca3af"
                value={form.fullName}
                onChangeText={v => set('fullName', v)}
                onFocus={() => setFocused('fullName')}
                onBlur={() => setFocused(null)}
              />
            </View>
          </View>

          {/* Email */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Email Address <Text style={styles.req}>*</Text></Text>
            <View style={[styles.inputRow, focused === 'email' && styles.inputFocused]}>
              <Icon name="mail-outline" size={18} color={focused === 'email' ? colors.primary : '#9ca3af'} type="MaterialIcons" />
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#9ca3af"
                value={form.email}
                onChangeText={v => set('email', v)}
                keyboardType="email-address"
                autoCapitalize="none"
                onFocus={() => setFocused('email')}
                onBlur={() => setFocused(null)}
              />
            </View>
          </View>

          {/* Phone */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Phone Number <Text style={styles.req}>*</Text></Text>
            <View style={[styles.inputRow, focused === 'phone' && styles.inputFocused]}>
              <Icon name="phone-android" size={18} color={focused === 'phone' ? colors.primary : '#9ca3af'} type="MaterialIcons" />
              <TextInput
                style={styles.input}
                placeholder="Enter your phone number"
                placeholderTextColor="#9ca3af"
                value={form.phone}
                onChangeText={v => set('phone', v)}
                keyboardType="phone-pad"
                onFocus={() => setFocused('phone')}
                onBlur={() => setFocused(null)}
              />
            </View>
          </View>

          {/* Belt — optional */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>
              Current Belt{'  '}
              <Text style={styles.optional}>optional</Text>
            </Text>
            <View style={styles.beltRow}>
              {BELTS.map(b => (
                <TouchableOpacity
                  key={b.label}
                  style={[
                    styles.beltChip,
                    { backgroundColor: b.color, borderColor: b.color },
                    form.belt === b.label && styles.beltChipSelected,
                  ]}
                  onPress={() => set('belt', form.belt === b.label ? '' : b.label)}
                  activeOpacity={0.8}
                >
                  {form.belt === b.label && (
                    <Icon name="check" size={12} color={b.text} type="MaterialIcons" style={{ marginRight: 3 }} />
                  )}
                  <Text style={[styles.beltChipText, { color: b.text }]}>{b.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

        </View>

        {/* Pay button */}
        <TouchableOpacity
          style={styles.payBtn}
          onPress={handleSubmit}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Icon name="lock" size={18} color="#fff" type="MaterialIcons" />
              <Text style={styles.payText}>Pay ₹499 & Get Access</Text>
            </>
          )}
        </TouchableOpacity>

        <Text style={styles.secureNote}>🔒  Secure payment · Cancel anytime</Text>

        <View style={{ height: 36 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F4F6FB' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 14,
    elevation: 4,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', alignItems: 'center',
  },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#fff' },

  scrollContent: { paddingHorizontal: 18, paddingTop: 22 },

  /* Hero */
  hero: {
    backgroundColor: colors.primary,
    borderRadius: 22,
    alignItems: 'center',
    paddingVertical: 28,
    paddingHorizontal: 20,
    marginBottom: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 14,
    elevation: 8,
  },
  heroIconWrap: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 12,
  },
  heroEmoji: { fontSize: 36 },
  heroTitle: { fontSize: 22, fontWeight: '800', color: '#fff', marginBottom: 4 },
  heroSub: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginBottom: 16, textAlign: 'center' },
  pricePill: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 30,
    paddingHorizontal: 22,
    paddingVertical: 8,
  },
  priceText: { fontSize: 30, fontWeight: '800', color: '#fff' },
  priceSlash: { fontSize: 18, color: 'rgba(255,255,255,0.7)', marginBottom: 2 },
  priceMonth: { fontSize: 15, color: 'rgba(255,255,255,0.85)', marginBottom: 3 },

  /* Features */
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  featureCard: {
    width: (width - 46) / 2,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  featureIconBubble: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: '#EBF5FF',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 8,
  },
  featureLabel: { fontSize: 13, fontWeight: '700', color: '#1f2937', marginBottom: 2 },
  featureDesc: { fontSize: 11, color: '#9ca3af' },

  /* Divider */
  sectionDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  divLine: { flex: 1, height: 1, backgroundColor: '#e5e7eb' },
  divLabel: { fontSize: 12, color: '#9ca3af', marginHorizontal: 10, fontWeight: '600' },

  /* Form */
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 4,
    marginBottom: 20,
  },
  fieldGroup: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 8 },
  req: { color: '#ef4444' },
  optional: { color: '#9ca3af', fontWeight: '400', fontSize: 12 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F6FB',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    paddingHorizontal: 12,
    height: 50,
  },
  inputFocused: { borderColor: colors.primary, backgroundColor: '#EBF5FF' },
  input: { flex: 1, fontSize: 15, color: '#1f2937', marginLeft: 8 },

  beltRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  beltChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14, paddingVertical: 7,
    borderRadius: 20, borderWidth: 2,
  },
  beltChipSelected: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  beltChipText: { fontSize: 12, fontWeight: '700' },

  /* Pay button */
  payBtn: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 17,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 7,
    marginBottom: 12,
  },
  payText: { color: '#fff', fontSize: 16, fontWeight: '800', letterSpacing: 0.3 },
  secureNote: { textAlign: 'center', fontSize: 12, color: '#9ca3af' },
});

export default PracticalPaymentScreen;
