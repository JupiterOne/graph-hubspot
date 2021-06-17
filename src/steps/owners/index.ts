import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';
import { createAPIClient } from '../../client';
import { IntegrationConfig } from '../../config';
import { Entities, IntegrationSteps } from '../constants';
import { createOwnerEntity } from './converters';

export async function fetchOwners({
  jobState,
  instance,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);
  await apiClient.iterateOwners(async (owner) => {
    await jobState.addEntity(createOwnerEntity(owner));
  });
}

export const ownerSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: IntegrationSteps.OWNERS,
    name: 'Fetch Owners',
    entities: [Entities.USER],
    relationships: [],
    dependsOn: [],
    executionHandler: fetchOwners,
  },
];
