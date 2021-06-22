import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../config';
import { Owner, Team } from '../../types';
import { Entities, IntegrationSteps } from '../constants';
import { createOwnerTeamRelationship, createTeamEntity } from './converters';

export async function fetchTeams({
  jobState,
  instance,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  // Hubspot does not allow iterating teams. We must list owners from previous step.
  const teams: Team[] = [];
  for (const team of teams) {
    const teamEntity = createTeamEntity(team);
    await jobState.addEntity(teamEntity);
    await jobState.iterateEntities(
      { _type: Entities.USER._type },
      async (ownerEntity) => {
        if (
          ((ownerEntity._rawData as unknown) as Owner).teams?.some(
            (it) => it.id === team.id,
          )
        ) {
          await jobState.addRelationship(
            createOwnerTeamRelationship(ownerEntity, teamEntity),
          );
        }
      },
    );
  }
}

export const teamSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: IntegrationSteps.TEAMS,
    name: 'Fetch Teams',
    entities: [Entities.TEAM],
    relationships: [],
    dependsOn: [IntegrationSteps.OWNERS],
    executionHandler: fetchTeams,
  },
];
