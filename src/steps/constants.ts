import {
  RelationshipClass,
  StepEntityMetadata,
  StepRelationshipMetadata,
} from '@jupiterone/integration-sdk-core';

export enum IntegrationSteps {
  OWNERS = 'fetch-owners',
  COMPANIES = 'fetch-companies',
  ROLES = 'fetch-roles',
  USERS = 'fetch-users',
}

export const Entities: Record<
  'USER' | 'COMPANY' | 'ROLE' | 'OWNER',
  StepEntityMetadata
> = {
  USER: {
    _type: 'hubspot_user',
    _class: 'User',
    resourceName: 'HubSpot User',
  },

  OWNER: {
    _type: 'hubspot_owner',
    _class: 'User',
    resourceName: 'HubSpot Owner',
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
  'USER_ASSIGNED_ROLE' | 'OWNER_IS_USER',
  StepRelationshipMetadata
> = {
  USER_ASSIGNED_ROLE: {
    _type: 'hubspot_user_assigned_role',
    _class: RelationshipClass.ASSIGNED,
    sourceType: Entities.USER._type,
    targetType: Entities.ROLE._type,
  },
  OWNER_IS_USER: {
    _type: 'hubspot_owner_is_user',
    _class: RelationshipClass.IS,
    sourceType: Entities.OWNER._type,
    targetType: Entities.USER._type,
  },
};
