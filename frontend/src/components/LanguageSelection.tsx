import { Globe, Check } from 'lucide-react'
import { LANGUAGES } from '../utils/translations'

interface LanguageSelectionProps {
    onSelect: (lang: string) => void
    currentLang: string
}

export default function LanguageSelection({ onSelect, currentLang }: LanguageSelectionProps) {
    return (
        <div style={{ background: 'var(--bg-body)', minHeight: '100vh', position: 'relative' }}>
            {/* Background mesh */}
            <div className="bg-mesh"></div>
            <div className="noise-overlay"></div>

            <div className="relative z-10 flex flex-col items-center justify-center px-4" style={{ minHeight: '80vh' }}>
                <div className="text-center mb-10 animate-fade-in-up">
                    <div style={{
                        width: '80px',
                        height: '80px',
                        background: 'rgba(99, 102, 241, 0.12)',
                        borderRadius: 'var(--radius-xl)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1.5rem',
                        border: '1px solid rgba(99, 102, 241, 0.2)',
                    }}>
                        <Globe className="w-10 h-10" style={{ color: 'var(--primary-400)' }} />
                    </div>
                    <h1 className="text-3xl font-bold mb-3 gradient-text">Select Your Language</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                        Choose your preferred language to continue
                    </p>
                    <div style={{
                        height: '3px',
                        width: '60px',
                        background: 'linear-gradient(90deg, var(--primary-500), var(--accent-500))',
                        borderRadius: '3px',
                        margin: '1.5rem auto 0',
                    }}></div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
                    {LANGUAGES.map((lang, index) => (
                        <button
                            key={lang.value}
                            onClick={() => onSelect(lang.value)}
                            className="animate-fade-in-up"
                            style={{
                                animationDelay: `${index * 60}ms`,
                                position: 'relative',
                                padding: '1.25rem 1.5rem',
                                borderRadius: 'var(--radius-lg)',
                                border: currentLang === lang.value
                                    ? '2px solid var(--primary-500)'
                                    : '2px solid var(--border)',
                                background: currentLang === lang.value
                                    ? 'rgba(99, 102, 241, 0.08)'
                                    : 'var(--glass-bg)',
                                cursor: 'pointer',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                textAlign: 'left',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                boxShadow: currentLang === lang.value
                                    ? '0 0 0 2px rgba(99, 102, 241, 0.15), var(--shadow-md)'
                                    : 'none',
                            }}
                            onMouseEnter={(e) => {
                                if (currentLang !== lang.value) {
                                    e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.3)';
                                    e.currentTarget.style.background = 'var(--glass-hover)';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (currentLang !== lang.value) {
                                    e.currentTarget.style.borderColor = 'var(--border)';
                                    e.currentTarget.style.background = 'var(--glass-bg)';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }
                            }}
                        >
                            <div>
                                <h3 style={{
                                    fontSize: '1.1rem',
                                    fontWeight: 700,
                                    marginBottom: '2px',
                                    color: currentLang === lang.value ? 'var(--primary-400)' : 'var(--text-primary)',
                                }}>
                                    {lang.label.split('(')[0]}
                                </h3>
                                <p style={{
                                    fontSize: '0.85rem',
                                    color: currentLang === lang.value ? 'rgba(99, 102, 241, 0.7)' : 'var(--text-muted)',
                                }}>
                                    {lang.label.split('(')[1]?.replace(')', '') || lang.label}
                                </p>
                            </div>
                            <div style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.2s ease',
                                background: currentLang === lang.value
                                    ? 'linear-gradient(135deg, var(--primary-500), var(--accent-500))'
                                    : 'rgba(255, 255, 255, 0.05)',
                                color: currentLang === lang.value ? 'white' : 'transparent',
                            }}>
                                <Check className="w-5 h-5" />
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}
