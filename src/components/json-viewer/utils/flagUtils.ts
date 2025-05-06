
// Map of locale codes to country flags
// The format is typically language-COUNTRY where language is a ISO 639-1 code
// and COUNTRY is a ISO 3166-1 alpha-2 code

// Helper function to get the country code from a locale string
const getCountryCodeFromLocale = (locale: string): string => {
  // Split by hyphen and get the country part
  const parts = locale.split('-');
  
  // If there's a country part, return it in uppercase
  if (parts.length > 1) {
    return parts[1].toUpperCase();
  }
  
  // Special case: if it's just a language code, map some common ones to countries
  const languageToCountry: Record<string, string> = {
    'en': 'US',  // English -> US
    'de': 'DE',  // German -> Germany
    'fr': 'FR',  // French -> France
    'es': 'ES',  // Spanish -> Spain
    'it': 'IT',  // Italian -> Italy
    'ja': 'JP',  // Japanese -> Japan
    'zh': 'CN',  // Chinese -> China
    'ru': 'RU',  // Russian -> Russia
    'ar': 'SA',  // Arabic -> Saudi Arabia
    'pt': 'PT',  // Portuguese -> Portugal (not Brazil)
    'ko': 'KR',  // Korean -> South Korea
    'nl': 'NL',  // Dutch -> Netherlands
    'sv': 'SE',  // Swedish -> Sweden
    'fi': 'FI',  // Finnish -> Finland
    'no': 'NO',  // Norwegian -> Norway
    'da': 'DK',  // Danish -> Denmark
    'pl': 'PL',  // Polish -> Poland
    'tr': 'TR',  // Turkish -> Turkey
    'he': 'IL',  // Hebrew -> Israel
    'id': 'ID',  // Indonesian -> Indonesia
    'th': 'TH',  // Thai -> Thailand
    'cs': 'CZ',  // Czech -> Czech Republic
    'hu': 'HU',  // Hungarian -> Hungary
    'vi': 'VN',  // Vietnamese -> Vietnam
  };
  
  return languageToCountry[parts[0].toLowerCase()] || 'UNKNOWN';
};

// Handle special cases for region-specific variants
const handleSpecialCases = (locale: string): string | null => {
  // Normalize to lowercase for comparison
  const normalizedLocale = locale.toLowerCase();
  
  // Special case mappings
  const specialCases: Record<string, string> = {
    'en-us': 'US',
    'en-gb': 'GB',
    'en-ca': 'CA',
    'en-au': 'AU',
    'en-nz': 'NZ',
    'es-mx': 'MX',
    'es-ar': 'AR',
    'fr-ca': 'CA',
    'fr-ch': 'CH',
    'pt-br': 'BR',
    'zh-tw': 'TW',
    'zh-hk': 'HK',
    'zh-sg': 'SG',
  };
  
  return specialCases[normalizedLocale] || null;
};

// Get the correct flag image URL for a locale
export const getCountryFlagForLocale = (locale: string): string => {
  // Check for special cases first
  const specialCase = handleSpecialCases(locale);
  const countryCode = specialCase || getCountryCodeFromLocale(locale);
  
  // Return flag URL - using country code in lowercase
  if (countryCode !== 'UNKNOWN') {
    // Using the Flagpedia API for flag images
    return `https://flagcdn.com/w20/${countryCode.toLowerCase()}.png`;
  }
  
  // Return null if we can't determine the country
  return '';
};
