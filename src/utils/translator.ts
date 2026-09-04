/**
 * Global Page Translation Engine for JanAI
 * Translates 100% of the portal's UI, text nodes, schemes, guidelines,
 * forms, badges, and alerts into any chosen Indian language.
 */

export const GT_LANGUAGE_MAP: Record<string, string> = {
  en: 'en',
  hi: 'hi', // Hindi
  bn: 'bn', // Bengali
  mr: 'mr', // Marathi
  te: 'te', // Telugu
  ta: 'ta', // Tamil
  gu: 'gu', // Gujarati
  ur: 'ur', // Urdu
  kn: 'kn', // Kannada
  or: 'or', // Odia
  ml: 'ml', // Malayalam
  pa: 'pa', // Punjabi
  as: 'as', // Assamese
  mai: 'mai', // Maithili
  sat: 'sat', // Santali
  ks: 'ks', // Kashmiri
  ne: 'ne', // Nepali
  gom: 'gom', // Konkani
  doi: 'doi', // Dogri
  mni: 'mni', // Manipuri (Meitei)
  brx: 'brx', // Bodo
  sa: 'sa', // Sanskrit
  sd: 'sd', // Sindhi
  bho: 'bho', // Bhojpuri
  lus: 'lus', // Mizo

  // Regional/State/Tribal Dialects mapped to closest primary script/literary standard
  awa: 'hi', // Awadhi -> Hindi
  hne: 'hi', // Chhattisgarhi -> Hindi
  bgc: 'hi', // Haryanvi -> Hindi
  raj: 'hi', // Rajasthani -> Hindi
  mwr: 'hi', // Marwari -> Hindi
  bns: 'hi', // Bundeli -> Hindi
  bfy: 'hi', // Bagheli -> Hindi
  spv: 'or', // Sambalpuri -> Odia
  mag: 'bho', // Magahi -> Bhojpuri/Hindi
  anp: 'hi', // Angika -> Hindi
  kfy: 'hi', // Kumaoni -> Hindi
  gbm: 'hi', // Garhwali -> Hindi
  tcy: 'kn', // Tulu -> Kannada script
  kfa: 'kn', // Kodava -> Kannada script
  bgj: 'kn', // Beary -> Kannada script
  saz: 'ta', // Sourashtra -> Tamil script
  gon: 'hi', // Gondi -> Hindi
  kru: 'hi', // Kurukh -> Hindi
  unr: 'hi', // Mundari -> Hindi
  bhb: 'gu', // Bhili -> Gujarati
  hlb: 'hi', // Halbi -> Hindi
  sck: 'hi', // Sadri / Nagpuri -> Hindi
  hoc: 'hi', // Ho -> Hindi
  trx: 'bn', // Kokborok -> Bengali script
  kha: 'en', // Khasi
  grt: 'en', // Garo
  njz: 'en', // Tenyidie
  lbj: 'hi', // Ladakhi / Bhoti
  mup: 'hi', // Malwi -> Hindi
  lep: 'ne', // Lepcha -> Nepali script
};

