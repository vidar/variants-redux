
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

const JsonViewer: React.FC<JsonViewerProps> = ({ data, isLoading, error }) => {
  const handleCopyClick = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
  };

  // Format JSON as a string with proper indentation
  const formattedJson = data ? JSON.stringify(data, null, 2) : "";
  
  // Find lines that should be highlighted due to applied variants
  const getHighlightedLines = () => {
    if (!data || !data.entry || !data.entry._applied_variants) return {};
    
    const lines = formattedJson.split('\n');
    const highlightedLines: Record<number, string> = {};
    const appliedVariants = data.entry._applied_variants;
    
    // Determine what line numbers contain fields that have applied variants
    let inEntryObject = false;
    let currentField = '';
    
    lines.forEach((line, index) => {
      // Track when we're inside the entry object
      if (line.includes('"entry": {')) {
        inEntryObject = true;
      } else if (inEntryObject && line.includes('}') && line.trim() === '}') {
        inEntryObject = false;
      }
      
      // Only look for fields within the entry object
      if (inEntryObject) {
        // Check if this line defines a field (has ": " but not within a value)
        const fieldMatch = line.match(/"([^"]+)":\s/);
        if (fieldMatch && fieldMatch[1]) {
          currentField = fieldMatch[1];
          
          // If this field has an applied variant, highlight it
          if (appliedVariants[currentField]) {
            const variantId = appliedVariants[currentField];
            highlightedLines[index] = variantId;
          }
        }
      }
    });
    
    return highlightedLines;
  };
  
  // Get highlight color for a variant ID
  const getVariantColor = (variantId: string) => {
    // Hash the variant ID to get a consistent color
    const hash = Array.from(variantId).reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    
    // Generate HSL color with fixed saturation and lightness
    const hue = Math.abs(hash) % 360;
    return `hsla(${hue}, 70%, 85%, 0.5)`;
  };

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
              {({ className, style, tokens, getLineProps, getTokenProps }) => {
                const highlightedLines = getHighlightedLines();
                
                return (
                  <pre className="p-4 font-mono text-sm h-full overflow-auto bg-sky-50" style={{ color: '#333' }}>
                    {tokens.map((line, i) => {
                      const lineNumber = i;
                      const variantId = highlightedLines[lineNumber];
                      const lineStyle = variantId ? { backgroundColor: getVariantColor(variantId) } : {};
                      
                      return (
                        <div 
                          key={i} 
                          {...getLineProps({ line })} 
                          className={`hover:bg-sky-100 ${variantId ? 'highlight-line' : ''}`}
                          style={lineStyle}
                        >
                          {line.map((token, key) => (
                            <span key={key} {...getTokenProps({ token })} />
                          ))}
                        </div>
                      );
                    })}
                  </pre>
                );
              }}
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
