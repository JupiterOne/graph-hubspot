import {
  ExecutionHistory,
  IntegrationProviderAPIError,
  IntegrationProviderAuthenticationError,
} from '@jupiterone/integration-sdk-core';
import * as hubspot from '@hubspot/api-client';
import {
  PublicOwner,
  CollectionResponsePublicOwnerForwardPaging,
} from '@hubspot/api-client/lib/codegen/crm/owners';
import {
  CollectionResponsePublicUserForwardPaging,
  CollectionResponsePublicPermissionSetNoPaging,
} from '@hubspot/api-client/lib/codegen/settings/users';
import { IntegrationConfig } from './config';
import {
  Company,
  ResourceIteratee,
  Role,
  User,
  HubspotPaginatedResponse,
  LegacyHubspotPaginatedResponse,
  HubspotHttpError,
} from './types';
import { legacyPaginated, paginated } from './utils';

export class APIClient {
  private readonly executionHistory: ExecutionHistory;
  readonly hubspotClient: hubspot.Client;
  private readonly maxPerPage: number;

  constructor(
    readonly integrationConfig: IntegrationConfig,
    executionHistory: ExecutionHistory,
    maxPerPage: number = 30,
  ) {
    this.executionHistory = executionHistory;
    this.hubspotClient = new hubspot.Client({
      accessToken: integrationConfig.oauthAccessToken,
    });
    this.maxPerPage = maxPerPage;
  }

  async getPageWithErrorHandling<T>(
    path: string,
    qs?: Record<string, unknown>,
  ): Promise<HubspotPaginatedResponse<T> | LegacyHubspotPaginatedResponse<T>> {
    try {
      const response = await this.hubspotClient.apiRequest({
        method: 'GET',
        path,
        qs,
      });

      const body = (await response.json()) as Record<string, any>;
      return {
        results: body.results as T[],
        ...(body.paging && {
          paging: body.paging as HubspotPaginatedResponse<T>['paging'],
        }),
        ...(body.total && {
          total: body.total as LegacyHubspotPaginatedResponse<T>['total'],
        }),
        ...(body.offset && {
          offset: body.offset as LegacyHubspotPaginatedResponse<T>['offset'],
        }),
        ...(body.hasMore && {
          hasMore: body.hasMore as LegacyHubspotPaginatedResponse<T>['hasMore'],
        }),
      };
    } catch (err) {
      throw buildApiError(err, path);
    }
  }

  public async verifyAuthentication(): Promise<void> {
    try {
      await this.hubspotClient.crm.owners.ownersApi.getPage();
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
    let response: CollectionResponsePublicPermissionSetNoPaging;
    try {
      response = await this.hubspotClient.settings.users.rolesApi.getAll();
    } catch (err) {
      throw buildApiError(err, '/settings/v3/users/roles');
    }

    const { results: roles } = response;
    for (const role of roles || []) {
      const { id, name, requiresBillingWrite } = role;
      await iteratee({
        id,
        name,
        requiresBillingWrite,
      });
    }
  }

  public async iterateUsers(iteratee: ResourceIteratee<User>) {
    await paginated(async (after) => {
      let response: CollectionResponsePublicUserForwardPaging;
      try {
        response = await this.hubspotClient.settings.users.usersApi.getPage(
          this.maxPerPage,
          after,
        );
      } catch (err) {
        throw buildApiError(err, '/settings/v3/users/');
      }

      const { results: users, paging } = response;
      for (const user of users || []) {
        const { id, email, roleId, primaryTeamId } = user;
        await iteratee({
          id,
          email,
          ...(roleId && { roleId }),
          ...(primaryTeamId && { primaryTeamId }),
        });
      }
      return paging?.next?.after;
    });
  }

  public async iterateCompanies(iteratee: ResourceIteratee<Company>) {
    await legacyPaginated(async (offset) => {
      const { results: companies, ...pagerProperties } =
        await this.getPageWithErrorHandling<Company>(
          '/companies/v2/companies/recent/modified',
          {
            since: this.executionHistory.lastSuccessful?.startedOn || 0,
            count: this.maxPerPage,
            offset,
          },
        );

      for (const company of companies || []) {
        await iteratee(company);
      }

      return 'offset' in pagerProperties
        ? {
            offset: pagerProperties.offset,
            hasMore: pagerProperties.hasMore || false,
          }
        : { offset: 0, hasMore: false };
    });
  }

  public async fetchUser(userId: string): Promise<User> {
    try {
      const user = await this.hubspotClient.settings.users.usersApi.getById(
        userId,
      );
      return user;
    } catch (err) {
      throw buildApiError(err, `/settings/v3/users/${userId}`);
    }
  }

  public async iterateOwners(iteratee: ResourceIteratee<PublicOwner>) {
    await paginated(async (after) => {
      let response: CollectionResponsePublicOwnerForwardPaging;
      try {
        response = await this.hubspotClient.crm.owners.ownersApi.getPage(
          undefined,
          after,
          this.maxPerPage,
        );
      } catch (err) {
        throw buildApiError(err, '/crm/v3/owners/');
      }

      const { results: owners, paging } = response;
      for (const owner of owners) {
        await iteratee(owner);
      }
      return paging?.next?.after;
    });
  }
}

function buildApiError(err: HubspotHttpError, endpoint: string) {
  return new IntegrationProviderAPIError({
    cause: new Error(err.message),
    endpoint,
    status: err.statusCode,
    statusText: err.message,
  });
}

export function createAPIClient(
  config: IntegrationConfig,
  executionHistory: ExecutionHistory,
): APIClient {
  return new APIClient(config, executionHistory);
}
