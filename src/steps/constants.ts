import {
  RelationshipClass,
  StepEntityMetadata,
  StepRelationshipMetadata,
} from '@jupiterone/integration-sdk-core';

export enum IntegrationSteps {
  OWNERS = 'fetch-owners',
  OWNERS_ROLES = 'build-owners-roles',
  COMPANIES = 'fetch-companies',
  ROLES = 'fetch-roles',
  USERS = 'fetch-users',
  ACCOUNT = 'fetch-account',
}

export const Entities: Record<
  'USER' | 'COMPANY' | 'ROLE' | 'ACCOUNT',
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
  ACCOUNT: {
    _type: 'hubspot_account',
    _class: 'Account',
    resourceName: 'HubSpot Account',
  },
};

export const Relationships: Record<
  | 'USER_ASSIGNED_ROLE'
  | 'ACCOUNT_HAS_COMPANY'
  | 'ACCOUNT_HAS_USER'
  | 'ACCOUNT_HAS_ROLE',
  StepRelationshipMetadata
> = {
  USER_ASSIGNED_ROLE: {
    _type: 'hubspot_user_assigned_role',
    _class: RelationshipClass.ASSIGNED,
    sourceType: Entities.USER._type,
    targetType: Entities.ROLE._type,
  },
  ACCOUNT_HAS_COMPANY: {
    _type: 'hubspot_account_has_company',
    _class: RelationshipClass.HAS,
    sourceType: Entities.ACCOUNT._type,
    targetType: Entities.COMPANY._type,
  },
  ACCOUNT_HAS_USER: {
    _type: 'hubspot_account_has_user',
    _class: RelationshipClass.HAS,
    sourceType: Entities.ACCOUNT._type,
    targetType: Entities.USER._type,
  },
  ACCOUNT_HAS_ROLE: {
    _type: 'hubspot_account_has_role',
    _class: RelationshipClass.HAS,
    sourceType: Entities.ACCOUNT._type,
    targetType: Entities.ROLE._type,
  },
};
