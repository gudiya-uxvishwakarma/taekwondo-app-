import { Alert, PermissionsAndroid, Platform, Clipboard, Linking } from 'react-native';

class CertificatePDFGenerator {
  
  // Generate HTML content for PDF conversion
  static generateCertificateHTML(certificate) {
    const verificationCode = certificate.verificationCode || `VERIFY-${certificate.id}`;
    
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Certificate of Achievement</title>
    <style>
        @page {
            size: A4;
            margin: 0;
        }
        
        body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 40px;
            background: white;
            color: #333;
            line-height: 1.6;
        }
        
        .certificate-container {
            width: 100%;
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border: 3px solid #ff0000;
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
            position: relative;
            min-height: 600px;
        }
        
        .header-decoration {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 60px;
            background: linear-gradient(135deg, #ff0000 0%, #cc0000 100%);
            border-radius: 17px 17px 0 0;
        }
        
        .gold-accent {
            position: absolute;
            top: 25px;
            left: 20px;
            right: 20px;
            height: 20px;
            background: #FFD700;
            border-radius: 10px;
        }
        
        .title-section {
            text-align: center;
            margin-top: 80px;
            margin-bottom: 40px;
        }
        
        .certificate-title {
            font-size: 36px;
            font-weight: bold;
            color: #ff0000;
            letter-spacing: 3px;
            margin-bottom: 10px;
        }
        
        .certificate-subtitle {
            font-size: 20px;
            color: #666;
            font-style: italic;
        }
        
        .student-section {
            text-align: center;
            margin: 50px 0;
        }
        
        .student-label {
            font-size: 16px;
            color: #666;
            margin-bottom: 15px;
        }
        
        .student-name {
            font-size: 32px;
            font-weight: bold;
            color: #000;
            margin: 20px 0;
            text-transform: uppercase;
        }
        
        .achievement-text {
            font-size: 16px;
            color: #666;
            margin-bottom: 10px;
        }
        
        .achievement-title {
            font-size: 24px;
            font-weight: bold;
            color: #FFD700;
            margin: 15px 0;
            text-transform: uppercase;
        }
        
        .level-text {
            font-size: 16px;
            color: #666;
        }
        
        .details-section {
            text-align: center;
            margin: 40px 0;
            font-size: 14px;
            color: #999;
        }
        
        .details-section div {
            margin: 5px 0;
        }
        
        .qr-section {
            text-align: center;
            margin: 30px 0;
        }
        
        .qr-placeholder {
            width: 80px;
            height: 80px;
            border: 2px solid #333;
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            color: #666;
            background: #f8f9fa;
        }
        
        .signature-section {
            text-align: center;
            margin-top: 50px;
        }
        
        .signature-line {
            width: 200px;
            height: 1px;
            background: #000;
            margin: 0 auto 10px;
        }
        
        .director-name {
            font-size: 16px;
            font-weight: 500;
            color: #000;
        }
        
        .director-title {
            font-size: 14px;
            color: #666;
            font-style: italic;
        }
        
        .bottom-decoration {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 40px;
            background: #151112;
            border-radius: 0 0 17px 17px;
        }
        
        .watermark {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 60px;
            font-weight: bold;
            color: rgba(0,0,0,0.05);
            z-index: -1;
        }
        
        .verification-url {
            position: absolute;
            bottom: 10px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 10px;
            color: #999;
        }
    </style>
</head>
<body>
    <div class="certificate-container">
        <div class="header-decoration"></div>
        <div class="gold-accent"></div>
        
        <div class="title-section">
            <div class="certificate-title">CERTIFICATE</div>
            <div class="certificate-subtitle">of Achievement</div>
        </div>
        
        <div class="student-section">
            <div class="student-label">This is to certify that</div>
            <div class="student-name">${certificate.student}</div>
            <div class="achievement-text">has been awarded</div>
            <div class="achievement-title">${certificate.title}</div>
            <div class="level-text">in ${certificate.type}</div>
        </div>
        
        <div class="details-section">
            <div>Certificate ID: ${certificate.id}</div>
            <div>Issue Date: ${certificate.issueDate}</div>
            <div>Verification: ${verificationCode}</div>
        </div>
        
        <div class="qr-section">
            <div class="qr-placeholder">
                QR CODE<br>
                <small>Scan to Verify</small>
            </div>
        </div>
        
        <div class="signature-section">
            <div class="signature-line"></div>
            <div class="director-name">Director Name</div>
            <div class="director-title">Academy Director</div>
        </div>
        
        <div class="bottom-decoration"></div>
        <div class="watermark">AUTHENTIC</div>
        <div class="verification-url">
            Verify at: https://verify.certificate.com/${certificate.id}
        </div>
    </div>
</body>
</html>`;
  }

  // Generate and save HTML certificate
  static async generateCertificateFile(certificate) {
    try {
      console.log('📄 Generating certificate content for:', certificate.id);
      
      // Generate HTML content
      const htmlContent = this.generateCertificateHTML(certificate);
      
      // Create filename
      const fileName = `Certificate_${certificate.id}_${certificate.student.replace(/\s+/g, '_')}.html`;
      
      console.log('✅ Certificate content generated');
      
      return {
        success: true,
        fileName,
        htmlContent,
        mimeType: 'text/html'
      };

    } catch (error) {
      console.error('❌ Certificate generation error:', error);
      return {
        success: false,
        error: `Failed to generate certificate: ${error.message}`
      };
    }
  }

  // Save certificate to device (copy to clipboard)
  static async saveCertificateToDevice(certificate) {
    try {
      console.log('💾 Saving certificate to clipboard');
      
      const result = await this.generateCertificateFile(certificate);
      
      if (!result.success) {
        Alert.alert('Save Error', result.error);
        return result;
      }
      
      // Copy HTML content to clipboard
      await Clipboard.setString(result.htmlContent);
      
      Alert.alert(
        'Certificate Downloaded! 📥',
        `Certificate HTML has been copied to your clipboard!\n\nTo save as PDF:\n1. Open any browser\n2. Create a new HTML file\n3. Paste the content\n4. Print as PDF\n\nFilename: ${result.fileName}`,
        [
          { 
            text: 'View Content', 
            onPress: () => {
              Alert.alert(
                'Certificate HTML',
                'The HTML content is now in your clipboard. You can paste it into any text editor or browser.',
                [{ text: 'OK' }]
              );
            }
          },
          { text: 'OK' }
        ]
      );

      return result;
      
    } catch (error) {
      console.error('❌ Save certificate error:', error);
      
      Alert.alert(
        'Download Error',
        'Failed to save certificate. Please try again.',
        [{ text: 'OK' }]
      );
      
      return { success: false, error: error.message };
    }
  }

  // Share certificate via apps
  static async shareCertificate(certificate) {
    try {
      console.log('📤 Sharing certificate');
      
      const result = await this.generateCertificateFile(certificate);
      
      if (!result.success) {
        Alert.alert('Share Error', result.error);
        return result;
      }
      
      // Create formatted certificate text for sharing
      const shareText = `🏆 CERTIFICATE OF ACHIEVEMENT 🏆

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                    OFFICIAL CERTIFICATE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This is to certify that

🎓 ${certificate.student.toUpperCase()} 🎓

has been awarded

🏅 ${certificate.title.toUpperCase()} 🏅
in ${certificate.type}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Certificate ID: ${certificate.id}
📅 Issue Date: ${certificate.issueDate}
🔐 Verification: ${certificate.verificationCode || `VERIFY-${certificate.id}`}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Verify this certificate online:
🌐 https://verify.certificate.com/${certificate.id}

🏆 This certificate is authentic and verified 🏆

#Certificate #Achievement #${certificate.type.replace(/\s+/g, '')} #Verified

📄 Full HTML version copied to clipboard for PDF conversion!`;

      // Copy HTML to clipboard for PDF conversion
      await Clipboard.setString(result.htmlContent);
      
      // Try to share the formatted text
      try {
        // Try WhatsApp first
        const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(shareText)}`;
        const canOpenWhatsApp = await Linking.canOpenURL(whatsappUrl);
        
        if (canOpenWhatsApp) {
          await Linking.openURL(whatsappUrl);
          
          Alert.alert(
            'Certificate Shared! 📤',
            'Certificate shared to WhatsApp!\n\nBonus: Full HTML version is also copied to your clipboard for creating PDF files.',
            [{ text: 'OK' }]
          );
          
          return { success: true };
        } else {
          // Fallback to email
          const subject = `Certificate of Achievement - ${certificate.title}`;
          const emailUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(shareText)}`;
          const canOpenEmail = await Linking.canOpenURL(emailUrl);
          
          if (canOpenEmail) {
            await Linking.openURL(emailUrl);
            
            Alert.alert(
              'Certificate Shared! 📤',
              'Certificate shared via Email!\n\nBonus: Full HTML version is also copied to your clipboard for creating PDF files.',
              [{ text: 'OK' }]
            );
            
            return { success: true };
          } else {
            // Final fallback - just clipboard
            Alert.alert(
              'Certificate Ready! 📋',
              'Certificate content has been copied to your clipboard!\n\nYou can:\n1. Paste in WhatsApp/Email manually\n2. Create HTML file for PDF conversion\n3. Share the formatted certificate text',
              [{ text: 'OK' }]
            );
            
            return { success: true, fallback: true };
          }
        }
      } catch (linkError) {
        console.log('Linking failed, using clipboard fallback:', linkError);
        
        Alert.alert(
          'Certificate Ready! 📋',
          'Certificate content has been copied to your clipboard!\n\nYou can paste it in any app or create an HTML file for PDF conversion.',
          [{ text: 'OK' }]
        );
        
        return { success: true, fallback: true };
      }
      
    } catch (error) {
      console.error('❌ Share certificate error:', error);
      
      Alert.alert(
        'Share Error',
        'Failed to share certificate. Please try again.',
        [{ text: 'OK' }]
      );
      
      return { success: false, error: error.message };
    }
  }

  // Main method to generate and handle certificate
  static async generateAndHandleCertificate(certificate, action = 'download') {
    try {
      // Handle based on action
      if (action === 'download') {
        return await this.saveCertificateToDevice(certificate);
      } else if (action === 'share') {
        return await this.shareCertificate(certificate);
      }

      return { success: false, error: 'Unknown action' };
      
    } catch (error) {
      console.error('❌ Certificate handling error:', error);
      Alert.alert('Certificate Error', 'Failed to process certificate.');
      return { success: false, error: error.message };
    }
  }
}

export default CertificatePDFGenerator;