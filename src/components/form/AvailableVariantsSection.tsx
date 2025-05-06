
import React from 'react';
import { VariantGroup } from '@/types/api';

interface AvailableVariantsSectionProps {
  variantGroups: VariantGroup[];
  selectedVariants: string[];
  onVariantSelect: (variantId: string) => void;
}

const AvailableVariantsSection: React.FC<AvailableVariantsSectionProps> = ({
  variantGroups,
  selectedVariants,
  onVariantSelect
}) => {
  if (variantGroups.length === 0) {
    return null;
  }

  return (
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
              
              return (
                <button
                  key={variantId}
                  type="button"
                  onClick={() => onVariantSelect(variantId)}
                  className={`py-2 px-3 border rounded-md cursor-pointer transition-colors text-left ${
                    isSelected 
                      ? 'bg-primary/10 border-primary' 
                      : 'hover:bg-secondary'
                  }`}
                >
                  <span className="text-sm">{variant.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AvailableVariantsSection;
