
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VariantGroup } from "@/types/api";

interface VariantsSectionProps {
  variantGroups: VariantGroup[];
  selectedVariants: string[];
  handleVariantChange: (variantId: string) => void;
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
                {group.variants.map((variant) => {
                  const variantId = variant.id;
                  const isSelected = selectedVariants.includes(variantId);
                  const selectionOrder = selectedVariants.indexOf(variantId);
                  
                  return (
                    <button
                      key={variantId}
                      type="button"
                      onClick={() => {
                        handleVariantChange(variantId);
                      }}
                      className={`py-2 px-3 border rounded-md cursor-pointer transition-colors text-left relative ${
                        isSelected 
                          ? 'bg-primary/10 border-primary' 
                          : 'hover:bg-secondary'
                      }`}
                    >
                      <span className="text-sm">{variant.name}</span>
                      
                      {isSelected && (
                        <Badge 
                          className="absolute top-1 right-1 h-5 w-5 p-0 flex items-center justify-center rounded-full" 
                          variant="secondary"
                        >
                          {selectionOrder + 1}
                        </Badge>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VariantsSection;
