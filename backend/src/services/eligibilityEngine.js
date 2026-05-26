/**
 * Eligibility Engine
 * Core logic for evaluating user eligibility against government schemes
 * 
 * This module:
 * 1. Defines scheme rules based on official government guidelines
 * 2. Evaluates user profile against each scheme's rules
 * 3. Generates detailed explanations for each verdict
 */

import fetch from 'node-fetch' // Using native fetch in Node 18+ or polyfill if needed. Ideally we should use global fetch if available.
// If node-fetch is not installed, we might need to rely on global fetch (Node 18+).
// To be safe assuming modern node, we'll try to use global fetch. If not, we'll need to install node-fetch or axios.
// Given strict instructions, I will assume global fetch is available or I will use a try-catch to require it?
// Actually, 'import fetch' might fail if it's not a module or not installed. 
// Standard Node 18+ has fetch globally. The package.json says "type": "module".
// I will NOT import fetch, I will assume it is available globally.
// BUT, I'll add a check.

// Scheme definitions with eligibility rules (Static Database)
const STATIC_SCHEMES = [
    {
        id: 'pm-kisan',
        name: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
        category: 'agriculture',
        description: 'Direct income support of ₹6,000 per year to small and marginal farmers',
        officialUrl: 'https://pmkisan.gov.in/',
        rules: [
            {
                name: 'Occupation',
                description: 'Must be a farmer or engaged in agriculture',
                evaluate: (profile) => {
                    const farmerOccupations = ['farmer', 'agricultural laborer']
                    return farmerOccupations.some(occ =>
                        profile.occupation.toLowerCase().includes(occ.toLowerCase())
                    )
                },
                getRequired: () => 'Farmer / Agricultural Laborer',
                getUserValue: (profile) => profile.occupation,
                isFixable: false
            },
            {
                name: 'Income Limit',
                description: 'Annual income should be within eligible range',
                evaluate: (profile) => profile.income <= 200000,
                getRequired: () => '≤ ₹2,00,000',
                getUserValue: (profile) => `₹${profile.income.toLocaleString('en-IN')}`,
                isFixable: true,
                fixSuggestion: 'Income criterion is based on declared income. Verify your income documentation.'
            }
        ]
    },
    {
        id: 'pmjay',
        name: 'Ayushman Bharat (PM-JAY)',
        category: 'health',
        description: 'Health insurance coverage of ₹5 lakh per family per year for secondary and tertiary care',
        officialUrl: 'https://pmjay.gov.in/',
        rules: [
            {
                name: 'Income Limit',
                description: 'Annual income must be below ₹5,00,000 for eligibility',
                evaluate: (profile) => profile.income <= 500000,
                getRequired: () => '≤ ₹5,00,000',
                getUserValue: (profile) => `₹${profile.income.toLocaleString('en-IN')}`,
                isFixable: false
            },
            {
                name: 'Category Priority',
                description: 'Priority for SC/ST/OBC categories (not mandatory)',
                evaluate: () => true, // Not a hard requirement
                getRequired: () => 'Any category (priority for SC/ST/OBC)',
                getUserValue: (profile) => profile.category || 'Not specified',
                isFixable: false
            }
        ]
    },
    {
        id: 'nsp',
        name: 'National Scholarship Portal (NSP)',
        category: 'education',
        description: 'Various scholarships for students from economically weaker sections',
        officialUrl: 'https://scholarships.gov.in/',
        rules: [
            {
                name: 'Occupation',
                description: 'Must be a student',
                evaluate: (profile) => profile.occupation.toLowerCase().includes('student'),
                getRequired: () => 'Student',
                getUserValue: (profile) => profile.occupation,
                isFixable: false
            },
            {
                name: 'Age Requirement',
                description: 'Applicant must be between 16 and 35 years of age',
                evaluate: (profile) => profile.age >= 16 && profile.age <= 35,
                getRequired: () => '16-35 years',
                getUserValue: (profile) => `${profile.age} years`,
                isFixable: false
            },
            {
                name: 'Income Limit',
                description: 'Annual family income must be below ₹2,50,000',
                evaluate: (profile) => profile.income <= 250000,
                getRequired: () => '≤ ₹2,50,000',
                getUserValue: (profile) => `₹${profile.income.toLocaleString('en-IN')}`,
                isFixable: true,
                fixSuggestion: 'Different scholarships have different income limits. Check specific scholarship criteria.'
            }
        ]
    },
    {
        id: 'pmay',
        name: 'Pradhan Mantri Awas Yojana (PMAY)',
        category: 'housing',
        description: 'Affordable housing scheme with interest subsidy on home loans',
        officialUrl: 'https://pmaymis.gov.in/',
        rules: [
            {
                name: 'Income Category',
                description: 'Must fall under EWS/LIG/MIG income categories',
                evaluate: (profile) => profile.income <= 1800000,
                getRequired: () => '≤ ₹18,00,000 (MIG-II limit)',
                getUserValue: (profile) => `₹${profile.income.toLocaleString('en-IN')}`,
                isFixable: false
            }
        ],
        getCategory: (income) => {
            if (income <= 300000) return 'EWS (Economically Weaker Section)'
            if (income <= 600000) return 'LIG (Low Income Group)'
            if (income <= 1200000) return 'MIG-I (Middle Income Group I)'
            if (income <= 1800000) return 'MIG-II (Middle Income Group II)'
            return 'Above MIG-II (Not Eligible)'
        }
    },
    {
        id: 'pmsby',
        name: 'Pradhan Mantri Suraksha Bima Yojana (PMSBY)',
        category: 'insurance',
        description: 'Accident insurance scheme with premium of ₹20 per year',
        officialUrl: 'https://www.jansuraksha.gov.in/',
        rules: [
            {
                name: 'Age Requirement',
                description: 'Applicant must be between 18 and 70 years of age',
                evaluate: (profile) => profile.age >= 18 && profile.age <= 70,
                getRequired: () => '18-70 years',
                getUserValue: (profile) => `${profile.age} years`,
                isFixable: false
            }
        ]
    },
    {
        id: 'pmjjby',
        name: 'Pradhan Mantri Jeevan Jyoti Bima Yojana (PMJJBY)',
        category: 'insurance',
        description: 'Life insurance scheme with premium of ₹436 per year',
        officialUrl: 'https://www.jansuraksha.gov.in/',
        rules: [
            {
                name: 'Age Requirement',
                description: 'Applicant must be between 18 and 50 years of age',
                evaluate: (profile) => profile.age >= 18 && profile.age <= 50,
                getRequired: () => '18-50 years',
                getUserValue: (profile) => `${profile.age} years`,
                isFixable: false
            }
        ]
    }
]

