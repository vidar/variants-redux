
export interface ApiFormData {
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
}

export interface ApiFormProps {
  onSubmit: (data: ApiFormData, variantDetails: {id: string, name: string, groupName?: string}[]) => void;
  isLoading: boolean;
}

export interface VariantGroup {
  id: string;
  name: string;
  variants: Variant[];
}

export interface Variant {
  id: string;
  name: string;
}
