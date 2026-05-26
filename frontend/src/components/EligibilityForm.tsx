import { useState } from 'react'
import { ArrowLeft, ArrowRight, User, Wallet, MapPin, Users, Briefcase, Languages, Shield } from 'lucide-react'
import type { UserProfile } from '../App'
import { TRANSLATIONS, LANGUAGES, type Language } from '../utils/translations'

interface EligibilityFormProps {
    onSubmit: (profile: UserProfile, language: string) => void
    initialData: UserProfile | null
    initialLanguage: string
}

const INDIAN_STATES = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
    'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
    'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Puducherry'
]

const CATEGORIES = [
    { value: '', label: 'Prefer not to say' },
    { value: 'general', label: 'General' },
    { value: 'obc', label: 'OBC (Other Backward Class)' },
    { value: 'sc', label: 'SC (Scheduled Caste)' },
    { value: 'st', label: 'ST (Scheduled Tribe)' },
    { value: 'ews', label: 'EWS (Economically Weaker Section)' }
]

const OCCUPATIONS = [
    'Farmer', 'Agricultural Laborer', 'Self-Employed', 'Private Sector Employee',
    'Government Employee', 'Daily Wage Worker', 'Small Business Owner',
    'Student', 'Homemaker', 'Unemployed', 'Retired', 'Other'
]

interface FormErrors {
    age?: string
    income?: string
    state?: string
    occupation?: string
}

