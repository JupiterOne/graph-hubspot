import FormData from 'form-data';
import fetch, { Headers, RequestInit } from 'node-fetch';
import qs from 'qs';
import { IntegrationConfig } from '../config';
import { ResourceIteratee } from '../types';
export default class Hubspot {
  private readonly appId: string;
  private readonly apiBaseUrl: string;
  private readonly oauthClientId: string;
  private readonly oauthClientSecret: string;
  private readonly oauthCode: string;
  private readonly oauthRedirectUri: string;

  private accessToken: string;
  private refreshToken: string;
  private tokenExpiryTimestamp: number;

  constructor({
    appId,
    apiBaseUrl,
    oauthClientId,
    oauthClientSecret,
    oauthCode,
    oauthRedirectUri,
  }: IntegrationConfig) {
    Object.assign(this, {
      appId,
      apiBaseUrl,
      oauthClientId,
      oauthClientSecret,
      oauthCode,
      oauthRedirectUri,
    });
  }

  async authenticate() {
    const body = new FormData();
    body.append('grant_type', 'authorization_code');
    body.append('client_id', this.oauthClientId);
    body.append('client_secret', this.oauthClientSecret);
    body.append('redirect_uri', this.oauthRedirectUri);
    body.append('code', this.oauthCode);

    const payload = {
      grant_type: 'authorization_code',
      client_id: this.oauthClientId,
      client_secret: this.oauthClientSecret,
      redirect_uri: this.oauthRedirectUri,
      code: this.oauthCode,
    };
    const res = await fetch(
      `${this.apiBaseUrl}/oauth/v1/token?` + qs.stringify(payload),
      {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/x-www-form-urlencoded',
        }),
      },
    );
    const data = await res.json();
    this.accessToken = data.access_token;
    this.refreshToken = data.refresh_token;
    this.tokenExpiryTimestamp = Date.now() + 1000 * data.expires_in;
    return this.accessToken && this.refreshToken;
  }

  get<T>(resource: string, config?: HubspotRequestConfig): Promise<T> {
    return this.query<T>(resource);
  }

  async iterate<T>(
    resource: string,
    onEach: ResourceIteratee<T>,
    config?: HubspotRequestConfig,
  ): Promise<void> {
    const pagination: any = {};
    let data: HubspotPaginatedResponse | null = null;
    do {
      data = await this.query<HubspotPaginatedResponse>(resource, {
        ...config,
        ...pagination,
      });
      pagination.after = data?.paging?.next?.after;
      for (const it of data?.results || []) {
        await onEach(it);
      }
    } while (data?.results && data?.paging?.next?.after);
  }

  private async query<T>(
    resource: string,
    config?: HubspotRequestConfig,
    init?: RequestInit,
  ): Promise<T> {
    console.log(`Bearer ${this.accessToken}`);
    const res = await fetch(
      `${this.apiBaseUrl}${resource}?` +
        qs.stringify({
          ...config?.params,
        }),
      {
        ...init,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.accessToken}`,
        },
      },
    );
    const data = await res.json();
    if (data.status === 'error' && data.category === 'INVALID_AUTHENTICATION') {
      throw new Error('Invalid authentication');
    }
    return data as T;
  }
}

export interface HubspotRequestConfig {
  /**
   * Url Query params
   */
  params?: any;

  /**
   * Pagination start index
   */
  after?: string;
}

export interface HubspotPaginatedResponse {
  results: any[];
  paging: Paging;
}

export interface Paging {
  next: Next;
}

export interface Next {
  after: string;
  link: string;
}

export interface Team {
  id: string;
  name: string;
}
