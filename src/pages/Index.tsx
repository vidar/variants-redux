
import React, { useState } from 'react';
import CurlVisualizer from '@/components/CurlVisualizer';
import ApiForm from '@/components/ApiForm';
import JsonViewer from '@/components/JsonViewer';

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
}

const Index = () => {
  const [requestConfig, setRequestConfig] = useState({
    method: 'GET',
    url: 'https://api.example.com/users',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_TOKEN_HERE'
    },
    body: undefined,
    cdaHostname: 'eu-cdn.contentstack.com',
    cmaHostname: 'eu-api.contentstack.com',
    apiKey: '',
    managementToken: '',
    deliveryToken: '',
    contentType: '',
    entryUid: '',
    locale: 'en-us'
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [responseData, setResponseData] = useState<ResponseData>({});

  const handleSubmit = (data: typeof requestConfig) => {
    setRequestConfig(data);
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
          setResponseData(data);
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
        
        // For GET requests with missing fields, show demo data
        setResponseData({
          data: [
            {
              id: 1,
              name: "John Doe",
              email: "john@example.com",
              role: "admin",
              created_at: "2023-05-01T10:30:00Z"
            },
            {
              id: 2,
              name: "Jane Smith",
              email: "jane@example.com",
              role: "editor",
              created_at: "2023-06-15T14:22:00Z"
            },
            {
              id: 3,
              name: "Mike Johnson",
              email: "mike@example.com",
              role: "viewer",
              created_at: "2023-07-20T09:15:00Z"
            }
          ],
          meta: {
            total: 3,
            page: 1,
            per_page: 10,
            total_pages: 1
          }
        });
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
