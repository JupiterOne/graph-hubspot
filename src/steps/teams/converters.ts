import { createIntegrationEntity } from '@jupiterone/integration-sdk-core';
import { Team } from '../../types';
import { Entities } from '../constants';

// We may need to search for Team later using its key
// It's a good idea to export this function and use it later
export function getTeamKey(id: string) {
  return `hubspot_team:${id}`;
}

export function createTeamEntity(data: Team) {
  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _class: Entities.TEAM._class,
        _type: Entities.TEAM._type,
        _key: getTeamKey(data.id),
        name: data.name,
      },
    },
  });
}