export default function EligibilityForm({ onSubmit, initialData, initialLanguage }: EligibilityFormProps) {
    const [formData, setFormData] = useState({
        age: initialData?.age?.toString() || '',
        income: initialData?.income?.toString() || '',
        state: initialData?.state || '',
        category: initialData?.category || '',
        occupation: initialData?.occupation || ''
    })
    const [selectedLanguage, setSelectedLanguage] = useState<Language>(initialLanguage as Language || 'en')
    const [errors, setErrors] = useState<FormErrors>({})
    const [currentStep, setCurrentStep] = useState(0)

    const t = TRANSLATIONS[selectedLanguage]

    const validateStep = (step: number): boolean => {
        const newErrors: FormErrors = {}

        if (step === 1) {
            const age = parseInt(formData.age)
            if (!formData.age || isNaN(age)) {
                newErrors.age = 'Please enter your age'
            } else if (age < 0 || age > 120) {
                newErrors.age = 'Please enter a valid age'
            }

            const income = parseInt(formData.income)
            if (!formData.income || isNaN(income)) {
                newErrors.income = 'Please enter your annual income'
            } else if (income < 0) {
                newErrors.income = 'Income cannot be negative'
            }

            if (!formData.state) {
                newErrors.state = 'Please select your state'
            }
            if (!formData.occupation) {
                newErrors.occupation = 'Please select your occupation'
            }
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleNext = () => {
        if (currentStep === 0) {
            setCurrentStep(1)
        } else if (validateStep(currentStep)) {
            onSubmit({
                age: parseInt(formData.age),
                income: parseInt(formData.income),
                state: formData.state,
                category: formData.category,
                occupation: formData.occupation
            }, selectedLanguage)
        }
    }

    const handleBack = () => {
        setCurrentStep(prev => prev - 1)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        handleNext()
    }

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        if (errors[field as keyof FormErrors]) {
            setErrors(prev => ({ ...prev, [field]: undefined }))
        }
    }

    return (
        <div style={{ background: 'var(--bg-body)', minHeight: '100vh', position: 'relative' }}>
            {/* Background */}
            <div className="bg-mesh"></div>
            <div className="noise-overlay"></div>

            <div className="relative z-10 py-12 px-4">
                <div className="container max-w-2xl">
                    {/* Header */}
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-bold gradient-text mb-2 animate-fade-in-up">
                            {t.title}
                        </h1>
                        <p className="animate-fade-in-up delay-100" style={{ color: 'var(--text-secondary)' }}>
                            {t.subtitle}
                        </p>
                    </div>

                    {/* Progress Indicator */}
                    <div className="flex items-center justify-center mb-10">
                        <div className={`progress-step ${currentStep >= 0 ? 'active' : 'pending'}`}>
                            1
                        </div>
                        <div className={`progress-line w-24 ${currentStep >= 1 ? 'active' : 'pending'}`}></div>
                        <div className={`progress-step ${currentStep >= 1 ? 'active' : 'pending'}`}>
                            2
                        </div>
                    </div>

                    {/* Form Card */}
                    <div className="card p-8 md:p-10 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
                        <form onSubmit={handleSubmit}>
                            {/* Step 0: Language Selection */}
                            {currentStep === 0 && (
                                <div className="space-y-6 animate-fade-in-up">
                                    <h2 className="text-xl font-semibold mb-6 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                                        <Languages className="w-5 h-5" style={{ color: '#A78BFA' }} />
                                        {t.steps.lang}
                                    </h2>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {LANGUAGES.map((lang) => (
                                            <div
                                                key={lang.value}
                                                onClick={() => setSelectedLanguage(lang.value)}
                                                style={{
                                                    cursor: 'pointer',
                                                    padding: '1rem',
                                                    borderRadius: 'var(--radius-lg)',
                                                    border: selectedLanguage === lang.value
                                                        ? '2px solid var(--primary-500)'
                                                        : '2px solid var(--border)',
                                                    background: selectedLanguage === lang.value
                                                        ? 'rgba(99, 102, 241, 0.08)'
                                                        : 'transparent',
                                                    transition: 'all 0.2s ease',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.75rem',
                                                }}
                                            >
                                                <div style={{
                                                    width: '20px',
                                                    height: '20px',
                                                    borderRadius: '50%',
                                                    border: selectedLanguage === lang.value
                                                        ? '2px solid var(--primary-500)'
                                                        : '2px solid var(--text-muted)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    flexShrink: 0,
                                                }}>
                                                    {selectedLanguage === lang.value && (
                                                        <div style={{
                                                            width: '10px',
                                                            height: '10px',
                                                            borderRadius: '50%',
                                                            background: 'var(--primary-500)',
                                                        }} />
                                                    )}
                                                </div>
                                                <span style={{
                                                    fontWeight: 500,
                                                    color: selectedLanguage === lang.value ? 'var(--primary-400)' : 'var(--text-secondary)',
                                                }}>
                                                    {lang.label}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleNext}
                                        className="btn-primary w-full flex items-center justify-center gap-2 mt-6"
                                    >
                                        {t.buttons.next}
                                        <ArrowRight className="w-5 h-5" />
                                    </button>
                                </div>
                            )}

                            {/* Step 1: Profile Details */}
                            {currentStep === 1 && (
                                <div className="space-y-6 animate-fade-in-up">
                                    <h2 className="text-xl font-semibold mb-6 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                                        <User className="w-5 h-5" style={{ color: 'var(--primary-400)' }} />
                                        {t.title === "Check Your Eligibility" ? "Enter Your Details" : t.steps.basic}
                                    </h2>

                                    {/* Age & Income Row */}
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="form-label flex items-center gap-2">
                                                <User className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                                                {t.labels.age}
                                            </label>
                                            <input
                                                type="number"
                                                className={`form-input ${errors.age ? 'border-red-500' : ''}`}
                                                value={formData.age}
                                                onChange={(e) => handleInputChange('age', e.target.value)}
                                            />
                                            {errors.age && <p className="form-error">{errors.age}</p>}
                                        </div>
                                        <div>
                                            <label className="form-label flex items-center gap-2">
                                                <Wallet className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                                                {t.labels.income}
                                            </label>
                                            <input
                                                type="number"
                                                className={`form-input ${errors.income ? 'border-red-500' : ''}`}
                                                value={formData.income}
                                                onChange={(e) => handleInputChange('income', e.target.value)}
                                            />
                                            {errors.income && <p className="form-error">{errors.income}</p>}
                                        </div>
                                    </div>

                                    {/* State & Occupation Row */}
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="form-label flex items-center gap-2">
                                                <MapPin className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                                                {t.labels.state}
                                            </label>
                                            <select
                                                className={`form-input ${errors.state ? 'border-red-500' : ''}`}
                                                value={formData.state}
                                                onChange={(e) => handleInputChange('state', e.target.value)}
                                            >
                                                <option value="">{t.labels.selectState}</option>
                                                {INDIAN_STATES.map(state => (
                                                    <option key={state} value={state}>{state}</option>
                                                ))}
                                            </select>
                                            {errors.state && <p className="form-error">{errors.state}</p>}
                                        </div>
                                        <div>
                                            <label className="form-label flex items-center gap-2">
                                                <Briefcase className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                                                {t.labels.occupation}
                                            </label>
                                            <select
                                                className={`form-input ${errors.occupation ? 'border-red-500' : ''}`}
                                                value={formData.occupation}
                                                onChange={(e) => handleInputChange('occupation', e.target.value)}
                                            >
                                                <option value="">{t.labels.selectOcc}</option>
                                                {OCCUPATIONS.map(occ => (
                                                    <option key={occ} value={occ}>{occ}</option>
                                                ))}
                                            </select>
                                            {errors.occupation && <p className="form-error">{errors.occupation}</p>}
                                        </div>
                                    </div>

                                    {/* Category */}
                                    <div>
                                        <label className="form-label flex items-center gap-2">
                                            <Users className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                                            {t.labels.category} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>{t.labels.optional}</span>
                                        </label>
                                        <select
                                            className="form-input"
                                            value={formData.category}
                                            onChange={(e) => handleInputChange('category', e.target.value)}
                                        >
                                            {CATEGORIES.map(cat => (
                                                <option key={cat.value} value={cat.value}>{cat.label}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="flex gap-4 pt-4">
                                        <button
                                            type="button"
                                            onClick={handleBack}
                                            className="btn-secondary flex-1 flex items-center justify-center gap-2"
                                        >
                                            <ArrowLeft className="w-5 h-5" />
                                            {t.buttons.back}
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn-primary flex-1 flex items-center justify-center gap-2"
                                        >
                                            {t.buttons.check}
                                            <ArrowRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </form>
                    </div>

                    {/* Privacy Notice */}
                    <p className="text-center text-sm mt-8 flex items-center justify-center gap-2" style={{ color: 'var(--text-muted)' }}>
                        <Shield className="w-4 h-4" style={{ color: 'var(--primary-400)' }} />
                        {t.results.privacy}
                    </p>
                </div>
            </div>
        </div>
    )
}
