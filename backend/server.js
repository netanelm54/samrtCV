import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import analysisRoutes from './routes/analysisRoutes.js'
import paymentRoutes from './routes/paymentRoutes.js'
import analyticsRoutes from './routes/analyticsRoutes.js'
import couponRoutes from './routes/couponRoutes.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment-specific .env file
// Load .env first as base, then environment-specific file to override
const envFile = process.env.NODE_ENV === 'production' 
  ? '.env.prod' 
  : process.env.NODE_ENV === 'staging' 
  ? '.env.staging' 
  : '.env.dev'

dotenv.config({ path: path.join(__dirname, '.env') }) // Base config
dotenv.config({ path: path.join(__dirname, envFile) }) // Environment-specific overrides

const app = express()
const PORT = process.env.PORT || 5001

// Configure CORS with support for multiple origins
const getAllowedOrigins = () => {
  const origins = []
  
  // Add localhost for development
  origins.push('http://localhost:3000')
  
  // Add FRONTEND_URL if set
  if (process.env.FRONTEND_URL) {
    origins.push(process.env.FRONTEND_URL)
  }
  
  return origins
}

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = getAllowedOrigins()
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      return callback(null, true)
    }
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      // In development, allow any origin for easier testing
      if (process.env.NODE_ENV !== 'production') {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    }
  },
  credentials: true
}))
app.use(express.json())
app.use(express.static(path.join(__dirname, 'uploads')))

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api', analysisRoutes)
app.use('/api', paymentRoutes)
app.use('/api', analyticsRoutes)
app.use('/api', couponRoutes)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err)
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`Analysis endpoint: http://localhost:${PORT}/api/analyze-cv`)
})
