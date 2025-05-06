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
  includeAll: boolean;
}

export interface ApiFormProps {
  onSubmit: (data: ApiFormData, selectedVariants: {id: string, name: string, groupName?: string}[]) => void;
  isLoading: boolean;
  onVariantSelectionUpdate?: (details: {id: string, name: string, groupName?: string}[]) => void;
}

export interface VariantGroup {
  id: string;
  name: string;
  variants: Variant[];
}

export interface Variant {
  id: string;
  name: string;
  groupName?: string;
}
