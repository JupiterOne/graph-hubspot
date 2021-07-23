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
  instance,
  executionHistory,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config, executionHistory);
  const res = await apiClient.hubspotClient.crm.owners.defaultApi.getPage();

  for (const owner of res.body.results) {
    const userEntity = createUserEntity({
      ...owner,
      createdAt: owner.createdAt.toString(),
      updatedAt: owner.updatedAt.toString(),
    });
    await jobState.addEntity(userEntity);

    if (owner.userId) {
      await apiClient.fetchUser(owner.userId.toString(), async (user) => {
        const { roleId } = user;
        if (roleId) {
          const roleEntity = await jobState.findEntity(
            getEntityKey(Entities.ROLE, user.roleId.toString()),
          );

          if (roleEntity && userEntity) {
            await jobState.addRelationship(
              createDirectRelationship({
                _class: RelationshipClass.ASSIGNED,
                from: userEntity,
                to: roleEntity,
              }),
            );
          }
        }
      });
    }
  }
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
