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
  const res = await apiClient.hubspotClient.crm.owners.defaultApi.getPage();

  for (const owner of res.body.results) {
    const ownerEntity = createOwnerEntity({
      ...owner,
      createdAt: owner.createdAt.toString(),
      updatedAt: owner.updatedAt.toString(),
    });
    await jobState.addEntity(ownerEntity);

    if (owner.userId) {
      const userEntity = await jobState.findEntity(
        getEntityKey(Entities.USER, owner.userId.toString()),
      );
      if (userEntity && ownerEntity) {
        await jobState.addRelationship(
          createDirectRelationship({
            _class: RelationshipClass.IS,
            from: ownerEntity,
            to: userEntity,
          }),
        );
      }

      const roleId = userEntity?.roleId;
      if (roleId) {
        const roleEntity = await jobState.findEntity(
          getEntityKey(Entities.ROLE, roleId.toString()),
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
    }
  }
}

export const ownerSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: IntegrationSteps.OWNERS,
    name: 'Fetch Owners',
    entities: [Entities.OWNER],
    relationships: [
      Relationships.USER_ASSIGNED_ROLE,
      Relationships.OWNER_IS_USER,
    ],
    dependsOn: [IntegrationSteps.ROLES, IntegrationSteps.USERS],
    executionHandler: fetchOwners,
  },
];
