import {
  IntegrationExecutionContext,
  IntegrationInstanceConfig,
  IntegrationInstanceConfigFieldMap,
  IntegrationValidationError,
} from '@jupiterone/integration-sdk-core';
import { createAPIClient } from './client';

/**
 * A type describing the configuration fields required to execute the
 * integration for a specific account in the data provider.
 *
 * When executing the integration in a development environment, these values may
 * be provided in a `.env` file with environment variables. For example:
 *
 * - `CLIENT_ID=123` becomes `instance.config.clientId = '123'`
 * - `CLIENT_SECRET=abc` becomes `instance.config.clientSecret = 'abc'`
 *
 * Environment variables are NOT used when the integration is executing in a
 * managed environment. For example, in JupiterOne, users configure
 * `instance.config` in a UI.
 */
export const instanceConfigFields: IntegrationInstanceConfigFieldMap = {
  appId: {
    type: 'string',
    mask: true,
  },
  oauthClientId: {
    type: 'string',
    mask: true,
  },
  oauthClientSecret: {
    type: 'string',
    mask: true,
  },
  oauthCode: {
    type: 'string',
    mask: true,
  },
  apiBaseUrl: {
    type: 'string',
    mask: true,
  },
  oauthRedirectUri: {
    type: 'string',
    mask: true,
  },
};

/**
 * Properties provided by the `IntegrationInstance.config`. This reflects the
 * same properties defined by `instanceConfigFields`.
 */
export interface IntegrationConfig extends IntegrationInstanceConfig {
  /**
   * This is your app's unique ID. You'll need it to make certain API calls.
   */
  appId: string;

  /**
   * This ID is unique to your app and is used for initiating OAuth.
   */
  oauthClientId: string;

  /**
   * Used to establish and refresh OAuth authentication.
   */
  oauthClientSecret: string;

  /**
   * Used to authorize the app to access the user account
   */
  oauthCode: string;

  oauthRedirectUri: string;

  /**
   * Hubspot API base url
   */
  apiBaseUrl: string;
}

export async function validateInvocation(
  context: IntegrationExecutionContext<IntegrationConfig>,
) {
  const { config } = context.instance;

  if (!Object.keys(instanceConfigFields).every((key) => config[key])) {
    throw new IntegrationValidationError(
      `Config requires all of {${Object.keys(instanceConfigFields).join(
        ', ',
      )}}`,
    );
  }

  const apiClient = createAPIClient(config);
  await apiClient.verifyAuthentication();
}
