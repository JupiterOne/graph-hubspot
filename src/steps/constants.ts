import {
  RelationshipClass,
  StepEntityMetadata,
  StepRelationshipMetadata,
} from '@jupiterone/integration-sdk-core';

export enum IntegrationSteps {
  OWNERS = 'fetch-owners',
  COMPANIES = 'fetch-companies',
  ROLES = 'fetch-roles',
}

export const Entities: Record<
  'USER' | 'COMPANY' | 'ROLE',
  StepEntityMetadata
> = {
  USER: {
    _type: 'hubspot_user',
    _class: 'User',
    resourceName: 'HubSpot User',
  },

  ROLE: {
    _type: 'hubspot_role',
    _class: 'AccessRole',
    resourceName: 'HubSpot Role',
  },

  COMPANY: {
    _type: 'hubspot_company',
    _class: 'Organization',
    resourceName: 'HubSpot Company',
  },
};

export const Relationships: Record<
  'USER_ASSIGNED_ROLE',
  StepRelationshipMetadata
> = {
  USER_ASSIGNED_ROLE: {
    _type: 'hubspot_user_assigned_role',
    _class: RelationshipClass.ASSIGNED,
    sourceType: Entities.USER._type,
    targetType: Entities.ROLE._type,
  },
};
