import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';
import { createAPIClient } from '../../client';
import { IntegrationConfig } from '../../config';
import { Entities, IntegrationSteps } from '../constants';
import { createUserEntity } from './converters';

export async function fetchUsers({
  instance,
  executionHistory,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config, executionHistory);

  await apiClient.iterateUsers(async (user) => {
    console.log('user', user);
    await jobState.addEntity(createUserEntity(user));
  });
}

export const userSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: IntegrationSteps.USERS,
    name: 'Fetch Users',
    entities: [Entities.USER],
    relationships: [],
    dependsOn: [],
    executionHandler: fetchUsers,
  },
];
