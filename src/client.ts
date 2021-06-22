import {
  IntegrationProviderAPIError,
  IntegrationProviderAuthenticationError,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from './config';
import Hubspot from './hubspot';
import { Company, Domain, Owner, ResourceIteratee } from './types';

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
    this.hubspot = new Hubspot(config.apiBaseUrl, config.apiKey);
  }

  public async verifyAuthentication(): Promise<void> {
    try {
      let atLeastOne = false;
      await this.hubspot.iterate<Owner>('/crm/v3/owners', (it) => {
        atLeastOne = !!it;
      });
      if (!atLeastOne) {
        throw new Error('Provider authentication failed');
      }
    } catch (err) {
      throw new IntegrationProviderAuthenticationError({
        cause: err,
        endpoint: `/crm/v3/properties/contact`,
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
}

export function createAPIClient(config: IntegrationConfig): APIClient {
  return new APIClient(config);
}
