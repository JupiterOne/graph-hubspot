import { createIntegrationEntity } from '@jupiterone/integration-sdk-core';
import { Role } from '../../types';
import { getEntityKey } from '../../utils';
import { Entities } from '../constants';

export function createRoleEntity(data: Role) {
  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _class: Entities.ROLE._class,
        _type: Entities.ROLE._type,
        _key: getEntityKey(Entities.ROLE, data.id),
        name: data.name,
        requiresBillingWrite: data.requiresBillingWrite,
      },
    },
  });
}
