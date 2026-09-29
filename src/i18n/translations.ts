// ── BIS Portal — i18n Translations ───────────────────────────────────────────
// Languages: en (English), hi (Hindi), kn (Kannada), ta (Tamil)

export type LangCode = 'en' | 'hi' | 'kn' | 'ta';

export interface Translations {
  // ── Meta ────────────────────────────────────────────────────────────────────
  langName: string;
  langNameNative: string;

  // ── Header / Nav ────────────────────────────────────────────────────────────
  nav: {
    home: string;
    standards: string;
    certification: string;
    testing: string;
    hallmarking: string;
    consumerServices: string;
    resources: string;
    askAssistant: string;
    checkRequirements: string;
    help: string;
    contact: string;
    accessibility: string;
    language: string;
    search: string;
    notifications: string;
    markAllRead: string;
    viewAll: string;
    noNotifications: string;
    textSize: string;
    allAccessibility: string;
    comingSoon: string;
    planned: string;
    moreLanguages: string;
    skipToMain: string;
  };

  // ── MobileNav ────────────────────────────────────────────────────────────────
  mobile: {
    home: string;
    assistant: string;
    standards: string;
    services: string;
    more: string;
  };

  // ── Footer ──────────────────────────────────────────────────────────────────
  footer: {
    services: string;
    resources: string;
    legal: string;
    aboutBIS: string;
    contact: string;
    regionalOffices: string;
    career: string;
    documentsPublications: string;
    faqs: string;
    checkRequirements: string;
    bisAssistant: string;
    privacyPolicy: string;
    termsOfUse: string;
    accessibilityStatement: string;
    disclaimer: string;
    copyright: string;
    govIndia: string;
    ministry: string;
    disclaimer2: string;
  };

  // ── HomePage ─────────────────────────────────────────────────────────────────
  home: {
    govBadge: string;
    aiBadge: string;
    hero1: string;
    hero2: string;
    heroPara: string;
    inputPlaceholder: string;
    tryLabel: string;
    trySuggestions: string[];
    askBtnLabel: string;
    ctaAsk: string;
    ctaExplore: string;

    // Service cards
    svc_findStandard_title: string;
    svc_findStandard_desc: string;
    svc_findStandard_btn: string;
    svc_certification_title: string;
    svc_certification_desc: string;
    svc_certification_btn: string;
    svc_testing_title: string;
    svc_testing_desc: string;
    svc_testing_btn: string;
    svc_hallmarking_title: string;
    svc_hallmarking_desc: string;
    svc_hallmarking_btn: string;
    svc_consumer_title: string;
    svc_consumer_desc: string;
    svc_consumer_btn: string;
    svc_assistant_title: string;
    svc_assistant_desc: string;
    svc_assistant_btn: string;

    // How it works
    howTitle: string;
    step1_title: string; step1_desc: string;
    step2_title: string; step2_desc: string;
    step3_title: string; step3_desc: string;
    step4_title: string; step4_desc: string;

    // Services section
    servicesTitle: string;
    servicesSubtitle: string;

    // Principles
    srcBacked_title: string; srcBacked_desc: string;
    traceable_title: string; traceable_desc: string;
    transparent_title: string; transparent_desc: string;

    // Disclaimer
    disclaimerNote: string;
  };
}

