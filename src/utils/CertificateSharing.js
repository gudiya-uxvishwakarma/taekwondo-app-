import { Alert, Clipboard, Linking, Platform, PermissionsAndroid } from 'react-native';

class CertificateSharing {
  
  // Generate formatted certificate text for sharing
  static generateCertificateText(certificate) {
    return `🏆 Certificate of Achievement 🏆

👤 Student: ${certificate.student}
🎯 Achievement: ${certificate.title}
📊 Level: ${certificate.type}
📅 Issue Date: ${certificate.issueDate}
🆔 Certificate ID: ${certificate.id}

✅ Verify this certificate at:
https://verify.certificate.com/${certificate.id}

#Certificate #Achievement #${certificate.type.replace(/\s+/g, '')}`;
  }

  // Generate certificate data for download
  static generateDownloadText(certificate) {
    const verificationCode = certificate.verificationCode || `VERIFY-${certificate.id}`;
    
    return `
CERTIFICATE OF ACHIEVEMENT

This is to certify that
${certificate.student}

has been awarded
${certificate.title}
in ${certificate.type}

Certificate ID: ${certificate.id}
Issue Date: ${certificate.issueDate}
Verification Code: ${verificationCode}

This certificate can be verified at: 
https://verify.certificate.com/${certificate.id}

Generated on: ${new Date().toLocaleDateString()}
    `.trim();
  }

  // Share via WhatsApp
  static async shareViaWhatsApp(certificate) {
    try {
      const text = this.generateCertificateText(certificate);
      
      // Try multiple WhatsApp URL schemes
      const whatsappUrls = [
        `whatsapp://send?text=${encodeURIComponent(text)}`,
        `https://wa.me/?text=${encodeURIComponent(text)}`,
        `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`
      ];
      
      // Try to open WhatsApp with different URL schemes
      for (const url of whatsappUrls) {
        try {
          const canOpen = await Linking.canOpenURL(url);
          console.log(`Checking WhatsApp URL: ${url.substring(0, 50)}... - Can open: ${canOpen}`);
          
          if (canOpen) {
            await Linking.openURL(url);
            return { success: true };
          }
        } catch (urlError) {
          console.log(`Failed to check/open URL: ${url.substring(0, 50)}...`, urlError);
          continue;
        }
      }
      
      // If all WhatsApp URLs fail, try direct opening without checking
      try {
        await Linking.openURL(whatsappUrls[0]);
        return { success: true };
      } catch (directError) {
        console.log('Direct WhatsApp opening failed:', directError);
        
        // Fallback: copy to clipboard
        await Clipboard.setString(text);
        Alert.alert(
          'WhatsApp Share',
          'Opening WhatsApp... If WhatsApp doesn\'t open, the certificate details have been copied to your clipboard.',
          [{ text: 'OK' }]
        );
        return { success: true, fallback: true };
      }
      
    } catch (error) {
      console.error('WhatsApp share error:', error);
      
      // Final fallback: copy to clipboard
      try {
        const text = this.generateCertificateText(certificate);
        await Clipboard.setString(text);
        Alert.alert(
          'WhatsApp Share',
          'Certificate details copied to clipboard. You can paste them in WhatsApp manually.',
          [{ text: 'OK' }]
        );
        return { success: true, fallback: true };
      } catch (clipboardError) {
        return { success: false, error: 'Failed to share via WhatsApp and clipboard' };
      }
    }
  }

