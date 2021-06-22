import {
  createDirectRelationship,
  createIntegrationEntity,
  Entity,
  Relationship,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';
import { Team } from '../../types';
import { getEntityKey } from '../../utils';
import { Entities, Relationships } from '../constants';

export function createTeamEntity(data: Team) {
  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _class: Entities.TEAM._class,
        _type: Entities.TEAM._type,
        _key: getEntityKey(Entities.TEAM, data.id),
        name: data.name,
      },
    },
  });
}

export function createOwnerTeamRelationship(
  owner: Entity,
  team: Entity,
): Relationship {
  const parentKey = owner._key;
  const childKey = team._key;

  return createDirectRelationship({
    _class: RelationshipClass.HAS,
    fromKey: parentKey,
    fromType: Entities.USER._type,
    toKey: childKey,
    toType: Entities.TEAM._type,
    properties: {
      _type: Relationships.USER_HAS_TEAM._type,
    },
  });
}
