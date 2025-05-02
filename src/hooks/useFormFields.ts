
import { useState, useEffect } from 'react';
import { getLocalStorageItem, setLocalStorageItem } from '@/utils/localStorage';

export const useFormFields = () => {
  // Auth fields
  const [cdaHostname, setCdaHostname] = useState(() => getLocalStorageItem('cda_hostname', 'eu-cdn.contentstack.com'));
  const [cmaHostname, setCmaHostname] = useState(() => getLocalStorageItem('cma_hostname', 'eu-api.contentstack.com'));
  const [apiKey, setApiKey] = useState(() => getLocalStorageItem('api_key'));
  const [managementToken, setManagementToken] = useState(() => getLocalStorageItem('management_token'));
  const [deliveryToken, setDeliveryToken] = useState(() => getLocalStorageItem('delivery_token'));
  
  // Content fields
  const [contentType, setContentType] = useState(() => getLocalStorageItem('content_type'));
  const [entryUid, setEntryUid] = useState(() => getLocalStorageItem('entry_uid'));
  const [locale, setLocale] = useState(() => getLocalStorageItem('locale', 'en-us'));

  // Save form values to localStorage whenever they change
  useEffect(() => {
    // Auth fields
    setLocalStorageItem('cda_hostname', cdaHostname);
    setLocalStorageItem('cma_hostname', cmaHostname);
    setLocalStorageItem('api_key', apiKey);
    setLocalStorageItem('management_token', managementToken);
    setLocalStorageItem('delivery_token', deliveryToken);
    
    // Content fields
    setLocalStorageItem('content_type', contentType);
    setLocalStorageItem('entry_uid', entryUid);
    setLocalStorageItem('locale', locale);
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

  return {
    // Auth fields
    cdaHostname,
    setCdaHostname,
    cmaHostname,
    setCmaHostname,
    apiKey,
    setApiKey,
    managementToken,
    setManagementToken,
    deliveryToken,
    setDeliveryToken,
    
    // Content fields
    contentType,
    setContentType,
    entryUid,
    setEntryUid,
    locale,
    setLocale
  };
};