  // Share via Email
  static async shareViaEmail(certificate) {
    try {
      const text = this.generateCertificateText(certificate);
      const subject = `Certificate of Achievement - ${certificate.title}`;
      const body = text.replace(/\n/g, '%0D%0A');
      
      // Try multiple email URL schemes
      const emailUrls = [
        `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
        `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`,
        `mailto:?body=${encodeURIComponent(text)}`
      ];
      
      // Try to open email with different URL schemes
      for (const url of emailUrls) {
        try {
          const canOpen = await Linking.canOpenURL(url);
          console.log(`Checking Email URL: ${url.substring(0, 50)}... - Can open: ${canOpen}`);
          
          if (canOpen) {
            await Linking.openURL(url);
            return { success: true };
          }
        } catch (urlError) {
          console.log(`Failed to check/open email URL: ${url.substring(0, 50)}...`, urlError);
          continue;
        }
      }
      
      // If all email URLs fail, try direct opening without checking
      try {
        await Linking.openURL(emailUrls[0]);
        return { success: true };
      } catch (directError) {
        console.log('Direct email opening failed:', directError);
        
        // Fallback: copy to clipboard
        await Clipboard.setString(text);
        Alert.alert(
          'Email Share',
          'Opening email app... If no email app opens, the certificate details have been copied to your clipboard.',
          [{ text: 'OK' }]
        );
        return { success: true, fallback: true };
      }
      
    } catch (error) {
      console.error('Email share error:', error);
      
      // Final fallback: copy to clipboard
      try {
        const text = this.generateCertificateText(certificate);
        await Clipboard.setString(text);
        Alert.alert(
          'Email Share',
          'Certificate details copied to clipboard. You can paste them in your email app manually.',
          [{ text: 'OK' }]
        );
        return { success: true, fallback: true };
      } catch (clipboardError) {
        return { success: false, error: 'Failed to share via email and clipboard' };
      }
    }
  }

  // Download certificate
  static async downloadCertificate(certificate) {
    try {
      console.log('📥 Starting certificate download...');
      
      // Request storage permission on Android (for newer versions, this might not be needed)
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
              title: 'Storage Permission',
              message: 'App needs access to storage to download certificates',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            }
          );
          
          console.log('Permission result:', granted);
          
          // Continue even if permission is denied, as we'll use clipboard as fallback
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            console.log('Storage permission denied, using clipboard fallback');
          }
        } catch (permissionError) {
          console.log('Permission request failed:', permissionError);
          // Continue with clipboard fallback
        }
      }

      const certificateText = this.generateDownloadText(certificate);
      console.log('Generated certificate text for download');
      
      // Copy to clipboard as primary method
      await Clipboard.setString(certificateText);
      console.log('Certificate copied to clipboard');
      
      // Show success message
      Alert.alert(
        'Certificate Downloaded! 📥',
        'Certificate details have been saved to your clipboard. You can now paste them anywhere or save them to a file.',
        [
          { 
            text: 'View Details', 
            onPress: () => {
              Alert.alert(
                'Certificate Details',
                certificateText,
                [{ text: 'OK' }]
              );
            }
          },
          { text: 'OK' }
        ]
      );

      return { success: true };
    } catch (error) {
      console.error('Download error:', error);
      
      // Try basic clipboard copy as final fallback
      try {
        const basicText = `Certificate: ${certificate.title}\nStudent: ${certificate.student}\nID: ${certificate.id}\nDate: ${certificate.issueDate}`;
        await Clipboard.setString(basicText);
        
        Alert.alert(
          'Download Completed',
          'Basic certificate details have been copied to clipboard.',
          [{ text: 'OK' }]
        );
        
        return { success: true, fallback: true };
      } catch (fallbackError) {
        return { success: false, error: 'Failed to download certificate' };
      }
    }
  }

  // Copy verification link
  static async copyVerificationLink(certificate) {
    try {
      const verificationUrl = `https://verify.certificate.com/${certificate.id}`;
      await Clipboard.setString(verificationUrl);
      
      Alert.alert(
        'Link Copied',
        'Certificate verification link has been copied to clipboard.',
        [{ text: 'OK' }]
      );

      return { success: true };
    } catch (error) {
      console.error('Copy link error:', error);
      return { success: false, error: error.message };
    }
  }

  // Verify certificate
  static async verifyCertificate(certificate) {
    try {
      const verificationCode = certificate.verificationCode || `VERIFY-${certificate.id}`;
      const verificationUrl = `https://verify.certificate.com/${certificate.id}`;
      
      Alert.alert(
        'Certificate Verification',
        `Certificate ID: ${certificate.id}\nVerification Code: ${verificationCode}\n\nYou can verify this certificate online.`,
        [
          { 
            text: 'Copy Verification Link', 
            onPress: async () => {
              await Clipboard.setString(verificationUrl);
              Alert.alert('Link Copied', 'Verification link copied to clipboard.');
            }
          },
          { 
            text: 'Open Verification Page', 
            onPress: () => {
              Linking.openURL(verificationUrl).catch(() => {
                Alert.alert('Error', 'Could not open verification page.');
              });
            }
          },
          { text: 'Close' }
        ]
      );

      return { success: true };
    } catch (error) {
      console.error('Verification error:', error);
      return { success: false, error: error.message };
    }
  }

  // Generic share handler
  static async handleShare(certificate, option) {
    switch (option) {
      case 'WhatsApp':
        return await this.shareViaWhatsApp(certificate);
      
      case 'Email':
        return await this.shareViaEmail(certificate);
      
      case 'Download':
        return await this.downloadCertificate(certificate);
      
      case 'Copy Link':
        return await this.copyVerificationLink(certificate);
      
      default:
        return { success: false, error: 'Unknown share option' };
    }
  }
}

export default CertificateSharing;