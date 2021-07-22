export type ResourceIteratee<T> = (each: T) => Promise<void> | void;

export interface HubspotRequestConfig {
  /**
   * Url Query params
   */
  params?: any;

  /**
   * Pagination start index
   */
  pagination?: any;
}

export interface HubspotPaginatedResponse {
  results: any[];
  paging: Paging;
}

export interface LegacyHubspotPaginatedResponse {
  results: any[];
  offset: number;
  hasMore: boolean;
  total: number;
}

export interface Paging {
  next: Next;
}

export interface Next {
  after: string;
  link: string;
}

export interface Owner {
  firstName?: string;
  lastName?: string;
  createdAt: string;
  archived: boolean;
  teams?: Team[];
  id: string;
  userId?: number;
  email?: string;
  updatedAt: string;
}

export interface Team {
  id: string;
  name: string;
}

export interface Company {
  id: string;
  properties: CompanyProperties;
  archived: boolean;
}
export interface CompanyProperties {
  name?: string;
  website?: string;
  domain?: string;
  city?: string;
  industry?: string;
  hubspot_owner_id?: string;
  is_public?: string;
  createdate?: string;
  hs_lastmodifieddate?: string;
  [key: string]: any;
}

export interface User {
  id: string;
  email: string;
  roleId: string;
}

export interface Role {
  id: string;
  name: string;
  requiresBillingWrite: boolean;
}
