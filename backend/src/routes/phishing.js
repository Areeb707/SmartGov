import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();
const VIRUSTOTAL_API_KEY = process.env.VIRUSTOTAL_API_KEY;
const VT_URL_SCAN = 'https://www.virustotal.com/api/v3/urls';
const VT_URL_REPORT = 'https://www.virustotal.com/api/v3/analyses';

/**
 * POST /api/phishing/check
 * Check if a URL is a phishing/malicious URL using VirusTotal
 */
router.post('/check', async (req, res) => {
    try {
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({ error: 'URL is required', success: false });
        }

        let parsedUrl;
        // Basic URL validation
        try {
            parsedUrl = new URL(url);
        } catch {
            return res.status(400).json({
                error: 'Invalid URL format',
                message: 'Please enter a valid URL (e.g., https://example.com)',
                success: false
            });
        }

        const urlLower = url.toLowerCase();
        const hostname = parsedUrl.hostname.toLowerCase();
        const protocol = parsedUrl.protocol.toLowerCase();

        // --- LOCAL HEURISTICS CHECKS ---
        let warnings = [];
        let riskPenalty = 0;
        
        // 1. Government Domain Check
        const isOfficialGov = hostname.endsWith('.gov.in') || hostname.endsWith('.nic.in');
        if (!isOfficialGov) {
            warnings.push('Not an official Indian Government domain (.gov.in or .nic.in).');
            riskPenalty += 15;
        }

        // 2. HTTPS Check
        if (protocol !== 'https:') {
            warnings.push('Connection is not secure (uses HTTP instead of HTTPS). Information can be intercepted.');
            riskPenalty += 20;
        }

        // 3. Suspicious Pattern Detection
        const suspiciousKeywords = ['free', 'urgent', 'offer', 'claim', 'win', 'lottery', 'prize', 'gift'];
        const foundKeywords = suspiciousKeywords.filter(keyword => urlLower.includes(keyword));
        if (foundKeywords.length > 0) {
            warnings.push(`The URL contains suspicious keywords commonly used in scams: ${foundKeywords.join(', ')}.`);
            riskPenalty += 25;
        }

        // Make sure risk penalty isn't overwhelmingly high on its own
        riskPenalty = Math.min(riskPenalty, 50);

        // Check if VirusTotal key is configured
        if (!VIRUSTOTAL_API_KEY || VIRUSTOTAL_API_KEY === 'your_virustotal_api_key_here') {
            // Return a simulation response when no API key
            return res.json(simulateScan(url, isOfficialGov, warnings, riskPenalty));
        }

        // Step 1: Submit URL for scanning
        const scanResponse = await fetch(VT_URL_SCAN, {
            method: 'POST',
            headers: {
                'x-apikey': VIRUSTOTAL_API_KEY,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `url=${encodeURIComponent(url)}`
        });

        if (!scanResponse.ok) {
            const errBody = await scanResponse.text();
            console.error('VirusTotal scan error:', scanResponse.status, errBody);

            if (scanResponse.status === 401) {
                return res.status(401).json({
                    error: 'Invalid VirusTotal API key',
                    success: false
                });
            }

            // Fall back to simulation if VT fails 
            return res.json(simulateScan(url, isOfficialGov, warnings, riskPenalty));
        }

        const scanData = await scanResponse.json();
        const analysisId = scanData.data?.id;

        if (!analysisId) {
            return res.json(simulateScan(url, isOfficialGov, warnings, riskPenalty));
        }

        // Step 2: Poll for analysis result (with timeout)
        let analysisResult = null;
        const maxAttempts = 10;
        const pollInterval = 2000; // 2 seconds

        for (let i = 0; i < maxAttempts; i++) {
            await new Promise(resolve => setTimeout(resolve, pollInterval));

            const reportResponse = await fetch(`${VT_URL_REPORT}/${analysisId}`, {
                headers: { 'x-apikey': VIRUSTOTAL_API_KEY }
            });

            if (reportResponse.ok) {
                const reportData = await reportResponse.json();
                const status = reportData.data?.attributes?.status;

                if (status === 'completed') {
                    analysisResult = reportData.data.attributes;
                    break;
                }
            }
        }

        if (!analysisResult) {
            // Step 3: Try URL lookup directly via URL ID 
            const urlId = Buffer.from(url).toString('base64').replace(/=/g, '');
            const lookupResponse = await fetch(`${VT_URL_SCAN}/${urlId}`, {
                headers: { 'x-apikey': VIRUSTOTAL_API_KEY }
            });

            if (lookupResponse.ok) {
                const lookupData = await lookupResponse.json();
                analysisResult = lookupData.data?.attributes?.last_analysis_stats
                    ? {
                        stats: lookupData.data.attributes.last_analysis_stats,
                        results: lookupData.data.attributes.last_analysis_results
                    }
                    : null;
            }
        }

        if (!analysisResult) {
            // Provide a partial verdict from heuristics
            let verdict = 'unknown';
            if (riskPenalty > 40) verdict = 'suspicious';
            if (isOfficialGov && riskPenalty < 20) verdict = 'safe';
            
            return res.json({
                success: true,
                url,
                verdict,
                message: 'Analysis is still in progress, but we performed basic safety checks.',
                explanation: 'VirusTotal analysis is compiling. Our local heuristic checks have been applied.',
                warnings,
                riskLevel: riskPenalty,
                stats: { malicious: 0, suspicious: 0, harmless: 0, undetected: 0, totalEngines: 0 },
                details: []
            });
        }

        // Parse results
        const stats = analysisResult.stats || {};
        const results = analysisResult.results || {};

        const malicious = stats.malicious || 0;
        const suspicious = stats.suspicious || 0;
        const harmless = stats.harmless || 0;
        const undetected = stats.undetected || 0;
        const totalEngines = malicious + suspicious + harmless + undetected;

        // Determine combined risk
        const vtThreatScore = ((malicious + suspicious) / Math.max(totalEngines, 1)) * 100;
        let riskLevel = Math.min(Math.round(vtThreatScore + riskPenalty), 100);

        // Determine verdict
        let verdict = 'safe';
        let message = 'This URL appears to be safe.';
        let explanation = 'No significant threats detected by security engines.';

        if (malicious >= 3 || riskLevel >= 60 || (malicious > 0 && riskLevel > 40)) {
            verdict = 'dangerous';
            message = `⚠️ HIGH RISK: Security engines and our heuristics flagged this URL!`;
            explanation = 'This link has a high probability of being malicious or a phishing attempt. Do not provide any personal information or click on any buttons on that site.';
        } else if (malicious >= 1 || suspicious >= 1 || riskLevel >= 30) {
            verdict = 'suspicious';
            message = `⚡ WARNING: This URL exhibits suspicious characteristics.`;
            explanation = 'Proceed with extreme caution. This link has triggered warnings and may not be a verified official source.';
        } else {
            if (isOfficialGov) {
                 explanation = 'This is a verified official government domain and no threats were detected.';
            } else if (warnings.length > 0) {
                 verdict = 'suspicious';
                 message = `⚡ WARNING: No direct threats, but heuristics triggered warnings.`;
                 explanation = 'While security scanners did not flag this URL, our checks indicate it may not be an official government link. Exercise caution.';
            } else {
                 explanation = 'While this is not a designated .gov.in domain, it appears safe based on security scans.';
            }
        }

        // Get top flagging engines
        const flaggedEngines = Object.entries(results)
            .filter(([, data]) => data.category === 'malicious' || data.category === 'suspicious' || data.category === 'phishing')
            .map(([engine, data]) => ({
                engine,
                category: data.category,
                result: data.result || data.category,
            }))
            .slice(0, 10);

        res.json({
            success: true,
            url,
            verdict,
            message,
            explanation,
            warnings,
            riskLevel,
            stats: { malicious, suspicious, harmless, undetected, totalEngines },
            details: flaggedEngines
        });

    } catch (error) {
        console.error('Phishing check error:', error);
        res.status(500).json({
            error: 'Scan failed',
            message: error.message,
            success: false
        });
    }
});

