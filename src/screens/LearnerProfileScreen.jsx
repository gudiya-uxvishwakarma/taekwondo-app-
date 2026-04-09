import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { useStudent } from '../context/StudentContext';
import { colors, spacing } from '../theme';
import Icon from '../components/common/Icon';
import API_CONFIG from '../config/api';

const LearnerProfileScreen = ({ onBack, onLogout, onSwitch, canEdit = false }) => {
  const { student } = useStudent();
  const [showEditName, setShowEditName] = useState(false);
  const [showEditPhone, setShowEditPhone] = useState(false);
  const [showEditEmail, setShowEditEmail] = useState(false);
  const [showEditBelt, setShowEditBelt] = useState(false);
  const [showHelpSupport, setShowHelpSupport] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [editedName, setEditedName] = useState(student?.name || '');
  const [editedPhone, setEditedPhone] = useState(student?.phone || '');
  const [editedEmail, setEditedEmail] = useState(student?.email || '');
  const [editedBelt, setEditedBelt] = useState(student?.belt || 'Yellow Belt');

  const belts = ['White Belt', 'Yellow Belt', 'Green Belt', 'Blue Belt', 'Red Belt', 'Black Belt'];

  // Build photo URL from student data or fetch fresh from server
  const BASE_URL = API_CONFIG.BASE_URL.replace('/api', '');
  const [photoUrl, setPhotoUrl] = useState(null);

  useEffect(() => {
    const loadPhoto = async () => {
      // First try from cached student data
      if (student?.photo) {
        const url = student.photo.startsWith('http')
          ? student.photo
          : `${BASE_URL}${student.photo.startsWith('/') ? '' : '/'}${student.photo}`;
        setPhotoUrl(url);
        return;
      }
      // Fetch fresh profile from server to get latest photo
      try {
        const AsyncStorage = require('@react-native-async-storage/async-storage').default;
        const token = await AsyncStorage.getItem('auth_token');
        if (!token) return;
        const res = await fetch(`${API_CONFIG.BASE_URL}/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        const p = data?.data?.user?.photo;
        if (p) {
          const url = p.startsWith('http') ? p : `${BASE_URL}${p.startsWith('/') ? '' : '/'}${p}`;
          setPhotoUrl(url);
        }
      } catch (e) { /* ignore */ }
    };
    loadPhoto();
  }, [student]);

  const handlePhotoEdit = () => {
    Alert.alert(
      'Change Profile Photo',
      'Choose an option',
      [
        { text: 'Take Photo', onPress: () => console.log('Take Photo') },
        { text: 'Choose from Gallery', onPress: () => console.log('Choose from Gallery') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleSaveName = () => {
    console.log('Saving name:', editedName);
    setShowEditName(false);
  };

  const handleSavePhone = () => {
    console.log('Saving phone:', editedPhone);
    setShowEditPhone(false);
  };

  const handleSaveEmail = () => {
    console.log('Saving email:', editedEmail);
    setShowEditEmail(false);
  };

  const handleSaveBelt = () => {
    console.log('Saving belt:', editedBelt);
    setShowEditBelt(false);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: onLogout, style: 'destructive' },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#006CB5" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={onBack}
          activeOpacity={0.7}
        >
          <Icon name="arrow-back" size={24} color="#fff" type="MaterialIcons" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Profile Photo Section */}
        <View style={styles.profileSection}>
          <View style={styles.photoContainer}>
            {photoUrl ? (
              <Image
                source={{ uri: photoUrl }}
                style={styles.photoImage}
                resizeMode="cover"
              />
            ) : (
              <Text style={styles.photoEmoji}>👤</Text>
            )}
            {canEdit && (
              <TouchableOpacity 
                style={styles.cameraButton}
                onPress={handlePhotoEdit}
                activeOpacity={0.7}
              >
                <Icon name="camera-alt" size={16} color="#fff" type="MaterialIcons" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Profile Info Section */}
        <View style={styles.infoSection}>
          {/* Name */}
          {canEdit ? (
            <TouchableOpacity style={styles.infoRow} onPress={() => setShowEditName(true)} activeOpacity={0.7}>
              <View style={styles.infoLeft}>
                <Icon name="person" size={24} color="#1f2937" type="MaterialIcons" />
                <View style={styles.infoText}>
                  <Text style={styles.infoLabel}>Name</Text>
                  <Text style={styles.infoValue}>{student?.name || 'Not set'}</Text>
                </View>
              </View>
              <Icon name="chevron-right" size={24} color="#9ca3af" type="MaterialIcons" />
            </TouchableOpacity>
          ) : (
            <View style={styles.infoRow}>
              <View style={styles.infoLeft}>
                <Icon name="person" size={24} color="#1f2937" type="MaterialIcons" />
                <View style={styles.infoText}>
                  <Text style={styles.infoLabel}>Name</Text>
                  <Text style={styles.infoValue}>{student?.name || 'Not set'}</Text>
                </View>
              </View>
            </View>
          )}

          {/* Phone */}
          {canEdit ? (
            <TouchableOpacity style={styles.infoRow} onPress={() => setShowEditPhone(true)} activeOpacity={0.7}>
              <View style={styles.infoLeft}>
                <Icon name="phone" size={24} color="#1f2937" type="MaterialIcons" />
                <View style={styles.infoText}>
                  <Text style={styles.infoLabel}>Phone</Text>
                  <Text style={styles.infoValue}>{student?.phone || 'Not set'}</Text>
                </View>
              </View>
              <Icon name="chevron-right" size={24} color="#9ca3af" type="MaterialIcons" />
            </TouchableOpacity>
          ) : (
            <View style={styles.infoRow}>
              <View style={styles.infoLeft}>
                <Icon name="phone" size={24} color="#1f2937" type="MaterialIcons" />
                <View style={styles.infoText}>
                  <Text style={styles.infoLabel}>Phone</Text>
                  <Text style={styles.infoValue}>{student?.phone || 'Not set'}</Text>
                </View>
              </View>
            </View>
          )}

          {/* Email */}
          {canEdit ? (
            <TouchableOpacity style={styles.infoRow} onPress={() => setShowEditEmail(true)} activeOpacity={0.7}>
              <View style={styles.infoLeft}>
                <Icon name="email" size={24} color="#1f2937" type="MaterialIcons" />
                <View style={styles.infoText}>
                  <Text style={styles.infoLabel}>Email</Text>
                  <Text style={styles.infoValue}>{student?.email || 'Not set'}</Text>
                </View>
              </View>
              <Icon name="chevron-right" size={24} color="#9ca3af" type="MaterialIcons" />
            </TouchableOpacity>
          ) : (
            <View style={styles.infoRow}>
              <View style={styles.infoLeft}>
                <Icon name="email" size={24} color="#1f2937" type="MaterialIcons" />
                <View style={styles.infoText}>
                  <Text style={styles.infoLabel}>Email</Text>
                  <Text style={styles.infoValue}>{student?.email || 'Not set'}</Text>
                </View>
              </View>
            </View>
          )}

          {/* Belt */}
          {canEdit ? (
            <TouchableOpacity style={styles.infoRow} onPress={() => setShowEditBelt(true)} activeOpacity={0.7}>
              <View style={styles.infoLeft}>
                <Icon name="star" size={24} color="#1f2937" type="MaterialIcons" />
                <View style={styles.infoText}>
                  <Text style={styles.infoLabel}>Belt Level</Text>
                  <Text style={styles.infoValue}>{editedBelt}</Text>
                </View>
              </View>
              <Icon name="chevron-right" size={24} color="#9ca3af" type="MaterialIcons" />
            </TouchableOpacity>
          ) : (
            <View style={styles.infoRow}>
              <View style={styles.infoLeft}>
                <Icon name="star" size={24} color="#1f2937" type="MaterialIcons" />
                <View style={styles.infoText}>
                  <Text style={styles.infoLabel}>Belt Level</Text>
                  <Text style={styles.infoValue}>{student?.belt || editedBelt}</Text>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionSection}>
         

        

          <TouchableOpacity 
            style={[styles.actionButton, styles.logoutButton]}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <Icon name="logout" size={24} color="#ef4444" type="MaterialIcons" />
            <Text style={[styles.actionButtonText, styles.logoutText]}>Logout</Text>
            <Icon name="chevron-right" size={24} color="#9ca3af" type="MaterialIcons" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, styles.switchButton]}
            onPress={onSwitch}
            activeOpacity={0.7}
          >
            <Icon name="swap-horiz" size={24} color={colors.primary} type="MaterialIcons" />
            <Text style={[styles.actionButtonText, styles.switchText]}>Switch Screen</Text>
            <Icon name="chevron-right" size={24} color="#9ca3af" type="MaterialIcons" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Edit Name Modal */}
      <Modal
        visible={showEditName}
        transparent
        animationType="fade"
        onRequestClose={() => setShowEditName(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Name</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter your name"
              value={editedName}
              onChangeText={setEditedName}
              placeholderTextColor="#9ca3af"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowEditName(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveName}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Phone Modal */}
      <Modal
        visible={showEditPhone}
        transparent
        animationType="fade"
        onRequestClose={() => setShowEditPhone(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Phone</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter your phone number"
              value={editedPhone}
              onChangeText={setEditedPhone}
              keyboardType="phone-pad"
              placeholderTextColor="#9ca3af"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowEditPhone(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSavePhone}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Email Modal */}
      <Modal
        visible={showEditEmail}
        transparent
        animationType="fade"
        onRequestClose={() => setShowEditEmail(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Email</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter your email"
              value={editedEmail}
              onChangeText={setEditedEmail}
              keyboardType="email-address"
              placeholderTextColor="#9ca3af"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowEditEmail(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveEmail}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Belt Modal */}
      <Modal
        visible={showEditBelt}
        transparent
        animationType="fade"
        onRequestClose={() => setShowEditBelt(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Belt Level</Text>
            <ScrollView style={styles.beltList}>
              {belts.map((belt) => (
                <TouchableOpacity
                  key={belt}
                  style={[
                    styles.beltOption,
                    editedBelt === belt && styles.beltOptionSelected,
                  ]}
                  onPress={() => setEditedBelt(belt)}
                >
                  <Text
                    style={[
                      styles.beltOptionText,
                      editedBelt === belt && styles.beltOptionTextSelected,
                    ]}
                  >
                    {belt}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowEditBelt(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveBelt}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Help & Support Modal */}
      <Modal
        visible={showHelpSupport}
        transparent
        animationType="slide"
        onRequestClose={() => setShowHelpSupport(false)}
      >
        <View style={styles.bottomSheetOverlay}>
          <TouchableOpacity 
            style={styles.bottomSheetBackdrop}
            activeOpacity={1}
            onPress={() => setShowHelpSupport(false)}
          />
          <View style={styles.bottomSheetContent}>
            <View style={styles.bottomSheetHandle} />
            <View style={styles.bottomSheetHeader}>
              <Text style={styles.bottomSheetTitle}>Help & Support</Text>
              <TouchableOpacity onPress={() => setShowHelpSupport(false)}>
                <Icon name="close" size={24} color="#1f2937" type="MaterialIcons" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.bottomSheetBody} showsVerticalScrollIndicator={false} contentContainerStyle={styles.bottomSheetBodyContent}>
              <Text style={styles.helpText}>
                <Text style={styles.helpHeading}>🥋 Help & Support Center{'\n\n'}</Text>
                
                <Text style={styles.helpSubheading}>📞 Contact Information{'\n'}</Text>
                Email: support@taekwondo-app.com{'\n'}
                Phone: +1 (555) 123-4567{'\n'}
                WhatsApp: +1 (555) 123-4568{'\n\n'}
                
                <Text style={styles.helpSubheading}>⏰ Support Hours{'\n'}</Text>
                Monday - Friday: 8:00 AM - 8:00 PM EST{'\n'}
                Saturday: 9:00 AM - 5:00 PM EST{'\n'}
                Sunday: 10:00 AM - 4:00 PM EST{'\n'}
                Response Time: Usually within 2 hours{'\n\n'}
                
                <Text style={styles.helpSubheading}>🚀 Getting Started{'\n'}</Text>
                1. Create account with email or phone{'\n'}
                2. Complete your profile (name, belt level){'\n'}
                3. Choose training style (Quick Workout or Programs){'\n'}
                4. Start with beginner lessons{'\n'}
                5. Track progress on dashboard{'\n\n'}
                
                <Text style={styles.helpSubheading}>❓ Frequently Asked Questions{'\n\n'}</Text>
                
                <Text style={styles.helpBold}>How do I start training?{'\n'}</Text>
                Go to dashboard, tap "Quick Workout" or select a program. Choose a beginner lesson and follow video instructions.{'\n\n'}
                
                <Text style={styles.helpBold}>How is my progress tracked?{'\n'}</Text>
                Your progress saves automatically. Check "Progression by Belt" to see your advancement toward next belt level.{'\n\n'}
                
                <Text style={styles.helpBold}>Can I customize my schedule?{'\n'}</Text>
                Yes! Go to profile settings to set training days and times. You'll get reminders to stay consistent.{'\n\n'}
                
                <Text style={styles.helpBold}>How do I access techniques?{'\n'}</Text>
                Tap the menu icon (3rd button) on dashboard to access 300+ techniques with detailed instructions.{'\n\n'}
                
                <Text style={styles.helpBold}>Can I download videos?{'\n'}</Text>
                Premium members can download lessons for offline viewing. Tap download icon on any lesson.{'\n\n'}
                
                <Text style={styles.helpSubheading}>�️ Troubleshooting{'\n\n'}</Text>
                
                <Text style={styles.helpBold}>App crashes or freezes?{'\n'}</Text>
                • Force close and restart the app{'\n'}
                • Clear app cache in settings{'\n'}
                • Update to latest version{'\n'}
                • Reinstall if problem persists{'\n\n'}
                
                <Text style={styles.helpBold}>Video won't play?{'\n'}</Text>
                • Check internet connection (WiFi recommended){'\n'}
                • Try another video first{'\n'}
                • Clear app cache and restart{'\n'}
                • Contact support if issue continues{'\n\n'}
                
                <Text style={styles.helpBold}>Can't log in?{'\n'}</Text>
                • Verify email and password{'\n'}
                • Check if caps lock is on{'\n'}
                • Use "Forgot Password" to reset{'\n'}
                • Ensure stable internet connection{'\n\n'}
                
                <Text style={styles.helpSubheading}>💡 Training Tips{'\n'}</Text>
                • Train 3-4 times per week for best results{'\n'}
                • Always warm up before training{'\n'}
                • Focus on proper form over speed{'\n'}
                • Use Technique Library to improve{'\n'}
                • Track progress regularly{'\n'}
                • Stretch after each session{'\n\n'}
                
                <Text style={styles.helpSubheading}>📊 Belt System{'\n'}</Text>
                White - Yellow - Green - Blue - Red - Black{'\n'}
                Each belt has 20+ lessons to complete.{'\n\n'}
                
                <Text style={styles.helpSubheading}>📧 Send Feedback{'\n'}</Text>
                We'd love your feedback! Email: feedback@taekwondo-app.com{'\n\n'}
                
                <Text style={styles.helpSubheading}>🌐 Follow Us{'\n'}</Text>
                Instagram: @taekwondo_app{'\n'}
                Facebook: facebook.com/TaekwondoApp{'\n'}
                YouTube: Taekwondo Training Channel
              </Text>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Privacy Policy Modal */}
      <Modal
        visible={showPrivacyPolicy}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPrivacyPolicy(false)}
      >
        <View style={styles.bottomSheetOverlay}>
          <TouchableOpacity 
            style={styles.bottomSheetBackdrop}
            activeOpacity={1}
            onPress={() => setShowPrivacyPolicy(false)}
          />
          <View style={styles.bottomSheetContent}>
            <View style={styles.bottomSheetHandle} />
            <View style={styles.bottomSheetHeader}>
              <Text style={styles.bottomSheetTitle}>Privacy Policy</Text>
              <TouchableOpacity onPress={() => setShowPrivacyPolicy(false)}>
                <Icon name="close" size={24} color="#1f2937" type="MaterialIcons" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.bottomSheetBody} showsVerticalScrollIndicator={false} contentContainerStyle={styles.bottomSheetBodyContent}>
              <Text style={styles.privacyText}>
                <Text style={styles.privacyHeading}>Privacy Policy{'\n\n'}</Text>
                
                <Text style={styles.privacyHeading}>Last Updated: March 2026{'\n\n'}</Text>
                
                <Text style={styles.privacyHeading}>1. Introduction{'\n'}</Text>
                Welcome to Taekwondo Training App. We respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information.{'\n\n'}
                
                <Text style={styles.privacyHeading}>2. Information We Collect{'\n'}</Text>
                • Personal Information: Name, email address, phone number{'\n'}
                • Training Data: Belt level, progress, workout history{'\n'}
                • Usage Data: App interactions, preferences, session duration{'\n'}
                • Device Information: Device type, OS version{'\n\n'}
                
                <Text style={styles.privacyHeading}>3. How We Use Your Information{'\n'}</Text>
                • Provide and maintain our training services{'\n'}
                • Track and display your training progress{'\n'}
                • Personalize your learning experience{'\n'}
                • Send training reminders and updates{'\n'}
                • Improve our app and develop new features{'\n'}
                • Ensure security and prevent fraud{'\n\n'}
                
                <Text style={styles.privacyHeading}>4. Data Security{'\n'}</Text>
                We implement industry-standard security measures to protect your personal information. Your data is encrypted during transmission and stored securely on our servers.{'\n\n'}
                
                <Text style={styles.privacyHeading}>5. Data Sharing{'\n'}</Text>
                We do not sell your personal information. We may share data with service providers who assist in app operations and legal authorities when required by law.{'\n\n'}
                
                <Text style={styles.privacyHeading}>6. Your Rights{'\n'}</Text>
                You have the right to:{'\n'}
                • Access your personal data{'\n'}
                • Update or correct your information{'\n'}
                • Delete your account and data{'\n'}
                • Opt-out of marketing communications{'\n'}
                • Export your training data{'\n\n'}
                
                <Text style={styles.privacyHeading}>7. Data Retention{'\n'}</Text>
                We retain your data as long as your account is active. After account deletion, we may retain certain information for legal compliance purposes.{'\n\n'}
                
                <Text style={styles.privacyHeading}>8. Children's Privacy{'\n'}</Text>
                Our app is suitable for users of all ages. For users under 13, parental consent is required. We do not knowingly collect data from children without parental permission.{'\n\n'}
                
                <Text style={styles.privacyHeading}>9. Contact Us{'\n'}</Text>
                If you have questions about this privacy policy, please contact us at:{'\n'}
                Email: privacy@taekwondo-app.com{'\n'}
                Phone: +1 (555) 123-4567{'\n\n'}
                
                <Text style={styles.privacyHeading}>10. Changes to This Policy{'\n'}</Text>
                We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy in the app.
              </Text>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: '#006CB5',
    borderBottomWidth: 0,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  headerSpacer: {
    width: 40,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  photoContainer: {
    position: 'relative',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    elevation: 4,
  },
  photoEmoji: {
    fontSize: 60,
  },
  photoImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
    height: 120,
    borderRadius: 60,
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  infoSection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  infoText: {
    marginLeft: spacing.md,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '500',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  actionSection: {
    marginBottom: spacing.xl,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginLeft: spacing.md,
    flex: 1,
  },
  logoutButton: {
    marginTop: spacing.lg,
  },
  logoutText: {
    color: '#ef4444',
  },
  switchButton: {
    marginTop: spacing.sm,
  },
  switchText: {
    color: colors.primary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: spacing.lg,
    width: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: spacing.md,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 16,
    color: '#1f2937',
    marginBottom: spacing.lg,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  modalButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#e5e7eb',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  saveButton: {
    backgroundColor: colors.primary,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  beltList: {
    maxHeight: 300,
    marginBottom: spacing.lg,
  },
  beltOption: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  beltOptionSelected: {
    backgroundColor: colors.primary + '15',
  },
  beltOptionText: {
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '500',
  },
  beltOptionTextSelected: {
    color: colors.primary,
    fontWeight: '700',
  },
  bottomSheetOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  bottomSheetBackdrop: {
    flex: 1,
  },
  bottomSheetContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '70%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  bottomSheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#d1d5db',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  bottomSheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  bottomSheetTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1f2937',
  },
  bottomSheetBody: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  bottomSheetBodyContent: {
    paddingBottom: 40,
  },
  helpText: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 22,
  },
  helpHeading: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1f2937',
  },
  helpSubheading: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
  },
  helpBold: {
    fontWeight: '700',
    color: '#1f2937',
  },
  privacyText: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 22,
  },
  privacyHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
  },
});

export default LearnerProfileScreen;
