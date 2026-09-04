// Comprehensive native language voice prompts for all 12 major Indian languages + English
// Used by VoiceEligibilityAssistantModal and EligibilityCheckerForm so AI speaks directly in citizen's native language

export interface NativePromptSet {
  step1: string;
  step2: string;
  step3: string;
  step4: string;
  fullName: { title: string; prompt: string; example: string };
  age: { title: string; prompt: string; example: string };
  gender: { title: string; prompt: string; example: string };
  state: { title: string; prompt: string; example: string };
  district: { title: string; prompt: string; example: string };
  annualFamilyIncome: { title: string; prompt: string; example: string };
  socialCategory: { title: string; prompt: string; example: string };
  maritalStatus: { title: string; prompt: string; example: string };
  hasBplRationCard: { title: string; prompt: string; example: string };
  occupation: { title: string; prompt: string; example: string };
  highestEducation: { title: string; prompt: string; example: string };
  isFarmer: { title: string; prompt: string; example: string };
  isActiveStudent: { title: string; prompt: string; example: string };
  isSeniorCitizen: { title: string; prompt: string; example: string };
  isDisabilityPwD: { title: string; prompt: string; example: string };
  isMinority: { title: string; prompt: string; example: string };
  isExServiceman: { title: string; prompt: string; example: string };
}

