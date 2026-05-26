import { Shield, ChevronRight, CheckCircle, FileText, ArrowRight, Sparkles, Zap, ShieldAlert } from 'lucide-react'

interface LandingProps {
    onStartCheck: () => void
    onOpenPhishing?: () => void
}

export default function Landing({ onStartCheck, onOpenPhishing }: LandingProps) {
    return (
        <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-body)' }}>
            {/* Background Effects */}
            <div className="bg-mesh"></div>
            <div className="noise-overlay"></div>

            {/* Hero Section */}
            <section className="hero-section flex-1 flex flex-col relative">
                {/* Animated Orbs */}
                <div className="hero-orb hero-orb-1"></div>
                <div className="hero-orb hero-orb-2"></div>
                <div className="hero-orb hero-orb-3"></div>

                <div className="container relative z-10 flex flex-col items-center justify-center min-h-screen text-center text-white py-20">
                    {/* Floating Icon Badge */}
                    <div className="hero-icon-badge animate-fade-in-up">
                        <Shield className="w-10 h-10 text-white" style={{ opacity: 0.9 }} />
                    </div>

                    {/* Title */}
                    <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                        <h1 className="text-5xl md:text-6xl font-extrabold mb-4" style={{
                            background: 'linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.8) 50%, #22D3EE 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}>
                            SmartGov Guide
                        </h1>
                        <p className="text-lg md:text-2xl font-light mb-2" style={{ color: 'rgba(255,255,255,0.7)' }}>
                            Explainable AI for Government Welfare Eligibility
                        </p>
                    </div>

                    {/* Value Proposition */}
                    <div className="max-w-2xl mb-12 animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
                        <p className="text-2xl md:text-3xl font-semibold mb-4" style={{ color: 'rgba(255,255,255,0.95)' }}>
                            "Know why you are eligible — or why you are not."
                        </p>
                        <p className="text-lg" style={{ color: 'rgba(255,255,255,0.6)' }}>
                            Get transparent, rule-by-rule explanations for government welfare schemes.
                            No more confusion. No more blind rejections.
                        </p>
                    </div>

                    {/* CTA Button */}
                    <button
                        onClick={onStartCheck}
                        className="group hero-cta animate-fade-in-up"
                        style={{ animationDelay: '0.4s' }}
                    >
                        <Sparkles className="w-5 h-5" style={{ opacity: 0.8 }} />
                        Check My Eligibility
                        <ChevronRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
                    </button>

                    {/* Trust Indicators */}
                    <div className="mt-16 flex flex-wrap justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                        <div className="trust-pill">
                            <CheckCircle className="w-4 h-4" />
                            <span>Verified Government Sources</span>
                        </div>
                        <div className="trust-pill">
                            <Shield className="w-4 h-4" />
                            <span>No Sensitive Data Collected</span>
                        </div>
                        <div className="trust-pill">
                            <FileText className="w-4 h-4" />
                            <span>Rule-by-Rule Transparency</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 relative z-10">
                <div className="container">
                    <h2 className="text-3xl font-bold text-center mb-3 gradient-text">How It Works</h2>
                    <p className="text-center mb-12 max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
                        Three simple steps to understand your welfare eligibility
                    </p>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Step 1 */}
                        <div className="feature-card animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                            <div className="feature-icon blue">1</div>
                            <h3 className="text-xl font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Enter Basic Info</h3>
                            <p style={{ color: 'var(--text-secondary)' }}>
                                Provide simple details like age, income, and state. No Aadhaar, no bank details, no documents.
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="feature-card animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                            <div className="feature-icon cyan">2</div>
                            <h3 className="text-xl font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>AI Analyzes Schemes</h3>
                            <p style={{ color: 'var(--text-secondary)' }}>
                                Our AI reads official government scheme documents and matches rules against your profile.
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="feature-card animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                            <div className="feature-icon green">3</div>
                            <h3 className="text-xl font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Get Clear Explanations</h3>
                            <p style={{ color: 'var(--text-secondary)' }}>
                                See exactly which rules you pass or fail, with links to official government portals.
                            </p>
                        </div>
                    </div>

                    {/* Secondary CTAs */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
                        <button
                            onClick={onStartCheck}
                            className="btn-primary inline-flex items-center gap-2"
                        >
                            <Zap className="w-5 h-5" />
                            Get Started Now
                            <ArrowRight className="w-5 h-5" />
                        </button>
                        {onOpenPhishing && (
                            <button
                                onClick={onOpenPhishing}
                                className="btn-secondary inline-flex items-center gap-2"
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    borderRadius: 'var(--radius-lg)',
                                    cursor: 'pointer',
                                }}
                            >
                                <ShieldAlert className="w-5 h-5" />
                                Verify Scheme Link
                            </button>
                        )}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="site-footer relative z-10">
                <div className="container text-center">
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        <strong style={{ color: 'var(--text-primary)' }}>SmartGov Guide</strong> is an informational tool only. It does not submit applications or replace official government portals.
                    </p>
                    <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
                        We do not collect Aadhaar, bank details, OTPs, or documents.
                    </p>
                </div>
            </footer>
        </div>
    )
}
