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
}

export const Entities: Record<
  'USER' | 'TEAM' | 'CONTACT' | 'COMPANY' | 'DOMAIN',
  StepEntityMetadata
> = {
  /*
     Depending on the other resources later (e.g. will we encounter regular users?)
     We may want to call this "Owner" or similar, we can still use the same class of "User"
     Since user can be both a 'regular' user and the owner.
     A bit hard to tell for sure right now
  */
  USER: {
    _type: 'hubspot_user',
    _class: 'User',
    resourceName: 'HubSpot User',
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
  'USER_HAS_TEAM',
  StepRelationshipMetadata
> = {
  USER_HAS_TEAM: {
    _type: 'hubspot_user_has_team',
    _class: RelationshipClass.HAS,
    sourceType: Entities.USER._type,
    targetType: Entities.TEAM._type,
  },
};
