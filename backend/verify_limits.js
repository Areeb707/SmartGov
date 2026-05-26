
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000/api';
const NUM_REQUESTS = 7;
const SESSION_ID = 'test-session-' + Date.now();

// Mock profile for eligibility check
const profile = {
    age: 30,
    income: 100000,
    state: 'Tamil Nadu',
    occupation: 'Farmer',
    language: 'en'
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function verifyEligibilityLimit() {
    console.log(`\n--- Verifying Eligibility Rate Limit (Max 5/session) ---`);
    console.log(`Session ID: ${SESSION_ID}`);

    for (let i = 1; i <= NUM_REQUESTS; i++) {
        try {
            const response = await fetch(`${BASE_URL}/eligibility/check`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Session-Id': SESSION_ID
                },
                body: JSON.stringify(profile)
            });

            console.log(`Request ${i}: Status ${response.status}`);

            if (i > 5) {
                if (response.status === 429) {
                    console.log('✅ Rate limit correctly enforced.');
                } else {
                    console.log('❌ Rate limit FAILED. Expected 429.');
                }
            } else {
                if (response.status !== 200) {
                    console.log('❌ Request failed unexpectedly.');
                }
            }
        } catch (error) {
            console.error(`Request ${i} error:`, error.message);
        }
    }
}

async function verifyTTSLimit() {
    console.log(`\n--- Verifying TTS Rate Limit (Max 3/scheme/session) ---`);
    const SCHEME_ID = 'pm-kisan';
    const TTS_REQUESTS = 5;

    for (let i = 1; i <= TTS_REQUESTS; i++) {
        try {
            const response = await fetch(`${BASE_URL}/tts/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Session-Id': SESSION_ID
                },
                body: JSON.stringify({
                    text: 'Test audio generation',
                    language: 'en',
                    schemeId: SCHEME_ID
                })
            });

            console.log(`TTS Request ${i}: Status ${response.status}`);

            if (i > 3) {
                if (response.status === 429) {
                    console.log('✅ TTS Rate limit correctly enforced.');
                } else {
                    console.log('❌ TTS Rate limit FAILED. Expected 429.');
                }
            }
        } catch (error) {
            console.error(`TTS Request ${i} error:`, error.message);
        }
    }
}

async function verifyTranslation() {
    console.log(`\n--- Verifying Translation Logic in TTS Endpoint ---`);
    // This is hard to verify without checking keys/logs, but we can check if it returns 200/500
    // If no key is set, it might 503 or 500. Expected: 503 if no key.

    try {
        const response = await fetch(`${BASE_URL}/tts/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text: 'Hello',
                language: 'ta',
                schemeId: 'test'
            })
        });
        console.log(`Translation+TTS Request: Status ${response.status}`);
        if (response.status === 503) console.log('✅ Service unavailable handled (expected if no key).');
        else if (response.status === 200) console.log('✅ TTS generated.');
    } catch (e) {
        console.log('Error:', e.message);
    }
}

(async () => {
    try {
        await verifyEligibilityLimit();
        await verifyTTSLimit();
        await verifyTranslation();
    } catch (e) {
        console.error('Verification failed:', e);
    }
})();
