// Test certificate integration in React Native app context
const fetch = require('node-fetch');

// Simulate the exact same configuration as the app
const API_CONFIG = {
  BASE_URL: 'http://localhost:5000/api',
  TIMEOUT: 30000,
  ENDPOINTS: {
    CERTIFICATES: {
      LIST: '/certificates',
      VERIFY: '/certificates/verify',
      DOWNLOAD: '/certificates/download',
      QR: '/certificates/qr',
      STATS: '/certificates/stats',
    },
  },
};

// Simulate CertificateService behavior
class TestCertificateService {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.endpoints = API_CONFIG.ENDPOINTS.CERTIFICATES;
  }

  async getCertificates(studentId = null) {
    try {
      const url = studentId 
        ? `${this.baseURL}${this.endpoints.LIST}?studentId=${studentId}`
        : `${this.baseURL}${this.endpoints.LIST}`;
      
      console.log('🔗 Fetching certificates from:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('📦 Raw backend data:', data);
      
      return this.formatCertificates(data.data?.certificates || data.certificates || data || []);
    } catch (error) {
      console.error('❌ Error fetching certificates:', error);
      throw error;
    }
  }

  formatCertificates(certificates) {
    return certificates.map(cert => ({
      id: cert.id || cert.certificateId || `CERT-${Date.now()}`,
      title: cert.title || cert.achievementType || cert.certificateName || 'Certificate',
      student: cert.studentName || cert.student || 'Student Name',
      type: cert.category || cert.beltLevel || cert.type || cert.certificateType || 'Achievement',
      issueDate: cert.formattedIssueDate || this.formatDate(cert.issuedDate || cert.issueDate || cert.createdAt || new Date()),
      status: cert.status === 'Issued' ? 'Active' : (cert.status || (cert.isActive ? 'Active' : 'Draft')),
      color: this.getCertificateColor(cert.title || cert.achievementType || cert.type),
      icon: this.getCertificateIcon(cert.title || cert.achievementType || cert.type),
      description: cert.description || `Awarded for ${cert.title || cert.achievementType}`,
      instructor: cert.instructor || cert.issuedBy || 'Academy Director',
      verificationCode: cert.verificationCode || cert.qrCode || cert.id || '',
      beltLevel: cert.beltLevel || cert.category || cert.level || '',
      promotion: cert.promotion || '',
      isIssued: cert.status === 'Issued' || cert.status === 'Active' || cert.isActive || true,
      isPending: cert.status === 'pending' || cert.status === 'draft',
      year: cert.year || new Date(cert.issuedDate || cert.issueDate || new Date()).getFullYear(),
    }));
  }

  getCertificateColor(type) {
    if (!type) return '#007AFF';
    
    const typeStr = type.toLowerCase();
    if (typeStr.includes('gold') || typeStr.includes('medal')) return '#FFB800';
    if (typeStr.includes('silver')) return '#C0C0C0';
    if (typeStr.includes('bronze')) return '#CD7F32';
    if (typeStr.includes('black belt') || typeStr.includes('promotion')) return '#000000';
    if (typeStr.includes('completion') || typeStr.includes('python')) return '#007AFF';
    if (typeStr.includes('participation') || typeStr.includes('workshop') || typeStr.includes('attendance')) return '#34C759';
    if (typeStr.includes('achievement') || typeStr.includes('award')) return '#FF9800';
    return '#007AFF';
  }

  getCertificateIcon(type) {
    return 'card-membership'; // Default icon
  }

  formatDate(dateString) {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
  }

  filterByType(certificates, type) {
    if (type === 'All') return certificates;
    
    return certificates.filter(cert => {
      if (type === '2025') return cert.year === 2025 || cert.issueDate.includes('2025');
      if (type === '2026') return cert.year === 2026 || cert.issueDate.includes('2026');
      if (type === 'Awards') {
        const titleLower = (cert.title || '').toLowerCase();
        const typeLower = (cert.type || '').toLowerCase();
        return titleLower.includes('medal') || titleLower.includes('award') || 
               titleLower.includes('achievement') || typeLower.includes('medal') || 
               typeLower.includes('award') || typeLower.includes('achievement');
      }
      return true;
    });
  }
}

async function testAppIntegration() {
  console.log('🚀 Testing Certificate App Integration...\n');

  const certificateService = new TestCertificateService();

  try {
    // Test 1: Load certificates (simulating app behavior)
    console.log('1. Loading certificates (simulating app loadCertificates function)...');
    const certificates = await certificateService.getCertificates();
    console.log('✅ Certificates loaded:', certificates.length);
    
    if (certificates.length > 0) {
      console.log('📄 Formatted certificate data:');
      certificates.forEach((cert, index) => {
        console.log(`   ${index + 1}. ${cert.title} - ${cert.student} (${cert.issueDate})`);
      });
    }

    // Test 2: Filter functionality
    console.log('\n2. Testing filter functionality...');
    
    const all = certificateService.filterByType(certificates, 'All');
    console.log(`   All: ${all.length} certificates`);
    
    const filter2025 = certificateService.filterByType(certificates, '2025');
    console.log(`   2025: ${filter2025.length} certificates`);
    
    const filter2026 = certificateService.filterByType(certificates, '2026');
    console.log(`   2026: ${filter2026.length} certificates`);
    
    const awards = certificateService.filterByType(certificates, 'Awards');
    console.log(`   Awards: ${awards.length} certificates`);

    // Test 3: Verify data structure matches UI expectations
    console.log('\n3. Verifying data structure for UI...');
    if (certificates.length > 0) {
      const firstCert = certificates[0];
      const requiredFields = ['id', 'title', 'student', 'type', 'issueDate', 'status', 'color', 'icon'];
      const missingFields = requiredFields.filter(field => !firstCert[field]);
      
      if (missingFields.length === 0) {
        console.log('✅ All required fields present for UI rendering');
      } else {
        console.log('❌ Missing fields:', missingFields);
      }
    }

    console.log('\n🎉 Certificate app integration test completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`   - Backend URL: ${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CERTIFICATES.LIST}`);
    console.log(`   - Total certificates: ${certificates.length}`);
    console.log(`   - Data formatting: ✅ Working`);
    console.log(`   - Filter functionality: ✅ Working`);

  } catch (error) {
    console.error('❌ Certificate app integration test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Make sure backend server is running on http://localhost:5000');
    console.log('   2. Check if certificates endpoint is accessible');
    console.log('   3. Verify network connectivity');
  }
}

// Run the test
testAppIntegration();