import {
  createIntegrationEntity,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';
import { Owner } from '../../types';
import { getEntityKey } from '../../utils';
import { Entities } from '../constants';

export function createOwnerEntity(data: Owner) {
  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _class: Entities.USER._class,
        _type: Entities.USER._type,
        _key: getEntityKey(Entities.USER, data.id),
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
