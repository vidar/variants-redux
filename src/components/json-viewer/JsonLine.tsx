
import React from 'react';
import { getVariantColor } from '@/utils/variantUtils';
import { Flag } from 'lucide-react';
import { getCountryFlagForLocale } from './utils/flagUtils';

interface JsonLineProps {
  line: any[];
  lineIndex: number;
  variantId?: string;
  variantName?: string;
  getLineProps: any;
  getTokenProps: any;
}

// Helper function to determine if a line contains a locale key and its value
const getLocaleFromLine = (line: any[]): string | null => {
  // Extract the line content as a string
  const lineContent = line.map(token => token.content).join('');
  
  // Check if this line contains "locale" key with a value
  const localeMatch = lineContent.match(/"locale"\s*:\s*"([^"]+)"/);
  if (localeMatch && localeMatch[1]) {
    return localeMatch[1];
  }
  
  return null;
};

const JsonLine: React.FC<JsonLineProps> = ({ 
  line, 
  lineIndex, 
  variantId, 
  variantName, 
  getLineProps, 
  getTokenProps 
}) => {
  // Styling for variant highlighting
  let lineStyle = {};
  
  if (variantId) {
    // Get consistent color based on variant ID
    const { background, border } = getVariantColor(variantId);
    lineStyle = { 
      backgroundColor: background,
      borderLeft: `3px solid ${border}`,
      paddingLeft: '0.5rem',
      position: 'relative'
    };
  }

  // Check if this line contains a locale key
  const localeValue = getLocaleFromLine(line);
  // Get appropriate flag image for the locale
  const flagImage = localeValue ? getCountryFlagForLocale(localeValue) : null;
  
  return (
    <div 
      key={lineIndex} 
      {...getLineProps({ line })} 
      className={`hover:bg-sky-100 relative`}
      style={lineStyle}
    >
      <span className="line-content">
        {line.map((token, key) => (
          <span key={key} {...getTokenProps({ token })} />
        ))}
      </span>
      
      {variantId && variantName && (
        <span 
          className="text-xs font-normal text-gray-500 ml-2 inline-block"
          style={{ 
            position: 'absolute',
            right: '10px',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            padding: '0 4px',
            borderRadius: '3px'
          }}
        >
          {variantName}
        </span>
      )}

      {localeValue && (
        <span 
          className="text-xs font-normal text-gray-500 ml-2 inline-block"
          style={{ 
            position: 'absolute',
            right: variantId && variantName ? '100px' : '10px',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            padding: '0 4px',
            borderRadius: '3px',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          {flagImage ? (
            <img 
              src={flagImage} 
              alt={`${localeValue} flag`} 
              className="inline mr-1" 
              style={{ width: '16px', height: '12px' }}
            />
          ) : (
            <Flag size={14} className="inline mr-1" />
          )}
          {localeValue}
        </span>
      )}
    </div>
  );
};

export default JsonLine;
