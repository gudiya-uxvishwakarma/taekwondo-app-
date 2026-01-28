# Certificate System - Complete Specification

## Certificate List Screen

### Display Fields
Each certificate card shows:
- ✅ **Certificate Name** (Achievement Title)
- ✅ **Achievement Type** (Belt Promotion, Tournament, etc.)
- ✅ **Level** (Belt level)
- ✅ **Date** (Issue date)
- ✅ **Status** (Active / Expired)

### Filters
- **By Year** - Filter certificates by year
- **By Level** - Filter by belt level
- **By Achievement Type** - Filter by type

### Features
- Auto-sync from backend
- Pull to refresh
- Loading states
- Error handling

---

## Certificate Detail Screen

### Display Elements
1. **Full Certificate Design**
   - Professional certificate layout
   - Academy header with logo
   - Student name (prominent)
   - Achievement details
   - Certificate borders

2. **Interactive Features**
   - Zoom in / Zoom out (pinch to zoom)
   - Scroll to view full certificate
   - QR code visible
   - Certificate code displayed
   - "Issued by institute" text

3. **Certificate Information**
   - Student Name
   - Achievement Title
   - Type
   - Level
   - Issue Date
   - Certificate Code
   - Verification QR Code
   - Academy Name
   - Instructor Signature
   - Official Seal

---

## Actions (Buttons)

### 1. View Certificate
- Opens full certificate in modal
- Shows all details
- Interactive viewing

### 2. Download
- Downloads certificate as PDF/Image
- Saves to device storage
- Shows success message

### 3. Share
- **WhatsApp** - Share via WhatsApp
- **Email** - Share via Email
- **Other Apps** - Share via other apps

### 4. Verify Certificate
- QR code scan
- Verification link
- Shows certificate authenticity

---

## Student Side Features

### 1. Auto-Sync from Backend
- Automatically fetches new certificates
- Updates when new certificates are added
- Real-time synchronization

### 2. Offline View
- Once downloaded, view offline
- Cached certificates
- No internet required for viewing

### 3. Certificate Filters
- **By Year** - 2024, 2023, 2022, etc.
- **By Level** - White Belt, Yellow Belt, etc.
- **By Achievement Type** - Belt Promotion, Tournament, etc.

### 4. Status Indicators
- **Active** - Green badge
- **Expired** - Red badge
- **Pending** - Yellow badge

---

## Implementation Details

### Certificate Card Component
```jsx
<CertificateCard>
  <CertificateName>Black Belt 1st Dan</CertificateName>
  <AchievementType>Belt Promotion</AchievementType>
  <Level>1st Dan</Level>
  <Date>January 22, 2024</Date>
  <Status>Active</Status>
  <Actions>
    <ViewButton />
    <DownloadButton />
  </Actions>
</CertificateCard>
```

### Certificate Detail Modal
```jsx
<CertificateDetailModal>
  <Header>
    <AcademyLogo />
    <AcademyName />
  </Header>
  
  <Body>
    <StudentName />
    <Achievement />
    <Type />
    <Level />
    <IssueDate />
    <CertificateCode />
    <QRCode />
    <InstructorSignature />
    <OfficialSeal />
  </Body>
  
  <Actions>
    <ZoomControls />
    <DownloadButton />
    <ShareButton>
      <WhatsAppShare />
      <EmailShare />
      <OtherShare />
    </ShareButton>
    <VerifyButton />
  </Actions>
</CertificateDetailModal>
```

### Filter Component
```jsx
<FilterBar>
  <YearFilter>
    <Option>2024</Option>
    <Option>2023</Option>
    <Option>2022</Option>
  </YearFilter>
  
  <LevelFilter>
    <Option>All Levels</Option>
    <Option>White Belt</Option>
    <Option>Yellow Belt</Option>
    <Option>Black Belt</Option>
  </LevelFilter>
  
  <TypeFilter>
    <Option>All Types</Option>
    <Option>Belt Promotion</Option>
    <Option>Tournament</Option>
    <Option>Course Completion</Option>
  </TypeFilter>
</FilterBar>
```

---

## Data Structure

### Certificate Object
```javascript
{
  id: "cert_123",
  name: "Black Belt 1st Dan",
  student: "John Doe",
  achievementType: "Belt Promotion",
  level: "1st Dan",
  issueDate: "2024-01-22",
  status: "Active",
  verificationCode: "ABC123XYZ",
  qrCode: "data:image/png;base64,...",
  instructor: "Ravi Kumar",
  academy: "Combat Warrior Taekwondo Academy",
  year: 2024,
  isExpired: false,
  isDownloaded: false,
  downloadPath: null
}
```

---

## API Endpoints

