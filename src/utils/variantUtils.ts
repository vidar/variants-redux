
// Define consistent colors for variants
export const variantColors = [
  { background: "rgba(59, 130, 246, 0.15)", border: "rgba(59, 130, 246, 0.5)" }, // blue
  { background: "rgba(34, 197, 94, 0.15)", border: "rgba(34, 197, 94, 0.5)" },   // green
  { background: "rgba(168, 85, 247, 0.15)", border: "rgba(168, 85, 247, 0.5)" }, // purple
  { background: "rgba(245, 158, 11, 0.15)", border: "rgba(245, 158, 11, 0.5)" }, // amber
  { background: "rgba(236, 72, 153, 0.15)", border: "rgba(236, 72, 153, 0.5)" }, // pink
  { background: "rgba(20, 184, 166, 0.15)", border: "rgba(20, 184, 166, 0.5)" }  // teal
];

// Function to get variant color by hashing the variant ID
export const getVariantColor = (variantId: string): { background: string, border: string } => {
  // Simple hash function to generate a consistent index for a variant ID
  const hashCode = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    // Make sure hash is always positive
    return Math.abs(hash);
  };
  
  const index = hashCode(variantId) % variantColors.length;
  return variantColors[index];
};

// Function to get a Tailwind CSS class for a variant badge based on index
export const getVariantColorClass = (index: number): string => {
  const colors = [
    "bg-blue-100 text-blue-800 border-blue-300",
    "bg-green-100 text-green-800 border-green-300",
    "bg-purple-100 text-purple-800 border-purple-300",
    "bg-amber-100 text-amber-800 border-amber-300",
    "bg-pink-100 text-pink-800 border-pink-300",
    "bg-teal-100 text-teal-800 border-teal-300"
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
