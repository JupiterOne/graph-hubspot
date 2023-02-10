import * as dotenv from 'dotenv';
import * as path from 'path';
import { IntegrationConfig } from '../src/config';

if (process.env.LOAD_ENV) {
  dotenv.config({
    path: path.join(__dirname, '../.env'),
  });
}
const DEFAULT_OAUTH_ACCESS_TOKEN = 'dummy-access_token';
const DEFAULT_API_URL = 'https://api.hubapi.com';
const DEFAULT_APP_ID = '1401879';
const DEFAULT_OAUTH_AUTHORIZED_SCOPES = 'scope-1,scope-2';

export function createIntegrationConfig(): IntegrationConfig {
  return {
    oauthAccessToken:
      process.env.OAUTH_ACCESS_TOKEN || DEFAULT_OAUTH_ACCESS_TOKEN,
    apiBaseUrl: process.env.API_BASE_URL || DEFAULT_API_URL,
    appId: process.env.APP_ID || DEFAULT_APP_ID,
    oauthAuthorizedScopes:
      process.env.OAUTH_AUTHORIZED_SCOPES || DEFAULT_OAUTH_AUTHORIZED_SCOPES,
  };
}
