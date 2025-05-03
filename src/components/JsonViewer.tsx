
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { getVariantColor } from '@/utils/variantUtils';

interface JsonViewerProps {
  data: any;
  isLoading: boolean;
  error?: string;
}

// Type to store variant info for display
interface VariantInfo {
  id: string;
  name?: string;
}

// Component to render a JSON node
const JsonNode: React.FC<{
  name: string | number;
  value: any;
  indent: number;
  path: string;
  variantId?: string;
  variantName?: string;
}> = ({ name, value, indent, path, variantId, variantName }) => {
  const displayName = typeof name === 'number' ? `[${name}]` : `"${name}"`;
  const isObject = value !== null && 
                  (typeof value === 'object' || Array.isArray(value)) &&
                  Object.keys(value).length > 0;
  
  // Determine styling for variant highlighting
  let nodeStyle = {};
  if (variantId) {
    const { background, border } = getVariantColor(variantId);
    nodeStyle = { 
      backgroundColor: background,
      borderLeft: `3px solid ${border}`,
      paddingLeft: '0.5rem',
      position: 'relative'
    };
  }

  if (isObject) {
    const isArray = Array.isArray(value);
    const bracketOpen = isArray ? '[' : '{';
    const bracketClose = isArray ? ']' : '}';
    
    return (
      <div style={{ ...nodeStyle }}>
        <div style={{ paddingLeft: `${indent * 20}px` }}>
          <span>
            {displayName}: <span className="text-blue-600">{bracketOpen}</span>
          </span>
          
          {variantId && variantName && (
            <span 
              className="text-xs font-normal text-gray-500 ml-2 inline-block"
              style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                padding: '0 4px',
                borderRadius: '3px'
              }}
            >
              {variantName}
            </span>
          )}
        </div>
        
        <div>
          {Object.entries(value).map(([key, val], i) => (
            <JsonNode 
              key={`${path}.${key}`}
              name={isArray ? i : key}
              value={val}
              indent={indent + 1}
              path={`${path}.${key}`}
            />
          ))}
        </div>
        
        <div style={{ paddingLeft: `${indent * 20}px` }}>
          <span className="text-blue-600">{bracketClose}</span>
        </div>
      </div>
    );
  }
  
  // For primitive values
  return (
    <div style={{ ...nodeStyle, paddingLeft: `${indent * 20}px` }}>
      <span>{displayName}: </span>
      <span className={
        typeof value === 'string' 
          ? 'text-green-600' 
          : typeof value === 'number' 
          ? 'text-purple-600' 
          : typeof value === 'boolean' 
          ? 'text-orange-600' 
          : 'text-gray-600'
      }>
        {typeof value === 'string' 
          ? `"${value}"`
          : value === null
          ? 'null'
          : String(value)}
      </span>
      
      {variantId && variantName && (
        <span 
          className="text-xs font-normal text-gray-500 ml-2 inline-block"
          style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            padding: '0 4px',
            borderRadius: '3px'
          }}
        >
          {variantName}
        </span>
      )}
    </div>
  );
};

const JsonViewer: React.FC<JsonViewerProps> = ({ data, isLoading, error }) => {
  const handleCopyClick = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
  };

  // Function to remove _variant_names from the data display
  const getDisplayData = (data: any): any => {
    if (!data) return data;
    
    // Deep copy to avoid mutating original data
    const displayData = JSON.parse(JSON.stringify(data));
    
    // If we have entry with _variant_names, remove it
    if (displayData && displayData.entry && displayData.entry._variant_names) {
      delete displayData.entry._variant_names;
    }
    
    return displayData;
  };
  
  // Map to store variant IDs to their names for display
  const variantInfoMap = new Map<string, VariantInfo>();
  
  // Function to extract variant info from the entry data
  const extractVariantInfo = () => {
    if (!data || !data.entry || !data.entry._applied_variants) return;
    
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
  };
  
  extractVariantInfo();
  
  // Get variant information for a specific field path
  const getVariantForField = (path: string[]): { variantId?: string, variantName?: string } => {
    if (!data?.entry?._applied_variants) return {};
    
    const field = path[path.length - 1];
    const parentPath = path.slice(0, path.length - 1);
    
    // Navigate to the parent object
    let currentObj = data.entry;
    for (const segment of parentPath) {
      if (!currentObj || typeof currentObj !== 'object') return {};
      currentObj = currentObj[segment];
    }
    
    // Check if this field has a variant applied
    if (currentObj && currentObj._applied_variants && currentObj._applied_variants[field]) {
      const variantId = currentObj._applied_variants[field];
      const variant = variantInfoMap.get(variantId as string);
      return {
        variantId: variantId as string,
        variantName: variant?.name
      };
    }
    
    return {};
  };

  const displayData = getDisplayData(data);
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-xl">Response</CardTitle>
        <div>
          {data && !isLoading && !error && (
            <Button variant="ghost" size="sm" onClick={handleCopyClick} className="h-8 px-2">
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0 flex-grow overflow-hidden">
        <div className="bg-sky-50 rounded-md h-full overflow-auto border border-sky-100 p-4">
          {isLoading && (
            <div className="p-4 text-gray-500">Loading...</div>
          )}
          {error && (
            <div className="p-4 text-red-500">{error}</div>
          )}
          {!isLoading && !error && displayData && (
            <div className="font-mono text-sm">
              <JsonNode 
                name="root" 
                value={displayData} 
                indent={0} 
                path="root"
              />
            </div>
          )}
          {!isLoading && !error && !data && (
            <div className="p-4 text-gray-500">No response data</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default JsonViewer;
