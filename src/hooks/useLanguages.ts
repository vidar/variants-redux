
import { useState, useEffect, useCallback } from 'react';

export interface Language {
  code: string;
  name: string;
  fallback_locale: string | null;
}

export const useLanguages = (apiKey: string, managementToken: string, cmaHostname: string) => {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLanguages = useCallback(async () => {
    if (!apiKey || !managementToken || !cmaHostname) {
      setError('API Key, Management Token, and CMA Hostname are required');
      setLanguages([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`https://${cmaHostname}/v3/locales`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'api_key': apiKey,
          'authorization': managementToken
        }
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Map languages to the format we need
      const formattedLanguages = data.locales?.map((locale: any) => ({
        code: locale.code,
        name: locale.name,
        fallback_locale: locale.fallback_locale
      })) || [];
      
      setLanguages(formattedLanguages);
    } catch (err) {
      console.error('Failed to fetch languages:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch languages');
      setLanguages([]);
    } finally {
      setIsLoading(false);
    }
  }, [apiKey, managementToken, cmaHostname]);

  useEffect(() => {
    if (apiKey && managementToken && cmaHostname) {
      fetchLanguages();
    } else {
      setLanguages([]);
    }
  }, [apiKey, managementToken, cmaHostname, fetchLanguages]);

  return {
    languages,
    isLoading,
    error,
    fetchLanguages
  };
};
