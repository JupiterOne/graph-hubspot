import {
  createDirectRelationship,
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';
import { createAPIClient } from '../../client';
import { IntegrationConfig } from '../../config';
import { getEntityKey } from '../../utils';
import { Entities, IntegrationSteps, Relationships } from '../constants';
import { createUserEntity } from './converters';

export async function fetchUsers({
  instance,
  executionHistory,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config, executionHistory);
  const accountEntity = await jobState.findEntity(
    getEntityKey(Entities.ACCOUNT, instance.config.appId),
  );

  await apiClient.iterateUsers(async (user) => {
    const userEntity = createUserEntity(user);
    await jobState.addEntity(userEntity);

    if (accountEntity && userEntity) {
      await jobState.addRelationship(
        createDirectRelationship({
          _class: RelationshipClass.HAS,
          from: accountEntity,
          to: userEntity,
        }),
      );
    }
  });
}

export const userSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: IntegrationSteps.USERS,
    name: 'Fetch Users',
    entities: [Entities.USER],
    relationships: [Relationships.ACCOUNT_HAS_USER],
    dependsOn: [IntegrationSteps.ACCOUNT],
    executionHandler: fetchUsers,
  },
];
