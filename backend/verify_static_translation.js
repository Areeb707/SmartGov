
import dotenv from 'dotenv';
dotenv.config();

// START IMPORANT NOTE:
// evaluateEligibility uses process.env.OPENROUTER_API_KEY.
// translationService reads process.env.OPENROUTER_API_KEY at top level.
// So we MUST load dotenv before importing those modules.
// We use dynamic import() to ensure this order.

async function verifyStaticTranslation() {
    console.log('🧪 Starting Static Translation Verification...');

    // 1. Ensure OpenRouter Key is present for translation
    if (!process.env.OPENROUTER_API_KEY) {
        console.error('❌ OPENROUTER_API_KEY is missing in .env. Cannot test translation.');
        process.exit(1);
    }
    console.log('✅ OpenRouter Key present (for translation).');

    // 2. Disable Serper to force static fallback
    const originalSerper = process.env.SERPER_API_KEY;
    process.env.SERPER_API_KEY = '';
    console.log('✅ Serper Key disabled to force static path.');

    // Dynamic import to ensuring dotenv is loaded first
    const { evaluateEligibility } = await import('./src/services/eligibilityEngine.js');

    const userProfile = {
        age: 45,
        income: 150000,
        occupation: 'Farmer',
        state: 'Tamil Nadu',
        category: 'OBC',
        language: 'ta' // Request Tamil
    };

    try {
        console.log('🚀 Calling evaluateEligibility with language="ta"...');
        const results = await evaluateEligibility(userProfile);

        console.log(`\n📋 Received ${results.length} schemes.`);

        if (results.length === 0) {
            console.error('❌ No results returned.');
            process.exit(1);
        }

        const firstScheme = results[0];
        console.log('\n🔎 Inspecting First Scheme:', firstScheme.id);
        console.log('   Name:', firstScheme.name);
        console.log('   Description:', firstScheme.description);
        console.log('   Explanation:', firstScheme.explanation);

        // Check for non-ASCII (Tamil)
        const hasTamilName = /[^\x00-\x7F]/.test(firstScheme.name);
        const hasTamilDesc = /[^\x00-\x7F]/.test(firstScheme.description);
        const hasTamilExpl = /[^\x00-\x7F]/.test(firstScheme.explanation);

        console.log('\n📝 Translation Check:');
        console.log(`   - Name Translated?        ${hasTamilName ? '✅ Yes' : '⚠️ No (ASCII)'}`);
        console.log(`   - Description Translated? ${hasTamilDesc ? '✅ Yes' : '⚠️ No (ASCII)'}`);
        console.log(`   - Explanation Translated? ${hasTamilExpl ? '✅ Yes' : '⚠️ No (ASCII)'}`);

        if (hasTamilName || hasTamilDesc || hasTamilExpl) {
            console.log('\n🎉 Verification SUCCESS: Static content was translated.');
        } else {
            console.warn('\n⚠️ Verification PARTIAL/FAILED: Content appears to be English/ASCII.');
        }

    } catch (error) {
        console.error('❌ Error during verification:', error);
    } finally {
        process.env.SERPER_API_KEY = originalSerper;
    }
}

verifyStaticTranslation();