export const NATIVE_PROMPTS: Record<string, NativePromptSet> = {
  // English
  en: {
    step1: 'Step 1: Personal Information. Please specify your name, age, gender, state, and district.',
    step2: 'Step 2: Family and Economic Status. Specify annual income, social category, and ration card.',
    step3: 'Step 3: Professional and Education Profile. Specify occupation, education, and farmer or student status.',
    step4: 'Step 4: Special Beneficiary Categories. Disability, minority, and ex-serviceman status.',
    fullName: {
      title: 'What is your Full Name?',
      prompt: 'Please speak your full name clearly.',
      example: 'e.g. "Rahul Sharma" or "Pooja Verma"',
    },
    age: {
      title: 'What is your Age in years?',
      prompt: 'Please speak your age in years.',
      example: 'e.g. "28" or "twenty eight"',
    },
    gender: {
      title: 'What is your Gender?',
      prompt: 'Please speak your gender: Male, Female, or Transgender.',
      example: 'e.g. "Male", "Female", or "Transgender"',
    },
    state: {
      title: 'Which State do you live in?',
      prompt: 'Please speak your state of residence.',
      example: 'e.g. "Maharashtra", "Telangana", "Uttar Pradesh"',
    },
    district: {
      title: 'Which District or City?',
      prompt: 'Please speak your district or city name.',
      example: 'e.g. "Hyderabad", "Pune", "Patna", "Jaipur"',
    },
    annualFamilyIncome: {
      title: 'What is your Annual Family Income?',
      prompt: 'Please speak your approximate family income per year in rupees.',
      example: 'e.g. "2.5 lakhs", "50 thousand", or "250000"',
    },
    socialCategory: {
      title: 'What is your Social Category?',
      prompt: 'Please speak your social category: General, OBC, SC, ST, or EWS.',
      example: 'e.g. "General", "OBC", "SC", "ST", or "EWS"',
    },
    maritalStatus: {
      title: 'What is your Marital Status?',
      prompt: 'Please speak your marital status: Married, Unmarried, Widowed, or Divorced.',
      example: 'e.g. "Unmarried", "Married"',
    },
    hasBplRationCard: {
      title: 'Do you have a BPL or Antyodaya Ration Card?',
      prompt: 'Do you possess a BPL or Antyodaya ration card? Please speak Yes or No.',
      example: 'Speak "Yes" or "No"',
    },
    occupation: {
      title: 'What is your primary Occupation?',
      prompt: 'Are you a farmer, student, artisan, private employee, or job seeker?',
      example: 'e.g. "Farmer", "Student", "Self-Employed", "Homemaker"',
    },
    highestEducation: {
      title: 'Highest Education Attained?',
      prompt: 'Please speak your highest education level, such as 10th pass, 12th pass, or Graduate.',
      example: 'e.g. "10th Pass", "Graduate"',
    },
    isFarmer: {
      title: 'Are you a Farmer or Landowner?',
      prompt: 'Are you an agricultural farmer or landowner? Speak Yes or No.',
      example: 'Speak "Yes" or "No"',
    },
    isActiveStudent: {
      title: 'Are you an Active Student?',
      prompt: 'Are you currently an active student in school, college, or university? Speak Yes or No.',
      example: 'Speak "Yes" or "No"',
    },
    isSeniorCitizen: {
      title: 'Are you a Senior Citizen (60+)?',
      prompt: 'Are you a senior citizen aged 60 or above? Speak Yes or No.',
      example: 'Speak "Yes" or "No"',
    },
    isDisabilityPwD: {
      title: 'Person with Disability (40%+)?',
      prompt: 'Do you have a certified disability of 40% or more? Speak Yes or No.',
      example: 'Speak "Yes" or "No"',
    },
    isMinority: {
      title: 'Minority Community Member?',
      prompt: 'Do you belong to a notified religious minority community in India? Speak Yes or No.',
      example: 'Speak "Yes" or "No"',
    },
    isExServiceman: {
      title: 'Ex-Serviceman or Defense Dependent?',
      prompt: 'Are you an ex-serviceman or defense dependent? Speak Yes or No.',
      example: 'Speak "Yes" or "No"',
    },
  },

  // Hindi (हिन्दी)
  hi: {
    step1: 'चरण 1: व्यक्तिगत जानकारी। कृपया अपना नाम, उम्र, लिंग, राज्य और जिला बताएं।',
    step2: 'चरण 2: पारिवारिक एवं आर्थिक स्थिति। वार्षिक आय, सामाजिक श्रेणी और राशन कार्ड बताएं।',
    step3: 'चरण 3: व्यवसाय और शिक्षा। अपना मुख्य कार्य और शिक्षा का स्तर बताएं।',
    step4: 'चरण 4: विशेष लाभार्थी श्रेणी। दिव्यांगता, अल्पसंख्यक, या पूर्व सैनिक विवरण बताएं।',
    fullName: {
      title: 'आपका पूरा नाम क्या है?',
      prompt: 'कृपया अपना पूरा नाम स्पष्ट रूप से बोलें।',
      example: 'जैसे: "राहुल शर्मा" या "पूजा वर्मा"',
    },
    age: {
      title: 'आपकी उम्र कितने वर्ष है?',
      prompt: 'कृपया अपनी उम्र वर्षों में बोलें।',
      example: 'जैसे: "28" या "अट्ठाइस साल"',
    },
    gender: {
      title: 'आपका लिंग क्या है?',
      prompt: 'कृपया अपना लिंग बताएं: पुरुष, महिला, या ट्रांसजेंडर।',
      example: 'जैसे: "पुरुष", "महिला", या "ट्रांसजेंडर"',
    },
    state: {
      title: 'आप किस राज्य में रहते हैं?',
      prompt: 'कृपया अपने राज्य का नाम बोलें।',
      example: 'जैसे: "उत्तर प्रदेश", "महाराष्ट्र", "बिहार"',
    },
    district: {
      title: 'आपका जिला या शहर कौन सा है?',
      prompt: 'कृपया अपने जिले या शहर का नाम बोलें।',
      example: 'जैसे: "लखनऊ", "पुणे", "पटना", "जयपुर"',
    },
    annualFamilyIncome: {
      title: 'आपकी वार्षिक पारिवारिक आय कितनी है?',
      prompt: 'कृपया अपने परिवार की कुल वार्षिक आय रुपयों में बोलें।',
      example: 'जैसे: "ढाई लाख", "पचास हजार", या "250000"',
    },
    socialCategory: {
      title: 'आपकी सामाजिक श्रेणी क्या है?',
      prompt: 'कृपया अपनी श्रेणी बताएं: जनरल, ओबीसी, एससी, एसटी, या ईडब्ल्यूएस।',
      example: 'जैसे: "ओबीसी", "एससी", "जनरल"',
    },
    maritalStatus: {
      title: 'आपकी वैवाहिक स्थिति क्या है?',
      prompt: 'कृपया वैवाहिक स्थिति बताएं: विवाहित, अविवाहित, विधवा, या तलाकशुदा।',
      example: 'जैसे: "विवाहित", "अविवाहित"',
    },
    hasBplRationCard: {
      title: 'क्या आपके पास बीपीएल राशन कार्ड है?',
      prompt: 'क्या आपके पास बीपीएल या अंत्योदय राशन कार्ड है? हाँ या नहीं बोलें।',
      example: '"हाँ" या "नहीं" बोलें',
    },
    occupation: {
      title: 'आपका मुख्य व्यवसाय क्या है?',
      prompt: 'क्या आप किसान, छात्र, व्यापारी, निजी कर्मचारी या नौकरी खोज रहे हैं?',
      example: 'जैसे: "किसान", "छात्र", "दुकानदार"',
    },
    highestEducation: {
      title: 'आपकी उच्चतम शिक्षा क्या है?',
      prompt: 'कृपया अपनी उच्चतम शिक्षा बताएं, जैसे 10वीं पास, 12वीं पास या स्नातक।',
      example: 'जैसे: "10वीं पास", "ग्रेजुएट"',
    },
    isFarmer: {
      title: 'क्या आप किसान या जमीन मालिक हैं?',
      prompt: 'क्या आप किसान या कृषि भूमि मालिक हैं? हाँ या नहीं बोलें।',
      example: '"हाँ" या "नहीं" बोलें',
    },
    isActiveStudent: {
      title: 'क्या आप वर्तमान में छात्र हैं?',
      prompt: 'क्या आप वर्तमान में स्कूल या कॉलेज में पढ़ाई कर रहे हैं? हाँ या नहीं बोलें।',
      example: '"हाँ" या "नहीं" बोलें',
    },
    isSeniorCitizen: {
      title: 'क्या आप वरिष्ठ नागरिक (60+) हैं?',
      prompt: 'क्या आपकी उम्र 60 वर्ष या उससे अधिक है? हाँ या नहीं बोलें।',
      example: '"हाँ" या "नहीं" बोलें',
    },
    isDisabilityPwD: {
      title: 'क्या आप दिव्यांग व्यक्ति हैं?',
      prompt: 'क्या आपके पास 40 प्रतिशत या अधिक दिव्यांगता प्रमाण पत्र है? हाँ या नहीं बोलें।',
      example: '"हाँ" या "नहीं" बोलें',
    },
    isMinority: {
      title: 'अल्पसंख्यक समुदाय के सदस्य?',
      prompt: 'क्या आप अधिसूचित अल्पसंख्यक समुदाय से आते हैं? हाँ या नहीं बोलें।',
      example: '"हाँ" या "नहीं" बोलें',
    },
    isExServiceman: {
      title: 'पूर्व सैनिक या रक्षा आश्रित?',
      prompt: 'क्या आप पूर्व सैनिक या रक्षा कर्मी के आश्रित हैं? हाँ या नहीं बोलें।',
      example: '"हाँ" या "नहीं" बोलें',
    },
  },

  // Telugu (తెలుగు)
  te: {
    step1: 'దశ 1: వ్యక్తిగత సమాచారం. దయచేసి మీ పేరు, వయస్సు, లింగం, రాష్ట్రం మరియు జిల్లా తెలపండి.',
    step2: 'దశ 2: కుటుంబం మరియు ఆర్థిక స్థితి. వార్షిక ఆదాయం, సామాజిక వర్గం, రేషన్ కార్డు వివరాలు.',
    step3: 'దశ 3: వృత్తి మరియు విద్య. మీ ముఖ్య వృత్తి మరియు విద్యార్హత తెలపండి.',
    step4: 'దశ 4: ప్రత్యేక వర్గం. దివ్యాంగులు, మైనారిటీ, మాజీ సైనికుల వివరాలు.',
    fullName: {
      title: 'మీ పూర్తి పేరు ఏమిటి?',
      prompt: 'దయచేసి మీ పూర్తి పేరును స్పష్టంగా చెప్పండి.',
      example: 'ఉదాహరణకు: "రాహుల్ శర్మ" లేదా "సురేష్ రెడ్డి"',
    },
    age: {
      title: 'మీ వయస్సు ఎన్ని సంవత్సరాలు?',
      prompt: 'దయచేసి మీ వయస్సును సంవత్సరాలలో చెప్పండి.',
      example: 'ఉదాహరణకు: "28" లేదా "ఇరవై ఎనిమిది"',
    },
    gender: {
      title: 'మీ లింగం ఏమిటి?',
      prompt: 'దయచేసి మీ లింగం చెప్పండి: పురుషుడు, స్త్రీ, లేదా ఇతరులు.',
      example: 'ఉదాహరణకు: "పురుషుడు", "స్త్రీ"',
    },
    state: {
      title: 'మీరు ఏ రాష్ట్రంలో నివసిస్తున్నారు?',
      prompt: 'దయచేసి మీ నివాస రాష్ట్రాన్ని చెప్పండి.',
      example: 'ఉదాహరణకు: "తెలంగాణ", "ఆంధ్రప్రదేశ్"',
    },
    district: {
      title: 'మీ జిల్లా లేదా నగరం ఏమిటి?',
      prompt: 'దయచేసి మీ జిల్లా లేదా నగరం పేరు చెప్పండి.',
      example: 'ఉదాహరణకు: "హైదరాబాద్", "విజయవాడ", "వరంగల్"',
    },
    annualFamilyIncome: {
      title: 'మీ వార్షిక కుటుంబ ఆదాయం ఎంత?',
      prompt: 'దయచేసి మీ కుటుంబ మొత్తం వార్షిక ఆదాయాన్ని రూపాయలలో చెప్పండి.',
      example: 'ఉదాహరణకు: "రెండున్నర లక్షలు", "యాభై వేలు", "250000"',
    },
    socialCategory: {
      title: 'మీ సామాజిక వర్గం ఏమిటి?',
      prompt: 'దయచేసి మీ వర్గాన్ని చెప్పండి: జనరల్, ఓబీసీ, ఎస్సీ, ఎస్టీ, లేదా ఈడబ్ల్యూఎస్.',
      example: 'ఉదాహరణకు: "బీసీ", "ఎస్సీ", "ఓసీ"',
    },
    maritalStatus: {
      title: 'మీ వైవాహిక స్థితి ఏమిటి?',
      prompt: 'దయచేసి చెప్పండి: వివాహితులు, అవివాహితులు, వితంతువు, లేదా విడాకులు తీసుకున్నవారు.',
      example: 'ఉదాహరణకు: "వివాహితుడు", "అవివాహితుడు"',
    },
    hasBplRationCard: {
      title: 'మీకు బీపీఎల్ రేషన్ కార్డు ఉందా?',
      prompt: 'మీ వద్ద బీపీఎల్ లేదా అంత్యోదయ తెల్ల రేషన్ కార్డు ఉందా? అవును లేదా కాదు అని చెప్పండి.',
      example: '"అవును" లేదా "కాదు" చెప్పండి',
    },
    occupation: {
      title: 'మీ ప్రధాన వృత్తి ఏమిటి?',
      prompt: 'మీరు రైతా, విద్యార్థినా, వ్యాపారస్థుడా, ఉద్యోగా లేదా నిరుద్యోగా?',
      example: 'ఉదాహరణకు: "రైతు", "విద్యార్థి", "ఉద్యోగి"',
    },
    highestEducation: {
      title: 'మీ అత్యున్నత విద్యార్హత ఏమిటి?',
      prompt: 'దయచేసి మీ విద్యార్హత చెప్పండి: 10వ తరగతి, ఇంటర్, లేదా డిగ్రీ.',
      example: 'ఉదాహరణకు: "టెన్త్ పాస్", "గ్రాడ్యుయేట్"',
    },
    isFarmer: {
      title: 'మీరు రైతా లేదా వ్యవసాయ భూమి ఉందా?',
      prompt: 'మీరు రైతు లేదా భూయజమానా? అవును లేదా కాదు అని చెప్పండి.',
      example: '"అవును" లేదా "కాదు" చెప్పండి',
    },
    isActiveStudent: {
      title: 'మీరు ప్రస్తుతం చదువుకుంటున్నారా?',
      prompt: 'మీరు ప్రస్తుతం పాఠశాల లేదా కళాశాల విద్యార్థినా? అవును లేదా కాదు అని చెప్పండి.',
      example: '"అవును" లేదా "కాదు" చెప్పండి',
    },
    isSeniorCitizen: {
      title: 'మీరు సీనియర్ సిటిజనా (60+)?',
      prompt: 'మీ వయస్సు 60 సంవత్సరాలు లేదా అంతకంటే ఎక్కువ ఉందా? అవును లేదా కాదు అని చెప్పండి.',
      example: '"అవును" లేదా "కాదు" చెప్పండి',
    },
    isDisabilityPwD: {
      title: 'మీరు దివ్యాంగులా (40%+)?',
      prompt: 'మీకు 40 శాతం లేదా అంతకంటే ఎక్కువ అంగవైకల్య ధృవీకరణ పత్రం ఉందా? అవును లేదా కాదు చెప్పండి.',
      example: '"అవును" లేదా "కాదు" చెప్పండి',
    },
    isMinority: {
      title: 'మైనారిటీ వర్గానికి చెందినవారా?',
      prompt: 'మీరు మైనారిటీ వర్గానికి చెందినవారా? అవును లేదా కాదు చెప్పండి.',
      example: '"అవును" లేదా "కాదు" చెప్పండి',
    },
    isExServiceman: {
      title: 'మాజీ సైనికులు లేదా వారి కుటుంబీకులా?',
      prompt: 'మీరు మాజీ సైనికులా లేదా వారిపై ఆధారపడినవారా? అవును లేదా కాదు చెప్పండి.',
      example: '"అవును" లేదా "కాదు" చెప్పండి',
    },
  },

  // Tamil (தமிழ்)
  ta: {
    step1: 'படி 1: தனிப்பட்ட விவரங்கள். உங்கள் பெயர், வயது, பாலினம், மாநிலம் மற்றும் மாவட்டத்தை கூறவும்.',
    step2: 'படி 2: குடும்பம் மற்றும் பொருளாதார நிலை. ஆண்டு வருமானம், சமூகப் பிரிவு, குடும்ப அட்டை விவரங்கள்.',
    step3: 'படி 3: தொழில் மற்றும் கல்வி. உங்கள் முதன்மை தொழில் மற்றும் கல்வித் தகுதியை கூறவும்.',
    step4: 'படி 4: சிறப்புப் பயனாளிகள். மாற்றுத்திறனாளி, சிறுபான்மையினர் அல்லது முன்னாள் ராணுவத்தினர் விவரங்கள்.',
    fullName: {
      title: 'உங்கள் முழுப் பெயர் என்ன?',
      prompt: 'தயவுசெய்து உங்கள் முழுப் பெயரை தெளிவாகக் கூறவும்.',
      example: 'எ.கா: "கார்த்திக் ராஜா" அல்லது "பிரியா"',
    },
    age: {
      title: 'உங்கள் வயது என்ன?',
      prompt: 'தயவுசெய்து உங்கள் வயதை வருடங்களில் கூறவும்.',
      example: 'எ.கா: "28" அல்லது "இருபத்தி எட்டு"',
    },
    gender: {
      title: 'உங்கள் பாலினம் என்ன?',
      prompt: 'உங்கள் பாலினத்தைக் கூறவும்: ஆண், பெண், அல்லது திருநங்கை.',
      example: 'எ.கா: "ஆண்", "பெண்"',
    },
    state: {
      title: 'நீங்கள் எந்த மாநிலத்தில் வசிக்கிறீர்கள்?',
      prompt: 'தயவுசெய்து உங்கள் மாநிலத்தின் பெயரைக் கூறவும்.',
      example: 'எ.கா: "தமிழ்நாடு", "புதுச்சேரி"',
    },
    district: {
      title: 'உங்கள் மாவட்டம் அல்லது நகரம் எது?',
      prompt: 'தயவுசெய்து உங்கள் மாவட்டம் அல்லது நகரத்தின் பெயரைக் கூறவும்.',
      example: 'எ.கா: "சென்னை", "மதுரை", "கோயம்புத்தூர்"',
    },
    annualFamilyIncome: {
      title: 'உங்கள் குடும்ப ஆண்டு வருமானம் எவ்வளவு?',
      prompt: 'தயவுசெய்து உங்கள் குடும்பத்தின் மொத்த ஆண்டு வருமானத்தை ரூபாயில் கூறவும்.',
      example: 'எ.கா: "இரண்டரை லட்சம்", "50 ஆயிரம்", "250000"',
    },
    socialCategory: {
      title: 'உங்கள் சமூகப் பிரிவு என்ன?',
      prompt: 'உங்கள் பிரிவைக் கூறவும்: பொது, பிசி/ஓபிசி, எஸ்சி, எஸ்டி, அல்லது இ.டபிள்யூ.எஸ்.',
      example: 'எ.கா: "பிசி", "எஸ்சி", "எஸ்டி"',
    },
    maritalStatus: {
      title: 'உங்கள் திருமண நிலை என்ன?',
      prompt: 'தயவுசெய்து கூறவும்: திருமணமானவர், திருமணமாகாதவர், விதவை, அல்லது விவாகரத்து பெற்றவர்.',
      example: 'எ.கா: "திருமணமானவர்", "திருமணமாகாதவர்"',
    },
    hasBplRationCard: {
      title: 'உங்களிடம் பி.பி.எல் ரேஷன் கார்டு உள்ளதா?',
      prompt: 'உங்களிடம் வறுமைக் கோட்டிற்கு கீழ் உள்ள அல்லது அந்த்யோதயா ரேஷன் அட்டை உள்ளதா? ஆம் அல்லது இல்லை என்று கூறவும்.',
      example: '"ஆம்" அல்லது "இல்லை" என்று கூறவும்',
    },
    occupation: {
      title: 'உங்கள் முதன்மை தொழில் என்ன?',
      prompt: 'நீங்கள் விவசாயியா, மாணவரா, வணிகரா, பணியாளரா அல்லது வேலை தேடுபவரா?',
      example: 'எ.கா: "விவசாயி", "மாணவர்", "சுயதொழில்"',
    },
    highestEducation: {
      title: 'உங்கள் கல்வித் தகுதி என்ன?',
      prompt: 'உங்கள் கல்வித் தகுதியைக் கூறவும்: 10-ஆம் வகுப்பு, 12-ஆம் வகுப்பு அல்லது பட்டதாரி.',
      example: 'எ.கா: "10-ஆம் வகுப்பு", "பட்டதாரி"',
    },
    isFarmer: {
      title: 'நீங்கள் விவசாயியா அல்லது நில உரிமையாளரா?',
      prompt: 'நீங்கள் விவசாயியா அல்லது விவசாய நிலம் உள்ளவரா? ஆம் அல்லது இல்லை என்று கூறவும்.',
      example: '"ஆம்" அல்லது "இல்லை" என்று கூறவும்',
    },
    isActiveStudent: {
      title: 'நீங்கள் இப்போது படித்து வருகிறீர்களா?',
      prompt: 'நீங்கள் தற்போது பள்ளி அல்லது கல்லூரி மாணவரா? ஆம் அல்லது இல்லை என்று கூறவும்.',
      example: '"ஆம்" அல்லது "இல்லை" என்று கூறவும்',
    },
    isSeniorCitizen: {
      title: 'நீங்கள் மூத்த குடிமகனா (60+)?',
      prompt: 'உங்கள் வயது 60 அல்லது அதற்கு மேல் உள்ளதா? ஆம் அல்லது இல்லை என்று கூறவும்.',
      example: '"ஆம்" அல்லது "இல்லை" என்று கூறவும்',
    },
    isDisabilityPwD: {
      title: 'மாற்றுத்திறனாளியா (40%+)?',
      prompt: 'உங்களிடம் 40% அல்லது அதற்கு மேற்பட்ட மாற்றுத்திறனாளி சான்றிதழ் உள்ளதா? ஆம் அல்லது இல்லை என்று கூறவும்.',
      example: '"ஆம்" அல்லது "இல்லை" என்று கூறவும்',
    },
    isMinority: {
      title: 'சிறுபான்மையினர் பிரிவைச் சேர்ந்தவரா?',
      prompt: 'நீங்கள் சிறுபான்மையினர் சமூகத்தைச் சேர்ந்தவரா? ஆம் அல்லது இல்லை என்று கூறவும்.',
      example: '"ஆம்" அல்லது "இல்லை" என்று கூறவும்',
    },
    isExServiceman: {
      title: 'முன்னாள் ராணுவத்தினரா?',
      prompt: 'நீங்கள் முன்னாள் ராணுவத்தினரா அல்லது ராணுவ குடும்பத்தைச் சார்ந்தவரா? ஆம் அல்லது இல்லை என்று கூறவும்.',
      example: '"ஆம்" அல்லது "இல்லை" என்று கூறவும்',
    },
  },

  // Kannada (ಕನ್ನಡ)
  kn: {
    step1: 'ಹಂತ 1: ವೈಯಕ್ತಿಕ ಮಾಹಿತಿ. ನಿಮ್ಮ ಹೆಸರು, ವಯಸ್ಸು, ಲಿಂಗ, ರಾಜ್ಯ ಮತ್ತು ಜಿಲ್ಲೆಯನ್ನು ತಿಳಿಸಿ.',
    step2: 'ಹಂತ 2: ಕುಟುಂಬ ಮತ್ತು ಆರ್ಥಿಕ ಸ್ಥಿತಿ. ವಾರ್ಷಿಕ ಆದಾಯ, ಸಾಮಾಜಿಕ ವರ್ಗ ಮತ್ತು ರೇಷನ್ ಕಾರ್ಡ್ ವಿವರಗಳು.',
    step3: 'ಹಂತ 3: ವೃತ್ತಿ ಮತ್ತು ಶಿಕ್ಷಣ. ನಿಮ್ಮ ಮುಖ್ಯ ವೃತ್ತಿ ಮತ್ತು ಶಿಕ್ಷಣದ ವಿವರ ನೀಡಿ.',
    step4: 'ಹಂತ 4: ವಿಶೇಷ ಫಲಾನುಭವಿ ವರ್ಗ. ಅಂಗವಿಕಲತೆ, ಅಲ್ಪಸಂಖ್ಯಾತರು ಅಥವಾ ನಿವೃತ್ತ ಯೋಧರ ವಿವರ.',
    fullName: {
      title: 'ನಿಮ್ಮ ಪೂರ್ಣ ಹೆಸರು ಏನು?',
      prompt: 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ಪೂರ್ಣ ಹೆಸರನ್ನು ಸ್ಪಷ್ಟವಾಗಿ ಹೇಳಿ.',
      example: 'ಉದಾ: "ಮಹೇಶ್ ಕುಮಾರ್" ಅಥವಾ "ಪ್ರಿಯಾ ಗೌಡ"',
    },
    age: {
      title: 'ನಿಮ್ಮ ವಯಸ್ಸು ಎಷ್ಟು?',
      prompt: 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ವಯಸ್ಸನ್ನು ವರ್ಷಗಳಲ್ಲಿ ತಿಳಿಸಿ.',
      example: 'ಉದಾ: "28" ಅಥವಾ "ಇಪ್ಪತ್ತೆಂಟು"',
    },
    gender: {
      title: 'ನಿಮ್ಮ ಲಿಂಗ ಯಾವುದು?',
      prompt: 'ದಯವಿಟ್ಟು ತಿಳಿಸಿ: ಪುರುಷ, ಮಹಿಳೆ, ಅಥವಾ ತೃತೀಯ ಲಿಂಗ.',
      example: 'ಉದಾ: "ಪುರುಷ", "ಮಹಿಳೆ"',
    },
    state: {
      title: 'ನೀವು ಯಾವ ರಾಜ್ಯದಲ್ಲಿ ವಾಸಿಸುತ್ತಿದ್ದೀರಿ?',
      prompt: 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ರಾಜ್ಯದ ಹೆಸರನ್ನು ಹೇಳಿ.',
      example: 'ಉದಾ: "ಕರ್ನಾಟಕ"',
    },
    district: {
      title: 'ನಿಮ್ಮ ಜಿಲ್ಲೆ ಅಥವಾ ಊರು ಯಾವುದು?',
      prompt: 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ಜಿಲ್ಲೆ ಅಥವಾ ನಗರದ ಹೆಸರನ್ನು ಹೇಳಿ.',
      example: 'ಉದಾ: "ಬೆಂಗಳೂರು", "ಮೈಸೂರು", "ಹುಬ್ಬಳ್ಳಿ"',
    },
    annualFamilyIncome: {
      title: 'ನಿಮ್ಮ ಕುಟುಂಬದ ವಾರ್ಷಿಕ ಆದಾಯ ಎಷ್ಟು?',
      prompt: 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ಕುಟುಂಬದ ಒಟ್ಟು ವಾರ್ಷಿಕ ಆದಾಯವನ್ನು ರೂಪಾಯಿಗಳಲ್ಲಿ ಹೇಳಿ.',
      example: 'ಉದಾ: "ಎರಡೂವರೆ ಲಕ್ಷ", "50 ಸಾವಿರ", "250000"',
    },
    socialCategory: {
      title: 'ನಿಮ್ಮ ಸಾಮಾಜಿಕ ವರ್ಗ ಯಾವುದು?',
      prompt: 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ವರ್ಗವನ್ನು ಹೇಳಿ: ಸಾಮಾನ್ಯ, ಒಬಿಸಿ, ಎಸ್ಸಿ, ಎಸ್ಟಿ, ಅಥವಾ ಇ.ಡಬ್ಲ್ಯೂ.ಎಸ್.',
      example: 'ಉದಾ: "ಒಬಿಸಿ", "ಎಸ್ಸಿ", "ಎಸ್ಟಿ"',
    },
    maritalStatus: {
      title: 'ನಿಮ್ಮ ವೈವಾಹಿಕ ಸ್ಥಿತಿ ಏನು?',
      prompt: 'ದಯವಿಟ್ಟು ಹೇಳಿ: ವಿವಾಹಿತ, ಅವಿವಾಹಿತ, ವಿಧವೆ, ಅಥವಾ ವಿಚ್ಛೇದಿತ.',
      example: 'ಉದಾ: "ವಿವಾಹಿತ", "ಅವಿವಾಹಿತ"',
    },
    hasBplRationCard: {
      title: 'ನಿಮ್ಮ ಬಳಿ ಬಿಪಿಎಲ್ ರೇಷನ್ ಕಾರ್ಡ್ ಇದೆಯೇ?',
      prompt: 'ನಿಮ್ಮ ಬಳಿ ಬಿಪಿಎಲ್ ಅಥವಾ ಅಂತ್ಯೋದಯ ಪಡಿತರ ಚೀಟಿ ಇದೆಯೇ? ಹೌದು ಅಥವಾ ಇಲ್ಲ ಎಂದು ಹೇಳಿ.',
      example: '"ಹೌದು" ಅಥವಾ "ಇಲ್ಲ" ಎಂದು ಹೇಳಿ',
    },
    occupation: {
      title: 'ನಿಮ್ಮ ಮುಖ್ಯ ಕಸುಬು ಅಥವಾ ಉದ್ಯೋಗವೇನು?',
      prompt: 'ನೀವು ರೈತರೇ, ವಿದ್ಯಾರ್ಥಿಯೇ, ವ್ಯಾಪಾರಿಯೇ, ನೌಕರರೇ ಅಥವಾ ನಿರುದ್ಯೋಗಿಯೇ?',
      example: 'ಉದಾ: "ರೈತ", "ವಿದ್ಯಾರ್ಥಿ", "ಸ್ವಯಂ ಉದ್ಯೋಗ"',
    },
    highestEducation: {
      title: 'ನಿಮ್ಮ ಗರಿಷ್ಠ ವಿದ್ಯಾಭ್ಯಾಸವೇನು?',
      prompt: 'ನಿಮ್ಮ ವಿದ್ಯಾರ್ಹತೆ ಹೇಳಿ: 10ನೇ ತರಗತಿ, ಪಿಯುಸಿ, ಅಥವಾ ಪದವಿ.',
      example: 'ಉದಾ: "10ನೇ ತರಗತಿ", "ಪದವಿ"',
    },
    isFarmer: {
      title: 'ನೀವು ರೈತರೇ ಅಥವಾ ಜಮೀನು ಹೊಂದಿದ್ದೀರಾ?',
      prompt: 'ನೀವು ಕೃಷಿಕರೇ ಅಥವಾ ಕೃಷಿ ಜಮೀನು ಹೊಂದಿದ್ದೀರಾ? ಹೌದು ಅಥವಾ ಇಲ್ಲ ಎಂದು ಹೇಳಿ.',
      example: '"ಹೌದು" ಅಥವಾ "ಇಲ್ಲ" ಎಂದು ಹೇಳಿ',
    },
    isActiveStudent: {
      title: 'ನೀವು ಪ್ರಸ್ತುತ ವಿದ್ಯಾರ್ಥಿಯೇ?',
      prompt: 'ನೀವು ಪ್ರಸ್ತುತ ಶಾಲೆ ಅಥವಾ ಕಾಲೇಜಿನಲ್ಲಿ ಓದುತ್ತಿದ್ದೀರಾ? ಹೌದು ಅಥವಾ ಇಲ್ಲ ಎಂದು ಹೇಳಿ.',
      example: '"ಹೌದು" ಅಥವಾ "ಇಲ್ಲ" ಎಂದು ಹೇಳಿ',
    },
    isSeniorCitizen: {
      title: 'ನೀವು ಹಿರಿಯ ನಾಗರಿಕರೇ (60+)?',
      prompt: 'ನಿಮ್ಮ ವಯಸ್ಸು 60 ವರ್ಷ ಅಥವಾ ಅದಕ್ಕಿಂತ ಹೆಚ್ಚೇ? ಹೌದು ಅಥವಾ ಇಲ್ಲ ಎಂದು ಹೇಳಿ.',
      example: '"ಹೌದು" ಅಥವಾ "ಇಲ್ಲ" ಎಂದು ಹೇಳಿ',
    },
    isDisabilityPwD: {
      title: 'ನೀವು ವಿಶೇಷ ಚೇತನರೇ (40%+)?',
      prompt: 'ನಿಮ್ಮ ಬಳಿ ಶೇಕಡಾ 40 ಅಥವಾ ಹೆಚ್ಚು ಅಂಗವಿಕಲತೆ ಪ್ರಮಾಣಪತ್ರ ಇದೆಯೇ? ಹೌದು ಅಥವಾ ಇಲ್ಲ ಎಂದು ಹೇಳಿ.',
      example: '"ಹೌದು" ಅಥವಾ "ಇಲ್ಲ" ಎಂದು ಹೇಳಿ',
    },
    isMinority: {
      title: 'ಅಲ್ಪಸಂಖ್ಯಾತ ಸಮುದಾಯಕ್ಕೆ ಸೇರಿದವರೇ?',
      prompt: 'ನೀವು ಅಧಿಸೂಚಿತ ಅಲ್ಪಸಂಖ್ಯಾತ ಸಮುದಾಯಕ್ಕೆ ಸೇರಿದವರೇ? ಹೌದು ಅಥವಾ ಇಲ್ಲ ಎಂದು ಹೇಳಿ.',
      example: '"ಹೌದು" ಅಥವಾ "ಇಲ್ಲ" ಎಂದು ಹೇಳಿ',
    },
    isExServiceman: {
      title: 'ನಿವೃತ್ತ ಯೋಧರೇ ಅಥವಾ ಅವರ ಆಶ್ರಿತರೇ?',
      prompt: 'ನೀವು ಮಾಜಿ ಯೋಧರೇ ಅಥವಾ ಅವರ ಕುಟುಂಬಕ್ಕೆ ಸೇರಿದವರೇ? ಹೌದು ಅಥವಾ ಇಲ್ಲ ಎಂದು ಹೇಳಿ.',
      example: '"ಹೌದು" ಅಥವಾ "ಇಲ್ಲ" ಎಂದು ಹೇಳಿ',
    },
  },

  // Marathi (मराठी)
  mr: {
    step1: 'टप्पा 1: वैयक्तिक माहिती. कृपया आपले नाव, वय, लिंग, राज्य आणि जिल्हा सांगा.',
    step2: 'टप्पा 2: कौटुंबिक आणि आर्थिक स्थिती. वार्षिक उत्पन्न, प्रवर्ग आणि रेशन कार्ड माहिती.',
    step3: 'टप्पा 3: व्यवसाय आणि शिक्षण. मुख्य व्यवसाय आणि शिक्षणाची माहिती द्या.',
    step4: 'टप्पा 4: विशेष लाभार्थी श्रेणी. दिव्यांग, अल्पसंख्याक किंवा माजी सैनिक प्रवर्ग.',
    fullName: {
      title: 'आपले पूर्ण नाव काय आहे?',
      prompt: 'कृपया आपले पूर्ण नाव स्पष्टपणे बोला.',
      example: 'उदा: "सचिन कदम" किंवा "सुप्रिया पाटील"',
    },
    age: {
      title: 'आपले वय किती वर्षे आहे?',
      prompt: 'कृपया आपले वय वर्षांमध्ये सांगा.',
      example: 'उदा: "28" किंवा "अठ्ठावीस"',
    },
    gender: {
      title: 'आपले लिंग काय आहे?',
      prompt: 'कृपया सांगा: पुरुष, महिला, किंवा तृतीयपंथी.',
      example: 'उदा: "पुरुष", "महिला"',
    },
    state: {
      title: 'आपण कोणत्या राज्यात राहता?',
      prompt: 'कृपया आपल्या राज्याचे नाव सांगा.',
      example: 'उदा: "महाराष्ट्र"',
    },
    district: {
      title: 'आपला जिल्हा किंवा शहर कोणते आहे?',
      prompt: 'कृपया आपल्या जिल्ह्याचे किंवा शहराचे नाव सांगा.',
      example: 'उदा: "पुणे", "नागपूर", "नाशिक", "मुंबई"',
    },
    annualFamilyIncome: {
      title: 'आपले वार्षिक कौटुंबिक उत्पन्न किती आहे?',
      prompt: 'कृपया आपल्या कुटुंबाचे एकूण वार्षिक उत्पन्न रुपयांमध्ये सांगा.',
      example: 'उदा: "अडीच लाख", "पन्नास हजार", किंवा "250000"',
    },
    socialCategory: {
      title: 'आपला सामाजिक प्रवर्ग कोणता आहे?',
      prompt: 'कृपया आपला प्रवर्ग सांगा: खुला (General), ओबीसी, एससी, एसटी, किंवा ईडब्ल्यूएस.',
      example: 'उदा: "ओबीसी", "एससी", "ओपन"',
    },
    maritalStatus: {
      title: 'आपली वैवाहिक स्थिती काय आहे?',
      prompt: 'कृपया सांगा: विवाहित, अविवाहित, विधवा, किंवा घटस्फोटित.',
      example: 'उदा: "विवाहित", "अविवाहित"',
    },
    hasBplRationCard: {
      title: 'आपल्याकडे बीपीएल रेशन कार्ड आहे का?',
      prompt: 'आपल्याकडे बीपीएल किंवा अंत्योदय पिवळे/केशरी रेशन कार्ड आहे का? होय किंवा नाही बोला.',
      example: '"होय" किंवा "नाही" बोला',
    },
    occupation: {
      title: 'आपला मुख्य व्यवसाय काय आहे?',
      prompt: 'आपण शेतकरी, विद्यार्थी, व्यापारी, नोकरदार किंवा बेरोजगार आहात का?',
      example: 'उदा: "शेतकरी", "विद्यार्थी", "स्वयंरोजगार"',
    },
    highestEducation: {
      title: 'आपले शिक्षण किती झाले आहे?',
      prompt: 'कृपया आपले सर्वोच्च शिक्षण सांगा: दहावी, बारावी, किंवा पदवीधर.',
      example: 'उदा: "दहावी पास", "पदवीधर"',
    },
    isFarmer: {
      title: 'आपण शेतकरी आहात का?',
      prompt: 'आपण शेतकरी किंवा शेतजमीन मालक आहात का? होय किंवा नाही बोला.',
      example: '"होय" किंवा "नाही" बोला',
    },
    isActiveStudent: {
      title: 'आपण सध्या शिकत आहात का?',
      prompt: 'आपण सध्या शाळा किंवा महाविद्यालयात शिकत आहात का? होय किंवा नाही बोला.',
      example: '"होय" किंवा "नाही" बोला',
    },
    isSeniorCitizen: {
      title: 'आपण ज्येष्ठ नागरिक (60+) आहात का?',
      prompt: 'आपले वय 60 वर्षे किंवा त्याहून अधिक आहे का? होय किंवा नाही बोला.',
      example: '"होय" किंवा "नाही" बोला',
    },
    isDisabilityPwD: {
      title: 'आपण दिव्यांग व्यक्ती आहात का?',
      prompt: 'आपल्याकडे 40 टक्के किंवा अधिक दिव्यांगत्वाचे प्रमाणपत्र आहे का? होय किंवा नाही बोला.',
      example: '"होय" किंवा "नाही" बोला',
    },
    isMinority: {
      title: 'अल्पसंख्याक समुदायाचे आहात का?',
      prompt: 'आपण अधिसूचित अल्पसंख्याक समुदायातून आहात का? होय किंवा नाही बोला.',
      example: '"होय" किंवा "नाही" बोला',
    },
    isExServiceman: {
      title: 'माजी सैनिक किंवा संरक्षण दलाचे कुटुंब?',
      prompt: 'आपण माजी सैनिक किंवा त्यांचे कुटुंबीय आहात का? होय किंवा नाही बोला.',
      example: '"होय" किंवा "नाही" बोला',
    },
  },

  // Bengali (বাংলা)
  bn: {
    step1: 'ধাপ ১: ব্যক্তিগত তথ্য। আপনার নাম, বয়স, লিঙ্গ, রাজ্য এবং জেলা জানান।',
    step2: 'ধাপ ২: পারিবারিক ও অর্থনৈতিক অবস্থা। বার্ষিক আয়, সামাজিক শ্রেণী ও রেশন কার্ড।',
    step3: 'ধাপ ৩: পেশা ও শিক্ষা। আপনার প্রধান পেশা এবং শিক্ষাগত যোগ্যতা জানান।',
    step4: 'ধাপ ৪: বিশেষ সুবিধাভোগী বিভাগ। প্রতিবন্ধী, সংখ্যালঘু বা প্রাক্তন সেনাকর্মী বিবরণ।',
    fullName: {
      title: 'আপনার পুরো নাম কী?',
      prompt: 'অনুগ্রহ করে আপনার পুরো নাম স্পষ্ট করে বলুন।',
      example: 'যেমন: "রাহুল সেন" বা "অঙ্কিতা ঘোষ"',
    },
    age: {
      title: 'আপনার বয়স কত বছর?',
      prompt: 'অনুগ্রহ করে আপনার বয়স বলুন।',
      example: 'যেমন: "২৮" বা "আটাশ বছর"',
    },
    gender: {
      title: 'আপনার লিঙ্গ কী?',
      prompt: 'অনুগ্রহ করে বলুন: পুরুষ, মহিলা, বা রূপান্তরকামী।',
      example: 'যেমন: "পুরুষ", "মহিলা"',
    },
    state: {
      title: 'আপনি কোন রাজ্যে থাকেন?',
      prompt: 'অনুগ্রহ করে আপনার রাজ্যের নাম বলুন।',
      example: 'যেমন: "পশ্চিমবঙ্গ", "ত্রিপুরা"',
    },
    district: {
      title: 'আপনার জেলা বা শহর কোনটি?',
      prompt: 'অনুগ্রহ করে আপনার জেলা বা শহরের নাম বলুন।',
      example: 'যেমন: "কলকাতা", "হাওড়া", "শিলিগুড়ি"',
    },
    annualFamilyIncome: {
      title: 'আপনার বার্ষিক পারিবারিক আয় কত?',
      prompt: 'অনুগ্রহ করে পরিবারের মোট বার্ষিক আয় টাকায় বলুন।',
      example: 'যেমন: "আড়াই লাখ", "৫০ হাজার", "২৫০০০০"',
    },
    socialCategory: {
      title: 'আপনার সামাজিক শ্রেণী কী?',
      prompt: 'অনুগ্রহ করে আপনার শ্রেণী বলুন: সাধারণ, ওবিসি, এসসি, এসটি, বা ইডব্লিউএস।',
      example: 'যেমন: "সাধারণ", "ওবিসি", "এসসি"',
    },
    maritalStatus: {
      title: 'আপনার বৈবাহিক অবস্থা কী?',
      prompt: 'অনুগ্রহ করে বলুন: বিবাহিত, অবিবাহিত, বিধবা, বা বিবাহবিচ্ছিন্ন।',
      example: 'যেমন: "বিবাহিত", "অবিবাহিত"',
    },
    hasBplRationCard: {
      title: 'আপনার কি বিপিএল রেশন কার্ড আছে?',
      prompt: 'আপনার কি বিপিএল বা অন্ত্যোদয় রেশন কার্ড আছে? হ্যাঁ অথবা না বলুন।',
      example: '"হ্যাঁ" বা "না" বলুন',
    },
    occupation: {
      title: 'আপনার প্রধান পেশা কী?',
      prompt: 'আপনি কি কৃষক, ছাত্র, ব্যবসায়ী, কর্মচারী নাকি চাকরিপ্রার্থী?',
      example: 'যেমন: "কৃষক", "ছাত্র", "ব্যবসায়ী"',
    },
    highestEducation: {
      title: 'আপনার সর্বোচ্চ শিক্ষাগত যোগ্যতা কী?',
      prompt: 'অনুগ্রহ করে বলুন: মাধ্যমিক, উচ্চমাধ্যমিক, বা স্নাতক।',
      example: 'যেমন: "মাধ্যমিক পাশ", "স্নাতক"',
    },
    isFarmer: {
      title: 'আপনি কি কৃষক বা জমির মালিক?',
      prompt: 'আপনি কি কৃষক বা কৃষিজমির মালিক? হ্যাঁ অথবা না বলুন।',
      example: '"হ্যাঁ" বা "না" বলুন',
    },
    isActiveStudent: {
      title: 'আপনি কি বর্তমানে শিক্ষার্থী?',
      prompt: 'আপনি কি বর্তমানে স্কুল বা কলেজের ছাত্র? হ্যাঁ অথবা না বলুন।',
      example: '"হ্যাঁ" বা "না" বলুন',
    },
    isSeniorCitizen: {
      title: 'আপনি কি প্রবীণ নাগরিক (৬০+)?',
      prompt: 'আপনার বয়স কি ৬০ বছর বা তার বেশি? হ্যাঁ অথবা না বলুন।',
      example: '"হ্যাঁ" বা "না" বলুন',
    },
    isDisabilityPwD: {
      title: 'আপনি কি বিশেষভাবে সক্ষম (প্রতিবন্ধী)?',
      prompt: 'আপনার কি ৪০% বা তার বেশি প্রতিবন্ধী শংসাপত্র আছে? হ্যাঁ বা না বলুন।',
      example: '"হ্যাঁ" বা "না" বলুন',
    },
    isMinority: {
      title: 'সংখ্যালঘু সম্প্রদায়ের অন্তর্ভুক্ত?',
      prompt: 'আপনি কি সংখ্যালঘু সম্প্রদায়ের অন্তর্ভুক্ত? হ্যাঁ বা না বলুন।',
      example: '"হ্যাঁ" বা "না" বলুন',
    },
    isExServiceman: {
      title: 'প্রাক্তন সেনাকর্মী বা তাদের পরিবার?',
      prompt: 'আপনি কি প্রাক্তন সেনাকর্মী বা তাদের ওপর নির্ভরশীল? হ্যাঁ বা না বলুন।',
      example: '"হ্যাঁ" বা "না" বলুন',
    },
  },

  // Gujarati (ગુજરાતી)
  gu: {
    step1: 'પગલું ૧: વ્યક્તિગત માહિતી. કૃપા કરીને તમારું નામ, ઉંમર, જાતિ, રાજ્ય અને જિલ્લો જણાવો.',
    step2: 'પગલું ૨: પારિવારિક અને આર્થિક સ્થિતિ. વાર્ષિક આવક, સામાજિક વર્ગ અને રેશનકાર્ડ.',
    step3: 'પગલું ૩: વ્યવસાય અને શિક્ષણ. તમારો મુખ્ય વ્યવસાય અને શિક્ષણ જણાવો.',
    step4: 'પગલું ૪: ખાસ લાભાર્થી શ્રેણી. દિવ્યાંગતા, લઘુમતી કે ભૂતપૂર્વ સૈનિક વિગત.',
    fullName: {
      title: 'તમારું પૂરું નામ શું છે?',
      prompt: 'કૃપા કરીને તમારું પૂરું નામ સ્પષ્ટ રીતે બોલો.',
      example: 'જેમ કે: "વિજય પટેલ" અથવા "ગીતા શાહ"',
    },
    age: {
      title: 'તમારી ઉંમર કેટલા વર્ષ છે?',
      prompt: 'કૃપા કરીને તમારી ઉંમર વર્ષોમાં બોલો.',
      example: 'જેમ કે: "૨૮" અથવા "અઠ્ઠાવીસ વર્ષ"',
    },
    gender: {
      title: 'તમારી જાતિ (લિંગ) શું છે?',
      prompt: 'કૃપા કરીને જણાવો: પુરૂષ, સ્ત્રી, અથવા ટ્રાન્સજેન્ડર.',
      example: 'જેમ કે: "પુરૂષ", "સ્ત્રી"',
    },
    state: {
      title: 'તમે કયા રાજ્યમાં રહો છો?',
      prompt: 'કૃપા કરીને તમારા રાજ્યનું નામ બોલો.',
      example: 'જેમ કે: "ગુજરાત"',
    },
    district: {
      title: 'તમારો જિલ્લો કે શહેર કયું છે?',
      prompt: 'કૃપા કરીને તમારા જિલ્લા કે શહેરનું નામ બોલો.',
      example: 'જેમ કે: "અમદાવાદ", "સુરત", "વડોદરા", "રાજકોટ"',
    },
    annualFamilyIncome: {
      title: 'તમારી વાર્ષિક પારિવારિક આવક કેટલી છે?',
      prompt: 'કૃપા કરીને તમારા પરિવારની કુલ વાર્ષિક આવક રૂપિયામાં બોલો.',
      example: 'જેમ કે: "અઢી લાખ", "૫૦ હજાર", "૨૫૦૦૦૦"',
    },
    socialCategory: {
      title: 'તમારો સામાજિક વર્ગ કયો છે?',
      prompt: 'કૃપા કરીને વર્ગ જણાવો: સામાન્ય, ઓબીસી, એસસી, એસટી, અથવા ઇ.ડબલ્યુ.એસ.',
      example: 'જેમ કે: "ઓબીસી", "સામાન્ય", "એસસી"',
    },
    maritalStatus: {
      title: 'તમારી વૈવાહિક સ્થિતિ શું છે?',
      prompt: 'કૃપા કરીને જણાવો: પરણિત, અપરિણિત, વિધવા/વિધુર, કે છૂટાછેડા લીધેલ.',
      example: 'જેમ કે: "પરણિત", "અપરિણિત"',
    },
    hasBplRationCard: {
      title: 'શું તમારી પાસે બીપીએલ રેશનકાર્ડ છે?',
      prompt: 'શું તમારી પાસે બીપીએલ કે અંત્યોદય રેશનકાર્ડ છે? હા અથવા ના બોલો.',
      example: '"હા" અથવા "ના" બોલો',
    },
    occupation: {
      title: 'તમારો મુખ્ય વ્યવસાય કયો છે?',
      prompt: 'તમે ખેડૂત, વિદ્યાર્થી, વેપારી, ખાનગી કર્મચારી કે બેરોજગાર છો?',
      example: 'જેમ કે: "ખેડૂત", "વિદ્યાર્થી", "વેપારી"',
    },
    highestEducation: {
      title: 'તમારું મહત્તમ શિક્ષણ કેટલું છે?',
      prompt: 'કૃપા કરીને જણાવો: ૧૦ પાસ, ૧૨ પાસ, કે ગ્રેજ્યુએટ.',
      example: 'જેમ કે: "૧૦ પાસ", "ગ્રેજ્યુએટ"',
    },
    isFarmer: {
      title: 'શું તમે ખેડૂત કે જમીનદાર છો?',
      prompt: 'શું તમે ખેડૂત છો અથવા ખેતીની જમીન ધરાવો છો? હા અથવા ના બોલો.',
      example: '"હા" અથવા "ના" બોલો',
    },
    isActiveStudent: {
      title: 'શું તમે હાલમાં વિદ્યાર્થી છો?',
      prompt: 'શું તમે હાલમાં શાળા કે કોલેજમાં અભ્યાસ કરો છો? હા અથવા ના બોલો.',
      example: '"હા" અથવા "ના" બોલો',
    },
    isSeniorCitizen: {
      title: 'શું તમે વરિષ્ઠ નાગરિક (૬૦+) છો?',
      prompt: 'તમારી ઉંમર ૬૦ વર્ષ કે તેથી વધુ છે? હા અથવા ના બોલો.',
      example: '"હા" અથવા "ના" બોલો',
    },
    isDisabilityPwD: {
      title: 'શું તમે દિવ્યાંગ વ્યક્તિ છો?',
      prompt: 'શું તમારી પાસે ૪૦ ટકા કે તેથી વધુ દિવ્યાંગતા પ્રમાણપત્ર છે? હા કે ના બોલો.',
      example: '"હા" અથવા "ના" બોલો',
    },
    isMinority: {
      title: 'લઘુમતી સમુદાયના સભ્ય છો?',
      prompt: 'શું તમે લઘુમતી સમુદાયમાંથી આવો છો? હા અથવા ના બોલો.',
      example: '"હા" અથવા "ના" બોલો',
    },
    isExServiceman: {
      title: 'ભૂતપૂર્વ સૈનિક કે સંરક્ષણ આશ્રિત?',
      prompt: 'શું તમે ભૂતપૂર્વ સૈનિક કે તેમના પરિવારજન છો? હા અથવા ના બોલો.',
      example: '"હા" અથવા "ના" બોલો',
    },
  },
};

