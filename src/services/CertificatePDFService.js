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
   * Generate certificate HTML content with exact styling matching the view
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

    // Generate HTML that matches the exact certificate design from the view
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
            padding: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }
        
        .certificate-container {
            width: 450px;
            min-height: 600px;
            position: relative;
            box-shadow: 0 8px 30px rgba(0,0,0,0.2);
        }
        
        .outer-frame {
            width: 100%;
            height: 100%;
            background: #DAA520;
            border-radius: 20px;
            padding: 8px;
            border: 3px solid #B8860B;
        }
        
        .inner-frame {
            width: 100%;
            min-height: 580px;
            background: #FFF8DC;
            border-radius: 12px;
            padding: 24px;
            position: relative;
            border: 2px solid #DAA520;
        }
        
        .corner-decoration {
            position: absolute;
            width: 20px;
            height: 20px;
            border: 2px solid #DAA520;
            border-radius: 3px;
            background: rgba(218, 165, 32, 0.2);
        }
        
        .top-left { top: 8px; left: 8px; }
        .top-right { top: 8px; right: 8px; }
        .bottom-left { bottom: 8px; left: 8px; }
        .bottom-right { bottom: 8px; right: 8px; }
        
        .header-section {
            text-align: center;
            margin-top: 16px;
            margin-bottom: 24px;
        }
        
        .logo-container {
            width: 80px;
            height: 80px;
            border-radius: 40px;
            background: #FFF8DC;
            border: 3px solid #8B4513;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 0 auto 12px;
            box-shadow: 0 4px 10px rgba(239, 68, 68, 0.2);
        }
        
        .logo-image {
            width: 70px;
            height: 70px;
            border-radius: 35px;
            background: #FFD700;
            border: 2px solid rgba(239, 68, 68, 0.1);
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 24px;
            color: #8B4513;
            font-weight: 900;
        }
        
        .organization-name {
            font-size: 14px;
            font-weight: 700;
            color: #8B4513;
            letter-spacing: 1px;
            text-align: center;
        }
        
        .certificate-title-section {
            text-align: center;
            margin-bottom: 24px;
        }
        
        .certificate-main-title {
            font-size: 36px;
            font-weight: 900;
            color: #8B4513;
            letter-spacing: 4px;
            text-align: center;
        }
        
        .title-underline {
            width: 180px;
            height: 3px;
            background: #8B4513;
            margin: 8px auto;
        }
        
        .certificate-sub-title {
            font-size: 18px;
            font-weight: 700;
            color: #8B4513;
            letter-spacing: 2px;
            text-align: center;
        }
        
        .certificate-discipline {
            font-size: 16px;
            font-weight: 600;
            color: #DC143C;
            letter-spacing: 1.5px;
            text-align: center;
            margin-top: 4px;
        }
        
        .decorative-ornament {
            text-align: center;
            margin: 16px 0;
        }
        
        .ornament-text {
            font-size: 24px;
            color: #DAA520;
        }
        
        .presented-section {
            text-align: center;
            margin-bottom: 24px;
        }
        
        .presented-text {
            font-size: 16px;
            font-weight: 600;
            color: #8B4513;
            font-style: italic;
            margin-bottom: 12px;
            font-family: serif;
        }
        
        .student-name {
            font-size: 28px;
            font-weight: 900;
            color: #2C1810;
            text-align: center;
            letter-spacing: 2px;
            margin-bottom: 12px;
        }
        
        .achievement-text {
            font-size: 14px;
            font-weight: 600;
            color: #8B4513;
            text-align: center;
            font-style: italic;
            line-height: 20px;
            font-family: serif;
        }
        
        .date-section {
            text-align: center;
            margin-bottom: 24px;
        }
        
        .awarded-text {
            font-size: 14px;
            font-weight: 600;
            color: #8B4513;
            margin-bottom: 12px;
            font-family: serif;
        }
        
        .date-text {
            font-size: 20px;
            font-weight: 800;
            color: #DC143C;
            letter-spacing: 1px;
        }
        
        .level-rank-section {
            text-align: center;
            margin-bottom: 24px;
            background: rgba(218, 165, 32, 0.1);
            padding: 12px 24px;
            border-radius: 12px;
            border: 2px solid #DAA520;
        }
        
        .level-rank-text {
            font-size: 16px;
            font-weight: 700;
            color: #2C1810;
            letter-spacing: 1px;
            text-align: center;
        }
        
        .level-value {
            font-weight: 900;
            font-size: 17px;
            color: ${beltColor};
        }
        
        .qr-section {
            position: absolute;
            right: 20px;
            top: 45%;
            text-align: center;
        }
        
        .qr-code {
            width: 60px;
            height: 60px;
            background: #fff;
            border-radius: 8px;
            border: 3px solid #333;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 0 auto 6px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .qr-pattern {
            width: 45px;
            height: 45px;
            background: #333;
            border-radius: 4px;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        
        .qr-grid {
            display: flex;
            flex-wrap: wrap;
            width: 30px;
            height: 30px;
        }
        
        .qr-dot {
            width: 8px;
            height: 8px;
            background: transparent;
            margin: 1px;
        }
        
        .qr-dot-active {
            background: #fff;
        }
        
        .qr-label {
            font-size: 9px;
            font-weight: 700;
            color: #333;
            text-align: center;
            line-height: 11px;
            margin-bottom: 4px;
        }
        
        .qr-code-text {
            font-size: 8px;
            font-weight: 600;
            color: #666;
            text-align: center;
        }
        
        .signatures-section {
            display: flex;
            justify-content: space-between;
            margin-bottom: 24px;
            padding: 0 48px;
            margin-top: 48px;
        }
        
        .signature {
            text-align: center;
            flex: 1;
        }
        
        .signature-title {
            font-size: 12px;
            font-weight: 600;
            color: #8B4513;
            font-style: italic;
            margin-bottom: 12px;
            font-family: serif;
        }
        
        .signature-line {
            width: 100px;
            height: 2px;
            background: #8B4513;
            margin: 0 auto 12px;
        }
        
        .signature-name {
            font-size: 14px;
            font-weight: 700;
            color: #2C1810;
        }
        
        .certificate-footer {
            text-align: center;
            margin-top: 16px;
        }
        
        .certificate-id {
            font-size: 12px;
            font-weight: 700;
            color: #8B4513;
            letter-spacing: 1px;
            margin-bottom: 4px;
        }
        
        .website-url {
            font-size: 10px;
            font-weight: 600;
            color: #B8860B;
        }
    </style>
</head>
<body>
    <div class="certificate-container">
        <div class="outer-frame">
            <div class="inner-frame">
                <!-- Decorative corners -->
                <div class="corner-decoration top-left"></div>
                <div class="corner-decoration top-right"></div>
                <div class="corner-decoration bottom-left"></div>
                <div class="corner-decoration bottom-right"></div>
                
                <!-- Header with Logo Integration -->
                <div class="header-section">
                    <div class="logo-container">
                        <div class="logo-image">TKD</div>
                    </div>
                    <div class="organization-name">TAEKWON-DO ASSOCIATION OF KARNATAKA</div>
                </div>

                <!-- Certificate Title Section -->
                <div class="certificate-title-section">
                    <div class="certificate-main-title">CERTIFICATE</div>
                    <div class="title-underline"></div>
                    <div class="certificate-sub-title">OF ACHIEVEMENT</div>
                    <div class="certificate-discipline">IN TAEKWONDO</div>
                </div>

                <!-- Decorative ornament -->
                <div class="decorative-ornament">
                    <div class="ornament-text">❋</div>
                </div>

                <!-- Presented To Section -->
                <div class="presented-section">
                    <div class="presented-text">Proudly Presented To</div>
                    <div class="student-name">${(certificate.student || 'STUDENT NAME').toUpperCase()}</div>
                    <div class="achievement-text">For Outstanding Performance & Dedication in Taekwondo</div>
                </div>

                <!-- Award Date Section -->
                <div class="date-section">
                    <div class="awarded-text">Awarded This</div>
                    <div class="date-text">${formattedDate}</div>
                </div>

                <!-- Level and Rank Section -->
                <div class="level-rank-section">
                    <div class="level-rank-text">
                        LEVEL: <span class="level-value">${(certificate.title || 'YELLOW BELT').toUpperCase()}</span>
                    </div>
                </div>

                <!-- QR Code Section - Positioned on the right side -->
                <div class="qr-section">
                    <div class="qr-code">
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
                    <div class="qr-label">VERIFY<br>CERTIFICATE</div>
                    <div class="qr-code-text">${certificate.verificationCode || certificate.id || 'TKD2026'}</div>
                </div>

                <!-- Signatures Section -->
                <div class="signatures-section">
                    <div class="signature">
                        <div class="signature-title">Master Instructor</div>
                        <div class="signature-line"></div>
                        <div class="signature-name">Master Kim</div>
                    </div>
                    <div class="signature">
                        <div class="signature-title">Academy Director</div>
                        <div class="signature-line"></div>
                        <div class="signature-name">David Lee</div>
                    </div>
                </div>

                <!-- Certificate Footer -->
                <div class="certificate-footer">
                    <div class="certificate-id">CERTIFICATE ID: ${certificate.verificationCode || certificate.id || 'TKD20264578'}</div>
                    <div class="website-url">www.verifycertificate.com</div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>`;

    return htmlContent;
  }

  /**
   * Main method to download certificate as PDF - Direct download only, no sharing
   */
  static async downloadCertificatePDF(certificate) {
    try {
      console.log('📄 Starting PDF download for:', certificate.title);
      
      // Check if required native modules are available
      if (!RNHTMLtoPDF) {
        console.warn('⚠️ PDF generation not available - HtmlToPdf module not linked');
        Alert.alert(
          'PDF Generation Unavailable',
          'PDF generation is currently not available. The certificate can still be viewed on screen.',
          [{ text: 'OK' }]
        );
        return { 
          success: false, 
          error: 'PDF generation module not available',
          fallback: true 
        };
      }
      
      // Check for file system module (Android only)
      if (Platform.OS === 'android' && !RNFS) {
        console.warn('⚠️ File system not available - RNFS module not linked');
        Alert.alert(
          'File System Unavailable',
          'File system access is not available. PDF generation may be limited.',
          [{ text: 'OK' }]
        );
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
      
      // Generate HTML content that matches the certificate design exactly
      const htmlContent = this.generateCertificateHTML(certificate);
      
      // Create PDF file name
      const fileName = (certificate.student || 'Student') + '_' + (certificate.title || 'Certificate') + '_Certificate_' + Date.now() + '.pdf';
      const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
      
      // Configure PDF options
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
            
            Alert.alert(
              'Certificate Downloaded',
              'Certificate has been saved to Downloads folder as:\n' + sanitizedFileName,
              [{ text: 'OK' }]
            );
            
            return { 
              success: true, 
              filePath: downloadsPath,
              fileName: sanitizedFileName,
              message: 'Certificate downloaded to Downloads folder'
            };
          } else {
            // Fallback when RNFS is not available
            Alert.alert(
              'PDF Generated',
              'Certificate PDF has been generated successfully.',
              [{ text: 'OK' }]
            );
            
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
              message: (certificate.title || 'Certificate') + ' Certificate for ' + (certificate.student || 'Student'),
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
            Alert.alert(
              'PDF Generated',
              'Certificate PDF has been generated successfully.',
              [{ text: 'OK' }]
            );
            
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
        Alert.alert(
          'PDF Feature Unavailable',
          'PDF download is temporarily unavailable. You can still view the certificate on screen.',
          [{ text: 'OK' }]
        );
        return { 
          success: false, 
          error: 'Native module not available',
          fallback: true 
        };
      }
      
      Alert.alert(
        'Download Failed',
        'Failed to download certificate. Please try again.',
        [{ text: 'OK' }]
      );
      
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