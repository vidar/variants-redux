
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

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
  return (
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
  );
};

export default AuthenticationSection;
