import { useState, useEffect } from 'react';
import { VariantGroup } from '@/types/api';
import { useToast } from "@/hooks/use-toast";

export const useVariants = (apiKey: string, managementToken: string, cmaHostname: string) => {
  const { toast } = useToast();
  const [variantGroups, setVariantGroups] = useState<VariantGroup[]>([]);
  const [selectedVariants, setSelectedVariants] = useState<string[]>([]);
  const [fetchingVariants, setFetchingVariants] = useState(false);

  // Effect to fetch variant groups when api key and management token are available
  useEffect(() => {
    if (apiKey && managementToken && cmaHostname) {
      fetchVariantGroups();
    }
  }, [apiKey, managementToken, cmaHostname]);

  const fetchVariantGroups = async () => {
    if (!apiKey || !managementToken || !cmaHostname) {
      toast({
        title: "Missing credentials",
        description: "API Key and Management Token are required to fetch variant groups.",
        variant: "destructive",
      });
      return;
    }
    
    setFetchingVariants(true);
    
    try {
      const url = `https://${cmaHostname}/v3/variant_groups?include_variant_info=true`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'api_key': apiKey,
          'authorization': managementToken
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch variant groups: ${response.status}`);
      }
      
      const data = await response.json();
      setVariantGroups(data.variant_groups || []);
    } catch (error) {
      console.error('Error fetching variant groups:', error);
      toast({
        title: "Error",
        description: `Failed to fetch variant groups: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setFetchingVariants(false);
    }
  };
  
  const handleVariantSelection = (variantId: string) => {
    console.log('Selecting variant:', variantId);
    console.log('Current selected:', selectedVariants);
    
    setSelectedVariants((prevSelected) => {
      // If already selected, remove it
      if (prevSelected.includes(variantId)) {
        console.log('Removing variant:', variantId);
        return prevSelected.filter(id => id !== variantId);
      }
      
      // If not selected and we're at the limit, show error and return unchanged
      if (prevSelected.length >= 3) {
        toast({
          title: "Selection limit reached",
          description: "You can select up to 3 variants only.",
          variant: "destructive",
        });
        return prevSelected;
      }
      
      // Otherwise, add the new variant
      console.log('Adding variant:', variantId);
      return [...prevSelected, variantId];
    });
  };

  return {
    variantGroups,
    selectedVariants,
    fetchingVariants,
    fetchVariantGroups,
    handleVariantSelection
  };
};
