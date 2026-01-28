// Script to create sample attendance data for testing
const API_BASE_URL = 'http://192.168.1.22:5000/api';

async function createSampleAttendance() {
  console.log('📊 Creating sample attendance data...\n');

  try {
    // Step 1: Login to get token
    console.log('1️⃣ Logging in...');
    const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@combatwarrior.com',
        password: 'admin123'
      })
    });

    const loginData = await loginResponse.json();
    
    if (loginData.status !== 'success') {
      throw new Error('Login failed');
    }

    const token = loginData.data.token;
    const userId = loginData.data.user.id;
    console.log('✅ Login successful, User ID:', userId);

    // Step 2: Create sample attendance records for the current user
    const sampleRecords = [
      {
        studentId: userId,
        date: '2025-01-15',
        checkInTime: '2025-01-15T18:00:00.000Z',
        status: 'Present',
        class: 'Advanced Taekwondo',
        notes: 'Great performance in sparring'
      },
      {
        studentId: userId,
        date: '2025-01-17',
        checkInTime: '2025-01-17T18:00:00.000Z',
        checkOutTime: '2025-01-17T19:30:00.000Z',
        status: 'Present',
        class: 'Advanced Taekwondo',
        notes: 'Excellent technique demonstration'
      },
      {
        studentId: userId,
        date: '2025-01-20',
        checkInTime: '2025-01-20T18:15:00.000Z',
        status: 'Late',
        class: 'Advanced Taekwondo',
        notes: 'Arrived 15 minutes late'
      },
      {
        studentId: userId,
        date: '2025-01-22',
        checkInTime: '2025-01-22T18:00:00.000Z',
        status: 'Present',
        class: 'Advanced Taekwondo',
        notes: 'Today\'s session - excellent focus'
      }
    ];

    console.log('\n2️⃣ Creating attendance records...');
    
    for (let i = 0; i < sampleRecords.length; i++) {
      const record = sampleRecords[i];
      console.log(`Creating record ${i + 1}/${sampleRecords.length}: ${record.date} - ${record.status}`);
      
      try {
        const response = await fetch(`${API_BASE_URL}/attendance`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(record)
        });

        const result = await response.json();
        
        if (result.status === 'success') {
          console.log(`✅ Record created: ${record.date}`);
        } else {
          console.log(`⚠️ Record creation failed: ${result.message}`);
        }
      } catch (error) {
        console.log(`❌ Error creating record: ${error.message}`);
      }
    }

    // Step 3: Verify the created records
    console.log('\n3️⃣ Verifying created records...');
    const verifyResponse = await fetch(`${API_BASE_URL}/attendance?studentId=${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    const verifyData = await verifyResponse.json();
    
    if (verifyData.status === 'success') {
      console.log(`✅ Verification complete: ${verifyData.data.attendance.length} records found for user`);
      
      verifyData.data.attendance.forEach((record, index) => {
        console.log(`${index + 1}. ${record.date.split('T')[0]} - ${record.status} (${record.class})`);
      });
    }

    console.log('\n🎉 Sample attendance data created successfully!');
    console.log('\n💡 You can now test the React Native app with real attendance data.');

  } catch (error) {
    console.error('❌ Failed to create sample data:', error.message);
  }
}

// Run the script
createSampleAttendance();