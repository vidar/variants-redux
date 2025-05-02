
import { useState, useEffect, useCallback } from 'react';
import { VariantGroup } from '@/types/api';
import { useToast } from "@/hooks/use-toast";

export const useVariants = (apiKey: string, managementToken: string, cmaHostname: string, onVariantsChange?: (variants: string[]) => void) => {
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

  // Effect to call the onVariantsChange callback when selectedVariants changes
  useEffect(() => {
    if (onVariantsChange && selectedVariants) {
      console.log("Calling onVariantsChange with:", selectedVariants);
      onVariantsChange(selectedVariants);
    }
  }, [selectedVariants, onVariantsChange]);

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
      console.log("Variant groups data:", data);
      
      // Make sure we have valid variant groups with proper IDs
      const validVariantGroups = (data.variant_groups || []).map(group => ({
        ...group,
        variants: (group.variants || []).map(variant => ({
          ...variant,
          id: variant.id || variant.uid || `${group.id}-${variant.name}`
        }))
      }));
      
      setVariantGroups(validVariantGroups);
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
    // Stringification for safety, to handle any object-like variantId
    const idString = String(variantId);
    console.log("Handling variant selection for ID:", idString);
    
    if (!idString || idString === "undefined") {
      console.error('Invalid or undefined variant ID provided:', variantId);
      return;
    }
    
    setSelectedVariants(prev => {
      // If already selected, remove it
      if (prev.includes(idString)) {
        console.log(`Removing variant from selection: ${idString}`);
        return prev.filter(id => id !== idString);
      }
      
      // If not selected and we're at the limit, show error
      if (prev.length >= 3) {
        toast({
          title: "Selection limit reached",
          description: "You can select up to 3 variants only.",
          variant: "destructive",
        });
        return prev;
      }
      
      // Add the new variant
      console.log(`Adding variant to selection: ${idString}`);
      return [...prev, idString];
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