// Dictionary of common portal placeholders across major Indian languages
// Since Google Translate DOM engine skips attribute values like placeholder,
// this dictionary ensures 100% full coverage including search boxes and inputs.
const PLACEHOLDER_TRANSLATIONS: Record<string, Record<string, string>> = {
  'Search 30+ government schemes...': {
    hi: '30+ सरकारी योजनाओं में खोजें...',
    te: '30+ ప్రభుత్వ పథకాలను శోధించండి...',
    ta: '30+ அரசு திட்டங்களைத் தேடுங்கள்...',
    bn: '৩০+ সরকারি প্রকল্পে অনুসন্ধান করুন...',
    mr: '३०+ सरकारी योजनांमध्ये शोधा...',
    gu: '૩૦+ સરકારી યોજનાઓમાં શોધો...',
    kn: '30+ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳಲ್ಲಿ ಹುಡುಕಿ...',
    ml: '30+ സർക്കാർ പദ്ധതികളിൽ തിരയുക...',
    pa: '30+ ਸਰਕਾਰੀ ਸਕੀਮਾਂ ਵਿੱਚ ਖੋਜੋ...',
    ur: '30+ سرکاری اسکیموں میں تلاش کریں...',
    or: '୩୦+ ସରକାରୀ ଯୋଜନାରେ ସନ୍ଧାନ କରନ୍ତୁ...',
  },
  'Search language...': {
    hi: 'भाषा खोजें...',
    te: 'భాషను శోధించండి...',
    ta: 'மொழியைத் தேடுங்கள்...',
    bn: 'ভাষা খুঁজুন...',
    mr: 'भाषा शोधा...',
    gu: 'ભાષા શોધો...',
    kn: 'ಭಾಷೆಯನ್ನು ಹುಡುಕಿ...',
    ml: 'ഭാഷ തിരയുക...',
    pa: 'ਭਾਸ਼ਾ ਖੋਜੋ...',
    ur: 'زبان تلاش کریں...',
    or: 'ଭାଷା ଖୋଜନ୍ତୁ...',
  },
  'Search documents by name, ID number, authority, or tag...': {
    hi: 'दस्तावेज़ का नाम, आईडी नंबर या विभाग से खोजें...',
    te: 'పేరు, ID నంబర్ లేదా విభాగం ద్వారా పత్రాలను శోధించండి...',
    ta: 'பெயர், எண் அல்லது துறை மூலம் ஆவணங்களைத் தேடுங்கள்...',
    bn: 'নাম, আইডি নম্বর বা বিভাগ দ্বারা নথি অনুসন্ধান করুন...',
    mr: 'नाव, ओळख क्रमांक किंवा विभागाद्वारे कागदपत्रे शोधा...',
    gu: 'નામ, આઈડી નંબર અથવા વિભાગ દ્વારા દસ્તાવેજો શોધો...',
    kn: 'ಹೆಸರು, ಐಡಿ ಸಂಖ್ಯೆ ಅಥವಾ ಇಲಾಖೆಯ ಮೂಲಕ ದಾಖಲೆಗಳನ್ನು ಹುಡುಕಿ...',
    ml: 'പേര്, ഐഡി അല്ലെങ്കിൽ ഡിപ്പാർട്ട്മെന്റ് വഴി രേഖകൾ തിരയുക...',
    pa: 'ਨਾਮ, ਆਈਡੀ ਨੰਬਰ ਜਾਂ ਵਿਭਾਗ ਦੁਆਰਾ ਦਸਤਾਵੇਜ਼ ਖੋਜੋ...',
    ur: 'نام، شناختی نمبر، یا اتھارٹی کے ذریعہ دستاویزات تلاش کریں...',
    or: 'ନାମ, ଆଇଡି ନମ୍ବର କିମ୍ବା ବିଭାଗ ଦ୍ୱାରା ଦସ୍ତାବିଜ ଖୋଜନ୍ତୁ...',
  },
  'Search by name, landmark, pincode...': {
    hi: 'नाम, लैंडमार्क या पिनकोड द्वारा खोजें...',
    te: 'పేరు, ల్యాండ్‌మార్క్ లేదా పిన్‌కోడ్ ద్వారా శోధించండి...',
    ta: 'பெயர், அடையாளம் அல்லது பின்கோடு மூலம் தேடுங்கள்...',
    bn: 'নাম, ল্যান্ডমার্ক বা পিনকোড দিয়ে অনুসন্ধান করুন...',
    mr: 'नाव, लँडमार्क किंवा पिनकोडने शोधा...',
    gu: 'નામ, લેન્ડમાર્ક અથવા પિનકોડ દ્વારા શોધો...',
    kn: 'ಹೆಸರು, ಹೆಗ್ಗುರುತು ಅಥವಾ ಪಿನ್‌ಕೋಡ್ ಮೂಲಕ ಹುಡುಕಿ...',
    ml: 'പേര്, ലാൻഡ്‌മാർക്ക് അല്ലെങ്കിൽ പിൻകോഡ് വഴി തിരയുക...',
    pa: 'ਨਾਮ, ਲੈਂਡਮਾਰਕ ਜਾਂ ਪਿੰਨ ਕੋਡ ਦੁਆਰਾ ਖੋਜੋ...',
    ur: 'نام، قریبی نشان یا پن کوڈ کے ذریعہ تلاش کریں...',
    or: 'ନାମ, ଲ୍ୟାଣ୍ଡମାର୍କ କିମ୍ବା ପିନକୋଡ୍ ଦ୍ୱାରା ଖୋଜନ୍ତୁ...',
  },
  'Search scheme name...': {
    hi: 'योजना का नाम खोजें...',
    te: 'పథకం పేరును శోధించండి...',
    ta: 'திட்டத்தின் பெயரைத் தேடுங்கள்...',
    bn: 'প্রকল্পের নাম অনুসন্ধান করুন...',
    mr: 'योजनेचे नाव शोधा...',
    gu: 'યોજનાનું નામ શોધો...',
    kn: 'ಯೋಜನೆಯ ಹೆಸರನ್ನು ಹುಡುಕಿ...',
    ml: 'പദ്ധതിയുടെ പേര് തിരയുക...',
    pa: 'ਸਕੀਮ ਦਾ ਨਾਮ ਖੋਜੋ...',
    ur: 'اسکیم کا نام تلاش کریں...',
    or: 'ଯୋଜନାର ନାମ ଖୋଜନ୍ତୁ...',
  },
  'Enter age': {
    hi: 'आयु दर्ज करें',
    te: 'వయస్సు నమోదు చేయండి',
    ta: 'வயதை உள்ளிடவும்',
    bn: 'বয়স লিখুন',
    mr: 'वय प्रविष्ट करा',
    gu: 'ઉંમર દાખલ કરો',
    kn: 'ವಯಸ್ಸನ್ನು ನಮೂದಿಸಿ',
    ml: 'പ്രായം നൽകുക',
    pa: 'ਉਮਰ ਦਰਜ ਕਰੋ',
    ur: 'عمر درج کریں',
    or: 'ବୟସ ଲେଖନ୍ତୁ',
  },
};

