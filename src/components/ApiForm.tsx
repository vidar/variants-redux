
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

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

interface VariantGroup {
  id: string;
  name: string;
  variants: Variant[];
}

interface Variant {
  id: string;
  name: string;
}

const ApiForm: React.FC<ApiFormProps> = ({ onSubmit, isLoading }) => {
  const { toast } = useToast();
  
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
  
  // Variant fields
  const [variantGroups, setVariantGroups] = useState<VariantGroup[]>([]);
  const [selectedVariants, setSelectedVariants] = useState<string[]>([]);
  const [fetchingVariants, setFetchingVariants] = useState(false);
  
  // Save form values to localStorage whenever they change
  useEffect(() => {
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
    cdaHostname, 
    cmaHostname, 
    apiKey, 
    managementToken, 
    deliveryToken,
    contentType,
    entryUid,
    locale
  ]);
  
  // Effect to fetch variant groups when api key and management token are available
  useEffect(() => {
    if (apiKey && managementToken && cmaHostname) {
      fetchVariantGroups();
    }
  }, [apiKey, managementToken, cmaHostname]);
  
  const fetchVariantGroups = async () => {
    if (!apiKey || !managementToken || !cmaHostname) {
      toast({
        title: "Missing credentials",
        description: "API Key and Management Token are required to fetch variant groups.",
        variant: "destructive",
      });
      return;
    }
    
    setFetchingVariants(true);
    
    try {
      const url = `https://${cmaHostname}/v3/variant_groups?include_variant_info=true`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'api_key': apiKey,
          'authorization': managementToken
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch variant groups: ${response.status}`);
      }
      
      const data = await response.json();
      setVariantGroups(data.variant_groups || []);
    } catch (error) {
      console.error('Error fetching variant groups:', error);
      toast({
        title: "Error",
        description: `Failed to fetch variant groups: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setFetchingVariants(false);
    }
  };
  
  const handleVariantChange = (variantId: string, checked: boolean) => {
    if (checked) {
      if (selectedVariants.length >= 3) {
        toast({
          title: "Selection limit reached",
          description: "You can select up to 3 variants only.",
          variant: "destructive",
        });
        return;
      }
      setSelectedVariants([...selectedVariants, variantId]);
    } else {
      setSelectedVariants(selectedVariants.filter(id => id !== variantId));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSubmit({
      method: 'GET', // Default method
      url: 'https://api.example.com/users', // Default URL
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_TOKEN_HERE'
      },
      body: undefined,
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
          
          {/* Variants Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Variants</h3>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={fetchVariantGroups}
                disabled={fetchingVariants || !apiKey || !managementToken}
              >
                {fetchingVariants ? 'Fetching...' : 'Refresh'}
              </Button>
            </div>
            
            {variantGroups.length === 0 && !fetchingVariants && (
              <div className="text-sm text-gray-500">
                {apiKey && managementToken 
                  ? 'No variant groups found. Click refresh to try again.'
                  : 'Enter API Key and Management Token to fetch variants.'}
              </div>
            )}
            
            {fetchingVariants && (
              <div className="text-sm text-gray-500">
                Fetching variant groups...
              </div>
            )}
            
            {variantGroups.length > 0 && (
              <div className="space-y-4">
                <div className="text-sm text-gray-500">
                  Select up to 3 variants
                </div>
                {variantGroups.map((group) => (
                  <div key={group.id} className="space-y-2">
                    <h4 className="text-sm font-medium">{group.name}</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {group.variants.map((variant) => (
                        <div key={variant.id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`variant-${variant.id}`}
                            checked={selectedVariants.includes(variant.id)}
                            onCheckedChange={(checked) => 
                              handleVariantChange(variant.id, checked === true)
                            }
                          />
                          <Label 
                            htmlFor={`variant-${variant.id}`}
                            className="text-sm cursor-pointer"
                          >
                            {variant.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
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
