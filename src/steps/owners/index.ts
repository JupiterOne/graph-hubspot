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
import { createOwnerEntity } from './converters';

export async function fetchOwners({
  instance,
  executionHistory,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config, executionHistory);
  const accountEntity = await jobState.findEntity(
    getEntityKey(Entities.ACCOUNT, instance.config.appId),
  );

  await apiClient.iterateOwners(async (owner) => {
    const ownerEntity = createOwnerEntity(owner);
    await jobState.addEntity(ownerEntity);

    if (accountEntity && ownerEntity) {
      await jobState.addRelationship(
        createDirectRelationship({
          _class: RelationshipClass.HAS,
          from: accountEntity,
          to: ownerEntity,
        }),
      );
    }
  });
}

export async function buildOwnersRolesRelationships({
  instance,
  executionHistory,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config, executionHistory);

  await jobState.iterateEntities(
    { _type: Entities.USER._type },
    async (ownerEntity) => {
      if (!ownerEntity.userId) {
        return;
      }
      const { roleId } = await apiClient.fetchUser(
        ownerEntity.userId as number,
      );
      const roleEntity = roleId
        ? await jobState.findEntity(getEntityKey(Entities.ROLE, roleId))
        : undefined;

      if (roleEntity && ownerEntity) {
        await jobState.addRelationship(
          createDirectRelationship({
            _class: RelationshipClass.ASSIGNED,
            from: ownerEntity,
            to: roleEntity,
          }),
        );
      }
    },
  );
}

export const ownerSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: IntegrationSteps.OWNERS,
    name: 'Fetch Owners',
    entities: [Entities.USER],
    relationships: [Relationships.ACCOUNT_HAS_USER],
    dependsOn: [IntegrationSteps.ACCOUNT],
    executionHandler: fetchOwners,
  },
  {
    id: IntegrationSteps.OWNERS_ROLES,
    name: 'Build Owners Roles',
    entities: [],
    relationships: [Relationships.USER_ASSIGNED_ROLE],
    dependsOn: [IntegrationSteps.OWNERS, IntegrationSteps.ROLES],
    executionHandler: buildOwnersRolesRelationships,
  },
];
