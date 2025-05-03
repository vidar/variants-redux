
import React from 'react';
import { getVariantColor } from '@/utils/variantUtils';

interface JsonLineProps {
  line: any[];
  lineIndex: number;
  variantId?: string;
  variantName?: string;
  getLineProps: any;
  getTokenProps: any;
}

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
    </div>
  );
};

export default JsonLine;
