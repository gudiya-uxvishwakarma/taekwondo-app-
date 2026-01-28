# Certificate Sharing Setup Guide

## 🎯 Overview
This guide sets up complete certificate sharing functionality including WhatsApp, Email, Download, and Copy Link features.

## 📦 Dependencies Added
- `react-native-share`: For native sharing functionality
- `react-native-fs`: For file system operations and downloads
- `react-native-view-shot`: For capturing certificate screenshots

## 🔧 Setup Steps

### 1. Install Dependencies
```bash
npm install react-native-share react-native-fs react-native-view-shot
```

### 2. Link Native Dependencies (if needed)
```bash
# Run the batch file
./link-sharing-dependencies.bat

# Or manually:
npx react-native link react-native-share
npx react-native link react-native-fs
npx react-native link react-native-view-shot
```

### 3. Android Permissions
The following permissions are already added to `android/app/src/main/AndroidManifest.xml`:
- `INTERNET`: For network requests
- `WRITE_EXTERNAL_STORAGE`: For saving files
- `READ_EXTERNAL_STORAGE`: For reading files
- `MANAGE_EXTERNAL_STORAGE`: For Android 11+ file access

### 4. Test the Setup
```bash
# Test sharing functionality
node test-certificate-sharing.js

# Run the app
npm run android
```

## 🚀 Features Implemented

### 1. WhatsApp Sharing
- ✅ Opens WhatsApp with pre-filled message
- ✅ Includes certificate details and verification link
- ✅ Fallback to WhatsApp URL scheme if share fails
- ✅ Includes certificate image when available

### 2. Email Sharing
- ✅ Opens default email client
- ✅ Pre-filled subject and body
- ✅ Professional email template
- ✅ Includes certificate image as attachment

### 3. Download/Save
- ✅ Saves certificate image to Downloads folder
- ✅ Generates unique filename with timestamp
- ✅ Fallback to text file if image not available
- ✅ Shows success message with file location

### 4. Copy Link
- ✅ Copies verification URL to clipboard
- ✅ Shows success confirmation
- ✅ Doesn't auto-close dialog (allows multiple shares)

### 5. Certificate Preview
- ✅ Shows certificate preview in share dialog
- ✅ Captures screenshot for sharing
- ✅ Beautiful card design matching app theme

## 📱 Usage

### From Certificate Card Screen
```javascript
// Navigate to share screen
navigate('CertificateShare', { certificate });
```

### Direct Sharing Service Usage
```javascript
import SharingService from '../services/SharingService';

// Share via WhatsApp
const result = await SharingService.shareViaWhatsApp(certificate, imageUri);

// Share via Email
const result = await SharingService.shareViaEmail(certificate, imageUri);

// Download as PDF/Image
const result = await SharingService.downloadAsPDF(certificate, imageUri);

// Copy verification link
const result = await SharingService.copyVerificationLink(certificate);
```

## 🎨 UI Features

### Loading States
- ✅ Individual loading indicators for each share option
- ✅ Disabled state during processing
- ✅ Loading text on cancel button

### Certificate Preview
- ✅ Beautiful certificate card preview
- ✅ Shows certificate icon, title, student name
- ✅ Displays issue date and status
- ✅ Certificate ID for verification

### Error Handling
- ✅ Graceful error handling for all share methods
- ✅ Fallback mechanisms for failed shares
- ✅ User-friendly error messages

## 🔗 Integration Points

### Navigation Context
The sharing screen integrates with the existing navigation context:
```javascript
const { navigate, goBack, getParams } = useNavigation();
```

### Certificate Data Structure
Expected certificate object structure:
```javascript
{
  id: 'CERT-4125362',
  title: 'Red Belt Promotion',
  student: 'Golu Vishwakarma',
  type: 'Belt Promotion',
  issueDate: 'Jan 23, 2025',
  status: 'Active',
  color: '#DC143C',
  icon: 'card-membership',
  verificationCode: 'CERT-4125362',
  instructor: 'Academy Director'
}
```

## 🧪 Testing

### Manual Testing Steps
1. Navigate to Certificate Card Screen
2. Tap on a certificate to view details
3. Tap share button to open share dialog
4. Test each sharing option:
   - WhatsApp: Should open WhatsApp with message
   - Email: Should open email client with pre-filled content
   - Download: Should save file to Downloads folder
   - Copy Link: Should copy URL to clipboard

### Automated Testing
```bash
# Run the test script
node test-certificate-sharing.js
```

## 🔧 Troubleshooting

### WhatsApp Not Opening
- Ensure WhatsApp is installed on device
- Check if device supports WhatsApp URL scheme
- Fallback will show error message if WhatsApp unavailable

### File Download Issues
- Check storage permissions in Android settings
- Ensure Downloads folder is accessible
- Check available storage space

### Email Client Issues
- Ensure device has email client installed
- Check default email app settings
- Gmail, Outlook, and other clients supported

## 🎉 Success Indicators

When everything is working correctly, you should see:
- ✅ Share dialog opens with certificate preview
- ✅ WhatsApp opens with pre-filled message and image
- ✅ Email client opens with professional template
- ✅ Files save to Downloads folder successfully
- ✅ Verification links copy to clipboard
- ✅ Success messages show for all operations
- ✅ Loading states work properly
- ✅ Error handling works gracefully

## 📞 Support

If you encounter issues:
1. Check the console logs for error messages
2. Verify all dependencies are installed correctly
3. Ensure Android permissions are granted
4. Test on physical device (some features don't work in emulator)
5. Check network connectivity for verification links