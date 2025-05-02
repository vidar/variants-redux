
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
  
  // Demo response data with proper typing
  const [responseData, setResponseData] = useState<ResponseData>({
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

  const handleSubmit = (data: typeof requestConfig) => {
    setRequestConfig(data);
    setIsLoading(true);
    setError(undefined);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      // Generate a different response based on the method
      if (data.method === 'POST') {
        setResponseData({
          data: {
            id: 4,
            ...data.body,
            created_at: new Date().toISOString()
          },
          message: "User created successfully"
        });
      } else if (data.method === 'PUT' || data.method === 'PATCH') {
        setResponseData({
          data: {
            id: data.url.split('/').pop(),
            ...data.body,
            updated_at: new Date().toISOString()
          },
          message: "User updated successfully"
        });
      } else if (data.method === 'DELETE') {
        setResponseData({
          message: "User deleted successfully"
        });
      } else {
        // For GET requests, keep the demo data
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
      }
    }, 1500);
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
