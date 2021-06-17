import fetch, { RequestInit } from 'node-fetch';
import qs from 'qs';
import { ResourceIteratee } from '../types';

export default class Hubspot {
  constructor(
    private readonly apiBaseUrl: string,
    private readonly apiKey: string,
  ) {}

  get(resource: string, config?: HubspotRequestConfig) {
    return this.query(resource);
  }

  async iterate<T>(
    resource: string,
    onEach: ResourceIteratee<T>,
    config?: HubspotRequestConfig,
  ): Promise<void> {
    const pagination: any = {};
    let data: HubspotPaginatedResponse | null = null;
    do {
      const res = await fetch(
        `${this.apiBaseUrl}${resource}?` +
          qs.stringify({
            hapikey: this.apiKey,
            ...config?.params,
            ...pagination,
          }),
      );
      data = await res.json();
      pagination.after = data?.paging?.next?.after;
      for (const it of data?.results || []) {
        await onEach(it);
      }
    } while (data?.results && data?.paging?.next?.after);
  }

  private async query(resource: string, params?: any, init?: RequestInit) {
    const pagination: any = {};
    const exec = () =>
      fetch(
        `${this.apiBaseUrl}${resource}?` +
          qs.stringify({
            hapikey: this.apiKey,
            ...params,
            ...pagination,
          }),
        init,
      );
    let data: any = null;
    let results: any[] | undefined = undefined;
    do {
      const res = await exec();
      data = await res.json();
      pagination.after = data?.paging?.next?.after;
      if (data?.results) {
        if (!results) {
          results = [];
        }
        results.push(...data?.results);
      }
    } while (data?.results && data?.paging?.next?.after);
    if (data.status === 'error' && data.category === 'INVALID_AUTHENTICATION') {
      throw new Error('Invalid authentication');
    }
    return results || data;
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
