import fetch from 'node-fetch'

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY
const SITE_URL = 'http://localhost:3000'
const SITE_NAME = 'SmartGov Guide'

// Fallback logic in case API fails - provides better reasoning
const getFallbackExplanation = (schemeName, status, language, failedRules, profile) => {
    // Enhanced fallback with reasoning
    if (status === 'eligible') {
        if (language === 'hi') {
            return `आप ${schemeName} के लिए पात्र हैं। आपकी जानकारी इस योजना की शर्तों से मेल खाती है और आप इस योजना के लिए आवेदन कर सकते हैं।`;
        } else if (language === 'ta') {
            return `நீங்கள் ${schemeName} திட்டத்திற்கு தகுதியுடையவர். உங்கள் விவரங்கள் இந்தத் திட்டத்தின் நிபந்தனைகளுக்கு பொருந்துகின்றன, நீங்கள் விண்ணப்பிக்கலாம்.`;
        } else if (language === 'te') {
            return `మీరు ${schemeName} పథకానికి అర్హులు. మీ వివరాలు ఈ పథక షరతులకు సరిపోతాయి మరియు మీరు దరఖాస్తు చేసుకోవచ్చు.`;
        } else {
            return `You are eligible for ${schemeName}. Your profile matches the scheme requirements and you can apply for this benefit.`;
        }
    } else {
        // For ineligible status, try to extract reason from failed rules
        let reason = '';
        if (failedRules && failedRules.length > 0) {
            const firstFailure = failedRules[0];
            if (firstFailure.ruleName && firstFailure.ruleName.toLowerCase().includes('income')) {
                reason = language === 'hi' ? 'आपकी आय इस योजना की सीमा से अधिक है' :
                    language === 'ta' ? 'உங்கள் வருமானம் இந்தத் திட்டத்தின் வரம்பை விட அதிகமாக உள்ளது' :
                        language === 'te' ? 'మీ ఆదాయం ఈ పథక పరిమితి కంటే ఎక్కువగా ఉంది' :
                            'your income exceeds the scheme limit';
            } else if (firstFailure.ruleName && (firstFailure.ruleName.toLowerCase().includes('age'))) {
                reason = language === 'hi' ? 'आपकी उम्र इस योजना के लिए निर्धारित सीमा में नहीं है' :
                    language === 'ta' ? 'உங்கள் வயது இந்தத் திட்டத்திற்கான வரம்பில் இல்லை' :
                        language === 'te' ? 'మీ వయస్సు ఈ పథకానికి నిర్ణయించిన పరిమితిలో లేదు' :
                            'your age is not within the required range';
            } else {
                reason = language === 'hi' ? 'आप इस योजना की आवश्यक शर्तें पूरी नहीं करते' :
                    language === 'ta' ? 'இந்தத் திட்டத்தின் தேவையான நிபந்தனைகளை நீங்கள் பூர்த்தி செய்யவில்லை' :
                        language === 'te' ? 'మీరు ఈ పథకం యొక్క అవసరమైన షరతులను పూర్తి చేయలేదు' :
                            'you do not meet the required conditions';
            }
        } else {
            reason = language === 'hi' ? 'आप शर्तें पूरी नहीं करते' :
                language === 'ta' ? 'நீங்கள் நிபந்தனைகளை பூர்த்தி செய்யவில்லை' :
                    language === 'te' ? 'మీరు షరతులను పూర్తి చేయలేదు' :
                        'you do not meet the criteria';
        }

        if (language === 'hi') {
            return `आप ${schemeName} के लिए पात्र नहीं हैं क्योंकि ${reason}। कृपया अन्य उपलब्ध योजनाओं की जांच करें।`;
        } else if (language === 'ta') {
            return `${reason} என்பதால் நீங்கள் ${schemeName} திட்டத்திற்கு தகுதியற்றவர். மற்ற திட்டங்களைப் பார்க்கவும்.`;
        } else if (language === 'te') {
            return `${reason} కాబట్టి మీరు ${schemeName} పథకానికి అనర్హులు. ఇతర అందుబాటులో ఉన్న పథకాలను చూడండి.`;
        } else {
            return `You are not eligible for ${schemeName} because ${reason}. Please check other available schemes.`;
        }
    }
}

export async function generateExplanation(schemeName, status, language, failedRules, profile) {
    if (!OPENROUTER_API_KEY) {
        console.warn('OpenRouter API key missing, using fallback')
        return getFallbackExplanation(schemeName, status, language, failedRules, profile)
    }

    // Construct a focused prompt that emphasizes WHY
    const languageName = language === 'ta' ? 'Tamil' :
        language === 'hi' ? 'Hindi' :
            language === 'te' ? 'Telugu' :
                language === 'ml' ? 'Malayalam' : 'English';

    const prompt = `
    You are a friendly government officer explaining scheme eligibility to a common citizen in simple words.
    
    Context:
    - Scheme: "${schemeName}"
    - Status: ${status.toUpperCase()}
    - Citizen: Age ${profile.age}, Income ₹${profile.income.toLocaleString('en-IN')}, Occupation: ${profile.occupation}
    - Language: ${languageName} (MUST use STRICTLY ${languageName} language ONLY)
    ${status === 'ineligible' ? `- Failed Requirements: ${JSON.stringify(failedRules)}` : ''}

    Task:
    Provide a 2-3 sentence explanation in STRICT ${languageName} that explains the REASON (WHY).
    
    Guidelines:
    - Focus on WHY they are eligible or WHY they are not eligible
    - Use SIMPLE, everyday words that a 10-year-old can understand
    - NO technical jargon like "User Value", "Required Value", "criteria", "beneficiary"
    - Instead use words like "you need", "your income is", "this scheme is for"
    - Be warm and helpful, not bureaucratic
    
    Examples of good explanations:
    - Eligible (English): "You are eligible because you are a farmer and your income (₹1,50,000) is below the limit of ₹2,00,000. This scheme will give you ₹6,000 per year."
    - Ineligible (English): "You are not eligible because your income (₹3,00,000) is higher than the maximum allowed limit of ₹2,50,000 for this scheme."
    - Eligible (Hindi): "आप पात्र हैं क्योंकि आप किसान हैं और आपकी आय (₹1,50,000) सीमा ₹2,00,000 से कम है। इस योजना से आपको सालाना ₹6,000 मिलेंगे।"
    - Ineligible (Hindi): "आप पात्र नहीं हैं क्योंकि आपकी आय (₹3,00,000) इस योजना की अधिकतम सीमा ₹2,50,000 से ज्यादा है।"
    
    IMPORTANT: 
    - Output ONLY in ${languageName}, NO English words mixed in
    - Start with the reason "because..." not just the status
    - Include specific numbers (income amounts, age) to make it clear
    - Make it conversational and easy to understand
    `

    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'HTTP-Referer': SITE_URL,
                'X-Title': SITE_NAME,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'openai/gpt-3.5-turbo', // Cost-effective, fast
                messages: [
                    { role: 'system', content: `You are a helpful government assistant. Speak strictly in the requested language (${languageName}). Always explain the REASON.` },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.3, // Low creativity, high precision
                max_tokens: 150 // Increased to allow for 2-3 sentences
            })
        })

        if (!response.ok) {
            throw new Error(`OpenRouter API Error: ${response.status}`)
        }

        const data = await response.json()
        const explanation = data.choices[0]?.message?.content?.trim()

        if (!explanation) throw new Error('Empty response from AI')

        return explanation

    } catch (error) {
        console.error('AI Explanation Generation Failed:', error.message)
        return getFallbackExplanation(schemeName, status, language, failedRules, profile)
    }
}
