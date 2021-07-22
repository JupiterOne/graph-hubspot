import {
  ExecutionHistory,
  // IntegrationProviderAPIError,
  IntegrationProviderAuthenticationError,
} from '@jupiterone/integration-sdk-core';
import * as hubspot from '@hubspot/api-client';
// import { URL, URLSearchParams } from 'url';
// import fetch, { RequestInit } from 'node-fetch';
import { IntegrationConfig } from './config';
import {
  // Company,
  // Owner,
  ResourceIteratee,
  Role,
  User,
  // HubspotPaginatedResponse,
  // HubspotRequestConfig,
  // LegacyHubspotPaginatedResponse,
} from './types';

export class APIClient {
  // private readonly apiBaseUrl: string;
  // private readonly oauthAccessToken: string;
  // private readonly executionHistory: ExecutionHistory;
  // private readonly maxPerPage = 30;
  readonly hubspotClient: hubspot.Client;

  constructor(
    readonly integrationConfig: IntegrationConfig,
    executionHistory: ExecutionHistory,
  ) {
    // this.apiBaseUrl = integrationConfig.apiBaseUrl;
    // this.oauthAccessToken = integrationConfig.oauthAccessToken;
    // this.executionHistory = executionHistory;
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

  public async fetchUser(userId: string): Promise<User> {
    const res = await this.hubspotClient.apiRequest({
      method: 'GET',
      path: `/settings/v3/users/${userId}`,
    });
    return res.body;
  }
}

export function createAPIClient(
  config: IntegrationConfig,
  executionHistory: ExecutionHistory,
): APIClient {
  return new APIClient(config, executionHistory);
}
