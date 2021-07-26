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
        _class: Entities.OWNER._class,
        _type: Entities.OWNER._type,
        _key: getEntityKey(Entities.OWNER, data.id),
        id: data.id,
        name:
          data.firstName && data.lastName
            ? `${data.firstName} ${data.lastName}`
            : data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        username: data.email,
        archived: data.archived,
        active: !data.archived,
        userId: data.userId,
        createdOn: parseTimePropertyValue(data.createdAt),
        updatedOn: parseTimePropertyValue(data.updatedAt),
      },
    },
  });
}
