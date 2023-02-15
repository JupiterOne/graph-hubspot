import { Client } from '@hubspot/api-client';

type Awaited<T> = T extends Promise<infer ReturnType> ? ReturnType : T;

export type OwnersResponse = Awaited<
  ReturnType<Client['crm']['owners']['ownersApi']['getPage']>
>;

export type Owner = OwnersResponse['results'][number];

export type ResourceIteratee<T> = (each: T) => Promise<void> | void;

export interface HubspotPaginatedResponse<T> {
  results: T[];
  paging?: {
    next?: {
      after: string;
      link: string;
    };
  };
}

export interface LegacyHubspotPaginatedResponse<T> {
  results: T[];
  offset: number;
  hasMore: boolean;
  total: number;
}

export interface HubspotHttpError extends Error {
  statusCode: number;
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

export type UsersResponse = Awaited<
  ReturnType<Client['settings']['users']['usersApi']['getPage']>
>;

export interface User {
  id: string;
  email: string;
  roleId?: string;
  primaryTeamId?: string;
}

export type RolesResponse = Awaited<
  ReturnType<Client['settings']['users']['rolesApi']['getAll']>
>;

export interface Role {
  id: string;
  name: string;
  requiresBillingWrite: boolean;
}
