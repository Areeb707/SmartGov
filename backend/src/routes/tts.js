import express from 'express';
import fetch from 'node-fetch';
import { translateText, getSupportedLanguages } from '../services/translationService.js';

const router = express.Router();
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const ELEVENLABS_TTS_URL = 'https://api.elevenlabs.io/v1/text-to-speech';

// Default voice ID for multilingual support
const DEFAULT_VOICE_ID = 'pNInz6obpgDQGcFmaJgB'; // Adam - multilingual voice

/**
 * POST /api/tts/translate
 * Translate text to target language
 */
router.post('/translate', async (req, res) => {
    try {
        const { text, targetLanguage } = req.body;

        if (!text) {
            return res.status(400).json({ error: 'Text is required' });
        }

        if (!targetLanguage) {
            return res.status(400).json({ error: 'Target language is required' });
        }

        const translatedText = await translateText(text, targetLanguage);

        res.json({
            originalText: text,
            translatedText,
            targetLanguage,
            success: true
        });

    } catch (error) {
        console.error('Translation endpoint error:', error);
        res.status(500).json({
            error: 'Translation failed',
            message: error.message,
            success: false
        });
    }
});

/**
 * POST /api/tts/generate
 * Generate audio from text using ElevenLabs
 */
// In-memory rate limiting store for TTS
const ttsLimits = new Map()
const MAX_TTS_PER_SCHEME_SESSION = 3

/**
 * POST /api/tts/generate
 * Generate audio from text using ElevenLabs
 */
router.post('/generate', async (req, res) => {
    try {
        const { text, language, schemeId } = req.body;
        const sessionId = req.headers['x-session-id'];

        if (!text) {
            return res.status(400).json({ error: 'Text is required' });
        }

        // Rate Limiting Logic
        if (sessionId && schemeId) {
            const key = `${sessionId}:${schemeId}`;
            const currentCount = ttsLimits.get(key) || 0;
            if (currentCount >= MAX_TTS_PER_SCHEME_SESSION) {
                return res.status(429).json({
                    error: 'Rate limit exceeded',
                    message: `You have reached the maximum of ${MAX_TTS_PER_SCHEME_SESSION} audio generations for this scheme.`
                });
            }
            ttsLimits.set(key, currentCount + 1);
        }

        if (!ELEVENLABS_API_KEY) {
            return res.status(503).json({
                error: 'TTS service not configured',
                message: 'ElevenLabs API key is missing',
                success: false
            });
        }

        // Translation Logic
        let textToSpeech = text;
        if (language && language !== 'en') {
            try {
                // If language supported, translate first
                // Note: simple translation here, purely for audio generation
                textToSpeech = await translateText(text, language);
            } catch (transError) {
                console.warn('Translation for TTS failed, falling back to English:', transError.message);
                // Fallback to English text if translation fails
            }
        }

        // Validate text length (ElevenLabs has limits)
        if (textToSpeech.length > 5000) {
            return res.status(400).json({
                error: 'Text too long',
                message: 'Maximum 5000 characters allowed',
                success: false
            });
        }

        // Call ElevenLabs TTS API
        const ttsResponse = await fetch(`${ELEVENLABS_TTS_URL}/${DEFAULT_VOICE_ID}`, {
            method: 'POST',
            headers: {
                'Accept': 'audio/mpeg',
                'xi-api-key': ELEVENLABS_API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: textToSpeech,
                model_id: 'eleven_multilingual_v2',
                voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.75,
                    style: 0.0,
                    use_speaker_boost: true
                }
            })
        });

        if (!ttsResponse.ok) {
            const errorData = await ttsResponse.json().catch(() => ({}));
            console.error('ElevenLabs API error:', errorData);
            throw new Error(`TTS generation failed: ${ttsResponse.status}`);
        }

        // Get audio buffer
        const audioBuffer = await ttsResponse.arrayBuffer();

        // Send audio back to client
        res.set({
            'Content-Type': 'audio/mpeg',
            'Content-Length': audioBuffer.byteLength
        });
        res.send(Buffer.from(audioBuffer));

    } catch (error) {
        console.error('TTS generation error:', error);
        res.status(500).json({
            error: 'Audio generation failed',
            message: error.message,
            success: false
        });
    }
});

/**
 * GET /api/tts/languages
 * Get list of supported languages
 */
router.get('/languages', (req, res) => {
    res.json({
        languages: getSupportedLanguages(),
        success: true
    });
});

/**
 * GET /api/tts/status
 * Check if TTS service is available
 */
router.get('/status', (req, res) => {
    const isAvailable = !!ELEVENLABS_API_KEY;
    res.json({
        available: isAvailable,
        message: isAvailable ? 'TTS service is available' : 'TTS service not configured',
        success: true
    });
});

export default router;
