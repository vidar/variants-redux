
import { useState, useEffect, useCallback } from 'react';

export interface ContentType {
  uid: string;
  title: string;
  description?: string;
}

export const useContentTypes = (apiKey: string, managementToken: string, cmaHostname: string) => {
  const [contentTypes, setContentTypes] = useState<ContentType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchContentTypes = useCallback(async () => {
    if (!apiKey || !managementToken || !cmaHostname) {
      setError('API Key, Management Token, and CMA Hostname are required');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`https://${cmaHostname}/v3/content_types`, {
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
      setContentTypes(data.content_types || []);
    } catch (err) {
      console.error('Failed to fetch content types:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch content types');
    } finally {
      setIsLoading(false);
    }
  }, [apiKey, managementToken, cmaHostname]);

  useEffect(() => {
    if (apiKey && managementToken && cmaHostname) {
      fetchContentTypes();
    }
  }, [apiKey, managementToken, cmaHostname, fetchContentTypes]);

  return {
    contentTypes,
    isLoading,
    error,
    fetchContentTypes
  };
};
