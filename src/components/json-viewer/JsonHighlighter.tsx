
import React from 'react';
import { Highlight, themes } from "prism-react-renderer";
import JsonLine from './JsonLine';

interface JsonHighlighterProps {
  formattedJson: string;
  lineHighlights: Map<number, string>;
  variantInfoMap: Map<string, VariantInfo>;
}

interface VariantInfo {
  id: string;
  name?: string;
}

const JsonHighlighter: React.FC<JsonHighlighterProps> = ({ 
  formattedJson, 
  lineHighlights, 
  variantInfoMap 
}) => {
  return (
    <Highlight
      theme={themes.github}
      code={formattedJson}
      language="json"
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre className="p-4 font-mono text-sm h-full overflow-auto bg-sky-50" style={{ color: '#333' }}>
          {tokens.map((line, i) => {
            // Check if this line needs highlighting
            const variantId = lineHighlights.get(i);
            let variantName = null;
            
            if (variantId) {
              // Get variant name if available
              variantName = variantInfoMap.get(variantId)?.name || variantId.substring(0, 10);
            }
            
            return (
              <JsonLine
                key={i}
                line={line}
                lineIndex={i}
                variantId={variantId}
                variantName={variantName}
                getLineProps={getLineProps}
                getTokenProps={getTokenProps}
              />
            );
          })}
        </pre>
      )}
    </Highlight>
  );
};

export default JsonHighlighter;
