import {
  RelationshipClass,
  StepEntityMetadata,
  StepRelationshipMetadata,
} from '@jupiterone/integration-sdk-core';

export enum IntegrationSteps {
  OWNERS = 'fetch-owners',
  COMPANIES = 'fetch-companies',
  DOMAINS = 'fetch-domains',
  TEAMS = 'fetch-teams',
  CONTACTS = 'fetch-contacts',
  ROLES = 'fetch-roles',
}

export const Entities: Record<
  'OWNER' | 'USER' | 'TEAM' | 'CONTACT' | 'COMPANY' | 'DOMAIN' | 'ROLE',
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

  TEAM: {
    _type: 'hubspot_team',
    _class: 'Team',
    resourceName: 'HubSpot Team',
  },

  CONTACT: {
    _type: 'hubspot_contact',
    _class: 'User',
    resourceName: 'Hubspot Contact',
  },

  COMPANY: {
    _type: 'hubspot_company',
    _class: 'Organization',
    resourceName: 'HubSpot Company',
  },

  DOMAIN: {
    _type: 'hubspot_domain',
    _class: 'Domain',
    resourceName: 'Hubspot domain',
  },
};

export const Relationships: Record<
  'USER_HAS_TEAM' | 'USER_ASSIGNED_ROLE',
  StepRelationshipMetadata
> = {
  USER_HAS_TEAM: {
    _type: 'hubspot_user_has_team',
    _class: RelationshipClass.HAS,
    sourceType: Entities.USER._type,
    targetType: Entities.TEAM._type,
  },

  USER_ASSIGNED_ROLE: {
    _type: 'hubspot_user_assigned_role',
    _class: RelationshipClass.ASSIGNED,
    sourceType: Entities.USER._type,
    targetType: Entities.ROLE._type,
  },
};
