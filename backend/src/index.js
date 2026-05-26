import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import eligibilityRoutes from './routes/eligibility.js'
import ttsRoutes from './routes/tts.js'
import explanationRoutes from './routes/explanation.js'
import phishingRoutes from './routes/phishing.js'

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'SmartGov Guide API is running' })
})

// Eligibility routes
app.use('/api/eligibility', eligibilityRoutes)

// TTS routes (accessibility feature)
app.use('/api/tts', ttsRoutes)

// AI Explanation routes (new)
app.use('/api/explain', explanationRoutes)

// Phishing URL detection routes
app.use('/api/phishing', phishingRoutes)

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err)
    res.status(500).json({
        error: 'Internal server error',
        message: err.message
    })
})

// Start server
app.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════╗
║     SmartGov Guide API Server            ║
║     Running on http://localhost:${PORT}      ║
╚══════════════════════════════════════════╝
  `)
})
