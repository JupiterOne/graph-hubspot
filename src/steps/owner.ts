import {
  createIntegrationEntity,
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';
import { createAPIClient } from '../client';
import { IntegrationConfig } from '../config';

export async function fetchOwners({
  jobState,
  instance,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);
  await apiClient.iterateOwners(async (owner) => {
    await jobState.addEntity(
      createIntegrationEntity({
        entityData: {
          source: {
            id: owner.id,
          },
          assign: {
            _key: `hubspot_owner:${owner.id}`,
            _type: 'acme_user',
            _class: 'User',
            // This is a custom property that is not a part of the data model class
            // hierarchy. See: https://github.com/JupiterOne/data-model/blob/master/src/schemas/User.json
            firstName: owner.firstName,
            // lastName: owner.lastName,
            name: `${owner.firstName} ${owner.lastName}`,
            email: owner.email,
            username: owner.email,
          },
        },
      }),
    );
  });
}

export const ownerSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: 'fetch-owners',
    name: 'Fetch Owners',
    entities: [
      {
        resourceName: 'Owner',
        _type: 'acme_user',
        _class: 'User',
      },
    ],
    relationships: [],
    dependsOn: [],
    executionHandler: fetchOwners,
  },
];
