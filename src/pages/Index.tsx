import React, { useState } from 'react';
import CurlVisualizer from '@/components/CurlVisualizer';
import ApiForm from '@/components/ApiForm';
import JsonViewer from '@/components/JsonViewer';
import { ApiFormData } from '@/types/api';
import { enhanceResponseWithVariantNames } from '@/utils/variantUtils';

// Define the response data type
interface ResponseData {
  data?: any;
  meta?: {
    total: number;
    page: number;
    per_page: number;
    total_pages: number;
  };
  message?: string;
  entry?: {
    _applied_variants?: Record<string, string>;
    [key: string]: any;
  };
}

const Index = () => {
  const [requestConfig, setRequestConfig] = useState<ApiFormData>({
    method: 'GET',
    url: '',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': ''
    },
    body: undefined,
    cdaHostname: 'eu-cdn.contentstack.com',
    cmaHostname: 'eu-api.contentstack.com',
    apiKey: '',
    managementToken: '',
    deliveryToken: '',
    contentType: '',
    entryUid: '',
    locale: 'en-us',
    includeAll: true
  });
  
  const [selectedVariantDetails, setSelectedVariantDetails] = useState<{id: string, name: string, groupName?: string}[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [responseData, setResponseData] = useState<ResponseData>({});

  const handleSubmit = (data: ApiFormData, variantDetails: {id: string, name: string, groupName?: string}[]) => {
    setRequestConfig(data);
    setSelectedVariantDetails(variantDetails);
    setIsLoading(true);
    setError(undefined);

    // Make actual API call if we have the required fields
    if (data.apiKey && data.contentType && data.entryUid && data.cdaHostname) {
      fetch(data.url, {
        method: data.method,
        headers: data.headers
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          // Apply variant names to the response data using the utility function
          const enhancedData = enhanceResponseWithVariantNames(data, variantDetails);
          setResponseData(enhancedData);
          setIsLoading(false);
        })
        .catch(error => {
          setError(error.message);
          setIsLoading(false);
          // Fallback to demo data on error
          setResponseData({
            message: `Error: ${error.message}`
          });
        });
    } else {
      // Use demo data if essential fields are missing
      setTimeout(() => {
        setIsLoading(false);
        
        // Demo data with _applied_variants to test highlighting
        const demoData = {
          entry: {
            title: "Premium Car Offer",
            description: "Great deals on luxury vehicles",
            car_type: "Sedan",
            price: 50000,
            buyer_type: "VIP",
            features: ["Leather seats", "Navigation system", "Sunroof"],
            details: {
              engine: "V8",
              color: "Midnight Blue",
              year: 2023
            },
            _applied_variants: {
              "title": "cs2bac219659e6b8f4", 
              "car_type": "cs457086abd04bcb0a",
              "buyer_type": "cs2358ede856c404d8"
            }
          },
          meta: {
            total: 1,
            page: 1,
            per_page: 10,
            total_pages: 1
          }
        };
        
        // Enhance the demo data with variant names using the utility function
        const enhancedDemoData = enhanceResponseWithVariantNames(demoData, variantDetails);
        setResponseData(enhancedDemoData);
      }, 1500);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">API Explorer</h1>
          <p className="text-gray-600 mt-2">Learn and test your API integration</p>
        </header>

        <CurlVisualizer
          method={requestConfig.method}
          url={requestConfig.url}
          headers={requestConfig.headers}
          body={requestConfig.body}
          selectedVariants={selectedVariantDetails}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <ApiForm
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
          </div>
          <div className="lg:col-span-2">
            <JsonViewer
              data={responseData}
              isLoading={isLoading}
              error={error}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
