import {
  IntegrationExecutionContext,
  IntegrationInstanceConfig,
  IntegrationInstanceConfigFieldMap,
  IntegrationValidationError,
} from '@jupiterone/integration-sdk-core';
import { createAPIClient } from './client';

export const instanceConfigFields: IntegrationInstanceConfigFieldMap = {
  oauthAccessToken: {
    type: 'string',
    mask: true,
  },
  apiBaseUrl: {
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
   * This access_token is considered valid as a Bearer Authorization header
   */
  oauthAccessToken: string;

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

  const apiClient = createAPIClient(config, context.executionHistory);
  await apiClient.verifyAuthentication();
}