/**
 * Translates input placeholders in the DOM to ensure 100% text translation
 */
export function translateDomPlaceholders(targetLang: string): void {
  if (typeof document === 'undefined') return;

  const gtCode = GT_LANGUAGE_MAP[targetLang] || targetLang;
  const isEnglish = targetLang === 'en' || gtCode === 'en';

  const inputs = document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input[placeholder], textarea[placeholder]');
  inputs.forEach((el) => {
    // Cache original English placeholder if not cached
    if (!el.getAttribute('data-orig-placeholder')) {
      el.setAttribute('data-orig-placeholder', el.placeholder);
    }

    const orig = el.getAttribute('data-orig-placeholder') || el.placeholder;
    if (isEnglish) {
      el.placeholder = orig;
      return;
    }

    // Check direct dictionary
    if (PLACEHOLDER_TRANSLATIONS[orig] && PLACEHOLDER_TRANSLATIONS[orig][gtCode]) {
      el.placeholder = PLACEHOLDER_TRANSLATIONS[orig][gtCode];
      return;
    }

    // Generic fallback for search fields
    if (orig.toLowerCase().includes('search')) {
      const searchTerms: Record<string, string> = {
        hi: 'खोजें...',
        te: 'శోధించండి...',
        ta: 'தேடுங்கள்...',
        bn: 'অনুসন্ধান করুন...',
        mr: 'शोधा...',
        gu: 'શોધો...',
        kn: 'ಹುಡುಕಿ...',
        ml: 'തിരയുക...',
        pa: 'ਖੋਜੋ...',
        ur: 'تلاش کریں...',
        or: 'ଖୋଜନ୍ତୁ...',
      };
      if (searchTerms[gtCode]) {
        el.placeholder = searchTerms[gtCode];
      }
    }
  });
}

/**
 * Ensures Google Translate Element and script are loaded on the page
 */
