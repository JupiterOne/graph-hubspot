import { PublicOwner } from '@hubspot/api-client/lib/codegen/crm/owners/api';
import {
  createIntegrationEntity,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';
import { getEntityKey } from '../../utils';
import { Entities } from '../constants';

export function createOwnerEntity(data: PublicOwner) {
  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _class: Entities.USER._class,
        _type: Entities.USER._type,
        _key: getEntityKey(Entities.USER, data.id),
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
