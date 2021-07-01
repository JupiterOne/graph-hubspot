import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';
import { createAPIClient } from '../../client';
import { IntegrationConfig } from '../../config';
import { Entities, IntegrationSteps } from '../constants';
import { createDomainEntity } from './converters';

export async function fetchDomains({
  jobState,
  instance,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);
  await apiClient.iterateDomains(async (domain) => {
    await jobState.addEntity(createDomainEntity(domain));
  });
}

export const domainSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: IntegrationSteps.DOMAINS,
    name: 'Fetch Domains',
    entities: [Entities.DOMAIN],
    relationships: [],
    dependsOn: [],
    executionHandler: fetchDomains,
  },
];
