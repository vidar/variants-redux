
import React, { useState, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { regions, Region } from "@/utils/regions";

interface AuthenticationSectionProps {
  cdaHostname: string;
  setCdaHostname: (value: string) => void;
  cmaHostname: string;
  setCmaHostname: (value: string) => void;
  apiKey: string;
  setApiKey: (value: string) => void;
  managementToken: string;
  setManagementToken: (value: string) => void;
  deliveryToken: string;
  setDeliveryToken: (value: string) => void;
}

const AuthenticationSection: React.FC<AuthenticationSectionProps> = ({
  cdaHostname,
  setCdaHostname,
  cmaHostname,
  setCmaHostname,
  apiKey,
  setApiKey,
  managementToken,
  setManagementToken,
  deliveryToken,
  setDeliveryToken
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [showManagementToken, setShowManagementToken] = useState(false);
  const [showDeliveryToken, setShowDeliveryToken] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [customRegion, setCustomRegion] = useState(false);

  // Initialize the region dropdown based on current CDA/CMA values
  useEffect(() => {
    // If we don't have values yet, default to EU
    if (!cdaHostname && !cmaHostname) {
      const defaultRegion = regions.find(r => r.id === 'eu');
      if (defaultRegion) {
        setCdaHostname(defaultRegion.cda);
        setCmaHostname(defaultRegion.cma);
        setSelectedRegion('eu');
        setCustomRegion(false);
      }
      return;
    }
    
    // Check if current hostnames match any predefined region
    for (const region of regions) {
      if (region.cda === cdaHostname && region.cma === cmaHostname) {
        setSelectedRegion(region.id);
        setCustomRegion(false);
        return;
      }
    }
    
    // If no match, it's a custom region
    setCustomRegion(true);
    setSelectedRegion('custom');
  }, []);

  // Handle region change
  const handleRegionChange = (regionId: string) => {
    setSelectedRegion(regionId);
    
    if (regionId === 'custom') {
      setCustomRegion(true);
      return;
    }
    
    setCustomRegion(false);
    const region = regions.find(r => r.id === regionId);
    if (region) {
      setCdaHostname(region.cda);
      setCmaHostname(region.cma);
    }
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-4">
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="flex w-full justify-between p-0 hover:bg-transparent">
          <h3 className="font-medium">Authentication</h3>
          <span className="text-xs text-gray-500">{isOpen ? 'Hide' : 'Show'}</span>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-3">
        <div className="grid grid-cols-1 gap-3">
          <div>
            <Label htmlFor="region">Region</Label>
            <Select value={selectedRegion} onValueChange={handleRegionChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a region" />
              </SelectTrigger>
              <SelectContent>
                {regions.map((region) => (
                  <SelectItem key={region.id} value={region.id}>
                    {region.name}
                  </SelectItem>
                ))}
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {customRegion && (
            <>
              <div>
                <Label htmlFor="cdaHostname">CDA Hostname</Label>
                <Input
                  id="cdaHostname"
                  value={cdaHostname}
                  onChange={(e) => setCdaHostname(e.target.value)}
                  placeholder="eu-cdn.contentstack.com"
                />
              </div>
              <div>
                <Label htmlFor="cmaHostname">CMA Hostname</Label>
                <Input
                  id="cmaHostname"
                  value={cmaHostname}
                  onChange={(e) => setCmaHostname(e.target.value)}
                  placeholder="eu-api.contentstack.com"
                />
              </div>
            </>
          )}
          
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
            <div className="relative">
              <Input
                id="managementToken"
                value={managementToken}
                onChange={(e) => setManagementToken(e.target.value)}
                placeholder="Your Management Token"
                type={showManagementToken ? "text" : "password"}
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowManagementToken(!showManagementToken)}
              >
                {showManagementToken ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <div>
            <Label htmlFor="deliveryToken">Delivery Token</Label>
            <div className="relative">
              <Input
                id="deliveryToken"
                value={deliveryToken}
                onChange={(e) => setDeliveryToken(e.target.value)}
                placeholder="Your Delivery Token"
                type={showDeliveryToken ? "text" : "password"}
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowDeliveryToken(!showDeliveryToken)}
              >
                {showDeliveryToken ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default AuthenticationSection;
