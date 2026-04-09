import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, SafeAreaView,
  StatusBar, TouchableOpacity, Image, Modal, TextInput, Alert,
} from 'react-native';
import { spacing } from '../../theme';
import Icon from '../../components/common/Icon';

const InfoRow = ({ icon, label, value, onPress }) => (
  <TouchableOpacity
    style={styles.infoRow}
    onPress={onPress}
    activeOpacity={onPress ? 0.7 : 1}
    disabled={!onPress}
  >
    <View style={styles.infoIconBox}>
      <Icon name={icon} size={20} color="#006CB5" type="MaterialIcons" />
    </View>
    <View style={styles.infoText}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={[styles.infoValue, onPress && styles.infoLink]}>{value}</Text>
    </View>
    {onPress && <Icon name="chevron-right" size={18} color="#9ca3af" type="MaterialIcons" />}
  </TouchableOpacity>
);

const SectionCard = ({ title, children }) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>{title}</Text>
    {children}
  </View>
);

const TERMS = `1. Acceptance of Terms
By downloading or using Theory Syllabus, you agree to be bound by these Terms of Service. If you do not agree, please do not use the app.

2. Use of the App
Theory Syllabus is intended for educational purposes related to ITF Taekwon-Do theory. You may not use the app for any unlawful purpose or in any way that could damage or impair the service.

3. Subscription & Payments
Access to the Practical section requires a monthly subscription of ₹99/month. Payments are processed securely. Subscriptions auto-renew unless cancelled before the renewal date.

4. Intellectual Property
All content within Theory Syllabus, including text, diagrams, and images, is the property of Theory Syllabus or its content suppliers and is protected by applicable intellectual property laws.

5. Disclaimer
The content in this app is for educational purposes only. Theory Syllabus is not affiliated with or officially endorsed by the International Taekwon-Do Federation (ITF).

6. Limitation of Liability
Theory Syllabus shall not be liable for any indirect, incidental, or consequential damages arising from your use of the app.

7. Changes to Terms
We reserve the right to modify these terms at any time. Continued use of the app after changes constitutes acceptance of the new terms.

8. Contact
For questions about these terms, contact us at support@tkdstudy.com.`;

const PRIVACY = `1. Information We Collect
We collect information you provide when registering, such as your name and email address. We also collect usage data to improve the app experience.

2. How We Use Your Information
Your information is used to:
• Provide and maintain the app service
• Process subscription payments
• Send important updates about the app
• Respond to your support requests

3. Data Storage
Your data is stored securely. We do not sell, trade, or transfer your personal information to third parties without your consent, except as required by law.

4. Payment Information
Payment processing is handled by secure third-party providers. We do not store your full payment card details on our servers.

5. Cookies & Analytics
We may use analytics tools to understand how users interact with the app. This data is anonymised and used only to improve the app.

6. Children's Privacy
Theory Syllabus is suitable for all ages. We do not knowingly collect personal information from children under 13 without parental consent.

7. Your Rights
You have the right to access, correct, or delete your personal data at any time by contacting us at support@tkdstudy.com.

8. Changes to This Policy
We may update this Privacy Policy from time to time. We will notify you of significant changes through the app.

9. Contact
If you have questions about this Privacy Policy, please contact us at support@tkdstudy.com.`;

