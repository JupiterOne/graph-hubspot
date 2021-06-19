import {
  createIntegrationEntity,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';
import { Contact } from '../../types';
import { getEntityKey } from '../../utils';
import { Entities } from '../constants';

export function createContactEntity(data: Contact) {
  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _class: Entities.CONTACT._class,
        _type: Entities.CONTACT._type,
        _key: getEntityKey(Entities.CONTACT, data.id),
        archived: data.archived,
        createdOn: parseTimePropertyValue(data.createdAt),
        updatedOn: parseTimePropertyValue(data.updatedAt),
        email: data.properties.email,
        name: `${data.properties.firstname} ${data.properties.lastname}`,
        username: data.properties.email,
      },
    },
  });
}
