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
          source: owner,
          assign: {
            _key: 'acme-unique-account-id',
            _type: 'acme_account',
            _class: 'Account',
            mfaEnabled: true,
            // This is a custom property that is not a part of the data model class
            // hierarchy. See: https://github.com/JupiterOne/data-model/blob/master/src/schemas/Account.json
            manager: 'Manager Name',
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
        _type: 'acme_account',
        _class: 'Account',
      },
    ],
    relationships: [],
    dependsOn: [],
    executionHandler: fetchOwners,
  },
];
