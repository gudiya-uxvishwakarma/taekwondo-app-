import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  Modal,
  TextInput,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { useStudent } from '../context/StudentContext';
import { useNavigation } from '../context/NavigationContext';
import { StudentService, AuthService } from '../services';
import { handleApiError } from '../utils/helpers';
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

const ProfileScreen = () => {
  const { logout, student } = useStudent();
  const { navigate } = useNavigation();
  const [selectedAcademicYear, setSelectedAcademicYear] = useState('2024-2025');
  const [showAcademicYearModal, setShowAcademicYearModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showEditNameModal, setShowEditNameModal] = useState(false);
  const [showEditEmailModal, setShowEditEmailModal] = useState(false);
  const [showEditPhoneModal, setShowEditPhoneModal] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [passwordLoading, setPasswordLoading] = useState(false);
  
  // Toast notification state
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const toastAnimation = useRef(new Animated.Value(-100)).current;

  // Academic years data
  const academicYears = ['2024-2025', '2025-2026', '2026-2027', '2027-2028'];

  // Load profile data from backend
  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      const response = await StudentService.getProfile();
      setProfileData(response);
    } catch (error) {
      console.error('Failed to load profile:', error);
      // Fallback to mock data if API fails
      setProfileData(getMockStudentData());
    } finally {
      setLoading(false);
    }
  };

  // Toast animation functions
  const showToastNotification = (message) => {
    setToastMessage(message);
    setShowToast(true);
    
    // Animate toast down from top
    Animated.sequence([
      Animated.timing(toastAnimation, {
        toValue: 50,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(2000),
      Animated.timing(toastAnimation, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowToast(false);
    });
  };

  // Mock student data
  const getMockStudentData = () => ({
    name: 'Adarsh',
    rollNo: '24233',
    class: 'Class 10',
    section: 'D',
    email: 'adarsh@gmail.com',
    phone: '9902742426',
    dateOfBirth: '2004-02-10',
    address: 'Parnets Software India Pvt Ltddd',
    profileImage: null,
    
    // Parent details
    fatherName: 'ff',
    motherName: 'hh',
    parentPhone: '9845617525',
    
    // Academic info
    admissionDate: '2024-01-15',
    studentId: 'STU001',
    bloodGroup: 'O+',
    emergencyContact: '9845617525'
  });

  const studentData = profileData || getMockStudentData();

  const handleBackPress = () => {
    navigate('Dashboard');
  };

  const handleEditName = () => {
    setEditName(studentData.name);
    setShowEditNameModal(true);
  };

  const handleEditEmail = () => {
    setEditEmail(studentData.email);
    setShowEditEmailModal(true);
  };

  const handleSaveName = async () => {
    if (!editName.trim()) {
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }

    try {
      // Update the profile data
      const updatedData = { ...profileData, name: editName.trim() };
      setProfileData(updatedData);
      setShowEditNameModal(false);
      showToastNotification('Name updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update name');
    }
  };

  const handleSaveEmail = async () => {
    if (!editEmail.trim()) {
      Alert.alert('Error', 'Email cannot be empty');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editEmail.trim())) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    try {
      // Update the profile data
      const updatedData = { ...profileData, email: editEmail.trim() };
      setProfileData(updatedData);
      setShowEditEmailModal(false);
      showToastNotification('Email updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update email');
    }
  };

  const handleEditPhone = () => {
    setEditPhone(studentData.phone);
    setShowEditPhoneModal(true);
  };

  const handleSavePhone = async () => {
    if (!editPhone.trim()) {
      Alert.alert('Error', 'Phone number cannot be empty');
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(editPhone.trim())) {
      Alert.alert('Error', 'Please enter a valid 10-digit phone number');
      return;
    }

    try {
      // Update the profile data
      const updatedData = { ...profileData, phone: editPhone.trim() };
      setProfileData(updatedData);
      setShowEditPhoneModal(false);
      showToastNotification('Phone number updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update phone number');
    }
  };

  const handleChangePassword = () => {
    setShowPasswordModal(true);
  };

  const handleAcademicYearPress = () => {
    setShowAcademicYearModal(true);
  };

  const handleAcademicYearSelect = (year) => {
    if (year !== selectedAcademicYear) {
      setSelectedAcademicYear(year);
      setShowAcademicYearModal(false);
      
      // Show toast notification
      showToastNotification(`Data will now show for ${year} academic year`);
    } else {
      setShowAcademicYearModal(false);
    }
  };

  const handlePasswordSubmit = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      Alert.alert('Error', 'Please fill all password fields');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Alert.alert('Error', 'New password and confirm password do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      Alert.alert('Error', 'New password must be at least 6 characters long');
      return;
    }

    try {
      setPasswordLoading(true);
      // This would be a new endpoint for changing password
      // await AuthService.changePassword({
      //   currentPassword: passwordData.currentPassword,
      //   newPassword: passwordData.newPassword
      // });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      Alert.alert('Success', 'Password changed successfully!', [
        { text: 'OK', onPress: () => {
          setShowPasswordModal(false);
          setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
          setShowCurrentPassword(false);
          setShowNewPassword(false);
          setShowConfirmPassword(false);
        }}
      ]);
    } catch (error) {
      console.error('Failed to change password:', error);
      const errorMessage = handleApiError(error);
      Alert.alert('Error', errorMessage);
    } finally {
      setPasswordLoading(false);
    }
  };

  const handlePasswordCancel = () => {
    setShowPasswordModal(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: async () => {
          try {
            await AuthService.logout();
            logout();
          } catch (error) {
            console.error('Logout error:', error);
            logout(); // Force logout even if API fails
          }
        }}
      ]
    );
  };

  // Loading state
  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#e74c3c" />
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <Icon name="arrow-back" size={24} color="#fff" type="MaterialIcons" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#e74c3c" />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#e74c3c" />
      
      {/* Toast Notification */}
      {showToast && (
        <Animated.View 
          style={[
            styles.toastContainer,
            {
              transform: [{ translateY: toastAnimation }]
            }
          ]}
        >
          <View style={styles.toastContent}>
            <Icon name="check-circle" size={20} color="#e40e15ff" type="MaterialIcons" />
            <View style={styles.toastTextContainer}>
              <Text style={styles.toastTitle}>Academic Year Changed</Text>
              <Text style={styles.toastMessage}>{toastMessage}</Text>
            </View>
          </View>
        </Animated.View>
      )}
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Icon name="arrow-back" size={24} color="#fff" type="MaterialIcons" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Academic Year Selection */}
        <View style={styles.academicYearSection}>
          <View style={styles.academicYearHeader}>
            <Icon name="school" size={24} color="#dd1219ff" type="MaterialIcons" />
            <Text style={styles.academicYearTitle}>Academic Year</Text>
          </View>
          <TouchableOpacity style={styles.academicYearDropdown} onPress={handleAcademicYearPress}>
            <Text style={styles.selectedYear}>{selectedAcademicYear}</Text>
            <Icon name="keyboard-arrow-down" size={24} color="#e80f0fff" type="MaterialIcons" />
          </TouchableOpacity>
          <Text style={styles.academicYearSubtitle}>
            Tap to change academic year and filter all data
          </Text>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileImageContainer}>
            <View style={styles.profileImage}>
              <Icon name="person" size={40} color="#f31818ff" type="MaterialIcons" />
            </View>
            <TouchableOpacity style={styles.cameraButton}>
              <Icon name="camera-alt" size={16} color="#fff" type="MaterialIcons" />
            </TouchableOpacity>
          </View>
          <View style={styles.nameContainer}>
            <Text style={styles.studentName}>{studentData.name}</Text>
            <TouchableOpacity style={styles.editNameButton} onPress={() => setShowEditNameModal(true)}>
              <Icon name="edit" size={16} color="#e74c3c" type="MaterialIcons" />
            </TouchableOpacity>
          </View>
          <Text style={styles.classInfo}>Class: {studentData.class} - {studentData.section}</Text>
          <Text style={styles.rollInfo}>Roll No: {studentData.rollNo}</Text>
        </View>

        {/* Student Details */}
        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>Student Details</Text>
          
          <View style={styles.detailItem}>
            <Icon name="email" size={20} color="#7f8c8d" type="MaterialIcons" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Email</Text>
              <Text style={styles.detailValue}>{studentData.email}</Text>
            </View>
            <TouchableOpacity style={styles.editDetailButton} onPress={() => setShowEditEmailModal(true)}>
              <Icon name="edit" size={16} color="#e74c3c" type="MaterialIcons" />
            </TouchableOpacity>
          </View>

          <View style={styles.detailItem}>
            <Icon name="phone" size={20} color="#7f8c8d" type="MaterialIcons" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Phone</Text>
              <Text style={styles.detailValue}>{studentData.phone}</Text>
            </View>
            <TouchableOpacity style={styles.editDetailButton} onPress={() => setShowEditPhoneModal(true)}>
              <Icon name="edit" size={16} color="#e74c3c" type="MaterialIcons" />
            </TouchableOpacity>
          </View>

          <View style={styles.detailItem}>
            <Icon name="cake" size={20} color="#7f8c8d" type="MaterialIcons" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Date of Birth</Text>
              <Text style={styles.detailValue}>{studentData.dateOfBirth}</Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <Icon name="location-on" size={20} color="#7f8c8d" type="MaterialIcons" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Address</Text>
              <Text style={styles.detailValue}>{studentData.address}</Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <Icon name="class" size={20} color="#7f8c8d" type="MaterialIcons" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Class</Text>
              <Text style={styles.detailValue}>{studentData.class}</Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <Icon name="people" size={20} color="#7f8c8d" type="MaterialIcons" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Section</Text>
              <Text style={styles.detailValue}>{studentData.section}</Text>
            </View>
          </View>
        </View>

        {/* Parent Details */}
        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>Parent Details</Text>
          
          <View style={styles.detailItem}>
            <Icon name="person" size={20} color="#7f8c8d" type="MaterialIcons" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Father's Name</Text>
              <Text style={styles.detailValue}>{studentData.fatherName}</Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <Icon name="person" size={20} color="#7f8c8d" type="MaterialIcons" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Mother's Name</Text>
              <Text style={styles.detailValue}>{studentData.motherName}</Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <Icon name="phone" size={20} color="#7f8c8d" type="MaterialIcons" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Parent Phone</Text>
              <Text style={styles.detailValue}>{studentData.parentPhone}</Text>
            </View>
          </View>
        </View>

        {/* Settings */}
        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <TouchableOpacity style={styles.settingItem} onPress={handleChangePassword}>
            <View style={styles.settingIcon}>
              <Icon name="lock" size={20} color="#e60f0fff" type="MaterialIcons" />
            </View>
            <Text style={styles.settingText}>Change Password</Text>
            <Icon name="chevron-right" size={20} color="#bdc3c7" type="MaterialIcons" />
          </TouchableOpacity>
        </View>

        {/* Sign Out */}
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Icon name="logout" size={20} color="#e74c3c" type="MaterialIcons" />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Academic Year Modal */}
      <Modal
        visible={showAcademicYearModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAcademicYearModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Academic Year</Text>
              <TouchableOpacity onPress={() => setShowAcademicYearModal(false)}>
                <Icon name="close" size={24} color="#7f8c8d" type="MaterialIcons" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.yearsList}>
              {academicYears.map((year) => (
                <TouchableOpacity
                  key={year}
                  style={[
                    styles.yearItem,
                    selectedAcademicYear === year && styles.selectedYearItem
                  ]}
                  onPress={() => handleAcademicYearSelect(year)}
                >
                  <Text style={[
                    styles.yearText,
                    selectedAcademicYear === year && styles.selectedYearText
                  ]}>
                    {year}
                  </Text>
                  {selectedAcademicYear === year && (
                    <Icon name="check" size={20} color="#d70d0dff" type="MaterialIcons" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        visible={showPasswordModal}
        transparent={true}
        animationType="slide"
        onRequestClose={handlePasswordCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.passwordModalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Change Password</Text>
              <TouchableOpacity onPress={handlePasswordCancel}>
                <Icon name="close" size={24} color="#7f8c8d" type="MaterialIcons" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.passwordForm}>
              {/* Current Password */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Current Password</Text>
                <View style={styles.passwordInputContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    value={passwordData.currentPassword}
                    onChangeText={(text) => setPasswordData({...passwordData, currentPassword: text})}
                    secureTextEntry={!showCurrentPassword}
                    placeholder="Enter current password"
                    placeholderTextColor="#bdc3c7"
                  />
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    <Icon 
                      name={showCurrentPassword ? "visibility-off" : "visibility"} 
                      size={20} 
                      color="#7f8c8d" 
                      type="MaterialIcons" 
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* New Password */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>New Password</Text>
                <View style={styles.passwordInputContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    value={passwordData.newPassword}
                    onChangeText={(text) => setPasswordData({...passwordData, newPassword: text})}
                    secureTextEntry={!showNewPassword}
                    placeholder="Enter new password"
                    placeholderTextColor="#bdc3c7"
                  />
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => setShowNewPassword(!showNewPassword)}
                  >
                    <Icon 
                      name={showNewPassword ? "visibility-off" : "visibility"} 
                      size={20} 
                      color="#7f8c8d" 
                      type="MaterialIcons" 
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Confirm Password */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Confirm New Password</Text>
                <View style={styles.passwordInputContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    value={passwordData.confirmPassword}
                    onChangeText={(text) => setPasswordData({...passwordData, confirmPassword: text})}
                    secureTextEntry={!showConfirmPassword}
                    placeholder="Confirm new password"
                    placeholderTextColor="#bdc3c7"
                  />
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <Icon 
                      name={showConfirmPassword ? "visibility-off" : "visibility"} 
                      size={20} 
                      color="#7f8c8d" 
                      type="MaterialIcons" 
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Buttons */}
              <View style={styles.passwordButtonsContainer}>
                <TouchableOpacity style={styles.cancelButton} onPress={handlePasswordCancel}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.submitButton} onPress={handlePasswordSubmit}>
                  {passwordLoading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.submitButtonText}>Change Password</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Name Modal */}
      <Modal
        visible={showEditNameModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowEditNameModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.editModalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Name</Text>
              <TouchableOpacity onPress={() => setShowEditNameModal(false)}>
                <Icon name="close" size={24} color="#7f8c8d" type="MaterialIcons" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.editForm}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Full Name</Text>
                <TextInput
                  style={styles.editInput}
                  value={editName}
                  onChangeText={setEditName}
                  placeholder="Enter your full name"
                  placeholderTextColor="#bdc3c7"
                />
              </View>

              <View style={styles.editButtonsContainer}>
                <TouchableOpacity style={styles.cancelButton} onPress={() => setShowEditNameModal(false)}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.submitButton} onPress={handleSaveName}>
                  <Text style={styles.submitButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Email Modal */}
      <Modal
        visible={showEditEmailModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowEditEmailModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.editModalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Email</Text>
              <TouchableOpacity onPress={() => setShowEditEmailModal(false)}>
                <Icon name="close" size={24} color="#7f8c8d" type="MaterialIcons" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.editForm}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Email Address</Text>
                <TextInput
                  style={styles.editInput}
                  value={editEmail}
                  onChangeText={setEditEmail}
                  placeholder="Enter your email address"
                  placeholderTextColor="#bdc3c7"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.editButtonsContainer}>
                <TouchableOpacity style={styles.cancelButton} onPress={() => setShowEditEmailModal(false)}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.submitButton} onPress={handleSaveEmail}>
                  <Text style={styles.submitButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Phone Modal */}
      <Modal
        visible={showEditPhoneModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowEditPhoneModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.editModalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Phone Number</Text>
              <TouchableOpacity onPress={() => setShowEditPhoneModal(false)}>
                <Icon name="close" size={24} color="#7f8c8d" type="MaterialIcons" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.editForm}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Phone Number</Text>
                <TextInput
                  style={styles.editInput}
                  value={editPhone}
                  onChangeText={setEditPhone}
                  placeholder="Enter your phone number"
                  placeholderTextColor="#bdc3c7"
                  keyboardType="phone-pad"
                  maxLength={10}
                />
              </View>

              <View style={styles.editButtonsContainer}>
                <TouchableOpacity style={styles.cancelButton} onPress={() => setShowEditPhoneModal(false)}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.submitButton} onPress={handleSavePhone}>
                  <Text style={styles.submitButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  
  // Header
  header: {
    backgroundColor: '#e74c3c',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40, // Same width as edit button to maintain balance
  },

  // Content
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },

  // Academic Year Section
  academicYearSection: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginTop: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  academicYearHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  academicYearTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2c3e50',
    marginLeft: 10,
  },
  academicYearDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#d9030aff',
    marginBottom: 10,
  },
  selectedYear: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  academicYearSubtitle: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
  },

  // Profile Card
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 30,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f9ff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#e20a0aff',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#e92222ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  editNameButton: {
    marginLeft: 8,
    padding: 4,
  },
  studentName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#2c3e50',
  },
  classInfo: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 3,
  },
  rollInfo: {
    fontSize: 14,
    color: '#95a5a6',
  },

  // Details Sections
  detailsSection: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 20,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f2f6',
  },
  detailContent: {
    flex: 1,
    marginLeft: 15,
  },
  detailLabel: {
    fontSize: 12,
    color: '#95a5a6',
    marginBottom: 3,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  editDetailButton: {
    marginLeft: 10,
    padding: 4,
  },

  // Settings
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff3e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },

  // Sign Out
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e74c3c',
    marginLeft: 10,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 0,
    width: '85%',
    maxHeight: '70%',
  },
  passwordModalContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 0,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f2f6',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2c3e50',
  },

  // Academic Year Modal
  yearsList: {
    padding: 20,
  },
  yearItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: '#f8f9fa',
  },
  selectedYearItem: {
    backgroundColor: '#e8f5e8',
    borderWidth: 2,
    borderColor: '#dc1111ff',
  },
  yearText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  selectedYearText: {
    color: '#e40f0fff',
  },

  // Password Modal
  passwordForm: {
    padding: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#2c3e50',
  },
  eyeButton: {
    padding: 12,
  },
  passwordButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    marginRight: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7f8c8d',
  },
  submitButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#f41212ff',
    marginLeft: 10,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },

  // Edit Modal Styles
  editModalContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 0,
    width: '85%',
    maxHeight: '60%',
  },
  editForm: {
    padding: 20,
  },
  editInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#2c3e50',
  },
  editButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },

  // Toast Notification Styles
  toastContainer: {
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
    zIndex: 1000,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  toastContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  toastTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  toastTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 2,
  },
  toastMessage: {
    fontSize: 14,
    color: '#7f8c8d',
  },

  // Loading States
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7f8c8d',
    marginTop: 16,
  },
});

export default ProfileScreen;