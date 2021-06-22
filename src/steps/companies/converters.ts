import {
  createIntegrationEntity,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';
import { Company } from '../../types';
import { getEntityKey } from '../../utils';
import { Entities } from '../constants';

export function createCompanyEntity(data: Company) {
  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _class: Entities.COMPANY._class,
        _type: Entities.COMPANY._type,
        _key: getEntityKey(Entities.COMPANY, data.id),
        name: data.properties.name,
        archived: data.archived,
        website: data.properties.website ?? undefined, // schema parser doesn't like null
        emailDomain: data.properties.domain ?? undefined,
        createdOn: parseTimePropertyValue(data.createdAt),
        updatedOn: parseTimePropertyValue(data.updatedAt),
      },
    },
  });
}