export function ensureGoogleTranslateLoaded(): void {
  if (typeof window === 'undefined') return;

  // 1. Ensure the DOM container exists off-screen
  if (!document.getElementById('google_translate_element')) {
    const div = document.createElement('div');
    div.id = 'google_translate_element';
    document.body.appendChild(div);
  }

  // 2. Ensure the callback is registered on window
  if (!(window as any).googleTranslateElementInit) {
    (window as any).googleTranslateElementInit = function () {
      try {
        if ((window as any).google && (window as any).google.translate && (window as any).google.translate.TranslateElement) {
          new (window as any).google.translate.TranslateElement(
            {
              pageLanguage: 'en',
              includedLanguages: 'as,bn,bho,brx,doi,gom,gu,hi,kn,ks,mai,ml,mni,mr,ne,or,pa,sa,sat,sd,ta,te,ur,lus,en',
              autoDisplay: false,
            },
            'google_translate_element'
          );
        }
      } catch (e) {
        console.warn('Google Translate initialization error:', e);
      }
    };
  }

  // 3. Inject script if not yet added
  if (!document.querySelector('script[src*="translate.google.com/translate_a/element.js"]')) {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.head.appendChild(script);
  }
}

/**
 * Sets a cookie across all root path and domain variations
 */
function setCookie(name: string, value: string, days = 30) {
  try {
    const d = new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = 'expires=' + d.toUTCString();

    // Standard root path
    document.cookie = `${name}=${value}; ${expires}; path=/; SameSite=Lax`;

    // Host domain
    if (window.location.hostname) {
      document.cookie = `${name}=${value}; ${expires}; path=/; domain=${window.location.hostname}; SameSite=Lax`;
      if (window.location.hostname.includes('.')) {
        document.cookie = `${name}=${value}; ${expires}; path=/; domain=.${window.location.hostname}; SameSite=Lax`;
      }
    }
  } catch (e) {
    console.warn('Could not set translation cookie', e);
  }
}

/**
 * Clears translation cookie across paths and domains
 */
export function clearCookie(name: string) {
  try {
    const past = 'expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    document.cookie = `${name}=; ${past} path=/; SameSite=Lax;`;
    if (typeof window !== 'undefined' && window.location.hostname) {
      document.cookie = `${name}=; ${past} path=/; domain=${window.location.hostname}; SameSite=Lax;`;
      if (window.location.hostname.includes('.')) {
        document.cookie = `${name}=; ${past} path=/; domain=.${window.location.hostname}; SameSite=Lax;`;
      }
    }
  } catch (e) {
    console.warn('Could not clear translation cookie', e);
  }
}

/**
 * Triggers the translation engine to translate 100% of the page text
 * into the selected Indian language.
 *
 * @param targetLang Internal language code (e.g., 'hi', 'te', 'mr', 'en')
 * @param triggerReload Whether to perform a smooth page reload to guarantee 100% root translation
 */
export function applyPageTranslation(targetLang: string, triggerReload = false): void {
  const gtCode = GT_LANGUAGE_MAP[targetLang] || targetLang;

  try {
    localStorage.setItem('janai_selected_lang', targetLang);
    localStorage.setItem('janai_gt_code', gtCode);
  } catch (e) {
    console.warn('localStorage error in applyPageTranslation', e);
  }

  ensureGoogleTranslateLoaded();

  if (targetLang === 'en' || gtCode === 'en') {
    clearCookie('googtrans');
    translateDomPlaceholders('en');

    const select = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
    if (select && select.options) {
      select.selectedIndex = 0;
      select.value = '';
      select.dispatchEvent(new Event('change', { bubbles: true }));
      select.dispatchEvent(new Event('input', { bubbles: true }));
    }

    try {
      const restoreBtn = document.getElementById(':1.restore') || document.getElementById(':2.restore');
      if (restoreBtn) (restoreBtn as HTMLElement).click();

      const iframe = document.querySelector('.goog-te-banner-frame') as HTMLIFrameElement | null;
      if (iframe && iframe.contentDocument) {
        const btn = iframe.contentDocument.querySelector('.goog-te-button button') as HTMLElement | null;
        if (btn) btn.click();
      }
    } catch {
      // ignore
    }

    window.dispatchEvent(new CustomEvent('janai_language_changed', { detail: { lang: 'en', gtCode: 'en' } }));

    if (triggerReload) {
      setTimeout(() => {
        window.location.reload();
      }, 150);
    }
    return;
  }

  // Set the Google Translate cookies for both /en/ and /auto/ prefixes
  setCookie('googtrans', `/en/${gtCode}`);
  setCookie('googtrans', `/auto/${gtCode}`);

  // Translate all input placeholders
  translateDomPlaceholders(targetLang);

  // Find the Google Translate select dropdown and trigger it
  const triggerSelect = (): boolean => {
    const select = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
    if (select && select.options && select.options.length > 0) {
      let matchedIndex = -1;
      for (let i = 0; i < select.options.length; i++) {
        if (select.options[i].value === gtCode) {
          matchedIndex = i;
          break;
        }
      }

      if (matchedIndex >= 0) {
        select.selectedIndex = matchedIndex;
        select.value = gtCode;
        select.dispatchEvent(new Event('change', { bubbles: true }));
        select.dispatchEvent(new Event('input', { bubbles: true }));
        return true;
      }
    }
    return false;
  };

  // If already available, trigger immediately
  if (!triggerSelect()) {
    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      if (triggerSelect() || attempts > 50) {
        clearInterval(interval);
      }
    }, 100);
  }

  // Dispatch custom event so all React components react instantly
  window.dispatchEvent(new CustomEvent('janai_language_changed', { detail: { lang: targetLang, gtCode } }));

  // If explicitly requested on user change, reload after short delay to ensure 100% full-DOM translation
  if (triggerReload) {
    setTimeout(() => {
      window.location.reload();
    }, 200);
  }
}