// ── English ──────────────────────────────────────────────────────────────────
const en: Translations = {
  langName: 'English',
  langNameNative: 'English',
  nav: {
    home: 'Home', standards: 'Standards', certification: 'Certification',
    testing: 'Testing', hallmarking: 'Hallmarking', consumerServices: 'Consumer Services',
    resources: 'Resources', askAssistant: 'Ask BIS Assistant', checkRequirements: 'Check My BIS Requirements',
    help: 'Help', contact: 'Contact', accessibility: 'Accessibility', language: 'Language',
    search: 'Search', notifications: 'Notifications', markAllRead: 'Mark all read',
    viewAll: 'View all notifications', noNotifications: 'No notifications',
    textSize: 'Text Size', allAccessibility: 'All accessibility settings',
    comingSoon: 'Coming soon', planned: 'Planned', moreLanguages: 'More languages',
    skipToMain: 'Skip to main content',
  },
  mobile: { home: 'Home', assistant: 'Assistant', standards: 'Standards', services: 'Services', more: 'More' },
  footer: {
    services: 'Services', resources: 'Resources', legal: 'Legal',
    aboutBIS: 'About BIS', contact: 'Contact', regionalOffices: 'Regional Offices', career: 'Career',
    documentsPublications: 'Documents & Publications', faqs: 'FAQs',
    checkRequirements: 'Check My Requirements', bisAssistant: 'BIS Assistant',
    privacyPolicy: 'Privacy Policy', termsOfUse: 'Terms of Use',
    accessibilityStatement: 'Accessibility Statement', disclaimer: 'Disclaimer',
    copyright: '© Bureau of Indian Standards. All rights reserved.',
    govIndia: 'Government of India',
    ministry: 'Ministry of Consumer Affairs, Food and Public Distribution',
    disclaimer2: 'This portal provides AI-assisted access to BIS information. Responses are informational and should be verified against official BIS sources.',
  },
  home: {
    govBadge: 'GOVERNMENT OF INDIA', aiBadge: 'AI-ASSISTED INFORMATION',
    hero1: 'Understand Indian Standards.', hero2: 'Simplify BIS Services.',
    heroPara: 'Ask questions in plain language and get source-backed information about Indian Standards, certification, testing, hallmarking and BIS services.',
    inputPlaceholder: 'Ask about an Indian Standard, certification, testing requirement…',
    tryLabel: 'Try:', askBtnLabel: 'Ask',
    trySuggestions: ['Which standard applies to my product?', 'How do I apply for BIS certification?', 'What testing is required?', 'How does hallmarking work?'],
    ctaAsk: 'Ask the BIS Assistant', ctaExplore: 'Explore Indian Standards',
    svc_findStandard_title: 'Find a Standard', svc_findStandard_desc: 'Discover Indian Standards relevant to your product or requirement.', svc_findStandard_btn: 'Explore Standards',
    svc_certification_title: 'Certification', svc_certification_desc: 'Understand BIS certification schemes, requirements and procedures.', svc_certification_btn: 'View Certification',
    svc_testing_title: 'Testing & Laboratories', svc_testing_desc: 'Find testing information and relevant laboratories for your product.', svc_testing_btn: 'Find Testing Services',
    svc_hallmarking_title: 'Hallmarking', svc_hallmarking_desc: 'Understand BIS hallmarking requirements and verification processes.', svc_hallmarking_btn: 'Explore Hallmarking',
    svc_consumer_title: 'Consumer Services', svc_consumer_desc: 'Find information and guidance for BIS-related consumer queries.', svc_consumer_btn: 'Get Consumer Help',
    svc_assistant_title: 'Ask BIS Assistant', svc_assistant_desc: 'Ask questions in natural language and receive source-backed answers.', svc_assistant_btn: 'Start Conversation',
    howTitle: 'How It Works',
    step1_title: 'Ask', step1_desc: 'Describe your product or question in plain language.',
    step2_title: 'Understand', step2_desc: 'The assistant identifies the product, intent and relevant BIS service.',
    step3_title: 'Retrieve', step3_desc: 'Relevant BIS standards, documents and official information are retrieved.',
    step4_title: 'Verify', step4_desc: 'The response includes supporting documents, sections, clauses or pages wherever applicable.',
    servicesTitle: 'BIS Digital Services', servicesSubtitle: 'Access information on standards, certification, testing, hallmarking, and more.',
    srcBacked_title: 'Source-backed', srcBacked_desc: 'Answers are grounded in retrieved BIS information drawn from official standards, certification documents, and BIS publications.',
    traceable_title: 'Traceable', traceable_desc: 'Users can inspect the source behind any answer. Every significant claim links to the underlying BIS document, section, or clause.',
    transparent_title: 'Transparent', transparent_desc: 'The system clearly indicates when sufficient evidence is unavailable rather than generating speculative or unverified responses.',
    disclaimerNote: 'AI-generated information — not a substitute for official BIS advice.',
  },
};

