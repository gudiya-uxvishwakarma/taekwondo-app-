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
  Image,
  Platform,
  PermissionsAndroid,
  Linking,
} from 'react-native';
import RNFS from 'react-native-fs';
import { useStudent } from '../context/StudentContext';
import { useNavigation } from '../context/NavigationContext';
import { StudentService, AuthService } from '../services';
import api from '../services/api';
import { handleApiError } from '../utils/helpers';
import Icon from '../components/common/Icon';
import API_CONFIG from '../config/api';

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
      
      // Try the profile endpoint first
      try {
        const response = await StudentService.getProfile();
        console.log('📊 Profile data loaded:', response);
        console.log('📊 Achievements:', response.achievements);
        setProfileData(response);
        return;
      } catch (profileError) {
        console.log('⚠️ Profile endpoint failed:', profileError.message);
        
        // Fallback 1: Try to get student data from public endpoint by email
        if (student && student.email) {
          console.log('🔄 Trying public students endpoint...');
          try {
            const publicResponse = await api.get('/students/public');
            if (publicResponse.status === 'success' && publicResponse.data?.students) {
              // Find the current student by email
              const currentStudent = publicResponse.data.students.find(
                s => s.email?.toLowerCase() === student.email.toLowerCase()
              );
              
              if (currentStudent) {
                console.log('✅ Found student in public endpoint');
                // Merge with context data to get complete profile
                const completeProfile = {
                  ...currentStudent,
                  name: currentStudent.fullName || currentStudent.name,
                  email: student.email,
                  phone: student.phone || currentStudent.phone,
                  role: 'student',
                };
                setProfileData(completeProfile);
                return;
              }
            }
          } catch (publicError) {
            console.log('⚠️ Public endpoint also failed:', publicError.message);
          }
          
          // Fallback 2: Use student data from context
          console.log('🔄 Using student data from context');
          setProfileData({
            ...student,
            fullName: student.name,
            achievements: [],
          });
          return;
        }
        
        throw profileError;
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
      Alert.alert(
        'Profile Load Error', 
        'Unable to load your profile. The server may be updating. Please try again or contact support.',
        [
          { text: 'Retry', onPress: loadProfileData },
          { text: 'OK' }
        ]
      );
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
    // Basic Info
    name: 'Adarsh',
    fullName: 'Adarsh Kumar',
    rollNo: '24233',
    admissionNumber: '123456',
    idNumber: '123456',
    class: 'Class 10',
    section: 'D',
    email: 'adarsh@gmail.com',
    phone: '9902742426',
    dateOfBirth: '2004-02-10',
    age: 20,
    gender: 'Male',
    address: 'Parnets Software India Pvt Ltd',
    bloodGroup: 'O+',
    profileImage: null,
    
    // Parent details
    fatherName: 'Father Name',
    motherName: 'Mother Name',
    fatherPhone: '9845617525',
    motherPhone: '9845617526',
    fatherOccupation: 'Business',
    motherOccupation: 'Teacher',
    parentPhone: '9845617525',
    
    // Academic/Training info
    admissionDate: '2024-01-15',
    joiningDate: '2024-01-15',
    studentId: 'STU001',
    emergencyContact: '9845617525',
    schoolCollegeName: 'ABC School',
    qualification: 'Class 10',
    organizationName: 'Combat Warrior Taekwon-Do',
    
    // Training Information
    instructorName: 'Master Instructor',
    classAddress: 'Main Dojo, City Center',
    currentBeltLevel: 'Yellow Belt',
    
    // Achievements
    achievements: []
  });

  const studentData = profileData;

  // Log achievements data for debugging
  useEffect(() => {
    if (studentData) {
      console.log('👤 Student Data:', studentData);
      console.log('📸 Photo path:', studentData.photo);
      console.log('📸 Full photo URL:', studentData.photo ? `${API_CONFIG.BASE_URL.replace('/api', '')}/${studentData.photo}` : 'No photo');
      console.log('🏆 Achievements:', studentData.achievements);
      console.log('🏆 Achievements length:', studentData.achievements?.length);
    }
  }, [studentData]);

  // If no profile data, show loading or error state
  if (!loading && !profileData) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#006CB5" />
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <Icon name="arrow-back" size={24} color="#fff" type="MaterialIcons" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.loadingContainer}>
          <Icon name="error-outline" size={48} color="#006CB5" type="MaterialIcons" />
          <Text style={styles.loadingText}>Unable to load profile</Text>
          <Text style={styles.errorHint}>
            Your profile data couldn't be loaded from the server.{'\n'}
            This may be due to a server update in progress.
          </Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={loadProfileData}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.retryButton, styles.logoutButton]}
            onPress={handleSignOut}
          >
            <Text style={styles.retryButtonText}>Sign Out & Re-login</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

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
      
      // Call the change password API
      await AuthService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
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
      const errorMessage = error.message || 'Failed to change password. Please try again.';
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

  // Request storage permission for Android
  const requestStoragePermission = async () => {
    if (Platform.OS !== 'android') {
      return true;
    }

    try {
      if (Platform.Version >= 33) {
        // Android 13+ doesn't need storage permission for downloads
        return true;
      }

      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'App needs access to your storage to download certificates',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn('Permission error:', err);
      return false;
    }
  };

  const handleDownloadCertificate = async (certificateFile, certificateCode, eventType) => {
    if (!certificateFile) {
      Alert.alert('No Certificate', 'No certificate file available for this event.');
      return;
    }

    try {
      console.log('📥 Downloading certificate:', certificateFile);
      
      // Request storage permission
      const hasPermission = await requestStoragePermission();
      if (!hasPermission) {
        Alert.alert('Permission Denied', 'Storage permission is required to download certificates');
        return;
      }

      // Determine file extension
      const fileExtension = certificateFile.split('.').pop() || 'pdf';
      
      // Create filename
      const fileName = `certificate_${eventType?.replace(/\s+/g, '_')}_${certificateCode}.${fileExtension}`;
      
      // Determine download path based on platform
      let downloadPath;
      if (Platform.OS === 'ios') {
        downloadPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
      } else {
        // For Android, use CachesDirectoryPath first (always works), then try to move to Downloads
        downloadPath = `${RNFS.CachesDirectoryPath}/${fileName}`;
      }

      console.log('📁 Download path:', downloadPath);

      // Show downloading alert
      Alert.alert('Downloading', 'Please wait while we download your certificate...');

      // Try all fallback URLs from API_CONFIG
      let downloadSuccess = false;
      let lastError = null;
      let successUrl = null;

      // Try multiple possible paths for the certificate
      const possiblePaths = [];
      
      if (certificateFile.startsWith('http://') || certificateFile.startsWith('https://')) {
        // Already a full URL (Cloudinary), use it directly
        possiblePaths.push(certificateFile);
      } else if (certificateFile.startsWith('/')) {
        possiblePaths.push(certificateFile);
      } else {
        // Try different possible folder structures
        possiblePaths.push(`/uploads/${certificateFile}`);
        possiblePaths.push(`/${certificateFile}`);
        possiblePaths.push(`/uploads/students/${certificateFile}`);
        possiblePaths.push(`/uploads/certificates/${certificateFile}`);
        possiblePaths.push(`/public/uploads/${certificateFile}`);
      }

      // If we have a full URL, try it directly first
      if (certificateFile.startsWith('http://') || certificateFile.startsWith('https://')) {
        try {
          console.log('🔄 Trying direct Cloudinary URL:', certificateFile);

          const downloadResult = await RNFS.downloadFile({
            fromUrl: certificateFile,
            toFile: downloadPath,
            background: true,
            discretionary: true,
            cacheable: true,
            headers: {
              'Accept': 'image/jpeg,image/png,image/jpg,application/pdf,*/*',
            },
            connectionTimeout: 15000,
            readTimeout: 15000,
            progress: (res) => {
              if (res.contentLength > 0) {
                const progress = (res.bytesWritten / res.contentLength) * 100;
                console.log(`📊 Download progress: ${progress.toFixed(0)}%`);
              }
            },
          }).promise;

          if (downloadResult.statusCode === 200 && downloadResult.bytesWritten > 0) {
            console.log('✅ Certificate downloaded successfully from Cloudinary');
            downloadSuccess = true;
            successUrl = certificateFile;
          }
        } catch (error) {
          console.log('⚠️ Cloudinary direct download failed:', error.message);
          lastError = error;
        }
      }

      // If direct download failed or not a full URL, try with base URLs
      if (!downloadSuccess) {
        // Filter out full URLs from possiblePaths for fallback attempts
        const relativePaths = possiblePaths.filter(p => !p.startsWith('http://') && !p.startsWith('https://'));
        
        for (const baseUrl of [API_CONFIG.BASE_URL, ...API_CONFIG.FALLBACK_URLS]) {
          for (const path of relativePaths) {
            try {
              // Construct URL
              const tryUrl = `${baseUrl.replace('/api', '')}${path}`;
              
              console.log('🔄 Trying URL:', tryUrl);

              // Build headers with authentication if token exists
              const AsyncStorage = require('@react-native-async-storage/async-storage').default;
              const token = await AsyncStorage.getItem('auth_token');
              
              const headers = {
                'Accept': 'image/jpeg,image/png,image/jpg,application/pdf,*/*',
              };
              
              if (token) {
                headers['Authorization'] = `Bearer ${token}`;
              }

              const downloadResult = await RNFS.downloadFile({
                fromUrl: tryUrl,
                toFile: downloadPath,
                background: true,
                discretionary: true,
                cacheable: true,
                headers: headers,
                connectionTimeout: 15000,
                readTimeout: 15000,
                progress: (res) => {
                  if (res.contentLength > 0) {
                    const progress = (res.bytesWritten / res.contentLength) * 100;
                    console.log(`📊 Download progress: ${progress.toFixed(0)}%`);
                  }
                },
              }).promise;

              console.log('✅ Download result:', downloadResult);

              if (downloadResult.statusCode === 200 && downloadResult.bytesWritten > 0) {
                console.log('✅ Certificate downloaded successfully from:', tryUrl);
                downloadSuccess = true;
                successUrl = tryUrl;
                break;
              } else if (downloadResult.statusCode === 404) {
                console.log('⚠️ File not found at:', tryUrl);
                lastError = new Error('Certificate file not found on server');
              } else {
                console.log('⚠️ Download failed with status:', downloadResult.statusCode);
                lastError = new Error(`Download failed with status code: ${downloadResult.statusCode}`);
              }
            } catch (urlError) {
              console.log('⚠️ Failed to download from:', baseUrl.replace('/api', ''), urlError.message);
              lastError = urlError;
            }
          }
          
          if (downloadSuccess) break;
        }
      }

      if (!downloadSuccess) {
        throw lastError || new Error('Certificate file not found on server');
      }

      // For Android, try to move to Downloads folder
      if (Platform.OS === 'android') {
        try {
          const downloadsPath = `${RNFS.DownloadDirectoryPath}/${fileName}`;
          await RNFS.moveFile(downloadPath, downloadsPath);
          downloadPath = downloadsPath;
          console.log('✅ Moved to Downloads folder:', downloadsPath);
        } catch (moveError) {
          console.log('⚠️ Could not move to Downloads, file saved in app cache:', moveError.message);
        }
      }

      Alert.alert(
        'Download Complete',
        `Certificate has been saved successfully.\n\nFile: ${fileName}`,
        [
          { 
            text: 'Open', 
            onPress: () => {
              // Try to open the file
              Linking.openURL(`file://${downloadPath}`).catch(err => {
                console.log('Cannot open file:', err);
                Alert.alert('Info', 'File downloaded but cannot be opened automatically. Please check your Downloads folder.');
              });
            }
          },
          { text: 'OK' }
        ]
      );

    } catch (error) {
      console.error('❌ Error downloading certificate:', error);
      Alert.alert(
        'Download Failed',
        error.message === 'Certificate file not found on server' 
          ? 'This certificate file is not available on the server. Please contact your administrator.'
          : 'Unable to download certificate. Please check your internet connection and try again.'
      );
    }
  };

  // Loading state
  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#006CB5" />
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <Icon name="arrow-back" size={24} color="#fff" type="MaterialIcons" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#006CB5" />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#006CB5" />
      
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
            <Icon name="check-circle" size={20} color="#006CB5" type="MaterialIcons" />
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
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileImageContainer}>
            {studentData.photo ? (
              <Image 
                source={{ 
                  uri: studentData.photo.startsWith('http') 
                    ? studentData.photo 
                    : `${API_CONFIG.BASE_URL.replace('/api', '')}/${studentData.photo}` 
                }}
                style={styles.profileImagePhoto}
                resizeMode="cover"
                onError={(error) => {
                  if (__DEV__) {
                    console.log('❌ Image load error:', error.nativeEvent.error);
                    console.log('📸 Photo value:', studentData.photo);
                    console.log('📸 Attempted URL:', studentData.photo.startsWith('http') 
                      ? studentData.photo 
                      : `${API_CONFIG.BASE_URL.replace('/api', '')}/${studentData.photo}`);
                  }
                  // Hide the image on error by setting photo to null
                  setProfileData(prev => ({ ...prev, photo: null }));
                }}
                onLoad={() => {
                  if (__DEV__) {
                    console.log('✅ Image loaded successfully');
                    console.log('📸 Loaded from:', studentData.photo.startsWith('http') 
                      ? studentData.photo 
                      : `${API_CONFIG.BASE_URL.replace('/api', '')}/${studentData.photo}`);
                  }
                }}
              />
            ) : (
              <View style={styles.profileImage}>
                <Icon name="person" size={40} color="#006CB5" type="MaterialIcons" />
              </View>
            )}
          </View>
          <Text style={styles.studentName}>{studentData.name}</Text>
        </View>

        {/* Student Details */}
        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <View style={styles.detailItem}>
            <Icon name="badge" size={20} color="#7f8c8d" type="MaterialIcons" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Admission Number</Text>
              <Text style={styles.detailValue}>{studentData.admissionNumber || 'N/A'}</Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <Icon name="badge" size={20} color="#7f8c8d" type="MaterialIcons" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>ID Number</Text>
              <Text style={styles.detailValue}>{studentData.idNumber || 'N/A'}</Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <Icon name="cake" size={20} color="#7f8c8d" type="MaterialIcons" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Date of Birth</Text>
              <Text style={styles.detailValue}>
                {studentData.dateOfBirth ? new Date(studentData.dateOfBirth).toLocaleDateString() : 'N/A'}
              </Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <Icon name="person" size={20} color="#7f8c8d" type="MaterialIcons" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Age</Text>
              <Text style={styles.detailValue}>{studentData.age || 'N/A'} years</Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <Icon name="wc" size={20} color="#7f8c8d" type="MaterialIcons" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Gender</Text>
              <Text style={styles.detailValue}>{studentData.gender || 'N/A'}</Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <Icon name="opacity" size={20} color="#7f8c8d" type="MaterialIcons" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Blood Group</Text>
              <Text style={styles.detailValue}>{studentData.bloodGroup || 'N/A'}</Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <Icon name="event" size={20} color="#7f8c8d" type="MaterialIcons" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Joining Date</Text>
              <Text style={styles.detailValue}>{studentData.joiningDate ? new Date(studentData.joiningDate).toLocaleDateString() : 'N/A'}</Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <Icon name="school" size={20} color="#7f8c8d" type="MaterialIcons" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>School/College</Text>
              <Text style={styles.detailValue}>{studentData.schoolCollegeName || 'N/A'}</Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <Icon name="business" size={20} color="#7f8c8d" type="MaterialIcons" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Organization</Text>
              <Text style={styles.detailValue}>{studentData.organizationName || 'N/A'}</Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <Icon name="school" size={20} color="#7f8c8d" type="MaterialIcons" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Qualification</Text>
              <Text style={styles.detailValue}>{studentData.qualification || 'N/A'}</Text>
            </View>
          </View>
        </View>

        {/* Contact Information */}
        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          
          <View style={styles.detailItem}>
            <Icon name="email" size={20} color="#7f8c8d" type="MaterialIcons" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Email</Text>
              <Text style={styles.detailValue}>{studentData.email}</Text>
            </View>
            <TouchableOpacity style={styles.editDetailButton} onPress={() => setShowEditEmailModal(true)}>
              <Icon name="edit" size={16} color="#006CB5" type="MaterialIcons" />
            </TouchableOpacity>
          </View>

          <View style={styles.detailItem}>
            <Icon name="phone" size={20} color="#7f8c8d" type="MaterialIcons" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Phone</Text>
              <Text style={styles.detailValue}>{studentData.phone}</Text>
            </View>
            <TouchableOpacity style={styles.editDetailButton} onPress={() => setShowEditPhoneModal(true)}>
              <Icon name="edit" size={16} color="#006CB5" type="MaterialIcons" />
            </TouchableOpacity>
          </View>

          <View style={styles.detailItem}>
            <Icon name="location-on" size={20} color="#7f8c8d" type="MaterialIcons" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Address</Text>
              <Text style={styles.detailValue}>{studentData.address}</Text>
            </View>
          </View>
        </View>

        {/* Family Information */}
        {/* <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>Family Information</Text>
          
          <View style={styles.detailItem}>
            <Icon name="person" size={20} color="#7f8c8d" type="MaterialIcons" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Father's Name</Text>
              <Text style={styles.detailValue}>{studentData.fatherName || 'N/A'}</Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <Icon name="phone" size={20} color="#7f8c8d" type="MaterialIcons" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Father's Phone</Text>
              <Text style={styles.detailValue}>{studentData.fatherPhone || 'N/A'}</Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <Icon name="work" size={20} color="#7f8c8d" type="MaterialIcons" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Father's Occupation</Text>
              <Text style={styles.detailValue}>{studentData.fatherOccupation || 'N/A'}</Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <Icon name="person" size={20} color="#7f8c8d" type="MaterialIcons" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Mother's Name</Text>
              <Text style={styles.detailValue}>{studentData.motherName || 'N/A'}</Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <Icon name="phone" size={20} color="#7f8c8d" type="MaterialIcons" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Mother's Phone</Text>
              <Text style={styles.detailValue}>{studentData.motherPhone || 'N/A'}</Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <Icon name="work" size={20} color="#7f8c8d" type="MaterialIcons" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Mother's Occupation</Text>
              <Text style={styles.detailValue}>{studentData.motherOccupation || 'N/A'}</Text>
            </View>
          </View>
        </View> */}

        {/* Training Information */}
        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>Training Information</Text>
          
          <View style={styles.detailItem}>
            <Icon name="sports" size={20} color="#7f8c8d" type="MaterialIcons" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Current Belt Level</Text>
              <Text style={styles.detailValue}>{studentData.currentBeltLevel || 'N/A'}</Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <Icon name="person" size={20} color="#7f8c8d" type="MaterialIcons" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Instructor Name</Text>
              <Text style={styles.detailValue}>{studentData.instructorName || 'N/A'}</Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <Icon name="location-on" size={20} color="#7f8c8d" type="MaterialIcons" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Class Address</Text>
              <Text style={styles.detailValue}>{studentData.classAddress || 'N/A'}</Text>
            </View>
          </View>
        </View>

        {/* Achievements */}
        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          
          {studentData.achievements && studentData.achievements.length > 0 ? (
            <>
              {/* Medal Summary */}
              <View style={styles.achievementSummary}>
                <Text style={styles.achievementText}>
                  No. of Events: {studentData.achievements.reduce((total, ach) => {
                    return total + (ach.typePrices?.filter(tp => tp.type).length || 0);
                  }, 0)}  No. of Medals: {studentData.achievements.reduce((total, ach) => {
                    return total + (ach.typePrices?.filter(tp => tp.price).length || 0);
                  }, 0)}
                </Text>
                <Text style={styles.achievementText}>
                  Gold: {(() => {
                    let count = 0;
                    studentData.achievements.forEach(ach => {
                      ach.typePrices?.forEach(tp => {
                        if (tp.price && tp.price.toLowerCase().includes('gold')) count++;
                      });
                    });
                    return count;
                  })()}, Silver: {(() => {
                    let count = 0;
                    studentData.achievements.forEach(ach => {
                      ach.typePrices?.forEach(tp => {
                        if (tp.price && tp.price.toLowerCase().includes('silver')) count++;
                      });
                    });
                    return count;
                  })()}, Bronze: {(() => {
                    let count = 0;
                    studentData.achievements.forEach(ach => {
                      ach.typePrices?.forEach(tp => {
                        if (tp.price && tp.price.toLowerCase().includes('bronze')) count++;
                      });
                    });
                    return count;
                  })()}
                </Text>
              </View>

              {/* Achievement Details */}
              {studentData.achievements.map((achievement, index) => (
                <View key={index} style={styles.achievementCard}>
                  <View style={styles.achievementHeader}>
                    <Icon name="emoji-events" size={20} color="#006CB5" type="MaterialIcons" />
                    <Text style={styles.achievementTitle}>{achievement.tournamentName || 'Tournament'}</Text>
                  </View>
                  
                  {achievement.address && (
                    <View style={styles.achievementDetail}>
                      <Icon name="location-on" size={16} color="#7f8c8d" type="MaterialIcons" />
                      <Text style={styles.achievementDetailText}>{achievement.address}</Text>
                    </View>
                  )}
                  
                  {achievement.date && (
                    <View style={styles.achievementDetail}>
                      <Icon name="event" size={16} color="#7f8c8d" type="MaterialIcons" />
                      <Text style={styles.achievementDetailText}>
                        {new Date(achievement.date).toLocaleDateString()}
                      </Text>
                    </View>
                  )}

                  {/* Events & Medals */}
                  {achievement.typePrices && achievement.typePrices.length > 0 && (
                    <View style={styles.eventsContainer}>
                      <Text style={styles.eventsTitle}>Events & Medals</Text>
                      {achievement.typePrices.map((tp, tpIndex) => {
                        console.log(`📋 Event ${tpIndex}:`, {
                          type: tp.type,
                          price: tp.price,
                          certificateCode: tp.certificateCode,
                          certificateFile: tp.certificateFile,
                          hasCertificateFile: !!tp.certificateFile
                        });
                        
                        return (
                          <View key={tpIndex} style={styles.eventItem}>
                            <View style={styles.eventInfo}>
                              <Text style={styles.eventLabel}>Event</Text>
                              <Text style={styles.eventValue}>{tp.type || 'N/A'}</Text>
                            </View>
                            <View style={styles.eventInfo}>
                              <Text style={styles.eventLabel}>Medal</Text>
                              <Text style={[
                                styles.eventValue,
                                styles.medalText,
                                tp.price?.toLowerCase().includes('gold') && styles.goldMedal,
                                tp.price?.toLowerCase().includes('silver') && styles.silverMedal,
                                tp.price?.toLowerCase().includes('bronze') && styles.bronzeMedal,
                              ]}>
                                {tp.price || 'N/A'}
                              </Text>
                            </View>
                            {tp.certificateCode && (
                              <View style={styles.eventInfo}>
                                <Text style={styles.eventLabel}>Certificate Code</Text>
                                <Text style={styles.eventValue}>{tp.certificateCode}</Text>
                              </View>
                            )}
                            {/* Show download button if certificate code exists (certificate should be available) */}
                            {tp.certificateCode && (
                              tp.certificateFile ? (
                                <TouchableOpacity
                                  style={styles.downloadButton}
                                  onPress={() => handleDownloadCertificate(tp.certificateFile, tp.certificateCode, tp.type)}
                                >
                                  <Icon name="file-download" size={16} color="#fff" type="MaterialIcons" />
                                  <Text style={styles.downloadButtonText}>Download</Text>
                                </TouchableOpacity>
                              ) : (
                                <View style={styles.noCertificateButton}>
                                  <Icon name="info" size={16} color="#95a5a6" type="MaterialIcons" />
                                  <Text style={styles.noCertificateText}>Certificate not uploaded yet</Text>
                                </View>
                              )
                            )}
                          </View>
                        );
                      })}
                    </View>
                  )}
                </View>
              ))}
            </>
          ) : (
            <View style={styles.achievementSummary}>
              <Text style={styles.achievementText}>No achievements recorded yet</Text>
            </View>
          )}
        </View>

        {/* Settings */}
        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <TouchableOpacity style={styles.settingItem} onPress={handleChangePassword}>
            <View style={styles.settingIcon}>
              <Icon name="lock" size={20} color="#006CB5" type="MaterialIcons" />
            </View>
            <Text style={styles.settingText}>Change Password</Text>
            <Icon name="chevron-right" size={20} color="#bdc3c7" type="MaterialIcons" />
          </TouchableOpacity>
        </View>

        {/* Sign Out */}
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Icon name="logout" size={20} color="#006CB5" type="MaterialIcons" />
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
                    <Icon name="check" size={20} color="#006CB5" type="MaterialIcons" />
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
    backgroundColor: '#006CB5',
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
    borderColor: '#006CB5',
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
    borderColor: '#006CB5',
  },
  profileImagePhoto: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#006CB5',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#006CB5',
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
  photoDebug: {
    fontSize: 10,
    color: '#95a5a6',
    textAlign: 'center',
    marginTop: 5,
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
    color: '#006CB5',
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
    backgroundColor: '#e3f2fd',
    borderWidth: 2,
    borderColor: '#006CB5',
  },
  yearText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  selectedYearText: {
    color: '#006CB5',
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
    backgroundColor: '#006CB5',
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
  retryButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#006CB5',
    borderRadius: 12,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: '#95a5a6',
    marginTop: 10,
  },
  errorHint: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 5,
    paddingHorizontal: 20,
    lineHeight: 20,
  },

  // Achievement Styles
  achievementSummary: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 15,
    marginTop: 10,
    marginBottom: 15,
  },
  achievementText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 5,
  },
  achievementCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e1e8ed',
  },
  achievementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2c3e50',
    marginLeft: 10,
  },
  achievementDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  achievementDetailText: {
    fontSize: 14,
    color: '#7f8c8d',
    marginLeft: 8,
  },
  eventsContainer: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#e1e8ed',
  },
  eventsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 10,
  },
  eventItem: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  eventInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  eventLabel: {
    fontSize: 13,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  eventValue: {
    fontSize: 13,
    color: '#2c3e50',
    fontWeight: '600',
  },
  medalText: {
    textTransform: 'capitalize',
  },
  goldMedal: {
    color: '#FFD700',
  },
  silverMedal: {
    color: '#C0C0C0',
  },
  bronzeMedal: {
    color: '#CD7F32',
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#006CB5',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 8,
    gap: 6,
  },
  downloadButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  noCertificateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 8,
    gap: 6,
  },
  noCertificateText: {
    color: '#7f8c8d',
    fontSize: 11,
    fontStyle: 'italic',
  },
});

export default ProfileScreen;