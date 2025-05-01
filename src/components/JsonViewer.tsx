
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

  const formatJson = (obj: any): string => {
    try {
      return JSON.stringify(obj, null, 2);
    } catch (err) {
      return 'Error formatting JSON';
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-xl">Response</CardTitle>
        {data && !isLoading && !error && (
          <Button variant="ghost" size="sm" onClick={handleCopyClick} className="h-8 px-2">
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </Button>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        <div className="bg-api-bg-json rounded-md overflow-hidden">
          <pre className="p-4 text-white font-mono text-sm h-[400px] overflow-auto">
            {isLoading && <div className="text-gray-400">Loading...</div>}
            {error && <div className="text-red-400">{error}</div>}
            {!isLoading && !error && data && (
              <code>{formatJson(data)}</code>
            )}
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
