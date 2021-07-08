import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';
import { createAPIClient } from '../../client';
import { IntegrationConfig } from '../../config';
import { getEntityKey } from '../../utils';
import { Entities, IntegrationSteps, Relationships } from '../constants';
import { createOwnerEntity, createOwnerRoleRelationship } from './converters';

export async function fetchOwners({
  jobState,
  instance,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);
  await apiClient.iterateOwners(async (owner) => {
    // Intermediate step to get owner role through user endpoint
    const { roleId } = await apiClient.fetchUser(owner.userId.toString());

    const roleEntity = await jobState.findEntity(
      getEntityKey(Entities.ROLE, roleId),
    );
    const ownerEntity = createOwnerEntity(owner);
    await jobState.addEntity(ownerEntity);

    if (roleEntity && ownerEntity) {
      await jobState.addRelationship(
        createOwnerRoleRelationship(ownerEntity, roleEntity),
      );
    }
  });
}

export const ownerSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: IntegrationSteps.OWNERS,
    name: 'Fetch Owners',
    entities: [Entities.OWNER],
    relationships: [
      Relationships.OWNER_ASSIGNED_ROLE,
      Relationships.USER_HAS_TEAM,
    ],
    dependsOn: [IntegrationSteps.ROLES],
    executionHandler: fetchOwners,
  },
];
