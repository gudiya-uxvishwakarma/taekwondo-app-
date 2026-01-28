import { Alert, Linking, Share } from 'react-native';

class SharingService {
  constructor() {
    this.baseUrl = 'https://taekwondo-academy.com'; // Replace with your actual domain
  }

  // Share certificate via WhatsApp
  async shareViaWhatsApp(certificate, imageUri = null) {
    try {
      console.log('📱 Sharing certificate via WhatsApp:', certificate.id);
      
      const message = this.generateCertificateMessage(certificate);
      const verificationUrl = `${this.baseUrl}/verify/${certificate.id}`;
      const fullMessage = `${message}\n\nVerify at: ${verificationUrl}`;
      
      // Try WhatsApp URL scheme first
      const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(fullMessage)}`;
      
      const canOpenWhatsApp = await Linking.canOpenURL(whatsappUrl);
      if (canOpenWhatsApp) {
        await Linking.openURL(whatsappUrl);
        return { success: true, message: 'WhatsApp opened successfully' };
      } else {
        // Fallback to system share
        const result = await Share.share({
          message: fullMessage,
          title: 'Certificate Verification'
        });
        
        if (result.action === Share.sharedAction) {
          return { success: true, message: 'Certificate shared successfully' };
        } else {
          return { success: true, message: 'Share dialog opened' };
        }
      }
    } catch (error) {
      console.error('❌ WhatsApp share error:', error);
      return { 
        success: false, 
        message: 'Failed to share via WhatsApp. Please try again.' 
      };
    }
  }

  // Share certificate via Email
  async shareViaEmail(certificate, imageUri = null) {
    try {
      console.log('📧 Sharing certificate via Email:', certificate.id);
      
      const subject = `Certificate Verification - ${certificate.title}`;
      const message = this.generateCertificateMessage(certificate);
      const verificationUrl = `${this.baseUrl}/verify/${certificate.id}`;
      
      const emailBody = `${message}\n\nYou can verify this certificate at: ${verificationUrl}\n\nBest regards,\nCombat Warrior Institute`;
      
      // Try mailto URL first
      const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
      
      const canOpenEmail = await Linking.canOpenURL(mailtoUrl);
      if (canOpenEmail) {
        await Linking.openURL(mailtoUrl);
        return { success: true, message: 'Email client opened successfully' };
      } else {
        // Fallback to system share
        const result = await Share.share({
          message: `${subject}\n\n${emailBody}`,
          title: subject
        });
        
        if (result.action === Share.sharedAction) {
          return { success: true, message: 'Email shared successfully' };
        } else {
          return { success: true, message: 'Share dialog opened' };
        }
      }
    } catch (error) {
      console.error('❌ Email share error:', error);
      return this.fallbackEmailShare(certificate);
    }
  }

  // Fallback email sharing using system share
  async fallbackEmailShare(certificate) {
    try {
      const subject = `Certificate Verification - ${certificate.title}`;
      const message = this.generateCertificateMessage(certificate);
      const verificationUrl = `${this.baseUrl}/verify/${certificate.id}`;
      
      const emailBody = `${message}\n\nYou can verify this certificate at: ${verificationUrl}\n\nBest regards,\nCombat Warrior Institute`;
      
      const result = await Share.share({
        message: `${subject}\n\n${emailBody}`,
        title: subject
      });
      
      return { success: true, message: 'Share options opened' };
    } catch (error) {
      console.error('❌ Fallback email share error:', error);
      return { 
        success: false, 
        message: 'Failed to share via email. Please try again.' 
      };
    }
  }

  // Download certificate as PDF
  async downloadAsPDF(certificate, imageUri = null) {
    try {
      console.log('📄 Downloading certificate as PDF:', certificate.id);
      
      // Create certificate content as text
      const content = this.generateCertificateText(certificate);
      
      // Use system share to save/download
      const result = await Share.share({
        message: content,
        title: `Certificate_${certificate.id}.txt`
      });
      
      if (result.action === Share.sharedAction) {
        return { 
          success: true, 
          message: 'Certificate content shared successfully. You can save it to your preferred app.',
          filePath: null
        };
      } else {
        return { 
          success: true, 
          message: 'Share dialog opened. You can save the certificate to any app.',
          filePath: null
        };
      }
    } catch (error) {
      console.error('❌ PDF download error:', error);
      return { 
        success: false, 
        message: 'Failed to share certificate content. Please try again.' 
      };
    }
  }

  // Copy verification link to clipboard (using Share API as fallback)
  async copyVerificationLink(certificate) {
    try {
      console.log('📋 Copying verification link:', certificate.id);
      
      const verificationUrl = `${this.baseUrl}/verify/${certificate.id}`;
      
      // Use Share API as fallback for clipboard
      const result = await Share.share({
        message: verificationUrl,
        title: 'Certificate Verification Link'
      });
      
      if (result.action === Share.sharedAction) {
        return { 
          success: true, 
          message: 'Verification link shared successfully. You can copy it from the shared content.',
          link: verificationUrl
        };
      } else {
        return { 
          success: true, 
          message: 'Share dialog opened. You can copy the verification link from there.',
          link: verificationUrl
        };
      }
    } catch (error) {
      console.error('❌ Copy link error:', error);
      return { 
        success: false, 
        message: 'Failed to share verification link. Please try again.' 
      };
    }
  }

  // Generic share (opens system share sheet)
  async shareGeneric(certificate, imageUri = null) {
    try {
      console.log('🔗 Generic share:', certificate.id);
      
      const message = this.generateCertificateMessage(certificate);
      const verificationUrl = `${this.baseUrl}/verify/${certificate.id}`;
      const fullMessage = `${message}\n\nVerify at: ${verificationUrl}`;
      
      const result = await Share.share({
        message: fullMessage,
        title: 'Certificate Verification',
        url: verificationUrl // This will be shared as a link
      });
      
      if (result.action === Share.sharedAction) {
        return { success: true, message: 'Certificate shared successfully' };
      } else if (result.action === Share.dismissedAction) {
        return { success: true, message: 'Share dialog was dismissed' };
      } else {
        return { success: true, message: 'Share dialog opened' };
      }
    } catch (error) {
      console.error('❌ Generic share error:', error);
      return { 
        success: false, 
        message: 'Failed to share certificate. Please try again.' 
      };
    }
  }

  // Generate certificate message for sharing
  generateCertificateMessage(certificate) {
    return `🏆 Certificate Verification

📜 Certificate: ${certificate.title}
👤 Student: ${certificate.student}
🎯 Achievement: ${certificate.type}
📅 Issued: ${certificate.issueDate}
🔢 ID: ${certificate.id}

This certificate has been issued by Combat Warrior Institute and can be verified using the link below.`;
  }

  // Generate certificate text content for file saving
  generateCertificateText(certificate) {
    const verificationUrl = `${this.baseUrl}/verify/${certificate.id}`;
    
    return `CERTIFICATE VERIFICATION DOCUMENT

Certificate Details:
- Certificate ID: ${certificate.id}
- Title: ${certificate.title}
- Student Name: ${certificate.student}
- Achievement Type: ${certificate.type}
- Issue Date: ${certificate.issueDate}
- Status: ${certificate.status}
- Verification Code: ${certificate.verificationCode || certificate.id}

Issued by: Combat Warrior Institute
Instructor: ${certificate.instructor || 'Academy Director'}

Verification:
This certificate can be verified online at:
${verificationUrl}

Generated on: ${new Date().toLocaleString()}

---
This is an official certificate document from Combat Warrior Institute.
For any queries, please contact the academy administration.
`;
  }

  // Capture screenshot of a component (fallback version)
  async captureScreenshot(viewShotRef) {
    try {
      console.log('📸 Screenshot capture not available - using fallback');
      
      // Return null for now - the sharing will work without images
      return null;
    } catch (error) {
      console.error('❌ Screenshot capture error:', error);
      return null;
    }
  }

  // Show sharing options alert
  showSharingOptions(certificate, onOptionSelect) {
    Alert.alert(
      'Share Certificate',
      'Choose how you want to share this certificate:',
      [
        {
          text: 'WhatsApp',
          onPress: () => onOptionSelect('WhatsApp')
        },
        {
          text: 'Email',
          onPress: () => onOptionSelect('Email')
        },
        {
          text: 'Save as PDF',
          onPress: () => onOptionSelect('PDF')
        },
        {
          text: 'Copy Link',
          onPress: () => onOptionSelect('Copy Link')
        },
        {
          text: 'More Options',
          onPress: () => onOptionSelect('Generic')
        },
        {
          text: 'Cancel',
          style: 'cancel'
        }
      ]
    );
  }
}

export default new SharingService();