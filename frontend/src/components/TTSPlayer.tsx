import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Loader2, AlertCircle, Square } from 'lucide-react';
import { TRANSLATIONS, type Language } from '../utils/translations';

interface TTSPlayerProps {
    text: string;
    schemeId: string;
    language: string;
    sessionId: string;
}

// Map app language codes to Web Speech API language tags
const LANG_MAP: Record<string, string> = {
    en: 'en-IN',
    hi: 'hi-IN',
    ta: 'ta-IN',
    te: 'te-IN',
    bn: 'bn-IN',
    mr: 'mr-IN',
    gu: 'gu-IN',
    kn: 'kn-IN',
    ml: 'ml-IN',
    pa: 'pa-IN',
    or: 'or-IN',
};

export default function TTSPlayer({ text, schemeId, language, sessionId }: TTSPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [supported, setSupported] = useState(true);
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

    const t = TRANSLATIONS[(language as Language) || 'en'];

    // Check browser support
    useEffect(() => {
        if (!('speechSynthesis' in window)) {
            setSupported(false);
            setError('Text-to-speech is not supported in this browser.');
        }
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            window.speechSynthesis?.cancel();
        };
    }, []);

    // Stop if text/language changes
    useEffect(() => {
        if (isPlaying) {
            window.speechSynthesis?.cancel();
            setIsPlaying(false);
            setError(null);
        }
    }, [text, language]);

    const handlePlay = () => {
        try {
            setError(null);
            window.speechSynthesis.cancel(); // Clear queue

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = LANG_MAP[language] || 'en-IN';
            utterance.rate = 0.95;
            utterance.pitch = 1;

            // Try to find a matching voice
            const voices = window.speechSynthesis.getVoices();
            const targetLang = LANG_MAP[language] || 'en-IN';
            const matchingVoice = voices.find(v => v.lang === targetLang) ||
                voices.find(v => v.lang.startsWith(targetLang.split('-')[0]));
            if (matchingVoice) {
                utterance.voice = matchingVoice;
            }

            utterance.onend = () => setIsPlaying(false);
            utterance.onerror = (e) => {
                console.warn('Speech error:', e);
                setIsPlaying(false);
                if (e.error !== 'canceled') {
                    setError(t.errors?.general || 'Playback failed');
                }
            };

            utteranceRef.current = utterance;
            window.speechSynthesis.speak(utterance);
            setIsPlaying(true);
        } catch (err) {
            console.warn('TTS Error:', err);
            setError(t.errors?.general || 'Playback failed');
        }
    };

    const handleStop = () => {
        window.speechSynthesis?.cancel();
        setIsPlaying(false);
    };

    if (!supported) return null;

    return (
        <div className="tts-player-container">
            <div className="tts-player">
                <button
                    onClick={isPlaying ? handleStop : handlePlay}
                    className={`tts-btn ${isPlaying ? 'tts-btn-playing' : ''}`}
                    title={isPlaying ? 'Stop' : (t.buttons?.listen || 'Listen')}
                >
                    {isPlaying ? (
                        <>
                            <Square className="w-4 h-4" />
                            <span>Stop</span>
                            <span className="tts-pulse-dot"></span>
                        </>
                    ) : (
                        <>
                            <Volume2 className="w-4 h-4" />
                            <span>{t.buttons?.listen || 'Listen'}</span>
                        </>
                    )}
                </button>

                <span className="tts-hint">
                    {language === 'en' ? 'Browser voice · No API needed' : 'Browser voice · Local language'}
                </span>
            </div>
            {error && (
                <div className="tts-error">
                    <AlertCircle className="w-3 h-3" />
                    {error}
                </div>
            )}
        </div>
    );
}
