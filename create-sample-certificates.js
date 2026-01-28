/**
 * Sample Certificate Data Creator
 * Creates sample certificates for testing the certificate system
 */

const sampleCertificates = [
  {
    id: 'CERT-2026-00123',
    student: 'Rahul Kumar',
    title: 'Certificate of Achievement',
    type: 'Achievement',
    beltLevel: 'Gold Medal - State Level',
    category: 'State Level Competition',
    status: 'Issued',
    issuedDate: '2026-01-20',
    year: 2026,
    verificationCode: 'CERT-2026-00123',
    formattedIssueDate: 'Jan 20, 2026'
  },
  {
    id: 'CERT-2025-00456',
    student: 'Priya Sharma',
    title: 'Certificate of Completion',
    type: 'Course Completion',
    beltLevel: 'Python Programming - Advanced',
    category: 'Programming Course',
    status: 'Issued',
    issuedDate: '2025-12-15',
    year: 2025,
    verificationCode: 'CERT-2025-00456',
    formattedIssueDate: 'Dec 15, 2025'
  },
  {
    id: 'CERT-2025-00789',
    student: 'Arjun Patel',
    title: 'Participation Certificate',
    type: 'Tournament',
    beltLevel: 'Photography Workshop',
    category: 'Workshop Participation',
    status: 'Active',
    issuedDate: '2025-09-10',
    year: 2025,
    verificationCode: 'CERT-2025-00789',
    formattedIssueDate: 'Sep 10, 2025'
  },
  {
    id: 'CERT-2026-00234',
    student: 'Anita Singh',
    title: 'Belt Promotion Certificate',
    type: 'Belt Promotion',
    beltLevel: 'Black Belt 1st Dan',
    category: 'Belt Advancement',
    status: 'Issued',
    issuedDate: '2026-01-15',
    year: 2026,
    verificationCode: 'CERT-2026-00234',
    formattedIssueDate: 'Jan 15, 2026'
  },
  {
    id: 'CERT-2025-00567',
    student: 'Vikram Reddy',
    title: 'Tournament Winner',
    type: 'Tournament',
    beltLevel: 'Silver Medal - Regional',
    category: 'Regional Championship',
    status: 'Issued',
    issuedDate: '2025-11-20',
    year: 2025,
    verificationCode: 'CERT-2025-00567',
    formattedIssueDate: 'Nov 20, 2025'
  }
];

console.log('Sample Certificates Data:');
console.log(JSON.stringify(sampleCertificates, null, 2));

console.log('\n=== Certificate System Test Data ===');
console.log('Total Certificates:', sampleCertificates.length);
console.log('2025 Certificates:', sampleCertificates.filter(c => c.year === 2025).length);
console.log('2026 Certificates:', sampleCertificates.filter(c => c.year === 2026).length);
console.log('Achievement Certificates:', sampleCertificates.filter(c => c.type === 'Achievement' || c.type === 'Tournament').length);

// Export for use in the app
module.exports = sampleCertificates;