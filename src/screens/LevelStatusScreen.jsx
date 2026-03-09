import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
  TextInput,
  Alert,
  Linking,
  Platform,
  PermissionsAndroid,
  Modal,
  Image,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import RNFS from 'react-native-fs';
import StudentService from '../services/studentService';
import API_CONFIG from '../config/api';
import { useNavigation } from '../context/NavigationContext';
import { useStudent } from '../context/StudentContext';
import Icon from '../components/common/Icon';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const LevelStatusScreen = () => {
  const { navigate } = useNavigation();
  const { student } = useStudent();
  const [viewMode, setViewMode] = useState('Belt Levels'); // 'Belt Levels', 'Promotions', 'Upcoming'
  const [levelData, setLevelData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedBeltType, setSelectedBeltType] = useState('All Belts');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewingCertificate, setViewingCertificate] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  console.log('👤 Logged in student:', student);

  // Level types
  const levelTypes = ['Belt Levels', 'Promotions', 'Upcoming'];

  // Load level data from backend
  useEffect(() => {
    loadLevelData();
  }, [viewMode]);

  const loadLevelData = async () => {
    try {
      setLoading(true);
      
      if (viewMode === 'Belt Levels') {
        console.log('🔄 Loading belt levels from backend...');
        console.log('🌐 Belt Levels API:', `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.BELTS.LEVELS}`);
        
        // Try to fetch belt levels from backend
        let backendBelts = [];
        try {
          console.log('🔄 Trying belt levels via StudentService');
          
          const result = await StudentService.getBeltLevels();
          
          console.log('✅ Belt levels response:', result);
          
          if (result && result.status === 'success' && result.data && result.data.belts) {
            backendBelts = result.data.belts;
            console.log('✅ Got', backendBelts.length, 'belt levels from backend');
          }
        } catch (backendError) {
          console.log('⚠️ Belt levels request failed:', backendError.message);
          console.log('🔄 Using fallback sample data...');
        }
        
        // Process belt levels
        if (backendBelts.length > 0) {
          const processedBelts = processBackendBeltData(backendBelts);
          setLevelData(processedBelts);
          console.log('✅ Using backend belt data:', processedBelts.length, 'belt levels');
        } else {
          console.log('📊 No backend data, using mock belt data');
          const mockBelts = getMockBeltLevelsData();
          setLevelData(mockBelts);
          console.log('✅ Using mock belt data:', mockBelts.length, 'belt levels');
        }
      } else if (viewMode === 'Promotions') {
        console.log('🔄 Loading promotions from backend...');
        console.log('🌐 Promotions API:', `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.BELTS.PROMOTIONS}`);
        
        // Try to fetch promotions from backend
        let backendPromotions = [];
        try {
          const result = await StudentService.getPromotions();
          
          if (result && result.status === 'success' && result.data && result.data.promotions) {
            backendPromotions = result.data.promotions;
            console.log('✅ Got', backendPromotions.length, 'promotions from backend');
          }
        } catch (backendError) {
          console.log('⚠️ Promotions request failed:', backendError.message);
          console.log('🔄 Using fallback sample data...');
        }
        
        // Process promotions
        if (backendPromotions.length > 0) {
          const processedPromotions = processBackendPromotionData(backendPromotions);
          setLevelData(processedPromotions);
          console.log('✅ Using backend promotion data:', processedPromotions.length, 'promotions');
        } else {
          console.log('📊 No backend data, using mock promotion data');
          const mockPromotions = getMockPromotionsData();
          setLevelData(mockPromotions);
          console.log('✅ Using mock promotion data:', mockPromotions.length, 'promotions');
        }
      } else if (viewMode === 'Upcoming') {
        console.log('🔄 Loading upcoming tests from backend...');
        console.log('🌐 Upcoming Tests API:', `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.BELTS.TESTS}`);
        
        // Try to fetch upcoming tests from backend
        let backendTests = [];
        try {
          const result = await StudentService.getBeltTests();
          
          if (result && result.status === 'success' && result.data && result.data.tests) {
            backendTests = result.data.tests;
            console.log('✅ Got', backendTests.length, 'upcoming tests from backend');
          }
        } catch (backendError) {
          console.log('⚠️ Upcoming tests request failed:', backendError.message);
          console.log('📊 No upcoming tests available');
        }
        
        // Process upcoming tests from backend only
        if (backendTests.length > 0) {
          const processedTests = processBackendTestData(backendTests);
          setLevelData(processedTests);
          console.log('✅ Using backend test data:', processedTests.length, 'upcoming tests');
        } else {
          console.log('📊 No upcoming tests found in backend');
          setLevelData([]);
        }
      } else {
        // Fallback for any other view mode
        const mockBelts = getMockBeltLevelsData();
        setLevelData(mockBelts);
      }
    } catch (error) {
      console.error('❌ Failed to load level data:', error);
      // No fallback to mock data - show empty state
      if (viewMode === 'Promotions') {
        const mockPromotions = getMockPromotionsData();
        setLevelData(mockPromotions);
      } else {
        // For Belt Levels and Upcoming Tests, show empty if backend fails
        setLevelData([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadLevelData();
    setRefreshing(false);
  };

  // Helper function to get belt color information by belt name
  const getBeltColorInfo = (beltName) => {
    if (!beltName) {
      console.log('⚠️ No belt name provided');
      return { color: '#CCCCCC', isStripe: false, stripeColors: null, textColor: '#333', borderColor: '#999999' };
    }
    
    const name = beltName.toLowerCase().trim();
    console.log('🎨 Getting color for belt:', beltName, '(normalized:', name + ')');
    
    // Define belt color mappings with darker shades
    const beltColors = {
      // White belt variations
      'white belt': { color: '#FFFFFF', borderColor: '#E5E7EB', textColor: '#333333' },
      'white': { color: '#FFFFFF', borderColor: '#E5E7EB', textColor: '#333333' },
      
      // White/Yellow stripe variations - darker gold
      'white / yellow stripe belt': { 
        isStripe: true, 
        stripeColors: { color1: '#FFFFFF', color2: '#D4AF37' },
        borderColor: '#333',
        textColor: '#333333'
      },
      'white / yellow stripe': { 
        isStripe: true, 
        stripeColors: { color1: '#FFFFFF', color2: '#D4AF37' },
        borderColor: '#333',
        textColor: '#333333'
      },
      'white-yellow stripe': { 
        isStripe: true, 
        stripeColors: { color1: '#FFFFFF', color2: '#D4AF37' },
        borderColor: '#333',
        textColor: '#333333'
      },
      
      // Yellow belt variations - darker gold
      'yellow belt': { color: '#D4AF37', borderColor: '#D4AF37', textColor: '#333333' },
      'yellow': { color: '#D4AF37', borderColor: '#D4AF37', textColor: '#333333' },
      
      // Yellow/Green stripe variations - darker shades
      'yellow / green stripe belt': { 
        isStripe: true, 
        stripeColors: { color1: '#D4AF37', color2: '#006400' },
        borderColor: '#333',
        textColor: '#FFFFFF'
      },
      'yellow / green stripe': { 
        isStripe: true, 
        stripeColors: { color1: '#D4AF37', color2: '#006400' },
        borderColor: '#333',
        textColor: '#FFFFFF'
      },
      
      // Orange belt - darker orange
      'orange belt': { color: '#CC5500', borderColor: '#CC5500', textColor: '#FFFFFF' },
      'orange': { color: '#CC5500', borderColor: '#CC5500', textColor: '#FFFFFF' },
      
      // Green belt variations - dark green
      'green belt': { color: '#006400', borderColor: '#006400', textColor: '#FFFFFF' },
      'green': { color: '#006400', borderColor: '#006400', textColor: '#FFFFFF' },
      
      // Green/Blue stripe variations - dark shades
      'green / blue stripe belt': { 
        isStripe: true, 
        stripeColors: { color1: '#006400', color2: '#00008B' },
        borderColor: '#333',
        textColor: '#FFFFFF'
      },
      'green / blue stripe': { 
        isStripe: true, 
        stripeColors: { color1: '#006400', color2: '#00008B' },
        borderColor: '#333',
        textColor: '#FFFFFF'
      },
      
      // Blue belt variations - dark blue
      'blue belt': { color: '#00008B', borderColor: '#00008B', textColor: '#FFFFFF' },
      'blue': { color: '#00008B', borderColor: '#00008B', textColor: '#FFFFFF' },
      
      // Blue/Purple stripe variations - dark shades
      'blue / purple stripe belt': { 
        isStripe: true, 
        stripeColors: { color1: '#00008B', color2: '#4B0082' },
        borderColor: '#333',
        textColor: '#FFFFFF'
      },
      'blue / purple stripe': { 
        isStripe: true, 
        stripeColors: { color1: '#00008B', color2: '#4B0082' },
        borderColor: '#333',
        textColor: '#FFFFFF'
      },
      
      // Purple belt - darker purple
      'purple belt': { color: '#4B0082', borderColor: '#4B0082', textColor: '#FFFFFF' },
      'purple': { color: '#4B0082', borderColor: '#4B0082', textColor: '#FFFFFF' },
      
      // Brown belt - dark brown
      'brown belt': { color: '#654321', borderColor: '#654321', textColor: '#FFFFFF' },
      'brown': { color: '#654321', borderColor: '#654321', textColor: '#FFFFFF' },
      
      // Purple/Black stripe variations (replacing red/black)
      'purple / black stripe belt': { 
        isStripe: true, 
        stripeColors: { color1: '#4B0082', color2: '#000000' },
        borderColor: '#333',
        textColor: '#FFFFFF'
      },
      'purple / black stripe': { 
        isStripe: true, 
        stripeColors: { color1: '#4B0082', color2: '#000000' },
        borderColor: '#333',
        textColor: '#FFFFFF'
      },
      
      // Black belt variations
      'black belt': { color: '#000000', borderColor: '#000000', textColor: '#FFFFFF' },
      'black belt 1st dan': { color: '#000000', borderColor: '#000000', textColor: '#FFFFFF' },
      'black belt 2nd dan': { color: '#000000', borderColor: '#000000', textColor: '#FFFFFF' },
      'black belt 3rd dan': { color: '#000000', borderColor: '#000000', textColor: '#FFFFFF' },
      'black': { color: '#000000', borderColor: '#000000', textColor: '#FFFFFF' }
    };
    
    // Try exact match first
    if (beltColors[name]) {
      console.log('✅ Exact match found:', beltColors[name]);
      return { isStripe: false, ...beltColors[name] };
    }
    
    // Try partial matches
    for (const [key, value] of Object.entries(beltColors)) {
      if (name.includes(key) || key.includes(name)) {
        console.log('✅ Partial match found:', key, value);
        return { isStripe: false, ...value };
      }
    }
    
    console.log('⚠️ No match found, using default gray');
    // Default gray for unknown belts
    return { color: '#CCCCCC', borderColor: '#999999', textColor: '#333333', isStripe: false };
  };

  // Process backend belt data
  const processBackendBeltData = (beltsFromBackend) => {
    console.log('🔄 Processing belt levels from backend:', beltsFromBackend.length);
    
    // Helper function to determine if a color is light or dark
    const isLightColor = (hexColor) => {
      if (!hexColor) return true;
      
      // Remove # if present
      const hex = hexColor.replace('#', '');
      
      // Convert to RGB
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      
      // Calculate luminance
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      
      // Return true if light (luminance > 0.5)
      return luminance > 0.5;
    };
    
    // Helper function to detect if belt is a stripe belt
    const isStripeBelt = (colorName) => {
      return colorName && colorName.includes('-stripe');
    };
    
    // Helper function to get stripe colors from belt color name
    const getStripeColors = (colorName, primaryHex, stripeHex) => {
      // If stripeColor is provided from backend, use it
      if (stripeHex) {
        return {
          color1: primaryHex,
          color2: stripeHex
        };
      }
      
      // Otherwise, parse from color name - using darker shades
      const colorMap = {
        'white': '#FFFFFF',
        'yellow': '#D4AF37',  // Darker gold/yellow
        'green': '#006400',   // Dark green
        'blue': '#00008B',    // Dark blue
        'purple': '#4B0082',  // Dark purple (replacing red)
        'black': '#000000'
      };
      
      if (colorName.includes('white-yellow')) {
        return { color1: colorMap.white, color2: colorMap.yellow };
      } else if (colorName.includes('yellow-green')) {
        return { color1: colorMap.yellow, color2: colorMap.green };
      } else if (colorName.includes('green-blue')) {
        return { color1: colorMap.green, color2: colorMap.blue };
      } else if (colorName.includes('blue-purple')) {
        return { color1: colorMap.blue, color2: colorMap.purple };
      } else if (colorName.includes('purple-black')) {
        return { color1: colorMap.purple, color2: colorMap.black };
      }
      
      return null;
    };
    
    return beltsFromBackend.map(belt => {
      // Determine status based on belt level and students
      let status = 'Available';
      if (belt.students > 0) {
        status = 'Active';
      }
      
      // Determine progress based on student count (mock calculation)
      const maxStudents = 30; // Assume max 30 students per belt
      const progress = Math.min((belt.students / maxStudents) * 100, 100);
      
      const beltColor = belt.hex || '#FFFFFF';
      const isLight = isLightColor(beltColor);
      const isStripe = isStripeBelt(belt.color);
      const stripeColors = isStripe ? getStripeColors(belt.color, belt.hex, belt.stripeColor) : null;
      
      console.log(`🥋 Belt: ${belt.name}, Level: ${belt.level}, Color: ${beltColor}, IsStripe: ${isStripe}`);
      
      return {
        id: belt._id || belt.id,
        type: 'belt',
        name: belt.name || 'Unknown Belt',
        level: belt.level || 1,
        color: beltColor,
        borderColor: isLight ? '#E5E7EB' : beltColor,
        textColor: isLight ? '#333333' : '#FFFFFF', // Dark text for light colors, white text for dark colors
        isStripeBelt: isStripe,
        stripeColors: stripeColors,
        date: belt.createdAt ? new Date(belt.createdAt).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        }) : 'N/A',
        status: status,
        progress: Math.round(progress),
        requirements: belt.requirements || [],
        students: belt.students || 0,
        beltType: belt.color === 'black' ? 'Black Belt' : 'Colored Belt'
      };
    });
  };

  // Process backend promotion data
  const processBackendPromotionData = (promotionsFromBackend) => {
    console.log('🔄 Processing promotions from backend:', promotionsFromBackend.length);
    
    return promotionsFromBackend.map(promotion => {
      console.log(`🏆 Promotion: ${promotion.studentName}, From: ${promotion.fromBelt}, To: ${promotion.toBelt}`);
      
      return {
        id: promotion._id || promotion.id,
        type: 'promotion',
        studentName: promotion.studentName || 'Unknown Student',
        studentId: promotion.studentId || 'N/A',
        fromBelt: promotion.fromBelt || 'Unknown',
        toBelt: promotion.toBelt || 'Unknown',
        date: promotion.promotionDate ? new Date(promotion.promotionDate).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        }) : 'N/A',
        instructor: promotion.instructor || 'Unknown Instructor',
        notes: promotion.notes || '',
        status: 'Completed'
      };
    });
  };

  // Process backend belt test data
  const processBackendTestData = (testsFromBackend) => {
    console.log('🔄 Processing upcoming tests from backend:', testsFromBackend.length);
    
    // Remove duplicates based on _id or id
    const uniqueTests = testsFromBackend.filter((test, index, self) =>
      index === self.findIndex((t) => (t._id || t.id) === (test._id || test.id))
    );
    
    console.log('🔄 After removing duplicates:', uniqueTests.length);
    
    return uniqueTests.map(test => {
      console.log(`📝 Test: ${test.studentName}, Testing for: ${test.testingFor}, Date: ${test.testDate}`);
      
      return {
        id: test._id || test.id,
        type: 'upcoming',
        studentName: test.studentName || 'Unknown Student',
        currentBelt: test.currentBelt || 'Unknown',
        testingFor: test.testingFor || 'Unknown',
        date: test.testDate ? new Date(test.testDate).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        }) : 'N/A',
        certificateCode: test.certificateCode || 'N/A',
        certificateUrl: test.certificateUrl || test.certificateFile || null,
        notes: test.notes || ''
      };
    });
  };

  // Mock upcoming tests data
  const getMockUpcomingTestsData = () => {
    return [
      {
        id: '1',
        type: 'upcoming',
        studentName: 'Alex Chen',
        currentBelt: 'Yellow Belt',
        testingFor: 'Orange Belt',
        date: '2/11/2026',
        status: 'scheduled',
        certificateCode: 'CERT-2026-001',
        certificateUrl: 'https://example.com/certificates/cert-001.pdf',
        notes: 'Needs more practice on basic techniques.'
      },
      {
        id: '2',
        type: 'upcoming',
        studentName: 'Lisa Wang',
        currentBelt: 'White Belt',
        testingFor: 'Yellow Belt',
        date: '4/5/2026',
        status: 'scheduled',
        certificateCode: 'CERT-2026-002',
        certificateUrl: 'https://example.com/certificates/cert-002.pdf',
        notes: 'Good progress, keep practicing forms.'
      },
      {
        id: '3',
        type: 'upcoming',
        studentName: 'David Kim',
        currentBelt: 'Yellow Belt',
        testingFor: 'Orange Belt',
        date: '4/10/2026',
        status: 'scheduled',
        certificateCode: 'CERT-2026-003',
        certificateUrl: 'https://example.com/certificates/cert-003.pdf',
        notes: 'Excellent technique, almost ready for test.'
      },
      {
        id: '4',
        type: 'upcoming',
        studentName: 'John Smith',
        currentBelt: 'White Belt',
        testingFor: 'Yellow Belt',
        date: '5/5/2026',
        status: 'scheduled',
        certificateCode: 'CERT-2026-004',
        certificateUrl: 'https://example.com/certificates/cert-004.pdf',
        notes: 'Just started, needs significant practice.'
      }
    ];
  };
  const getMockPromotionsData = () => {
    return [
      {
        id: 1,
        type: 'promotion',
        studentName: 'John Smith',
        studentId: 'TKD001',
        fromBelt: 'White Belt',
        toBelt: 'Yellow Belt',
        date: '15 Jan 2024',
        instructor: 'Master Kim',
        notes: 'Excellent performance in all areas',
        status: 'Completed'
      },
      {
        id: 2,
        type: 'promotion',
        studentName: 'Sarah Johnson',
        studentId: 'TKD002',
        fromBelt: 'Yellow Belt',
        toBelt: 'Orange Belt',
        date: '20 Feb 2024',
        instructor: 'Master Lee',
        notes: 'Good technique, needs work on flexibility',
        status: 'Completed'
      },
      {
        id: 3,
        type: 'promotion',
        studentName: 'Mike Davis',
        studentId: 'TKD003',
        fromBelt: 'Orange Belt',
        toBelt: 'Green Belt',
        date: '10 Mar 2024',
        instructor: 'Master Kim',
        notes: 'Outstanding sparring skills',
        status: 'Completed'
      },
      {
        id: 4,
        type: 'promotion',
        studentName: 'Lisa Chen',
        studentId: 'TKD004',
        fromBelt: 'Green Belt',
        toBelt: 'Blue Belt',
        date: '05 Apr 2024',
        instructor: 'Master Park',
        notes: 'Perfect form execution',
        status: 'Completed'
      },
      {
        id: 5,
        type: 'promotion',
        studentName: 'David Wilson',
        studentId: 'TKD005',
        fromBelt: 'Blue Belt',
        toBelt: 'Purple Belt',
        date: '15 May 2024',
        instructor: 'Master Lee',
        notes: 'Great leadership potential',
        status: 'Completed'
      }
    ];
  };

  // Mock belt levels data - Simplified
  const getMockBeltLevelsData = () => {
    return [
      { id: 1, type: 'belt', name: 'White Belt', level: 1, color: '#FFFFFF', borderColor: '#E5E7EB', textColor: '#333333', isStripeBelt: false, date: '15 Jan 2024', status: 'Achieved', progress: 100, requirements: ['Basic Stances', 'Basic Blocks'], students: 25, beltType: 'Colored Belt' },
      { id: 2, type: 'belt', name: 'White / Yellow Stripe Belt', level: 2, color: '#FFFFFF', borderColor: '#333', textColor: '#333333', isStripeBelt: true, stripeColors: { color1: '#FFFFFF', color2: '#FFD700' }, date: '10 Feb 2024', status: 'Achieved', progress: 100, requirements: ['Chon-Ji pattern introduction'], students: 22, beltType: 'Colored Belt' },
      { id: 3, type: 'belt', name: 'Yellow Belt', level: 3, color: '#FFD700', borderColor: '#FFD700', textColor: '#333333', isStripeBelt: false, date: '20 Feb 2024', status: 'Achieved', progress: 100, requirements: ['Taegeuk Il Jang', 'Front Kick'], students: 20, beltType: 'Colored Belt' },
      { id: 4, type: 'belt', name: 'Yellow / Green Stripe Belt', level: 4, color: '#FFD700', borderColor: '#333', textColor: '#333333', isStripeBelt: true, stripeColors: { color1: '#FFD700', color2: '#10B981' }, date: '05 Mar 2024', status: 'Achieved', progress: 100, requirements: ['Dan-Gun pattern introduction'], students: 18, beltType: 'Colored Belt' },
      { id: 5, type: 'belt', name: 'Green Belt', level: 5, color: '#10B981', borderColor: '#10B981', textColor: '#FFFFFF', isStripeBelt: false, date: '10 Mar 2024', status: 'Achieved', progress: 100, requirements: ['Taegeuk Sam Jang', 'Side Kick'], students: 15, beltType: 'Colored Belt' },
      { id: 6, type: 'belt', name: 'Green / Blue Stripe Belt', level: 6, color: '#10B981', borderColor: '#333', textColor: '#FFFFFF', isStripeBelt: true, stripeColors: { color1: '#10B981', color2: '#3B82F6' }, date: '25 Mar 2024', status: 'Available', progress: 85, requirements: ['Do-San pattern introduction'], students: 13, beltType: 'Colored Belt' },
      { id: 7, type: 'belt', name: 'Blue Belt', level: 7, color: '#3B82F6', borderColor: '#3B82F6', textColor: '#FFFFFF', isStripeBelt: false, date: '05 Apr 2024', status: 'Available', progress: 75, requirements: ['Taegeuk Sa Jang', 'Hook Kick'], students: 12, beltType: 'Colored Belt' },
      { id: 8, type: 'belt', name: 'Blue / Purple Stripe Belt', level: 8, color: '#3B82F6', borderColor: '#333', textColor: '#FFFFFF', isStripeBelt: true, stripeColors: { color1: '#3B82F6', color2: '#7C3AED' }, date: '20 Apr 2024', status: 'Available', progress: 60, requirements: ['Won-Hyo pattern introduction'], students: 10, beltType: 'Colored Belt' },
      { id: 9, type: 'belt', name: 'Purple Belt', level: 9, color: '#7C3AED', borderColor: '#7C3AED', textColor: '#FFFFFF', isStripeBelt: false, date: '20 Jul 2024', status: 'Available', progress: 25, requirements: ['Taegeuk Chil Jang', 'Advanced Techniques'], students: 6, beltType: 'Colored Belt' },
      { id: 10, type: 'belt', name: 'Purple / Black Stripe Belt', level: 10, color: '#7C3AED', borderColor: '#333', textColor: '#FFFFFF', isStripeBelt: true, stripeColors: { color1: '#7C3AED', color2: '#1F2937' }, date: '10 Aug 2024', status: 'Available', progress: 15, requirements: ['Yul-Gok pattern, black belt preparation'], students: 4, beltType: 'Colored Belt' },
      { id: 11, type: 'belt', name: 'Black Belt 1st Dan', level: 11, color: '#1F2937', borderColor: '#1F2937', textColor: '#FFFFFF', isStripeBelt: false, date: '25 Aug 2024', status: 'Available', progress: 20, requirements: ['Koryo', 'All Techniques Mastery'], students: 5, beltType: 'Black Belt' },
      { id: 12, type: 'belt', name: 'Black Belt 2nd Dan', level: 12, color: '#1F2937', borderColor: '#1F2937', textColor: '#FFFFFF', isStripeBelt: false, date: '25 Sep 2024', status: 'Available', progress: 10, requirements: ['Keumgang', 'Leadership Skills'], students: 3, beltType: 'Black Belt' },
      { id: 13, type: 'belt', name: 'Black Belt 3rd Dan', level: 13, color: '#1F2937', borderColor: '#1F2937', textColor: '#FFFFFF', isStripeBelt: false, date: '20 Oct 2024', status: 'Available', progress: 5, requirements: ['Taebaek', 'Teaching Practice'], students: 2, beltType: 'Black Belt' }
    ];
  };

  // Get appropriate data based on view mode
  const getDisplayData = () => {
    if (levelData.length > 0) {
      return levelData;
    }
    
    // Fallback to mock data based on view mode
    if (viewMode === 'Belt Levels') {
      return getMockBeltLevelsData();
    } else if (viewMode === 'Promotions') {
      return getMockPromotionsData();
    } else if (viewMode === 'Upcoming') {
      // No mock data for upcoming tests - return empty array
      return [];
    }
    
    return getMockBeltLevelsData();
  };

  const beltLevelsData = getDisplayData();

  const handleBackPress = () => {
    navigate('Dashboard');
  };

  // Handle view certificate - show in modal for images, open browser for PDFs
  const handleViewCertificate = async (certificateUrl, certificateCode, testData) => {
    try {
      console.log('👁️ Viewing certificate:', certificateUrl);
      
      if (!certificateUrl) {
        Alert.alert('Error', 'Certificate URL not available');
        return;
      }

      // Try multiple possible paths for the certificate
      const possibleUrls = [];
      
      if (certificateUrl.startsWith('http://') || certificateUrl.startsWith('https://')) {
        possibleUrls.push(certificateUrl);
      } else {
        const serverUrl = API_CONFIG.BASE_URL.replace('/api', '');
        
        if (certificateUrl.startsWith('/')) {
          possibleUrls.push(`${serverUrl}${certificateUrl}`);
        } else {
          // Try different possible folder structures
          possibleUrls.push(`${serverUrl}/uploads/${certificateUrl}`);
          possibleUrls.push(`${serverUrl}/${certificateUrl}`);
          possibleUrls.push(`${serverUrl}/uploads/belt-exams/${certificateUrl}`);
          possibleUrls.push(`${serverUrl}/uploads/certificates/${certificateUrl}`);
        }
      }

      // Use the first URL for now (we'll try others if this fails)
      const fullUrl = possibleUrls[0];
      console.log('👁️ Full certificate URL:', fullUrl);

      // Determine if it's a PDF or image
      const isPdf = certificateUrl.toLowerCase().endsWith('.pdf');
      console.log('📄 File type:', isPdf ? 'PDF' : 'Image');

      if (isPdf) {
        // Open PDF in browser - try all possible URLs
        console.log('📄 Opening PDF in browser');
        let opened = false;
        
        for (const url of possibleUrls) {
          try {
            await Linking.openURL(url);
            console.log('✅ PDF opened from:', url);
            opened = true;
            break;
          } catch (error) {
            console.log('⚠️ Failed to open PDF from:', url);
          }
        }
        
        if (!opened) {
          Alert.alert('Error', 'Unable to open PDF. The file may not exist on the server. Please try downloading instead.');
        }
      } else {
        // Show image in modal
        setImageLoading(false);
        setImageError(false);

        setViewingCertificate({
          url: fullUrl,
          code: certificateCode,
          studentName: testData.studentName,
          testingFor: testData.testingFor,
          isPdf: false,
        });
      }
    } catch (error) {
      console.error('❌ Error viewing certificate:', error);
      Alert.alert('Error', 'Unable to view certificate');
    }
  };

  // Request storage permission for Android
  const requestStoragePermission = async () => {
    if (Platform.OS !== 'android') {
      return true;
    }

    try {
      if (Platform.Version >= 33) {
        // Android 13+ doesn't need WRITE_EXTERNAL_STORAGE
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

  // Handle certificate download
  const handleDownloadCertificate = async (certificateUrl, certificateCode) => {
    try {
      console.log('📥 Downloading certificate:', certificateUrl);
      
      if (!certificateUrl) {
        Alert.alert('Error', 'Certificate URL not available');
        return;
      }

      // Request storage permission
      const hasPermission = await requestStoragePermission();
      if (!hasPermission) {
        Alert.alert('Permission Denied', 'Storage permission is required to download certificates');
        return;
      }

      // Get authentication token
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      const token = await AsyncStorage.getItem('auth_token');
      console.log('🔑 Auth token available:', !!token);

      // Use the SAME URL construction logic as handleViewCertificate
      const possibleUrls = [];
      
      if (certificateUrl.startsWith('http://') || certificateUrl.startsWith('https://')) {
        possibleUrls.push(certificateUrl);
      } else {
        const serverUrl = API_CONFIG.BASE_URL.replace('/api', '');
        
        if (certificateUrl.startsWith('/')) {
          // Direct path - try as-is first
          possibleUrls.push(`${serverUrl}${certificateUrl}`);
          
          // Also try through the API download endpoint if it's a certificate
          const filename = certificateUrl.split('/').pop();
          possibleUrls.push(`${API_CONFIG.BASE_URL}/certificates/download?file=${filename}`);
        } else {
          // Try different possible folder structures - SAME ORDER as view function
          possibleUrls.push(`${serverUrl}/uploads/${certificateUrl}`);
          possibleUrls.push(`${serverUrl}/${certificateUrl}`);
          possibleUrls.push(`${serverUrl}/uploads/belt-exams/${certificateUrl}`);
          possibleUrls.push(`${serverUrl}/uploads/certificates/${certificateUrl}`);
          
          // Also try through the API download endpoint
          possibleUrls.push(`${API_CONFIG.BASE_URL}/certificates/download?file=${certificateUrl}`);
        }
      }

      // Get file extension
      const fileExtension = certificateUrl.split('.').pop() || 'jpg';
      const fileName = `certificate_${certificateCode || Date.now()}.${fileExtension}`;
      
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

      // Try all possible URLs
      let downloadSuccess = false;
      let lastError = null;

      for (const tryUrl of possibleUrls) {
        try {
          console.log('🔄 Trying URL:', tryUrl);

          // Build headers with authentication if token exists
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
            break;
          } else if (downloadResult.statusCode === 404) {
            console.log('⚠️ File not found at:', tryUrl);
            lastError = new Error('Certificate file not found on server');
          } else {
            console.log('⚠️ Download failed with status:', downloadResult.statusCode);
            lastError = new Error(`Download failed with status code: ${downloadResult.statusCode}`);
          }
        } catch (urlError) {
          console.log('⚠️ Failed to download from:', tryUrl, urlError.message);
          lastError = urlError;
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

  // Simplified filter - only by view mode
  const filteredLevels = beltLevelsData.filter(item => {
    if (viewMode === 'Belt Levels') {
      // Show all belt levels without any filters
      return item.type === 'belt';
    }
    
    // For Promotions and Upcoming Tests, filter by logged-in student
    if (viewMode === 'Promotions' || viewMode === 'Upcoming') {
      // Get logged-in student info
      const studentName = student?.name || student?.fullName || '';
      const studentEmail = student?.email || '';
      const studentId = student?.id || student?.studentId || '';
      
      console.log('🔍 Filtering for student:', {
        name: studentName,
        email: studentEmail,
        id: studentId
      });
      
      console.log('🔍 Checking item:', {
        itemStudent: item.studentName,
        itemEmail: item.studentEmail,
        itemId: item.studentId
      });
      
      // If no student is logged in, show all (fallback)
      if (!studentName && !studentEmail) {
        console.log('⚠️ No student logged in, showing all data');
        if (viewMode === 'Promotions') return item.type === 'promotion';
        if (viewMode === 'Upcoming') return item.type === 'upcoming';
        return true;
      }
      
      // Match by student name (case-insensitive, flexible matching)
      let matchesByName = false;
      if (studentName && item.studentName) {
        const normalizedStudentName = studentName.toLowerCase().trim();
        const normalizedItemName = item.studentName.toLowerCase().trim();
        
        // Check if either name contains the other, or if they match exactly
        matchesByName = 
          normalizedItemName.includes(normalizedStudentName) ||
          normalizedStudentName.includes(normalizedItemName) ||
          normalizedItemName === normalizedStudentName;
        
        // Also check first name match (split by space and compare first word)
        if (!matchesByName) {
          const studentFirstName = normalizedStudentName.split(' ')[0];
          const itemFirstName = normalizedItemName.split(' ')[0];
          matchesByName = studentFirstName === itemFirstName && studentFirstName.length > 2;
        }
      }
      
      // Match by email
      const matchesByEmail = studentEmail && item.studentEmail && 
        item.studentEmail.toLowerCase() === studentEmail.toLowerCase();
      
      // Match by ID
      const matchesById = studentId && item.studentId && 
        item.studentId === studentId;
      
      const matchesStudent = matchesByName || matchesByEmail || matchesById;
      
      console.log('🔍 Match result:', {
        matchesByName,
        matchesByEmail,
        matchesById,
        finalMatch: matchesStudent
      });
      
      if (!matchesStudent) {
        return false;
      }
      
      if (viewMode === 'Promotions') return item.type === 'promotion';
      if (viewMode === 'Upcoming') return item.type === 'upcoming';
    }
    
    return true;
  });

  // Loading state
  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <StatusBar barStyle="light-content" backgroundColor="#006CB5" translucent={false} />
          <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <Icon name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Level Status</Text>
          <TouchableOpacity style={styles.calendarButton}>
            <Icon name="military-tech" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#006CB5" />
          <Text style={styles.loadingText}>Loading level data...</Text>
        </View>
      </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#006CB5" translucent={false} />
        
        {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Level Status</Text>
        <TouchableOpacity style={styles.calendarButton}>
          <Icon 
            name="military-tech" 
            size={24} 
            color="#fff" 
          />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#006CB5']}
            tintColor="#006CB5"
          />
        }
      >
        {/* Header Section with Record Promotion Button */}
        {/* Removed Record Promotion button for cleaner UI */}

        {/* Clean Tab Design */}
        <View style={styles.tabContainer}>
          {levelTypes.map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.tabItem,
                viewMode === type && styles.activeTab
              ]}
              onPress={() => setViewMode(type)}
            >
              <Text style={[
                styles.tabLabel,
                viewMode === type && styles.activeTabLabel
              ]}>
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Belt Levels Filters - Removed for cleaner UI */}

        {/* Belt Levels List */}
        <View style={styles.levelsContainer}>
          {filteredLevels.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon name="military-tech" size={64} color="#bdc3c7" />
              <Text style={styles.emptyTitle}>No belt levels found</Text>
              <Text style={styles.emptySubtitle}>
                No {viewMode.toLowerCase()} found. Try refreshing or check back later.
              </Text>
            </View>
          ) : (
            filteredLevels.map((item) => (
              <View key={item.id} style={styles.levelCard}>
                {item.type === 'belt' ? (
                  // Belt Level Display: Clean card with belt circle
                  <>
                    <View style={styles.beltCard}>
                      <View style={styles.beltHeader}>
                        {item.isStripeBelt && item.stripeColors ? (
                          // Stripe belt - 70% primary color, 30% stripe color
                          <View style={[styles.beltCircle, { 
                            borderColor: '#1F2937',
                            borderWidth: 2,
                            overflow: 'hidden'
                          }]}>
                            <View style={{ 
                              position: 'absolute',
                              left: 0,
                              top: 0,
                              bottom: 0,
                              width: '70%',
                              backgroundColor: item.stripeColors.color1
                            }} />
                            <View style={{ 
                              position: 'absolute',
                              right: 0,
                              top: 0,
                              bottom: 0,
                              width: '30%',
                              backgroundColor: item.stripeColors.color2
                            }} />
                            <Text style={[styles.beltNumber, { 
                              color: '#333333',
                              zIndex: 1,
                              textShadowColor: 'rgba(255, 255, 255, 0.8)',
                              textShadowOffset: { width: 0, height: 0 },
                              textShadowRadius: 3
                            }]}>
                              {item.level}
                            </Text>
                          </View>
                        ) : (
                          // Regular belt - solid circle
                          <View style={[styles.beltCircle, { 
                            backgroundColor: item.color,
                            borderColor: '#1F2937',
                            borderWidth: 2
                          }]}>
                            <Text style={[styles.beltNumber, { 
                              color: item.textColor || (item.color === '#FFFFFF' ? '#333' : '#ffffff')
                            }]}>
                              {item.level}
                            </Text>
                          </View>
                        )}
                        <View style={styles.beltInfo}>
                          <Text style={styles.beltName}>{item.name}</Text>
                          <Text style={styles.beltSubtitle}>Level {item.level}</Text>
                        </View>
                      </View>
                      
                      <View style={styles.requirementsContainer}>
                        <Text style={styles.requirementsHeader}>Requirements:</Text>
                        {item.requirements.map((req, index) => (
                          <View key={index} style={styles.requirementRow}>
                            <View style={styles.bulletPoint} />
                            <Text style={styles.requirementText}>{req}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  </>
                ) : item.type === 'promotion' ? (
                  // Promotion Display: Clean card with actual belt colors
                  <>
                    <View style={styles.promotionContainer}>
                      <Text style={styles.studentLabel}>Student: {item.studentName}</Text>
                      
                      <View style={styles.progressionContainer}>
                        <View style={styles.progressionRow}>
                          <Text style={styles.fromText}>From:</Text>
                          
                          {/* From Belt Circle */}
                          <View style={styles.beltDot}>
                            {(() => {
                              const fromBeltInfo = getBeltColorInfo(item.fromBelt);
                              return fromBeltInfo.isStripe && fromBeltInfo.stripeColors ? (
                                <View style={[styles.colorCircle, { 
                                  borderColor: '#1F2937',
                                  borderWidth: 2,
                                  overflow: 'hidden'
                                }]}>
                                  <View style={{ 
                                    position: 'absolute',
                                    left: 0,
                                    top: 0,
                                    bottom: 0,
                                    width: '70%',
                                    backgroundColor: fromBeltInfo.stripeColors.color1
                                  }} />
                                  <View style={{ 
                                    position: 'absolute',
                                    right: 0,
                                    top: 0,
                                    bottom: 0,
                                    width: '30%',
                                    backgroundColor: fromBeltInfo.stripeColors.color2
                                  }} />
                                </View>
                              ) : (
                                <View style={[styles.colorCircle, { 
                                  backgroundColor: fromBeltInfo.color,
                                  borderColor: '#1F2937',
                                  borderWidth: 2
                                }]} />
                              );
                            })()}
                          </View>
                          
                          <Icon name="arrow-forward" size={18} color="#95a5a6" />
                          
                          {/* To Belt Circle */}
                          <View style={styles.beltDot}>
                            {(() => {
                              const toBeltInfo = getBeltColorInfo(item.toBelt);
                              return toBeltInfo.isStripe && toBeltInfo.stripeColors ? (
                                <View style={[styles.colorCircle, { 
                                  borderColor: '#1F2937',
                                  borderWidth: 2,
                                  overflow: 'hidden'
                                }]}>
                                  <View style={{ 
                                    position: 'absolute',
                                    left: 0,
                                    top: 0,
                                    bottom: 0,
                                    width: '70%',
                                    backgroundColor: toBeltInfo.stripeColors.color1
                                  }} />
                                  <View style={{ 
                                    position: 'absolute',
                                    right: 0,
                                    top: 0,
                                    bottom: 0,
                                    width: '30%',
                                    backgroundColor: toBeltInfo.stripeColors.color2
                                  }} />
                                </View>
                              ) : (
                                <View style={[styles.colorCircle, { 
                                  backgroundColor: toBeltInfo.color,
                                  borderColor: '#1F2937',
                                  borderWidth: 2
                                }]} />
                              );
                            })()}
                          </View>
                          
                          <View style={styles.actionIcons}>
                            <TouchableOpacity style={styles.viewIcon}>
                              <Icon name="visibility" size={18} color="#3498db" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.deleteIcon}>
                              <Icon name="delete" size={18} color="#006CB5" />
                            </TouchableOpacity>
                          </View>
                        </View>
                        
                        <View style={styles.beltNamesRow}>
                          <Text style={styles.beltNameLabel}>{item.fromBelt}</Text>
                          <Text style={styles.beltNameLabel}>{item.toBelt}</Text>
                        </View>
                      </View>
                      
                      <View style={styles.instructorRow}>
                        <Text style={styles.instructorInfo}>Instructor: {item.instructor}</Text>
                        <Text style={styles.dateInfo}>{item.date}</Text>
                      </View>
                    </View>
                  </>
                ) : item.type === 'upcoming' ? (
                  // Upcoming Test Display: Always show test info, conditionally show certificate
                  <>
                    <View style={styles.upcomingHeader}>
                      <View style={styles.upcomingInfo}>
                        <View style={styles.upcomingIcon}>
                          <Icon name="schedule" size={24} color="#FF9800" />
                        </View>
                        <View style={styles.upcomingDetails}>
                          <Text style={styles.upcomingStudent}>{item.studentName}</Text>
                          <Text style={styles.upcomingTest}>{item.currentBelt} → {item.testingFor}</Text>
                        </View>
                      </View>
                      <Text style={styles.upcomingDate}>{item.date}</Text>
                    </View>
                    
                    <View style={styles.upcomingContent}>
                      {/* Certificate Section - Only show if certificate exists */}
                      {(item.certificateCode || item.certificateUrl) && (
                        <View style={styles.certificateSection}>
                          <View style={styles.certificateHeader}>
                            <View style={styles.certificateIconContainer}>
                              <Icon name="card-membership" size={20} color="#006CB5" />
                            </View>
                            <View style={styles.certificateInfo}>
                              <Text style={styles.certificateLabel}>Certificate Code</Text>
                              <Text style={styles.certificateCode}>{item.certificateCode || 'N/A'}</Text>
                            </View>
                          </View>
                          
                          {item.certificateUrl && (
                            <View style={styles.certificateButtons}>
                              <TouchableOpacity 
                                style={styles.viewButton}
                                onPress={() => handleViewCertificate(item.certificateUrl, item.certificateCode, item)}
                              >
                                <Icon name="visibility" size={16} color="#fff" />
                                <Text style={styles.viewButtonText}>View</Text>
                              </TouchableOpacity>
                              
                              <TouchableOpacity 
                                style={styles.downloadButton}
                                onPress={() => handleDownloadCertificate(item.certificateUrl, item.certificateCode)}
                              >
                                <Icon name="file-download" size={16} color="#fff" />
                                <Text style={styles.downloadButtonText}>Download</Text>
                              </TouchableOpacity>
                            </View>
                          )}
                        </View>
                      )}
                      
                      {/* Notes - Always show if available */}
                      {item.notes && (
                        <View style={styles.upcomingRow}>
                          <Text style={styles.upcomingLabel}>Notes:</Text>
                          <Text style={styles.upcomingNotes}>{item.notes}</Text>
                        </View>
                      )}
                    </View>
                  </>
                ) : (
                  // Promotion Display: Student, From, To, Date, Instructor
                  <>
                    <View style={styles.promotionHeader}>
                      <View style={styles.promotionInfo}>
                        <View style={styles.promotionIcon}>
                          <Icon name="trending-up" size={24} color="#10B981" />
                        </View>
                        <View style={styles.promotionDetails}>
                          <Text style={styles.promotionStudent}>{item.studentName}</Text>
                          <Text style={styles.promotionId}>ID: {item.studentId}</Text>
                        </View>
                      </View>
                      <Text style={styles.promotionDate}>{item.date}</Text>
                    </View>
                    
                    <View style={styles.promotionContent}>
                      <View style={styles.promotionRow}>
                        <Text style={styles.promotionLabel}>From:</Text>
                        <Text style={styles.promotionValue}>{item.fromBelt}</Text>
                      </View>
                      <View style={styles.promotionRow}>
                        <Text style={styles.promotionLabel}>To:</Text>
                        <Text style={[styles.promotionValue, styles.promotionToBelt]}>{item.toBelt}</Text>
                      </View>
                      <View style={styles.promotionRow}>
                        <Text style={styles.promotionLabel}>Instructor:</Text>
                        <Text style={styles.promotionValue}>{item.instructor}</Text>
                      </View>
                      {item.notes && (
                        <View style={styles.promotionRow}>
                          <Text style={styles.promotionLabel}>Notes:</Text>
                          <Text style={styles.promotionNotes}>{item.notes}</Text>
                        </View>
                      )}
                    </View>
                  </>
                )}
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Certificate View Modal */}
      <Modal
        visible={viewingCertificate !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setViewingCertificate(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderInfo}>
                <Text style={styles.modalTitle}>Certificate</Text>
                {viewingCertificate && (
                  <Text style={styles.modalSubtitle}>
                    {viewingCertificate.studentName} - {viewingCertificate.testingFor}
                  </Text>
                )}
              </View>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setViewingCertificate(null)}
              >
                <Icon name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalContent}>
              {viewingCertificate && (
                <>
                  {imageLoading && (
                    <View style={styles.imageLoadingContainer}>
                      <ActivityIndicator size="large" color="#006CB5" />
                      <Text style={styles.imageLoadingText}>Loading certificate...</Text>
                    </View>
                  )}
                  
                  {imageError && (
                    <View style={styles.imageErrorContainer}>
                      <Icon name="error-outline" size={64} color="#006CB5" />
                      <Text style={styles.imageErrorText}>Failed to load certificate</Text>
                      <Text style={styles.imageErrorSubtext}>
                        The certificate file may not be available
                      </Text>
                    </View>
                  )}
                  
                  <Image
                    source={{ 
                      uri: viewingCertificate.url,
                      headers: {
                        'Accept': 'image/jpeg,image/png,image/jpg,*/*',
                      }
                    }}
                    style={[styles.certificateImage, (imageLoading || imageError) && { display: 'none' }]}
                    resizeMode="contain"
                    onLoadStart={() => {
                      console.log('📸 Image loading started:', viewingCertificate.url);
                      setImageLoading(true);
                      setImageError(false);
                    }}
                    onLoad={() => {
                      console.log('✅ Image loaded successfully');
                      setImageLoading(false);
                      setImageError(false);
                    }}
                    onError={(error) => {
                      console.error('❌ Image load error:', error.nativeEvent.error);
                      setImageLoading(false);
                      setImageError(true);
                    }}
                  />
                </>
              )}
            </View>

            {viewingCertificate && (
              <View style={styles.modalFooter}>
                <Text style={styles.certificateCodeText}>
                  Code: {viewingCertificate.code}
                </Text>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#006CB5',
  },
  container: {
    flex: 1,
    backgroundColor: '#006CB5',
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
  calendarButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Content
  content: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5',
  },

  // Clean Tab Design
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderRadius: 25,
    padding: 4,
    marginTop: 16,
    marginBottom: 16,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    backgroundColor: '#006CB5',
    shadowColor: '#006CB5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },
  activeTabLabel: {
    color: '#ffffff',
    fontWeight: '700',
  },

  // Belt Level Card Styles
  beltCard: {
    padding: 0,
  },
  beltHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  beltCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  beltNumber: {
    fontSize: 18,
    fontWeight: '900',
  },
  beltInfo: {
    flex: 1,
  },
  beltName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 2,
  },
  beltSubtitle: {
    fontSize: 12,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  requirementsContainer: {
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  requirementsHeader: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  requirementRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  bulletPoint: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#006CB5',
    marginRight: 8,
    marginTop: 5,
  },
  requirementText: {
    fontSize: 12,
    color: '#64748b',
    flex: 1,
    lineHeight: 16,
  },

  // Promotion Card Styles - Clean Design
  promotionContainer: {
    padding: 0,
  },
  studentLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 12,
  },
  progressionContainer: {
    marginBottom: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 12,
  },
  progressionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 0,
  },
  fromText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
    marginRight: 8,
    minWidth: 35,
  },
  beltDot: {
    marginHorizontal: 6,
  },
  colorCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
  },
  actionIcons: {
    flexDirection: 'row',
    marginLeft: 'auto',
    gap: 0,
    display: 'none',
  },
  viewIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'none',
  },
  deleteIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ffebee',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'none',
  },
  beltNamesRow: {
    flexDirection: 'row',
    paddingLeft: 0,
    marginTop: 8,
  },
  beltNameLabel: {
    fontSize: 11,
    color: '#7f8c8d',
    fontWeight: '500',
    marginRight: 30,
  },
  instructorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  instructorInfo: {
    fontSize: 12,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  dateInfo: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },

  // Belt Levels Container
  levelsContainer: {
    marginTop: 20,
    paddingBottom: 20,
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#64748b',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 20,
  },

  // Level Card
  levelCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  levelInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  beltCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  levelDetails: {
    flex: 1,
  },
  levelName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 4,
  },
  levelDate: {
    fontSize: 14,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  levelStudents: {
    fontSize: 12,
    color: '#95a5a6',
    fontWeight: '500',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },

  // Progress Section
  progressSection: {
    marginBottom: 15,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2c3e50',
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },

  // Requirements Section
  requirementsSection: {
    marginTop: 5,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 8,
  },
  requirementsList: {
    gap: 4,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
  },
  requirementText: {
    fontSize: 13,
    color: '#7f8c8d',
    marginLeft: 8,
    flex: 1,
  },

  // Belt Level Text
  beltLevel: {
    fontSize: 16,
    fontWeight: '900',
  },

  // Promotion Styles
  promotionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  promotionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  promotionIcon: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#e8f5e8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  promotionDetails: {
    flex: 1,
  },
  promotionStudent: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 2,
  },
  promotionId: {
    fontSize: 11,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  promotionDate: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },
  promotionContent: {
    gap: 6,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 10,
  },
  promotionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 2,
  },
  promotionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
    minWidth: 60,
  },
  promotionValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2c3e50',
    flex: 1,
  },
  promotionToBelt: {
    color: '#10B981',
    fontWeight: '700',
  },
  promotionNotes: {
    fontSize: 11,
    color: '#7f8c8d',
    fontStyle: 'italic',
    flex: 1,
  },

  // Upcoming Test Styles
  upcomingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  upcomingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  upcomingIcon: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#fff3cd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  upcomingDetails: {
    flex: 1,
  },
  upcomingStudent: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 2,
  },
  upcomingTest: {
    fontSize: 12,
    color: '#FF9800',
    fontWeight: '600',
  },
  upcomingDate: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },
  upcomingContent: {
    gap: 10,
  },
  upcomingRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 2,
  },
  upcomingLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
    minWidth: 55,
  },
  upcomingNotes: {
    fontSize: 12,
    color: '#7f8c8d',
    fontStyle: 'italic',
    flex: 1,
  },
  
  // Certificate Section Styles
  certificateSection: {
    backgroundColor: '#fff3cd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#006CB5',
  },
  certificateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  certificateIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  certificateInfo: {
    flex: 1,
  },
  certificateLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#856404',
    marginBottom: 2,
  },
  certificateCode: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2c3e50',
    letterSpacing: 0.5,
  },
  certificateButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  viewButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3498db',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    gap: 6,
    shadowColor: '#3498db',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  viewButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },
  downloadButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#006CB5',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    gap: 6,
    shadowColor: '#006CB5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  downloadButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },
  
  // Status Badge for Upcoming Tests
  statusBadgeSmall: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },

  // Loading States
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7f8c8d',
    marginTop: 16,
  },

  // Filter Styles
  filtersSection: {
    marginBottom: 12,
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 6,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  filterChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 18,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  activeFilterChip: {
    backgroundColor: '#006CB5',
    borderColor: '#006CB5',
  },
  filterChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
  },
  activeFilterChipText: {
    color: '#fff',
  },

  // Search Styles
  searchSection: {
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 40,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#2c3e50',
    padding: 0,
  },

  // Promotions Header
  promotionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2c3e50',
  },
  recordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#006CB5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
  },
  recordButtonText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#fff',
  },

  // Certificate View Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: SCREEN_WIDTH * 0.95,
    height: SCREEN_HEIGHT * 0.85,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#006CB5',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  modalHeaderInfo: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 2,
  },
  modalSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  modalCloseButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  certificateImage: {
    width: '100%',
    height: '100%',
  },
  imageLoadingContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageLoadingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    marginTop: 12,
  },
  imageErrorContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  imageErrorText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#006CB5',
    marginTop: 12,
    textAlign: 'center',
  },
  imageErrorSubtext: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 8,
    textAlign: 'center',
  },
  modalFooter: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    alignItems: 'center',
  },
  certificateCodeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
});

export default LevelStatusScreen;