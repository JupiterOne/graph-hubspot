import fetch, { RequestInit } from 'node-fetch';
import qs from 'qs';
import { ResourceIteratee } from '../types';

export default class Hubspot {
  constructor(
    private readonly apiBaseUrl: string,
    private readonly apiKey: string,
  ) {}

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
    const res = await fetch(
      `${this.apiBaseUrl}${resource}?` +
        qs.stringify({
          hapikey: this.apiKey,
          ...config?.params,
        }),
      init,
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
