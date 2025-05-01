
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface ApiFormProps {
  onSubmit: (data: {
    method: string;
    url: string;
    headers: Record<string, string>;
    body?: Record<string, any>;
  }) => void;
  isLoading: boolean;
}

const ApiForm: React.FC<ApiFormProps> = ({ onSubmit, isLoading }) => {
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('https://api.example.com/users');
  const [headers, setHeaders] = useState<{ key: string; value: string }[]>([
    { key: 'Content-Type', value: 'application/json' },
    { key: 'Authorization', value: 'Bearer YOUR_TOKEN_HERE' }
  ]);
  const [bodyText, setBodyText] = useState(JSON.stringify({ name: "John Doe", email: "john@example.com" }, null, 2));

  const handleAddHeader = () => {
    setHeaders([...headers, { key: '', value: '' }]);
  };

  const handleHeaderChange = (index: number, field: 'key' | 'value', value: string) => {
    const newHeaders = [...headers];
    newHeaders[index][field] = value;
    setHeaders(newHeaders);
  };

  const handleRemoveHeader = (index: number) => {
    const newHeaders = [...headers];
    newHeaders.splice(index, 1);
    setHeaders(newHeaders);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convert headers array to object
    const headersObject: Record<string, string> = {};
    headers.forEach(({ key, value }) => {
      if (key) headersObject[key] = value;
    });

    let body;
    try {
      body = method !== 'GET' ? JSON.parse(bodyText) : undefined;
    } catch (error) {
      console.error('Invalid JSON in body:', error);
      body = bodyText;
    }

    onSubmit({
      method,
      url,
      headers: headersObject,
      body
    });
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">Request Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-1">
              <Label htmlFor="method">Method</Label>
              <Select value={method} onValueChange={setMethod}>
                <SelectTrigger id="method">
                  <SelectValue placeholder="Method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                  <SelectItem value="DELETE">DELETE</SelectItem>
                  <SelectItem value="PATCH">PATCH</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-3">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://api.example.com/endpoint"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Headers</Label>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={handleAddHeader}
              >
                Add Header
              </Button>
            </div>
            {headers.map((header, index) => (
              <div key={index} className="grid grid-cols-[1fr,1fr,auto] gap-2">
                <Input
                  value={header.key}
                  onChange={(e) => handleHeaderChange(index, 'key', e.target.value)}
                  placeholder="Header name"
                />
                <Input
                  value={header.value}
                  onChange={(e) => handleHeaderChange(index, 'value', e.target.value)}
                  placeholder="Header value"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveHeader(index)}
                  className="px-3"
                >
                  ×
                </Button>
              </div>
            ))}
          </div>

          {method !== 'GET' && (
            <div className="space-y-2">
              <Label htmlFor="body">Request Body</Label>
              <Textarea
                id="body"
                value={bodyText}
                onChange={(e) => setBodyText(e.target.value)}
                placeholder="{ }"
                className="font-mono h-[200px]"
              />
            </div>
          )}

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'Sending...' : 'Send Request'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ApiForm;
