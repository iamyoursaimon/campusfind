CAMPUSFIND FINAL - DIRECT RUN

1. Make sure Node.js LTS is installed.
2. Double-click START_CAMPUSFIND.bat.
3. Open http://localhost:5000

AUTH
- Signup accepts normal Gmail/any valid email. No @puc.ac.bd restriction.
- Student ID = fixed 0222510005 + last 6 digits.
- Firebase handles authentication.
- Signup continues to Profile even if MongoDB Atlas is temporarily offline.

MONGODB ATLAS
- Connection is configured in backend/.env.
- No local MongoDB Server or MongoDB Compass is required.
- Check http://localhost:5000/api/status
- mongo:true means Atlas is connected.
- If false, check Atlas Network Access (IP allowlist), Database Access username/password, and internet access.

FEATURES
- Shared dark/light theme
- Synchronized navigation/profile taskbar
- Editable profile + profile photo
- Firebase login/signup/logout
- Community posts with animated 3D-style entrance and MongoDB sync
- Lost/found reports with API/MongoDB storage when Atlas is connected
- Recent activity
- Rotating bottom-right live notifications with changing content
- Hazari Line naming (legacy Prabartak page redirects)
