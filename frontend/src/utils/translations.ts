
export type Language = 'en' | 'ta' | 'hi' | 'te';

export const LANGUAGES: { value: Language; label: string }[] = [
    { value: 'en', label: 'English' },
    { value: 'ta', label: 'Tamil (தமிழ்)' },
    { value: 'hi', label: 'Hindi (हिंदी)' },
    { value: 'te', label: 'Telugu (తెలుగు)' }
];

export const TRANSLATIONS = {
    en: {
        title: "Check Your Eligibility",
        subtitle: "Answer a few simple questions to discover applicable schemes",
        languageSelection: "Select Your Language",
        steps: {
            lang: "Select Language",
            basic: "Basic Information",
            loc: "Location & Occupation"
        },
        labels: {
            age: "Age (in years)",
            income: "Annual Household Income (₹)",
            state: "State / Union Territory",
            category: "Category",
            occupation: "Occupation",
            selectState: "Select your state",
            selectOcc: "Select your occupation",
            optional: "(optional)"
        },
        buttons: {
            next: "Continue",
            back: "Back",
            check: "Check Eligibility",
            edit: "Edit Profile",
            startOver: "Start Over",
            listen: "Listen",
            loading: "Loading...",
            visit: "Visit Official Portal",
            learn: "Learn More",
            simulate: "Simulate Eligibility",
            reset: "Reset to Real Profile"
        },
        summary: {
            total: "Schemes Found",
            eligible: "Eligible Schemes",
            fixable: "Potentially Eligible",
            noChance: "Not Eligible"
        },
        simulation: {
            title: "What-If Simulation",
            desc: "Adjust your details to see if you could become eligible.",
            badge: "Simulated Result"
        },
        results: {
            heading: "Your Eligibility Results",
            yourEligibility: "Schemes You May Be Eligible For",
            analyzed: "Schemes Analyzed",
            eligible: "Eligible",
            ineligible: "Not Eligible",
            fixable: "Potentially Eligible",
            nonFixable: "Conditions not met",
            youQualify: "You May Qualify",
            moreInfo: "More Info Needed",
            why: "Why?",
            ruleBreakdown: "Rule Evaluation",
            required: "Required:",
            yourValue: "Your Value:",
            simResults: "Simulated Value:",
            pass: "Pass",
            fail: "Fail",
            empty: "No applicable schemes found for your profile.",
            privacy: "Your information was NOT saved anywhere.",
            simBadge: "Simulated",
            analyzing: "Analyzing your profile...",
            pleaseWait: "Please wait while we match schemes.",
            officialLimit: "Official Income Limit",
            limitDesc: "Annual income must be within the official scheme limit",
            incomeRef: "Income Reference (Indicative)",
            refDesc: "Typical income limit for some benefits",
            occCat: "Your Background",
            occDesc: "Checking who this scheme is for",
            finalEligibility: "Final eligibility is based on the official scheme income limit of",
            indicativeTag: "INDICATIVE ONLY",
            reference: "Reference"
        },
        rules: {
            targetGroup: "Who can apply",
            incomeLimit: "Maximum allowed income",
            ageLimit: "Age requirement",
            occupation: "Your work or background",
            category: "Social Category",
            indicative: "Typical Reference",
            whoFor: "Who this scheme is meant for:",
            yourProfile: "Your profile:"
        },
        schemes: {
            'pm-kisan': {
                eligible: "You are a farmer with income below the limit. You qualify for ₹6,000 yearly support.",
                ineligible: "This scheme is only for farmers with land. You do not meet the occupation or income criteria."
            },
            'pmjay': {
                eligible: "Your income is below ₹5 Lakh. You qualify for free health insurance up to ₹5 Lakhs.",
                ineligible: "Your income is higher than the ₹5 Lakh limit allowed for this free health scheme."
            },
            'nsp': {
                eligible: "As a student with matching age and income, you can apply for this scholarship.",
                ineligible: "This is for students aged 16-35 with family income below ₹2.5 Lakhs."
            },
            'pmay': {
                eligible: "Your income falls within the housing loan subsidy categories (EWS/LIG/MIG).",
                ineligible: "Your annual income exceeds the maximum limit of ₹18 Lakhs for this housing benefit."
            }
        },
        errors: {
            limit: "You’ve reached the usage limit. Please refresh the page to try again.",
            general: "Unable to generate audio. Please try again."
        }
    },
    ta: {
        title: "உங்கள் தகுதியை சரிபார்க்கவும்",
        subtitle: "பொருந்தக்கூடிய திட்டங்களைக் கண்டறிய எளிய பதில்களை அளிக்கவும்",
        languageSelection: "மொழியைத் தேர்ந்தெடுக்கவும்",
        steps: {
            lang: "மொழியைத் தேர்ந்தெடுக்கவும்",
            basic: "அடிப்படைத் தகவல்கள்",
            loc: "இடம் மற்றும் தொழில்"
        },
        labels: {
            age: "வயது",
            income: "ஆண்டு குடும்ப வருமானம் (₹)",
            state: "மாநிலம்",
            category: "பிரிவு",
            occupation: "தொழில்",
            selectState: "மாநிலத்தைத் தேர்ந்தெடுக்கவும்",
            selectOcc: "தொழிலைத் தேர்ந்தெடுக்கவும்",
            optional: "(விருப்பத்திற்குரியது)"
        },
        buttons: {
            next: "தொடரவும்",
            back: "பின் செல்ல",
            check: "தகுதியை சரிபார்க்கவும்",
            edit: "சுயவிவரத்தைத் திருத்து",
            startOver: "முதலில் இருந்து",
            listen: "கேளுங்கள்",
            loading: "ஏற்றுகிறது...",
            visit: "இணையதளத்தைப் பார்க்கவும்",
            learn: "மேலும் அறிய",
            simulate: "மாற்றி அமைத்து பார்க்கவும்",
            reset: "உண்மையான சுயவிவரத்திற்கு திரும்புக"
        },
        summary: {
            total: "மொத்த திட்டங்கள்",
            eligible: "தகுதியுள்ளவை",
            fixable: "முயற்சி செய்யலாம்",
            noChance: "தகுதியில்லை"
        },
        simulation: {
            title: "கணிப்பு சோதனை (Simulation)",
            desc: "விவரங்களை மாற்றி வேறு திட்டங்களுக்கு தகுதி பெற முடியுமா என சோதிக்கவும்.",
            badge: "கணிப்பு முடிவு"
        },
        results: {
            heading: "உங்கள் முடிவுகள்",
            yourEligibility: "உங்களுக்கான திட்டங்கள்",
            analyzed: "ஆய்வு செய்யப்பட்டவை",
            eligible: "தகுதி உள்ளது",
            ineligible: "தகுதி இல்லை",
            fixable: "முயற்சி செய்யலாம்",
            nonFixable: "விதிமுறைகள் பொருந்தவில்லை",
            youQualify: "நீங்கள் தகுதி பெறலாம்",
            moreInfo: "மேலும் தகவல் தேவை",
            why: "ஏன்?",
            ruleBreakdown: "விதிகளின் விவரம்",
            required: "தேவை:",
            yourValue: "உங்கள் மதிப்பு:",
            simResults: "சோதனை மதிப்பு:",
            pass: "சரி",
            fail: "தவறு",
            empty: "உங்கள் விவரங்களுக்கு ஏற்ற திட்டங்கள் இல்லை.",
            privacy: "உங்கள் தகவல்கள் எங்கும் சேமிக்கப்படவில்லை.",
            simBadge: "கணிப்பு",
            analyzing: "உங்கள் விவரங்களை ஆய்வு செய்கிறோம்...",
            pleaseWait: "பொருத்தமான திட்டங்களைக் கண்டறிய காத்திருக்கவும்.",
            officialLimit: "அதிகபட்ச வருமான வரம்பு",
            limitDesc: "திட்டத்தின் அதிகாரப்பூர்வ வருமான வரம்பிற்குள் இருக்க வேண்டும்",
            incomeRef: "வருமான குறிப்பு (வரையறை)",
            refDesc: "சில சலுகைகளுக்கான பொதுவான வருமான வரம்பு",
            occCat: "உங்கள் பின்புலம்",
            occDesc: "இந்தத் திட்டம் யாருக்கானது என சரிபார்க்கிறோம்",
            finalEligibility: "இறுதித் தகுதி பின்வரும் வருமான வரம்பைப் பொறுத்தது:",
            indicativeTag: "குறிப்புக்கு மட்டும்",
            reference: "குறிப்பு"
        },
        rules: {
            targetGroup: "விண்ணப்பிக்க தகுதியானவர்கள்",
            incomeLimit: "அதிகபட்ச வருமானம்",
            ageLimit: "வயது வரம்பு",
            occupation: "உங்கள் தொழில்",
            category: "சமூகப் பிரிவு",
            indicative: "வழக்கமான வரம்பு",
            whoFor: "இந்தத் திட்டம் இவர்களுக்கானது:",
            yourProfile: "உங்கள் விவரம்:"
        },
        schemes: {
            'pm-kisan': {
                eligible: "நீங்கள் ஒரு விவசாயி மற்றும் வருமான வரம்பிற்குள் உள்ளீர்கள். ஆண்டுக்கு ₹6,000 பெறலாம்.",
                ineligible: "இது விவசாயிகளுக்கான திட்டம். உங்கள் தொழில் அல்லது வருமானம் இதற்கு பொருந்தவில்லை."
            },
            'pmjay': {
                eligible: "உங்கள் வருமானம் ₹5 லட்சத்திற்கு குறைவாக உள்ளது. ₹5 லட்சம் வரை இலவச மருத்துவம் பெறலாம்.",
                ineligible: "உங்கள் வருமானம் ₹5 லட்சத்திற்கு மேல் இருப்பதால், இந்த இலவச மருத்துவ திட்டத்திற்கு தகுதி இல்லை."
            },
            'nsp': {
                eligible: "மாணவரான உங்களுக்கு, வயது மற்றும் வருமான அடிப்படையில் கல்வி உதவித்தொகை கிடைக்கலாம்.",
                ineligible: "இது 16-35 வயதுடைய, குறைந்த வருமானம் கொண்ட மாணவர்களுக்கானது."
            },
            'pmay': {
                eligible: "வீடு கட்டும் மானியம் பெற உங்கள் வருமானம் தகுதியானது.",
                ineligible: "உங்கள் வருமானம் ₹18 லட்சத்திற்கு மேல் உள்ளது. எனவே மானியம் பெற முடியாது."
            }
        },
        errors: {
            limit: "பயன்பாட்டு வரம்பை அடைந்துவிட்டீர்கள். பக்கத்தைப் புதுப்பிக்கவும்.",
            general: "ஒலியை உருவாக்க முடியவில்லை."
        }
    },
    hi: {
        title: "अपनी पात्रता की जाँच करें",
        subtitle: "योजनाओं को खोजने के लिए कुछ आसान सवालों के जवाब दें",
        languageSelection: "अपनी भाषा चुनें",
        steps: {
            lang: "भाषा चुनें",
            basic: "बुनियादी जानकारी",
            loc: "स्थान और काम"
        },
        labels: {
            age: "उम्र",
            income: "सालाना परिवार की आय (₹)",
            state: "राज्य",
            category: "श्रेणी",
            occupation: "काम / व्यवसाय",
            selectState: "राज्य चुनें",
            selectOcc: "काम चुनें",
            optional: "(वैकल्पिक)"
        },
        buttons: {
            next: "आगे बढ़ें",
            back: "पीछे जाएं",
            check: "पात्रता देखें",
            edit: "बदलाव करें",
            startOver: "शुरू से करें",
            listen: "सुनें",
            loading: "लोड हो रहा है...",
            visit: "वेबसाइट पर जाएं",
            learn: "और जानें",
            simulate: "अनुमानित जांच (Simulate)",
            reset: "असली प्रोफाइल पर लौटें"
        },
        summary: {
            total: "कुल योजनाएं",
            eligible: "पात्र हैं",
            fixable: "सुधार संभव",
            noChance: "पात्र नहीं"
        },
        simulation: {
            title: "अनुमानित जांच (What-If)",
            desc: "विवरण बदलकर देखें कि क्या आप पात्र हो सकते हैं।",
            badge: "अनुमानित"
        },
        results: {
            heading: "आपके परिणाम",
            yourEligibility: "योजनाएं जिनके लिए आप पात्र हैं",
            analyzed: "जांची गई योजनाएं",
            eligible: "पात्र हैं",
            ineligible: "पात्र नहीं हैं",
            fixable: "सुधार संभव",
            nonFixable: "शर्तें पूरी नहीं हुईं",
            youQualify: "आप योग्य हो सकते हैं",
            moreInfo: "और जानकारी चाहिए",
            why: "क्यों?",
            ruleBreakdown: "नियमों का विवरण",
            required: "जरूरी:",
            yourValue: "आपकी जानकारी:",
            simResults: "सिम्युलेटेड मान:",
            pass: "पास",
            fail: "फेल",
            empty: "कोई योजना नहीं मिली।",
            privacy: "आपकी जानकारी कहीं भी सेव नहीं की गई है.",
            simBadge: "अनुमानित",
            analyzing: "आपकी प्रोफाइल जांची जा रही है...",
            pleaseWait: "कृपया प्रतीक्षा करें।",
            officialLimit: "आधिकारिक आय सीमा",
            limitDesc: "वार्षिक आय आधिकारिक योजना सीमा के भीतर होनी चाहिए",
            incomeRef: "आय संदर्भ (संकेतक)",
            refDesc: "कुछ लाभों के लिए सामान्य आय सीमा",
            occCat: "आपकी पृष्ठभूमि",
            occDesc: "यह योजना किसके लिए है - जांच हो रही है",
            finalEligibility: "अंतिम पात्रता आधिकारिक योजना आय सीमा पर आधारित है:",
            indicativeTag: "केवल सांकेतिक",
            reference: "संदर्भ"
        },
        rules: {
            targetGroup: "कौन आवेदन कर सकता है",
            incomeLimit: "अधिकतम आय",
            ageLimit: "उम्र सीमा",
            occupation: "आपका काम",
            category: "सामाजिक श्रेणी",
            indicative: "सामान्य सीमा",
            whoFor: "यह योजना इनके लिए है:",
            yourProfile: "आपकी जानकारी:"
        },
        schemes: {
            'pm-kisan': {
                eligible: "आप किसान हैं और आय सीमा के अंदर हैं। आपको सालाना ₹6,000 मिल सकते हैं।",
                ineligible: "यह योजना केवल किसानों के लिए है। आपका काम या आय इसके अनुकूल नहीं है।"
            },
            'pmjay': {
                eligible: "आपकी आय ₹5 लाख से कम है। आप ₹5 लाख तक के मुफ्त इलाज के लिए पात्र हैं।",
                ineligible: "आपकी आय ₹5 लाख से ज्यादा है, इसलिए आप इस मुफ्त इलाज योजना के लिए पात्र नहीं हैं।"
            },
            'nsp': {
                eligible: "आप एक छात्र हैं और आपकी उम्र और आय इस स्कॉलरशिप के लिए सही है।",
                ineligible: "यह 16-35 साल के कम आय वाले छात्रों के लिए है।"
            },
            'pmay': {
                eligible: "घर बनाने के लिए लोन सब्सिडी पाने हेतु आपकी आय सही है।",
                ineligible: "आपकी आय ₹18 लाख से ज्यादा है, इसलिए आप हाउसिंग सब्सिडी के लिए पात्र नहीं हैं।"
            }
        },
        errors: {
            limit: "आपने सीमा पार कर ली है। कृपया पेज को रिफ्रेश करें।",
            general: "ऑडियो नहीं चल पा रहा है।"
        }
    },
    te: {
        title: "అర్హతను చెక్ చేయండి",
        subtitle: "పథకాలను కనుగొనడానికి సాధారణ ప్రశ్నలకు సమాధానం ఇవ్వండి",
        languageSelection: "మీ భాషను ఎంచుకోండి",
        steps: {
            lang: "భాషను ఎంచుకోండి",
            basic: "ప్రాథమిక వివరాలు",
            loc: "ప్రాంతం మరియు వృత్తి"
        },
        labels: {
            age: "వయస్సు",
            income: "కుటుంబ వార్షిక ఆదాయం (₹)",
            state: "రాష్ట్రం",
            category: "వర్గం",
            occupation: "వృత్తి",
            selectState: "రాష్ట్రాన్ని ఎంచుకోండి",
            selectOcc: "వృత్తిని ఎంచుకోండి",
            optional: "(ఐచ్ఛికం)"
        },
        buttons: {
            next: "ముందుకు",
            back: "వెనుకకు",
            check: "చెక్ చేయండి",
            edit: "మార్చండి",
            startOver: "మొదటి నుండి",
            listen: "వినండి",
            loading: "లోడ్ అవుతోంది...",
            visit: "వెబ్‌సైట్‌ను చూడండి",
            learn: "మరిన్ని వివరాలు",
            simulate: "ఫలితాలను ఊహించండి (Simulate)",
            reset: "నిజమైన వివరాలకు తిరిగి రండి"
        },
        summary: {
            total: "కనుగొన్న పథకాలు",
            eligible: "అర్హత ఉన్నవి",
            fixable: "మారితే అర్హత పొందవచ్చు",
            noChance: "అర్హత లేదు"
        },
        simulation: {
            title: "ఊహించి చూడండి (What-If)",
            desc: "మీ వివరాలను మార్చి అర్హతను పరిశీలించండి.",
            badge: "ఊహించినది"
        },
        results: {
            heading: "మీ ఫలితాలు",
            yourEligibility: "మీకు వర్తించే పథకాలు",
            analyzed: "పరిశీలించినవి",
            eligible: "అర్హత ఉంది",
            ineligible: "అర్హత లేదు",
            fixable: "మారితే అర్హత పొందవచ్చు",
            nonFixable: "నిబంధనలు పాటించలేదు",
            youQualify: "మీరు అర్హత పొందవచ్చు",
            moreInfo: "మరింత సమాచారం అవసరం",
            why: "ఎందుకు?",
            ruleBreakdown: "నియమ వివరాలు",
            required: "కావలసినవి:",
            yourValue: "మీ వివరాలు:",
            simResults: "పరీక్షా విలువ:",
            pass: "విజయం",
            fail: "విఫలం",
            empty: "మీకు సరిపోయే పథకాలు ఏవీ లేవు.",
            privacy: "మీ సమాచారం ఎక్కడా సేవ్ చేయబడదు.",
            simBadge: "ఊహించినది",
            analyzing: "మీ వివరాలను పరిశీలిస్తున్నాము...",
            pleaseWait: "దయచేసి వేచి ఉండండి.",
            officialLimit: "అధికారిక ఆదాయ పరిమితి",
            limitDesc: "వార్షిక ఆదాయం పథక పరిమితిలో ఉండాలి",
            incomeRef: "ఆదాయ సూచన (ఉజ్జాయింపు)",
            refDesc: "కొన్ని ప్రయోజనాల కోసం సాధారణ ఆదాయ పరిమితి",
            occCat: "మీ నేపథ్యం",
            occDesc: "ఈ పథకం ఎవరికి అనేది తనిఖీ చేస్తోంది",
            finalEligibility: "అంతిమ అర్హత అధికారిక ఆదాయ పరిమితిపై ఆధారపడి ఉంటుంది:",
            indicativeTag: "సూచన మాత్రమే",
            reference: "సూచన"
        },
        rules: {
            targetGroup: "ఎవరు దరఖాస్తు చేయవచ్చు",
            incomeLimit: "గరిష్ట ఆదాయం",
            ageLimit: "వయస్సు పరిమితి",
            occupation: "మీ వృత్తి",
            category: "సామాజిక వర్గం",
            indicative: "సాధారణ పరిమితి",
            whoFor: "ఈ పథకం వీరి కోసం:",
            yourProfile: "మీ వివరాలు:"
        },
        schemes: {
            'pm-kisan': {
                eligible: "మీరు రైతు మరియు ఆదాయ పరిమితిలో ఉన్నారు. మీకు ఏటా ₹6,000 లభిస్తుంది.",
                ineligible: "ఇది రైతుల కోసం మాత్రమే. మీ వృత్తి లేదా ఆదాయం దీనికి సరిపోదు."
            },
            'pmjay': {
                eligible: "మీ ఆదాయం ₹5 లక్షల కంటే తక్కువ. మీరు ₹5 లక్షల వరకు ఉచిత వైద్య బీమా పొందవచ్చు.",
                ineligible: "మీ ఆదాయం ₹5 లక్షల కంటే ఎక్కువ ఉన్నందున, మీరు ఈ ఉచిత వైద్య పథకానికి అనర్హులు."
            },
            'nsp': {
                eligible: "విద్యార్థిగా, మీ వయస్సు మరియు ఆదాయం ఆధారంగా మీరు స్కాలర్‌షిప్‌కు అర్హులు.",
                ineligible: "ఇది 16-35 సంవత్సరాల తక్కువ ఆదాయం ఉన్న విద్యార్థుల కోసం."
            },
            'pmay': {
                eligible: "ఇంటి రుణ రాయితీ పొందడానికి మీ ఆదాయం సరిపోతుంది.",
                ineligible: "మీ ఆదాయం ₹18 లక్షల కంటే ఎక్కువ, కాబట్టి మీరు రాయితీ పొందలేరు."
            }
        },
        errors: {
            limit: "మీరు పరిమితిని దాటారు. దయచేసి పేజీని రీఫ్రెష్ చేయండి.",
            general: "ఆడియో ప్లే కాలేదు."
        }
    }
};
