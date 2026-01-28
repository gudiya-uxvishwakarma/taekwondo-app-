# 🏗️ Certificate System Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CERTIFICATE SYSTEM                          │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────────┐         ┌──────────────────────┐
│   ADMIN PANEL        │         │   STUDENT APP        │
│  (Web Browser)       │         │  (React Native)      │
│                      │         │                      │
│ • Upload Cert       │         │ • View Certificates  │
│ • Manage Certs      │         │ • Download Certs     │
│ • Search Certs      │         │ • Share Certs        │
│ • View Stats        │         │ • Filter by Type     │
└──────────┬───────────┘         └──────────┬───────────┘
           │                                │
           │ HTTP/REST                      │ HTTP/REST
           │                                │
           └────────────┬───────────────────┘
                        │
                        ▼
           ┌────────────────────────┐
           │   BACKEND API          │
           │  (Node.js/Express)     │
           │                        │
           │ • Authentication       │
           │ • File Upload          │
           │ • Data Validation      │
           │ • Business Logic       │
           └────────────┬───────────┘
                        │
           ┌────────────┴────────────┐
           │                         │
           ▼                         ▼
    ┌─────────────┐          ┌──────────────┐
    │  DATABASE   │          │  FILE SYSTEM │
    │  (MongoDB)  │          │  (Uploads)   │
    │             │          │              │
    │ • Certs     │          │ • Images     │
    │ • Users     │          │ • PDFs       │
    │ • Logs      │          │ • Files      │
    └─────────────┘          └──────────────┘
```

---

## Data Flow Diagram

### Certificate Upload Flow

```
ADMIN PANEL
    │
    │ 1. Fill Form
    │    - Student Name
    │    - Instructor Name
    │    - Achievement Type
    │    - Title
    │    - Verification Code
    │    - Image File
    │
    ▼
VALIDATION
    │
    │ 2. Validate
    │    - Required fields
    │    - File format
    │    - File size
    │    - Code format
    │
    ▼
BACKEND API
    │
    │ 3. Process
    │    - Check auth token
    │    - Validate permissions
    │    - Save file
    │    - Create record
    │
    ▼
DATABASE
    │
    │ 4. Store
    │    - Certificate record
    │    - File path
    │    - Metadata
    │
    ▼
FILE SYSTEM
    │
    │ 5. Store File
    │    - uploads/certificates/
    │    - certificate-{timestamp}.jpg
    │
    ▼
SUCCESS
    │
    │ 6. Response
    │    - Certificate ID
    │    - Verification Code
    │    - Status: Active
```

### Certificate Fetch Flow (App)

```
STUDENT APP
    │
    │ 1. On Launch / Refresh
    │    - Check auth token
    │    - Prepare request
    │
    ▼
API REQUEST
    │
    │ 2. GET /api/certificates
    │    - Send auth token
    │    - Request parameters
    │
    ▼
BACKEND API
    │
    │ 3. Process Request
    │    - Validate token
    │    - Check permissions
    │    - Query database
    │
    ▼
DATABASE
    │
    │ 4. Fetch Data
    │    - Find certificates
    │    - Filter by status
    │    - Sort by date
    │
    ▼
API RESPONSE
    │
    │ 5. Return Data
    │    - Certificate array
    │    - Image URLs
    │    - Metadata
    │
    ▼
APP PROCESSING
    │
    │ 6. Map Data
    │    - Backend → App format
    │    - Create Certificate objects
    │    - Cache locally
    │
    ▼
DISPLAY
    │
    │ 7. Show Certificates
    │    - CertificatesScreen
    │    - Filter by type
    │    - Show details
```

---

## Authentication Flow

```
LOGIN PAGE
    │
    │ 1. Enter Credentials
    │    - Email
    │    - Password
    │
    ▼
BACKEND AUTH
    │
    │ 2. Validate
    │    - Check email exists
    │    - Verify password
    │    - Check permissions
    │
    ▼
TOKEN GENERATION
    │
    │ 3. Create JWT Token
    │    - User ID
    │    - Role
    │    - Expiration
    │
    ▼
