# 🚀 Quick Start Guide - Certificate Admin Panel

## ⚡ 5-Minute Setup

### 1. Start Backend Server

```bash
cd reactnative/Taekwondo_backend
npm start
```

Wait for: `✅ Connected to MongoDB` and `🚀 Server running on port 5000`

### 2. Open Admin Panel

Open in browser:
```
http://localhost:5000/admin-panel.html
```

### 3. Login

Use these credentials:
- **Email:** `admin@taekwondo.com`
- **Password:** `admin123`

### 4. Upload Your First Certificate

Fill in the form:
- **Student Name:** Adarsh Kumar
- **Instructor Name:** Master Kim
- **Achievement Type:** Belt Promotion
- **Achievement Title:** Yellow Belt Promotion
- **Verification Code:** `CERT2024001`
- **Image:** Upload a certificate image (optional)

Click **"Upload Certificate"** ✅

### 5. Check App

The certificate will automatically appear in the student app:
- Open the app
- Go to **Certificates** screen
- Pull to refresh
- See your certificate! 🎉

---

## 📱 What Happens Next

```
You Upload Certificate
        ↓
Backend Saves It
        ↓
App Fetches It
        ↓
Student Sees It
```

---

## 🔑 Key Features

✅ **Upload certificates** with images  
✅ **Auto-sync** to student app  
✅ **Search** by student name  
✅ **Edit/Delete** certificates  
✅ **View statistics** (total, active, revoked)  
✅ **Secure** with authentication  

---

## 🆘 Common Issues

### "Cannot connect to server"
- Make sure backend is running: `npm start`
- Check port 5000 is not blocked

### "Login failed"
- Use correct credentials: `admin@taekwondo.com` / `admin123`
- Check MongoDB is running

### "Certificate not appearing in app"
- Pull to refresh in app
- Check certificate status is "Active"
- Restart the app

---

## 📚 Full Documentation

See `CERTIFICATE_INTEGRATION_GUIDE.md` for complete details.

---

## 🎯 Next Steps

1. ✅ Upload test certificates
2. ✅ Verify they appear in app
3. ✅ Test search functionality
4. ✅ Test delete functionality
5. ✅ Share with team

---

**Ready to go!** 🚀
