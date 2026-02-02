import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import StudentService from '../services/studentService';
import API_CONFIG from '../config/api';
import { useStudent } from '../context/StudentContext';
import { useNavigation } from '../context/NavigationContext';
// Vector Icons
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';

// Icon component with proper vector icons
const Icon = ({ name, size = 24, color = '#000', type = 'MaterialIcons' }) => {
  const IconComponent = {
    MaterialIcons,
    MaterialCommunityIcons,
    Ionicons,
    FontAwesome5,
    AntDesign,
    Feather,
  }[type];

  return <IconComponent name={name} size={size} color={color} />;
};

const { width } = Dimensions.get('window');

const AttendanceScreen = () => {
  const { isAuthenticated } = useStudent();
  const { navigate } = useNavigation();
  const [viewMode, setViewMode] = useState('Yearly'); // 'Yearly' or 'Monthly'
  const [selectedYear, setSelectedYear] = useState(2024);
  const [selectedMonth, setSelectedMonth] = useState('Jan');
  const [attendanceData, setAttendanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Academic years and months data
  const academicYears = [2024, 2025, 2026, 2027];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Load attendance data from backend
  useEffect(() => {
    loadAttendanceData();
  }, [selectedYear, selectedMonth, viewMode, isAuthenticated]);

  // Helper function to get month index
  const getMonthIndex = (monthName) => {
    if (monthName === 'All Months') return null;
    const monthMap = {
      'January': 0, 'February': 1, 'March': 2, 'April': 3, 'May': 4, 'June': 5,
      'July': 6, 'August': 7, 'September': 8, 'October': 9, 'November': 10, 'December': 11,
      'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
      'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
    };
    return monthMap[monthName] || 0;
  };

  const loadAttendanceData = async () => {
    try {
      setLoading(true);
      
      // Check if user is authenticated
      if (!isAuthenticated) {
        console.log('⚠️ User not authenticated, using mock data');
        setAttendanceData(getMockAttendanceData());
        return;
      }
      
      console.log('🔄 Loading attendance data from backend...');
      console.log('🌐 Students API:', `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.STUDENT.LIST}`);
      console.log('🌐 Attendance API:', `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ATTENDANCE.LIST}`);
      
      // First, get the student record for the current user
      let studentRecord = null;
      try {
        const studentResponse = await StudentService.getStudentRecord();
        if (studentResponse.status === 'success') {
          studentRecord = studentResponse.data.student;
          console.log('👨‍🎓 Found student record:', studentRecord.fullName, 'ID:', studentRecord.id);
        }
      } catch (error) {
        console.log('⚠️ Could not fetch student record, will show all attendance data');
      }
      
      // Calculate date range based on selected year and month
      const startDate = new Date(selectedYear, getMonthIndex(selectedMonth), 1);
      const endDate = new Date(selectedYear, getMonthIndex(selectedMonth) + 1, 0);
      
      console.log('📅 Date range:', {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        studentId: studentRecord?.id
      });
      
      // Get attendance data with date filters
      const queryParams = {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0]
      };
      
      // For demo purposes, don't filter by student ID to show all admin panel data
      // if (studentRecord?.id) {
      //   queryParams.studentId = studentRecord.id;
      // }
      
      console.log('📡 Fetching attendance with params:', queryParams);
      
      const response = await StudentService.getAttendance(queryParams);
      
      console.log('✅ Attendance API response:', response);
      
      if (response && response.status === 'success' && response.data && response.data.attendance) {
        const processedData = processBackendAttendanceData(response.data.attendance);
        setAttendanceData(processedData);
        console.log('✅ Processed attendance data set');
      } else {
        console.log('📊 No attendance data from backend, using mock data');
        setAttendanceData(getMockAttendanceData());
      }
    } catch (error) {
      console.error('❌ Failed to load attendance:', error);
      console.log('🔄 Falling back to mock data');
      // Fallback to mock data if API fails
      setAttendanceData(getMockAttendanceData());
    } finally {
      setLoading(false);
    }
  };

  // Process backend attendance data
  const processBackendAttendanceData = (attendanceRecords) => {
    console.log('🔄 Processing attendance records:', attendanceRecords.length);
    
    if (!attendanceRecords || attendanceRecords.length === 0) {
      return {
        yearly: { percentage: '0%', present: 0, absent: 0, late: 0, excused: 0, records: [] },
        monthly: { percentage: '0%', present: 0, absent: 0, late: 0, excused: 0, records: [] }
      };
    }
    
    let present = 0;
    let absent = 0;
    let late = 0;
    let excused = 0;
    
    // Enhanced processing with more detailed data extraction
    const processedRecords = attendanceRecords.map(record => {
      const status = record.status?.toLowerCase() || 'present';
      
      // Count by status
      switch (status) {
        case 'present':
          present++;
          break;
        case 'absent':
          absent++;
          break;
        case 'late':
          late++;
          break;
        case 'excused':
          excused++;
          break;
        default:
          present++; // Default to present
      }
      
      // Return simplified record with only essential fields
      return {
        ...record,
        studentName: record.studentName || record.student?.fullName || 'Student',
        class: record.class || 'General Class',
      };
    });
    
    const total = present + absent + late + excused;
    const attendanceRate = total > 0 ? Math.round((present + late + excused) / total * 100) : 0;
    
    const processedData = {
      yearly: { 
        percentage: `${attendanceRate}%`, 
        present, 
        absent, 
        late,
        excused,
        records: processedRecords
      },
      monthly: { 
        percentage: `${attendanceRate}%`, 
        present, 
        absent, 
        late,
        excused,
        records: processedRecords
      }
    };
    
    console.log('✅ Processed attendance data:', {
      total: total,
      present: present,
      absent: absent,
      late: late,
      excused: excused,
      attendanceRate: attendanceRate + '%'
    });
    
    return processedData;
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAttendanceData();
    setRefreshing(false);
  };

  // Mock attendance data - Dynamic based on selected year/month
  const getMockAttendanceData = () => {
    // Define which year/month combinations have data
    const dataAvailable = {
      2024: ['Jan', 'Feb', 'Mar', 'Apr'],
      2025: ['Jan', 'Feb'],
      2026: ['Jan'],
      2027: [],
      2028: []
    };
    
    // Check if current selection has data
    const hasData = dataAvailable[selectedYear]?.includes(selectedMonth);
    
    if (!hasData) {
      return {
        yearly: { percentage: '0%', present: 0, absent: 0, late: 0 },
        monthly: { percentage: '0%', present: 0, absent: 0, late: 0 }
      };
    }
    
    // Return different data based on year/month combination
    const dataVariations = {
      2024: {
        'Jan': { yearly: { percentage: '95%', present: 20, absent: 1, late: 0 }, monthly: { percentage: '90%', present: 18, absent: 2, late: 1 } },
        'Feb': { yearly: { percentage: '100%', present: 22, absent: 0, late: 0 }, monthly: { percentage: '95%', present: 19, absent: 1, late: 0 } },
        'Mar': { yearly: { percentage: '88%', present: 17, absent: 2, late: 1 }, monthly: { percentage: '85%', present: 17, absent: 3, late: 0 } },
        'Apr': { yearly: { percentage: '92%', present: 18, absent: 1, late: 1 }, monthly: { percentage: '88%', present: 16, absent: 2, late: 2 } }
      },
      2025: {
        'Jan': { yearly: { percentage: '85%', present: 15, absent: 2, late: 1 }, monthly: { percentage: '80%', present: 14, absent: 3, late: 1 } },
        'Feb': { yearly: { percentage: '90%', present: 16, absent: 1, late: 1 }, monthly: { percentage: '85%', present: 15, absent: 2, late: 1 } }
      },
      2026: {
        'Jan': { yearly: { percentage: '75%', present: 12, absent: 3, late: 2 }, monthly: { percentage: '70%', present: 11, absent: 4, late: 2 } }
      }
    };
    
    return dataVariations[selectedYear]?.[selectedMonth] || {
      yearly: { percentage: '0%', present: 0, absent: 0, late: 0 },
      monthly: { percentage: '0%', present: 0, absent: 0, late: 0 }
    };
  };

  const attendanceStats = attendanceData || getMockAttendanceData();

  // Loading state
  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#e74c3c" />
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <Icon name="arrow-back" size={24} color="#fff" type="MaterialIcons" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Attendance</Text>
          <TouchableOpacity style={styles.calendarButton}>
            <Icon 
              name={viewMode === 'Yearly' ? 'date-range' : 'calendar-today'} 
              size={24} 
              color="#fff" 
              type="MaterialIcons" 
            />
          </TouchableOpacity>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#e74c3c" />
          <Text style={styles.loadingText}>Loading attendance data...</Text>
        </View>
      </View>
    );
  }

  // Generate attendance records based on stats
  const generateAttendanceRecords = (stats) => {
    // If we have real backend records, use them
    if (stats.records && stats.records.length > 0) {
      return stats.records.map((record, index) => {
        const date = new Date(record.date);
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        const dayName = dayNames[date.getDay()];
        const day = date.getDate().toString().padStart(2, '0');
        const month = monthNames[date.getMonth()];
        const year = date.getFullYear();
        
        let statusColor = '#10b981'; // Default green for Present
        let statusText = record.status?.toUpperCase() || 'PRESENT';
        let statusBgColor = '#d1fae5';
        
        if (record.status?.toLowerCase() === 'absent') {
          statusColor = '#ef4444';
          statusBgColor = '#fee2e2';
          statusText = 'ABSENT';
        } else if (record.status?.toLowerCase() === 'late') {
          statusColor = '#f59e0b';
          statusBgColor = '#fef3c7';
          statusText = 'LATE';
        } else if (record.status?.toLowerCase() === 'excused') {
          statusColor = '#3b82f6';
          statusBgColor = '#dbeafe';
          statusText = 'EXCUSED';
        }
        
        return {
          id: record._id || index,
          date: `${dayName}, ${day} ${month} ${year}`,
          shortDate: `${day} ${month}`,
          dayName: dayName,
          status: statusText,
          statusColor,
          statusBgColor,
          studentName: record.studentName || record.student?.fullName || 'Student',
          class: record.class || 'General Class', // Batch/Class field
        };
      }).sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date descending
    }
    
    // Fallback to mock data generation
    const records = [];
    const currentDate = new Date();
    let recordId = 1;
    
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Add present records
    for (let i = 0; i < stats.present; i++) {
      const date = new Date(currentDate);
      date.setDate(date.getDate() - i);
      
      const dayName = dayNames[date.getDay()];
      const day = date.getDate().toString().padStart(2, '0');
      const month = monthNames[date.getMonth()];
      
      records.push({
        id: recordId++,
        date: `${dayName}, ${day} ${month}`,
        status: 'PRESENT',
        statusColor: '#4CAF50',
      });
    }
    
    // Add absent records
    for (let i = 0; i < stats.absent; i++) {
      const date = new Date(currentDate);
      date.setDate(date.getDate() - (stats.present + i));
      
      const dayName = dayNames[date.getDay()];
      const day = date.getDate().toString().padStart(2, '0');
      const month = monthNames[date.getMonth()];
      
      records.push({
        id: recordId++,
        date: `${dayName}, ${day} ${month}`,
        status: 'ABSENT',
        statusColor: '#F44336',
      });
    }
    
    // Add late records
    for (let i = 0; i < stats.late; i++) {
      const date = new Date(currentDate);
      date.setDate(date.getDate() - (stats.present + stats.absent + i));
      
      const dayName = dayNames[date.getDay()];
      const day = date.getDate().toString().padStart(2, '0');
      const month = monthNames[date.getMonth()];
      
      records.push({
        id: recordId++,
        date: `${dayName}, ${day} ${month}`,
        status: 'LATE',
        statusColor: '#FF9800',
      });
    }
    
    // Sort by date (most recent first)
    return records.sort((a, b) => b.id - a.id);
  };

  const currentStats = viewMode === 'Yearly' ? attendanceStats.yearly : attendanceStats.monthly;
  const attendanceRecords = generateAttendanceRecords(currentStats);

  const handleViewModeToggle = () => {
    setViewMode(viewMode === 'Yearly' ? 'Monthly' : 'Yearly');
  };

  const handleBackPress = () => {
    navigate('Dashboard');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#e74c3c" />
      
      {/* Enhanced Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Icon name="arrow-back-ios" size={20} color="#fff" type="MaterialIcons" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Icon name="calendar-check" size={24} color="#fff" type="MaterialCommunityIcons" />
          <Text style={styles.headerTitle}>Attendance</Text>
        </View>
        <TouchableOpacity style={styles.calendarButton}>
          <Icon 
            name={viewMode === 'Yearly' ? 'date-range' : 'today'} 
            size={20} 
            color="#fff" 
            type="MaterialIcons" 
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
            colors={['#e74c3c']}
            tintColor="#e74c3c"
          />
        }
      >
        {/* Enhanced View Mode Toggle */}
        <View style={styles.viewModeContainer}>
          <View style={styles.viewModeLeft}>
            <Icon name="view-module" size={20} color="#2c3e50" type="MaterialIcons" />
            <Text style={styles.viewModeLabel}>Monthly View</Text>
          </View>
          <TouchableOpacity 
            style={styles.switchButton}
            onPress={handleViewModeToggle}
          >
            <Icon 
              name={viewMode === 'Yearly' ? 'calendar-month' : 'calendar-year'} 
              size={16} 
              color="#fff" 
              type="MaterialCommunityIcons" 
            />
            <Text style={styles.switchButtonText}>
              {viewMode === 'Yearly' ? 'Yearly' : 'Monthly'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Academic Year Selection - ONLY visible in Yearly view */}
        {viewMode === 'Yearly' && (
          <View style={styles.selectionSection}>
            <Text style={styles.selectionTitle}>Academic Year</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
              {academicYears.map((year) => (
                <TouchableOpacity
                  key={year}
                  style={[
                    styles.selectionItem,
                    selectedYear === year && styles.selectedItem
                  ]}
                  onPress={() => setSelectedYear(year)}
                >
                  <Text style={[
                    styles.selectionText,
                    selectedYear === year && styles.selectedText
                  ]}>
                    {year}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Month Selection - Visible in BOTH views */}
        <View style={styles.selectionSection}>
          <Text style={styles.selectionTitle}>Select Month</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            {months.map((month) => (
              <TouchableOpacity
                key={month}
                style={[
                  styles.selectionItem,
                  selectedMonth === month && styles.selectedItem
                ]}
                onPress={() => setSelectedMonth(month)}
              >
                <Text style={[
                  styles.selectionText,
                  selectedMonth === month && styles.selectedText
                ]}>
                  {month}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Compact Stats Grid */}
        <View style={styles.statsGrid}>
          {/* Main Percentage Card */}
          <View style={styles.mainStatCard}>
            <View style={styles.statIconContainer}>
              <Icon name="chart-pie" size={24} color="#fff" type="MaterialCommunityIcons" />
            </View>
            <Text style={styles.mainStatValue}>{currentStats.percentage}</Text>
            <Text style={styles.mainStatLabel}>{viewMode} Attendance</Text>
          </View>

          {/* Present Card */}
          <View style={[styles.statCard, styles.presentCard]}>
            <View style={styles.statHeader}>
              <View style={[styles.statIconBg, { backgroundColor: '#e8f5e8' }]}>
                <Icon name="check-circle" size={18} color="#4CAF50" type="MaterialIcons" />
              </View>
            </View>
            <Text style={[styles.statValue, { color: '#4CAF50' }]}>{currentStats.present}</Text>
            <Text style={styles.statLabel}>Present</Text>
          </View>

          {/* Absent Card */}
          <View style={[styles.statCard, styles.absentCard]}>
            <View style={styles.statHeader}>
              <View style={[styles.statIconBg, { backgroundColor: '#ffebee' }]}>
                <Icon name="cancel" size={18} color="#F44336" type="MaterialIcons" />
              </View>
            </View>
            <Text style={[styles.statValue, { color: '#F44336' }]}>{currentStats.absent}</Text>
            <Text style={styles.statLabel}>Absent</Text>
          </View>

          {/* Late Card */}
          <View style={[styles.statCard, styles.lateCard]}>
            <View style={styles.statHeader}>
              <View style={[styles.statIconBg, { backgroundColor: '#fff3e0' }]}>
                <Icon name="schedule" size={18} color="#FF9800" type="MaterialIcons" />
              </View>
            </View>
            <Text style={[styles.statValue, { color: '#FF9800' }]}>{currentStats.late}</Text>
            <Text style={styles.statLabel}>Late</Text>
          </View>

          {/* Excused Card - Only show if there are excused records */}
          {currentStats.excused > 0 && (
            <View style={[styles.statCard, styles.excusedCard]}>
              <View style={styles.statHeader}>
                <View style={[styles.statIconBg, { backgroundColor: '#e3f2fd' }]}>
                  <Icon name="event-available" size={18} color="#2196F3" type="MaterialIcons" />
                </View>
              </View>
              <Text style={[styles.statValue, { color: '#2196F3' }]}>{currentStats.excused}</Text>
              <Text style={styles.statLabel}>Excused</Text>
            </View>
          )}
        </View>

        {/* Professional Records Section */}
        <View style={styles.recordsSection}>
          <View style={styles.recordsHeader}>
            <Icon name="list-alt" size={20} color="#2c3e50" type="MaterialIcons" />
            <Text style={styles.recordsTitle}>{attendanceRecords.length} Attendance Records</Text>
          </View>
          
          {attendanceRecords.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon name="calendar-today" size={48} color="#e0e0e0" type="MaterialIcons" />
              <Text style={styles.emptyStateTitle}>No Records Found</Text>
              <Text style={styles.emptyStateText}>No attendance records for the selected period</Text>
            </View>
          ) : (
            attendanceRecords.map((record) => (
              <View key={record.id} style={[styles.recordCard, { borderLeftColor: record.statusColor }]}>
                <View style={styles.recordMainInfo}>
                  <View style={styles.recordLeftSection}>
                    {/* 1. DATE */}
                    <View style={styles.dateTimeContainer}>
                      <Icon name="calendar" size={16} color="#6366f1" type="Feather" />
                      <Text style={styles.recordDate}>{record.shortDate || record.date}</Text>
                      <View style={styles.dayBadge}>
                        <Text style={styles.dayText}>{record.dayName}</Text>
                      </View>
                    </View>
                    
                    {/* 2. STUDENT NAME */}
                    {record.studentName && (
                      <View style={styles.studentInfo}>
                        <Icon name="user" size={14} color="#1e40af" type="Feather" />
                        <Text style={styles.studentName}>{record.studentName}</Text>
                      </View>
                    )}
                    
                    {/* 3. BATCH/CLASS */}
                    {record.class && (
                      <View style={styles.classInfo}>
                        <Icon name="school" size={14} color="#7c3aed" type="MaterialIcons" />
                        <Text style={styles.classText}>{record.class}</Text>
                      </View>
                    )}
                  </View>
                  
                  {/* 4. STATUS */}
                  <View style={styles.statusSection}>
                    <View style={[styles.statusBadge, { backgroundColor: record.statusBgColor || `${record.statusColor}15` }]}>
                      <View style={[styles.statusIcon, { backgroundColor: record.statusColor }]}>
                        <Icon 
                          name={
                            record.status === 'PRESENT' ? 'check' : 
                            record.status === 'ABSENT' ? 'close' : 
                            record.status === 'LATE' ? 'schedule' : 
                            record.status === 'EXCUSED' ? 'event-available' : 'help'
                          } 
                          size={12} 
                          color="#fff" 
                          type="MaterialIcons" 
                        />
                      </View>
                      <Text style={[styles.statusLabel, { color: record.statusColor }]}>
                        {record.status}
                      </Text>
                    </View>
                  </View>
                </View>
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
    backgroundColor: '#f8fafc',
  },
  
  // Enhanced Header
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
    marginLeft: 8,
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

  // Enhanced View Mode Toggle
  viewModeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  viewModeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewModeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginLeft: 8,
  },
  switchButton: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },

  // Selection Sections
  selectionSection: {
    marginBottom: 20,
  },
  selectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 12,
  },
  horizontalScroll: {
    flexDirection: 'row',
  },
  selectionItem: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    minWidth: 70,
    alignItems: 'center',
  },
  selectedItem: {
    backgroundColor: '#e74c3c',
  },
  selectionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
  },
  selectedText: {
    color: '#fff',
    fontWeight: '700',
  },

  // Compact Stats Grid
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  mainStatCard: {
    width: (width - 48) / 2,
    backgroundColor: '#e74c3c',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#e74c3c',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    minHeight: 80,
  },
  statIconContainer: {
    marginBottom: 4,
  },
  mainStatValue: {
    fontSize: 24,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 2,
  },
  mainStatLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
    textAlign: 'center',
  },
  statCard: {
    width: (width - 48) / 2,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    minHeight: 80,
  },
  presentCard: {
    borderLeftWidth: 3,
    borderLeftColor: '#4CAF50',
  },
  absentCard: {
    borderLeftWidth: 3,
    borderLeftColor: '#F44336',
  },
  lateCard: {
    borderLeftWidth: 3,
    borderLeftColor: '#FF9800',
  },
  excusedCard: {
    borderLeftWidth: 3,
    borderLeftColor: '#2196F3',
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  statIconBg: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '600',
  },

  // Professional Records Section
  recordsSection: {
    marginBottom: 20,
  },
  recordsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  recordsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2c3e50',
    marginLeft: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginVertical: 10,
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
    marginTop: 12,
    marginBottom: 6,
  },
  emptyStateText: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
  },
  recordCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderLeftWidth: 4,
    borderLeftColor: '#e74c3c',
  },
  recordMainInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  recordLeftSection: {
    flex: 1,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    backgroundColor: '#f8fafc',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  recordDate: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
    marginLeft: 6,
  },
  studentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  studentName: {
    fontSize: 12,
    color: '#1e40af',
    fontWeight: '600',
    marginLeft: 4,
  },
  statusSection: {
    marginLeft: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  recordDetailsSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
    marginHorizontal: -16,
    paddingHorizontal: 16,
    paddingBottom: 4,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  detailsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 6,
  },
  detailChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  detailChipText: {
    fontSize: 11,
    color: '#374151',
    fontWeight: '700',
    marginLeft: 6,
  },
  classInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    backgroundColor: '#faf5ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  classText: {
    fontSize: 12,
    color: '#7c3aed',
    fontWeight: '700',
    marginLeft: 6,
  },
  notesSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 6,
    backgroundColor: '#fffbeb',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#f59e0b',
  },
  notesText: {
    fontSize: 11,
    color: '#92400e',
    fontWeight: '600',
    marginLeft: 6,
    flex: 1,
    lineHeight: 16,
  },

  // New Enhanced Styles
  dayBadge: {
    backgroundColor: '#e0e7ff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
  },
  dayText: {
    fontSize: 10,
    color: '#3730a3',
    fontWeight: '700',
  },
  studentId: {
    fontSize: 10,
    color: '#6b7280',
    fontWeight: '500',
    marginLeft: 6,
  },
  sessionTypeBadge: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 8,
  },
  sessionTypeText: {
    fontSize: 9,
    color: '#92400e',
    fontWeight: '700',
  },
  instructorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  instructorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    flex: 1,
    marginRight: 8,
  },
  instructorText: {
    fontSize: 11,
    color: '#059669',
    fontWeight: '600',
    marginLeft: 4,
  },
  beltInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  beltText: {
    fontSize: 11,
    color: '#dc2626',
    fontWeight: '700',
    marginLeft: 4,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef7ed',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  locationText: {
    fontSize: 11,
    color: '#7c2d12',
    fontWeight: '600',
    marginLeft: 4,
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
    color: '#6b7280',
    marginTop: 16,
  },
});

export default AttendanceScreen;