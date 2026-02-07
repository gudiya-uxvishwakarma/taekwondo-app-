/**
 * Certificate PDF Generation Service
 * Handles certificate PDF generation and download functionality
 */

import { Alert, Platform, PermissionsAndroid } from 'react-native';

// Import native modules with fallback handling
let RNHTMLtoPDF, RNFS, Share;

try {
  RNHTMLtoPDF = require('react-native-html-to-pdf').default;
} catch (error) {
  console.warn('⚠️ react-native-html-to-pdf not available');
  RNHTMLtoPDF = null;
}

try {
  RNFS = require('react-native-fs');
} catch (error) {
  console.warn('⚠️ react-native-fs not available');
  RNFS = null;
}

try {
  Share = require('react-native-share');
} catch (error) {
  console.warn('⚠️ react-native-share not available');
  Share = null;
}

class CertificatePDFService {
  /**
   * Generate certificate HTML content with EXACT styling matching the view
   */
  static generateCertificateHTML(certificate) {
    const getBeltColor = (title) => {
      const titleLower = title && title.toLowerCase ? title.toLowerCase() : '';
      if (titleLower.includes('yellow')) return '#FFD700';
      if (titleLower.includes('orange')) return '#FFA500';
      if (titleLower.includes('green')) return '#32CD32';
      if (titleLower.includes('blue')) return '#1E90FF';
      if (titleLower.includes('brown')) return '#8B4513';
      if (titleLower.includes('red')) return '#DC143C';
      if (titleLower.includes('black')) return '#000000';
      return '#FFD700';
    };

    const formatDate = (dateString) => {
      if (!dateString) {
        const today = new Date();
        const day = today.getDate();
        const month = today.toLocaleDateString('en-GB', { month: 'long' });
        const year = today.getFullYear();
        return day + (day === 1 ? 'st' : day === 2 ? 'nd' : day === 3 ? 'rd' : 'th') + ' ' + month + ' ' + year;
      }
      
      try {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleDateString('en-GB', { month: 'long' });
        const year = date.getFullYear();
        return day + (day === 1 ? 'st' : day === 2 ? 'nd' : day === 3 ? 'rd' : 'th') + ' ' + month + ' ' + year;
      } catch (error) {
        return dateString;
      }
    };

    const beltColor = getBeltColor(certificate.title);
    const formattedDate = formatDate(certificate.issueDate);

    // Generate HTML that EXACTLY matches the certificate view design
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Certificate - ${certificate.student || 'Student'}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Times New Roman', serif;
            background: #f5f5f5;
            padding: 8px;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }
        
        /* EXACT MATCH: Certificate Container */
        .certificate-container {
            width: 480px;
            min-height: 700px;
            position: relative;
            box-shadow: 0 12px 40px rgba(0,0,0,0.3);
            align-self: center;
        }
        
        /* EXACT MATCH: Outer Border */
        .outer-border {
            width: 100%;
            height: 100%;
            background: #8B4513;
            border-radius: 16px;
            padding: 4px;
            border: 2px solid #654321;
        }
        
        /* EXACT MATCH: Certificate Background */
        .certificate-background {
            width: 100%;
            min-height: 690px;
            background: #FFF8DC;
            border-radius: 12px;
            padding: 24px;
            position: relative;
            border: 3px solid #DAA520;
        }
        
        /* EXACT MATCH: Decorative corners */
        .corner {
            position: absolute;
            width: 24px;
            height: 24px;
            border-color: #DAA520;
        }
        .corner-top-left { top: 12px; left: 12px; border-top: 3px solid; border-left: 3px solid; border-top-left-radius: 8px; }
        .corner-top-right { top: 12px; right: 12px; border-top: 3px solid; border-right: 3px solid; border-top-right-radius: 8px; }
        .corner-bottom-left { bottom: 12px; left: 12px; border-bottom: 3px solid; border-left: 3px solid; border-bottom-left-radius: 8px; }
        .corner-bottom-right { bottom: 12px; right: 12px; border-bottom: 3px solid; border-right: 3px solid; border-bottom-right-radius: 8px; }
        
