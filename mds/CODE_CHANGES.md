# Code Changes Required for Deployment

This document outlines the specific code changes needed to prepare your application for cloud deployment.

---

## Frontend Changes

### 1. Update API Configuration

**File: `frontend/src/api/axiosConfig.js`**

**Current:**
```javascript
const apiClient = axios.create({
	baseURL: '',
	timeout: 300000,
	// ...
})
```

**Change to:**
```javascript
const apiClient = axios.create({
	baseURL: import.meta.env.VITE_API_URL || '',
	timeout: 300000,
	// ...
})
```

**Why:** This allows the frontend to use environment variables to connect to your backend URL in production.

---

### 2. Update Vite Configuration (Optional)

**File: `frontend/vite.config.js`**

**Current:**
```javascript
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true
      }
    }
  }
})
```

**Change to (for better production support):**
```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:5001',
        changeOrigin: true
      }
    }
  }
})
```

**Why:** Makes the proxy configurable via environment variables (though proxy is only used in dev mode).

---

## Backend Changes

### 1. Update CORS Configuration

**File: `backend/server.js`**

**Current:**
```javascript
app.use(cors())
```

**Change to:**
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}))
```

**Why:** Restricts CORS to only allow requests from your production frontend domain for security.

---

### 2. Add Health Check Endpoint (Already exists, verify)

**File: `backend/server.js`**

Make sure you have:
```javascript
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})
```

**Why:** Used by cloud platforms to verify your backend is running.

---

### 3. Environment Variable Configuration

**File: `backend/.env` (create from `env.example`)**

Ensure all production variables are set:
```env
PORT=5000
FRONTEND_URL=https://yourdomain.com

# Stripe (PRODUCTION KEYS)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# OpenAI
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o

# Email
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=your_email@gmail.com

# Service Price
SERVICE_PRICE=29.99
```

---

## File Structure After Changes

```
smartCV/
├── frontend/
│   ├── src/
│   │   └── api/
│   │       └── axiosConfig.js (UPDATED)
│   └── vite.config.js (OPTIONAL UPDATE)
├── backend/
│   ├── server.js (UPDATED - CORS)
│   └── .env (CREATE FROM env.example)
└── mds/
    ├── DEPLOYMENT.md
    └── CODE_CHANGES.md (this file)
```

---

## Testing Checklist

After making these changes:

- [ ] Frontend builds successfully: `npm run build` in `frontend/`
- [ ] Backend starts successfully: `npm start` in `backend/`
- [ ] Frontend can connect to backend in development
- [ ] CORS allows requests from frontend URL
- [ ] Health check endpoint returns `{"status":"ok"}`
- [ ] All environment variables are set correctly

---

## Notes

- These changes are backward compatible with local development
- The `|| ''` and `|| 'http://localhost:3000'` fallbacks ensure local dev still works
- Environment variables will be set in your cloud platform's dashboard
- No code changes needed for SSL/HTTPS - cloud platforms handle this automatically

