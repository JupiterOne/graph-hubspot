import { IntegrationProviderAuthenticationError } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from './config';
import Hubspot from './hubspot';
import { Owner } from './types';

export type ResourceIteratee<T> = (each: T) => Promise<void> | void;

// Providers often supply types with their API libraries.

type AcmeUser = {
  id: string;
  name: string;
};

type AcmeGroup = {
  id: string;
  name: string;
  users?: Pick<AcmeUser, 'id'>[];
};

// Those can be useful to a degree, but often they're just full of optional
// values. Understanding the response data may be more reliably accomplished by
// reviewing the API response recordings produced by testing the wrapper client
// (below). However, when there are no types provided, it is necessary to define
// opaque types for each resource, to communicate the records that are expected
// to come from an endpoint and are provided to iterating functions.

/*
import { Opaque } from 'type-fest';
export type AcmeUser = Opaque<any, 'AcmeUser'>;
export type AcmeGroup = Opaque<any, 'AcmeGroup'>;
*/

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
      const owners = await this.hubspot.get('/crm/v3/owners');
      if (!Array.isArray(owners)) {
        throw new Error('Provider authentication failed');
      }
    } catch (err) {
      throw new IntegrationProviderAuthenticationError({
        cause: err,
        endpoint: `${this.config.apiBaseUrl}/crm/v3/properties/contact`,
        status: err.status,
        statusText: err.statusText,
      });
    }
  }

  public async iterateOwners(iteratee: ResourceIteratee<Owner>) {
    const owners = await this.hubspot.get('/crm/v3/owners');
    for (const owner of owners) {
      await iteratee(owner);
    }
  }

  /**
   * Iterates each group resource in the provider.
   *
   * @param iteratee receives each resource to produce entities/relationships
   */
  public async iterateGroups(
    iteratee: ResourceIteratee<AcmeGroup>,
  ): Promise<void> {
    // TODO paginate an endpoint, invoke the iteratee with each record in the
    // page
    //
    // The provider API will hopefully support pagination. Functions like this
    // should maintain pagination state, and for each page, for each record in
    // the page, invoke the `ResourceIteratee`. This will encourage a pattern
    // where each resource is processed and dropped from memory.

    const groups: AcmeGroup[] = [
      {
        id: 'acme-group-1',
        name: 'Group One',
        users: [
          {
            id: 'acme-user-1',
          },
        ],
      },
    ];

    for (const group of groups) {
      await iteratee(group);
    }
  }
}

export function createAPIClient(config: IntegrationConfig): APIClient {
  return new APIClient(config);
}
