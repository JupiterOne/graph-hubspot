import {
  createIntegrationEntity,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';
import { Owner } from '../../types';
import { Entities } from '../constants';

// We may need to search for Owner later using its key
// It's a good idea to export this function and use it later
export function getOwnerKey(id: string) {
  return `hubspot_owner:${id}`;
}

export function createOwnerEntity(data: Owner) {
  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _class: Entities.USER._class,
        _type: Entities.USER._type,
        _key: getOwnerKey(data.id),
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
        createdOn: parseTimePropertyValue(data.createdAt),
        updatedOn: parseTimePropertyValue(data.updatedAt),
      },
    },
  });
}
