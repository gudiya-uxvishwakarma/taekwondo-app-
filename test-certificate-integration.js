// Test certificate integration with CertificateService
const CertificateService = require('./src/services/CertificateService.js');

async function testCertificateIntegration() {
  console.log('🧪 Testing Certificate Integration...\n');

  try {
    // Test 1: Get certificates from service
    console.log('1. Testing CertificateService.getCertificates()...');
    const certificates = await CertificateService.getCertificates();
    console.log('✅ Certificates loaded:', certificates.length);
    
    if (certificates.length > 0) {
      console.log('📄 First certificate:', {
        id: certificates[0].id,
        title: certificates[0].title,
        student: certificates[0].student,
        type: certificates[0].type,
        issueDate: certificates[0].issueDate,
        status: certificates[0].status,
        year: certificates[0].year
      });
    }

    // Test 2: Filter by year 2025
    console.log('\n2. Testing filter by 2025...');
    const certificates2025 = CertificateService.filterByType(certificates, '2025');
    console.log('✅ 2025 certificates:', certificates2025.length);

    // Test 3: Filter by year 2026
    console.log('\n3. Testing filter by 2026...');
    const certificates2026 = CertificateService.filterByType(certificates, '2026');
    console.log('✅ 2026 certificates:', certificates2026.length);

    // Test 4: Filter by Awards
    console.log('\n4. Testing filter by Awards...');
    const awardsFilter = CertificateService.filterByType(certificates, 'Awards');
    console.log('✅ Awards certificates:', awardsFilter.length);

    // Test 5: Certificate verification
    console.log('\n5. Testing certificate verification...');
    const verificationResult = await CertificateService.verifyCertificate('CERT-2026-00123');
    console.log('✅ Verification result:', verificationResult.isValid);

    // Test 6: Certificate stats
    console.log('\n6. Testing certificate stats...');
    const stats = await CertificateService.getCertificateStats();
    console.log('✅ Stats:', {
      total: stats.total,
      issued: stats.issued,
      pending: stats.pending
    });

    console.log('\n🎉 Certificate integration test completed successfully!');

  } catch (error) {
    console.error('❌ Certificate integration test failed:', error.message);
  }
}

// Run the test
testCertificateIntegration();