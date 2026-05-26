import fetch from 'node-fetch';

async function verifyMultilingualFlow() {
    console.log('🌍 Starting Multilingual E2E Verification...');

    const API_URL = 'http://localhost:3000/api/eligibility/check';

    // Test Case: Tamil Farmer
    const payload = {
        age: 45,
        income: 150000,
        occupation: 'Farmer',
        state: 'Tamil Nadu',
        category: 'OBC',
        language: 'ta' // Requesting Tamil
    };

    try {
        console.log(`\n1. Creating eligibility request for Tamil language...`);
        const start = Date.now();
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const duration = Date.now() - start;
        console.log(`   Response received in ${duration}ms`);

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('   ✅ API Request Sucessful');

        if (!data.schemes || data.schemes.length === 0) {
            console.warn('   ⚠️ No schemes found. Cannot verify translation.');
        } else {
            console.log(`   found ${data.schemes.length} schemes`);
            const firstScheme = data.schemes[0];
            console.log(`   Scheme: ${firstScheme.name}`);
            console.log(`   Explanation Snippet (Check for Tamil):`);
            console.log(`   "${firstScheme.explanation.substring(0, 150)}..."`);

            // Simple heuristic check for non-ascii (indicative of local language scripts)
            const hasNonAsciiExplanation = /[^\x00-\x7F]/.test(firstScheme.explanation);
            const hasNonAsciiName = /[^\x00-\x7F]/.test(firstScheme.name);
            const hasNonAsciiDesc = /[^\x00-\x7F]/.test(firstScheme.description);

            console.log('   Translation Checks:');
            console.log(`   - Explanation Translated? ${hasNonAsciiExplanation ? '✅ Yes' : '⚠️ No (or ASCII)'}`);
            console.log(`   - Name Translated?        ${hasNonAsciiName ? '✅ Yes' : '⚠️ No (or ASCII)'}`);
            console.log(`   - Description Translated? ${hasNonAsciiDesc ? '✅ Yes' : '⚠️ No (or ASCII)'}`);

            if (hasNonAsciiExplanation && hasNonAsciiName) {
                console.log('   🎉 Full content translation verified!');
            } else {
                console.warn('   ⚠️ Partial translation detected. Check LLM response.');
            }
        }

    } catch (error) {
        console.error('   ❌ Verification Failed:', error.message);
        process.exit(1);
    }
}

verifyMultilingualFlow();
