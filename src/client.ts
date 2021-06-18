import {
  IntegrationProviderAPIError,
  IntegrationProviderAuthenticationError,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from './config';
import Hubspot from './hubspot';
import { Contact, Owner, ResourceIteratee } from './types';

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