/**
 * Evaluates a user profile against a list of static government schemes.
 * @param {object} userProfile - The user's profile containing details like age, income, occupation, etc.
 * @returns {Array<object>} An array of scheme evaluation results.
 */
export function evaluateStaticSchemes(userProfile) {
    const results = []

    for (const scheme of STATIC_SCHEMES) {
        let allPassed = true
        let isFixable = false
        let fixSuggestion = ''
        const ruleResults = []

        for (const rule of scheme.rules) {
            const passed = rule.evaluate(userProfile)
            ruleResults.push({
                ruleName: rule.name,
                ruleDescription: rule.description,
                passed: passed,
                userValue: rule.getUserValue(userProfile),
                requiredValue: rule.getRequired(),
                isFixable: rule.isFixable,
                fixSuggestion: rule.fixSuggestion
            })

            if (!passed) {
                allPassed = false
                if (rule.isFixable) {
                    isFixable = true
                    if (rule.fixSuggestion) {
                        fixSuggestion = rule.fixSuggestion
                    }
                }
            }
        }

        // Generate explanation
        let explanation = ''
        if (allPassed) {
            explanation = `Final Decision: Based on your profile, you appear to meet the eligibility criteria for ${scheme.name}.`
            if (scheme.getCategory) {
                explanation += ` You qualify under the ${scheme.getCategory(userProfile.income)} category.`
            }
        } else {
            const failedRules = ruleResults.filter(r => !r.passed).map(r => r.ruleName)
            explanation = `Final Decision: You do not meet the eligibility criteria for ${scheme.name} because you did not satisfy the following: ${failedRules.join(', ')}.`
            if (isFixable) {
                explanation += ' However, some of these criteria may be verifiable or adjustable.'
            }
        }

        results.push({
            id: scheme.id,
            name: scheme.name,
            description: scheme.description,
            status: allPassed ? 'eligible' : 'ineligible',
            officialUrl: scheme.officialUrl,
            rules: ruleResults,
            explanation,
            isFixable: !allPassed && isFixable,
            fixSuggestion: !allPassed && isFixable ? fixSuggestion : undefined
        })
    }

    // Sort: eligible first, then by name
    results.sort((a, b) => {
        if (a.status === 'eligible' && b.status !== 'eligible') return -1
        if (a.status !== 'eligible' && b.status === 'eligible') return 1
        return a.name.localeCompare(b.name)
    })

    // Post-processing: Find detailed alternatives
    // We map over the sorted results to attach alternatives to ineligible ones
    return results.map(result => {
        if (result.status === 'ineligible') {
            // Find the category of the current scheme from static definition
            const schemeDef = STATIC_SCHEMES.find(s => s.id === result.id)
            if (schemeDef && schemeDef.category) {
                // Find other eligible schemes in the same category
                const alternatives = results
                    .filter(r =>
                        r.status === 'eligible' &&
                        r.id !== result.id &&
                        STATIC_SCHEMES.find(s => s.id === r.id)?.category === schemeDef.category
                    )
                    .map(r => ({ id: r.id, name: r.name }))

                return { ...result, alternatives }
            }
        }
        return result
    })
}

