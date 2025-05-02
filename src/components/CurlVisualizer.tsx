
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";

interface CurlVisualizerProps {
  method: string;
  url: string;
  headers: Record<string, string>;
  body?: Record<string, any>;
}

const CurlVisualizer: React.FC<CurlVisualizerProps> = ({ method, url, headers, body }) => {
  const [copied, setCopied] = useState(false);

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
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
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
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleCopyClick} 
            className="h-8 px-2 transition-all duration-200 hover:bg-gray-200"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-1 text-green-500" />
                <span className="text-green-500 text-xs">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-1" />
                <span className="text-xs">Copy</span>
              </>
            )}
          </Button>
        </div>
        <pre className="p-4 bg-api-bg-curl text-white overflow-x-auto text-sm font-jetbrains-mono">
          <code>{generateCurl()}</code>
        </pre>
      </CardContent>
    </Card>
  );
};

export default CurlVisualizer;
