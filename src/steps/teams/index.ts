import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';
import { createAPIClient } from '../../client';
import { IntegrationConfig } from '../../config';
import { Team } from '../../types';
import { Entities, IntegrationSteps } from '../constants';
import { createTeamEntity } from './converters';

export async function fetchTeams({
  jobState,
  instance,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);
  // Hubspot does not allow iterating teams. We must list owners.
  const teams: Team[] = [];
  await apiClient.iterateOwners((owner) => {
    if (owner.teams) {
      teams.push(...owner.teams);
    }
  });
  for (const team of teams) {
    await jobState.addEntity(createTeamEntity(team));
  }
}

export const teamSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: IntegrationSteps.TEAMS,
    name: 'Fetch Teams',
    entities: [Entities.TEAM],
    relationships: [],
    dependsOn: [],
    executionHandler: fetchTeams,
  },
];
