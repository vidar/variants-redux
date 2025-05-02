
import React from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { VariantGroup } from "@/types/api";

interface VariantsSectionProps {
  variantGroups: VariantGroup[];
  selectedVariants: string[];
  handleVariantChange: (variantId: string, checked: boolean) => void;
  fetchVariantGroups: () => void;
  fetchingVariants: boolean;
  apiKey: string;
  managementToken: string;
}

const VariantsSection: React.FC<VariantsSectionProps> = ({
  variantGroups,
  selectedVariants,
  handleVariantChange,
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
      
      {variantGroups.length === 0 && !fetchingVariants && (
        <div className="text-sm text-gray-500">
          {apiKey && managementToken 
            ? 'No variant groups found. Click refresh to try again.'
            : 'Enter API Key and Management Token to fetch variants.'}
        </div>
      )}
      
      {fetchingVariants && (
        <div className="text-sm text-gray-500">
          Fetching variant groups...
        </div>
      )}
      
      {variantGroups.length > 0 && (
        <div className="space-y-4">
          <div className="text-sm text-gray-500">
            Select up to 3 variants
          </div>
          {variantGroups.map((group) => (
            <div key={group.id} className="space-y-2">
              <h4 className="text-sm font-medium">{group.name}</h4>
              <div className="grid grid-cols-2 gap-2">
                {group.variants.map((variant) => (
                  <div key={variant.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`variant-${variant.id}`}
                      checked={selectedVariants.includes(variant.id)}
                      onCheckedChange={(checked) => {
                        handleVariantChange(variant.id, checked === true);
                      }}
                    />
                    <Label 
                      htmlFor={`variant-${variant.id}`}
                      className="text-sm cursor-pointer"
                    >
                      {variant.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VariantsSection;
