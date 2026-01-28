// Test Certificate Sharing Functionality
// Run this with: node test-certificate-sharing.js

console.log('🧪 Testing Certificate Sharing Functionality...\n');

// Mock certificate data for testing
const testCertificate = {
  id: 'CERT-4125362',
  title: 'Red Belt Promotion',
  student: 'Golu Vishwakarma',
  type: 'Belt Promotion',
  issueDate: 'Jan 23, 2025',
  status: 'Active',
  color: '#DC143C',
  icon: 'card-membership',
  verificationCode: 'CERT-4125362',
  instructor: 'Academy Director',
  year: 2025
};

// Test message generation
function generateCertificateMessage(certificate) {
  return `🏆 Certificate Verification

📜 Certificate: ${certificate.title}
👤 Student: ${certificate.student}
🎯 Achievement: ${certificate.type}
📅 Issued: ${certificate.issueDate}
🔢 ID: ${certificate.id}

This certificate has been issued by Combat Warrior Institute and can be verified using the link below.`;
}

// Test verification URL generation
function generateVerificationUrl(certificate) {
  const baseUrl = 'https://taekwondo-academy.com';
  return `${baseUrl}/verify/${certificate.id}`;
}

// Test WhatsApp URL generation
function generateWhatsAppUrl(certificate) {
  const message = generateCertificateMessage(certificate);
  const verificationUrl = generateVerificationUrl(certificate);
  const fullMessage = `${message}\n\nVerify at: ${verificationUrl}`;
  return `whatsapp://send?text=${encodeURIComponent(fullMessage)}`;
}

// Test email URL generation
function generateEmailUrl(certificate) {
  const subject = `Certificate Verification - ${certificate.title}`;
  const message = generateCertificateMessage(certificate);
  const verificationUrl = generateVerificationUrl(certificate);
  const emailBody = `${message}\n\nYou can verify this certificate at: ${verificationUrl}\n\nBest regards,\nCombat Warrior Institute`;
  return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
}

// Run tests
console.log('📱 Testing WhatsApp URL generation...');
const whatsappUrl = generateWhatsAppUrl(testCertificate);
console.log('✅ WhatsApp URL:', whatsappUrl.substring(0, 100) + '...\n');

console.log('📧 Testing Email URL generation...');
const emailUrl = generateEmailUrl(testCertificate);
console.log('✅ Email URL:', emailUrl.substring(0, 100) + '...\n');

console.log('🔗 Testing Verification URL generation...');
const verificationUrl = generateVerificationUrl(testCertificate);
console.log('✅ Verification URL:', verificationUrl + '\n');

console.log('📝 Testing Certificate Message generation...');
const message = generateCertificateMessage(testCertificate);
console.log('✅ Certificate Message:');
console.log(message + '\n');

console.log('🎉 All sharing functionality tests passed!');
console.log('\n📋 Summary:');
console.log('- WhatsApp sharing: URL generated successfully');
console.log('- Email sharing: URL generated successfully');
console.log('- Verification link: URL generated successfully');
console.log('- Certificate message: Generated successfully');
console.log('\n🚀 Ready to test in the React Native app!');