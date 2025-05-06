
import React from 'react';
import { Button } from "@/components/ui/button";
import { VariantGroup } from "@/types/api";
import SelectedVariantsSection from './SelectedVariantsSection';
import AvailableVariantsSection from './AvailableVariantsSection';

interface VariantsSectionProps {
  variantGroups: VariantGroup[];
  selectedVariants: string[];
  handleVariantChange: (variantId: string) => void;
  reorderVariants: (newOrder: string[]) => void;
  fetchVariantGroups: () => void;
  fetchingVariants: boolean;
  apiKey: string;
  managementToken: string;
}

const VariantsSection: React.FC<VariantsSectionProps> = ({
  variantGroups,
  selectedVariants,
  handleVariantChange,
  reorderVariants,
  fetchVariantGroups,
  fetchingVariants,
  apiKey,
  managementToken
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Variants</h3>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={fetchVariantGroups}
          disabled={fetchingVariants || !apiKey || !managementToken}
        >
          {fetchingVariants ? 'Fetching...' : 'Refresh'}
        </Button>
      </div>
      
      {/* Selected variants section */}
      {selectedVariants.length > 0 && (
        <SelectedVariantsSection
          selectedVariants={selectedVariants}
          variantGroups={variantGroups}
          onRemoveVariant={handleVariantChange}
          onReorderVariants={reorderVariants}
        />
      )}

      {/* Empty state message */}
      {variantGroups.length === 0 && !fetchingVariants && (
        <div className="text-sm text-gray-500">
          {apiKey && managementToken 
            ? 'No variant groups found. Click refresh to try again.'
            : 'Enter API Key and Management Token to fetch variants.'}
        </div>
      )}
      
      {/* Loading state */}
      {fetchingVariants && (
        <div className="text-sm text-gray-500">
          Fetching variant groups...
        </div>
      )}
      
      {/* Available variants for selection */}
      {variantGroups.length > 0 && (
        <AvailableVariantsSection
          variantGroups={variantGroups}
          selectedVariants={selectedVariants}
          onVariantSelect={handleVariantChange}
        />
      )}
    </div>
  );
};

export default VariantsSection;
