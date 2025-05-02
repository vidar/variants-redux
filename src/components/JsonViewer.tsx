
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

// Function to get variant color similar to the one in CurlVisualizer
const getVariantColor = (variantId: string, variantMap: Map<string, number>): { background: string, border: string } => {
  const colors = [
    { background: "rgba(59, 130, 246, 0.15)", border: "rgba(59, 130, 246, 0.5)" }, // blue
    { background: "rgba(34, 197, 94, 0.15)", border: "rgba(34, 197, 94, 0.5)" },   // green
    { background: "rgba(168, 85, 247, 0.15)", border: "rgba(168, 85, 247, 0.5)" }, // purple
    { background: "rgba(245, 158, 11, 0.15)", border: "rgba(245, 158, 11, 0.5)" }, // amber
    { background: "rgba(236, 72, 153, 0.15)", border: "rgba(236, 72, 153, 0.5)" }, // pink
    { background: "rgba(20, 184, 166, 0.15)", border: "rgba(20, 184, 166, 0.5)" }  // teal
  ];
  
  // Get consistent index for this variant ID
  const index = variantMap.get(variantId) || 0;
  return colors[index % colors.length];
};

const JsonViewer: React.FC<JsonViewerProps> = ({ data, isLoading, error }) => {
  const handleCopyClick = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
  };

  // Format JSON as a string with proper indentation
  const formattedJson = data ? JSON.stringify(data, null, 2) : "";
  
  // Function to extract all variants from the JSON structure at any level
  const extractVariants = (obj: any, result: Map<string, number> = new Map(), path: string = '', depth: number = 0): Map<string, number> => {
    if (!obj || typeof obj !== 'object') return result;
    
    // If this object has _applied_variants, handle it
    if (obj._applied_variants && typeof obj._applied_variants === 'object') {
      Object.entries(obj._applied_variants).forEach(([field, variantId]) => {
        if (!result.has(variantId as string)) {
          // Assign a unique index to each unique variant ID
          result.set(variantId as string, result.size);
        }
      });
    }
    
    // Recursively process all nested objects
    Object.entries(obj).forEach(([key, value]) => {
      if (value && typeof value === 'object') {
        extractVariants(value, result, `${path}.${key}`, depth + 1);
      }
    });
    
    return result;
  };
  
  // Maps variant IDs to their positions in lines of formatted JSON
  const mapVariantsToLines = (jsonStr: string, obj: any): Map<number, { variantId: string, index: number }> => {
    if (!obj) return new Map();
    
    const lines = jsonStr.split('\n');
    const result = new Map<number, { variantId: string, index: number }>();
    
    // First, extract all variants and assign an index to each unique variant ID
    const variantMap = extractVariants(obj);
    
    // Function to annotate lines with variant information
    const processObject = (obj: any, path: string[] = []) => {
      if (!obj || typeof obj !== 'object') return;
      
      // If this object has _applied_variants, mark the relevant lines
      if (obj._applied_variants && typeof obj._applied_variants === 'object') {
        Object.entries(obj._applied_variants).forEach(([field, variantId]) => {
          // Find the line that contains this field
          const fieldPath = [...path, field];
          const fieldPattern = `"${field}"`;
          
          // Look for the pattern in all lines
          for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (line.includes(fieldPattern)) {
              // Check if this is the correct instance by looking at indentation and path context
              // This is a simplified check - in a real app, more sophisticated parsing might be needed
              if (isFieldAtCurrentPath(line, i, lines, fieldPath)) {
                result.set(i, { 
                  variantId: variantId as string,
                  index: variantMap.get(variantId as string) || 0
                });
              }
            }
          }
        });
      }
      
      // Recursively process all nested objects
      Object.entries(obj).forEach(([key, value]) => {
        if (value && typeof value === 'object') {
          processObject(value, [...path, key]);
        }
      });
    };
    
    processObject(obj);
    return result;
  };
  
  // Helper function to check if a line refers to the field at the current path
  const isFieldAtCurrentPath = (line: string, lineIndex: number, allLines: string[], fieldPath: string[]): boolean => {
    // This is a simplified way to check; it works in many cases but isn't foolproof
    // For a full JSON parser, you might need a more sophisticated approach
    
    // Check if the line has the correct indentation level
    const indentation = line.match(/^\s*/)?.[0].length || 0;
    
    // Get the last element of the path which is the actual field name
    const fieldName = fieldPath[fieldPath.length - 1];
    
    // The field should be at this line
    return line.trim().startsWith(`"${fieldName}":`);
  };
  
  // Generate the line highlighting data
  const lineHighlights = data ? mapVariantsToLines(formattedJson, data) : new Map();
  
  // Extract variant map for consistent coloring
  const variantMap = data ? extractVariants(data) : new Map();

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
                    const variantInfo = lineHighlights.get(i);
                    let lineStyle = {};
                    
                    if (variantInfo) {
                      const { variantId } = variantInfo;
                      // Get consistent color based on variant ID
                      const { background, border } = getVariantColor(variantId, variantMap);
                      lineStyle = { 
                        backgroundColor: background,
                        borderLeft: `3px solid ${border}`,
                        paddingLeft: '0.5rem'
                      };
                    }
                    
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
