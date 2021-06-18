import {
  createIntegrationEntity,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';
import { Contact } from '../../types';
import { Entities } from '../constants';

// We may need to search for Owner later using its key
// It's a good idea to export this function and use it later
export function getContactKey(id: string) {
  return `hubspot_contact:${id}`;
}

export function createContactEntity(data: Contact) {
  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _class: Entities.CONTACT._class,
        _type: Entities.CONTACT._type,
        _key: getContactKey(data.id),
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
