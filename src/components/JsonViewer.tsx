
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import JsonHighlighter from './json-viewer/JsonHighlighter';
import { Switch } from './ui/switch';
import { 
  getDisplayData, 
  extractVariantInfo, 
  mapVariantsToLines, 
  VariantInfo 
} from './json-viewer/utils/jsonUtils';

interface JsonViewerProps {
  data: any;
  isLoading: boolean;
  error?: string;
}

const JsonViewer: React.FC<JsonViewerProps> = ({ data, isLoading, error }) => {
  const [hidePublishDetails, setHidePublishDetails] = useState(false);

  const handleCopyClick = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
  };

  // Format JSON as a string with proper indentation (but without _variant_names)
  const formattedJson = data ? JSON.stringify(getDisplayData(data, hidePublishDetails), null, 2) : "";
  
  // Map to store variant IDs to their names for display
  const variantInfoMap = extractVariantInfo(data);
  
  // Generate the line highlighting data
  const lineHighlights = data ? mapVariantsToLines(formattedJson, data) : new Map();

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-xl">Response</CardTitle>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Hide publish details</span>
            <Switch 
              checked={hidePublishDetails} 
              onCheckedChange={setHidePublishDetails}
            />
          </div>
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
            <JsonHighlighter 
              formattedJson={formattedJson}
              lineHighlights={lineHighlights}
              variantInfoMap={variantInfoMap}
            />
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
