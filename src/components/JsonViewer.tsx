
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

  const formatJsonWithVariantHighlighting = (obj: any): JSX.Element => {
    if (!obj) return <></>;
    
    // Extract applied variants mapping if available
    let appliedVariants: Record<string, any> = {};
    if (obj.entry && obj.entry._applied_variants) {
      appliedVariants = obj.entry._applied_variants;
      console.log("Found applied variants:", appliedVariants);
    }
    
    const formatValue = (value: any, key: string = '', parentPath: string = ''): JSX.Element => {
      const path = parentPath ? `${parentPath}.${key}` : key;
      
      // Check if this exact path has an applied variant
      let variantId: string | undefined;
      let style: React.CSSProperties = {};
      
      if (appliedVariants && path && appliedVariants[path]) {
        variantId = appliedVariants[path];
        console.log(`Applying style for path: ${path}, variant: ${variantId}`);
        style = { 
          color: getVariantColor(variantId),
          fontWeight: 'bold'
        };
      }
      
      if (value === null) {
        return <span style={style}>null</span>;
      } else if (typeof value === 'undefined') {
        return <span style={style}>undefined</span>;
      } else if (typeof value === 'boolean') {
        return <span style={style}>{value.toString()}</span>;
      } else if (typeof value === 'number') {
        return <span style={style}>{value}</span>;
      } else if (typeof value === 'string') {
        return <span style={style}>"{value}"</span>;
      } else if (Array.isArray(value)) {
        return (
          <span>
            [
            <div style={{ paddingLeft: '20px' }}>
              {value.map((item, index) => (
                <div key={index}>
                  {formatValue(item, index.toString(), path)}
                  {index < value.length - 1 && ','}
                </div>
              ))}
            </div>
            ]
          </span>
        );
      } else if (typeof value === 'object') {
        return (
          <span>
            {'{'}
            <div style={{ paddingLeft: '20px' }}>
              {Object.keys(value).map((objKey, index) => {
                const keyPath = path ? `${path}.${objKey}` : objKey;
                
                // Check if this exact key path has a variant
                const keyStyle = appliedVariants[keyPath] ? {
                  color: getVariantColor(appliedVariants[keyPath]),
                  fontWeight: 'bold'
                } : {};
                
                return (
                  <div key={objKey}>
                    <span style={keyStyle}>"{objKey}"</span>: {formatValue(value[objKey], objKey, path)}
                    {index < Object.keys(value).length - 1 && ','}
                  </div>
                );
              })}
            </div>
            {'}'}
          </span>
        );
      }
      
      return <span style={style}>{String(value)}</span>;
    };

    return formatValue(obj);
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
            {!isLoading && !error && data && formatJsonWithVariantHighlighting(data)}
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
