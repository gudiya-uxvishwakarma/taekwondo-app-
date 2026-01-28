#!/usr/bin/env node

/**
 * Test Certificate Buttons Update
 * Verifies that print button is removed and only View and Download PDF buttons remain
 */

const fs = require('fs');
const path = require('path');

console.log('🔘 Testing Certificate Buttons Update');
console.log('=' .repeat(50));

// Test certificate card screen buttons
const testCertificateCardButtons = () => {
  console.log('\n📱 Testing Certificate Card Screen Buttons...');
  
  const cardPath = path.join(__dirname, 'src/screens/CertificateCardScreen.jsx');
  
  if (!fs.existsSync(cardPath)) {
    console.log('❌ CertificateCardScreen.jsx not found');
    return false;
  }
  
  const cardContent = fs.readFileSync(cardPath, 'utf8');
  
  // Check that print button is removed
  const hasPrintButton = cardContent.includes('printButton') || 
                        cardContent.includes('handlePrintCertificate(certificate)') ||
                        cardContent.includes('Print</Text>');
  const hasPrintHandler = cardContent.includes('const handlePrintCertificate');
  const hasPrintStyles = cardContent.includes('printButtonText:');
  
  // Check that only View and Download buttons exist
  const hasViewButton = cardContent.includes('viewButton') && cardContent.includes('View</Text>');
  const hasDownloadButton = cardContent.includes('downloadButton') && cardContent.includes('Download PDF</Text>');
  const hasPDFIcon = cardContent.includes('picture-as-pdf');
  const hasDownloadHandler = cardContent.includes('handleDownloadCertificate');
  const hasProperDownloadMessage = cardContent.includes('Certificate PDF has been generated');
  
  console.log('✅ Button Removal Tests:');
  console.log(`   - Print Button Removed: ${!hasPrintButton ? '✅' : '❌'}`);
  console.log(`   - Print Handler Removed: ${!hasPrintHandler ? '✅' : '❌'}`);
  console.log(`   - Print Styles Removed: ${!hasPrintStyles ? '✅' : '❌'}`);
  
  console.log('\n✅ Remaining Button Tests:');
  console.log(`   - View Button Present: ${hasViewButton ? '✅' : '❌'}`);
  console.log(`   - Download PDF Button Present: ${hasDownloadButton ? '✅' : '❌'}`);
  console.log(`   - PDF Icon Used: ${hasPDFIcon ? '✅' : '❌'}`);
  console.log(`   - Download Handler Present: ${hasDownloadHandler ? '✅' : '❌'}`);
  console.log(`   - Proper PDF Message: ${hasProperDownloadMessage ? '✅' : '❌'}`);
  
  return !hasPrintButton && !hasPrintHandler && !hasPrintStyles && 
         hasViewButton && hasDownloadButton && hasPDFIcon && 
         hasDownloadHandler && hasProperDownloadMessage;
};

// Test certificate view modal buttons
const testCertificateViewModalButtons = () => {
  console.log('\n🖼️ Testing Certificate View Modal Buttons...');
  
  const modalPath = path.join(__dirname, 'src/screens/CertificateViewModal.jsx');
  
  if (!fs.existsSync(modalPath)) {
    console.log('❌ CertificateViewModal.jsx not found');
    return false;
  }
  
  const modalContent = fs.readFileSync(modalPath, 'utf8');
  
  // Check that print is replaced with download
  const hasOldPrintProp = modalContent.includes('onPrint');
  const hasNewDownloadProp = modalContent.includes('onDownload');
  const hasPrintIcon = modalContent.includes('name="print"');
  const hasPDFIcon = modalContent.includes('picture-as-pdf');
  const hasDownloadButton = modalContent.includes('downloadButton');
  const hasProperHandler = modalContent.includes('onDownload && onDownload(certificate)');
  
  console.log('✅ Modal Button Tests:');
  console.log(`   - Old Print Prop Removed: ${!hasOldPrintProp ? '✅' : '❌'}`);
  console.log(`   - New Download Prop Added: ${hasNewDownloadProp ? '✅' : '❌'}`);
  console.log(`   - Print Icon Removed: ${!hasPrintIcon ? '✅' : '❌'}`);
  console.log(`   - PDF Icon Added: ${hasPDFIcon ? '✅' : '❌'}`);
  console.log(`   - Download Button Style: ${hasDownloadButton ? '✅' : '❌'}`);
  console.log(`   - Proper Handler Call: ${hasProperHandler ? '✅' : '❌'}`);
  
  return !hasOldPrintProp && hasNewDownloadProp && !hasPrintIcon && 
         hasPDFIcon && hasDownloadButton && hasProperHandler;
};

// Test button layout structure
const testButtonLayout = () => {
  console.log('\n📐 Testing Button Layout Structure...');
  
  const cardPath = path.join(__dirname, 'src/screens/CertificateCardScreen.jsx');
  const cardContent = fs.readFileSync(cardPath, 'utf8');
  
  // Count action buttons in the layout
  const actionButtonMatches = cardContent.match(/TouchableOpacity[^>]*actionButton/g) || [];
  const buttonCount = actionButtonMatches.length;
  
  // Check for proper 2-button layout
  const hasProperLayout = buttonCount === 2;
  const hasViewAndDownload = cardContent.includes('View</Text>') && 
                            cardContent.includes('Download PDF</Text>');
  
  console.log('✅ Layout Tests:');
  console.log(`   - Button Count: ${buttonCount} (Expected: 2) ${buttonCount === 2 ? '✅' : '❌'}`);
  console.log(`   - Proper Layout: ${hasProperLayout ? '✅' : '❌'}`);
  console.log(`   - View & Download Present: ${hasViewAndDownload ? '✅' : '❌'}`);
  
  return hasProperLayout && hasViewAndDownload;
};

// Run all tests
const runAllTests = () => {
  console.log('🚀 Running Certificate Button Update Tests...\n');
  
  const cardTest = testCertificateCardButtons();
  const modalTest = testCertificateViewModalButtons();
  const layoutTest = testButtonLayout();
  
  console.log('\n' + '='.repeat(50));
  console.log('📊 TEST RESULTS SUMMARY');
  console.log('='.repeat(50));
  
  console.log(`Certificate Card Buttons: ${cardTest ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`Certificate Modal Buttons: ${modalTest ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`Button Layout Structure: ${layoutTest ? '✅ PASSED' : '❌ FAILED'}`);
  
  const allPassed = cardTest && modalTest && layoutTest;
  
  console.log('\n' + '='.repeat(50));
  console.log(`🎯 OVERALL RESULT: ${allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);
  console.log('='.repeat(50));
  
  if (allPassed) {
    console.log('\n🎉 Certificate buttons have been successfully updated!');
    console.log('✨ Changes implemented:');
    console.log('   • Print button completely removed from cards');
    console.log('   • Only 2 buttons remain: View and Download PDF');
    console.log('   • Download button now uses PDF icon (picture-as-pdf)');
    console.log('   • Download button text changed to "Download PDF"');
    console.log('   • Download functionality enhanced for PDF generation');
    console.log('   • Certificate modal updated to use download instead of print');
    console.log('   • Proper PDF download messages added');
    console.log('\n📱 Users now have a cleaner interface with PDF download functionality!');
  } else {
    console.log('\n⚠️ Some tests failed. Please check the implementation.');
  }
  
  return allPassed;
};

// Execute tests
if (require.main === module) {
  runAllTests();
}

module.exports = {
  testCertificateCardButtons,
  testCertificateViewModalButtons,
  testButtonLayout,
  runAllTests
};