        /* EXACT MATCH: Header Section */
        .certificate-header {
            text-align: center;
            margin-top: 24px;
            margin-bottom: 32px;
        }
        
        .logo-section {
            margin-bottom: 16px;
        }
        
        /* EXACT MATCH: Logo Container */
        .logo-container {
            width: 90px;
            height: 90px;
            border-radius: 45px;
            background: #FFD700;
            border: 4px solid #8B4513;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 0 auto;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            overflow: hidden;
        }
        
        .logo-image {
            font-size: 48px;
            color: #8B4513;
        }
        
        /* EXACT MATCH: Title Section */
        .main-title {
            font-size: 42px;
            font-weight: 900;
            color: #8B4513;
            letter-spacing: 6px;
            text-align: center;
            text-shadow: 2px 2px 4px rgba(139, 69, 19, 0.3);
            margin-bottom: 8px;
        }
        
        .title-divider {
            width: 200px;
            height: 4px;
            background: #DAA520;
            margin: 8px auto;
            border-radius: 2px;
        }
        
        .sub-title {
            font-size: 20px;
            font-weight: 700;
            color: #8B4513;
            letter-spacing: 3px;
            text-align: center;
            margin-bottom: 4px;
        }
        
        .discipline {
            font-size: 18px;
            font-weight: 600;
            color: #DC143C;
            letter-spacing: 2px;
            text-align: center;
        }
        
        /* EXACT MATCH: Martial Arts Section */
        .martial-arts-section {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 24px 48px;
        }
        
        .figure {
            width: 60px;
            height: 60px;
            border-radius: 30px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 28px;
            border: 2px solid;
        }
        
        .left-figure {
            background: rgba(220, 20, 60, 0.1);
            border-color: #DC143C;
        }
        
        .center-ornament {
            width: 40px;
            height: 40px;
            border-radius: 20px;
            background: rgba(218, 165, 32, 0.2);
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 24px;
            color: #DAA520;
        }
        
        .right-figure {
            background: rgba(255, 215, 0, 0.2);
            border-color: #FFD700;
        }
        
        /* EXACT MATCH: Student Section */
        .student-section {
            text-align: center;
            margin: 32px 0;
            padding: 24px;
            background: rgba(255, 248, 220, 0.8);
            border-radius: 12px;
            border: 1px solid rgba(218, 165, 32, 0.3);
        }
        
        .presented-to {
            font-size: 18px;
            font-weight: 600;
            color: #8B4513;
            font-style: italic;
            margin-bottom: 16px;
            letter-spacing: 1px;
        }
        
        .student-name-large {
            font-size: 32px;
            font-weight: 900;
            color: #2C1810;
            text-align: center;
            letter-spacing: 3px;
            margin-bottom: 16px;
            text-shadow: 1px 1px 2px rgba(44, 24, 16, 0.2);
        }
        
        .achievement-description {
            font-size: 16px;
            font-weight: 600;
            color: #8B4513;
            text-align: center;
            font-style: italic;
            line-height: 22px;
            padding: 0 24px;
        }
        
        /* EXACT MATCH: Award Section */
        .award-section {
            text-align: center;
            margin: 24px 0;
        }
        
        .awarded-label {
            font-size: 16px;
            font-weight: 600;
            color: #8B4513;
            margin-bottom: 8px;
            letter-spacing: 1px;
        }
        
        .date-display {
            font-size: 24px;
            font-weight: 800;
            color: #DC143C;
            letter-spacing: 2px;
            text-shadow: 1px 1px 2px rgba(220, 20, 60, 0.2);
        }
        
        /* EXACT MATCH: Belt Section */
        .belt-section {
            text-align: center;
            margin: 32px 0;
            padding: 24px;
            background: rgba(218, 165, 32, 0.1);
            border-radius: 16px;
            border: 3px solid #DAA520;
        }
        
        .medal-container {
            margin-bottom: 16px;
        }
        
        .medal {
            width: 80px;
            height: 80px;
            border-radius: 40px;
            background: ${beltColor};
            border: 4px solid #DAA520;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 0 auto;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            font-size: 32px;
        }
        
