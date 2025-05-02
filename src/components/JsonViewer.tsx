
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
        <div className="bg-api-bg-json rounded-md h-full overflow-hidden">
          <pre className="p-4 text-white font-mono text-sm h-full overflow-auto">
            {isLoading && <div className="text-gray-400">Loading...</div>}
            {error && <div className="text-red-400">{error}</div>}
            {!isLoading && !error && data && JSON.stringify(data, null, 2)}
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