// ── Hindi ──────────────────────────────────────────────────────────────────
const hi: Translations = {
  langName: 'Hindi',
  langNameNative: 'हिंदी',
  nav: {
    home: 'होम', standards: 'मानक', certification: 'प्रमाणीकरण',
    testing: 'परीक्षण', hallmarking: 'हॉलमार्किंग', consumerServices: 'उपभोक्ता सेवाएं',
    resources: 'संसाधन', askAssistant: 'BIS सहायक से पूछें', checkRequirements: 'मेरी BIS आवश्यकताएं जांचें',
    help: 'सहायता', contact: 'संपर्क', accessibility: 'पहुंच सुविधा', language: 'भाषा',
    search: 'खोजें', notifications: 'सूचनाएं', markAllRead: 'सभी पढ़ा हुआ चिह्नित करें',
    viewAll: 'सभी सूचनाएं देखें', noNotifications: 'कोई सूचना नहीं',
    textSize: 'अक्षर आकार', allAccessibility: 'सभी पहुंच सेटिंग',
    comingSoon: 'जल्द आ रहा है', planned: 'योजनाबद्ध', moreLanguages: 'अधिक भाषाएं',
    skipToMain: 'मुख्य सामग्री पर जाएं',
  },
  mobile: { home: 'होम', assistant: 'सहायक', standards: 'मानक', services: 'सेवाएं', more: 'और' },
  footer: {
    services: 'सेवाएं', resources: 'संसाधन', legal: 'कानूनी',
    aboutBIS: 'BIS के बारे में', contact: 'संपर्क', regionalOffices: 'क्षेत्रीय कार्यालय', career: 'करियर',
    documentsPublications: 'दस्तावेज़ और प्रकाशन', faqs: 'अक्सर पूछे जाने वाले प्रश्न',
    checkRequirements: 'मेरी आवश्यकताएं जांचें', bisAssistant: 'BIS सहायक',
    privacyPolicy: 'गोपनीयता नीति', termsOfUse: 'उपयोग की शर्तें',
    accessibilityStatement: 'पहुंच वक्तव्य', disclaimer: 'अस्वीकरण',
    copyright: '© भारतीय मानक ब्यूरो। सर्वाधिकार सुरक्षित।',
    govIndia: 'भारत सरकार',
    ministry: 'उपभोक्ता मामले, खाद्य और सार्वजनिक वितरण मंत्रालय',
    disclaimer2: 'यह पोर्टल BIS जानकारी तक AI-सहायता प्रदान करता है। उत्तर जानकारी के लिए हैं और आधिकारिक BIS स्रोतों से सत्यापित किए जाने चाहिए।',
  },
  home: {
    govBadge: 'भारत सरकार', aiBadge: 'AI-सहायता जानकारी',
    hero1: 'भारतीय मानकों को समझें।', hero2: 'BIS सेवाएं आसान बनाएं।',
    heroPara: 'सरल भाषा में प्रश्न पूछें और भारतीय मानकों, प्रमाणीकरण, परीक्षण, हॉलमार्किंग और BIS सेवाओं के बारे में स्रोत-आधारित जानकारी प्राप्त करें।',
    inputPlaceholder: 'किसी भारतीय मानक, प्रमाणीकरण या परीक्षण के बारे में पूछें…',
    tryLabel: 'आज़माएं:', askBtnLabel: 'पूछें',
    trySuggestions: ['मेरे उत्पाद पर कौन सा मानक लागू होता है?', 'BIS प्रमाणीकरण के लिए कैसे आवेदन करें?', 'कौन सा परीक्षण जरूरी है?', 'हॉलमार्किंग कैसे काम करती है?'],
    ctaAsk: 'BIS सहायक से पूछें', ctaExplore: 'भारतीय मानक देखें',
    svc_findStandard_title: 'मानक खोजें', svc_findStandard_desc: 'अपने उत्पाद से संबंधित भारतीय मानक खोजें।', svc_findStandard_btn: 'मानक देखें',
    svc_certification_title: 'प्रमाणीकरण', svc_certification_desc: 'BIS प्रमाणीकरण योजनाएं, आवश्यकताएं और प्रक्रियाएं समझें।', svc_certification_btn: 'प्रमाणीकरण देखें',
    svc_testing_title: 'परीक्षण और प्रयोगशाला', svc_testing_desc: 'अपने उत्पाद के लिए परीक्षण जानकारी और प्रयोगशाला खोजें।', svc_testing_btn: 'परीक्षण सेवा खोजें',
    svc_hallmarking_title: 'हॉलमार्किंग', svc_hallmarking_desc: 'BIS हॉलमार्किंग आवश्यकताएं और सत्यापन प्रक्रिया समझें।', svc_hallmarking_btn: 'हॉलमार्किंग देखें',
    svc_consumer_title: 'उपभोक्ता सेवाएं', svc_consumer_desc: 'BIS से संबंधित उपभोक्ता प्रश्नों के लिए जानकारी पाएं।', svc_consumer_btn: 'सहायता पाएं',
    svc_assistant_title: 'BIS सहायक से पूछें', svc_assistant_desc: 'सरल भाषा में प्रश्न पूछें और स्रोत-आधारित उत्तर पाएं।', svc_assistant_btn: 'बातचीत शुरू करें',
    howTitle: 'यह कैसे काम करता है',
    step1_title: 'पूछें', step1_desc: 'अपने उत्पाद या प्रश्न को सरल भाषा में बताएं।',
    step2_title: 'समझें', step2_desc: 'सहायक उत्पाद, उद्देश्य और संबंधित BIS सेवा की पहचान करता है।',
    step3_title: 'प्राप्त करें', step3_desc: 'संबंधित BIS मानक, दस्तावेज और आधिकारिक जानकारी प्राप्त की जाती है।',
    step4_title: 'सत्यापित करें', step4_desc: 'उत्तर में सहायक दस्तावेज़, अनुभाग, खंड या पृष्ठ शामिल होते हैं।',
    servicesTitle: 'BIS डिजिटल सेवाएं', servicesSubtitle: 'मानकों, प्रमाणीकरण, परीक्षण, हॉलमार्किंग आदि पर जानकारी प्राप्त करें।',
    srcBacked_title: 'स्रोत-आधारित', srcBacked_desc: 'उत्तर आधिकारिक BIS मानकों, प्रमाणीकरण दस्तावेजों और प्रकाशनों से लिए गए हैं।',
    traceable_title: 'पता लगाने योग्य', traceable_desc: 'उपयोगकर्ता किसी भी उत्तर के पीछे के स्रोत की जांच कर सकते हैं।',
    transparent_title: 'पारदर्शी', transparent_desc: 'जब पर्याप्त साक्ष्य उपलब्ध नहीं होते तो सिस्टम स्पष्ट रूप से बताता है।',
    disclaimerNote: 'AI-जनित जानकारी — आधिकारिक BIS सलाह का विकल्प नहीं।',
  },
};