        .level-text {
            font-size: 18px;
            font-weight: 700;
            color: #2C1810;
            letter-spacing: 2px;
            text-align: center;
            margin-bottom: 4px;
        }
        
        .belt-level {
            font-weight: 900;
            font-size: 20px;
            color: ${beltColor};
        }
        
        .rank-text {
            font-size: 16px;
            font-weight: 700;
            color: #8B4513;
            letter-spacing: 1px;
        }
        
        /* EXACT MATCH: QR Code Section */
        .verification-section {
            position: absolute;
            right: 20px;
            top: 50%;
            text-align: center;
        }
        
        .qr-code-box {
            width: 70px;
            height: 70px;
            background: #fff;
            border-radius: 8px;
            border: 3px solid #333;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 0 auto 8px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        }
        
        .qr-pattern {
            width: 55px;
            height: 55px;
            background: #333;
            border-radius: 4px;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        
        .qr-grid {
            display: flex;
            flex-wrap: wrap;
            width: 36px;
            height: 36px;
        }
        
        .qr-dot {
            width: 10px;
            height: 10px;
            background: transparent;
            margin: 1px;
        }
        
        .qr-dot-active {
            background: #fff;
        }
        
        .verify-text {
            font-size: 10px;
            font-weight: 700;
            color: #333;
            text-align: center;
            line-height: 12px;
        }
        
        /* EXACT MATCH: Official Dojang */
        .dojang-section {
            text-align: center;
            margin: 24px 0;
        }
        
        .official-seal {
            background: #8B4513;
            padding: 8px 24px;
            border-radius: 20px;
            border: 2px solid #DAA520;
            display: inline-block;
        }
        
        .seal-text {
            font-size: 12px;
            font-weight: 700;
            color: #FFD700;
            letter-spacing: 1px;
        }
        
        /* EXACT MATCH: Signatures */
        .signatures-row {
            display: flex;
            justify-content: space-around;
            margin: 32px 24px;
        }
        
        .signature-block {
            text-align: center;
            flex: 1;
        }
        
        .signature-label {
            font-size: 14px;
            font-weight: 600;
            color: #8B4513;
            font-style: italic;
            margin-bottom: 16px;
            letter-spacing: 0.5px;
        }
        
        .signature-line {
            width: 120px;
            height: 2px;
            background: #8B4513;
            margin: 0 auto 8px;
        }
        
        .signer-name {
            font-size: 16px;
            font-weight: 700;
            color: #2C1810;
            letter-spacing: 1px;
        }
        
        /* EXACT MATCH: Footer */
        .footer-section {
            text-align: center;
            margin-top: 24px;
            padding-top: 16px;
            border-top: 1px solid rgba(218, 165, 32, 0.3);
        }
        
        .certificate-id-text {
            font-size: 14px;
            font-weight: 700;
            color: #8B4513;
            letter-spacing: 1px;
            margin-bottom: 4px;
        }
        
        .website-text {
            font-size: 12px;
            font-weight: 600;
            color: #B8860B;
            letter-spacing: 0.5px;
        }
    </style>
</head>
<body>
    <div class="certificate-container">
        <div class="outer-border">
            <div class="certificate-background">
                <!-- EXACT MATCH: Decorative corners -->
                <div class="corner corner-top-left"></div>
                <div class="corner corner-top-right"></div>
                <div class="corner corner-bottom-left"></div>
                <div class="corner corner-bottom-right"></div>
                
                <!-- EXACT MATCH: Header Section -->
                <div class="certificate-header">
                    <div class="logo-section">
                        <div class="logo-container">
                            <div class="logo-image">🥋</div>
                        </div>
                    </div>
                    
                    <div class="title-section">
                        <div class="main-title">CERTIFICATE</div>
                        <div class="title-divider"></div>
                        <div class="sub-title">OF ACHIEVEMENT</div>
                        <div class="discipline">IN TAEKWONDO</div>
                    </div>
                </div>

                <!-- EXACT MATCH: Decorative Elements -->
                <div class="martial-arts-section">
                    <div class="figure left-figure">🥋</div>
                    <div class="center-ornament">⚡</div>
                    <div class="figure right-figure">🏆</div>
                </div>

                <!-- EXACT MATCH: Student Information -->
                <div class="student-section">
                    <div class="presented-to">Proudly Presented To</div>
                    <div class="student-name-large">${(certificate.student || 'STUDENT NAME').toUpperCase()}</div>
                    <div class="achievement-description">For Outstanding Performance & Dedication in Taekwondo</div>
                </div>

                <!-- EXACT MATCH: Award Details -->
                <div class="award-section">
                    <div class="awarded-label">Awarded This</div>
                    <div class="date-display">${formattedDate}</div>
                </div>

                <!-- EXACT MATCH: Belt Level with Medal -->
                <div class="belt-section">
                    <div class="medal-container">
                        <div class="medal">🥋</div>
                    </div>
                    <div class="level-text">
                        LEVEL: <span class="belt-level">${(certificate.title || 'YELLOW BELT').toUpperCase()}</span>
                    </div>
                    <div class="rank-text">RANK: 4TH GUP</div>
                </div>

                <!-- EXACT MATCH: QR Code Verification -->
                <div class="verification-section">
                    <div class="qr-code-box">
                        <div class="qr-pattern">
                            <div class="qr-grid">
                                <div class="qr-dot qr-dot-active"></div>
                                <div class="qr-dot"></div>
                                <div class="qr-dot qr-dot-active"></div>
                                <div class="qr-dot qr-dot-active"></div>
                                <div class="qr-dot"></div>
                                <div class="qr-dot qr-dot-active"></div>
                                <div class="qr-dot qr-dot-active"></div>
                                <div class="qr-dot qr-dot-active"></div>
                                <div class="qr-dot"></div>
                            </div>
                        </div>
                    </div>
                    <div class="verify-text">VERIFY CERTIFICATE</div>
                </div>

                <!-- EXACT MATCH: Official Dojang -->
                <div class="dojang-section">
                    <div class="official-seal">
                        <div class="seal-text">OFFICIAL DOJANG</div>
                    </div>
                </div>

                <!-- EXACT MATCH: Signatures -->
                <div class="signatures-row">
                    <div class="signature-block">
                        <div class="signature-label">Master Instructor</div>
                        <div class="signature-line"></div>
                        <div class="signer-name">Master Kim</div>
                    </div>
                    <div class="signature-block">
                        <div class="signature-label">Academy Director</div>
                        <div class="signature-line"></div>
                        <div class="signer-name">David Lee</div>
                    </div>
                </div>

                <!-- EXACT MATCH: Footer -->
                <div class="footer-section">
                    <div class="certificate-id-text">CERTIFICATE ID: ${certificate.verificationCode || certificate.id || 'TKD20264578'}</div>
                    <div class="website-text">www.verifycertificate.com</div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>`;

    return htmlContent;
  }

  /**
   * Main method to download certificate as PDF - Matches view exactly
   */
  static async downloadCertificatePDF(certificate) {
    try {
      console.log('📄 Starting PDF download for certificate:', certificate.title);
      console.log('📄 Certificate data:', {
        student: certificate.student,
        title: certificate.title,
        issueDate: certificate.issueDate,
        verificationCode: certificate.verificationCode || certificate.id
      });
      
      // Check if required native modules are available
      if (!RNHTMLtoPDF) {
        console.warn('⚠️ PDF generation not available - HtmlToPdf module not linked');
        return { 
          success: false, 
          error: 'PDF generation module not available',
          fallback: true 
        };
      }
      
      // Check for file system module (Android only)
      if (Platform.OS === 'android' && !RNFS) {
        console.warn('⚠️ File system not available - RNFS module not linked');
      }
      
      // Check for share module (iOS only)
      if (Platform.OS === 'ios' && !Share) {
        console.warn('⚠️ Share functionality not available - Share module not linked');
      }
      
      // Request storage permissions for Android
      if (Platform.OS === 'android') {
        const granted = await this.requestStoragePermission();
        if (!granted) {
          Alert.alert('Permission Required', 'Storage permission is required to download the certificate.');
          return { success: false, error: 'Permission denied' };
        }
      }
      
      // Generate HTML content that matches the certificate view exactly
      const htmlContent = this.generateCertificateHTML(certificate);
      
      // Create PDF file name with student and certificate details
      const studentName = (certificate.student || 'Student').replace(/[^a-zA-Z0-9]/g, '_');
      const certificateTitle = (certificate.title || 'Certificate').replace(/[^a-zA-Z0-9]/g, '_');
      const fileName = `${studentName}_${certificateTitle}_Certificate_${Date.now()}.pdf`;
      const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
      
      console.log('📄 Generating PDF with filename:', sanitizedFileName);
      
      // Configure PDF options for perfect rendering
      const options = {
        html: htmlContent,
        fileName: sanitizedFileName,
        directory: Platform.OS === 'android' ? 'Downloads' : 'Documents',
        width: 595, // A4 width in points
        height: 842, // A4 height in points
        base64: false,
        padding: 20,
      };
      
      // Generate PDF
      console.log('🔄 Creating PDF file...');
      const pdf = await RNHTMLtoPDF.convert(options);
      
      if (pdf.filePath) {
        console.log('✅ PDF created successfully:', pdf.filePath);
        
        // For Android, move to Downloads folder and show success message
        if (Platform.OS === 'android') {
          if (RNFS) {
            const downloadsPath = RNFS.DownloadDirectoryPath + '/' + sanitizedFileName;
            await RNFS.moveFile(pdf.filePath, downloadsPath);
            
            return { 
              success: true, 
              filePath: downloadsPath,
              fileName: sanitizedFileName,
              message: 'Certificate downloaded to Downloads folder'
            };
          } else {
            // Fallback when RNFS is not available
            return { 
              success: true, 
              filePath: pdf.filePath,
              fileName: sanitizedFileName,
              message: 'Certificate PDF generated'
            };
          }
        } else {
          // For iOS, show share dialog to save the file
          if (Share) {
            const shareOptions = {
              title: 'Save Certificate PDF',
              message: `${certificate.title || 'Certificate'} Certificate for ${certificate.student || 'Student'}`,
              url: 'file://' + pdf.filePath,
              type: 'application/pdf',
            };
            
            await Share.open(shareOptions);
            
            return { 
              success: true, 
              filePath: pdf.filePath,
              fileName: sanitizedFileName,
              message: 'Certificate ready for saving'
            };
          } else {
            // Fallback when Share is not available
            return { 
              success: true, 
              filePath: pdf.filePath,
              fileName: sanitizedFileName,
              message: 'Certificate PDF generated'
            };
          }
        }
      } else {
        throw new Error('Failed to generate PDF file');
      }
    } catch (error) {
      console.error('❌ Certificate PDF download error:', error);
      
      // Check if it's a native module error
      if (error.message.includes('TurboModuleRegistry') || error.message.includes('HtmlToPdf')) {
        return { 
          success: false, 
          error: 'Native module not available',
          fallback: true 
        };
      }
      
      return { success: false, error: error.message };
    }
  }

  /**
   * Request storage permission for Android
   */
  static async requestStoragePermission() {
    try {
      if (Platform.OS === 'android') {
        if (Platform.Version >= 33) {
          // Android 13+ doesn't need WRITE_EXTERNAL_STORAGE permission
          return true;
        } else {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
              title: 'Storage Permission',
              message: 'This app needs access to storage to download certificates.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            }
          );
          return granted === PermissionsAndroid.RESULTS.GRANTED;
        }
      }
      return true;
    } catch (error) {
      console.error('Permission request error:', error);
      return false;
    }
  }

  // Legacy methods for backward compatibility
  static async generateAndDownloadCertificate(certificate) {
    return this.downloadCertificatePDF(certificate);
  }

  static async generateAndShareCertificate(certificate) {
    return this.downloadCertificatePDF(certificate);
  }
}

// Export the class as both default and named export for compatibility
export default CertificatePDFService;
export { CertificatePDFService };