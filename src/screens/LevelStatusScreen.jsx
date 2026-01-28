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
} from 'react-native';
import { useNavigation } from '../context/NavigationContext';
import { ApiService } from '../services';
import API_CONFIG from '../config/api';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// Icon component using react-native-vector-icons
const Icon = ({ name, size = 24, color = '#000' }) => {
  return <MaterialIcons name={name} size={size} color={color} />;
};

const LevelStatusScreen = () => {
  const { navigate } = useNavigation();
  const [viewMode, setViewMode] = useState('Belt Levels'); // 'Belt Levels', 'Promotions', 'Upcoming'
  const [levelData, setLevelData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedBeltType, setSelectedBeltType] = useState('All Belts');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [searchQuery, setSearchQuery] = useState('');

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
        console.log('🌐 Belt Levels API URL: /belts/levels');
        
        // Try to fetch belt levels from backend
        let backendBelts = [];
        try {
          console.log('🔄 Trying authenticated belt levels endpoint: /belts/levels');
          
          const result = await ApiService.get('/belts/levels');
          
          console.log('✅ Authenticated belt levels response:', result);
          
          if (result && result.status === 'success' && result.data && result.data.belts) {
            backendBelts = result.data.belts;
            console.log('✅ Got', backendBelts.length, 'belt levels from backend');
          }
        } catch (backendError) {
          console.log('⚠️ Authenticated request failed:', backendError.message);
          
          // Try public endpoint as fallback
          try {
            console.log('🔄 Trying public belt levels endpoint as fallback...');
            
            const publicUrl = `${API_CONFIG.BASE_URL}/belts-public`;
            
            const publicResponse = await fetch(publicUrl, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            });
            
            if (publicResponse.ok) {
              const publicResult = await publicResponse.json();
              console.log('✅ Public belt levels response:', publicResult);
              
              if (publicResult && publicResult.status === 'success' && publicResult.data && publicResult.data.belts) {
                backendBelts = publicResult.data.belts;
                console.log('✅ Got', backendBelts.length, 'belt levels from public endpoint');
              }
            }
          } catch (publicError) {
            console.log('⚠️ Public endpoint also failed:', publicError.message);
          }
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
        
        // Try to fetch promotions from backend
        let backendPromotions = [];
        try {
          const result = await ApiService.get('/belts/promotions');
          
          if (result && result.status === 'success' && result.data && result.data.promotions) {
            backendPromotions = result.data.promotions;
            console.log('✅ Got', backendPromotions.length, 'promotions from backend');
          }
        } catch (backendError) {
          console.log('⚠️ Promotions request failed:', backendError.message);
          
          // Try public endpoint as fallback
          try {
            const publicUrl = `${API_CONFIG.BASE_URL}/promotions-public`;
            
            const publicResponse = await fetch(publicUrl, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            });
            
            if (publicResponse.ok) {
              const publicResult = await publicResponse.json();
              
              if (publicResult && publicResult.status === 'success' && publicResult.data && publicResult.data.promotions) {
                backendPromotions = publicResult.data.promotions;
                console.log('✅ Got', backendPromotions.length, 'promotions from public endpoint');
              }
            }
          } catch (publicError) {
            console.log('⚠️ Public promotions endpoint also failed:', publicError.message);
          }
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
        console.log('🔄 Loading upcoming belt tests from backend...');
        
        // Try to fetch upcoming belt tests from backend
        let backendTests = [];
        try {
          // Try authenticated endpoint first
          const result = await ApiService.get('/belts/tests', { upcoming: 'true' });
          
          if (result && result.status === 'success' && result.data && result.data.tests) {
            backendTests = result.data.tests;
            console.log('✅ Got', backendTests.length, 'upcoming tests from backend');
          }
        } catch (backendError) {
          console.log('⚠️ Upcoming tests request failed:', backendError.message);
          
          // Try public endpoint as fallback
          try {
            const publicUrl = `${API_CONFIG.BASE_URL}/belt-tests-public`;
            
            const publicResponse = await fetch(publicUrl, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            });
            
            if (publicResponse.ok) {
              const publicResult = await publicResponse.json();
              
              if (publicResult && publicResult.status === 'success' && publicResult.data && publicResult.data.tests) {
                backendTests = publicResult.data.tests;
                console.log('✅ Got', backendTests.length, 'upcoming tests from public endpoint');
              }
            }
          } catch (publicError) {
            console.log('⚠️ Public upcoming tests endpoint also failed:', publicError.message);
          }
        }
        
        // Process upcoming tests
        if (backendTests.length > 0) {
          const processedTests = processBackendTestData(backendTests);
          setLevelData(processedTests);
          console.log('✅ Using backend test data:', processedTests.length, 'upcoming tests');
        } else {
          console.log('📊 No backend data, using mock test data');
          const mockTests = getMockUpcomingTestsData();
          setLevelData(mockTests);
          console.log('✅ Using mock test data:', mockTests.length, 'upcoming tests');
        }
      } else {
        // Fallback for any other view mode
        const mockBelts = getMockBeltLevelsData();
        setLevelData(mockBelts);
      }
    } catch (error) {
      console.error('❌ Failed to load level data:', error);
      // Always fallback to mock data
      if (viewMode === 'Promotions') {
        const mockPromotions = getMockPromotionsData();
        setLevelData(mockPromotions);
      } else {
        const mockBelts = getMockBeltLevelsData();
        setLevelData(mockBelts);
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

  // Process backend belt data
  const processBackendBeltData = (beltsFromBackend) => {
    console.log('🔄 Processing belt levels from backend:', beltsFromBackend.length);
    
    return beltsFromBackend.map(belt => {
      // Determine status based on belt level and students
      let status = 'Available';
      if (belt.students > 0) {
        status = 'Active';
      }
      
      // Determine progress based on student count (mock calculation)
      const maxStudents = 30; // Assume max 30 students per belt
      const progress = Math.min((belt.students / maxStudents) * 100, 100);
      
      console.log(`🥋 Belt: ${belt.name}, Level: ${belt.level}, Students: ${belt.students}, Status: ${status}`);
      
      return {
        id: belt._id || belt.id,
        type: 'belt',
        name: belt.name || 'Unknown Belt',
        level: belt.level || 1,
        color: belt.hex || '#FFFFFF',
        borderColor: belt.hex ? belt.hex : '#E5E7EB',
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
    
    return testsFromBackend.map(test => {
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
        readiness: test.readiness || 0,
        status: test.status || 'scheduled',
        notes: test.notes || ''
      };
    });
  };

  // Mock upcoming tests data
  const getMockUpcomingTestsData = () => {
    return [
      {
        id: 1,
        type: 'upcoming',
        studentName: 'Kevin Martinez',
        currentBelt: 'White Belt',
        testingFor: 'Yellow Belt',
        date: '15 Feb 2026',
        readiness: 85,
        status: 'scheduled',
        notes: 'Student shows good progress in basic techniques.'
      },
      {
        id: 2,
        type: 'upcoming',
        studentName: 'Rachel Green',
        currentBelt: 'Yellow Belt',
        testingFor: 'Orange Belt',
        date: '20 Feb 2026',
        readiness: 90,
        status: 'scheduled',
        notes: 'Excellent form execution. Very confident.'
      },
      {
        id: 3,
        type: 'upcoming',
        studentName: 'Tom Anderson',
        currentBelt: 'Orange Belt',
        testingFor: 'Green Belt',
        date: '25 Feb 2026',
        readiness: 75,
        status: 'scheduled',
        notes: 'Good technique but needs more sparring practice.'
      },
      {
        id: 4,
        type: 'upcoming',
        studentName: 'Nina Patel',
        currentBelt: 'Green Belt',
        testingFor: 'Blue Belt',
        date: '05 Mar 2026',
        readiness: 95,
        status: 'scheduled',
        notes: 'Outstanding student with leadership qualities.'
      },
      {
        id: 5,
        type: 'upcoming',
        studentName: 'Michael Johnson',
        currentBelt: 'Brown Belt',
        testingFor: 'Black Belt 1st Dan',
        date: '25 Mar 2026',
        readiness: 92,
        status: 'scheduled',
        notes: 'Exceptional candidate for black belt.'
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
      { id: 1, type: 'belt', name: 'White Belt', level: 1, color: '#FFFFFF', borderColor: '#E5E7EB', date: '15 Jan 2024', status: 'Achieved', progress: 100, requirements: ['Basic Stances', 'Basic Blocks'], students: 25, beltType: 'Colored Belt' },
      { id: 2, type: 'belt', name: 'Yellow Belt', level: 2, color: '#F59E0B', borderColor: '#D97706', date: '20 Feb 2024', status: 'Achieved', progress: 100, requirements: ['Taegeuk Il Jang', 'Front Kick'], students: 20, beltType: 'Colored Belt' },
      { id: 3, type: 'belt', name: 'Green Belt', level: 3, color: '#10B981', borderColor: '#059669', date: '10 Mar 2024', status: 'Achieved', progress: 100, requirements: ['Taegeuk Sam Jang', 'Side Kick'], students: 15, beltType: 'Colored Belt' },
      { id: 4, type: 'belt', name: 'Blue Belt', level: 4, color: '#3B82F6', borderColor: '#2563EB', date: '05 Apr 2024', status: 'Available', progress: 75, requirements: ['Taegeuk Sa Jang', 'Hook Kick'], students: 12, beltType: 'Colored Belt' },
      { id: 5, type: 'belt', name: 'Purple Belt', level: 5, color: '#8B5CF6', borderColor: '#7C3AED', date: '15 May 2024', status: 'Available', progress: 45, requirements: ['Taegeuk Oh Jang', 'Spinning Kicks'], students: 10, beltType: 'Colored Belt' },
      { id: 6, type: 'belt', name: 'Brown Belt', level: 6, color: '#A3A3A3', borderColor: '#737373', date: '12 Jun 2024', status: 'Available', progress: 30, requirements: ['Taegeuk Yuk Jang', 'Jump Kicks'], students: 8, beltType: 'Colored Belt' },
      { id: 7, type: 'belt', name: 'Black Belt 1st Dan', level: 7, color: '#1F2937', borderColor: '#111827', date: '25 Jul 2024', status: 'Available', progress: 20, requirements: ['Koryo', 'All Techniques Mastery'], students: 5, beltType: 'Black Belt' },
      { id: 8, type: 'belt', name: 'Black Belt 2nd Dan', level: 8, color: '#1F2937', borderColor: '#111827', date: '25 Aug 2024', status: 'Available', progress: 10, requirements: ['Keumgang', 'Leadership Skills'], students: 3, beltType: 'Black Belt' },
      { id: 9, type: 'belt', name: 'Black Belt 3rd Dan', level: 9, color: '#1F2937', borderColor: '#111827', date: '20 Sep 2024', status: 'Available', progress: 5, requirements: ['Taebaek', 'Teaching Practice'], students: 2, beltType: 'Black Belt' }
    ];
  };

  const beltLevelsData = levelData.length > 0 ? levelData : getMockBeltLevelsData();

  const handleBackPress = () => {
    navigate('Dashboard');
  };

  // Simplified filter - only by view mode
  const filteredLevels = beltLevelsData.filter(item => {
    if (viewMode === 'Belt Levels') {
      // Apply belt type filter
      if (selectedBeltType !== 'All Belts') {
        if (selectedBeltType === 'Colored Belts' && item.beltType !== 'Colored Belt') return false;
        if (selectedBeltType === 'Black Belts' && item.beltType !== 'Black Belt') return false;
      }
      
      // Apply status filter
      if (selectedStatus !== 'All Status') {
        if (selectedStatus === 'Active' && item.status !== 'Active') return false;
        if (selectedStatus === 'Inactive' && item.status !== 'Inactive') return false;
        if (selectedStatus === 'Testing Ready' && item.progress < 80) return false;
      }
      
      // Apply search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        if (!item.name.toLowerCase().includes(query)) return false;
      }
      
      return item.type === 'belt';
    }
    if (viewMode === 'Promotions') return item.type === 'promotion';
    if (viewMode === 'Upcoming') return item.type === 'upcoming';
    return true;
  });

  // Loading state
  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="rgba(251, 247, 246, 1)" />
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
          <ActivityIndicator size="large" color="#e74c3c" />
          <Text style={styles.loadingText}>Loading level data...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="rgba(240, 234, 233, 1)" />
      
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
            colors={['rgba(239, 32, 9, 1)']}
            tintColor="#e74c3c"
          />
        }
      >
        {/* Header Section with Record Promotion Button */}
        {viewMode === 'Promotions' && (
          <View style={styles.promotionsHeader}>
            <Text style={styles.sectionTitle}>Recent Promotions</Text>
            <TouchableOpacity style={styles.recordButton}>
              <Icon name="add" size={20} color="#fff" />
              <Text style={styles.recordButtonText}>Record Promotion</Text>
            </TouchableOpacity>
          </View>
        )}

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

        {/* Belt Levels Filters - Only show for Belt Levels */}
        {viewMode === 'Belt Levels' && (
          <>
            <View style={styles.filtersSection}>
              <Text style={styles.filterLabel}>Belt Type:</Text>
              <View style={styles.filterRow}>
                {['All Belts', 'Colored Belts', 'Black Belts'].map((type) => (
                  <TouchableOpacity 
                    key={type} 
                    style={[
                      styles.filterChip,
                      selectedBeltType === type && styles.activeFilterChip
                    ]}
                    onPress={() => setSelectedBeltType(type)}
                  >
                    <Text style={[
                      styles.filterChipText,
                      selectedBeltType === type && styles.activeFilterChipText
                    ]}>
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <View style={styles.filtersSection}>
              <Text style={styles.filterLabel}>Status:</Text>
              <View style={styles.filterRow}>
                {['All Status', 'Active', 'Inactive', 'Testing Ready'].map((status) => (
                  <TouchableOpacity 
                    key={status} 
                    style={[
                      styles.filterChip,
                      selectedStatus === status && styles.activeFilterChip
                    ]}
                    onPress={() => setSelectedStatus(status)}
                  >
                    <Text style={[
                      styles.filterChipText,
                      selectedStatus === status && styles.activeFilterChipText
                    ]}>
                      {status}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.searchSection}>
              <View style={styles.searchContainer}>
                <Icon name="search" size={20} color="#95a5a6" style={styles.searchIcon} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search belt levels..."
                  placeholderTextColor="#95a5a6"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
            </View>
          </>
        )}

        {/* Remove Belt Type and Status filters for cleaner UI */}

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
                        <View style={[styles.beltCircle, { 
                          backgroundColor: item.color,
                          borderColor: item.color === '#FFFFFF' ? '#E5E7EB' : item.color
                        }]}>
                          <Text style={[styles.beltNumber, { 
                            color: item.color === '#FFFFFF' ? '#333' : '#ffffff' 
                          }]}>
                            {item.level}
                          </Text>
                        </View>
                        <View style={styles.beltInfo}>
                          <Text style={styles.beltName}>{item.name}</Text>
                          <Text style={styles.beltSubtitle}>Level {item.level} • {item.students} students</Text>
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
                  // Promotion Display: Clean card matching the image
                  <>
                    <View style={styles.promotionContainer}>
                      <Text style={styles.studentLabel}>Student: {item.studentName}</Text>
                      
                      <View style={styles.progressionContainer}>
                        <View style={styles.progressionRow}>
                          <Text style={styles.fromText}>From:</Text>
                          <View style={styles.beltDot}>
                            <View style={[styles.colorCircle, { 
                              backgroundColor: '#FFFFFF', 
                              borderColor: '#E5E7EB' 
                            }]} />
                          </View>
                          
                          <Icon name="arrow-forward" size={18} color="#95a5a6" />
                          
                          <View style={styles.beltDot}>
                            <View style={[styles.colorCircle, { 
                              backgroundColor: '#F59E0B', 
                              borderColor: '#D97706' 
                            }]} />
                          </View>
                          
                          <View style={styles.actionIcons}>
                            <TouchableOpacity style={styles.viewIcon}>
                              <Icon name="visibility" size={18} color="#3498db" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.deleteIcon}>
                              <Icon name="delete" size={18} color="rgba(231, 34, 12, 1)" />
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
                  // Upcoming Test Display: Student, Current Belt, Testing For, Date, Readiness
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
                      <View style={styles.readinessSection}>
                        <View style={styles.readinessHeader}>
                          <Text style={styles.readinessLabel}>Readiness</Text>
                          <Text style={styles.readinessPercentage}>{item.readiness}%</Text>
                        </View>
                        <View style={styles.readinessBar}>
                          <View style={[styles.readinessFill, { 
                            width: `${item.readiness}%`,
                            backgroundColor: item.readiness >= 80 ? '#10B981' : item.readiness >= 60 ? '#FF9800' : '#EF4444'
                          }]} />
                        </View>
                      </View>
                      
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
    backgroundColor: '#f60909ff',
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
    backgroundColor: 'rgba(237, 48, 11, 1)',
    shadowColor: '#df2d0dff',
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
    backgroundColor: 'rgba(236, 34, 12, 1)',
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
  readinessSection: {
    marginBottom: 6,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 10,
  },
  readinessHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  readinessLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  readinessPercentage: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2c3e50',
  },
  readinessBar: {
    width: '100%',
    height: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 3,
    overflow: 'hidden',
  },
  readinessFill: {
    height: '100%',
    borderRadius: 3,
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
    backgroundColor: 'hsla(0, 91%, 50%, 1.00)',
    borderColor: '#e74c3c',
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
    backgroundColor: 'rgba(231, 33, 11, 1)',
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
});

export default LevelStatusScreen;
