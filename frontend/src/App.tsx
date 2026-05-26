import { useState } from 'react'
import Landing from './components/Landing'
import EligibilityForm from './components/EligibilityForm'
import ResultsScreen from './components/ResultsScreen'
import LanguageSelection from './components/LanguageSelection'
import PhishingChecker from './components/PhishingChecker'
import { TRANSLATIONS, type Language } from './utils/translations'

// User profile data type
export interface UserProfile {
    age: number
    income: number
    state: string
    category: string
    occupation: string
}

// Scheme eligibility result type
export interface SchemeResult {
    id: string
    name: string
    description: string
    status: 'eligible' | 'ineligible' | 'pending'
    officialUrl: string
    rules: RuleEvaluation[]
    explanation: string
    isFixable?: boolean
    fixSuggestion?: string
    matchReason?: string // Reason why this scheme was fetched
    alternatives?: { id: string, name: string }[] // Similar eligible schemes
}

export interface RuleEvaluation {
    ruleName: string
    ruleDescription: string
    userValue: string
    requiredValue: string
    passed: boolean
    type?: 'hard' | 'soft'
}

type AppScreen = 'landing' | 'language' | 'form' | 'results' | 'phishing'

function App() {
    const [currentScreen, setCurrentScreen] = useState<AppScreen>('landing')
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
    const [results, setResults] = useState<SchemeResult[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [language, setLanguage] = useState<string>('en') // Default language
    const [sessionId] = useState(() => {
        // Generate or retrieve session ID on mount (persists for session only)
        let sid = sessionStorage.getItem('app_session_id')
        if (!sid) {
            sid = crypto.randomUUID()
            sessionStorage.setItem('app_session_id', sid)
        }
        return sid
    })
    const [checkCount, setCheckCount] = useState(0)
    const MAX_CHECKS = 5

    const handleStartCheck = () => {
        setCurrentScreen('language')
    }

    const handleLanguageSelect = (lang: string) => {
        setLanguage(lang)
        setCurrentScreen('form')
    }

    const handleFormSubmit = async (profile: UserProfile, _selectedLang: string) => {
        // Use the selected language from state if passed lang differs, or enforce consistency
        // Ideally form should use the App's language state or pass it back.
        // For now, we trust the flow: Language -> Form (uses prop) -> Submit

        const t = TRANSLATIONS[language as Language || 'en']
        // Enforce Rate Limit (Frontend)
        if (checkCount >= MAX_CHECKS) {
            alert(t.errors.limit)
            return
        }

        setUserProfile(profile)
        setIsLoading(true)
        setCurrentScreen('results')
        setCheckCount(prev => prev + 1) // Increment counter

        try {
            const response = await fetch('/api/eligibility/check', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Session-Id': sessionId // Pass session ID to backend
                },
                body: JSON.stringify({ ...profile, language: language }),
            })


            if (!response.ok) {
                if (response.status === 429) {
                    throw new Error(t.errors.limit)
                }
                throw new Error('Failed to check eligibility')
            }

            const data = await response.json()
            setResults(data.schemes)
        } catch (error: any) {
            // console.error('Error checking eligibility:', error) // Keep debug log

            // Handle rate limit specifically
            if (error.message === t.errors.limit || error.message.includes('usage limit')) {
                alert(t.errors.limit)
                return
            }

            // Set demo data for testing when API is not available
            setResults(getDemoResults(profile))
        } finally {
            setIsLoading(false)
        }
    }

    const handleBackToForm = () => {
        setCurrentScreen('form')
    }

    const handleStartOver = () => {
        setCurrentScreen('landing')
        setUserProfile(null)
        setResults([])
        // We reset language to allow re-selection or keep it?
        // Let's keep it simple: restart flow implies restart.
        // But user might want to keep lang. 
        // Logic: 'landing' => 'handleStartCheck' => 'language'. 
        // So they WILL be asked again. This is good for "Start Over".
    }

    return (
        <div className="min-h-screen font-sans">
            {currentScreen === 'landing' && (
                <Landing
                    onStartCheck={handleStartCheck}
                    onOpenPhishing={() => setCurrentScreen('phishing')}
                />
            )}
            {currentScreen === 'language' && (
                <LanguageSelection
                    onSelect={handleLanguageSelect}
                    currentLang={language}
                />
            )}
            {currentScreen === 'form' && (
                <EligibilityForm
                    onSubmit={handleFormSubmit}
                    initialData={userProfile}
                    initialLanguage={language}
                />
            )}
            {currentScreen === 'results' && (
                <ResultsScreen
                    results={results}
                    userProfile={userProfile!}
                    isLoading={isLoading}
                    onBack={handleBackToForm}
                    onStartOver={handleStartOver}
                    language={language}
                    sessionId={sessionId}
                />
            )}
            {currentScreen === 'phishing' && (
                <PhishingChecker onBack={() => setCurrentScreen('landing')} />
            )}
        </div>
    )
}

