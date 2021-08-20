import {
  ExecutionHistory,
  IntegrationProviderAPIError,
  IntegrationProviderAuthenticationError,
} from '@jupiterone/integration-sdk-core';
import * as hubspot from '@hubspot/api-client';
import { IntegrationConfig } from './config';
import { Company, ResourceIteratee, Role, User } from './types';

export class APIClient {
  private readonly executionHistory: ExecutionHistory;
  readonly hubspotClient: hubspot.Client;
  private readonly maxPerPage = 30;

  constructor(
    readonly integrationConfig: IntegrationConfig,
    executionHistory: ExecutionHistory,
  ) {
    this.executionHistory = executionHistory;
    this.hubspotClient = new hubspot.Client({
      accessToken: integrationConfig.oauthAccessToken,
    });
  }

  async apiRequestWithErrorHandling<T>(path: string, body?: any): Promise<T[]> {
    try {
      const response = await this.hubspotClient.apiRequest({
        method: 'GET',
        path,
        body,
      });

      return response.body.results;
    } catch (err) {
      throw new IntegrationProviderAPIError({
        cause: new Error(err.message),
        endpoint: path,
        status: err.statusCode,
        statusText: err.message,
      });
    }
  }

  public async verifyAuthentication(): Promise<void> {
    try {
      const tokens = await this.hubspotClient.crm.owners.defaultApi.getPage();
      if (!tokens.body) {
        throw new Error('Provider authentication failed');
      }
    } catch (err) {
      throw new IntegrationProviderAuthenticationError({
        cause: err,
        endpoint: '/crm/v3/owners',
        status: err.status,
        statusText: err.statusText,
      });
    }
  }

  public async iterateRoles(iteratee: ResourceIteratee<Role>) {
    const roles = await this.apiRequestWithErrorHandling<Role>(
      '/settings/v3/users/roles',
    );

    for (const role of roles || []) {
      await iteratee(role);
    }
  }

  public async iterateUsers(iteratee: ResourceIteratee<User>) {
    const users = await this.apiRequestWithErrorHandling<User>(
      '/settings/v3/users/',
    );

    for (const user of users || []) {
      await iteratee(user);
    }
  }

  public async iterateCompanies(iteratee: ResourceIteratee<Company>) {
    const companies = await this.apiRequestWithErrorHandling<Company>(
      '/companies/v2/companies/recent/modified',
      {
        since: this.executionHistory.lastSuccessful?.startedOn || 0,
        count: this.maxPerPage,
      },
    );

    for (const company of companies || []) {
      await iteratee(company);
    }
  }

  public async fetchUser(userId: string): Promise<User> {
    try {
      const res = await this.hubspotClient.apiRequest({
        method: 'GET',
        path: `/settings/v3/users/${userId}`,
      });

      return res.body;
    } catch (err) {
      throw new IntegrationProviderAPIError({
        cause: new Error(err.message),
        endpoint: `/settings/v3/users/${userId}`,
        status: err.statusCode,
        statusText: err.message,
      });
    }
  }

  public async iterateOwners(
    iteratee: ResourceIteratee<hubspot.ownersModels.PublicOwner>,
  ) {
    const res = await this.hubspotClient.crm.owners.defaultApi.getPage();
    for (const owner of res.body.results) {
      await iteratee(owner);
    }
  }
}

export function createAPIClient(
  config: IntegrationConfig,
  executionHistory: ExecutionHistory,
): APIClient {
  return new APIClient(config, executionHistory);
}
