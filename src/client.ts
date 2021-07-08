import {
  IntegrationProviderAPIError,
  IntegrationProviderAuthenticationError,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from './config';
import Hubspot from './hubspot';
import {
  Company,
  Contact,
  Domain,
  Owner,
  ResourceIteratee,
  Role,
  User,
} from './types';

/**
 * An APIClient maintains authentication state and provides an interface to
 * third party data APIs.
 *
 * It is recommended that integrations wrap provider data APIs to provide a
 * place to handle error responses and implement common patterns for iterating
 * resources.
 */
export class APIClient {
  readonly hubspot: Hubspot;
  constructor(readonly config: IntegrationConfig) {
    this.hubspot = new Hubspot(config);
  }

  public async verifyAuthentication(): Promise<void> {
    try {
      const tokens = await this.hubspot.get('/crm/v3/properties/contacts');
      if (!tokens) {
        throw new Error('Provider authentication failed');
      }
    } catch (err) {
      throw new IntegrationProviderAuthenticationError({
        cause: err,
        endpoint: `/crm/v3/properties/contacts`,
        status: err.status,
        statusText: err.statusText,
      });
    }
  }

  public async iterateOwners(iteratee: ResourceIteratee<Owner>) {
    try {
      await this.hubspot.iterate<Owner>('/crm/v3/owners', iteratee);
    } catch (err) {
      throw new IntegrationProviderAPIError({
        cause: err,
        endpoint: `/crm/v3/owners`,
        status: err.status,
        statusText: err.statusText,
      });
    }
  }

  public async iterateRoles(iteratee: ResourceIteratee<Role>) {
    try {
      await this.hubspot.iterate<Role>('/settings/v3/users/roles', iteratee);
    } catch (err) {
      throw new IntegrationProviderAPIError({
        cause: err,
        endpoint: `/settings/v3/users/roles`,
        status: err.status,
        statusText: err.statusText,
      });
    }
  }

  public async fetchUser(userId: string): Promise<User> {
    try {
      const user = await this.hubspot.get<User>(`/settings/v3/users/${userId}`);
      return user;
    } catch (err) {
      throw new IntegrationProviderAPIError({
        cause: err,
        endpoint: `/settings/v3/users/{userId}`,
        status: err.status,
        statusText: err.statusText,
      });
    }
  }

  public async iterateCompanies(iteratee: ResourceIteratee<Company>) {
    try {
      await this.hubspot.iterate<Company>(
        '/crm/v3/objects/companies',
        iteratee,
      );
    } catch (err) {
      throw new IntegrationProviderAPIError({
        cause: err,
        endpoint: `/crm/v3/objects/companies`,
        status: err.status,
        statusText: err.statusText,
      });
    }
  }

  public async iterateDomains(iteratee: ResourceIteratee<Domain>) {
    try {
      await this.hubspot.iterate<Domain>('/cms/v3/domains', iteratee);
    } catch (err) {
      throw new IntegrationProviderAPIError({
        cause: err,
        endpoint: '/cms/v3/domains',
        status: err.status,
        statusText: err.statusText,
      });
    }
  }

  public async iterateContacts(iteratee: ResourceIteratee<Contact>) {
    try {
      await this.hubspot.iterate<Contact>('/crm/v3/objects/contacts', iteratee);
    } catch (err) {
      throw new IntegrationProviderAPIError({
        cause: err,
        endpoint: `/crm/v3/objects/contacts`,
        status: err.status,
        statusText: err.statusText,
      });
    }
  }
}

export function createAPIClient(config: IntegrationConfig): APIClient {
  return new APIClient(config);
}
