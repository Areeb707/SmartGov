import { ArrowLeft, RefreshCw, Check, AlertCircle, Shield, Info, Sliders, X, Play, Volume2, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react'
import type { SchemeResult, UserProfile } from '../App'
import { TRANSLATIONS, type Language } from '../utils/translations'
import TTSPlayer from './TTSPlayer'
import { useState, useEffect } from 'react'

interface ResultsScreenProps {
    results: SchemeResult[]
    userProfile: UserProfile
    isLoading: boolean
    onBack: () => void
    onStartOver: () => void
    language: string
    sessionId: string
}

function getExampleExplanation(scheme: SchemeResult, language: string, t: any): string {
    const lang = language as Language || 'en';
    const schemeKeys = TRANSLATIONS[lang].schemes[scheme.id as keyof typeof TRANSLATIONS['en']['schemes']];
    if (!schemeKeys) return scheme.status === 'eligible' ? t.results.eligible : t.results.ineligible;
    return scheme.status === 'eligible' ? schemeKeys.eligible : schemeKeys.ineligible;
}

export default function ResultsScreen({
    results: initialResults,
    userProfile: initialProfile,
    isLoading: initialLoading,
    onBack,
    onStartOver,
    language,
    sessionId
}: ResultsScreenProps) {
    const t = TRANSLATIONS[language as Language || 'en']

    const [simulatedProfile, setSimulatedProfile] = useState<UserProfile>(initialProfile)
    const [displayResults, setDisplayResults] = useState<SchemeResult[]>(initialResults)
    const [isSimulating, setIsSimulating] = useState(false)
    const [isSimLoading, setIsSimLoading] = useState(false)
    const [showSimPanel, setShowSimPanel] = useState(false)

    useEffect(() => {
        if (!isSimulating) {
            setDisplayResults(initialResults)
            setSimulatedProfile(initialProfile)
        }
    }, [initialResults, initialProfile, isSimulating])

    const handleSimulation = async () => {
        setIsSimLoading(true)
        setIsSimulating(true)
        try {
            const response = await fetch('/api/eligibility/check', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Session-Id': sessionId,
                    'X-Simulation': 'true'
                },
                body: JSON.stringify({ ...simulatedProfile, language }),
            })
            if (!response.ok) throw new Error('Simulation failed')
            const data = await response.json()
            setDisplayResults(data.schemes)
            setShowSimPanel(false)
        } catch (error) {
            console.error('Simulation error:', error)
            // Fallback: re-evaluate with local demo data if API fails
            alert(t.errors?.general || 'Simulation failed. Please try again.')
        } finally {
            setIsSimLoading(false)
        }
    }

    const handleResetSimulation = () => {
        setIsSimulating(false)
        setSimulatedProfile(initialProfile)
        setDisplayResults(initialResults)
        setShowSimPanel(false)
    }

    if (initialLoading) {
        return (
            <div style={{ background: 'var(--bg-body)', minHeight: '100vh', position: 'relative' }}>
                <div className="bg-mesh"></div>
                <div className="noise-overlay"></div>
                <div className="relative z-10 flex flex-col items-center justify-center" style={{ minHeight: '100vh' }}>
                    <div style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: 'var(--radius-xl)',
                        background: 'rgba(99, 102, 241, 0.12)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '1.5rem',
                    }}>
                        <RefreshCw className="w-8 h-8 animate-spin" style={{ color: 'var(--primary-400)' }} />
                    </div>
                    <h3 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>{t.buttons.loading}</h3>
                    <p className="mt-2" style={{ color: 'var(--text-muted)' }}>{t.results.analyzing}</p>
                </div>
            </div>
        )
    }

    const total = displayResults.length;
    const eligibleCount = displayResults.filter(s => s.status === 'eligible').length;
    const fixableCount = displayResults.filter(s => s.status === 'ineligible' && s.isFixable).length;
    const ineligibleCount = total - eligibleCount - fixableCount;

    return (
        <div style={{ background: 'var(--bg-body)', minHeight: '100vh', position: 'relative' }}>
            <div className="bg-mesh"></div>
            <div className="noise-overlay"></div>

            <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 pb-24">
                {/* Top Navigation Bar */}
                <div className="flex items-center justify-between mb-8 sticky top-0 z-10 py-4" style={{
                    borderBottom: '1px solid var(--border)',
                    background: 'rgba(11, 15, 26, 0.9)',
                    backdropFilter: 'blur(12px)',
                    margin: '0 -1rem',
                    padding: '1rem',
                    borderRadius: '0 0 var(--radius-md) var(--radius-md)',
                }}>
                    <button
                        onClick={onBack}
                        className="group flex items-center gap-1 text-sm font-medium"
                        style={{ color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.2s' }}
                        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary-400)'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                    >
                        <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                        {t.buttons.back}
                    </button>

                    <button
                        onClick={() => setShowSimPanel(!showSimPanel)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.375rem 1rem',
                            borderRadius: '999px',
                            fontSize: '0.85rem',
                            fontWeight: 500,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            border: isSimulating
                                ? '1px solid rgba(139, 92, 246, 0.3)'
                                : '1px solid var(--border)',
                            background: isSimulating
                                ? 'rgba(139, 92, 246, 0.12)'
                                : 'var(--glass-bg)',
                            color: isSimulating
                                ? '#A78BFA'
                                : 'var(--text-secondary)',
                        }}
                    >
                        <Sliders className="w-4 h-4" />
                        {isSimulating ? t.simulation.badge : t.buttons.simulate}
                    </button>
                </div>

                {/* Simulation Panel */}
                {showSimPanel && (
                    <div className="mb-8 sim-panel animate-slide-down">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="font-bold" style={{ color: '#E9D5FF' }}>{t.simulation.title}</h3>
                                <p className="text-sm" style={{ color: '#A78BFA' }}>{t.simulation.desc}</p>
                            </div>
                            <button onClick={() => setShowSimPanel(false)} style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-xs font-semibold uppercase mb-1" style={{ color: 'var(--text-muted)' }}>{t.labels.age}</label>
                                <input
                                    type="number"
                                    value={simulatedProfile.age}
                                    onChange={(e) => setSimulatedProfile({ ...simulatedProfile, age: Number(e.target.value) })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold uppercase mb-1" style={{ color: 'var(--text-muted)' }}>{t.labels.income}</label>
                                <input
                                    type="number"
                                    value={simulatedProfile.income}
                                    onChange={(e) => setSimulatedProfile({ ...simulatedProfile, income: Number(e.target.value) })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold uppercase mb-1" style={{ color: 'var(--text-muted)' }}>{t.labels.state || 'State'}</label>
                                <select
                                    value={simulatedProfile.state}
                                    onChange={(e) => setSimulatedProfile({ ...simulatedProfile, state: e.target.value })}
                                >
                                    {['Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
                                      'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
                                      'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
                                      'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
                                      'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
                                      'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
                                      'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Puducherry'
                                    ].map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold uppercase mb-1" style={{ color: 'var(--text-muted)' }}>{t.labels.occupation}</label>
                                <select
                                    value={simulatedProfile.occupation}
                                    onChange={(e) => setSimulatedProfile({ ...simulatedProfile, occupation: e.target.value })}
                                >
                                    {['Farmer', 'Agricultural Laborer', 'Self-Employed', 'Private Sector Employee',
                                      'Government Employee', 'Daily Wage Worker', 'Small Business Owner',
                                      'Student', 'Homemaker', 'Unemployed', 'Retired', 'Other'
                                    ].map(occ => <option key={occ} value={occ}>{occ}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3">
                            {isSimulating && (
                                <button onClick={handleResetSimulation} style={{
                                    padding: '0.5rem 1rem',
                                    fontSize: '0.85rem',
                                    color: 'var(--text-secondary)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontWeight: 500,
                                }}>
                                    {t.buttons.reset}
                                </button>
                            )}
                            <button
                                onClick={handleSimulation}
                                disabled={isSimLoading}
                                className="sim-run-btn"
                            >
                                {isSimLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
                                {t.buttons.simulate}
                            </button>
                        </div>
                    </div>
                )}

                {/* Summary Statistics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                    <div className="stat-card stat-blue">
                        <div className="text-3xl font-bold" style={{ color: 'var(--primary-400)' }}>{total}</div>
                        <div className="text-xs font-medium uppercase mt-1" style={{ color: 'var(--text-muted)' }}>{t.summary.total}</div>
                    </div>
                    <div className="stat-card stat-green">
                        <div className="text-3xl font-bold" style={{ color: 'var(--success-400)' }}>{eligibleCount}</div>
                        <div className="text-xs font-medium uppercase mt-1" style={{ color: 'var(--text-muted)' }}>{t.summary.eligible}</div>
                    </div>
                    <div className="stat-card stat-orange">
                        <div className="text-3xl font-bold" style={{ color: '#FBBF24' }}>{ineligibleCount}</div>
                        <div className="text-xs font-medium uppercase mt-1" style={{ color: 'var(--text-muted)' }}>{t.summary.noChance}</div>
                    </div>
                    <div className="stat-card stat-purple">
                        <div className="text-3xl font-bold" style={{ color: '#A78BFA' }}>₹{Math.round(simulatedProfile.income / 1000)}K</div>
                        <div className="text-xs font-medium uppercase mt-1" style={{ color: 'var(--text-muted)' }}>{t.labels.income}</div>
                    </div>
                </div>

                {/* Results Grid */}
                <div className="grid gap-6">
                    {displayResults.length === 0 ? (
                        <div className="text-center py-10" style={{
                            background: 'var(--glass-bg)',
                            borderRadius: 'var(--radius-xl)',
                            border: '1px dashed var(--border)',
                        }}>
                            <p style={{ color: 'var(--text-muted)' }}>{t.results.empty}</p>
                        </div>
                    ) : (
                        displayResults.map((scheme, index) => (
                            <SchemeCard
                                key={`${scheme.id}-${isSimulating ? 'sim' : 'real'}`}
                                scheme={scheme}
                                delay={index * 100}
                                isSimulating={scheme.isFixable}
                                language={language}
                                sessionId={sessionId}
                                userProfile={simulatedProfile}
                            />
                        ))
                    )}
                </div>

                {/* Bottom Action */}
                <div className="mt-12 text-center">
                    <button
                        onClick={onStartOver}
                        style={{
                            padding: '0.875rem 2rem',
                            background: 'var(--glass-bg)',
                            color: 'var(--text-primary)',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-lg)',
                            cursor: 'pointer',
                            fontWeight: 600,
                            transition: 'all 0.3s ease',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'var(--glass-hover)';
                            e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'var(--glass-bg)';
                            e.currentTarget.style.boxShadow = 'none';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                    >
                        <RefreshCw className="w-5 h-5" />
                        {t.buttons.startOver}
                    </button>
                </div>
            </div>
        </div>
    )
}

function SchemeCard({ scheme, delay, isSimulating = false, language, sessionId, userProfile }: {
    scheme: SchemeResult;
    delay: number;
    isSimulating?: boolean;
    language: string;
    sessionId: string;
    userProfile: UserProfile;
}) {
    const [isExpanded, setIsExpanded] = useState(false)
    const [aiExplanation, setAiExplanation] = useState<string | null>(null)
    const [loadingAI, setLoadingAI] = useState(false)
    const t = TRANSLATIONS[language as Language || 'en']

    const isEligible = scheme.status === 'eligible'

    useEffect(() => {
        if (isExpanded && !aiExplanation && !loadingAI) {
            setLoadingAI(true)
            fetch('/api/explain/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-Session-Id': sessionId },
                body: JSON.stringify({
                    schemeName: scheme.name,
                    status: scheme.status,
                    language,
                    failedRules: scheme.rules.filter(r => !r.passed),
                    profile: userProfile
                })
            })
                .then(res => res.json())
                .then(data => setAiExplanation(data.explanation || getExampleExplanation(scheme, language, t)))
                .catch(() => setAiExplanation(getExampleExplanation(scheme, language, t)))
                .finally(() => setLoadingAI(false))
        }
    }, [isExpanded, scheme, language, sessionId, userProfile])

    const displayText = aiExplanation || scheme.explanation || getExampleExplanation(scheme, language, t);

    return (
        <div
            className={`scheme-card ${isEligible ? 'eligible' : 'ineligible'} animate-fade-in-up`}
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1">
                    <div className="flex items-start justify-between">
                        <div>
                            {/* Simulation Badge */}
                            {isSimulating && (
                                <span style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    padding: '0.125rem 0.625rem',
                                    borderRadius: '999px',
                                    fontSize: '0.7rem',
                                    fontWeight: 600,
                                    background: 'rgba(139, 92, 246, 0.15)',
                                    color: '#C4B5FD',
                                    border: '1px solid rgba(139, 92, 246, 0.2)',
                                    marginBottom: '0.5rem',
                                    gap: '0.25rem',
                                }}>
                                    <Sliders className="w-3 h-3" />
                                    {t.simulation.badge}
                                </span>
                            )}
                            <h3 className="text-xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{scheme.name}</h3>
                            <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>{scheme.description}</p>
                        </div>
                        <div style={{
                            flexShrink: 0,
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: isEligible
                                ? 'rgba(16, 185, 129, 0.12)'
                                : 'rgba(245, 158, 11, 0.12)',
                        }}>
                            {isEligible
                                ? <Check className="w-6 h-6" style={{ color: 'var(--success-400)' }} />
                                : <Info className="w-6 h-6" style={{ color: '#FBBF24' }} />
                            }
                        </div>
                    </div>

                    {/* Status Tags */}
                    <div className="flex flex-wrap gap-2 mt-2">
                        {isEligible ? (
                            <span style={{
                                padding: '0.25rem 0.75rem',
                                borderRadius: '999px',
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                background: 'rgba(16, 185, 129, 0.12)',
                                color: 'var(--success-400)',
                                border: '1px solid rgba(16, 185, 129, 0.2)',
                            }}>
                                {t.results.eligible}
                            </span>
                        ) : (
                            isSimulating ? (
                                <span style={{
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '999px',
                                    fontSize: '0.8rem',
                                    fontWeight: 600,
                                    background: 'rgba(139, 92, 246, 0.12)',
                                    color: '#C4B5FD',
                                    border: '1px solid rgba(139, 92, 246, 0.2)',
                                }}>
                                    {t.results.fixable}
                                </span>
                            ) : (
                                <span style={{
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '999px',
                                    fontSize: '0.8rem',
                                    fontWeight: 600,
                                    background: 'rgba(245, 158, 11, 0.12)',
                                    color: '#FBBF24',
                                    border: '1px solid rgba(245, 158, 11, 0.2)',
                                }}>
                                    {t.results.ineligible}
                                </span>
                            )
                        )}
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            style={{
                                color: 'var(--primary-400)',
                                fontSize: '0.85rem',
                                fontWeight: 500,
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                                marginLeft: 'auto',
                                transition: 'color 0.2s',
                            }}
                        >
                            {isExpanded ? t.buttons.learn : t.results.why}
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                    </div>
                </div>
            </div>

            {isExpanded && (
                <div className="mt-6 pt-6 animate-slide-down" style={{ borderTop: '1px solid var(--border)' }}>
                    {/* Rules */}
                    <div className="mb-4 space-y-3">
                        <h4 className="font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                            <Shield className="w-4 h-4" style={{ color: 'var(--primary-400)' }} />
                            {t.results.ruleBreakdown}
                        </h4>
                        {scheme.rules.map((rule, idx) => {
                            let ruleLabel = rule.ruleName;
                            const rName = rule.ruleName.toLowerCase();
                            if (rName.includes('income')) ruleLabel = t.results.officialLimit;
                            else if (rName.includes('age')) ruleLabel = t.rules.ageLimit;
                            else if (rName.includes('occupation')) ruleLabel = t.results.occCat;
                            else if (rName.includes('category')) ruleLabel = t.results.occCat;
                            else if (rName.includes('background')) ruleLabel = t.results.occCat;

                            return (
                                <div key={idx} style={{
                                    padding: '0.75rem',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid',
                                    borderColor: rule.passed
                                        ? 'rgba(16, 185, 129, 0.15)'
                                        : 'rgba(244, 63, 94, 0.15)',
                                    background: rule.passed
                                        ? 'rgba(16, 185, 129, 0.04)'
                                        : 'rgba(244, 63, 94, 0.04)',
                                }}>
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{ruleLabel}</span>
                                        {rule.passed
                                            ? <Check className="w-4 h-4" style={{ color: 'var(--success-400)' }} />
                                            : <AlertCircle className="w-4 h-4" style={{ color: 'var(--error-500)' }} />
                                        }
                                    </div>
                                    {rName.includes('income') && !rule.passed && (
                                        <p className="text-xs mt-1 mb-1" style={{ color: 'var(--error-500)' }}>{t.results.limitDesc}</p>
                                    )}
                                    {(rName.includes('occupation') || rName.includes('background')) && (
                                        <p className="text-xs mt-1 mb-1" style={{ color: 'var(--text-muted)' }}>{t.results.occDesc}</p>
                                    )}

                                    <div className="mt-2 text-sm flex justify-between" style={{ color: 'var(--text-secondary)' }}>
                                        <span>{t.results.required} <strong style={{ color: 'var(--text-primary)' }}>{rule.requiredValue}</strong></span>
                                        <span>{t.results.yourValue} <strong style={{ color: 'var(--text-primary)' }}>{rule.userValue}</strong></span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* AI Explanation Box */}
                    <div className="ai-explanation-box mb-4">
                        <div className="flex gap-2">
                            <div className="mt-0\.5"><Volume2 className="w-4 h-4" style={{ color: 'var(--primary-400)', opacity: 0.6 }} /></div>
                            <div>
                                {loadingAI ? (
                                    <div className="flex items-center gap-2 italic" style={{ color: 'var(--text-muted)' }}>
                                        <div style={{
                                            width: '8px',
                                            height: '8px',
                                            background: 'var(--primary-400)',
                                            borderRadius: '50%',
                                            animation: 'bounce 1s infinite',
                                        }}></div>
                                        {t.buttons.loading}
                                    </div>
                                ) : (
                                    <p className="leading-relaxed font-medium" style={{ color: 'var(--text-primary)' }}>
                                        {displayText}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* TTS Player */}
                    {!loadingAI && (
                        <TTSPlayer
                            text={displayText}
                            schemeId={scheme.id}
                            language={language}
                            sessionId={sessionId}
                        />
                    )}

                    <div className="flex justify-end mt-4">
                        <a
                            href={scheme.officialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                color: 'var(--primary-400)',
                                fontSize: '0.85rem',
                                fontWeight: 500,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.375rem',
                                textDecoration: 'none',
                                transition: 'color 0.2s',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.color = 'var(--accent-400)';
                                e.currentTarget.style.textDecoration = 'underline';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.color = 'var(--primary-400)';
                                e.currentTarget.style.textDecoration = 'none';
                            }}
                        >
                            {t.buttons.visit}
                            <ExternalLink className="w-3 h-3" />
                        </a>
                    </div>
                </div>
            )}
        </div>
    )
}
