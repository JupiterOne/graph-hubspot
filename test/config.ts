import * as dotenv from 'dotenv';
import * as path from 'path';
import { IntegrationConfig } from '../src/config';

if (process.env.LOAD_ENV) {
  dotenv.config({
    path: path.join(__dirname, '../.env'),
  });
}
const DEFAULT_API_KEY = 'dummy-api-key';
const DEFAULT_API_URL = 'https://api.hubapi.com';

export const integrationConfig: IntegrationConfig = {
  apiKey: process.env.API_KEY || DEFAULT_API_KEY,
  apiBaseUrl: process.env.API_BASE_URL || DEFAULT_API_URL,
};

console.log('env', integrationConfig);
