import { createIntegrationEntity } from '@jupiterone/integration-sdk-core';
import { Owner } from '../../types';

export function createOwnerEntity(owner: Owner) {
  return createIntegrationEntity({
    entityData: {
      source: {
        id: owner.id,
      },
      assign: {
        _key: `hubspot_owner:${owner.id}`,
        _type: 'acme_user',
        _class: 'User',
        // This is a custom property that is not a part of the data model class
        // hierarchy. See: https://github.com/JupiterOne/data-model/blob/master/src/schemas/User.json
        firstName: owner.firstName,
        // lastName: owner.lastName,
        name: `${owner.firstName} ${owner.lastName}`,
        email: owner.email,
        username: owner.email,
      },
    },
  });
}
