import { createIntegrationEntity } from '@jupiterone/integration-sdk-core';
import { Company } from '../../types';
import { getEntityKey } from '../../utils';
import { Entities } from '../constants';

function validURL(str) {
  const pattern = new RegExp(
    '^(https?:\\/\\/)' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i',
  ); // fragment locator
  return !!pattern.test(str);
}

export function createCompanyEntity(data: Company) {
  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _class: Entities.COMPANY._class,
        _type: Entities.COMPANY._type,
        _key: getEntityKey(Entities.COMPANY, data.companyId.toString()),
        id: data.companyId.toString(),
        portalId: data.portalId,
        name: data.properties.name?.value,
        archived: data.isDeleted,
        host: data.properties.website?.value,
        domain: data.properties.domain?.value,
        city: data.properties.city?.value,
        industry: data.properties.industry?.value,
        ownerId: data.properties.hubspot_owner_id?.value,
        public: data.properties.is_public?.value === 'true',
        website: validURL(data.properties.website?.value)
          ? data.properties.website?.value
          : undefined,
        external: !!data.properties.website?.value,
        createdOn: data.properties.createdate?.value
          ? parseInt(data.properties.createdate?.value, 10)
          : undefined,
        updatedOn: data.properties.hs_lastmodifieddate?.value
          ? parseInt(data.properties.hs_lastmodifieddate?.value, 10)
          : undefined,
      },
    },
  });
}