// Demo results for testing when API is not available
function getDemoResults(profile: UserProfile): SchemeResult[] {
    const schemes: SchemeResult[] = [
        {
            id: '1',
            name: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
            description: 'Direct income support of ₹6,000 per year to small and marginal farmers',
            status: profile.occupation.toLowerCase().includes('farmer') && profile.income <= 200000 ? 'eligible' : 'ineligible',
            officialUrl: 'https://pmkisan.gov.in/',
            rules: [
                {
                    ruleName: 'Occupation',
                    ruleDescription: 'Must be a farmer',
                    userValue: profile.occupation,
                    requiredValue: 'Farmer',
                    passed: profile.occupation.toLowerCase().includes('farmer')
                },
                {
                    ruleName: 'Income Limit',
                    ruleDescription: 'Annual income must be below ₹2,00,000',
                    userValue: `₹${profile.income.toLocaleString('en-IN')}`,
                    requiredValue: '< ₹2,00,000',
                    passed: profile.income <= 200000
                }
            ],
            explanation: profile.occupation.toLowerCase().includes('farmer') && profile.income <= 200000
                ? 'You qualify for PM-KISAN as a farmer with income below the threshold.'
                : 'You do not meet the eligibility criteria for PM-KISAN.',
            isFixable: !profile.occupation.toLowerCase().includes('farmer') ? false : profile.income > 200000,
            fixSuggestion: profile.income > 200000 ? 'Income exceeds the limit. This criterion is based on declared income.' : undefined
        },
        {
            id: '2',
            name: 'Ayushman Bharat (PM-JAY)',
            description: 'Health insurance coverage of ₹5 lakh per family per year for secondary and tertiary care',
            status: profile.income <= 500000 ? 'eligible' : 'ineligible',
            officialUrl: 'https://pmjay.gov.in/',
            rules: [
                {
                    ruleName: 'Income Limit',
                    ruleDescription: 'Annual income must be below ₹5,00,000',
                    userValue: `₹${profile.income.toLocaleString('en-IN')}`,
                    requiredValue: '< ₹5,00,000',
                    passed: profile.income <= 500000
                },
                {
                    ruleName: 'Category',
                    ruleDescription: 'Priority for SC/ST/OBC categories',
                    userValue: profile.category || 'Not specified',
                    requiredValue: 'Any (priority for reserved categories)',
                    passed: true
                }
            ],
            explanation: profile.income <= 500000
                ? 'You qualify for Ayushman Bharat health coverage based on your income.'
                : 'Your income exceeds the eligibility threshold for Ayushman Bharat.',
            isFixable: false
        },
        {
            id: '3',
            name: 'National Scholarship Portal (NSP)',
            description: 'Various scholarships for students from economically weaker sections',
            status: profile.age >= 16 && profile.age <= 35 && profile.income <= 250000 ? 'eligible' : 'ineligible',
            officialUrl: 'https://scholarships.gov.in/',
            rules: [
                {
                    ruleName: 'Age Requirement',
                    ruleDescription: 'Age must be between 16 and 35 years',
                    userValue: `${profile.age} years`,
                    requiredValue: '16-35 years',
                    passed: profile.age >= 16 && profile.age <= 35
                },
                {
                    ruleName: 'Income Limit',
                    ruleDescription: 'Annual family income must be below ₹2,50,000',
                    userValue: `₹${profile.income.toLocaleString('en-IN')}`,
                    requiredValue: '< ₹2,50,000',
                    passed: profile.income <= 250000
                }
            ],
            explanation: profile.age >= 16 && profile.age <= 35 && profile.income <= 250000
                ? 'You may be eligible for scholarships under NSP based on your age and income.'
                : 'You do not meet the age or income criteria for NSP scholarships.',
            isFixable: profile.age < 16 || profile.age > 35 ? false : profile.income > 250000
        },
        {
            id: '4',
            name: 'Pradhan Mantri Awas Yojana (PMAY)',
            description: 'Affordable housing scheme with interest subsidy on home loans',
            status: profile.income <= 1800000 ? 'eligible' : 'ineligible',
            officialUrl: 'https://pmaymis.gov.in/',
            rules: [
                {
                    ruleName: 'Income Category',
                    ruleDescription: 'EWS/LIG/MIG categories based on income',
                    userValue: `₹${profile.income.toLocaleString('en-IN')}`,
                    requiredValue: '≤ ₹18,00,000 (MIG-II)',
                    passed: profile.income <= 1800000
                }
            ],
            explanation: profile.income <= 1800000
                ? `You qualify for PMAY under ${profile.income <= 300000 ? 'EWS' : profile.income <= 600000 ? 'LIG' : profile.income <= 1200000 ? 'MIG-I' : 'MIG-II'} category.`
                : 'Your income exceeds the maximum limit for PMAY benefits.',
            isFixable: false
        }
    ]

    return schemes
}

export default App
