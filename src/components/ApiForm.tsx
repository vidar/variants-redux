
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ApiFormProps } from "@/types/api";
import { useFormFields } from "@/hooks/useFormFields";
import { useVariants } from "@/hooks/useVariants";
import AuthenticationSection from "./form/AuthenticationSection";
import ContentSection from "./form/ContentSection";
import VariantsSection from "./form/VariantsSection";

const ApiForm: React.FC<ApiFormProps> = ({ onSubmit, isLoading }) => {
  const {
    cdaHostname, setCdaHostname,
    cmaHostname, setCmaHostname,
    apiKey, setApiKey,
    managementToken, setManagementToken,
    deliveryToken, setDeliveryToken,
    contentType, setContentType,
    entryUid, setEntryUid,
    locale, setLocale
  } = useFormFields();
  
  const {
    variantGroups,
    selectedVariants,
    fetchingVariants,
    fetchVariantGroups,
    handleVariantChange
  } = useVariants(apiKey, managementToken, cmaHostname);

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
          <AuthenticationSection 
            cdaHostname={cdaHostname}
            setCdaHostname={setCdaHostname}
            cmaHostname={cmaHostname}
            setCmaHostname={setCmaHostname}
            apiKey={apiKey}
            setApiKey={setApiKey}
            managementToken={managementToken}
            setManagementToken={setManagementToken}
            deliveryToken={deliveryToken}
            setDeliveryToken={setDeliveryToken}
          />
          
          <Separator />
          
          {/* Content Section */}
          <ContentSection
            contentType={contentType}
            setContentType={setContentType}
            entryUid={entryUid}
            setEntryUid={setEntryUid}
            locale={locale}
            setLocale={setLocale}
          />
          
          <Separator />
          
          {/* Variants Section */}
          <VariantsSection 
            variantGroups={variantGroups}
            selectedVariants={selectedVariants}
            handleVariantChange={handleVariantChange}
            fetchVariantGroups={fetchVariantGroups}
            fetchingVariants={fetchingVariants}
            apiKey={apiKey}
            managementToken={managementToken}
          />

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'Sending...' : 'Send Request'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ApiForm;
