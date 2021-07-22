import { createIntegrationEntity } from '@jupiterone/integration-sdk-core';
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
        id: data.id,
        name: data.properties.name,
        archived: data.archived,
        host: data.properties.website || '',
        domain: data.properties.domain || '',
        city: data.properties.city || '',
        industry: data.properties.industry || '',
        ownerId: data.properties.hubspot_owner_id || '',
        public: data.properties.is_public === 'true',
        createdOn: data.properties.createdate
          ? parseInt(data.properties.createdate, 10)
          : undefined,
        updatedOn: data.properties.hs_lastmodifieddate
          ? parseInt(data.properties.hs_lastmodifieddate, 10)
          : undefined,
      },
    },
  });
}
