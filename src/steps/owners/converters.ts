import {
  createDirectRelationship,
  createIntegrationEntity,
  Entity,
  parseTimePropertyValue,
  Relationship,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';
import { Owner } from '../../types';
import { getEntityKey } from '../../utils';
import { Entities, Relationships } from '../constants';

export function createOwnerEntity(data: Owner) {
  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _class: Entities.OWNER._class,
        _type: Entities.OWNER._type,
        _key: getEntityKey(Entities.OWNER, data.id),
        // Name is required property, your solution works great for it
        // If it hadn't been a required property, we'd just use:
        // firstName: data.firstName
        // lastName: data.lastName,
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        username: data.email,
        // We may or may not need "userId" - we'll have to see later depending on the other resources and their connections
        // Could be useful property to have around
        archived: data.archived,
        userId: data.userId,
        createdOn: parseTimePropertyValue(data.createdAt),
        updatedOn: parseTimePropertyValue(data.updatedAt),
      },
    },
  });
}

export function createOwnerRoleRelationship(
  owner: Entity,
  role: Entity,
): Relationship {
  const parentKey = owner._key;
  const childKey = role._key;

  return createDirectRelationship({
    _class: RelationshipClass.ASSIGNED,
    fromKey: parentKey,
    fromType: Entities.OWNER._type,
    toKey: childKey,
    toType: Entities.TEAM._type,
    properties: {
      _type: Relationships.OWNER_ASSIGNED_ROLE._type,
    },
  });
}
