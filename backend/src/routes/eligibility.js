import express from 'express'
import { evaluateEligibility } from '../services/eligibilityEngine.js'

const router = express.Router()

/**
 * POST /api/eligibility/check
 * Main eligibility check endpoint
 * 
 * Request body:
 * {
 *   age: number,
 *   income: number,
 *   state: string,
 *   category?: string,
 *   occupation: string
 * }
 * 
 * Response:
 * {
 *   schemes: SchemeResult[]
 * }
 */
// In-memory rate limiting store
const sessionLimits = new Map()
const MAX_CHECKS_PER_SESSION = 5

router.post('/check', async (req, res, next) => {
    try {
        const sessionId = req.headers['x-session-id']
        const isSimulation = req.headers['x-simulation'] === 'true'

        // Rate Limiting Logic — skip for simulations
        if (sessionId && !isSimulation) {
            const currentCount = sessionLimits.get(sessionId) || 0
            if (currentCount >= MAX_CHECKS_PER_SESSION) {
                return res.status(429).json({
                    error: 'Rate limit exceeded',
                    message: `You have reached the maximum of ${MAX_CHECKS_PER_SESSION} eligibility checks per session.`
                })
            }
            sessionLimits.set(sessionId, currentCount + 1)
        }

        const { age, income, state, category, occupation, language } = req.body

        // Validate required fields
        if (!age || income === undefined || income === null || !state || !occupation) {
            return res.status(400).json({
                error: 'Missing required fields',
                required: ['age', 'income', 'state', 'occupation']
            })
        }

        // Validate data types
        if (typeof age !== 'number' || typeof income !== 'number') {
            return res.status(400).json({
                error: 'Invalid data types',
                message: 'age and income must be numbers'
            })
        }

        const userProfile = {
            age,
            income,
            state,
            category: category || '',
            occupation
        }

        console.log(`Processing eligibility check for session ${sessionId || 'unknown'}:`, userProfile)

        // Evaluate eligibility against known schemes
        const schemes = await evaluateEligibility(userProfile)

        res.json({ schemes })
    } catch (error) {
        next(error)
    }
})

/**
 * GET /api/eligibility/schemes
 * Get list of available schemes (for reference)
 */
router.get('/schemes', (req, res) => {
    res.json({
        schemes: [
            {
                id: 'pm-kisan',
                name: 'PM-KISAN',
                description: 'Direct income support for farmers',
                officialUrl: 'https://pmkisan.gov.in/'
            },
            {
                id: 'pmjay',
                name: 'Ayushman Bharat (PM-JAY)',
                description: 'Health insurance coverage',
                officialUrl: 'https://pmjay.gov.in/'
            },
            {
                id: 'nsp',
                name: 'National Scholarship Portal',
                description: 'Scholarships for students',
                officialUrl: 'https://scholarships.gov.in/'
            },
            {
                id: 'pmay',
                name: 'Pradhan Mantri Awas Yojana',
                description: 'Affordable housing scheme',
                officialUrl: 'https://pmaymis.gov.in/'
            }
        ]
    })
})

export default router