// Helper to get native prompt or fallback to Hindi/English
export function getNativePrompt(fieldKey: string, langCode: string = 'en'): string {
  const cleanLang = (langCode || 'en').toLowerCase().split('-')[0];
  const bundle = NATIVE_PROMPTS[cleanLang] || NATIVE_PROMPTS['hi'] || NATIVE_PROMPTS['en'];

  if (fieldKey.startsWith('step')) {
    return (bundle as any)[fieldKey] || NATIVE_PROMPTS.en[fieldKey as keyof NativePromptSet] || '';
  }

  const fieldObj = (bundle as any)[fieldKey];
  if (fieldObj && typeof fieldObj === 'object' && fieldObj.prompt) {
    return fieldObj.prompt;
  }

  const enField = (NATIVE_PROMPTS.en as any)[fieldKey];
  return enField?.prompt || '';
}

// Helper to get native title
export function getNativeTitle(fieldKey: string, langCode: string = 'en'): string {
  const cleanLang = (langCode || 'en').toLowerCase().split('-')[0];
  const bundle = NATIVE_PROMPTS[cleanLang] || NATIVE_PROMPTS['hi'] || NATIVE_PROMPTS['en'];

  const fieldObj = (bundle as any)[fieldKey];
  if (fieldObj && typeof fieldObj === 'object' && fieldObj.title) {
    return fieldObj.title;
  }

  const enField = (NATIVE_PROMPTS.en as any)[fieldKey];
  return enField?.title || '';
}

// Helper to get native example
export function getNativeExample(fieldKey: string, langCode: string = 'en'): string {
  const cleanLang = (langCode || 'en').toLowerCase().split('-')[0];
  const bundle = NATIVE_PROMPTS[cleanLang] || NATIVE_PROMPTS['hi'] || NATIVE_PROMPTS['en'];

  const fieldObj = (bundle as any)[fieldKey];
  if (fieldObj && typeof fieldObj === 'object' && fieldObj.example) {
    return fieldObj.example;
  }

  const enField = (NATIVE_PROMPTS.en as any)[fieldKey];
  return enField?.example || '';
}