// ── Kannada ───────────────────────────────────────────────────────────────────
const kn: Translations = {
  langName: 'Kannada',
  langNameNative: 'ಕನ್ನಡ',
  nav: {
    home: 'ಮುಖಪುಟ', standards: 'ಮಾನದಂಡಗಳು', certification: 'ಪ್ರಮಾಣೀಕರಣ',
    testing: 'ಪರೀಕ್ಷೆ', hallmarking: 'ಹಾಲ್‌ಮಾರ್ಕಿಂಗ್', consumerServices: 'ಗ್ರಾಹಕ ಸೇವೆಗಳು',
    resources: 'ಸಂಪನ್ಮೂಲಗಳು', askAssistant: 'BIS ಸಹಾಯಕರನ್ನು ಕೇಳಿ', checkRequirements: 'ನನ್ನ BIS ಅವಶ್ಯಕತೆಗಳನ್ನು ಪರಿಶೀಲಿಸಿ',
    help: 'ಸಹಾಯ', contact: 'ಸಂಪರ್ಕ', accessibility: 'ಪ್ರವೇಶ ಸೌಲಭ್ಯ', language: 'ಭಾಷೆ',
    search: 'ಹುಡುಕಿ', notifications: 'ಅಧಿಸೂಚನೆಗಳು', markAllRead: 'ಎಲ್ಲವನ್ನೂ ಓದಿದೆ ಎಂದು ಗುರುತಿಸಿ',
    viewAll: 'ಎಲ್ಲಾ ಅಧಿಸೂಚನೆಗಳನ್ನು ವೀಕ್ಷಿಸಿ', noNotifications: 'ಯಾವುದೇ ಅಧಿಸೂಚನೆ ಇಲ್ಲ',
    textSize: 'ಅಕ್ಷರ ಗಾತ್ರ', allAccessibility: 'ಎಲ್ಲಾ ಪ್ರವೇಶ ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
    comingSoon: 'ಶೀಘ್ರದಲ್ಲೇ ಬರಲಿದೆ', planned: 'ಯೋಜಿಸಲಾಗಿದೆ', moreLanguages: 'ಹೆಚ್ಚಿನ ಭಾಷೆಗಳು',
    skipToMain: 'ಮುಖ್ಯ ವಿಷಯಕ್ಕೆ ಹೋಗಿ',
  },
  mobile: { home: 'ಮುಖಪುಟ', assistant: 'ಸಹಾಯಕ', standards: 'ಮಾನದಂಡ', services: 'ಸೇವೆಗಳು', more: 'ಇನ್ನಷ್ಟು' },
  footer: {
    services: 'ಸೇವೆಗಳು', resources: 'ಸಂಪನ್ಮೂಲಗಳು', legal: 'ಕಾನೂನು',
    aboutBIS: 'BIS ಬಗ್ಗೆ', contact: 'ಸಂಪರ್ಕ', regionalOffices: 'ಪ್ರಾದೇಶಿಕ ಕಚೇರಿಗಳು', career: 'ವೃತ್ತಿ',
    documentsPublications: 'ದಾಖಲೆಗಳು ಮತ್ತು ಪ್ರಕಟಣೆಗಳು', faqs: 'ಪದೇ ಪದೇ ಕೇಳಲಾಗುವ ಪ್ರಶ್ನೆಗಳು',
    checkRequirements: 'ನನ್ನ ಅವಶ್ಯಕತೆಗಳನ್ನು ಪರಿಶೀಲಿಸಿ', bisAssistant: 'BIS ಸಹಾಯಕ',
    privacyPolicy: 'ಗೌಪ್ಯತಾ ನೀತಿ', termsOfUse: 'ಬಳಕೆಯ ನಿಯಮಗಳು',
    accessibilityStatement: 'ಪ್ರವೇಶ ಹೇಳಿಕೆ', disclaimer: 'ಹಕ್ಕುತ್ಯಾಗ',
    copyright: '© ಭಾರತೀಯ ಮಾನಕ ಬ್ಯೂರೋ. ಎಲ್ಲಾ ಹಕ್ಕುಗಳು ಮೀಸಲು.',
    govIndia: 'ಭಾರತ ಸರ್ಕಾರ',
    ministry: 'ಗ್ರಾಹಕ ವ್ಯವಹಾರ, ಆಹಾರ ಮತ್ತು ಸಾರ್ವಜನಿಕ ವಿತರಣ ಸಚಿವಾಲಯ',
    disclaimer2: 'ಈ ಪೋರ್ಟಲ್ BIS ಮಾಹಿತಿಗೆ AI-ಸಹಾಯಿತ ಪ್ರವೇಶ ಒದಗಿಸುತ್ತದೆ. ಅಧಿಕೃತ BIS ಮೂಲಗಳ ವಿರುದ್ಧ ಪ್ರತಿಕ್ರಿಯೆಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.',
  },
  home: {
    govBadge: 'ಭಾರತ ಸರ್ಕಾರ', aiBadge: 'AI-ಸಹಾಯಿತ ಮಾಹಿತಿ',
    hero1: 'ಭಾರತೀಯ ಮಾನದಂಡಗಳನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ.', hero2: 'BIS ಸೇವೆಗಳನ್ನು ಸರಳಗೊಳಿಸಿ.',
    heroPara: 'ಸರಳ ಭಾಷೆಯಲ್ಲಿ ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳಿ ಮತ್ತು ಭಾರತೀಯ ಮಾನದಂಡಗಳ ಬಗ್ಗೆ ಮಾಹಿತಿ ಪಡೆಯಿರಿ.',
    inputPlaceholder: 'ಭಾರತೀಯ ಮಾನದಂಡ, ಪ್ರಮಾಣೀಕರಣ ಅಥವಾ ಪರೀಕ್ಷೆಯ ಬಗ್ಗೆ ಕೇಳಿ…',
    tryLabel: 'ಪ್ರಯತ್ನಿಸಿ:', askBtnLabel: 'ಕೇಳಿ',
    trySuggestions: ['ನನ್ನ ಉತ್ಪನ್ನಕ್ಕೆ ಯಾವ ಮಾನದಂಡ ಅನ್ವಯಿಸುತ್ತದೆ?', 'BIS ಪ್ರಮಾಣೀಕರಣಕ್ಕೆ ಹೇಗೆ ಅರ್ಜಿ ಸಲ್ಲಿಸಬೇಕು?', 'ಯಾವ ಪರೀಕ್ಷೆ ಅಗತ್ಯ?', 'ಹಾಲ್‌ಮಾರ್ಕಿಂಗ್ ಹೇಗೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ?'],
    ctaAsk: 'BIS ಸಹಾಯಕರನ್ನು ಕೇಳಿ', ctaExplore: 'ಭಾರತೀಯ ಮಾನದಂಡಗಳನ್ನು ಅನ್ವೇಷಿಸಿ',
    svc_findStandard_title: 'ಮಾನದಂಡ ಹುಡುಕಿ', svc_findStandard_desc: 'ನಿಮ್ಮ ಉತ್ಪನ್ನಕ್ಕೆ ಸಂಬಂಧಿಸಿದ ಭಾರತೀಯ ಮಾನದಂಡಗಳನ್ನು ಕಂಡುಹಿಡಿಯಿರಿ.', svc_findStandard_btn: 'ಮಾನದಂಡಗಳನ್ನು ನೋಡಿ',
    svc_certification_title: 'ಪ್ರಮಾಣೀಕರಣ', svc_certification_desc: 'BIS ಪ್ರಮಾಣೀಕರಣ ಯೋಜನೆಗಳು ಮತ್ತು ಪ್ರಕ್ರಿಯೆಗಳನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ.', svc_certification_btn: 'ಪ್ರಮಾಣೀಕರಣ ನೋಡಿ',
    svc_testing_title: 'ಪರೀಕ್ಷೆ ಮತ್ತು ಪ್ರಯೋಗಾಲಯ', svc_testing_desc: 'ನಿಮ್ಮ ಉತ್ಪನ್ನಕ್ಕೆ ಪರೀಕ್ಷಾ ಮಾಹಿತಿ ಮತ್ತು ಪ್ರಯೋಗಾಲಯ ಹುಡುಕಿ.', svc_testing_btn: 'ಪರೀಕ್ಷಾ ಸೇವೆ ಹುಡುಕಿ',
    svc_hallmarking_title: 'ಹಾಲ್‌ಮಾರ್ಕಿಂಗ್', svc_hallmarking_desc: 'BIS ಹಾಲ್‌ಮಾರ್ಕಿಂಗ್ ಅವಶ್ಯಕತೆಗಳನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ.', svc_hallmarking_btn: 'ಹಾಲ್‌ಮಾರ್ಕಿಂಗ್ ನೋಡಿ',
    svc_consumer_title: 'ಗ್ರಾಹಕ ಸೇವೆಗಳು', svc_consumer_desc: 'BIS ಸಂಬಂಧಿತ ಗ್ರಾಹಕ ಪ್ರಶ್ನೆಗಳಿಗೆ ಮಾಹಿತಿ ಪಡೆಯಿರಿ.', svc_consumer_btn: 'ಸಹಾಯ ಪಡೆಯಿರಿ',
    svc_assistant_title: 'BIS ಸಹಾಯಕರನ್ನು ಕೇಳಿ', svc_assistant_desc: 'ಸರಳ ಭಾಷೆಯಲ್ಲಿ ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳಿ ಮತ್ತು ಉತ್ತರಗಳನ್ನು ಪಡೆಯಿರಿ.', svc_assistant_btn: 'ಸಂಭಾಷಣೆ ಪ್ರಾರಂಭಿಸಿ',
    howTitle: 'ಇದು ಹೇಗೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ',
    step1_title: 'ಕೇಳಿ', step1_desc: 'ನಿಮ್ಮ ಉತ್ಪನ್ನ ಅಥವಾ ಪ್ರಶ್ನೆಯನ್ನು ಸರಳ ಭಾಷೆಯಲ್ಲಿ ವಿವರಿಸಿ.',
    step2_title: 'ಅರ್ಥ', step2_desc: 'ಸಹಾಯಕ ಉತ್ಪನ್ನ, ಉದ್ದೇಶ ಮತ್ತು ಸಂಬಂಧಿತ BIS ಸೇವೆಯನ್ನು ಗುರುತಿಸುತ್ತದೆ.',
    step3_title: 'ಪಡೆಯಿರಿ', step3_desc: 'ಸಂಬಂಧಿತ BIS ಮಾನದಂಡಗಳು ಮತ್ತು ಅಧಿಕೃತ ಮಾಹಿತಿಯನ್ನು ಪಡೆಯಲಾಗುತ್ತದೆ.',
    step4_title: 'ಪರಿಶೀಲಿಸಿ', step4_desc: 'ಪ್ರತಿಕ್ರಿಯೆಯಲ್ಲಿ ಬೆಂಬಲಿತ ದಾಖಲೆಗಳು, ವಿಭಾಗಗಳು ಮತ್ತು ಖಂಡಗಳು ಸೇರಿಸಲಾಗಿದೆ.',
    servicesTitle: 'BIS ಡಿಜಿಟಲ್ ಸೇವೆಗಳು', servicesSubtitle: 'ಮಾನದಂಡಗಳು, ಪ್ರಮಾಣೀಕರಣ, ಪರೀಕ್ಷೆ, ಹಾಲ್‌ಮಾರ್ಕಿಂಗ್ ಮತ್ತು ಹೆಚ್ಚಿನ ಮಾಹಿತಿ ಪಡೆಯಿರಿ.',
    srcBacked_title: 'ಮೂಲ-ಆಧಾರಿತ', srcBacked_desc: 'ಉತ್ತರಗಳು ಅಧಿಕೃತ BIS ಮಾನದಂಡಗಳು ಮತ್ತು ಪ್ರಕಟಣೆಗಳಿಂದ ಆಧಾರಿತವಾಗಿವೆ.',
    traceable_title: 'ಪತ್ತೆ ಹಚ್ಚಬಹುದಾದ', traceable_desc: 'ಬಳಕೆದಾರರು ಯಾವುದೇ ಉತ್ತರದ ಹಿಂದಿನ ಮೂಲವನ್ನು ಪರಿಶೀಲಿಸಬಹುದು.',
    transparent_title: 'ಪಾರದರ್ಶಕ', transparent_desc: 'ಸಾಕಷ್ಟು ಸಾಕ್ಷ್ಯ ಲಭ್ಯವಿಲ್ಲದಿದ್ದಾಗ ವ್ಯವಸ್ಥೆ ಸ್ಪಷ್ಟವಾಗಿ ತಿಳಿಸುತ್ತದೆ.',
    disclaimerNote: 'AI-ಉತ್ಪಾದಿತ ಮಾಹಿತಿ — ಅಧಿಕೃತ BIS ಸಲಹೆಯ ಬದಲಿ ಅಲ್ಲ.',
  },
};

