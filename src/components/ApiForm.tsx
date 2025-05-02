
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
    handleVariantSelection
  } = useVariants(apiKey, managementToken, cmaHostname);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Construct the API URL following the specified pattern with the added include_applied_variants=true parameter
    const url = `https://${cdaHostname}/v3/content_types/${contentType}/entries/${entryUid}?include_all=true&include_all_depth=3&include_applied_variants=true`;
    
    // Prepare headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'api_key': apiKey,
    };
    
    // Add delivery token if available
    if (deliveryToken) {
      headers['access_token'] = deliveryToken;
    }
    
    // Add selected variants if any
    if (selectedVariants.length > 0) {
      headers['x-cs-variant-uid'] = selectedVariants.join(',');
    }
    
    onSubmit({
      method: 'GET',
      url,
      headers,
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
            handleVariantChange={handleVariantSelection}
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
