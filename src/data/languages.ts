import { LanguageOption } from '../types';

/**
 * 22 Constitutionally Recognized Scheduled Languages of India (8th Schedule of Indian Constitution)
 * Strictly authentic Indian languages with official constitutional status.
 */
export const SCHEDULED_INDIAN_LANGUAGES: LanguageOption[] = [
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া' },
  { code: 'mai', name: 'Maithili', nativeName: 'मैथिली' },
  { code: 'sat', name: 'Santali', nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ' },
  { code: 'ks', name: 'Kashmiri', nativeName: 'कॉशुर / كأشُر' },
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली' },
  { code: 'gom', name: 'Konkani', nativeName: 'कोंकणी' },
  { code: 'doi', name: 'Dogri', nativeName: 'डोगरी' },
  { code: 'mni', name: 'Manipuri (Meitei)', nativeName: 'ꯃꯩꯇꯩꯂꯣꯟ / মৈতৈলোন্' },
  { code: 'brx', name: 'Bodo', nativeName: 'बर\'' },
  { code: 'sa', name: 'Sanskrit', nativeName: 'संस्कृतम्' },
  { code: 'sd', name: 'Sindhi', nativeName: 'सिंधी / سنڌي' },
];

/**
 * Recognized Regional, State, and Tribal Indian Languages
 * Indigenous and spoken across states, union territories, and tribal belts of India.
 */
export const REGIONAL_INDIAN_LANGUAGES: LanguageOption[] = [
  { code: 'bho', name: 'Bhojpuri', nativeName: 'भोजपुरी' },
  { code: 'awa', name: 'Awadhi', nativeName: 'अवधी' },
  { code: 'hne', name: 'Chhattisgarhi', nativeName: 'छत्तीसगढ़ी' },
  { code: 'bgc', name: 'Haryanvi', nativeName: 'हरियाणवी' },
  { code: 'raj', name: 'Rajasthani', nativeName: 'राजस्थानी' },
  { code: 'mwr', name: 'Marwari', nativeName: 'मारवाड़ी' },
  { code: 'bns', name: 'Bundeli', nativeName: 'बुंदेली' },
  { code: 'bfy', name: 'Bagheli', nativeName: 'बघेली' },
  { code: 'spv', name: 'Sambalpuri (Kosali)', nativeName: 'ସମ୍ବଲପୁରୀ' },
  { code: 'mag', name: 'Magahi', nativeName: 'मगही' },
  { code: 'anp', name: 'Angika', nativeName: 'अंगिका' },
  { code: 'kfy', name: 'Kumaoni', nativeName: 'कुमाऊँनी' },
  { code: 'gbm', name: 'Garhwali', nativeName: 'गढ़वाली' },
  { code: 'tcy', name: 'Tulu', nativeName: 'ತುಳು' },
  { code: 'kfa', name: 'Kodava (Coorgi)', nativeName: 'ಕೊಡವ ತಕ್ಕ್' },
  { code: 'bgj', name: 'Beary', nativeName: 'ಬ್ಯಾರಿ' },
  { code: 'saz', name: 'Sourashtra', nativeName: 'ꢱꢵꢫꢵꢰꣀꢵ' },
  { code: 'gon', name: 'Gondi', nativeName: 'गोंडी' },
  { code: 'kru', name: 'Kurukh (Oraon)', nativeName: 'कुड़ुख़' },
  { code: 'unr', name: 'Mundari', nativeName: 'मुंडारी' },
  { code: 'bhb', name: 'Bhili', nativeName: 'भीली' },
  { code: 'hlb', name: 'Halbi', nativeName: 'हल्बी' },
  { code: 'sck', name: 'Sadri (Nagpuri)', nativeName: 'नागपुरी' },
  { code: 'hoc', name: 'Ho', nativeName: 'ᱦᱳ' },
  { code: 'trx', name: 'Kokborok (Tripuri)', nativeName: 'ককবরক' },
  { code: 'kha', name: 'Khasi', nativeName: 'Khasi' },
  { code: 'grt', name: 'Garo', nativeName: 'Garo' },
  { code: 'lus', name: 'Mizo', nativeName: 'Mizo' },
  { code: 'njz', name: 'Tenyidie (Angami Naga)', nativeName: 'Tenyidie' },
  { code: 'lbj', name: 'Ladakhi / Bhoti', nativeName: 'ལ་དྭགས་སྐད་' },
  { code: 'mup', name: 'Malwi', nativeName: 'मालवी' },
  { code: 'lep', name: 'Lepcha', nativeName: 'Lepcha' },
];

/**
 * Complete collection containing ONLY authentic Indian languages.
 * (English is excluded as it is not an indigenous/scheduled Indian language).
 */
export const ALL_INDIAN_LANGUAGES: LanguageOption[] = [
  ...SCHEDULED_INDIAN_LANGUAGES,
  ...REGIONAL_INDIAN_LANGUAGES,
];

/**
 * System default option (English Original) for resetting portal view
 */
export const DEFAULT_ENGLISH_OPTION: LanguageOption = {
  code: 'en',
  name: 'English (Original)',
  nativeName: 'English',
};

/**
 * Complete set of portal languages including default English reset
 */
export const PORTAL_LANGUAGES: LanguageOption[] = [
  DEFAULT_ENGLISH_OPTION,
  ...ALL_INDIAN_LANGUAGES,
];

/**
 * Helper to safely look up any language by code with fallback
 */
export function getLanguageByCode(code: string): LanguageOption {
  if (code === 'en') {
    return DEFAULT_ENGLISH_OPTION;
  }
  const found = ALL_INDIAN_LANGUAGES.find((l) => l.code === code);
  if (found) return found;
  return {
    code,
    name: code.toUpperCase(),
    nativeName: code.toUpperCase(),
  };
}
