
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";

interface CurlVisualizerProps {
  method: string;
  url: string;
  headers: Record<string, string>;
  body?: Record<string, any>;
}

const CurlVisualizer: React.FC<CurlVisualizerProps> = ({ method, url, headers, body }) => {
  const generateCurl = () => {
    let curl = `curl --location --request ${method} '${url}'`;
    
    Object.entries(headers).forEach(([key, value]) => {
      curl += ` \\\n  --header '${key}: ${value}'`;
    });
    
    if (body && Object.keys(body).length > 0) {
      curl += ` \\\n  --data-raw '${JSON.stringify(body, null, 2)}'`;
    }
    
    return curl;
  };

  const handleCopyClick = () => {
    navigator.clipboard.writeText(generateCurl());
  };

  const getMethodColor = () => {
    const methodLower = method.toLowerCase();
    switch (methodLower) {
      case 'get': return 'bg-api-method-get';
      case 'post': return 'bg-api-method-post';
      case 'put': return 'bg-api-method-put';
      case 'delete': return 'bg-api-method-delete';
      case 'patch': return 'bg-api-method-patch';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card className="mb-6 border-2">
      <CardContent className="p-0">
        <div className="flex items-center justify-between bg-gray-100 p-3 border-b">
          <div className="flex items-center gap-2">
            <Badge className={`${getMethodColor()} text-white uppercase`}>
              {method}
            </Badge>
            <span className="text-sm font-medium">{url}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleCopyClick} className="h-8 w-8 p-0">
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        <pre className="p-4 bg-api-bg-curl text-white overflow-x-auto text-sm">
          <code>{generateCurl()}</code>
        </pre>
      </CardContent>
    </Card>
  );
};

export default CurlVisualizer;