/**
 * Re-triggers translation when user navigates to a new tab or dynamically mounts new content
 */
export function retriggerPageTranslation(currentLang: string): void {
  if (!currentLang || currentLang === 'en') return;
  const gtCode = GT_LANGUAGE_MAP[currentLang] || currentLang;

  // Re-run placeholder translations
  translateDomPlaceholders(currentLang);

  setTimeout(() => {
    const select = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
    if (select && select.options && select.options.length > 0) {
      for (let i = 0; i < select.options.length; i++) {
        if (select.options[i].value === gtCode) {
          select.selectedIndex = i;
          break;
        }
      }
      select.value = gtCode;
      select.dispatchEvent(new Event('change', { bubbles: true }));
      select.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }, 100);
}

/**
 * Continuously suppresses any Google Translate banner frames, tooltips, or popups
 * while keeping the off-screen select element and communication iframes alive.
 */
export function initGoogleTranslateCleaner(): void {
  if (typeof window === 'undefined') return;

  const purgeGoogleIcons = () => {
    const selectors = [
      '.goog-te-gadget-icon',
      '.goog-logo-link',
      '.VIpgJd-ZVi9I-OR9QNe-Hand',
      '.VIpgJd-ZVi9I-aZ2wEe-wOHMyf',
      '.VIpgJd-ZVi9I-bRP2Yd',
      '.VIpgJd-yAWNEb-hvhGLc',
      '.VIpgJd-yAWNEb-L7lbkb',
      '#goog-gt-tt',
      '#goog-gt-vt',
      'iframe.goog-te-banner-frame',
    ];

    document.querySelectorAll(selectors.join(', ')).forEach((node) => {
      const el = node as HTMLElement;
      // Do NOT hide the inner contents of google_translate_element
      if (el.id !== 'google_translate_element' && !el.closest('#google_translate_element')) {
        el.style.setProperty('display', 'none', 'important');
        el.style.setProperty('visibility', 'hidden', 'important');
        el.style.setProperty('opacity', '0', 'important');
        el.style.setProperty('pointer-events', 'none', 'important');
        el.style.setProperty('height', '0', 'important');
        el.style.setProperty('width', '0', 'important');
      }
    });

    if (document.body.style.top && document.body.style.top !== '0px') {
      document.body.style.top = '0px';
    }
  };

  // Run on load and whenever DOM changes
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', purgeGoogleIcons);
  } else {
    purgeGoogleIcons();
  }

  try {
    const observer = new MutationObserver(() => {
      purgeGoogleIcons();
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
  } catch {
    // ignore
  }
}

// Auto-initialize cleaner
if (typeof window !== 'undefined') {
  initGoogleTranslateCleaner();
  ensureGoogleTranslateLoaded();
}
