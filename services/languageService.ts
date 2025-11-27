// PawTag India - Language Service
// Multi-language support for English and Hindi

import { Language } from '../types';

// Translation strings
const translations: Record<string, Record<Language, string>> = {
  // General
  'app.name': {
    en: 'PawTag India',
    hi: 'पॉटैग इंडिया'
  },
  'app.tagline': {
    en: "India's Smartest Pet Tag",
    hi: 'भारत का सबसे स्मार्ट पेट टैग'
  },
  'app.description': {
    en: 'Never lose your furry friend again',
    hi: 'अपने प्यारे दोस्त को फिर कभी न खोएं'
  },

  // Navigation
  'nav.home': {
    en: 'Home',
    hi: 'होम'
  },
  'nav.dashboard': {
    en: 'Dashboard',
    hi: 'डैशबोर्ड'
  },
  'nav.myPets': {
    en: 'My Pets',
    hi: 'मेरे पालतू जानवर'
  },
  'nav.scanHistory': {
    en: 'Scan History',
    hi: 'स्कैन इतिहास'
  },
  'nav.settings': {
    en: 'Settings',
    hi: 'सेटिंग्स'
  },
  'nav.logout': {
    en: 'Logout',
    hi: 'लॉग आउट'
  },

  // Auth
  'auth.login': {
    en: 'Login',
    hi: 'लॉग इन'
  },
  'auth.register': {
    en: 'Register',
    hi: 'रजिस्टर करें'
  },
  'auth.email': {
    en: 'Email',
    hi: 'ईमेल'
  },
  'auth.phone': {
    en: 'Phone Number',
    hi: 'फ़ोन नंबर'
  },
  'auth.password': {
    en: 'Password',
    hi: 'पासवर्ड'
  },
  'auth.confirmPassword': {
    en: 'Confirm Password',
    hi: 'पासवर्ड की पुष्टि करें'
  },
  'auth.name': {
    en: 'Full Name',
    hi: 'पूरा नाम'
  },
  'auth.forgotPassword': {
    en: 'Forgot Password?',
    hi: 'पासवर्ड भूल गए?'
  },
  'auth.noAccount': {
    en: "Don't have an account?",
    hi: 'खाता नहीं है?'
  },
  'auth.haveAccount': {
    en: 'Already have an account?',
    hi: 'पहले से खाता है?'
  },

  // Dashboard
  'dashboard.welcome': {
    en: 'Welcome back',
    hi: 'वापसी पर स्वागत है'
  },
  'dashboard.totalPets': {
    en: 'Total Pets',
    hi: 'कुल पालतू जानवर'
  },
  'dashboard.activeTags': {
    en: 'Active Tags',
    hi: 'सक्रिय टैग'
  },
  'dashboard.totalScans': {
    en: 'Total Scans',
    hi: 'कुल स्कैन'
  },
  'dashboard.scansThisMonth': {
    en: 'Scans This Month',
    hi: 'इस महीने के स्कैन'
  },
  'dashboard.recentActivity': {
    en: 'Recent Activity',
    hi: 'हाल की गतिविधि'
  },
  'dashboard.addPet': {
    en: 'Add New Pet',
    hi: 'नया पालतू जोड़ें'
  },

  // Pet
  'pet.name': {
    en: 'Pet Name',
    hi: 'पालतू का नाम'
  },
  'pet.type': {
    en: 'Pet Type',
    hi: 'पालतू का प्रकार'
  },
  'pet.breed': {
    en: 'Breed',
    hi: 'नस्ल'
  },
  'pet.gender': {
    en: 'Gender',
    hi: 'लिंग'
  },
  'pet.age': {
    en: 'Age',
    hi: 'उम्र'
  },
  'pet.color': {
    en: 'Color',
    hi: 'रंग'
  },
  'pet.size': {
    en: 'Size',
    hi: 'आकार'
  },
  'pet.photo': {
    en: 'Photo',
    hi: 'फोटो'
  },
  'pet.personality': {
    en: 'Personality',
    hi: 'व्यक्तित्व'
  },
  'pet.specialNeeds': {
    en: 'Special Needs',
    hi: 'विशेष जरूरतें'
  },
  'pet.microchip': {
    en: 'Microchip ID',
    hi: 'माइक्रोचिप आईडी'
  },

  // Pet Types
  'pet.type.dog': {
    en: 'Dog',
    hi: 'कुत्ता'
  },
  'pet.type.cat': {
    en: 'Cat',
    hi: 'बिल्ली'
  },
  'pet.type.bird': {
    en: 'Bird',
    hi: 'पक्षी'
  },
  'pet.type.rabbit': {
    en: 'Rabbit',
    hi: 'खरगोश'
  },
  'pet.type.other': {
    en: 'Other',
    hi: 'अन्य'
  },

  // Gender
  'pet.gender.male': {
    en: 'Male',
    hi: 'नर'
  },
  'pet.gender.female': {
    en: 'Female',
    hi: 'मादा'
  },
  'pet.gender.unknown': {
    en: 'Unknown',
    hi: 'अज्ञात'
  },

  // Size
  'pet.size.small': {
    en: 'Small',
    hi: 'छोटा'
  },
  'pet.size.medium': {
    en: 'Medium',
    hi: 'मध्यम'
  },
  'pet.size.large': {
    en: 'Large',
    hi: 'बड़ा'
  },

  // Medical
  'medical.info': {
    en: 'Medical Information',
    hi: 'चिकित्सा जानकारी'
  },
  'medical.allergies': {
    en: 'Allergies',
    hi: 'एलर्जी'
  },
  'medical.medications': {
    en: 'Current Medications',
    hi: 'वर्तमान दवाइयां'
  },
  'medical.conditions': {
    en: 'Medical Conditions',
    hi: 'चिकित्सा स्थितियां'
  },
  'medical.vaccinations': {
    en: 'Vaccinations',
    hi: 'टीकाकरण'
  },
  'medical.spayedNeutered': {
    en: 'Spayed/Neutered',
    hi: 'नसबंदी'
  },
  'medical.lastVetVisit': {
    en: 'Last Vet Visit',
    hi: 'अंतिम पशु चिकित्सक यात्रा'
  },

  // Vet
  'vet.info': {
    en: 'Veterinarian Information',
    hi: 'पशु चिकित्सक की जानकारी'
  },
  'vet.name': {
    en: 'Vet Name',
    hi: 'पशु चिकित्सक का नाम'
  },
  'vet.clinic': {
    en: 'Clinic Name',
    hi: 'क्लिनिक का नाम'
  },
  'vet.phone': {
    en: 'Vet Phone',
    hi: 'पशु चिकित्सक का फोन'
  },

  // Emergency Contact
  'emergency.contacts': {
    en: 'Emergency Contacts',
    hi: 'आपातकालीन संपर्क'
  },
  'emergency.addContact': {
    en: 'Add Contact',
    hi: 'संपर्क जोड़ें'
  },
  'emergency.relationship': {
    en: 'Relationship',
    hi: 'संबंध'
  },
  'emergency.primary': {
    en: 'Primary Contact',
    hi: 'प्राथमिक संपर्क'
  },

  // Lost & Found
  'lost.markAsLost': {
    en: 'Mark as Lost',
    hi: 'खोया हुआ चिह्नित करें'
  },
  'lost.markAsFound': {
    en: 'Mark as Found',
    hi: 'मिला हुआ चिह्नित करें'
  },
  'lost.status': {
    en: 'LOST',
    hi: 'खोया हुआ'
  },
  'lost.reward': {
    en: 'Reward',
    hi: 'इनाम'
  },
  'lost.lastSeen': {
    en: 'Last Seen',
    hi: 'अंतिम बार देखा गया'
  },
  'lost.helpFind': {
    en: 'Help us find this pet!',
    hi: 'इस पालतू जानवर को खोजने में मदद करें!'
  },

  // Public Profile (Finder View)
  'finder.title': {
    en: "You found someone's pet!",
    hi: 'आपने किसी का पालतू जानवर पाया!'
  },
  'finder.thankYou': {
    en: 'Thank you for scanning this tag',
    hi: 'इस टैग को स्कैन करने के लिए धन्यवाद'
  },
  'finder.contactOwner': {
    en: 'Contact Owner',
    hi: 'मालिक से संपर्क करें'
  },
  'finder.callOwner': {
    en: 'Call Owner',
    hi: 'मालिक को कॉल करें'
  },
  'finder.whatsappOwner': {
    en: 'WhatsApp Owner',
    hi: 'मालिक को व्हाट्सएप करें'
  },
  'finder.shareLocation': {
    en: 'Share Your Location',
    hi: 'अपना स्थान साझा करें'
  },
  'finder.leaveMessage': {
    en: 'Leave a Message',
    hi: 'संदेश छोड़ें'
  },
  'finder.yourName': {
    en: 'Your Name',
    hi: 'आपका नाम'
  },
  'finder.yourPhone': {
    en: 'Your Phone',
    hi: 'आपका फोन'
  },
  'finder.message': {
    en: 'Message for Owner',
    hi: 'मालिक के लिए संदेश'
  },
  'finder.submit': {
    en: 'Send to Owner',
    hi: 'मालिक को भेजें'
  },
  'finder.ownerNotified': {
    en: 'Owner has been notified!',
    hi: 'मालिक को सूचित कर दिया गया है!'
  },

  // Scan History
  'scan.history': {
    en: 'Scan History',
    hi: 'स्कैन इतिहास'
  },
  'scan.location': {
    en: 'Location',
    hi: 'स्थान'
  },
  'scan.time': {
    en: 'Time',
    hi: 'समय'
  },
  'scan.viewOnMap': {
    en: 'View on Map',
    hi: 'मैप पर देखें'
  },
  'scan.finderInfo': {
    en: 'Finder Information',
    hi: 'खोजने वाले की जानकारी'
  },

  // Settings
  'settings.notifications': {
    en: 'Notification Settings',
    hi: 'अधिसूचना सेटिंग्स'
  },
  'settings.sms': {
    en: 'SMS Notifications',
    hi: 'एसएमएस अधिसूचनाएं'
  },
  'settings.email': {
    en: 'Email Notifications',
    hi: 'ईमेल अधिसूचनाएं'
  },
  'settings.whatsapp': {
    en: 'WhatsApp Notifications',
    hi: 'व्हाट्सएप अधिसूचनाएं'
  },
  'settings.push': {
    en: 'Push Notifications',
    hi: 'पुश अधिसूचनाएं'
  },
  'settings.language': {
    en: 'Language',
    hi: 'भाषा'
  },
  'settings.profile': {
    en: 'Profile Settings',
    hi: 'प्रोफ़ाइल सेटिंग्स'
  },

  // Buttons & Actions
  'action.save': {
    en: 'Save',
    hi: 'सहेजें'
  },
  'action.cancel': {
    en: 'Cancel',
    hi: 'रद्द करें'
  },
  'action.edit': {
    en: 'Edit',
    hi: 'संपादित करें'
  },
  'action.delete': {
    en: 'Delete',
    hi: 'हटाएं'
  },
  'action.confirm': {
    en: 'Confirm',
    hi: 'पुष्टि करें'
  },
  'action.back': {
    en: 'Back',
    hi: 'वापस'
  },
  'action.next': {
    en: 'Next',
    hi: 'अगला'
  },
  'action.submit': {
    en: 'Submit',
    hi: 'जमा करें'
  },
  'action.getStarted': {
    en: 'Get Started',
    hi: 'शुरू करें'
  },
  'action.learnMore': {
    en: 'Learn More',
    hi: 'और जानें'
  },
  'action.buyNow': {
    en: 'Buy Now',
    hi: 'अभी खरीदें'
  },

  // Landing Page
  'landing.hero.title': {
    en: "India's Smartest QR Pet Tag",
    hi: 'भारत का सबसे स्मार्ट QR पेट टैग'
  },
  'landing.hero.subtitle': {
    en: 'Instant alerts via SMS, WhatsApp & Email when someone finds your pet',
    hi: 'जब कोई आपका पालतू जानवर पाए तो SMS, व्हाट्सएप और ईमेल से तुरंत अलर्ट'
  },
  'landing.feature.qr': {
    en: 'QR Code Technology',
    hi: 'क्यूआर कोड तकनीक'
  },
  'landing.feature.qr.desc': {
    en: 'Simple scan with any smartphone camera',
    hi: 'किसी भी स्मार्टफोन कैमरे से आसान स्कैन'
  },
  'landing.feature.instant': {
    en: 'Instant Notifications',
    hi: 'तुरंत सूचनाएं'
  },
  'landing.feature.instant.desc': {
    en: 'Get SMS, WhatsApp & Email alerts immediately',
    hi: 'तुरंत SMS, व्हाट्सएप और ईमेल अलर्ट पाएं'
  },
  'landing.feature.gps': {
    en: 'GPS Location',
    hi: 'जीपीएस स्थान'
  },
  'landing.feature.gps.desc': {
    en: "Know exactly where your pet was found",
    hi: 'जानें कि आपका पालतू कहां मिला'
  },
  'landing.feature.whatsapp': {
    en: 'WhatsApp Integration',
    hi: 'व्हाट्सएप एकीकरण'
  },
  'landing.feature.whatsapp.desc': {
    en: 'Direct chat with finder via WhatsApp',
    hi: 'व्हाट्सएप के माध्यम से खोजने वाले से सीधी बात'
  },
  'landing.howItWorks': {
    en: 'How It Works',
    hi: 'यह कैसे काम करता है'
  },
  'landing.step1': {
    en: 'Register your pet',
    hi: 'अपने पालतू को रजिस्टर करें'
  },
  'landing.step2': {
    en: 'Attach the tag',
    hi: 'टैग लगाएं'
  },
  'landing.step3': {
    en: 'Get instant alerts',
    hi: 'तुरंत अलर्ट पाएं'
  },
  'landing.pricing': {
    en: 'Pricing',
    hi: 'मूल्य'
  },
  'landing.testimonials': {
    en: 'What Pet Parents Say',
    hi: 'पेट पैरेंट्स क्या कहते हैं'
  },

  // Messages
  'message.success': {
    en: 'Success!',
    hi: 'सफल!'
  },
  'message.error': {
    en: 'Error',
    hi: 'त्रुटि'
  },
  'message.saved': {
    en: 'Changes saved successfully',
    hi: 'परिवर्तन सफलतापूर्वक सहेजे गए'
  },
  'message.deleted': {
    en: 'Deleted successfully',
    hi: 'सफलतापूर्वक हटाया गया'
  },
  'message.tagScanned': {
    en: 'Tag scanned! Owner notified.',
    hi: 'टैग स्कैन किया गया! मालिक को सूचित किया गया।'
  },
  'message.locationShared': {
    en: 'Location shared with owner',
    hi: 'मालिक के साथ स्थान साझा किया गया'
  },

  // Errors
  'error.required': {
    en: 'This field is required',
    hi: 'यह फ़ील्ड आवश्यक है'
  },
  'error.invalidEmail': {
    en: 'Please enter a valid email',
    hi: 'कृपया एक वैध ईमेल दर्ज करें'
  },
  'error.invalidPhone': {
    en: 'Please enter a valid phone number',
    hi: 'कृपया एक वैध फोन नंबर दर्ज करें'
  },
  'error.passwordMismatch': {
    en: 'Passwords do not match',
    hi: 'पासवर्ड मेल नहीं खाते'
  },
  'error.loginFailed': {
    en: 'Invalid email or password',
    hi: 'अमान्य ईमेल या पासवर्ड'
  },
  'error.petNotFound': {
    en: 'Pet not found',
    hi: 'पालतू जानवर नहीं मिला'
  },
  'error.tagNotFound': {
    en: 'Tag not found or not activated',
    hi: 'टैग नहीं मिला या सक्रिय नहीं है'
  }
};

