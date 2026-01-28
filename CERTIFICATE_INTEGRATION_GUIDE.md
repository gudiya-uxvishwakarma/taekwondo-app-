# Certificate Admin Panel Integration Guide

## 🎯 Overview

This guide explains how to use the new Certificate Admin Panel to upload certificates and have them automatically appear in the student app.

## 📋 Table of Contents

1. [Setup Instructions](#setup-instructions)
2. [Admin Panel Usage](#admin-panel-usage)
3. [How It Works](#how-it-works)
4. [Troubleshooting](#troubleshooting)

---

## 🚀 Setup Instructions

### Step 1: Start the Backend Server

```bash
cd reactnative/Taekwondo_backend
npm install
npm start
```

The server will run on `http://localhost:5000`

### Step 2: Access the Admin Panel

Open your browser and go to:
```
http://localhost:5000/admin-panel.html
```

### Step 3: Login

You need to be logged in as an admin or staff member to access the panel.

**Default Admin Credentials:**
- Email: `admin@taekwondo.com`
- Password: `admin123`

---

## 📤 Admin Panel Usage

### Uploading a Certificate

1. **Fill in Student Information**
   - Student Name: Name of the student receiving the certificate
   - Instructor Name: Name of the instructor issuing the certificate

2. **Select Achievement Type**
   - Belt Promotion
   - Tournament
   - Course Completion
   - Achievement

3. **Enter Achievement Details**
   - Achievement Title: e.g., "Yellow Belt Promotion"
   - Achievement Description: Optional details about the achievement
   - Level: e.g., "Yellow Belt", "Beginner"
   - Grade: e.g., "A", "B", "C"

4. **Generate Verification Code**
   - Must be uppercase letters and numbers only
   - Example: `CERT2024001`, `YELLOW_BELT_001`
   - This code uniquely identifies the certificate

5. **Upload Certificate Image/PDF**
   - Click the upload area or drag and drop
   - Supported formats: JPG, PNG, GIF, PDF
   - Maximum file size: 5MB

6. **Click "Upload Certificate"**
   - The certificate will be saved to the backend
   - You'll see a success message

### Viewing Certificates

The right panel shows all uploaded certificates with:
- Student name
- Achievement type
- Certificate code
- Current status (Active/Revoked)
- Edit and Delete buttons

### Searching Certificates

Use the "Search" tab to find certificates by student name.

---

## 🔄 How It Works

### Data Flow

```
Admin Panel (Upload)
        ↓
Backend API (/api/certificates)
        ↓
MongoDB Database
        ↓
Student App (Fetch on Login/Refresh)
        ↓
CertificatesScreen (Display)
```

### Step-by-Step Process

1. **Admin uploads certificate** via the admin panel
2. **Backend validates** the certificate data
3. **File is stored** in `uploads/certificates/` folder
4. **Certificate record** is saved to MongoDB
5. **Student app fetches** certificates when:
   - App launches
   - User navigates to Certificates screen
   - User pulls to refresh
6. **Certificates display** automatically in the app

### Authentication Flow

```
Admin Login
    ↓
Get Auth Token
    ↓
Store Token in localStorage
    ↓
Send Token with API Requests
    ↓
Backend Validates Token
    ↓
Allow Certificate Operations
```

---

## 🔧 API Endpoints

### Get All Certificates
```
GET /api/certificates
Headers: Authorization: Bearer {token}
```

### Create Certificate
```
POST /api/certificates
Headers: 
  - Authorization: Bearer {token}
  - Content-Type: multipart/form-data

Body:
{
  "studentName": "Adarsh Kumar",
  "instructorName": "Master Kim",
  "achievementType": "Belt Promotion",
  "achievementTitle": "Yellow Belt Promotion",
  "achievementDescription": "Successfully completed yellow belt requirements",
  "level": "Yellow Belt",
  "grade": "A",
  "customVerificationCode": "CERT2024001",
  "certificateImage": <file>
}
```

### Download Certificate
```
GET /api/certificates/{id}/download
```

### Delete Certificate
```
DELETE /api/certificates/{id}
Headers: Authorization: Bearer {token}
```

---

## 📱 Student App Integration

### How Students See Certificates

1. **On App Launch**
   - App automatically fetches certificates from backend
   - Certificates are mapped to app format
   - Displayed in CertificatesScreen

2. **On Certificates Screen**
   - Pull to refresh to get latest certificates
   - Filter by certificate type
   - View certificate details
   - Download or share certificates

3. **Data Mapping**
   - Backend achievement type → App certificate type
   - Backend student name → App student name
   - Backend verification code → Certificate ID
   - Backend file path → Certificate image URL

---

## 🐛 Troubleshooting

### Issue: Admin Panel Not Loading

**Solution:**
1. Check if backend server is running on port 5000
2. Verify MongoDB connection
3. Check browser console for errors
4. Clear browser cache and reload

### Issue: Certificate Upload Fails

**Possible Causes:**
- Invalid verification code (must be uppercase letters/numbers only)
- File size exceeds 5MB
- Missing required fields
- Authentication token expired

**Solution:**
1. Check all required fields are filled
2. Verify verification code format
3. Reduce file size if needed
4. Re-login to refresh token

### Issue: Certificates Not Appearing in App

**Possible Causes:**
- App not fetching from backend
- Authentication token missing
- Backend API not responding
- Certificate status is "revoked"

**Solution:**
1. Check app logs for API errors
2. Verify backend is running
3. Check certificate status in admin panel
4. Force app refresh (pull to refresh)
5. Restart the app

### Issue: Authentication Error

**Solution:**
1. Clear app cache and data
2. Re-login with correct credentials
3. Check if admin/staff account has proper permissions
4. Verify token is being sent with requests

---

## 📊 Certificate Status

- **Active**: Certificate is valid and visible to students
- **Revoked**: Certificate has been revoked and hidden from students
- **Expired**: Certificate has expired (not currently used)

---

## 🔐 Security Features

1. **Authentication Required**: Only logged-in admins/staff can upload
2. **File Validation**: Only image and PDF files allowed
3. **File Size Limit**: Maximum 5MB per file
4. **Verification Code**: Unique code for each certificate
5. **Audit Logging**: All operations are logged

---

## 📝 Example Certificate Data

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "verificationCode": "CERT2024001",
  "studentName": "Adarsh Kumar",
  "achievementType": "Belt Promotion",
  "achievementDetails": {
    "title": "Yellow Belt Promotion",
    "description": "Successfully completed all requirements",
    "level": "Yellow Belt",
    "grade": "A",
    "examiner": "Master Kim"
  },
  "issuedDate": "2024-01-15T10:30:00Z",
  "status": "active",
  "filePath": "uploads/certificates/certificate-1234567890.jpg",
  "imageUrl": "/uploads/certificates/certificate-1234567890.jpg"
}
```

---

## 🎓 Best Practices

1. **Use Clear Verification Codes**
   - Format: `CERT2024001`, `YELLOW_BELT_001`
   - Make them easy to remember and verify

2. **Upload High-Quality Images**
   - Use clear, legible certificate images
   - Ensure student name is visible
   - Use PDF for official documents

3. **Keep Records Updated**
   - Update certificate status if needed
   - Delete duplicate or incorrect entries
   - Maintain consistent naming conventions

4. **Regular Backups**
   - Backup certificate files regularly
   - Keep database backups
   - Document all certificate operations

---

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review backend logs: `npm start` output
3. Check app logs in React Native debugger
4. Verify API endpoints are accessible

---

## 🔄 Updates and Maintenance

### Updating a Certificate

1. Go to admin panel
2. Find the certificate in the list
3. Click "Edit" button
4. Modify the details
5. Save changes

### Deleting a Certificate

1. Find the certificate in the list
2. Click "Delete" button
3. Confirm deletion
4. Certificate will be removed from app

---

## 📈 Performance Tips

1. **Limit Certificate Fetching**
   - App fetches max 100 certificates per request
   - Use pagination for large datasets

2. **Cache Certificates**
   - App caches certificates locally
   - Reduces API calls on subsequent loads

3. **Optimize Images**
   - Compress certificate images before upload
   - Use appropriate file formats

---

## ✅ Verification Checklist

Before going live:

- [ ] Backend server is running
- [ ] MongoDB is connected
- [ ] Admin account is created
- [ ] Admin panel is accessible
- [ ] Certificate upload works
- [ ] App fetches certificates
- [ ] Certificates display correctly
- [ ] Download functionality works
- [ ] Search functionality works
- [ ] Delete functionality works

---

**Last Updated:** January 2026
**Version:** 1.0