STORE TOKEN
    │
    │ 4. Save Locally
    │    - localStorage
    │    - Browser storage
    │
    ▼
AUTHENTICATED REQUESTS
    │
    │ 5. Use Token
    │    - Add to headers
    │    - Authorization: Bearer {token}
    │    - Send with requests
    │
    ▼
BACKEND VALIDATION
    │
    │ 6. Verify Token
    │    - Check signature
    │    - Check expiration
    │    - Check permissions
    │
    ▼
ALLOW/DENY
    │
    │ 7. Grant Access
    │    - If valid: Process request
    │    - If invalid: Return 401
```

---

## Component Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    ADMIN PANEL                          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────────┐      ┌──────────────────┐       │
│  │  Login Form      │      │  Certificate     │       │
│  │                  │      │  Upload Form     │       │
│  │ • Email Input    │      │                  │       │
│  │ • Password Input │      │ • Student Name   │       │
│  │ • Login Button   │      │ • Instructor     │       │
│  └──────────────────┘      │ • Type Select    │       │
│                            │ • File Upload    │       │
│  ┌──────────────────┐      │ • Submit Button  │       │
│  │  Certificates    │      └──────────────────┘       │
│  │  List            │                                  │
│  │                  │      ┌──────────────────┐       │
│  │ • Search Bar     │      │  Statistics      │       │
│  │ • Cert Items     │      │                  │       │
│  │ • Edit Button    │      │ • Total Count    │       │
│  │ • Delete Button  │      │ • Active Count   │       │
│  └──────────────────┘      │ • Revoked Count  │       │
│                            └──────────────────┘       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

```
┌─────────────────────────────────────────────────────────┐
│                    STUDENT APP                          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────────────────────────────────────┐     │
│  │         CertificatesScreen                   │     │
│  ├──────────────────────────────────────────────┤     │
│  │                                              │     │
│  │  ┌────────────────────────────────────────┐ │     │
│  │  │  Header                                │ │     │
│  │  │  • Title: Certificates                 │ │     │
│  │  │  • Back Button                         │ │     │
│  │  └────────────────────────────────────────┘ │     │
│  │                                              │     │
│  │  ┌────────────────────────────────────────┐ │     │
│  │  │  Filter Section                        │ │     │
│  │  │  • Type Dropdown                       │ │     │
│  │  │  • Count Badge                         │ │     │
│  │  └────────────────────────────────────────┘ │     │
│  │                                              │     │
│  │  ┌────────────────────────────────────────┐ │     │
│  │  │  Summary Cards                         │ │     │
│  │  │  • Total Certificates                  │ │     │
│  │  │  • Issued Count                        │ │     │
│  │  │  • Pending Count                       │ │     │
│  │  └────────────────────────────────────────┘ │     │
│  │                                              │     │
│  │  ┌────────────────────────────────────────┐ │     │
│  │  │  Certificates List                     │ │     │
│  │  │  ┌──────────────────────────────────┐  │ │     │
│  │  │  │ Certificate Card 1               │  │ │     │
│  │  │  │ • Title                          │  │ │     │
│  │  │  │ • Type                           │  │ │     │
│  │  │  │ • Date                           │  │ │     │
│  │  │  │ • View/Download Buttons          │  │ │     │
│  │  │  └──────────────────────────────────┘  │ │     │
│  │  │  ┌──────────────────────────────────┐  │ │     │
│  │  │  │ Certificate Card 2               │  │ │     │
│  │  │  │ ...                              │  │ │     │
│  │  │  └──────────────────────────────────┘  │ │     │
│  │  └────────────────────────────────────────┘ │     │
│  │                                              │     │
│  └──────────────────────────────────────────────┘     │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Database Schema