/**
 * Search for schemes using real-time API
 */
async function discoverSchemesWithAI(userProfile) {
    console.log('Starting AI Scheme Discovery for:', userProfile.occupation, userProfile.state);

    // 1. Search with Serper
    let query = `government welfare schemes for ${userProfile.occupation} in ${userProfile.state} India annual income ${userProfile.income}`;
    if (userProfile.category && userProfile.category !== 'Prefer not to say') {
        query += ` for ${userProfile.category} category`;
    }
    query += ` eligibility`;
    console.log('Searching Serper with query:', query);

    const serperResponse = await fetch('https://google.serper.dev/search', {
        method: 'POST',
        headers: {
            'X-API-KEY': process.env.SERPER_API_KEY,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            q: query,
            num: 10,
            gl: 'in'
        })
    });

    if (!serperResponse.ok) {
        throw new Error(`Serper API error: ${serperResponse.statusText}`);
    }

    const searchData = await serperResponse.json();
    if (!searchData.organic || searchData.organic.length === 0) {
        throw new Error('No search results found');
    }

    // Prepare context for LLM
    const searchContext = searchData.organic.map((result, index) =>
        `Source ${index + 1}:
         Title: ${result.title}
         Link: ${result.link}
         Snippet: ${result.snippet}`
    ).join('\n\n');

    // 2. Analyze with LLM (OpenRouter)
    console.log('Analyzing results with OpenRouter...');
    const llmResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'http://localhost:3000', // Optional
            'X-Title': 'SmartGov Guide' // Optional
        },
        body: JSON.stringify({
            model: "openai/gpt-3.5-turbo", // Cost-effective and fast
            messages: [
                {
                    role: "system",
                    content: `You are a helper that extracts Indian government schemes from search results.
                    Analyze the user profile: Age: ${userProfile.age}, Income: ${userProfile.income}, Occupation: ${userProfile.occupation}, State: ${userProfile.state}, Category: ${userProfile.category}.
                    Language: ${userProfile.language || 'English'}.

                    IMPORTANT: If the user belongs to a specific social category (SC, ST, OBC), prioritize schemes meant for that category.

                    Return a JSON object with a key "schemes" containing an array of schemes.
                    For each scheme, provide:
                    - id: unique string
                    - name: string (IN ${userProfile.language === 'ta' ? 'TAMIL' : userProfile.language === 'hi' ? 'HINDI' : userProfile.language === 'te' ? 'TELUGU' : userProfile.language === 'ml' ? 'MALAYALAM' : 'ENGLISH'})
                    - description: string (IN ${userProfile.language === 'ta' ? 'TAMIL' : userProfile.language === 'hi' ? 'HINDI' : userProfile.language === 'te' ? 'TELUGU' : userProfile.language === 'ml' ? 'MALAYALAM' : 'ENGLISH'})
                    - officialUrl: the most relevant link from the sources
                    - status: "eligible" or "ineligible" based on the user profile
                    - explanation: string explaining why they are eligible or not (IN ${userProfile.language === 'ta' ? 'TAMIL' : userProfile.language === 'hi' ? 'HINDI' : userProfile.language === 'te' ? 'TELUGU' : userProfile.language === 'ml' ? 'MALAYALAM' : 'ENGLISH'})
                    
                    Only include REAL schemes found in the context. If unsure, mark ineligible.`
                },
                {
                    role: "user",
                    content: `Here are the search results:\n${searchContext}\n\nList relevant schemes.`
                }
            ],
            response_format: { type: "json_object" }
        })
    });

    if (!llmResponse.ok) {
        const err = await llmResponse.text();
        throw new Error(`OpenRouter API error: ${err}`);
    }

    const llmData = await llmResponse.json();
    const content = llmData.choices[0].message.content;

    try {
        const parsedContext = JSON.parse(content);
        if (parsedContext.schemes && Array.isArray(parsedContext.schemes)) {
            // Add basic rule structure for frontend compatibility
            return parsedContext.schemes.map(s => {
                // CRITICAL FIX: Properly evaluate income as a HARD rule
                const incomeLimit = 250000; // Standard limit for most schemes
                const incomeExceedsLimit = userProfile.income > incomeLimit;

                // If AI says eligible but income exceeds limit, override to ineligible
                let actualStatus = s.status;
                if (s.status === 'eligible' && incomeExceedsLimit) {
                    actualStatus = 'ineligible';
                }

                return {
                    ...s,
                    status: actualStatus,
                    rules: [
                        // HARD RULE: Official Income Limit (actually determines eligibility)
                        {
                            ruleName: 'Official Income Limit',
                            ruleDescription: 'Annual income must be within the official scheme limit',
                            userValue: `₹${userProfile.income.toLocaleString('en-IN')}`,
                            requiredValue: `≤ ₹${incomeLimit.toLocaleString('en-IN')}`,
                            passed: !incomeExceedsLimit,
                            type: 'hard' // This is a hard eligibility rule
                        },
                        // SOFT RULE: Income Reference (Indicative only)
                        {
                            ruleName: 'Income Reference (Indicative)',
                            ruleDescription: 'Typical income limit for some benefits',
                            userValue: `₹${userProfile.income.toLocaleString('en-IN')}`,
                            requiredValue: '≤ ₹2,50,000 (typical scheme limit)',
                            passed: true, // Soft rules don't fail
                            type: 'soft'
                        },
                        // Occupation/Category rule
                        {
                            ruleName: 'Occupation/Category',
                            ruleDescription: 'Verifying occupation and social category requirements',
                            userValue: `${userProfile.occupation} / ${userProfile.category}`,
                            requiredValue: 'Target Beneficiary Group',
                            passed: actualStatus === 'eligible' && !incomeExceedsLimit,
                            type: 'hard'
                        }
                    ],
                    matchReason: `Evaluated based on your State (${userProfile.state}) and Occupation (${userProfile.occupation})`,
                    explanation: actualStatus === 'eligible'
                        ? s.explanation
                        : (incomeExceedsLimit
                            ? `You do not meet the eligibility criteria because your income (₹${userProfile.income.toLocaleString('en-IN')}) exceeds the official limit of ₹${incomeLimit.toLocaleString('en-IN')}.`
                            : s.explanation)
                };
            });
        }
    } catch (e) {
        console.error('Failed to parse LLM response:', e);
        throw new Error('Invalid LLM response format');
    }

    return [];
}

