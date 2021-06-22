import {
  createIntegrationEntity,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';
import { Domain } from '../../types';
import { getEntityKey } from '../../utils';
import { Entities } from '../constants';

export function createDomainEntity(data: Domain) {
  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _class: Entities.DOMAIN._class,
        _type: Entities.DOMAIN._type,
        _key: getEntityKey(Entities.DOMAIN, data.id),
        domainName: data.domain,
        name: data.domain,
        createdOn: parseTimePropertyValue(data.createdAt),
        updatedOn: parseTimePropertyValue(data.updatedAt),
      },
    },
  });
}