```
CERTIFICATES COLLECTION
├── _id (ObjectId)
├── verificationCode (String, Unique)
├── studentName (String)
├── studentId (ObjectId, Ref: Student)
├── achievementType (String)
├── achievementDetails
│   ├── title (String)
│   ├── description (String)
│   ├── level (String)
│   ├── grade (String)
│   └── examiner (String)
├── issuedDate (Date)
├── issuedBy (ObjectId, Ref: User)
├── status (String: active/revoked/expired)
├── filePath (String)
├── fileHash (String)
├── metadata
│   ├── templateVersion (String)
│   ├── generationMethod (String)
│   ├── fileSize (Number)
│   ├── downloadCount (Number)
│   └── instructorName (String)
├── createdAt (Date)
└── updatedAt (Date)

INDEXES
├── verificationCode (Unique)
├── studentId
├── studentName
├── achievementType
├── status
├── issuedDate
└── achievementDetails.examiner
```

---

## API Endpoints

```
PUBLIC ENDPOINTS
├── POST   /api/certificates/verify
│          └─ Verify certificate by code
└── GET    /api/certificates/:id/download
           └─ Download certificate file

PROTECTED ENDPOINTS (Staff)
├── GET    /api/certificates
│          └─ List all certificates
├── GET    /api/certificates/statistics
│          └─ Get certificate statistics
├── POST   /api/certificates
│          └─ Create new certificate
├── PUT    /api/certificates/:id
│          └─ Update certificate
└── POST   /api/certificates/send-email
           └─ Send certificate via email

PROTECTED ENDPOINTS (Admin)
└── DELETE /api/certificates/:id
           └─ Delete certificate
```

---

## File Structure

```
reactnative/
├── Taekwondo_backend/
│   ├── admin-panel.html          ← Admin UI
│   ├── login.html                ← Login UI
│   ├── controllers/
│   │   └── certificateController.js
│   ├── models/
│   │   └── Certificate.js
│   ├── routes/
│   │   └── certificates.js
│   ├── middleware/
│   │   └── auth.js
│   ├── uploads/
│   │   └── certificates/         ← Certificate files
│   └── server.js
│
├── src/
│   ├── screens/
│   │   └── CertificatesScreen.jsx
│   ├── services/
│   │   ├── CertificateService.js
│   │   ├── StudentService.js
│   │   └── apiService.js
│   ├── components/
│   │   └── certificates/
│   │       ├── CertificateCard.jsx
│   │       └── CertificateViewModal.jsx
│   ├── config/
│   │   └── api.js
│   └── models/
│       └── Certificate.js
│
├── CERTIFICATE_INTEGRATION_GUIDE.md
├── QUICK_START.md
├── CERTIFICATE_SETUP_SUMMARY.md
└── ARCHITECTURE_DIAGRAM.md
```

---

## Technology Stack

```
FRONTEND (Admin Panel)
├── HTML5
├── CSS3
├── JavaScript (Vanilla)
└── Fetch API

FRONTEND (Student App)
├── React Native
├── JavaScript (ES6+)
└── Axios (API calls)

BACKEND
├── Node.js
├── Express.js
├── MongoDB
├── Multer (File upload)
├── JWT (Authentication)
└── Express Validator

DEPLOYMENT
├── Local: localhost:5000
├── Production: Cloud hosting
└── Database: MongoDB Atlas
```

---

## Security Architecture

```
REQUEST FLOW
    │
    ▼
CORS CHECK
    │ ✓ Origin allowed
    ▼
BODY PARSING
    │ ✓ JSON/Form data
    ▼
AUTHENTICATION
    │ ✓ Token validation
    ▼
AUTHORIZATION
    │ ✓ Role check (Staff/Admin)
    ▼
VALIDATION
    │ ✓ Input validation
    ▼
BUSINESS LOGIC
    │ ✓ Process request
    ▼
DATABASE
    │ ✓ Store/Retrieve data
    ▼
RESPONSE
    │ ✓ Return result
```

---

## Deployment Architecture

```
DEVELOPMENT
├── Local Backend: localhost:5000
├── Local Database: MongoDB local
└── Local App: React Native Emulator

PRODUCTION
├── Backend Server: Cloud (AWS/Heroku/etc)
├── Database: MongoDB Atlas
├── File Storage: Cloud Storage (S3/etc)
└── App: App Store/Play Store
```

---

**Last Updated:** January 2026  
**Version:** 1.0
