
import React, { useState, useEffect } from 'react';
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
import { Separator } from "@/components/ui/separator";

interface ApiFormProps {
  onSubmit: (data: {
    method: string;
    url: string;
    headers: Record<string, string>;
    body?: Record<string, any>;
    // Auth fields
    cdaHostname: string;
    cmaHostname: string;
    apiKey: string;
    managementToken: string;
    deliveryToken: string;
    // Content fields
    contentType: string;
    entryUid: string;
    locale: string;
  }) => void;
  isLoading: boolean;
}

const ApiForm: React.FC<ApiFormProps> = ({ onSubmit, isLoading }) => {
  // Method and URL
  const [method, setMethod] = useState(() => localStorage.getItem('api_method') || 'GET');
  const [url, setUrl] = useState(() => localStorage.getItem('api_url') || 'https://api.example.com/users');
  
  // Auth fields
  const [cdaHostname, setCdaHostname] = useState(() => localStorage.getItem('cda_hostname') || 'eu-cdn.contentstack.com');
  const [cmaHostname, setCmaHostname] = useState(() => localStorage.getItem('cma_hostname') || 'eu-api.contentstack.com');
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('api_key') || '');
  const [managementToken, setManagementToken] = useState(() => localStorage.getItem('management_token') || '');
  const [deliveryToken, setDeliveryToken] = useState(() => localStorage.getItem('delivery_token') || '');
  
  // Content fields
  const [contentType, setContentType] = useState(() => localStorage.getItem('content_type') || '');
  const [entryUid, setEntryUid] = useState(() => localStorage.getItem('entry_uid') || '');
  const [locale, setLocale] = useState(() => localStorage.getItem('locale') || 'en-us');

  // Headers and body
  const [headers, setHeaders] = useState<{ key: string; value: string }[]>(() => {
    const savedHeaders = localStorage.getItem('api_headers');
    return savedHeaders ? JSON.parse(savedHeaders) : [
      { key: 'Content-Type', value: 'application/json' },
      { key: 'Authorization', value: 'Bearer YOUR_TOKEN_HERE' }
    ];
  });
  
  const [bodyText, setBodyText] = useState(() => {
    return localStorage.getItem('api_body') || JSON.stringify({ name: "John Doe", email: "john@example.com" }, null, 2);
  });

  // Save form values to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('api_method', method);
    localStorage.setItem('api_url', url);
    localStorage.setItem('api_headers', JSON.stringify(headers));
    if (bodyText) localStorage.setItem('api_body', bodyText);
    
    // Auth fields
    localStorage.setItem('cda_hostname', cdaHostname);
    localStorage.setItem('cma_hostname', cmaHostname);
    localStorage.setItem('api_key', apiKey);
    localStorage.setItem('management_token', managementToken);
    localStorage.setItem('delivery_token', deliveryToken);
    
    // Content fields
    localStorage.setItem('content_type', contentType);
    localStorage.setItem('entry_uid', entryUid);
    localStorage.setItem('locale', locale);
  }, [
    method, 
    url, 
    headers, 
    bodyText, 
    cdaHostname, 
    cmaHostname, 
    apiKey, 
    managementToken, 
    deliveryToken,
    contentType,
    entryUid,
    locale
  ]);

  const handleAddHeader = () => {
    const newHeaders = [...headers, { key: '', value: '' }];
    setHeaders(newHeaders);
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
      body,
      // Auth fields
      cdaHostname,
      cmaHostname,
      apiKey,
      managementToken,
      deliveryToken,
      // Content fields
      contentType,
      entryUid,
      locale
    });
  };

  return (
    <Card className="h-full overflow-auto">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">Request Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Authentication Section */}
          <div className="space-y-4">
            <h3 className="font-medium">Authentication</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <Label htmlFor="cdaHostname">CDA</Label>
                  <Input
                    id="cdaHostname"
                    value={cdaHostname}
                    onChange={(e) => setCdaHostname(e.target.value)}
                    placeholder="eu-cdn.contentstack.com"
                  />
                </div>
                <div>
                  <Label htmlFor="cmaHostname">CMA</Label>
                  <Input
                    id="cmaHostname"
                    value={cmaHostname}
                    onChange={(e) => setCmaHostname(e.target.value)}
                    placeholder="eu-api.contentstack.com"
                  />
                </div>
                <div>
                  <Label htmlFor="apiKey">API Key</Label>
                  <Input
                    id="apiKey"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Your API Key"
                  />
                </div>
                <div>
                  <Label htmlFor="managementToken">Management Token</Label>
                  <Input
                    id="managementToken"
                    value={managementToken}
                    onChange={(e) => setManagementToken(e.target.value)}
                    placeholder="Your Management Token"
                    type="password"
                  />
                </div>
                <div>
                  <Label htmlFor="deliveryToken">Delivery Token</Label>
                  <Input
                    id="deliveryToken"
                    value={deliveryToken}
                    onChange={(e) => setDeliveryToken(e.target.value)}
                    placeholder="Your Delivery Token"
                    type="password"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Content Section */}
          <div className="space-y-4">
            <h3 className="font-medium">Content</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <Label htmlFor="contentType">Content Type</Label>
                  <Input
                    id="contentType"
                    value={contentType}
                    onChange={(e) => setContentType(e.target.value)}
                    placeholder="e.g., blog_post"
                  />
                </div>
                <div>
                  <Label htmlFor="entryUid">Entry UID</Label>
                  <Input
                    id="entryUid"
                    value={entryUid}
                    onChange={(e) => setEntryUid(e.target.value)}
                    placeholder="e.g., blt1234567890abcdef"
                  />
                </div>
                <div>
                  <Label htmlFor="locale">Locale</Label>
                  <Input
                    id="locale"
                    value={locale}
                    onChange={(e) => setLocale(e.target.value)}
                    placeholder="en-us"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Request Details Section */}
          <div className="space-y-4">
            <h3 className="font-medium">Request Details</h3>
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
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'Sending...' : 'Send Request'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ApiForm;
