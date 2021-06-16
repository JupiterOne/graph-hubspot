import fetch, { RequestInit } from 'node-fetch';
import qs from 'qs';

export default class Hubspot {
  constructor(
    private readonly apiBaseUrl: string,
    private readonly hapikey: string,
  ) {}

  get(resource: string, config?: HubspotRequestConfig) {
    return this.query(resource);
  }

  private query(resource: string, params?: any, init?: RequestInit) {
    return fetch(
      `${this.apiBaseUrl}${resource}?` +
        qs.stringify({
          hapikey: this.hapikey,
          ...params,
        }),
      init,
    );
  }
}

export interface HubspotRequestConfig {
  /**
   * Url Query params
   */
  param?: any;
}
