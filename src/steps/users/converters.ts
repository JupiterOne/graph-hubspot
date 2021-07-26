import { createIntegrationEntity } from '@jupiterone/integration-sdk-core';
import { User } from '../../types';
import { getEntityKey } from '../../utils';
import { Entities } from '../constants';

export function createUserEntity(data: User) {
  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _class: Entities.USER._class,
        _type: Entities.USER._type,
        _key: getEntityKey(Entities.USER, data.id),
        id: data.id,
        username: data.email,
        name: data.email,
        email: data.email,
        roleId: data.roleId,
        primaryTeamId: data.primaryTeamId,
      },
    },
  });
}
