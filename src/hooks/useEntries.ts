
import { useState, useEffect, useCallback } from 'react';

export interface Entry {
  uid: string;
  title: string;
  url?: string;
}

export const useEntries = (apiKey: string, managementToken: string, cmaHostname: string, contentType: string) => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEntries = useCallback(async () => {
    if (!apiKey || !managementToken || !cmaHostname || !contentType) {
      setError('API Key, Management Token, CMA Hostname, and Content Type are required');
      setEntries([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`https://${cmaHostname}/v3/content_types/${contentType}/entries`, {
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
      
      // Map entries to the format we need
      const formattedEntries = data.entries?.map((entry: any) => ({
        uid: entry.uid,
        title: entry.title || `Entry ${entry.uid}`, // Use title if available, or fallback
        url: entry.url
      })) || [];
      
      setEntries(formattedEntries);
    } catch (err) {
      console.error('Failed to fetch entries:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch entries');
      setEntries([]);
    } finally {
      setIsLoading(false);
    }
  }, [apiKey, managementToken, cmaHostname, contentType]);

  useEffect(() => {
    if (apiKey && managementToken && cmaHostname && contentType) {
      fetchEntries();
    } else {
      setEntries([]);
    }
  }, [apiKey, managementToken, cmaHostname, contentType, fetchEntries]);

  return {
    entries,
    isLoading,
    error,
    fetchEntries
  };
};
