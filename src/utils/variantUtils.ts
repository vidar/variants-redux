
// Define consistent colors for variants with higher contrast - only red, green, blue
export const variantColors = [
  { background: "rgba(59, 130, 246, 0.25)", border: "rgba(59, 130, 246, 0.7)" },   // blue
  { background: "rgba(239, 68, 68, 0.25)", border: "rgba(239, 68, 68, 0.7)" },     // red
  { background: "rgba(34, 197, 94, 0.25)", border: "rgba(34, 197, 94, 0.7)" },     // green
];

// Simple hash function to generate a consistent index for a variant ID
export const hashString = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  // Make sure hash is always positive
  return Math.abs(hash);
};

// Function to get variant color by hashing the variant ID
export const getVariantColor = (variantId: string): { background: string, border: string } => {
  const index = hashString(variantId) % variantColors.length;
  return variantColors[index];
};

// Function to get a Tailwind CSS class for a variant badge based on variant ID
export const getVariantColorClass = (variantId: string): string => {
  const colors = [
    "bg-blue-200 text-blue-800 border-blue-400",    // blue
    "bg-red-200 text-red-800 border-red-400",       // red
    "bg-green-200 text-green-800 border-green-400", // green
  ];
  
  // Use the same hashing algorithm for consistency
  const index = hashString(variantId) % colors.length;
  return colors[index];
};

// Update to maintain the index-based version for backward compatibility
export const getVariantColorClassByIndex = (index: number): string => {
  const colors = [
    "bg-blue-200 text-blue-800 border-blue-400",    // blue
    "bg-red-200 text-red-800 border-red-400",       // red
    "bg-green-200 text-green-800 border-green-400", // green
  ];
  return colors[index % colors.length];
};

// Function to enhance the response data with variant names
export const enhanceResponseWithVariantNames = (data: any, variantDetails: {id: string, name: string, groupName?: string}[]) => {
  // Create a map for quick lookup of variant details by ID
  const variantMap = new Map(
    variantDetails.map(variant => [variant.id, variant])
  );
  
  if (data && data.entry && data.entry._applied_variants) {
    // Create a deep copy to avoid mutation
    const result = JSON.parse(JSON.stringify(data));
    
    // Add _variant_names alongside _applied_variants
    result.entry._variant_names = {};
    
    // For each applied variant, add its name
    Object.entries(result.entry._applied_variants).forEach(([field, variantId]) => {
      const variant = variantMap.get(variantId as string);
      if (variant) {
        result.entry._variant_names[field] = variant.name;
      }
    });
    
    return result;
  }
  
  return data;
};

// Create a utility function to map variants to a format usable by components
export const createVariantMap = (variantGroups: any[]): Map<string, {name: string, groupName?: string}> => {
  const variantMap = new Map<string, {name: string, groupName?: string}>();
  
  variantGroups.forEach(group => {
    if (group.variants && Array.isArray(group.variants)) {
      group.variants.forEach((variant: any) => {
        if (variant.id) {
          variantMap.set(variant.id, {
            name: variant.name,
            groupName: group.name
          });
        }
      });
    }
  });
  
  return variantMap;
};
