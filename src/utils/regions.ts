
export interface Region {
  id: string;
  name: string;
  cda: string;
  cma: string;
}

export const regions: Region[] = [
  {
    id: 'na',
    name: 'North America',
    cda: 'cdn.contentstack.io',
    cma: 'api.contentstack.io'
  },
  {
    id: 'eu',
    name: 'Europe',
    cda: 'eu-cdn.contentstack.com',
    cma: 'eu-api.contentstack.com'
  },
  {
    id: 'azure-na',
    name: 'Azure North America',
    cda: 'azure-na-cdn.contentstack.com',
    cma: 'azure-na-api.contentstack.com'
  },
  {
    id: 'azure-eu',
    name: 'Azure Europe',
    cda: 'azure-eu-cdn.contentstack.com',
    cma: 'azure-eu-api.contentstack.com'
  },
  {
    id: 'gcp-na',
    name: 'GCP North America',
    cda: 'gcp-na-cdn.contentstack.com',
    cma: 'gcp-na-api.contentstack.com'
  },
  {
    id: 'gcp-eu',
    name: 'GCP Europe',
    cda: 'gcp-eu-cdn.contentstack.com',
    cma: 'gcp-eu-api.contentstack.com'
  }
];

export const getRegionById = (id: string): Region | undefined => {
  return regions.find(region => region.id === id);
};

export const getRegionByHostname = (hostname: string): Region | undefined => {
  // Try to match CDA hostname
  const cdaRegion = regions.find(region => region.cda === hostname);
  if (cdaRegion) return cdaRegion;
  
  // Try to match CMA hostname
  const cmaRegion = regions.find(region => region.cma === hostname);
  if (cmaRegion) return cmaRegion;
  
  return undefined;
};
