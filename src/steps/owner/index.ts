import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';
import { createAPIClient } from '../../client';
import { IntegrationConfig } from '../../config';
import { OwnerEntity } from './constants';
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
    id: 'fetch-owners',
    name: 'Fetch Owners',
    entities: [
      {
        resourceName: OwnerEntity.RESOURCE_NAME,
        _type: OwnerEntity.TYPE,
        _class: OwnerEntity.CLASS,
      },
    ],
    relationships: [],
    dependsOn: [],
    executionHandler: fetchOwners,
  },
];