// ── Tamil ──────────────────────────────────────────────────────────────────
const ta: Translations = {
  langName: 'Tamil',
  langNameNative: 'தமிழ்',
  nav: {
    home: 'முகப்பு', standards: 'தரநிலைகள்', certification: 'சான்றிதழ்',
    testing: 'சோதனை', hallmarking: 'ஹால்மார்க்கிங்', consumerServices: 'நுகர்வோர் சேவைகள்',
    resources: 'வளங்கள்', askAssistant: 'BIS உதவியாளரிடம் கேளுங்கள்', checkRequirements: 'என் BIS தேவைகளை சரிபாருங்கள்',
    help: 'உதவி', contact: 'தொடர்பு', accessibility: 'அணுகல் வசதி', language: 'மொழி',
    search: 'தேடு', notifications: 'அறிவிப்புகள்', markAllRead: 'அனைத்தையும் படித்தது என்று குறிக்கவும்',
    viewAll: 'அனைத்து அறிவிப்புகளையும் காண்க', noNotifications: 'அறிவிப்புகள் இல்லை',
    textSize: 'எழுத்து அளவு', allAccessibility: 'அனைத்து அணுகல் அமைப்புகள்',
    comingSoon: 'விரைவில் வருகிறது', planned: 'திட்டமிடப்பட்டுள்ளது', moreLanguages: 'மேலும் மொழிகள்',
    skipToMain: 'முக்கிய உள்ளடக்கத்திற்கு செல்லுங்கள்',
  },
  mobile: { home: 'முகப்பு', assistant: 'உதவியாளர்', standards: 'தரநிலைகள்', services: 'சேவைகள்', more: 'மேலும்' },
  footer: {
    services: 'சேவைகள்', resources: 'வளங்கள்', legal: 'சட்டம்',
    aboutBIS: 'BIS பற்றி', contact: 'தொடர்பு', regionalOffices: 'பிராந்திய அலுவலகங்கள்', career: 'வேலை வாய்ப்பு',
    documentsPublications: 'ஆவணங்கள் மற்றும் வெளியீடுகள்', faqs: 'அடிக்கடி கேட்கப்படும் கேள்விகள்',
    checkRequirements: 'என் தேவைகளை சரிபாருங்கள்', bisAssistant: 'BIS உதவியாளர்',
    privacyPolicy: 'தனியுரிமை கொள்கை', termsOfUse: 'பயன்பாட்டு விதிமுறைகள்',
    accessibilityStatement: 'அணுகல் அறிக்கை', disclaimer: 'மறுப்பு',
    copyright: '© இந்திய தர நிறுவனம். அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.',
    govIndia: 'இந்திய அரசு',
    ministry: 'நுகர்வோர் விவகாரங்கள், உணவு மற்றும் பொது விநியோக அமைச்சகம்',
    disclaimer2: 'இந்த போர்டல் BIS தகவலுக்கு AI-உதவியுடன் அணுகலை வழங்குகிறது. பதில்கள் தகவல் சார்ந்தவை மற்றும் அதிகாரப்பூர்வ BIS ஆதாரங்களுடன் சரிபார்க்கப்பட வேண்டும்.',
  },
  home: {
    govBadge: 'இந்திய அரசு', aiBadge: 'AI-உதவியுடன் தகவல்',
    hero1: 'இந்திய தரநிலைகளை புரிந்துகொள்ளுங்கள்.', hero2: 'BIS சேவைகளை எளிமைப்படுத்துங்கள்.',
    heroPara: 'எளிய மொழியில் கேள்விகளை கேளுங்கள், இந்திய தரநிலைகள், சான்றிதழ், சோதனை மற்றும் BIS சேவைகள் பற்றிய தகவல்களை பெறுங்கள்.',
    inputPlaceholder: 'இந்திய தரநிலை, சான்றிதழ் அல்லது சோதனை பற்றி கேளுங்கள்…',
    tryLabel: 'முயற்சி செய்யுங்கள்:', askBtnLabel: 'கேளுங்கள்',
    trySuggestions: ['என் தயாரிப்பிற்கு எந்த தரநிலை பொருந்தும்?', 'BIS சான்றிதழுக்கு எப்படி விண்ணப்பிப்பது?', 'என்ன சோதனை தேவை?', 'ஹால்மார்க்கிங் எப்படி செயல்படுகிறது?'],
    ctaAsk: 'BIS உதவியாளரிடம் கேளுங்கள்', ctaExplore: 'இந்திய தரநிலைகளை ஆராயுங்கள்',
    svc_findStandard_title: 'தரநிலை தேடுங்கள்', svc_findStandard_desc: 'உங்கள் தயாரிப்பிற்கு தொடர்புடைய இந்திய தரநிலைகளை கண்டுபிடியுங்கள்.', svc_findStandard_btn: 'தரநிலைகளை காணுங்கள்',
    svc_certification_title: 'சான்றிதழ்', svc_certification_desc: 'BIS சான்றிதழ் திட்டங்கள், தேவைகள் மற்றும் நடைமுறைகளை புரிந்துகொள்ளுங்கள்.', svc_certification_btn: 'சான்றிதழை காணுங்கள்',
    svc_testing_title: 'சோதனை மற்றும் ஆய்வகங்கள்', svc_testing_desc: 'உங்கள் தயாரிப்பிற்கு சோதனை தகவல் மற்றும் ஆய்வகங்களை கண்டுபிடியுங்கள்.', svc_testing_btn: 'சோதனை சேவை தேடுங்கள்',
    svc_hallmarking_title: 'ஹால்மார்க்கிங்', svc_hallmarking_desc: 'BIS ஹால்மார்க்கிங் தேவைகளை புரிந்துகொள்ளுங்கள்.', svc_hallmarking_btn: 'ஹால்மார்க்கிங்கை காணுங்கள்',
    svc_consumer_title: 'நுகர்வோர் சேவைகள்', svc_consumer_desc: 'BIS தொடர்பான நுகர்வோர் கேள்விகளுக்கு தகவல் பெறுங்கள்.', svc_consumer_btn: 'உதவி பெறுங்கள்',
    svc_assistant_title: 'BIS உதவியாளரிடம் கேளுங்கள்', svc_assistant_desc: 'எளிய மொழியில் கேள்விகளை கேளுங்கள், ஆதாரம் கொண்ட பதில்களை பெறுங்கள்.', svc_assistant_btn: 'உரையாடல் தொடங்குங்கள்',
    howTitle: 'இது எப்படி செயல்படுகிறது',
    step1_title: 'கேளுங்கள்', step1_desc: 'உங்கள் தயாரிப்பு அல்லது கேள்வியை எளிய மொழியில் விவரியுங்கள்.',
    step2_title: 'புரிந்துகொள்ளுங்கள்', step2_desc: 'உதவியாளர் தயாரிப்பு, நோக்கம் மற்றும் தொடர்புடைய BIS சேவையை அடையாளம் காண்கிறார்.',
    step3_title: 'பெறுங்கள்', step3_desc: 'தொடர்புடைய BIS தரநிலைகள் மற்றும் அதிகாரப்பூர்வ தகவல்கள் பெறப்படுகின்றன.',
    step4_title: 'சரிபாருங்கள்', step4_desc: 'பதிலில் ஆதார ஆவணங்கள், பிரிவுகள் மற்றும் பக்கங்கள் சேர்க்கப்படுகின்றன.',
    servicesTitle: 'BIS டிஜிட்டல் சேவைகள்', servicesSubtitle: 'தரநிலைகள், சான்றிதழ், சோதனை, ஹால்மார்க்கிங் மற்றும் பலவற்றை அணுகுங்கள்.',
    srcBacked_title: 'ஆதாரம் கொண்டது', srcBacked_desc: 'பதில்கள் அதிகாரப்பூர்வ BIS தரநிலைகள் மற்றும் வெளியீடுகளிலிருந்து வருகின்றன.',
    traceable_title: 'கண்டுபிடிக்கக்கூடியது', traceable_desc: 'பயனர்கள் எந்த பதிலின் பின்னால் உள்ள ஆதாரத்தையும் சரிபார்க்கலாம்.',
    transparent_title: 'வெளிப்படையான', transparent_desc: 'போதுமான சான்று இல்லாதபோது கணினி தெளிவாக தெரிவிக்கிறது.',
    disclaimerNote: 'AI-உருவாக்கப்பட்ட தகவல் — அதிகாரப்பூர்வ BIS ஆலோசனைக்கு மாற்று அல்ல.',
  },
};

// ── Registry ──────────────────────────────────────────────────────────────────
export const TRANSLATIONS: Record<LangCode, Translations> = { en, hi, kn, ta };

export const LANGUAGES: { code: LangCode; label: string; native: string }[] = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'hi', label: 'Hindi', native: 'हिंदी' },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
];
