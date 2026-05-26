import fetch from 'node-fetch';

/**
 * Translation Service
 * Uses the existing OpenRouter LLM to translate text to different languages
 * This is used for the TTS accessibility feature
 */

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Language configurations
const SUPPORTED_LANGUAGES = {
    en: 'English',
    ta: 'Tamil',
    hi: 'Hindi',
    te: 'Telugu',
    ml: 'Malayalam'
};

/**
 * Translate text to the specified language using OpenRouter LLM
 * @param {string} text - The text to translate
 * @param {string} targetLanguage - Language code (en, ta, hi, te, ml)
 * @returns {Promise<string>} - Translated text
 */
export async function translateText(text, targetLanguage) {
    // If target is English or no translation needed, return original
    if (targetLanguage === 'en' || !targetLanguage) {
        return text;
    }

    // Validate language support
    if (!SUPPORTED_LANGUAGES[targetLanguage]) {
        console.warn(`Unsupported language: ${targetLanguage}, falling back to English`);
        return text;
    }

    const languageName = SUPPORTED_LANGUAGES[targetLanguage];

    try {
        const response = await fetch(OPENROUTER_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://smartgov.local',
                'X-Title': 'SmartGov Translation Service'
            },
            body: JSON.stringify({
                model: 'google/gemini-2.0-flash-exp:free',
                messages: [
                    {
                        role: 'system',
                        content: `You are a professional translator for government services. Translate text to ${languageName} while maintaining a formal, respectful tone. Keep explanations clear and simple for citizens to understand.`
                    },
                    {
                        role: 'user',
                        content: `Translate the following government scheme eligibility explanation to ${languageName}. Maintain the same meaning and tone:\n\n${text}`
                    }
                ],
                temperature: 0.3,
                max_tokens: 1000
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Translation API error:', errorData);
            throw new Error(`Translation failed: ${response.status}`);
        }

        const data = await response.json();
        const translatedText = data.choices?.[0]?.message?.content?.trim();

        if (!translatedText) {
            throw new Error('No translation returned from API');
        }

        return translatedText;

    } catch (error) {
        console.error('Translation error:', error.message);
        // Fallback to original text on error
        return text;
    }
}

/**
 * Get list of supported languages
 * @returns {Object} - Object with language codes and names
 */
export function getSupportedLanguages() {
    return SUPPORTED_LANGUAGES;
}

export { SUPPORTED_LANGUAGES };
