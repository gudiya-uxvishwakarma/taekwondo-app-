import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, Alert, Modal, TextInput, Animated,
  ActivityIndicator, Image, Platform, PermissionsAndroid, Linking,
} from 'react-native';
import RNFS from 'react-native-fs';
import { useStudent } from '../context/StudentContext';
import { useNavigation } from '../context/NavigationContext';
import { StudentService, AuthService } from '../services';
import api from '../services/api';
import Icon from '../components/common/Icon';
import API_CONFIG from '../config/api';

const ProfileScreen = () => {
  const { logout, student, goToSelection } = useStudent();
  const { navigate } = useNavigation();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => { loadProfileData(); }, []);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      try {
        const response = await StudentService.getProfile();
        setProfileData(response);
        return;
      } catch (e) {
        if (student?.email) {
          try {
            const pub = await api.get('/students/public');
            if (pub.status === 'success' && pub.data?.students) {
              const found = pub.data.students.find(s => s.email?.toLowerCase() === student.email.toLowerCase());
              if (found) { setProfileData({ ...found, name: found.fullName || found.name }); return; }
            }
          } catch (_) {}
          setProfileData({ ...student, fullName: student.name, achievements: [] });
          return;
        }
        throw e;
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to load profile.', [{ text: 'Retry', onPress: loadProfileData }, { text: 'OK' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: async () => {
        try { await AuthService.logout(); } catch (_) {}
        logout();
      }},
    ]);
  };

  const handlePasswordSubmit = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      Alert.alert('Error', 'Please fill all fields'); return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match'); return;
    }
    if (passwordData.newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters'); return;
    }
    try {
      setPasswordLoading(true);
      await AuthService.changePassword({ currentPassword: passwordData.currentPassword, newPassword: passwordData.newPassword });
      Alert.alert('Success', 'Password changed successfully!', [{ text: 'OK', onPress: () => {
        setShowPasswordModal(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }}]);
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const requestStoragePermission = async () => {
    if (Platform.OS !== 'android') return true;
    if (Platform.Version >= 33) return true;
    const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  };

  const handleDownloadCertificate = async (certificateFile, certificateCode, eventType) => {
    if (!certificateFile) { Alert.alert('No Certificate', 'No certificate file available.'); return; }
    try {
      const hasPermission = await requestStoragePermission();
      if (!hasPermission) { Alert.alert('Permission Denied', 'Storage permission required'); return; }

      const baseUrl = API_CONFIG.BASE_URL.replace('/api', '');

      // certFile is stored as "uploads/students/filename.ext" — serve directly as static
      const normalizedPath = certificateFile.startsWith('/') ? certificateFile : `/${certificateFile}`;
      const url = certificateFile.startsWith('http') ? certificateFile : `${baseUrl}${normalizedPath}`;

      const filename = certificateFile.split('/').pop();
      const ext = filename.split('.').pop() || 'pdf';
      const saveName = `cert_${(eventType || 'belt').replace(/\s+/g, '_')}_${certificateCode || Date.now()}.${ext}`;
      const downloadPath = `${RNFS.CachesDirectoryPath}/${saveName}`;

      console.log('📥 Downloading cert from:', url);
      Alert.alert('Downloading', 'Please wait...');

      const result = await RNFS.downloadFile({
        fromUrl: url,
        toFile: downloadPath,
        headers: { Accept: '*/*' },
        connectionTimeout: 15000,
        readTimeout: 15000,
      }).promise;

      console.log('📥 Result:', result.statusCode, result.bytesWritten);

      if (result.statusCode === 200 && result.bytesWritten > 0) {
        let finalPath = downloadPath;
        if (Platform.OS === 'android') {
          try {
            const dest = `${RNFS.DownloadDirectoryPath}/${saveName}`;
            await RNFS.moveFile(downloadPath, dest);
            finalPath = dest;
          } catch (_) {}
        }
        Alert.alert('Downloaded', `Certificate saved: ${saveName}`, [
          { text: 'Open', onPress: () => Linking.openURL(`file://${finalPath}`).catch(() => {}) },
          { text: 'OK' },
        ]);
      } else if (result.statusCode === 404) {
        Alert.alert(
          'File Not Found',
          'This certificate has not been uploaded yet. Please ask your instructor to upload it from the admin panel.',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert('Failed', `Download failed (status ${result.statusCode}). Please try again.`);
      }
    } catch (error) {
      console.error('Download error:', error);
      Alert.alert('Error', 'Download failed. Check your connection and try again.');
    }
  };

  const s = profileData;

  const photoUrl = s?.photo
    ? (s.photo.startsWith('http') ? s.photo : `${API_CONFIG.BASE_URL.replace('/api', '')}/${s.photo}`)
    : null;

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A';

  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#006CB5" />
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigate('Dashboard')}>
            <Icon name="arrow-back" size={22} color="#fff" type="MaterialIcons" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Profile</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#006CB5" />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </View>
    );
  }

  if (!s) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#006CB5" />
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigate('Dashboard')}>
            <Icon name="arrow-back" size={22} color="#fff" type="MaterialIcons" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Profile</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.centered}>
          <Text style={styles.loadingText}>Unable to load profile</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={loadProfileData}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#006CB5" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigate('Dashboard')}>
          <Icon name="arrow-back" size={22} color="#fff" type="MaterialIcons" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Hero Card */}
        <View style={styles.heroCard}>
          <View style={styles.avatarWrap}>
            {photoUrl ? (
              <Image
                source={{ uri: photoUrl }}
                style={styles.avatar}
                resizeMode="cover"
                onError={() => setProfileData(p => ({ ...p, photo: null }))}
              />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <Icon name="person" size={44} color="#006CB5" type="MaterialIcons" />
              </View>
            )}
            <View style={styles.beltBadge}>
              <Text style={styles.beltBadgeText}>🥋</Text>
            </View>
          </View>
          <Text style={styles.heroName}>{s.fullName || s.name || 'Student'}</Text>
          <View style={styles.heroBeltRow}>
            <View style={styles.beltPill}>
              <Text style={styles.beltPillText}>{s.currentBeltLevel || 'Belt N/A'}</Text>
            </View>
          </View>
          <View style={styles.heroMeta}>
            <View style={styles.heroMetaItem}>
              <Text style={styles.heroMetaLabel}>Admission No.</Text>
              <Text style={styles.heroMetaValue}>{s.admissionNumber || 'N/A'}</Text>
            </View>
            <View style={styles.heroMetaDivider} />
            <View style={styles.heroMetaItem}>
              <Text style={styles.heroMetaLabel}>Student ID</Text>
              <Text style={styles.heroMetaValue}>{s.studentId || 'N/A'}</Text>
            </View>
            <View style={styles.heroMetaDivider} />
            <View style={styles.heroMetaItem}>
              <Text style={styles.heroMetaLabel}>Age</Text>
              <Text style={styles.heroMetaValue}>{s.age ? `${s.age} yrs` : 'N/A'}</Text>
            </View>
          </View>
        </View>

        {/* Personal Information */}
        <InfoCard title="Personal Information" icon="person">
          <Row2
            left={{ label: 'Full Name', value: s.fullName || s.name }}
            right={{ label: 'Date of Birth', value: formatDate(s.dateOfBirth) }}
          />
          <Row2
            left={{ label: 'Age', value: s.age ? `${s.age} years` : 'N/A' }}
            right={{ label: 'Gender', value: s.gender }}
          />
          <Row2
            left={{ label: 'Blood Group', value: s.bloodGroup }}
            right={{ label: 'Joining Date', value: formatDate(s.joiningDate || s.admissionDate) }}
          />
          <Row2
            left={{ label: 'Admission No.', value: s.admissionNumber }}
            right={{ label: 'ID Number', value: s.idNumber }}
          />
          <Row2
            left={{ label: 'School / College', value: s.schoolCollegeName }}
            right={{ label: 'Qualification', value: s.qualification }}
          />
          <Row2
            left={{ label: 'Organization', value: s.organizationName }}
            right={{ label: 'Instructor', value: s.instructorName }}
          />
          <RowFull label="Class Address" value={s.classAddress} />
        </InfoCard>

        {/* Contact Information */}
        <InfoCard title="Contact Information" icon="contact-phone">
          <Row2
            left={{ label: 'Phone', value: s.phone }}
            right={{ label: 'Email', value: s.email }}
          />
          <RowFull label="Address" value={s.address} />
        </InfoCard>

        {/* Family Information */}
        <InfoCard title="Family Information" icon="family-restroom">
          <Row2
            left={{ label: 'Father Name', value: s.fatherName }}
            right={{ label: 'Mother Name', value: s.motherName }}
          />
          <Row2
            left={{ label: 'Father Phone', value: s.fatherPhone }}
            right={{ label: 'Mother Phone', value: s.motherPhone }}
          />
          <Row2
            left={{ label: 'Father Occupation', value: s.fatherOccupation }}
            right={{ label: 'Mother Occupation', value: s.motherOccupation }}
          />
          <RowFull label="Emergency Contact" value={s.emergencyContact} />
        </InfoCard>

        {/* Training Information */}
        <InfoCard title="Training Information" icon="sports-kabaddi">
          <Row2
            left={{ label: 'Current Belt', value: s.currentBeltLevel }}
            right={{ label: 'Instructor', value: s.instructorName }}
          />
          <RowFull label="Class Address" value={s.classAddress} />
        </InfoCard>

        {/* Exam Dates & Certificates */}
        <ExamCertSection student={s} onDownload={handleDownloadCertificate} formatDate={formatDate} />

        {/* Achievements */}
        <InfoCard title="Achievements" icon="emoji-events">
          {s.achievements && s.achievements.length > 0 ? (
            s.achievements.map((ach, i) => (
              <View key={i} style={styles.achCard}>
                <View style={styles.achHeader}>
                  <Icon name="emoji-events" size={18} color="#f59e0b" type="MaterialIcons" />
                  <Text style={styles.achTitle}>{ach.tournamentName || 'Tournament'}</Text>
                </View>
                {ach.address ? <Text style={styles.achSub}>📍 {ach.address}</Text> : null}
                {ach.date ? <Text style={styles.achSub}>📅 {formatDate(ach.date)}</Text> : null}
                {ach.typePrices?.map((tp, j) => (
                  <View key={j} style={styles.eventRow}>
                    <View style={styles.eventRowLeft}>
                      <Text style={styles.eventType}>{tp.type || 'Event'}</Text>
                      {tp.price ? (
                        <View style={[
                          styles.medalBadge,
                          tp.price.toLowerCase().includes('gold') && styles.gold,
                          tp.price.toLowerCase().includes('silver') && styles.silver,
                          tp.price.toLowerCase().includes('bronze') && styles.bronze,
                        ]}>
                          <Text style={styles.medalText}>🏅 {tp.price}</Text>
                        </View>
                      ) : null}
                      {tp.certificateCode ? <Text style={styles.certCode}>#{tp.certificateCode}</Text> : null}
                    </View>
                    {tp.certificateFile ? (
                      <TouchableOpacity
                        style={styles.dlBtn}
                        onPress={() => handleDownloadCertificate(tp.certificateFile, tp.certificateCode, tp.type)}
                      >
                        <Icon name="file-download" size={14} color="#fff" type="MaterialIcons" />
                        <Text style={styles.dlBtnText}>Download</Text>
                      </TouchableOpacity>
                    ) : tp.certificateCode ? (
                      <Text style={styles.noCert}>Pending</Text>
                    ) : null}
                  </View>
                ))}
              </View>
            ))
          ) : (
            <View style={styles.emptyAch}>
              <Text style={styles.emptyAchText}>No achievements recorded yet</Text>
            </View>
          )}
        </InfoCard>

        {/* Settings */}
        <View style={styles.card}>
          <TouchableOpacity style={styles.settingRow} onPress={() => setShowPasswordModal(true)}>
            <View style={styles.settingIconWrap}>
              <Icon name="lock" size={20} color="#006CB5" type="MaterialIcons" />
            </View>
            <Text style={styles.settingLabel}>Change Password</Text>
            <Icon name="chevron-right" size={20} color="#cbd5e1" type="MaterialIcons" />
          </TouchableOpacity>
        </View>

        {/* Sign Out */}
        <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
          <Icon name="logout" size={18} color="#ef4444" type="MaterialIcons" />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        {/* Switch Account */}
        <TouchableOpacity style={styles.switchBtn} onPress={goToSelection}>
          <Icon name="swap-horiz" size={18} color="#006CB5" type="MaterialIcons" />
          <Text style={styles.switchBtnText}>Switch Account</Text>
        </TouchableOpacity>

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Change Password Modal */}
      <Modal visible={showPasswordModal} transparent animationType="slide" onRequestClose={() => setShowPasswordModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Change Password</Text>
              <TouchableOpacity onPress={() => setShowPasswordModal(false)}>
                <Icon name="close" size={22} color="#64748b" type="MaterialIcons" />
              </TouchableOpacity>
            </View>
            {[
              { label: 'Current Password', key: 'currentPassword', show: showCurrentPassword, toggle: () => setShowCurrentPassword(v => !v) },
              { label: 'New Password', key: 'newPassword', show: showNewPassword, toggle: () => setShowNewPassword(v => !v) },
              { label: 'Confirm Password', key: 'confirmPassword', show: showConfirmPassword, toggle: () => setShowConfirmPassword(v => !v) },
            ].map(({ label, key, show, toggle }) => (
              <View key={key} style={styles.pwField}>
                <Text style={styles.pwLabel}>{label}</Text>
                <View style={styles.pwInputRow}>
                  <TextInput
                    style={styles.pwInput}
                    value={passwordData[key]}
                    onChangeText={v => setPasswordData(p => ({ ...p, [key]: v }))}
                    secureTextEntry={!show}
                    placeholder={`Enter ${label.toLowerCase()}`}
                    placeholderTextColor="#94a3b8"
                  />
                  <TouchableOpacity onPress={toggle} style={styles.eyeBtn}>
                    <Icon name={show ? 'visibility-off' : 'visibility'} size={18} color="#94a3b8" type="MaterialIcons" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
            <View style={styles.modalBtns}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowPasswordModal(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.submitBtn} onPress={handlePasswordSubmit} disabled={passwordLoading}>
                {passwordLoading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.submitBtnText}>Save</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Reusable sub-components
const safeVal = (v) => {
  if (v === null || v === undefined) return 'N/A';
  if (typeof v === 'object') {
    return Object.values(v).filter(Boolean).join(' · ') || 'N/A';
  }
  return String(v) || 'N/A';
};

const InfoCard = ({ title, icon, children }) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <Icon name={icon} size={18} color="#006CB5" type="MaterialIcons" />
      <Text style={styles.cardTitle}>{title}</Text>
    </View>
    <View style={styles.divider} />
    {children}
  </View>
);

const Row2 = ({ left, right }) => (
  <View style={styles.row2}>
    <View style={styles.row2Cell}>
      <Text style={styles.fieldLabel}>{left.label}</Text>
      <Text style={styles.fieldValue}>{safeVal(left.value)}</Text>
    </View>
    <View style={styles.row2Cell}>
      <Text style={styles.fieldLabel}>{right.label}</Text>
      <Text style={styles.fieldValue}>{safeVal(right.value)}</Text>
    </View>
  </View>
);

const RowFull = ({ label, value }) => (
  <View style={styles.rowFull}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <Text style={styles.fieldValue}>{safeVal(value)}</Text>
  </View>
);

// Belt exam definitions
const BELT_EXAMS = [
  { key: 'examWhiteBelt',        label: 'White Belt',          color: '#f8fafc', border: '#cbd5e1', text: '#334155' },
  { key: 'examWhiteYellowStripe',label: 'White-Yellow Stripe', color: '#fefce8', border: '#fde047', text: '#713f12' },
  { key: 'examYellowBelt',       label: 'Yellow Belt',         color: '#fefce8', border: '#facc15', text: '#713f12' },
  { key: 'examYellowStripe',     label: 'Yellow-Green Stripe', color: '#f0fdf4', border: '#86efac', text: '#14532d' },
  { key: 'examGreenBelt',        label: 'Green Belt',          color: '#f0fdf4', border: '#22c55e', text: '#14532d' },
  { key: 'examGreenStripe',      label: 'Green-Blue Stripe',   color: '#eff6ff', border: '#93c5fd', text: '#1e3a8a' },
  { key: 'examBlueBelt',         label: 'Blue Belt',           color: '#eff6ff', border: '#3b82f6', text: '#1e3a8a' },
  { key: 'examBlueStripe',       label: 'Blue-Red Stripe',     color: '#fff1f2', border: '#fca5a5', text: '#7f1d1d' },
  { key: 'examRedBelt',          label: 'Red Belt',            color: '#fff1f2', border: '#ef4444', text: '#7f1d1d' },
  { key: 'examRedStripe',        label: 'Red-Black Stripe',    color: '#fafafa', border: '#a1a1aa', text: '#18181b' },
  { key: 'examBlackStripe',      label: 'Black Stripe',        color: '#fafafa', border: '#52525b', text: '#18181b' },
  { key: 'examBlackBelt',        label: 'Black Belt (1st Dan)',color: '#18181b', border: '#000',    text: '#fff'    },
  { key: 'examBlack2Dan',        label: '2nd Dan',             color: '#18181b', border: '#000',    text: '#fff'    },
  { key: 'examBlack3Dan',        label: '3rd Dan',             color: '#18181b', border: '#000',    text: '#fff'    },
  { key: 'examBlack4Dan',        label: '4th Dan',             color: '#18181b', border: '#000',    text: '#fff'    },
  { key: 'examBlack5Dan',        label: '5th Dan',             color: '#18181b', border: '#000',    text: '#fff'    },
  { key: 'examBlack6Dan',        label: '6th Dan',             color: '#18181b', border: '#000',    text: '#fff'    },
  { key: 'examBlack7Dan',        label: '7th Dan',             color: '#18181b', border: '#000',    text: '#fff'    },
  { key: 'examBlack8Dan',        label: '8th Dan',             color: '#18181b', border: '#000',    text: '#fff'    },
  { key: 'examBlack9Dan',        label: '9th Dan',             color: '#18181b', border: '#000',    text: '#fff'    },
];

const ExamCertSection = ({ student: s, onDownload, formatDate }) => {
  const entries = BELT_EXAMS.filter(b => s?.[b.key]);
  return (
    <InfoCard title="Exam Dates & Certificates" icon="military-tech">
      {entries.length === 0 ? (
        <View style={styles.emptyAch}>
          <Text style={styles.emptyAchText}>No exam records yet</Text>
        </View>
      ) : entries.map(({ key, label, color, border, text }) => {
        const certCode = s[`${key}CertCode`];
        const certFile = s[`${key}CertFile`];
        return (
          <View key={key} style={[styles.examRow, { backgroundColor: color, borderColor: border }]}>
            <View style={styles.examLeft}>
              <Text style={[styles.examLabel, { color: text }]}>{label}</Text>
              <Text style={[styles.examDate, { color: text, opacity: 0.7 }]}>{formatDate(s[key])}</Text>
              {certCode ? <Text style={[styles.examCode, { color: text, opacity: 0.6 }]}>#{certCode}</Text> : null}
            </View>
            {certFile ? (
              <TouchableOpacity style={styles.examDlBtn} onPress={() => onDownload(certFile, certCode, label)}>
                <Icon name="file-download" size={14} color="#fff" type="MaterialIcons" />
                <Text style={styles.examDlText}>Download</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.examNoCert}>
                <Text style={[styles.examNoCertText, { color: text, opacity: 0.5 }]}>No cert</Text>
              </View>
            )}
          </View>
        );
      })}
    </InfoCard>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f5f9' },
  header: {
    backgroundColor: '#006CB5', paddingTop: 48, paddingBottom: 18,
    paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center',
    borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
  },
  backBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', alignItems: 'center',
  },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: '800', color: '#fff' },
  scroll: { paddingHorizontal: 16, paddingTop: 16 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  loadingText: { fontSize: 15, color: '#64748b', marginTop: 8 },
  retryBtn: { backgroundColor: '#006CB5', paddingHorizontal: 24, paddingVertical: 10, borderRadius: 10 },
  retryText: { color: '#fff', fontWeight: '700' },

  // Hero Card
  heroCard: {
    backgroundColor: '#fff', borderRadius: 20, padding: 24,
    alignItems: 'center', marginBottom: 14,
    shadowColor: '#006CB5', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1, shadowRadius: 12, elevation: 5,
  },
  avatarWrap: { position: 'relative', marginBottom: 12 },
  avatar: { width: 90, height: 90, borderRadius: 45, borderWidth: 3, borderColor: '#006CB5' },
  avatarPlaceholder: { backgroundColor: '#eff6ff', justifyContent: 'center', alignItems: 'center' },
  beltBadge: {
    position: 'absolute', bottom: 0, right: 0,
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: '#e2e8f0',
  },
  beltBadgeText: { fontSize: 14 },
  heroName: { fontSize: 22, fontWeight: '800', color: '#1e293b', marginBottom: 8 },
  heroBeltRow: { marginBottom: 16 },
  beltPill: {
    backgroundColor: '#eff6ff', borderRadius: 20,
    paddingHorizontal: 16, paddingVertical: 5,
    borderWidth: 1, borderColor: '#bfdbfe',
  },
  beltPillText: { fontSize: 13, fontWeight: '700', color: '#006CB5' },
  heroMeta: {
    flexDirection: 'row', width: '100%',
    backgroundColor: '#f8fafc', borderRadius: 14, padding: 14,
  },
  heroMetaItem: { flex: 1, alignItems: 'center' },
  heroMetaLabel: { fontSize: 11, color: '#94a3b8', fontWeight: '600', marginBottom: 3 },
  heroMetaValue: { fontSize: 13, fontWeight: '800', color: '#1e293b' },
  heroMetaDivider: { width: 1, backgroundColor: '#e2e8f0', marginHorizontal: 4 },

  // Info Card
  card: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16,
    marginBottom: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  cardTitle: { fontSize: 15, fontWeight: '800', color: '#1e293b' },
  divider: { height: 1, backgroundColor: '#f1f5f9', marginBottom: 12 },

  // Fields
  row2: { flexDirection: 'row', marginBottom: 12 },
  row2Cell: { flex: 1 },
  rowFull: { marginBottom: 12 },
  fieldLabel: { fontSize: 11, color: '#94a3b8', fontWeight: '600', marginBottom: 3, textTransform: 'uppercase', letterSpacing: 0.4 },
  fieldValue: { fontSize: 14, color: '#1e293b', fontWeight: '600' },

  // Achievements
  achCard: {
    backgroundColor: '#f8fafc', borderRadius: 12, padding: 12,
    marginBottom: 10, borderWidth: 1, borderColor: '#e2e8f0',
  },
  achHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  achTitle: { fontSize: 14, fontWeight: '700', color: '#1e293b', flex: 1 },
  achSub: { fontSize: 12, color: '#64748b', marginBottom: 4 },
  eventRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#fff', borderRadius: 8, padding: 10, marginTop: 6,
    borderWidth: 1, borderColor: '#e2e8f0',
  },
  eventRowLeft: { flex: 1, gap: 4 },
  eventType: { fontSize: 13, fontWeight: '700', color: '#334155' },
  medalBadge: {
    alignSelf: 'flex-start', borderRadius: 6,
    paddingHorizontal: 8, paddingVertical: 3,
    backgroundColor: '#f1f5f9',
  },
  gold: { backgroundColor: '#fef9c3' },
  silver: { backgroundColor: '#f1f5f9' },
  bronze: { backgroundColor: '#fef3c7' },
  medalText: { fontSize: 12, fontWeight: '700', color: '#334155' },
  certCode: { fontSize: 11, color: '#94a3b8' },
  dlBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#006CB5', borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 6,
  },
  dlBtnText: { fontSize: 12, color: '#fff', fontWeight: '700' },
  noCert: { fontSize: 11, color: '#94a3b8', fontStyle: 'italic' },
  emptyAch: { alignItems: 'center', paddingVertical: 16 },
  emptyAchText: { fontSize: 14, color: '#94a3b8' },

  // Exam rows
  examRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderRadius: 10, borderWidth: 1.5, padding: 10, marginBottom: 8,
  },
  examLeft: { flex: 1, gap: 2 },
  examLabel: { fontSize: 13, fontWeight: '700' },
  examDate: { fontSize: 12, fontWeight: '500' },
  examCode: { fontSize: 11 },
  examDlBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#006CB5', borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 6, marginLeft: 8,
  },
  examDlText: { fontSize: 12, color: '#fff', fontWeight: '700' },
  examNoCert: { marginLeft: 8 },
  examNoCertText: { fontSize: 11, fontStyle: 'italic' },

  // Settings
  settingRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 4,
  },
  settingIconWrap: {
    width: 38, height: 38, borderRadius: 10,
    backgroundColor: '#eff6ff', justifyContent: 'center', alignItems: 'center',
  },
  settingLabel: { flex: 1, fontSize: 15, fontWeight: '600', color: '#1e293b' },

  // Sign Out
  signOutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: '#fff', borderRadius: 14, padding: 14, marginBottom: 8,
    borderWidth: 1.5, borderColor: '#fecaca',
  },
  signOutText: { fontSize: 15, fontWeight: '700', color: '#ef4444' },

  switchBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: '#fff', borderRadius: 14, padding: 14, marginBottom: 8,
    borderWidth: 1.5, borderColor: '#bfdbfe',
  },
  switchBtnText: { fontSize: 15, fontWeight: '700', color: '#006CB5' },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalBox: {
    backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24, paddingBottom: 36,
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 18, fontWeight: '800', color: '#1e293b' },
  pwField: { marginBottom: 14 },
  pwLabel: { fontSize: 12, fontWeight: '600', color: '#64748b', marginBottom: 6 },
  pwInputRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#f8fafc', borderRadius: 12,
    borderWidth: 1, borderColor: '#e2e8f0', paddingHorizontal: 14,
  },
  pwInput: { flex: 1, height: 46, fontSize: 15, color: '#1e293b' },
  eyeBtn: { padding: 6 },
  modalBtns: { flexDirection: 'row', gap: 12, marginTop: 8 },
  cancelBtn: {
    flex: 1, height: 46, borderRadius: 12, borderWidth: 1.5,
    borderColor: '#e2e8f0', justifyContent: 'center', alignItems: 'center',
  },
  cancelBtnText: { fontSize: 15, fontWeight: '700', color: '#64748b' },
  submitBtn: {
    flex: 1, height: 46, borderRadius: 12,
    backgroundColor: '#006CB5', justifyContent: 'center', alignItems: 'center',
  },
  submitBtnText: { fontSize: 15, fontWeight: '700', color: '#fff' },
});

export default ProfileScreen;
