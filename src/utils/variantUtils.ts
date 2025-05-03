
// Define consistent colors for variants with much higher contrast
export const variantColors = [
  { background: "rgba(0, 89, 255, 0.4)", border: "rgba(0, 89, 255, 1)" },       // bright blue
  { background: "rgba(255, 217, 0, 0.4)", border: "rgba(255, 217, 0, 1)" },     // bright yellow
  { background: "rgba(255, 0, 0, 0.4)", border: "rgba(255, 0, 0, 1)" },         // bright red
  { background: "rgba(0, 128, 0, 0.4)", border: "rgba(0, 128, 0, 1)" },         // green
  { background: "rgba(0, 128, 128, 0.4)", border: "rgba(0, 128, 128, 1)" },     // teal
  { background: "rgba(128, 0, 0, 0.4)", border: "rgba(128, 0, 0, 1)" },         // maroon
  { background: "rgba(255, 102, 0, 0.4)", border: "rgba(255, 102, 0, 1)" },     // orange
  { background: "rgba(255, 0, 255, 0.4)", border: "rgba(255, 0, 255, 1)" },     // pink
  { background: "rgba(128, 128, 128, 0.4)", border: "rgba(128, 128, 128, 1)" }, // grey
  { background: "rgba(47, 79, 79, 0.4)", border: "rgba(47, 79, 79, 1)" }        // darkgrey
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
    "bg-blue-100 text-blue-900 border-blue-700 border-2",       // blue
    "bg-yellow-100 text-yellow-900 border-yellow-500 border-2", // yellow
    "bg-red-100 text-red-900 border-red-700 border-2",          // red
    "bg-green-100 text-green-900 border-green-700 border-2",    // green
    "bg-teal-100 text-teal-900 border-teal-700 border-2",       // teal
    "bg-rose-100 text-rose-900 border-rose-900 border-2",       // maroon
    "bg-orange-100 text-orange-900 border-orange-500 border-2", // orange
    "bg-pink-100 text-pink-900 border-pink-600 border-2",       // pink
    "bg-gray-100 text-gray-900 border-gray-500 border-2",       // grey
    "bg-slate-200 text-slate-900 border-slate-800 border-2",    // darkgrey
  ];
  
  // Use the same hashing algorithm for consistency
  const index = hashString(variantId) % colors.length;
  return colors[index];
};

// Update to maintain the index-based version for backward compatibility
export const getVariantColorClassByIndex = (index: number): string => {
  const colors = [
    "bg-blue-100 text-blue-900 border-blue-700 border-2",       // blue
    "bg-yellow-100 text-yellow-900 border-yellow-500 border-2", // yellow
    "bg-red-100 text-red-900 border-red-700 border-2",          // red
    "bg-green-100 text-green-900 border-green-700 border-2",    // green
    "bg-teal-100 text-teal-900 border-teal-700 border-2",       // teal
    "bg-rose-100 text-rose-900 border-rose-900 border-2",       // maroon
    "bg-orange-100 text-orange-900 border-orange-500 border-2", // orange
    "bg-pink-100 text-pink-900 border-pink-600 border-2",       // pink
    "bg-gray-100 text-gray-900 border-gray-500 border-2",       // grey
    "bg-slate-200 text-slate-900 border-slate-800 border-2",    // darkgrey
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
