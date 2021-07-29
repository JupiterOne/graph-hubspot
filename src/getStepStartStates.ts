import {
  IntegrationExecutionContext,
  StepStartStates,
} from '@jupiterone/integration-sdk-core';
import { parseHubspotScopes, isSuperset } from './utils';
import { IntegrationConfig } from './config';
import {
  COMPANY_SCOPES,
  OWNER_SCOPES,
  ROLE_SCOPES,
  USER_SCOPES,
} from './scopes';
import { accountSteps } from './steps/account';
import { companySteps } from './steps/companies';
import { ownerSteps } from './steps/owners';
import { roleSteps } from './steps/roles';

export default function (
  executionContext: IntegrationExecutionContext<IntegrationConfig>,
): StepStartStates {
  const scopes = new Set(
    parseHubspotScopes(executionContext.instance.config.oauthAuthorizedScopes),
  );

  return {
    [accountSteps[0].id]: { disabled: false },
    [companySteps[0].id]: {
      disabled: !isSuperset(scopes, COMPANY_SCOPES),
    },
    [ownerSteps[0].id]: { disabled: !isSuperset(scopes, OWNER_SCOPES) },
    [ownerSteps[1].id]: { disabled: !isSuperset(scopes, USER_SCOPES) },
    [roleSteps[0].id]: { disabled: !isSuperset(scopes, ROLE_SCOPES) },
  };
}
