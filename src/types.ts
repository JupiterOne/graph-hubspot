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
  companyId: number;
  portalId: number;
  properties: CompanyProperties;
  isDeleted: boolean;
}
export interface CompanyProperties {
  name?: {
    value: string;
  };
  website?: {
    value: string;
  };
  domain?: {
    value: string;
  };
  city?: {
    value: string;
  };
  industry?: {
    value: string;
  };
  hubspot_owner_id?: {
    value: string;
  };
  is_public?: {
    value: string;
  };
  createdate?: {
    value: string;
  };
  hs_lastmodifieddate?: {
    value: string;
  };
  [key: string]: any;
}

export interface User {
  id: string;
  email: string;
  roleId: string;
  primaryTeamId: string;
}

export interface Role {
  id: string;
  name: string;
  requiresBillingWrite: boolean;
}