### Get Certificates
```
GET /api/certificates/public
Query Params:
  - year: 2024
  - level: "1st Dan"
  - type: "Belt Promotion"
  - status: "active"
```

### Download Certificate
```
GET /api/certificates/:id/download
Returns: PDF/Image file
```

### Verify Certificate
```
POST /api/certificates/verify
Body: { verificationCode: "ABC123XYZ" }
Returns: { valid: true, certificate: {...} }
```

---

## UI/UX Flow

### 1. Certificate List Screen
```
┌─────────────────────────────────────┐
│ ← Certificates              🔍      │
├─────────────────────────────────────┤
│ Student Name: John Doe              │
├─────────────────────────────────────┤
│ Filters: [Year ▼] [Level ▼] [Type ▼]│
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ 🏆 Black Belt 1st Dan           │ │
│ │ Type: Belt Promotion            │ │
│ │ Level: 1st Dan                  │ │
│ │ Date: Jan 22, 2024              │ │
│ │ Status: ✓ Active                │ │
│ │ [View] [Download]               │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ 🥇 Tournament Winner            │ │
│ │ Type: Tournament                │ │
│ │ Level: 1st Dan                  │ │
│ │ Date: Dec 15, 2023              │ │
│ │ Status: ✓ Active                │ │
│ │ [View] [Download]               │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### 2. Certificate Detail Screen
```
┌─────────────────────────────────────┐
│ Official Certificate        ✕       │
├─────────────────────────────────────┤
│ ╔═══════════════════════════════╗   │
│ ║  🎓 CERTIFICATE OF ACHIEVEMENT║   │
│ ║  Combat Warrior Taekwondo     ║   │
│ ║                               ║   │
│ ║  STUDENT NAME                 ║   │
│ ║  JOHN DOE                     ║   │
│ ║                               ║   │
│ ║  HAS SUCCESSFULLY COMPLETED   ║   │
│ ║  Black Belt 1st Dan           ║   │
│ ║                               ║   │
│ ║  Type: Belt Promotion         ║   │
│ ║  Level: 1st Dan               ║   │
│ ║  Date: January 22, 2024       ║   │
│ ║  Code: ABC123XYZ              ║   │
│ ║                               ║   │
│ ║  [QR CODE]                    ║   │
│ ║                               ║   │
│ ║  _______________              ║   │
│ ║  Instructor Signature         ║   │
│ ║  Ravi Kumar                   ║   │
│ ║                               ║   │
│ ║  [OFFICIAL SEAL]              ║   │
│ ╚═══════════════════════════════╝   │
├─────────────────────────────────────┤
│ [🔍 Zoom] [📥 Download] [📤 Share]  │
│ [✓ Verify]                          │
└─────────────────────────────────────┘
```

### 3. Share Options
```
┌─────────────────────────────────────┐
│ Share Certificate                   │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ 💬 WhatsApp                     │ │
│ │ Share via WhatsApp              │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ 📧 Email                        │ │
│ │ Share via Email                 │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ 📱 Other Apps                   │ │
│ │ Share via other apps            │ │
│ └─────────────────────────────────┘ │
│                                     │
│ [Cancel]                            │
└─────────────────────────────────────┘
```

---

## Status Indicators

### Active Certificate
```
✓ Active (Green badge)
```

### Expired Certificate
```
✗ Expired (Red badge)
```

### Pending Certificate
```
⏳ Pending (Yellow badge)
```

---

## Features Summary

### ✅ Implemented
- Certificate list display
- Certificate detail view
- Download functionality
- Share functionality
- Auto-sync from backend
- Filter by type
- Refresh functionality
- Error handling
- Loading states

### 🔄 To Be Enhanced
- Filter by year
- Filter by level
- Status badges (Active/Expired)
- QR code generation
- Zoom in/out functionality
- Offline viewing
- WhatsApp direct share
- Email direct share
- Certificate verification

---

## Technical Implementation

### Components
1. **CertificatesScreen** - Main screen with list and filters
2. **CertificateCard** - Individual certificate card
3. **CertificateViewModal** - Full certificate view
4. **FilterBar** - Filter controls
5. **ShareModal** - Share options
6. **QRCodeGenerator** - QR code display

### Services
1. **StudentService** - Fetch certificates
2. **CertificateService** - Download, verify
3. **StorageService** - Offline storage

### Models
1. **Certificate** - Certificate data model
2. **CertificateFilter** - Filter options

---

## Summary

This specification provides a complete certificate management system with:
- Professional certificate display
- Multiple filter options
- Download and share capabilities
- Verification system
- Offline viewing
- Auto-sync functionality
- Status indicators
- Interactive viewing (zoom)

All features are designed to provide students with easy access to their certificates and the ability to share them professionally.
