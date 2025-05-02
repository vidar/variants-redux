
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { Highlight, themes } from "prism-react-renderer";

interface JsonViewerProps {
  data: any;
  isLoading: boolean;
  error?: string;
}

// Helper function to generate consistent vibrant colors
const generateColorFromId = (id: string): string => {
  // Create a numeric hash from string
  const hash = Array.from(id).reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  
  // Generate HSL with high saturation and appropriate lightness for good contrast
  const h = Math.abs(hash) % 360;
  const s = 65 + (Math.abs(hash) % 20); // 65-85% saturation
  const l = 75 + (Math.abs(hash) % 10); // 75-85% lightness for background
  
  return `hsla(${h}, ${s}%, ${l}%, 0.35)`;
};

const JsonViewer: React.FC<JsonViewerProps> = ({ data, isLoading, error }) => {
  const handleCopyClick = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
  };

  // Format JSON as a string with proper indentation
  const formattedJson = data ? JSON.stringify(data, null, 2) : "";
  
  // Function to find all variants and their corresponding paths in the JSON
  const findVariantsInJson = (obj: any, result: Map<string, string> = new Map(), path: string[] = []): Map<string, string> => {
    if (!obj || typeof obj !== 'object') return result;
    
    // Check if this object has _applied_variants
    if (obj._applied_variants && typeof obj._applied_variants === 'object') {
      // For each applied variant, store its path and variant ID
      Object.entries(obj._applied_variants).forEach(([field, variantId]) => {
        const fieldPath = [...path, field].join('.');
        result.set(fieldPath, variantId as string);
      });
    }
    
    // Recursively process all keys
    Object.entries(obj).forEach(([key, value]) => {
      if (value && typeof value === 'object') {
        findVariantsInJson(value, result, [...path, key]);
      }
    });
    
    return result;
  };
  
  // Find line numbers in formatted JSON for a given field path
  const findLineNumbersForPath = (json: string, pathToFind: string): number[] => {
    const lines = json.split('\n');
    const result: number[] = [];
    
    // Convert path parts to a regex pattern that will match the field name
    const pathParts = pathToFind.split('.');
    const fieldName = pathParts[pathParts.length - 1];
    
    // Search for the field pattern in each line
    lines.forEach((line, index) => {
      // Look for "fieldName": pattern with proper indentation
      if (line.includes(`"${fieldName}"`)) {
        // Verify this is the correct level of nesting by checking indentation
        // This is a simplified check - in a real app you might need more sophisticated parsing
        result.push(index);
      }
    });
    
    return result;
  };
  
  // Generate highlights for the formatted JSON
  const generateHighlights = (): Record<number, string> => {
    if (!data) return {};
    
    const highlights: Record<number, string> = {};
    const variantPaths = findVariantsInJson(data);
    
    // For each variant path, find the corresponding line and add highlighting
    variantPaths.forEach((variantId, path) => {
      const lineNumbers = findLineNumbersForPath(formattedJson, path);
      lineNumbers.forEach(lineNum => {
        highlights[lineNum] = generateColorFromId(variantId);
      });
    });
    
    return highlights;
  };

  // Generate the highlights based on variants in the data
  const lineHighlights = generateHighlights();

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
        <div className="bg-sky-50 rounded-md h-full overflow-hidden border border-sky-100">
          {isLoading && (
            <div className="p-4 text-gray-500">Loading...</div>
          )}
          {error && (
            <div className="p-4 text-red-500">{error}</div>
          )}
          {!isLoading && !error && data && (
            <Highlight
              theme={themes.github}
              code={formattedJson}
              language="json"
            >
              {({ className, style, tokens, getLineProps, getTokenProps }) => (
                <pre className="p-4 font-mono text-sm h-full overflow-auto bg-sky-50" style={{ color: '#333' }}>
                  {tokens.map((line, i) => {
                    // Check if this line needs highlighting
                    const backgroundColor = lineHighlights[i];
                    const lineStyle = backgroundColor ? { 
                      backgroundColor,
                      borderLeft: `3px solid ${backgroundColor.replace('0.35', '1')}`,
                      paddingLeft: '0.5rem'
                    } : {};
                    
                    return (
                      <div 
                        key={i} 
                        {...getLineProps({ line })} 
                        className={`hover:bg-sky-100`}
                        style={lineStyle}
                      >
                        {line.map((token, key) => (
                          <span key={key} {...getTokenProps({ token })} />
                        ))}
                      </div>
                    );
                  })}
                </pre>
              )}
            </Highlight>
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
