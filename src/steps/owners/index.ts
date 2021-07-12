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

export async function fetchOwners({
  jobState,
  instance,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);
  await apiClient.iterateOwners(async (owner) => {
    const { roleId } = await apiClient.fetchUser(owner.userId.toString());

    const roleEntity = await jobState.findEntity(
      getEntityKey(Entities.ROLE, roleId),
    );
    const userEntity = createUserEntity(owner);
    await jobState.addEntity(userEntity);

    if (roleEntity && userEntity) {
      await jobState.addRelationship(
        createDirectRelationship({
          _class: RelationshipClass.ASSIGNED,
          from: userEntity,
          to: roleEntity,
          properties: {
            _type: Relationships.USER_ASSIGNED_ROLE._type,
          },
        }),
      );
    }
  });
}

export const ownerSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: IntegrationSteps.OWNERS,
    name: 'Fetch Owners',
    entities: [Entities.USER],
    relationships: [Relationships.USER_ASSIGNED_ROLE],
    dependsOn: [IntegrationSteps.ROLES],
    executionHandler: fetchOwners,
  },
];
