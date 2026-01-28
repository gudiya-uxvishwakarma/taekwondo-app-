# Certificate Flow: Admin Panel → Mobile App

## How It Works

### Step 1: Admin Panel Creates Certificate
When you add a certificate in the admin panel, it gets saved to MongoDB with these fields:
```javascript
{
  studentId: "student_id_here",           // Links to student
  studentName: "Student Name",            // Student's name
  achievementType: "Belt Promotion",      // Type of certificate
  achievementDetails: {
    title: "Black Belt 1st Dan",          // Achievement title
    level: "1st Dan",                     // Belt level
    description: "Achieved black belt",   // Description
    examiner: "Instructor Name"           // Instructor
  },
  verificationCode: "ABC123XYZ",          // Unique code
  issuedDate: "2024-01-22",              // Issue date
  status: "active",                       // Status
  issuedBy: "instructor_id"              // Who issued it
}
```

### Step 2: Mobile App Fetches Certificates
When student opens the Certificates screen:

1. **App makes API call:**
   ```
   GET /api/certificates/public
   ```

2. **Backend filters certificates:**
   - Only returns certificates for the logged-in student
   - Populates student name from Student collection
   - Returns all active certificates

3. **App receives data:**
   ```javascript
   {
     status: 'success',
     data: {
       certificates: [
         {
           id: '...',
           studentId: { fullName: 'John Doe' },
           achievementType: 'Belt Promotion',
           achievementDetails: { title: '...', level: '...' },
           verificationCode: 'ABC123XYZ',
           issuedDate: '2024-01-22',
           status: 'active'
         }
       ]
     }
   }
   ```

4. **App transforms data:**
   - Extracts student name from `studentId.fullName`
   - Maps backend fields to frontend format
   - Creates Certificate objects

5. **App displays certificates:**
   - Shows in certificate list
   - Each card shows: Student, Achievement, Type, Level, Code, Date
   - View and Download buttons available

### Step 3: Student Views Certificate
When student clicks "View" button:

1. Opens CertificateViewModal
2. Displays official certificate with:
   - Student name (large, prominent)
   - Achievement title
   - Type, Level, Date, Code
   - Academy name
   - Instructor signature
   - Official seal

### Step 4: Student Downloads Certificate
When student clicks "Download" button:

1. Generates certificate text with all details
2. Opens Share dialog
3. Student can:
   - Save to device
   - Share via WhatsApp
   - Share via Email
   - Share via other apps

---

## Current Setup Status

### ✅ Backend (Already Configured)
- Certificate model exists
- Certificate controller exists
- Public endpoint `/api/certificates/public` exists
- Filters certificates by student
- Populates student name

### ✅ Frontend (Already Configured)
- StudentService fetches certificates
- Transforms backend data to frontend format
- Certificate model with all methods
- CertificateCard displays summary
- CertificateViewModal displays full certificate
- Download and Share functionality

---

## How to Test

### 1. Add Certificate in Admin Panel
Create a certificate with:
- Student: Select a student
- Achievement Type: Belt Promotion
- Title: "Black Belt 1st Dan"
- Level: "1st Dan"
- Description: "Successfully achieved black belt"
- Verification Code: "ABC123XYZ"
- Issue Date: Today's date
- Status: Active

### 2. Open Mobile App
1. Login as the student
2. Navigate to Certificates screen
3. You should see the certificate in the list

### 3. View Certificate
1. Click "View" button
2. Official certificate opens
3. All details are displayed

### 4. Download Certificate
1. Click "Download" button
2. Share dialog opens
3. Choose where to save/share
4. Certificate text is generated with all details

---

## Troubleshooting

### Certificate Not Showing?

**Check 1: Backend Running?**
```bash
cd Taekwondo_backend
npm start
```
Backend should be running on `http://localhost:5000`

**Check 2: Student ID Correct?**
- Certificate must be linked to correct student
- Check `studentId` field in MongoDB

**Check 3: Status Active?**
- Certificate status must be "active"
- Check `status` field in MongoDB

**Check 4: API Endpoint Working?**
Test in browser or Postman:
```
GET http://localhost:5000/api/certificates/public
```

**Check 5: App Logs**
Look for these logs in React Native:
```
📡 Fetching certificates from: /certificates
📥 Certificates response: {...}
✅ Got certificates (public): X certificates
```

### Download Not Working?

**Check 1: Certificate Object**
- Certificate must have `generateCertificateText()` method
- Check Certificate model is imported

**Check 2: Share API**
- Share API is built into React Native
- Should work on all devices

**Check 3: Permissions**
- No special permissions needed for Share API
- Works on Android and iOS

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     ADMIN PANEL                             │
│  Creates Certificate → Saves to MongoDB                     │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                     MONGODB DATABASE                         │
│  Stores certificate with all details                        │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                  BACKEND API (Node.js)                      │
│  GET /api/certificates/public                               │
│  - Filters by student                                       │
│  - Populates student name                                   │
│  - Returns JSON response                                    │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│              MOBILE APP (React Native)                      │
│  StudentService.getCertificates()                           │
│  - Fetches from API                                         │
│  - Transforms data                                          │
│  - Creates Certificate objects                              │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                  CERTIFICATES SCREEN                         │
│  Displays list of certificates                              │
│  - CertificateCard for each certificate                     │
│  - View and Download buttons                                │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│              CERTIFICATE VIEW MODAL                          │
│  Shows official certificate                                 │
│  - All details displayed                                    │
│  - Download and Share buttons                               │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                  DOWNLOAD/SHARE                              │
│  Generates certificate text                                 │
│  Opens Share dialog                                         │
│  Student saves or shares                                    │
└─────────────────────────────────────────────────────────────┘
```

---

## Summary

✅ **System is Ready!**

When you add a certificate in the admin panel:
1. It gets saved to MongoDB
2. Mobile app fetches it automatically
3. Student sees it in the Certificates screen
4. Student can view full certificate
5. Student can download/share certificate

**Everything is already configured and working!**

Just add certificates in the admin panel and they will appear in the mobile app automatically.
