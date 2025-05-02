
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";

interface JsonViewerProps {
  data: any;
  isLoading: boolean;
  error?: string;
}

const JsonViewer: React.FC<JsonViewerProps> = ({ data, isLoading, error }) => {
  const handleCopyClick = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
  };

  // Color palette for variant highlighting
  const variantColors: Record<string, string> = {};
  const defaultColors = [
    "#9b87f5", "#f97316", "#0EA5E9", "#D946EF", 
    "#8B5CF6", "#1EAEDB", "#33C3F0", "#0FA0CE"
  ];

  const getVariantColor = (variantId: string) => {
    if (!variantColors[variantId]) {
      // Assign next color in rotation
      const colorIndex = Object.keys(variantColors).length % defaultColors.length;
      variantColors[variantId] = defaultColors[colorIndex];
    }
    return variantColors[variantId];
  };

  // Extract applied variants mapping if available
  const extractAppliedVariants = (obj: any): Record<string, string> => {
    if (!obj) return {};
    
    // If entry exists with _applied_variants
    if (obj.entry && obj.entry._applied_variants) {
      return obj.entry._applied_variants;
    }
    
    // Direct _applied_variants at root level
    if (obj._applied_variants) {
      return obj._applied_variants;
    }
    
    return {};
  };

  const renderJson = (obj: any): JSX.Element => {
    const appliedVariants = extractAppliedVariants(obj);
    console.log("Applied variants:", appliedVariants);

    const renderJsonNode = (
      value: any, 
      key: string = '', 
      path: string = '',
      isLast: boolean = true
    ): JSX.Element => {
      const currentPath = path ? `${path}.${key}` : key;
      const variantId = appliedVariants[currentPath];
      
      // Style for the entire line if a variant is applied
      const lineStyle: React.CSSProperties = variantId ? {
        backgroundColor: `${getVariantColor(variantId)}20`, // 20 is hex for 12% opacity
        borderLeft: `3px solid ${getVariantColor(variantId)}`,
        paddingLeft: '8px',
        marginLeft: '-11px', // Offset for the border
        borderRadius: '2px',
        display: 'block'
      } : {};

      const renderValue = () => {
        if (value === null) return <span className="text-gray-500">null</span>;
        if (value === undefined) return <span className="text-gray-500">undefined</span>;
        
        if (typeof value === 'boolean') {
          return <span className="text-yellow-500">{value.toString()}</span>;
        }
        
        if (typeof value === 'number') {
          return <span className="text-blue-400">{value}</span>;
        }
        
        if (typeof value === 'string') {
          return <span className="text-green-500">"{value}"</span>;
        }
        
        if (Array.isArray(value)) {
          if (value.length === 0) return <span>[]</span>;
          
          return (
            <span>
              [
              <div style={{ paddingLeft: '20px' }}>
                {value.map((item, index) => (
                  <div key={index}>
                    {renderJsonNode(item, index.toString(), currentPath, index === value.length - 1)}
                  </div>
                ))}
              </div>
              ]
            </span>
          );
        }
        
        if (typeof value === 'object') {
          const keys = Object.keys(value);
          if (keys.length === 0) return <span>{'{}'}</span>;
          
          // Skip _applied_variants when rendering
          const filteredKeys = keys.filter(k => k !== '_applied_variants');
          
          return (
            <span>
              {'{'}
              <div style={{ paddingLeft: '20px' }}>
                {filteredKeys.map((objKey, index) => {
                  const isLastProp = index === filteredKeys.length - 1;
                  const objPath = currentPath ? `${currentPath}.${objKey}` : objKey;
                  const objVariantId = appliedVariants[objPath];
                  
                  const objLineStyle: React.CSSProperties = objVariantId ? {
                    backgroundColor: `${getVariantColor(objVariantId)}20`,
                    borderLeft: `3px solid ${getVariantColor(objVariantId)}`,
                    paddingLeft: '8px',
                    marginLeft: '-11px',
                    borderRadius: '2px',
                    display: 'block'
                  } : {};
                  
                  return (
                    <div key={objKey} style={objLineStyle}>
                      <span className="text-purple-400">"{objKey}"</span>: {renderJsonNode(value[objKey], objKey, currentPath, isLastProp)}
                      {!isLastProp && <span>,</span>}
                      {objVariantId && (
                        <span className="ml-2 text-xs font-mono px-1 py-0.5 rounded" style={{
                          backgroundColor: `${getVariantColor(objVariantId)}40`,
                          color: getVariantColor(objVariantId)
                        }}>
                          {objVariantId.substring(0, 6)}...
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
              {'}'}
            </span>
          );
        }
        
        return <span>{String(value)}</span>;
      };
      
      return (
        <span style={lineStyle}>
          {renderValue()}
          {!isLast && <span>,</span>}
          {variantId && key !== '' && (
            <span className="ml-2 text-xs font-mono px-1 py-0.5 rounded" style={{
              backgroundColor: `${getVariantColor(variantId)}40`,
              color: getVariantColor(variantId)
            }}>
              {variantId.substring(0, 6)}...
            </span>
          )}
        </span>
      );
    };
    
    return renderJsonNode(obj);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-xl">Response</CardTitle>
        <div className="flex items-center space-x-2">
          {data && !isLoading && !error && Object.keys(variantColors).length > 0 && (
            <div className="flex items-center space-x-1 text-sm">
              {Object.entries(variantColors).map(([variantId, color]) => (
                <div key={variantId} className="flex items-center">
                  <span 
                    className="inline-block w-3 h-3 rounded-full mr-1" 
                    style={{ backgroundColor: color }}
                  ></span>
                  <span className="text-xs mr-2">{variantId.substring(0, 6)}...</span>
                </div>
              ))}
            </div>
          )}
          {data && !isLoading && !error && (
            <Button variant="ghost" size="sm" onClick={handleCopyClick} className="h-8 px-2">
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0 flex-grow overflow-hidden">
        <div className="bg-api-bg-json rounded-md h-full overflow-hidden">
          <pre className="p-4 text-white font-mono text-sm h-full overflow-auto">
            {isLoading && <div className="text-gray-400">Loading...</div>}
            {error && <div className="text-red-400">{error}</div>}
            {!isLoading && !error && data && renderJson(data)}
            {!isLoading && !error && !data && (
              <div className="text-gray-400">No response data</div>
            )}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
};

export default JsonViewer;