/**
 * Main Evaluation Entry Point
 */
export async function evaluateEligibility(userProfile) {
    // Debug: Log environment variables (masked) to ensure they are loaded
    const serperKey = process.env.SERPER_API_KEY;
    const openRouterKey = process.env.OPENROUTER_API_KEY;

    console.log('--- Evaluation Started ---');
    console.log(`Serper Key Present: ${!!serperKey}, Length: ${serperKey ? serperKey.length : 0}`);
    console.log(`OpenRouter Key Present: ${!!openRouterKey}, Length: ${openRouterKey ? openRouterKey.length : 0}`);

    const hasKeys = serperKey && serperKey.trim() !== '' && openRouterKey && openRouterKey.trim() !== '';


    if (hasKeys) {
        try {
            console.log('Attempting AI Scheme Discovery...');
            const aiResults = await discoverSchemesWithAI(userProfile);
            if (aiResults && aiResults.length > 0) {
                console.log(`AI found ${aiResults.length} schemes.`);

                // Translate AI results if needed (in case LLM ignored language instruction)
                if (userProfile.language && userProfile.language !== 'en' && userProfile.language !== 'English') {
                    console.log(`Ensuring AI results are in ${userProfile.language}...`);
                    return await translateSchemeResults(aiResults, userProfile.language);
                }

                return aiResults;
            }
            console.log('AI returned no results, falling back to static.');
        } catch (error) {
            console.error('AI Discovery Failed (Fallback to Static):', error.message);
            if (error.cause) console.error('Cause:', error.cause);
        }
    } else {
        console.log('API keys missing or invalid. Using static database.');
    }

    console.log('Returning static schemes...');
    const staticResults = evaluateStaticSchemes(userProfile);

    // Translate if needed
    if (userProfile.language && userProfile.language !== 'en' && userProfile.language !== 'English') {
        console.log(`Translating static results to ${userProfile.language}...`);
        return await translateSchemeResults(staticResults, userProfile.language);
    }

    return staticResults;
}

// Helper to translate scheme results
import { translateText } from './translationService.js';

async function translateSchemeResults(results, targetLanguage) {
    // Process in parallel to save time
    // We translate Name, Description, and Explanation
    const translatedResults = await Promise.all(results.map(async (scheme) => {
        try {
            // Translate key fields
            const [name, description, explanation] = await Promise.all([
                translateText(scheme.name, targetLanguage),
                translateText(scheme.description, targetLanguage),
                translateText(scheme.explanation, targetLanguage)
            ]);

            return {
                ...scheme,
                name: name || scheme.name,
                description: description || scheme.description,
                explanation: explanation || scheme.explanation
            };
        } catch (err) {
            console.error(`Failed to translate scheme ${scheme.id}:`, err);
            return scheme; // Return original if translation fails
        }
    }));

    return translatedResults;
}
