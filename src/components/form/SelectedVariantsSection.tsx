
import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DraggableVariantItem from './DraggableVariantItem';
import { VariantGroup } from '@/types/api';

interface SelectedVariantsSectionProps {
  selectedVariants: string[];
  variantGroups: VariantGroup[];
  onRemoveVariant: (variantId: string) => void;
  onReorderVariants: (newOrder: string[]) => void;
}

export interface VariantDetails {
  id: string;
  name: string;
  groupName?: string;
}

const SelectedVariantsSection: React.FC<SelectedVariantsSectionProps> = ({
  selectedVariants,
  variantGroups,
  onRemoveVariant,
  onReorderVariants
}) => {
  // Find variant details by id
  const findVariantDetails = (variantId: string): VariantDetails => {
    for (const group of variantGroups) {
      const variant = group.variants.find(v => v.id === variantId);
      if (variant) {
        return { ...variant, groupName: group.name };
      }
    }
    return { id: variantId, name: variantId };
  };

  // Move item in the array
  const moveItem = (dragIndex: number, hoverIndex: number) => {
    const newOrder = [...selectedVariants];
    const [removed] = newOrder.splice(dragIndex, 1);
    newOrder.splice(hoverIndex, 0, removed);
    onReorderVariants(newOrder);
  };

  if (selectedVariants.length === 0) {
    return null;
  }

  return (
    <div className="mb-4 p-3 border rounded-md bg-gray-50">
      <h4 className="text-sm font-medium mb-2">Selected Variants (drag to reorder)</h4>
      <DndProvider backend={HTML5Backend}>
        <div>
          {selectedVariants.map((variantId, index) => {
            const variantDetails = findVariantDetails(variantId);
            return (
              <DraggableVariantItem
                key={variantId}
                id={variantId}
                index={index}
                name={variantDetails.name}
                groupName={variantDetails.groupName}
                moveItem={moveItem}
                onRemove={onRemoveVariant}
              />
            );
          })}
        </div>
      </DndProvider>
    </div>
  );
};

export default SelectedVariantsSection;
