
import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import { Move } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { VariantGroup } from "@/types/api";

// Interface for draggable item
interface DraggableVariantItemProps {
  id: string;
  index: number;
  name: string;
  groupName?: string;
  moveItem: (dragIndex: number, hoverIndex: number) => void;
  onRemove: (id: string) => void;
}

// Draggable variant item component
const DraggableVariantItem: React.FC<DraggableVariantItemProps> = ({ 
  id, index, name, groupName, moveItem, onRemove 
}) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'VARIANT_ITEM',
    item: { id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'VARIANT_ITEM',
    hover: (item: { id: string; index: number }, monitor) => {
      if (!monitor.isOver({ shallow: true })) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) return;
      
      moveItem(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  return (
    <div 
      ref={(node) => drag(drop(node))}
      className={`flex items-center justify-between p-2 mb-2 rounded-md border ${
        isDragging ? 'opacity-50 bg-secondary' : 'bg-white'
      }`}
    >
      <div className="flex items-center">
        <Move className="h-4 w-4 mr-2 cursor-move text-gray-400" />
        <div>
          <div className="font-medium">{name}</div>
          {groupName && <div className="text-xs text-gray-500">{groupName}</div>}
        </div>
      </div>
      <button 
        onClick={() => onRemove(id)} 
        className="ml-2 text-red-500 hover:text-red-700"
      >
        &times;
      </button>
    </div>
  );
};

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

// Define a type for the variant details to fix the TypeScript error
interface VariantDetails {
  id: string;
  name: string;
  groupName?: string;
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
  // Function to find variant details by id
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
    reorderVariants(newOrder);
  };
  
  // Remove variant from selection
  const removeVariant = (variantId: string) => {
    handleVariantChange(variantId);
  };

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
                    onRemove={removeVariant}
                  />
                );
              })}
            </div>
          </DndProvider>
        </div>
      )}

      {/* Variant groups display */}
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
                  
                  return (
                    <button
                      key={variantId}
                      type="button"
                      onClick={() => {
                        handleVariantChange(variantId);
                      }}
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
      )}
    </div>
  );
};

export default VariantsSection;
