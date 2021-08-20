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
import { createRoleEntity } from './converters';

export async function fetchRoles({
  instance,
  executionHistory,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config, executionHistory);

  const accountEntity = await jobState.findEntity(
    getEntityKey(Entities.ACCOUNT, instance.config.appId),
  );

  await apiClient.iterateRoles(async (role) => {
    const roleEntity = createRoleEntity(role);
    await jobState.addEntity(roleEntity);

    if (accountEntity && roleEntity) {
      await jobState.addRelationship(
        createDirectRelationship({
          _class: RelationshipClass.HAS,
          from: accountEntity,
          to: roleEntity,
        }),
      );
    }
  });
}

export const roleSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: IntegrationSteps.ROLES,
    name: 'Fetch Roles',
    entities: [Entities.ROLE],
    relationships: [Relationships.ACCOUNT_HAS_ROLE],
    dependsOn: [IntegrationSteps.ACCOUNT],
    executionHandler: fetchRoles,
  },
];
