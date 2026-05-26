import { useState, useEffect } from 'react'
import { Shield, Search, AlertTriangle, CheckCircle, XCircle, Loader2, ArrowLeft, ShieldAlert, ShieldCheck, Activity, Globe, Info } from 'lucide-react'

interface ScanResult {
    success: boolean
    url: string
    verdict: 'safe' | 'suspicious' | 'dangerous' | 'unknown'
    message: string
    explanation?: string
    warnings?: string[]
    riskLevel: number
    stats: {
        malicious: number
        suspicious: number
        harmless: number
        undetected: number
        totalEngines: number
    }
    details: Array<{
        engine: string
        category: string
        result: string
    }>
    mode?: string
}

interface PhishingCheckerProps {
    onBack: () => void
}

export default function PhishingChecker({ onBack }: PhishingCheckerProps) {
    const [url, setUrl] = useState('')
    const [isScanning, setIsScanning] = useState(false)
    const [result, setResult] = useState<ScanResult | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [serviceMode, setServiceMode] = useState<'live' | 'simulation'>('simulation')

    // Check service status on mount
    useEffect(() => {
        fetch('/api/phishing/status')
            .then(res => res.json())
            .then(data => setServiceMode(data.mode || 'simulation'))
            .catch(() => setServiceMode('simulation'))
    }, [])

    const handleScan = async () => {
        if (!url.trim()) return

        setIsScanning(true)
        setError(null)
        setResult(null)

        try {
            const response = await fetch('/api/phishing/check', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: url.trim() })
            })

            const data = await response.json()

            if (!response.ok || !data.success) {
                setError(data.message || data.error || 'Scan failed')
                return
            }

            setResult(data)
        } catch (err) {
            setError('Failed to connect to the scanning service. Make sure the backend is running.')
        } finally {
            setIsScanning(false)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !isScanning) handleScan()
    }

    const getVerdictConfig = (verdict: string) => {
        switch (verdict) {
            case 'dangerous':
                return {
                    color: '#F43F5E',
                    bgColor: 'rgba(244, 63, 94, 0.08)',
                    borderColor: 'rgba(244, 63, 94, 0.2)',
                    icon: <XCircle className="w-8 h-8" style={{ color: '#F43F5E' }} />,
                    label: 'DANGEROUS',
                    ringColor: 'rgba(244, 63, 94, 0.3)',
                }
            case 'suspicious':
                return {
                    color: '#FBBF24',
                    bgColor: 'rgba(245, 158, 11, 0.08)',
                    borderColor: 'rgba(245, 158, 11, 0.2)',
                    icon: <AlertTriangle className="w-8 h-8" style={{ color: '#FBBF24' }} />,
                    label: 'SUSPICIOUS',
                    ringColor: 'rgba(245, 158, 11, 0.3)',
                }
            case 'safe':
                return {
                    color: '#34D399',
                    bgColor: 'rgba(16, 185, 129, 0.08)',
                    borderColor: 'rgba(16, 185, 129, 0.2)',
                    icon: <CheckCircle className="w-8 h-8" style={{ color: '#34D399' }} />,
                    label: 'SAFE',
                    ringColor: 'rgba(16, 185, 129, 0.3)',
                }
            default:
                return {
                    color: 'var(--text-muted)',
                    bgColor: 'var(--glass-bg)',
                    borderColor: 'var(--border)',
                    icon: <Info className="w-8 h-8" style={{ color: 'var(--text-muted)' }} />,
                    label: 'UNKNOWN',
                    ringColor: 'var(--border)',
                }
        }
    }

    return (
        <div style={{ background: 'var(--bg-body)', minHeight: '100vh', position: 'relative' }}>
            <div className="bg-mesh"></div>
            <div className="noise-overlay"></div>

            <div className="relative z-10 max-w-2xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={onBack}
                        style={{
                            background: 'var(--glass-bg)',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-md)',
                            padding: '0.5rem',
                            cursor: 'pointer',
                            color: 'var(--text-secondary)',
                            transition: 'all 0.2s',
                            display: 'flex',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.color = 'var(--primary-400)';
                            e.currentTarget.style.borderColor = 'var(--border-hover)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.color = 'var(--text-secondary)';
                            e.currentTarget.style.borderColor = 'var(--border)';
                        }}
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold gradient-text">Verify Government Scheme Link</h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                            Powered by VirusTotal — Scan any URL for threats and authenticity
                        </p>
                    </div>
                </div>

                {/* Service Mode Indicator */}
                <div className="mb-6 animate-fade-in-up" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    background: serviceMode === 'live' ? 'rgba(16, 185, 129, 0.06)' : 'rgba(245, 158, 11, 0.06)',
                    border: `1px solid ${serviceMode === 'live' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)'}`,
                }}>
                    <Activity className="w-4 h-4" style={{ color: serviceMode === 'live' ? '#34D399' : '#FBBF24' }} />
                    <span style={{ fontSize: '0.8rem', color: serviceMode === 'live' ? '#34D399' : '#FBBF24', fontWeight: 500 }}>
                        {serviceMode === 'live' ? 'Live Scanning (VirusTotal Connected)' : 'Simulation Mode (Add API key for live scans)'}
                    </span>
                </div>

                {/* URL Input Card */}
                <div className="card p-6 mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                    <div className="flex items-center gap-3 mb-4">
                        <div style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: 'var(--radius-md)',
                            background: 'rgba(99, 102, 241, 0.12)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <Globe className="w-5 h-5" style={{ color: 'var(--primary-400)' }} />
                        </div>
                        <div>
                            <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Enter URL to Scan</h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                Paste any suspicious link to check if it's safe
                            </p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <input
                            type="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Paste scheme link..."
                            className="form-input"
                            style={{ flex: 1 }}
                            disabled={isScanning}
                        />
                        <button
                            onClick={handleScan}
                            disabled={isScanning || !url.trim()}
                            style={{
                                padding: '0.75rem 1.5rem',
                                borderRadius: 'var(--radius-md)',
                                background: isScanning || !url.trim()
                                    ? 'var(--glass-bg)'
                                    : 'linear-gradient(135deg, var(--primary-500), var(--accent-500))',
                                color: 'white',
                                border: 'none',
                                cursor: isScanning || !url.trim() ? 'not-allowed' : 'pointer',
                                fontWeight: 600,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                transition: 'all 0.3s ease',
                                boxShadow: isScanning || !url.trim() ? 'none' : '0 4px 16px rgba(99, 102, 241, 0.3)',
                                opacity: isScanning || !url.trim() ? 0.5 : 1,
                                flexShrink: 0,
                            }}
                        >
                            {isScanning ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Search className="w-5 h-5" />
                            )}
                            {isScanning ? 'Scanning...' : 'Scan'}
                        </button>
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-6 animate-fade-in-up" style={{
                        padding: '1rem',
                        borderRadius: 'var(--radius-md)',
                        background: 'rgba(244, 63, 94, 0.06)',
                        border: '1px solid rgba(244, 63, 94, 0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                    }}>
                        <AlertTriangle className="w-5 h-5" style={{ color: '#F43F5E', flexShrink: 0 }} />
                        <span style={{ color: '#F43F5E', fontSize: '0.9rem' }}>{error}</span>
                    </div>
                )}

                {/* Scanning Animation */}
                {isScanning && (
                    <div className="card p-8 text-center animate-fade-in-up">
                        <div style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            background: 'rgba(99, 102, 241, 0.08)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 1.5rem',
                            animation: 'pulse 2s ease-in-out infinite',
                        }}>
                            <ShieldAlert className="w-10 h-10 animate-spin" style={{ color: 'var(--primary-400)', animationDuration: '3s' }} />
                        </div>
                        <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                            Scanning URL...
                        </h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                            Checking against 70+ security engines
                        </p>
                    </div>
                )}

                {/* Results */}
                {result && !isScanning && (
                    <div className="animate-fade-in-up space-y-4">
                        {/* Verdict Card */}
                        {(() => {
                            const config = getVerdictConfig(result.verdict);
                            return (
                                <div className="card p-6" style={{
                                    borderColor: config.borderColor,
                                    borderWidth: '1px',
                                    borderStyle: 'solid',
                                }}>
                                    <div className="flex items-start gap-4">
                                        <div style={{
                                            width: '64px',
                                            height: '64px',
                                            borderRadius: '50%',
                                            background: config.bgColor,
                                            border: `2px solid ${config.borderColor}`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0,
                                            boxShadow: `0 0 20px ${config.ringColor}`,
                                        }}>
                                            {config.icon}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span style={{
                                                    fontSize: '0.7rem',
                                                    fontWeight: 700,
                                                    letterSpacing: '0.1em',
                                                    color: config.color,
                                                    padding: '0.125rem 0.5rem',
                                                    borderRadius: '999px',
                                                    background: config.bgColor,
                                                    border: `1px solid ${config.borderColor}`,
                                                }}>
                                                    {config.label}
                                                </span>
                                                {result.mode === 'simulation' && (
                                                    <span style={{
                                                        fontSize: '0.65rem',
                                                        fontWeight: 600,
                                                        color: '#FBBF24',
                                                        padding: '0.125rem 0.5rem',
                                                        borderRadius: '999px',
                                                        background: 'rgba(245, 158, 11, 0.08)',
                                                        border: '1px solid rgba(245, 158, 11, 0.15)',
                                                    }}>
                                                        SIMULATED
                                                    </span>
                                                )}
                                            </div>
                                            <p className="font-medium mb-2" style={{ color: 'var(--text-primary)', fontSize: '1rem' }}>
                                                {result.message}
                                            </p>
                                            {result.explanation && (
                                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem', lineHeight: 1.5 }}>
                                                    {result.explanation}
                                                </p>
                                            )}
                                            <p style={{
                                                color: 'var(--text-muted)',
                                                fontSize: '0.8rem',
                                                wordBreak: 'break-all',
                                            }}>
                                                {result.url}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Risk Meter */}
                                    <div className="mt-4" style={{
                                        background: 'var(--glass-bg)',
                                        borderRadius: 'var(--radius-sm)',
                                        padding: '0.75rem',
                                    }}>
                                        <div className="flex items-center justify-between mb-2">
                                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                                                Risk Level
                                            </span>
                                            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: config.color }}>
                                                {result.riskLevel}%
                                            </span>
                                        </div>
                                        <div style={{
                                            height: '8px',
                                            borderRadius: '4px',
                                            background: 'rgba(255, 255, 255, 0.05)',
                                            overflow: 'hidden',
                                        }}>
                                            <div style={{
                                                height: '100%',
                                                width: `${Math.max(result.riskLevel, 2)}%`,
                                                borderRadius: '4px',
                                                background: result.riskLevel > 60
                                                    ? 'linear-gradient(90deg, #F59E0B, #F43F5E)'
                                                    : result.riskLevel > 20
                                                        ? 'linear-gradient(90deg, #FBBF24, #F59E0B)'
                                                        : 'linear-gradient(90deg, #34D399, #22D3EE)',
                                                transition: 'width 1s ease-out',
                                            }} />
                                        </div>
                                    </div>
                                </div>
                            );
                        })()}

                        {/* Warnings */}
                        {result.warnings && result.warnings.length > 0 && (
                            <div className="card p-5" style={{ 
                                background: 'rgba(245, 158, 11, 0.08)',
                                backdropFilter: 'blur(10px)',
                                borderColor: 'rgba(245, 158, 11, 0.2)', 
                                borderWidth: '1px', 
                                borderStyle: 'solid',
                                width: '100%',
                                boxSizing: 'border-box',
                                borderRadius: 'var(--radius-xl)'
                            }}>
                                <h3 className="font-semibold mb-3 flex items-center gap-2" style={{ color: '#FCD34D', fontSize: '1.05rem', letterSpacing: '0.025em' }}>
                                    <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                                    Safety Warnings
                                </h3>
                                <ul className="space-y-2 mt-1">
                                    {result.warnings.map((warning, idx) => (
                                        <li key={idx} className="flex gap-3 text-sm" style={{ alignItems: 'flex-start' }}>
                                            <div style={{
                                                width: '6px',
                                                height: '6px',
                                                borderRadius: '50%',
                                                backgroundColor: '#FCD34D',
                                                marginTop: '8px',
                                                flexShrink: 0,
                                                boxShadow: '0 0 8px rgba(252, 211, 77, 0.6)'
                                            }} />
                                            <span style={{ 
                                                flex: 1, 
                                                wordBreak: 'break-word', 
                                                overflowWrap: 'anywhere', 
                                                whiteSpace: 'normal', 
                                                lineHeight: '1.5',
                                                minWidth: 0,
                                                color: 'var(--text-primary)'
                                            }}>
                                                {warning}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Engine Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <div className="stat-card stat-orange" style={{ padding: '1rem' }}>
                                <div className="text-2xl font-bold" style={{ color: '#F43F5E' }}>{result.stats.malicious}</div>
                                <div className="text-xs uppercase mt-1" style={{ color: 'var(--text-muted)' }}>Malicious</div>
                            </div>
                            <div className="stat-card stat-purple" style={{ padding: '1rem' }}>
                                <div className="text-2xl font-bold" style={{ color: '#FBBF24' }}>{result.stats.suspicious}</div>
                                <div className="text-xs uppercase mt-1" style={{ color: 'var(--text-muted)' }}>Suspicious</div>
                            </div>
                            <div className="stat-card stat-green" style={{ padding: '1rem' }}>
                                <div className="text-2xl font-bold" style={{ color: '#34D399' }}>{result.stats.harmless}</div>
                                <div className="text-xs uppercase mt-1" style={{ color: 'var(--text-muted)' }}>Harmless</div>
                            </div>
                            <div className="stat-card stat-blue" style={{ padding: '1rem' }}>
                                <div className="text-2xl font-bold" style={{ color: 'var(--text-muted)' }}>{result.stats.undetected}</div>
                                <div className="text-xs uppercase mt-1" style={{ color: 'var(--text-muted)' }}>Undetected</div>
                            </div>
                        </div>

                        {/* Flagging Engine Details */}
                        {result.details.length > 0 && (
                            <div className="card p-6">
                                <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                                    <ShieldAlert className="w-4 h-4" style={{ color: '#F43F5E' }} />
                                    Flagged by Security Engines
                                </h3>
                                <div className="space-y-3">
                                    {result.details.map((detail, idx) => (
                                        <div key={idx} style={{
                                            padding: '0.75rem',
                                            borderRadius: 'var(--radius-sm)',
                                            border: '1px solid',
                                            borderColor: detail.category === 'malicious' || detail.category === 'phishing'
                                                ? 'rgba(244, 63, 94, 0.15)'
                                                : 'rgba(245, 158, 11, 0.15)',
                                            background: detail.category === 'malicious' || detail.category === 'phishing'
                                                ? 'rgba(244, 63, 94, 0.04)'
                                                : 'rgba(245, 158, 11, 0.04)',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}>
                                            <div>
                                                <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                                                    {detail.engine}
                                                </span>
                                            </div>
                                            <span style={{
                                                fontSize: '0.75rem',
                                                fontWeight: 600,
                                                padding: '0.125rem 0.5rem',
                                                borderRadius: '999px',
                                                background: detail.category === 'malicious' || detail.category === 'phishing'
                                                    ? 'rgba(244, 63, 94, 0.12)'
                                                    : 'rgba(245, 158, 11, 0.12)',
                                                color: detail.category === 'malicious' || detail.category === 'phishing'
                                                    ? '#F43F5E'
                                                    : '#FBBF24',
                                            }}>
                                                {detail.result}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Safe URL - positive reinforcement */}
                        {result.verdict === 'safe' && (
                            <div className="card p-6 text-center">
                                <ShieldCheck className="w-12 h-12 mx-auto mb-3" style={{ color: '#34D399' }} />
                                <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                                    No threats detected
                                </h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                    This URL was analyzed by {result.stats.totalEngines || 70} security engines
                                    and no threats were found.
                                </p>
                            </div>
                        )}

                        {/* Scan Another */}
                        <div className="text-center pt-2">
                            <button
                                onClick={() => { setResult(null); setUrl(''); setError(null); }}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    borderRadius: 'var(--radius-md)',
                                    background: 'var(--glass-bg)',
                                    color: 'var(--primary-400)',
                                    border: '1px solid var(--border)',
                                    cursor: 'pointer',
                                    fontWeight: 600,
                                    transition: 'all 0.2s',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'var(--glass-hover)';
                                    e.currentTarget.style.borderColor = 'var(--border-hover)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'var(--glass-bg)';
                                    e.currentTarget.style.borderColor = 'var(--border)';
                                }}
                            >
                                <Search className="w-4 h-4" />
                                Scan Another URL
                            </button>
                        </div>
                    </div>
                )}

                {/* Tips / Help (when no results) */}
                {!result && !isScanning && (
                    <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                            🛡️ Tips to identify phishing URLs
                        </h3>
                        <div className="space-y-3">
                            {[
                                { title: 'Check the domain carefully', desc: 'Phishing sites often misspell legitimate domains (e.g., g00gle.com)' },
                                { title: 'Look for HTTPS', desc: 'Legitimate sites use HTTPS, but phishing sites sometimes do too' },
                                { title: 'Beware of URL shorteners', desc: 'Short URLs (bit.ly, tinyurl) can hide malicious destinations' },
                                { title: 'Verify government portals', desc: 'Official Indian gov sites end in .gov.in or .nic.in' },
                            ].map((tip, idx) => (
                                <div key={idx} className="card p-4" style={{
                                    display: 'flex',
                                    gap: '0.75rem',
                                    alignItems: 'flex-start',
                                }}>
                                    <Shield className="w-4 h-4 mt-0.5" style={{ color: 'var(--primary-400)', flexShrink: 0 }} />
                                    <div>
                                        <span className="font-medium" style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                                            {tip.title}
                                        </span>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.125rem' }}>
                                            {tip.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
