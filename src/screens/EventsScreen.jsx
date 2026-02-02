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
  Modal,
  Dimensions,
} from 'react-native';
import StudentService from '../services/studentService';
import API_CONFIG from '../config/api';
import { useNavigation } from '../context/NavigationContext';
// Vector Icons
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

// Icon component with proper vector icons
const Icon = ({ name, size = 24, color = '#000', type = 'MaterialIcons' }) => {
  const IconComponent = {
    MaterialIcons,
    MaterialCommunityIcons,
    Ionicons,
    FontAwesome,
  }[type];

  return <IconComponent name={name} size={size} color={color} />;
};

const EventsScreen = () => {
  const { navigate } = useNavigation();
  const [viewMode, setViewMode] = useState('All Events'); // 'All Events', 'Upcoming', 'Past'
  const [selectedYear, setSelectedYear] = useState(2026);
  const [selectedMonth, setSelectedMonth] = useState('February');
  const [eventsData, setEventsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarDate, setCalendarDate] = useState(new Date());

  // Academic years and months data
  const academicYears = [2024, 2025, 2026, 2027, 2028];
  const months = ['All Months', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const eventTypes = ['All Events', 'Upcoming', 'Past'];

  // Load events data from backend
  useEffect(() => {
    loadEventsData();
  }, [selectedYear, selectedMonth, viewMode]);

  const loadEventsData = async () => {
    try {
      setLoading(true);
      
      console.log('🔄 Loading events data from backend...');
      console.log('🌐 Events API:', `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.EVENTS.LIST}`);
      
      // Prepare query parameters for backend
      const queryParams = {};
      
      // Add year filter
      if (selectedYear) {
        queryParams.year = selectedYear;
      }
      
      // Add month filter (only if not "All Months")
      if (selectedMonth && selectedMonth !== 'All Months') {
        queryParams.month = selectedMonth;
      }
      
      // Add status filter for backend
      if (viewMode !== 'All Events') {
        queryParams.status = viewMode;
      }
      
      console.log('📡 Fetching events with params:', queryParams);
      
      // Try to fetch from backend using centralized API service with authentication
      let backendEvents = [];
      try {
        console.log('🔄 Trying events endpoint via StudentService');
        
        // Use StudentService which handles authentication and retry logic
        const result = await StudentService.getEvents(queryParams);
        
        console.log('✅ Events response:', result);
        
        if (result && result.status === 'success' && result.data && result.data.events) {
          backendEvents = result.data.events;
          console.log('✅ Got', backendEvents.length, 'events from backend');
        }
      } catch (backendError) {
        console.log('⚠️ Events request failed:', backendError.message);
        console.log('🔄 Using fallback sample data...');
      }
      
      // Process events (backend or mock)
      if (backendEvents.length > 0) {
        const processedEvents = processBackendEventsData(backendEvents);
        setEventsData(processedEvents);
        console.log('✅ Using backend data:', processedEvents.length, 'events');
      } else {
        console.log('📊 No backend data, using mock data');
        const mockEvents = getMockEventsData();
        setEventsData(mockEvents);
        console.log('✅ Using mock data:', mockEvents.length, 'events');
      }
    } catch (error) {
      console.error('❌ Failed to load events:', error);
      // Always fallback to mock data
      const mockEvents = getMockEventsData();
      setEventsData(mockEvents);
      console.log('🔄 Fallback to mock data:', mockEvents.length, 'events');
    } finally {
      setLoading(false);
    }
  };

  // Process backend events data - SIMPLIFIED VERSION (only essential fields)
  const processBackendEventsData = (eventsFromBackend) => {
    console.log('🔄 Processing events from backend:', eventsFromBackend.length);
    
    return eventsFromBackend.map(event => {
      const eventDate = new Date(event.date);
      const now = new Date();
      
      // Determine status based on date - IMPROVED LOGIC
      let status = event.status || 'Upcoming';
      
      // Override status based on actual date comparison
      if (eventDate < now) {
        status = 'Past';
      } else if (eventDate.toDateString() === now.toDateString()) {
        status = 'Today';
      } else {
        status = 'Upcoming';
      }
      
      console.log(`📅 Event: ${event.name}, Date: ${eventDate.toDateString()}, Status: ${status}`);
      
      // SIMPLIFIED EVENT DATA - Only 4 essential fields
      return {
        id: event._id || event.id,
        name: event.name || 'Unnamed Event', // 1. Event Name
        date: eventDate.toLocaleDateString('en-GB', { // 2. Date
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        }),
        location: event.location || 'TBD', // 3. Location
        level: event.level || 'All Levels', // 4. Level
        status: status, // 5. Status
      };
    });
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadEventsData();
    setRefreshing(false);
  };

  // Mock events data - Dynamic based on selected year/month with complete details
  const getMockEventsData = () => {
    // Define which year/month combinations have events
    const eventsAvailable = {
      2024: ['January', 'February', 'March'],
      2025: ['January', 'February'],
      2026: ['January', 'February'],
      2027: []
    };
    
    // Check if current selection has events
    const hasEvents = eventsAvailable[selectedYear]?.includes(selectedMonth) || selectedMonth === 'All Months';
    
    if (!hasEvents && selectedMonth !== 'All Months') {
      return [];
    }
    
    // Return different events based on year/month combination - SIMPLIFIED
    const eventsData = {
      2024: {
        'January': [
          { 
            id: 1, 
            name: 'Karnataka State Taekwondo Championship', 
            date: '15 Jan 2024', 
            location: 'Bangalore Sports Complex',
            level: 'All Levels', 
            status: 'Past'
          },
          { 
            id: 2, 
            name: 'Dan & Kup Belt Grading Examination', 
            date: '20 Jan 2024', 
            location: 'Main Dojo, Mysore',
            level: 'Intermediate', 
            status: 'Past'
          }
        ],
        'February': [
          { 
            id: 3, 
            name: 'South India Taekwondo Open Tournament', 
            date: '10 Feb 2024', 
            location: 'Hubli Stadium',
            level: 'Advanced', 
            status: 'Past'
          }
        ],
        'March': [
          { 
            id: 4, 
            name: 'Black Belt Master Class Training', 
            date: '05 Mar 2024', 
            location: 'Coorg Training Center',
            level: 'Black Belt', 
            status: 'Past'
          }
        ]
      },
      2025: {
        'January': [
          { 
            id: 5, 
            name: 'Winter Taekwondo Championship', 
            date: '12 Jan 2025', 
            location: 'Mangalore Sports Arena',
            level: 'All Levels', 
            status: 'Past'
          }
        ],
        'February': [
          { 
            id: 6, 
            name: 'ITF Black Belt Dan Grading', 
            date: '18 Feb 2025', 
            location: 'Headquarters Dojo, Bangalore',
            level: 'Black Belt', 
            status: 'Past'
          }
        ]
      },
      2026: {
        'January': [
          { 
            id: 7, 
            name: 'New Year Taekwondo Grand Prix', 
            date: '25 Jan 2026', 
            location: 'Bangalore International Stadium',
            level: 'All Levels', 
            status: 'Upcoming'
          }
        ],
        'February': [
          { 
            id: 8, 
            name: 'Youth Taekwondo Development Seminar', 
            date: '15 Feb 2026', 
            location: 'Youth Center, Mysore',
            level: 'Beginner', 
            status: 'Upcoming'
          },
          { 
            id: 9, 
            name: 'Inter-School Taekwondo Championship', 
            date: '28 Feb 2026', 
            location: 'School Sports Complex, Hubli',
            level: 'Intermediate', 
            status: 'Upcoming'
          }
        ]
      }
    };
    
    console.log(`📊 Mock data for ${selectedYear}/${selectedMonth}:`, eventsData[selectedYear]?.[selectedMonth] || []);
    
    if (selectedMonth === 'All Months') {
      // Return all events for the selected year
      const yearEvents = eventsData[selectedYear] || {};
      return Object.values(yearEvents).flat();
    }
    
    return eventsData[selectedYear]?.[selectedMonth] || [];
  };

  const currentEventsData = eventsData || [];
  
  console.log(`📊 Total events available: ${currentEventsData.length}`);
  console.log(`🔍 Current viewMode: ${viewMode}`);

  const handleBackPress = () => {
    navigate('Dashboard');
  };

  // Calendar helper functions
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const hasEventOnDate = (day, month, year) => {
    const dateStr = new Date(year, month, day).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
    
    return eventsData.some(event => event.date === dateStr);
  };

  const handleCalendarPress = () => {
    setShowCalendar(true);
  };

  const handleDateSelect = (day) => {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                       'July', 'August', 'September', 'October', 'November', 'December'];
    
    const selectedDate = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), day);
    setCalendarDate(selectedDate);
    
    // Update the year and month filters based on selected date
    setSelectedYear(selectedDate.getFullYear());
    setSelectedMonth(monthNames[selectedDate.getMonth()]);
    
    setShowCalendar(false);
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(calendarDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCalendarDate(newDate);
  };

  // Calendar Modal Component
  const CalendarModal = () => {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                       'July', 'August', 'September', 'October', 'November', 'December'];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return (
      <Modal
        visible={showCalendar}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCalendar(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.calendarContainer}>
            {/* Calendar Header */}
            <View style={styles.calendarHeader}>
              <TouchableOpacity 
                style={styles.monthNavButton}
                onPress={() => navigateMonth(-1)}
              >
                <Icon name="chevron-left" size={24} color="#e74c3c" type="MaterialIcons" />
              </TouchableOpacity>
              
              <Text style={styles.calendarTitle}>
                {monthNames[month]} {year}
              </Text>
              
              <TouchableOpacity 
                style={styles.monthNavButton}
                onPress={() => navigateMonth(1)}
              >
                <Icon name="chevron-right" size={24} color="#e74c3c" type="MaterialIcons" />
              </TouchableOpacity>
            </View>

            {/* Day Names */}
            <View style={styles.dayNamesRow}>
              {dayNames.map((dayName) => (
                <Text key={dayName} style={styles.dayName}>
                  {dayName}
                </Text>
              ))}
            </View>

            {/* Calendar Grid */}
            <View style={styles.calendarGrid}>
              {Array.from({ length: Math.ceil(days.length / 7) }, (_, weekIndex) => (
                <View key={weekIndex} style={styles.weekRow}>
                  {days.slice(weekIndex * 7, (weekIndex + 1) * 7).map((day, dayIndex) => (
                    <TouchableOpacity
                      key={dayIndex}
                      style={[
                        styles.dayCell,
                        day === null && styles.emptyDayCell,
                        day === new Date().getDate() && 
                        month === new Date().getMonth() && 
                        year === new Date().getFullYear() && styles.todayCell,
                        day && hasEventOnDate(day, month, year) && styles.eventDayCell
                      ]}
                      onPress={() => day && handleDateSelect(day)}
                      disabled={day === null}
                    >
                      <Text style={[
                        styles.dayText,
                        day === new Date().getDate() && 
                        month === new Date().getMonth() && 
                        year === new Date().getFullYear() && styles.todayText,
                        day && hasEventOnDate(day, month, year) && styles.eventDayText
                      ]}>
                        {day}
                      </Text>
                      {day && hasEventOnDate(day, month, year) && (
                        <View style={styles.eventIndicator} />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              ))}
            </View>

            {/* Calendar Footer */}
            <View style={styles.calendarFooter}>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowCalendar(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  // Filter events based on view mode
  const filteredEvents = currentEventsData.filter(event => {
    console.log(`🔍 Filtering event: ${event.name}, Status: ${event.status}, ViewMode: ${viewMode}`);
    
    if (viewMode === 'All Events') return true;
    if (viewMode === 'Upcoming') return event.status === 'Upcoming' || event.status === 'Today';
    if (viewMode === 'Past') return event.status === 'Past' || event.status === 'Completed';
    return true;
  });

  console.log(`📊 Filtered ${filteredEvents.length} events for viewMode: ${viewMode}`);

  // Loading state
  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#e74c3c" />
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <Icon name="arrow-back" size={24} color="#fff" type="MaterialIcons" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Events</Text>
          <TouchableOpacity style={styles.calendarButton} onPress={handleCalendarPress}>
            <Icon name="event" size={24} color="#fff" type="MaterialIcons" />
          </TouchableOpacity>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#e74c3c" />
          <Text style={styles.loadingText}>Loading events...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#e74c3c" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Icon name="arrow-back" size={24} color="#fff" type="MaterialIcons" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Events</Text>
        <TouchableOpacity style={styles.calendarButton} onPress={handleCalendarPress}>
          <Icon 
            name="event" 
            size={24} 
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
        {/* Year Selection */}
        <View style={styles.selectionSection}>
          <Text style={styles.selectionTitle}>Year:</Text>
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

        {/* Month Selection */}
        <View style={styles.selectionSection}>
          <Text style={styles.selectionTitle}>Month:</Text>
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

        {/* Event Type Selection */}
        <View style={styles.selectionSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            {eventTypes.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.selectionItem,
                  viewMode === type && styles.selectedItem
                ]}
                onPress={() => setViewMode(type)}
              >
                <Text style={[
                  styles.selectionText,
                  viewMode === type && styles.selectedText
                ]}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Events List or No Events */}
        {filteredEvents.length > 0 ? (
          <View style={styles.eventsSection}>
            <Text style={styles.recordsTitle}>{filteredEvents.length} events</Text>
            
            {filteredEvents.map((event) => (
              <View key={event.id} style={styles.eventCard}>
                <View style={styles.eventHeader}>
                  <View style={styles.eventTitleRow}>
                    {/* 1. EVENT NAME */}
                    <Text style={styles.eventName}>{event.name}</Text>
                    
                    {/* STATUS */}
                    <View style={styles.statusContainer}>
                      <View style={[
                        styles.statusDot, 
                        { backgroundColor: 
                          event.status === 'Upcoming' ? '#ea104aff' : 
                          event.status === 'Today' ? '#FF9800' : 
                          event.status === 'Past' ? '#95a5a6' : '#e74c3c'
                        }
                      ]}>
                        <Icon 
                          name={
                            event.status === 'Upcoming' ? 'schedule' : 
                            event.status === 'Today' ? 'today' : 
                            event.status === 'Past' ? 'history' : 'event'
                          } 
                          size={14} 
                          color="#fff" 
                          type="MaterialIcons" 
                        />
                      </View>
                      <Text style={[
                        styles.statusText, 
                        { color: 
                          event.status === 'Upcoming' ? '#4CAF50' : 
                          event.status === 'Today' ? '#FF9800' : 
                          event.status === 'Past' ? '#95a5a6' : '#e74c3c'
                        }
                      ]}>
                        {event.status.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                </View>
                
                <View style={styles.eventDetails}>
                  {/* 2. DATE */}
                  <View style={styles.detailRow}>
                    <Icon name="event" size={16} color="#7f8c8d" type="MaterialIcons" />
                    <Text style={styles.detailLabel}>Date:</Text>
                    <Text style={styles.detailValue}>{event.date}</Text>
                  </View>
                  
                  {/* 3. LOCATION */}
                  <View style={styles.detailRow}>
                    <Icon name="location-on" size={16} color="#7f8c8d" type="MaterialIcons" />
                    <Text style={styles.detailLabel}>Location:</Text>
                    <Text style={styles.detailValue}>{event.location}</Text>
                  </View>
                  
                  {/* 4. LEVEL */}
                  <View style={styles.detailRow}>
                    <Icon name="military-tech" size={16} color="#7f8c8d" type="MaterialIcons" />
                    <Text style={styles.detailLabel}>Level:</Text>
                    <Text style={[styles.detailValue, styles.levelValue]}>{event.level}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.noEventsContainer}>
            <View style={styles.noEventsIcon}>
              <Icon name="event-busy" size={64} color="#ccc" type="MaterialIcons" />
            </View>
            <Text style={styles.noEventsTitle}>No events found</Text>
            <Text style={styles.noEventsSubtitle}>
              {viewMode === 'All Events' 
                ? `No events available for ${selectedYear}${selectedMonth !== 'All Months' ? ` in ${selectedMonth}` : ''}`
                : viewMode === 'Upcoming'
                ? `No upcoming events for ${selectedYear}${selectedMonth !== 'All Months' ? ` in ${selectedMonth}` : ''}`
                : `No past events for ${selectedYear}${selectedMonth !== 'All Months' ? ` in ${selectedMonth}` : ''}`
              }
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Calendar Modal */}
      <CalendarModal />
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

  // Selection Sections
  selectionSection: {
    marginTop: 20,
    marginBottom: 15,
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
    shadowRadius: 4,
    elevation: 2,
    minWidth: 70,
    alignItems: 'center',
  },
  selectedItem: {
    backgroundColor: '#de181cff',
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

  // Events Section
  eventsSection: {
    marginTop: 20,
    marginBottom: 30,
  },
  recordsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 12,
  },
  eventCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    borderLeftWidth: 5,
    borderLeftColor: '#e74c3c',
  },
  eventHeader: {
    marginBottom: 15,
  },
  eventTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  eventName: {
    fontSize: 19,
    fontWeight: '900',
    color: '#2c3e50',
    flex: 1,
    marginRight: 15,
    lineHeight: 24,
  },
  eventDetails: {
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 2,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#7f8c8d',
    minWidth: 85,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2c3e50',
    flex: 1,
  },
  levelValue: {
    color: '#e74c3c',
    fontWeight: '800',
    backgroundColor: '#ffeaea',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    fontSize: 13,
    textAlign: 'center',
    alignSelf: 'flex-start',
  },
  eventTypeValue: {
    color: '#3498db',
    fontWeight: '800',
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    fontSize: 13,
    textAlign: 'center',
    alignSelf: 'flex-start',
  },
  feeValue: {
    color: '#e30e0eff',
    fontWeight: '800',
    backgroundColor: '#e8f5e8',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    fontSize: 13,
    textAlign: 'center',
    alignSelf: 'flex-start',
  },
  eventDescription: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  descriptionText: {
    fontSize: 14,
    color: '#7f8c8d',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.8,
  },

  // No Events
  noEventsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  noEventsIcon: {
    marginBottom: 20,
  },
  noEventsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#7f8c8d',
    marginBottom: 8,
  },
  noEventsSubtitle: {
    fontSize: 14,
    color: '#95a5a6',
    textAlign: 'center',
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

  // Calendar Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  calendarContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxWidth: 350,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  monthNavButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2c3e50',
  },
  dayNamesRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  dayName: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: '#7f8c8d',
    paddingVertical: 8,
  },
  calendarGrid: {
    marginBottom: 20,
  },
  weekRow: {
    flexDirection: 'row',
  },
  dayCell: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 1,
    borderRadius: 8,
  },
  emptyDayCell: {
    backgroundColor: 'transparent',
  },
  todayCell: {
    backgroundColor: '#e74c3c',
  },
  eventDayCell: {
    backgroundColor: '#fff3cd',
    borderWidth: 1,
    borderColor: '#ffc107',
  },
  dayText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
  },
  todayText: {
    color: '#fff',
    fontWeight: '700',
  },
  eventDayText: {
    color: '#856404',
    fontWeight: '700',
  },
  eventIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ffc107',
  },
  calendarFooter: {
    alignItems: 'center',
  },
  closeButton: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
});

export default EventsScreen;
