
// Utility functions for JsonViewer component

// Type to store variant info for display
export interface VariantInfo {
  id: string;
  name?: string;
}

// Function to remove _variant_names from the data display
// and optionally remove publish_details and timestamps
export const getDisplayData = (data: any, hidePublishDetails: boolean = false, hideTimestamps: boolean = false): any => {
  if (!data) return data;
  
  // Deep copy to avoid mutating original data
  const displayData = JSON.parse(JSON.stringify(data));
  
  // If we have entry with _variant_names, remove it
  if (displayData && displayData.entry && displayData.entry._variant_names) {
    delete displayData.entry._variant_names;
  }
  
  // If hidePublishDetails is true, remove publish_details from the data
  if (hidePublishDetails) {
    const removePublishDetails = (obj: any) => {
      if (obj && typeof obj === 'object') {
        // Remove publish_details if it exists
        if ('publish_details' in obj) {
          delete obj.publish_details;
        }
        
        // Recurse through all properties
        for (const key in obj) {
          if (typeof obj[key] === 'object' && obj[key] !== null) {
            removePublishDetails(obj[key]);
          }
        }
      }
      return obj;
    };
    
    removePublishDetails(displayData);
  }
  
  // If hideTimestamps is true, remove fields that start with created_ or updated_
  if (hideTimestamps) {
    const removeTimestamps = (obj: any) => {
      if (obj && typeof obj === 'object') {
        // Remove keys that start with created_ or updated_
        Object.keys(obj).forEach(key => {
          if (key.startsWith('created_') || key.startsWith('updated_')) {
            delete obj[key];
          } else if (typeof obj[key] === 'object' && obj[key] !== null) {
            removeTimestamps(obj[key]);
          }
        });
      }
      return obj;
    };
    
    removeTimestamps(displayData);
  }
  
  return displayData;
};

// Function to extract variant info from the entry data
export const extractVariantInfo = (data: any): Map<string, VariantInfo> => {
  const variantInfoMap = new Map<string, VariantInfo>();
  
  if (!data || !data.entry || !data.entry._applied_variants) return variantInfoMap;
  
  // Extract variant IDs and names (if available)
  Object.entries(data.entry._applied_variants).forEach(([field, variantId]) => {
    if (typeof variantId === 'string') {
      let name = variantId;
      
      // If we have _variant_names, use that for display
      if (data.entry._variant_names && data.entry._variant_names[field]) {
        name = data.entry._variant_names[field];
      }
      
      variantInfoMap.set(variantId as string, { 
        id: variantId as string,
        name
      });
    }
  });
  
  return variantInfoMap;
};

// Helper function to check if a line refers to the field at the current path
export const isFieldAtCurrentPath = (line: string, lineIndex: number, allLines: string[], fieldPath: string[]): boolean => {
  // This is a simplified way to check; it works in many cases but isn't foolproof
  
  // Check if the line has the correct indentation level
  const indentation = line.match(/^\s*/)?.[0].length || 0;
  
  // Get the last element of the path which is the actual field name
  const fieldName = fieldPath[fieldPath.length - 1];
  
  // The field should be at this line
  return line.trim().startsWith(`"${fieldName}":`);
};

// Maps variant IDs to their positions in lines of formatted JSON
export const mapVariantsToLines = (jsonStr: string, obj: any): Map<number, string> => {
  if (!obj) return new Map();
  
  const lines = jsonStr.split('\n');
  const result = new Map<number, string>();
  
  // Function to track the path during traversal
  const processObject = (obj: any, path: string[] = []) => {
    if (!obj || typeof obj !== 'object') return;
    
    // Only process _applied_variants at the current level
    // Do not traverse down for variant coloring from a parent
    if (obj._applied_variants && typeof obj._applied_variants === 'object') {
      Object.entries(obj._applied_variants).forEach(([field, variantId]) => {
        // We should only look for fields at the current object level
        // Find the line that contains this field in the current object context
        const fieldPath = [...path, field];
        const fieldPattern = `"${field}"`;
        
        // Calculate the expected indentation level for this field
        // based on the current path depth
        const expectedIndentLevel = path.length * 2;
        
        // Look for the pattern in all lines with correct context
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          if (line.includes(fieldPattern)) {
            const currentIndent = line.match(/^\s*/)?.[0].length || 0;
            
            // Check if this is the correct instance by looking at indentation
            // Only highlight fields that are at the same object level as the _applied_variants
            if (Math.abs(currentIndent - expectedIndentLevel) <= 2 && isFieldAtCurrentPath(line, i, lines, fieldPath)) {
              result.set(i, variantId as string);
            }
          }
        }
      });
    }
    
    // Recursively process all nested objects, but maintain separate context
    Object.entries(obj).forEach(([key, value]) => {
      if (value && typeof value === 'object' && key !== '_applied_variants') {
        processObject(value, [...path, key]);
      }
    });
  };
  
  processObject(obj);
  return result;
};
