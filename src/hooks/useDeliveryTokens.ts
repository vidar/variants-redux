
import { useState, useEffect, useCallback } from 'react';

export interface DeliveryToken {
  uid: string;
  name: string;
  description: string;
  scope: {
    environments: string[];
  };
}

export const useDeliveryTokens = (apiKey: string, managementToken: string, cmaHostname: string) => {
  const [tokens, setTokens] = useState<DeliveryToken[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTokens = useCallback(async () => {
    if (!apiKey || !managementToken || !cmaHostname) {
      setError('API Key, Management Token, and CMA Hostname are required');
      setTokens([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      // Based on https://www.contentstack.com/docs/developers/apis/content-management-api#get-all-tokens
      const response = await fetch(`https://${cmaHostname}/v3/stacks/delivery_tokens`, {
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
      
      // Map tokens to the format we need
      const formattedTokens = data.tokens?.map((token: any) => ({
        uid: token.uid,
        name: token.name,
        description: token.description || '',
        scope: token.scope || { environments: [] }
      })) || [];
      
      setTokens(formattedTokens);
    } catch (err) {
      console.error('Failed to fetch delivery tokens:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch delivery tokens');
      setTokens([]);
    } finally {
      setIsLoading(false);
    }
  }, [apiKey, managementToken, cmaHostname]);

  useEffect(() => {
    if (apiKey && managementToken && cmaHostname) {
      fetchTokens();
    } else {
      setTokens([]);
    }
  }, [apiKey, managementToken, cmaHostname, fetchTokens]);

  return {
    tokens,
    isLoading,
    error,
    fetchTokens
  };
};
