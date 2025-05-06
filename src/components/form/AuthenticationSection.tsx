
import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, RefreshCw } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDeliveryTokens, DeliveryToken } from '@/hooks/useDeliveryTokens';

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

  const {
    tokens,
    isLoading: tokensLoading,
    error: tokensError,
    fetchTokens
  } = useDeliveryTokens(apiKey, managementToken, cmaHostname);

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
            <div className="flex justify-between mb-2">
              <Label htmlFor="deliveryToken">Delivery Token</Label>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm"
                className="h-5 px-2 text-xs"
                onClick={fetchTokens}
                disabled={tokensLoading || !apiKey || !managementToken}
              >
                <RefreshCw size={12} className={`mr-1 ${tokensLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
            <div className="relative">
              <Select value={deliveryToken} onValueChange={setDeliveryToken}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a delivery token" />
                </SelectTrigger>
                <SelectContent>
                  {tokens.length === 0 && !tokensLoading && !tokensError && (
                    <div className="text-center py-2 text-sm text-gray-500">
                      No delivery tokens found
                    </div>
                  )}
                  {tokensError && (
                    <div className="text-center py-2 text-sm text-red-500">
                      Error: {tokensError}
                    </div>
                  )}
                  {tokensLoading && (
                    <div className="text-center py-2 text-sm text-gray-500">
                      Loading tokens...
                    </div>
                  )}
                  {tokens.map((token) => (
                    <SelectItem key={token.uid} value={token.uid}>
                      <div className="flex flex-col">
                        <span className="font-medium">{token.name}</span>
                        {token.description && (
                          <span className="text-xs text-gray-500">{token.description}</span>
                        )}
                        {token.scope?.environments.length > 0 && (
                          <span className="text-xs text-gray-500">
                            Environments: {token.scope.environments.join(', ')}
                          </span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default AuthenticationSection;
