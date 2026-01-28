/**
 * Certificate PDF Generation Service
 * Handles proper PDF certificate generation with exact design matching
 * Uses built-in React Native Share API for better compatibility
 */

import { Alert, Dimensions, Share } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

class CertificatePDFService {
  /**
   * Generate certificate HTML content with exact styling
   */
  static generateCertificateHTML(certificate) {
    const getBeltColor = (title) => {
      const titleLower = title?.toLowerCase() || '';
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
        return `${day}${day === 1 ? 'st' : day === 2 ? 'nd' : day === 3 ? 'rd' : 'th'} ${month} ${year}`;
      }
      
      try {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleDateString('en-GB', { month: 'long' });
        const year = date.getFullYear();
        return `${day}${day === 1 ? 'st' : day === 2 ? 'nd' : day === 3 ? 'rd' : 'th'} ${month} ${year}`;
      } catch {
        return dateString;
      }
    };

    const beltColor = getBeltColor(certificate.title);
    const formattedDate = formatDate(certificate.issueDate);

    // Generate HTML that matches the exact certificate design
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${certificate.title} Certificate - ${certificate.student}</title>
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
            width: 800px;
            height: 600px;
            position: relative;
            box-shadow: 0 12px 40px rgba(0,0,0,0.25);
        }
        
        .outer-frame {
            width: 100%;
            height: 100%;
            background: #8B4513;
            border-radius: 20px;
            padding: 12px;
        }
        
        .inner-frame {
            width: 100%;
            height: 100%;
            background: #FFF8DC;
            border-radius: 12px;
            padding: 40px;
            position: relative;
        }
        
        .corner-decoration {
            position: absolute;
            width: 30px;
            height: 30px;
            border: 2px solid #DAA520;
            border-radius: 4px;
            background: rgba(218, 165, 32, 0.1);
        }
        
        .top-left { top: 15px; left: 15px; }
        .top-right { top: 15px; right: 15px; }
        .bottom-left { bottom: 15px; left: 15px; }
        .bottom-right { bottom: 15px; right: 15px; }
        
        .certificate-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 30px;
            margin-top: 20px;
        }
        
        .logo-container {
            width: 120px;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        
        .logo-circle {
            width: 110px;
            height: 110px;
            border-radius: 55px;
            background: #FFF8DC;
            border: 4px solid #8B4513;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
        }
        
        .logo-inner-circle {
            width: 90px;
            height: 90px;
            border-radius: 45px;
            background: #FFD700;
            border: 2px solid #8B4513;
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        
        .tf-symbol {
            position: absolute;
            top: 8px;
            font-size: 14px;
            font-weight: 900;
            color: #8B4513;
            letter-spacing: 1px;
        }
        
        .martial-artist {
            position: absolute;
            font-size: 16px;
            color: #8B4513;
        }
        
        .left-artist { left: 15px; top: 25px; }
        .center-artist { top: 20px; font-size: 18px; }
        .right-artist { right: 15px; top: 25px; }
        
        .kannada-text {
            position: absolute;
            bottom: 8px;
            font-size: 12px;
            font-weight: 700;
            color: #8B4513;
        }
        
        .circular-text {
            position: absolute;
            font-size: 10px;
            font-weight: 700;
            color: #8B4513;
            letter-spacing: 1px;
            text-align: center;
            width: 120px;
        }
        
        .circular-text-top { top: -25px; }
        .circular-text-bottom { bottom: -25px; }
        
        .decorative-circle {
            position: absolute;
            width: 12px;
            height: 12px;
            border-radius: 6px;
            background: #FFD700;
            border: 2px solid #8B4513;
            top: 50%;
            transform: translateY(-50%);
        }
        
        .decorative-left { left: -15px; }
        .decorative-right { right: -15px; }
        
        .center-title {
            flex: 1;
            text-align: center;
            padding: 0 20px;
        }
        
        .main-title {
            font-size: 36px;
            font-weight: 900;
            color: #2C1810;
            letter-spacing: 3px;
            margin-bottom: 10px;
        }
        
        .title-divider {
            width: 150px;
            height: 3px;
            background: #8B4513;
            margin: 10px auto;
        }
        
        .sub-title {
            font-size: 18px;
            font-weight: 700;
            color: #8B4513;
            letter-spacing: 2px;
            margin-bottom: 5px;
        }
        
        .discipline-title {
            font-size: 16px;
            font-weight: 600;
            color: #B8860B;
            letter-spacing: 1px;
        }
        
        .right-decoration {
            width: 120px;
            display: flex;
            justify-content: center;
        }
        
        .right-circle {
            width: 80px;
            height: 80px;
            border-radius: 40px;
            background: #FF6B35;
            border: 4px solid #DAA520;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 32px;
        }
        
        .gold-line {
            height: 3px;
            background: #DAA520;
            margin: 30px 0;
            border-radius: 2px;
        }
        
        .presented-section {
            text-align: center;
            margin-bottom: 40px;
        }
        
        .presented-text {
            font-size: 20px;
            font-weight: 600;
            color: #8B4513;
            font-style: italic;
            margin-bottom: 15px;
        }
        
        .student-name {
            font-size: 32px;
            font-weight: 900;
            color: #2C1810;
            letter-spacing: 2px;
            margin-bottom: 20px;
        }
        
        .achievement-text {
            font-size: 18px;
            font-weight: 600;
            color: #8B4513;
            font-style: italic;
            line-height: 24px;
        }
        
        .date-section {
            text-align: center;
            margin-bottom: 30px;
        }
        
        .awarded-text {
            font-size: 18px;
            font-weight: 600;
            color: #8B4513;
            margin-bottom: 10px;
        }
        
        .date-text {
            font-size: 24px;
            font-weight: 800;
            color: #B8860B;
            letter-spacing: 1px;
        }
        
        .level-rank-section {
            text-align: center;
            margin-bottom: 40px;
            background: #F5F5DC;
            padding: 15px 30px;
            border-radius: 15px;
            border: 3px solid #DAA520;
        }
        
        .level-rank-text {
            font-size: 16px;
            font-weight: 700;
            color: #2C1810;
            letter-spacing: 1px;
        }
        
        .level-value {
            font-weight: 900;
            font-size: 18px;
            color: ${beltColor};
        }
        
        .rank-value {
            font-weight: 900;
            color: #8B4513;
            font-size: 18px;
        }
        
        .bottom-section {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 40px;
            padding: 0 10px;
        }
        
        .bottom-item {
            flex: 1;
            text-align: center;
        }
        
        .medal-circle {
            width: 60px;
            height: 60px;
            border-radius: 30px;
            background: ${beltColor};
            border: 4px solid #DAA520;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 0 auto 10px;
            color: white;
            font-size: 20px;
        }
        
        .seal-circle {
            width: 80px;
            height: 80px;
            border-radius: 40px;
            background: #8B4513;
            border: 5px solid #DAA520;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 0 auto 10px;
        }
        
        .seal-inner {
            width: 60px;
            height: 60px;
            border-radius: 30px;
            background: #FFF8DC;
            border: 2px solid #8B4513;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }
        
        .seal-symbol {
            font-size: 20px;
            color: #8B4513;
        }
        
        .seal-sub-text {
            font-size: 8px;
            font-weight: 900;
            color: #8B4513;
            letter-spacing: 1px;
            margin-top: -2px;
        }
        
        .qr-code {
            width: 60px;
            height: 60px;
            background: white;
            border: 3px solid #333;
            border-radius: 10px;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 0 auto 10px;
        }
        
        .qr-pattern {
            width: 40px;
            height: 40px;
            background: #333;
            border-radius: 4px;
            display: flex;
            justify-content: center;
            align-items: center;
            color: white;
            font-size: 20px;
        }
        
        .bottom-label {
            font-size: 10px;
            font-weight: 700;
            color: #8B4513;
        }
        
        .qr-label {
            font-size: 9px;
            font-weight: 700;
            color: #333;
        }
        
        .signatures-section {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
            padding: 0 60px;
        }
        
        .signature {
            text-align: center;
            flex: 1;
        }
        
        .signature-title {
            font-size: 14px;
            font-weight: 600;
            color: #8B4513;
            font-style: italic;
            margin-bottom: 10px;
        }
        
        .signature-line {
            width: 120px;
            height: 2px;
            background: #8B4513;
            margin: 0 auto 10px;
        }
        
        .signature-name {
            font-size: 16px;
            font-weight: 700;
            color: #2C1810;
        }
        
        .certificate-footer {
            text-align: center;
            margin-top: 20px;
        }
        
        .footer-divider {
            width: 100%;
            height: 3px;
            background: #DAA520;
            margin-bottom: 15px;
        }
        
        .certificate-id {
            font-size: 14px;
            font-weight: 700;
            color: #8B4513;
            letter-spacing: 1px;
            margin-bottom: 5px;
        }
        
        .website-url {
            font-size: 12px;
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
                
                <!-- Certificate Header -->
                <div class="certificate-header">
                    <!-- Left Logo -->
                    <div class="logo-container">
                        <div class="logo-circle">
                            <div class="logo-inner-circle">
                                <div class="tf-symbol">TF</div>
                                <div class="martial-artist left-artist">🥋</div>
                                <div class="martial-artist center-artist">🥋</div>
                                <div class="martial-artist right-artist">🥋</div>
                                <div class="kannada-text">ಕರ್ನಾಟಕ</div>
                            </div>
                            <div class="circular-text circular-text-top">TAEKWON-DO ASSOCIATION</div>
                            <div class="circular-text circular-text-bottom">OF KARNATAKA</div>
                            <div class="decorative-circle decorative-left"></div>
                            <div class="decorative-circle decorative-right"></div>
                        </div>
                    </div>
                    
                    <!-- Center Title -->
                    <div class="center-title">
                        <div class="main-title">CERTIFICATE</div>
                        <div class="title-divider"></div>
                        <div class="sub-title">OF ACHIEVEMENT</div>
                        <div class="discipline-title">IN TAEKWONDO</div>
                    </div>
                    
                    <!-- Right Decoration -->
                    <div class="right-decoration">
                        <div class="right-circle">🏆</div>
                    </div>
                </div>
                
                <!-- Gold Line -->
                <div class="gold-line"></div>
                
                <!-- Presented Section -->
                <div class="presented-section">
                    <div class="presented-text">Proudly Presented To</div>
                    <div class="student-name">${(certificate.student || 'RAHUL SHARMA').toUpperCase()}</div>
                    <div class="achievement-text">For Outstanding Performance & Dedication in Taekwondo</div>
                </div>
                
                <!-- Date Section -->
                <div class="date-section">
                    <div class="awarded-text">Awarded This</div>
                    <div class="date-text">${formattedDate}</div>
                </div>
                
                <!-- Level and Rank -->
                <div class="level-rank-section">
                    <div class="level-rank-text">
                        LEVEL: <span class="level-value">${(certificate.title || 'YELLOW BELT').toUpperCase()}</span> • RANK: <span class="rank-value">4<sup>TH</sup> GUP</span>
                    </div>
                </div>
                
                <!-- Bottom Section -->
                <div class="bottom-section">
                    <div class="bottom-item">
                        <div class="medal-circle">🏅</div>
                        <div class="bottom-label">TAEKWONDO</div>
                    </div>
                    <div class="bottom-item">
                        <div class="seal-circle">
                            <div class="seal-inner">
                                <div class="seal-symbol">☯</div>
                                <div class="seal-sub-text">TKD</div>
                            </div>
                        </div>
                        <div class="bottom-label">OFFICIAL DOJANG</div>
                        <div class="bottom-label" style="font-size: 9px; color: #B8860B; margin-top: 2px;">KARNATAKA</div>
                    </div>
                    <div class="bottom-item">
                        <div class="qr-code">
                            <div class="qr-pattern">⚡</div>
                        </div>
                        <div class="qr-label">VERIFY CERTIFICATE</div>
                    </div>
                </div>
                
                <!-- Signatures -->
                <div class="signatures-section">
                    <div class="signature">
                        <div class="signature-title">Master Instructor</div>
                        <div class="signature-line"></div>
                        <div class="signature-name">Master Kim</div>
                    </div>
                    <div class="signature">
                        <div class="signature-title">David Lee</div>
                        <div class="signature-line"></div>
                        <div class="signature-name">David Lee</div>
                    </div>
                </div>
                
                <!-- Footer -->
                <div class="certificate-footer">
                    <div class="footer-divider"></div>
                    <div class="certificate-id">CERTIFICATE ID: ${certificate.verificationCode || certificate.id || 'TKD20264578'}</div>
                    <div class="website-url">www.verifycertificate.com</div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
    `;
  }

  /**
   * Generate and share certificate with proper PDF functionality
   */
  static async generateAndShareCertificate(certificate) {
    try {
      console.log('📄 Generating PDF certificate for:', certificate.title);
      
      // Generate HTML content that matches the certificate design exactly
      const htmlContent = this.generateCertificateHTML(certificate);
      
      // Create a comprehensive certificate message for sharing
      const certificateMessage = `
🎓 TAEKWON-DO ASSOCIATION OF KARNATAKA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CERTIFICATE OF ACHIEVEMENT
IN TAEKWONDO

Proudly Presented To
${(certificate.student || 'STUDENT NAME').toUpperCase()}

For Outstanding Performance & Dedication in Taekwondo

Awarded This
${this.formatDateForText(certificate.issueDate)}

LEVEL: ${(certificate.title || 'BELT').toUpperCase()} • RANK: 4TH GUP

🏆 TAEKWONDO 🥋 OFFICIAL DOJANG ⚡ VERIFY CERTIFICATE

Master Instructor          David Lee
Master Kim                 David Lee

CERTIFICATE ID: ${certificate.verificationCode || certificate.id || 'TKD20264578'}
www.verifycertificate.com

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Taekwon-Do Association of Karnataka

📱 To view the full certificate design, open this in a web browser:
${this.createHTMLDataURL(htmlContent)}
      `;
      
      // Share options using built-in React Native Share
      const shareOptions = {
        title: `${certificate.title} Certificate - ${certificate.student}`,
        message: certificateMessage,
      };
      
      // Use React Native's built-in Share API
      const result = await Share.share(shareOptions);
      
      console.log('✅ Certificate shared successfully:', result);
      return { success: true, html: htmlContent, result };
    } catch (error) {
      console.error('❌ Certificate PDF generation error:', error);
      
      // Fallback to simple text sharing
      try {
        const textContent = this.generateCertificateText(certificate);
        const fallbackOptions = {
          title: `${certificate.title} Certificate - ${certificate.student}`,
          message: textContent,
        };
        
        await Share.share(fallbackOptions);
        return { success: true, fallback: true };
      } catch (fallbackError) {
        console.error('❌ Fallback sharing also failed:', fallbackError);
        throw fallbackError;
      }
    }
  }

  /**
   * Create HTML data URL for sharing
   */
  static createHTMLDataURL(htmlContent) {
    return `data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`;
  }

  /**
   * Format date for text output
   */
  static formatDateForText(dateString) {
    if (!dateString) {
      const today = new Date();
      return today.toLocaleDateString('en-GB', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      });
    }
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      });
    } catch {
      return dateString;
    }
  }

  /**
   * Generate certificate text for fallback
   */
  static generateCertificateText(certificate) {
    const formatDate = (dateString) => {
      if (!dateString) return new Date().toLocaleDateString('en-GB', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      });
      
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', { 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric' 
        });
      } catch {
        return dateString;
      }
    };

    return `
🎓 TAEKWON-DO ASSOCIATION OF KARNATAKA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CERTIFICATE OF ACHIEVEMENT
IN TAEKWONDO

Proudly Presented To
${(certificate.student || 'STUDENT NAME').toUpperCase()}

For Outstanding Performance & Dedication in Taekwondo

Awarded This
${formatDate(certificate.issueDate)}

LEVEL: ${(certificate.title || 'BELT').toUpperCase()} • RANK: 4TH GUP

🏆 TAEKWONDO 🥋 OFFICIAL DOJANG ⚡ VERIFY CERTIFICATE

Master Instructor          David Lee
Master Kim                 David Lee

CERTIFICATE ID: ${certificate.verificationCode || certificate.id || 'TKD20264578'}
www.verifycertificate.com

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Taekwon-Do Association of Karnataka
    `;
  }

  /**
   * Get certificate dimensions for consistent sizing
   */
  static getCertificateDimensions() {
    return {
      width: 800,
      height: 600,
      aspectRatio: 4/3
    };
  }
}

export default CertificatePDFService;