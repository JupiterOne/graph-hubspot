import {
  ExecutionHistory,
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

  public async verifyAuthentication(): Promise<void> {
    try {
      const tokens = await this.hubspotClient.crm.owners.defaultApi.getPage();
      if (!tokens.body) {
        throw new Error('Provider authentication failed');
      }
    } catch (err) {
      throw new IntegrationProviderAuthenticationError({
        cause: err,
        endpoint: `/crm/v3/owners`,
        status: err.status,
        statusText: err.statusText,
      });
    }
  }

  public async iterateRoles(iteratee: ResourceIteratee<Role>) {
    await this.hubspotClient
      .apiRequest({
        method: 'GET',
        path: '/settings/v3/users/roles',
      })
      .then((res) => {
        res.body.results.forEach(async (role) => {
          await iteratee(role as Role);
        });
      });
  }

  public async fetchUser(
    userId: string,
    callback: (user: User) => Promise<void>,
  ) {
    await this.hubspotClient
      .apiRequest({
        method: 'GET',
        path: `/settings/v3/users/${userId}`,
      })
      .then(async (res) => {
        await callback(res.body);
      });
  }

  public async iterateCompanies(iteratee: ResourceIteratee<Company>) {
    await this.hubspotClient
      .apiRequest({
        method: 'GET',
        path: `/companies/v2/companies/recent/modified`,
        body: {
          since: this.executionHistory.lastSuccessful?.startedOn || 0,
          count: this.maxPerPage,
        },
      })
      .then((res) => {
        res.body.results.forEach(async (company) => {
          await iteratee(company);
        });
      });
  }
}

export function createAPIClient(
  config: IntegrationConfig,
  executionHistory: ExecutionHistory,
): APIClient {
  return new APIClient(config, executionHistory);
}