const AppInfoScreen = ({ onBack }) => {
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [legalModal, setLegalModal] = useState(null); // { title, content }

  const handleSubmit = () => {
    if (rating === 0) { Alert.alert('Please select a rating'); return; }
    Alert.alert('Thank you!', 'Your feedback has been submitted.', [
      { text: 'OK', onPress: () => { setFeedbackOpen(false); setRating(0); setFeedback(''); } },
    ]);
  };

  return (
  <SafeAreaView style={styles.safeArea}>
    <StatusBar barStyle="dark-content" backgroundColor="#fff" />
    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
        <Icon name="arrow-back" size={24} color="#1f2937" type="MaterialIcons" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>App Info</Text>
      <View style={{ width: 40 }} />
    </View>

    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

      {/* App Logo & Name */}
      <View style={styles.heroSection}>
        <View style={styles.logoBox}>
          <Image
            source={require('../../../android/app/src/main/assets/logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.appName}>Theory Syllabus</Text>
        <Text style={styles.appTagline}>Your complete Taekwon-Do theory companion</Text>
        <View style={styles.versionBadge}>
          <Text style={styles.versionBadgeText}>Version 1.0.0</Text>
        </View>
      </View>

      {/* App Details */}
      <SectionCard title="App Details">
        <InfoRow icon="info" label="Version" value="1.0.0" />
        <InfoRow icon="phone-android" label="Platform" value="Android / iOS" />
        <InfoRow icon="language" label="Style" value="ITF Taekwon-Do" />
       
      </SectionCard>

      {/* About */}
      <SectionCard title="About This App">
        <Text style={styles.aboutText}>
          Theory Syllabus is a comprehensive theory learning app designed for ITF Taekwon-Do students and instructors. It covers all aspects of the ITF syllabus including basic theory, history, stances, body parts, Korean terminology, patterns, and grading preparation.
        </Text>
        <Text style={styles.aboutText}>
          Whether you are preparing for your next belt grading or simply want to deepen your knowledge of Taekwon-Do, Theory Syllabus provides structured, easy-to-navigate content based on the official ITF curriculum.
        </Text>
      </SectionCard>

      {/* Features */}
      <SectionCard title="Features">
        {[
          { icon: 'menu-book',        text: 'Complete Basic Theory content' },
          { icon: 'history',          text: 'Full History of Taekwon-Do' },
          { icon: 'directions-walk',  text: 'All ITF Stances with diagrams' },
          { icon: 'accessibility-new',text: 'Body Parts & Vital Points' },
          { icon: 'translate',        text: 'Korean terminology & matching' },
          { icon: 'sports-kabaddi',   text: 'Sparring rules & techniques' },
          { icon: 'question-answer',  text: 'Theory Q&A for belt gradings' },
          { icon: 'lock',             text: 'Practical training section' },
        ].map((f) => (
          <View key={f.text} style={styles.featureRow}>
            <Icon name={f.icon} size={18} color="#006CB5" type="MaterialIcons" />
            <Text style={styles.featureText}>{f.text}</Text>
          </View>
        ))}
      </SectionCard>

      {/* Contact */}
      <SectionCard title="Contact & Support">
        <InfoRow icon="email" label="Email" value="contact@cwtakarnataka.com" />
        <InfoRow icon="language" label="Website" value="cwtakarnataka.com" />
      
      </SectionCard>

      {/* Legal */}
      <SectionCard title="Legal">
        <InfoRow icon="gavel" label="Terms of Service" value="View terms" onPress={() => setLegalModal({ title: 'Terms of Service', content: TERMS })} />
        <InfoRow icon="privacy-tip" label="Privacy Policy" value="View policy" onPress={() => setLegalModal({ title: 'Privacy Policy', content: PRIVACY })} />
        <InfoRow icon="copyright" label="Copyright" value="© 2026 Theory Syllabus. All rights reserved." />
      </SectionCard>

      {/* ITF Note */}
      <View style={styles.noteBox}>
        <Icon name="info" size={18} color="#3b82f6" type="MaterialIcons" />
        <Text style={styles.noteText}>
          This app is based on the ITF (International Taekwon-Do Federation) syllabus as established by General Choi Hong Hi. Content is for educational purposes only.
        </Text>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>

    {/* Feedback Modal */}
    <Modal visible={feedbackOpen} transparent animationType="slide" onRequestClose={() => setFeedbackOpen(false)}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalBox}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Rate & Feedback</Text>
            <TouchableOpacity onPress={() => setFeedbackOpen(false)} activeOpacity={0.7}>
              <Icon name="close" size={24} color="#1f2937" type="MaterialIcons" />
            </TouchableOpacity>
          </View>

          <Text style={styles.modalSubtitle}>How would you rate Theory Syllabus?</Text>

          {/* Stars */}
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setRating(star)} activeOpacity={0.7}>
                <Icon
                  name={star <= rating ? 'star' : 'star-border'}
                  size={40}
                  color={star <= rating ? '#f59e0b' : '#d1d5db'}
                  type="MaterialIcons"
                />
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.ratingLabel}>
            {rating === 0 ? 'Tap to rate' : ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating]}
          </Text>

          <Text style={styles.feedbackLabel}>Your Feedback (optional)</Text>
          <TextInput
            style={styles.feedbackInput}
            placeholder="Tell us what you think..."
            placeholderTextColor="#9ca3af"
            multiline
            numberOfLines={4}
            value={feedback}
            onChangeText={setFeedback}
            textAlignVertical="top"
          />

          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} activeOpacity={0.8}>
            <Text style={styles.submitBtnText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
    {/* Legal Modal */}
    <Modal visible={!!legalModal} transparent animationType="slide" onRequestClose={() => setLegalModal(null)}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalBox, styles.legalModalBox]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{legalModal?.title}</Text>
            <TouchableOpacity onPress={() => setLegalModal(null)} activeOpacity={0.7}>
              <Icon name="close" size={24} color="#1f2937" type="MaterialIcons" />
            </TouchableOpacity>
          </View>
          <ScrollView showsVerticalScrollIndicator={false} style={styles.legalScroll}>
            <Text style={styles.legalText}>{legalModal?.content}</Text>
            <View style={{ height: 20 }} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f9fafb' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#fff', paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    borderBottomWidth: 1, borderBottomColor: '#e5e7eb',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1f2937' },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { paddingHorizontal: spacing.md, paddingTop: spacing.lg },
  // Hero
  heroSection: { alignItems: 'center', marginBottom: spacing.xl },
  logoBox: {
    width: 100, height: 100, borderRadius: 22,
    backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center',
    marginBottom: spacing.md,
  },
  logoImage: { width: 90, height: 90 },
  appName: { fontSize: 26, fontWeight: '900', color: '#1f2937', marginBottom: 4 },
  appTagline: { fontSize: 14, color: '#6b7280', textAlign: 'center', marginBottom: spacing.md },
  versionBadge: {
    backgroundColor: '#e0f0ff', borderRadius: 20,
    paddingHorizontal: spacing.md, paddingVertical: 4,
  },
  versionBadgeText: { fontSize: 13, color: '#006CB5', fontWeight: '700' },
  // Card
  card: {
    backgroundColor: '#fff', borderRadius: 16, padding: spacing.md,
    marginBottom: spacing.md,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  cardTitle: { fontSize: 16, fontWeight: '800', color: '#1f2937', marginBottom: spacing.md },
  // Info row
  infoRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f3f4f6',
  },
  infoIconBox: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: '#f3f4f6', justifyContent: 'center', alignItems: 'center',
    marginRight: spacing.md,
  },
  infoText: { flex: 1 },
  infoLabel: { fontSize: 12, color: '#1f2937', fontWeight: '700', marginBottom: 1 },
  infoValue: { fontSize: 14, color: '#6b7280', fontWeight: '600' },
  infoLink: { color: '#6b7280' },
  // About
  aboutText: { fontSize: 14, color: '#374151', lineHeight: 22, marginBottom: spacing.sm },
  // Features
  featureRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f3f4f6',
  },
  featureText: { fontSize: 14, color: '#374151', marginLeft: spacing.md, flex: 1 },
  // Note
  noteBox: {
    flexDirection: 'row', alignItems: 'flex-start',
    backgroundColor: '#eff6ff', borderRadius: 12, padding: spacing.md,
    borderLeftWidth: 4, borderLeftColor: '#3b82f6', marginBottom: spacing.md,
  },
  noteText: { fontSize: 13, color: '#374151', lineHeight: 20, marginLeft: spacing.sm, flex: 1 },
  // Feedback button row
  feedbackBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f3f4f6',
  },
  feedbackBtnLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  // Modal
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  modalBox: {
    backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24, paddingBottom: 36,
  },
  modalHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: 8,
  },
  modalTitle: { fontSize: 20, fontWeight: '800', color: '#1f2937' },
  modalSubtitle: { fontSize: 14, color: '#6b7280', marginBottom: 20 },
  starsRow: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 8 },
  ratingLabel: { textAlign: 'center', fontSize: 14, color: '#6b7280', marginBottom: 20 },
  feedbackLabel: { fontSize: 13, fontWeight: '700', color: '#1f2937', marginBottom: 8 },
  feedbackInput: {
    borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12,
    padding: 12, fontSize: 14, color: '#1f2937',
    minHeight: 100, marginBottom: 20,
  },
  submitBtn: {
    backgroundColor: '#006CB5', borderRadius: 12,
    paddingVertical: 14, alignItems: 'center',
  },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  // Legal modal
  legalModalBox: { maxHeight: '80%' },
  legalScroll: { marginTop: 8 },
  legalText: { fontSize: 14, color: '#374151', lineHeight: 24 },
});

export default AppInfoScreen;
