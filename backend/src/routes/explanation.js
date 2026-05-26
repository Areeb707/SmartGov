import express from 'express'
import { generateExplanation } from '../services/explanationService.js'

const router = express.Router()

// Simple in-memory rate limiter per session
const sessionUsage = new Map()

// Reset usage every hour (simple cleanup)
setInterval(() => {
    sessionUsage.clear()
}, 3600000)

router.post('/generate', async (req, res) => {
    try {
        const { schemeName, status, language, failedRules, profile } = req.body
        const sessionId = req.headers['x-session-id']

        if (!sessionId) {
            return res.status(400).json({ error: 'Session ID required' })
        }

        // Rate Limiting Logic (Max 10 explanations per session to save costs)
        const usage = sessionUsage.get(sessionId) || 0
        if (usage >= 10) {
            return res.status(429).json({ error: 'Explanation limit reached for this session' })
        }
        sessionUsage.set(sessionId, usage + 1)

        // Generate Explanation
        const explanation = await generateExplanation(schemeName, status, language, failedRules, profile)

        res.json({ explanation })

    } catch (error) {
        console.error('Explanation Route Error:', error)
        res.status(500).json({ error: 'Failed to generate explanation' })
    }
})

export default router