// Get current language from localStorage or default to English
const getStoredLanguage = (): Language => {
  const stored = localStorage.getItem('pawtag_language');
  return (stored === 'hi' ? 'hi' : 'en') as Language;
};

// Set language in localStorage
const setStoredLanguage = (lang: Language): void => {
  localStorage.setItem('pawtag_language', lang);
};

export const LanguageService = {
  // Get current language
  getCurrentLanguage: (): Language => {
    return getStoredLanguage();
  },

  // Set current language
  setLanguage: (lang: Language): void => {
    setStoredLanguage(lang);
  },

  // Translate a key
  t: (key: string, lang?: Language): string => {
    const currentLang = lang || getStoredLanguage();
    const translation = translations[key];

    if (!translation) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }

    return translation[currentLang] || translation['en'] || key;
  },

  // Get all translations for a language
  getAllTranslations: (lang: Language): Record<string, string> => {
    const result: Record<string, string> = {};

    Object.keys(translations).forEach(key => {
      result[key] = translations[key][lang] || translations[key]['en'];
    });

    return result;
  },

  // Check if a translation exists
  hasTranslation: (key: string): boolean => {
    return key in translations;
  },

  // Get available languages
  getAvailableLanguages: (): { code: Language; name: string; nativeName: string }[] => {
    return [
      { code: 'en', name: 'English', nativeName: 'English' },
      { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' }
    ];
  }
};

// Export a shorthand function for translations
export const t = LanguageService.t;