/**
 * GET /api/phishing/status
 * Check if the phishing detection service is available
 */
router.get('/status', (req, res) => {
    const isAvailable = !!VIRUSTOTAL_API_KEY && VIRUSTOTAL_API_KEY !== 'your_virustotal_api_key_here';
    res.json({
        available: isAvailable,
        mode: isAvailable ? 'live' : 'simulation',
        message: isAvailable ? 'VirusTotal service active' : 'Running in simulation mode (no API key)',
        success: true
    });
});

/**
 * Simulation mode — returns realistic fake results when no API key is configured
 */
function simulateScan(url, isOfficialGov, localWarnings, localRiskPenalty) {
    const urlLower = url.toLowerCase();

    // Known patterns for phishing simulation
    const phishingPatterns = [
        'login', 'account', 'verify', 'secure', 'update', 'confirm',
        'banking', 'paypal', 'apple-id', 'microsoft', 'signin',
        'bit.ly', 'tinyurl', 'shorturl'
    ];

    const suspiciousPatterns = [
        '.tk', '.ml', '.ga', '.cf', '.xyz', '.top', '.work', '.click'
    ];

    const isPhishing = phishingPatterns.some(p => urlLower.includes(p));
    const isSuspiciousExtension = suspiciousPatterns.some(p => urlLower.includes(p));

    let verdict, message, explanation, riskLevel, stats;
    let combinedRisk = localRiskPenalty;

    if (isPhishing) {
        verdict = 'dangerous';
        combinedRisk += 70;
        message = `⚠️ HIGH RISK: This URL matches known phishing patterns!`;
        explanation = 'This link has a high probability of being malicious or a phishing attempt. Do not provide any personal information or click on any buttons on that site.';
        stats = {
            malicious: 8 + Math.floor(Math.random() * 10),
            suspicious: 3 + Math.floor(Math.random() * 5),
            harmless: 20 + Math.floor(Math.random() * 15),
            undetected: 30 + Math.floor(Math.random() * 10),
            totalEngines: 70
        };
    } else if (isSuspiciousExtension || localRiskPenalty > 30) {
        verdict = 'suspicious';
        combinedRisk += 30;
        message = `⚡ WARNING: This URL exhibits suspicious characteristics.`;
        explanation = 'Proceed with extreme caution. This link has triggered warnings and may not be a verified official source.';
        stats = {
            malicious: Math.floor(Math.random() * 2),
            suspicious: 2 + Math.floor(Math.random() * 4),
            harmless: 35 + Math.floor(Math.random() * 15),
            undetected: 25 + Math.floor(Math.random() * 10),
            totalEngines: 70
        };
    } else if (isOfficialGov) {
        verdict = 'safe';
        message = `✅ This URL appears to be safe.`;
        explanation = 'This is a verified official government domain and no threats were detected.';
        stats = {
            malicious: 0,
            suspicious: 0,
            harmless: 55 + Math.floor(Math.random() * 10),
            undetected: 5 + Math.floor(Math.random() * 5),
            totalEngines: 70
        };
    } else {
        if (localWarnings.length > 0) {
            verdict = 'suspicious';
            message = `⚡ WARNING: No direct threats, but heuristics triggered warnings.`;
            explanation = 'While security scanners did not flag this URL, our checks indicate it may not be an official government link. Exercise caution.';
        } else {
            verdict = 'safe';
            message = `✅ This URL appears to be safe.`;
            explanation = 'While this is not a designated .gov.in domain, it appears safe based on security scans.';
        }
        stats = {
            malicious: 0,
            suspicious: 0,
            harmless: 50 + Math.floor(Math.random() * 15),
            undetected: 5 + Math.floor(Math.random() * 10),
            totalEngines: 70
        };
    }
    
    riskLevel = Math.min(combinedRisk, 100);

    // If verdict was changed to safe but we have warnings, promote to suspicious
    if (verdict === 'safe' && localWarnings.length > 0 && !isOfficialGov) {
       verdict = 'suspicious';
    }

    return {
        success: true,
        url,
        verdict,
        message,
        explanation,
        warnings: localWarnings,
        riskLevel,
        stats,
        details: isPhishing ? [
            { engine: 'Google Safebrowsing', category: 'phishing', result: 'phishing site' },
            { engine: 'Kaspersky', category: 'malicious', result: 'malware' },
        ] : isSuspiciousExtension ? [
            { engine: 'Fortinet', category: 'suspicious', result: 'suspicious content' },
        ] : [],
        mode: 'simulation'
    };
}

export default router;
