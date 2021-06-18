import { StepEntityMetadata } from '@jupiterone/integration-sdk-core';

export enum IntegrationSteps {
  OWNERS = 'fetch-owners',
  TEAMS = 'fetch-teams',
}

export const Entities: Record<'USER' | 'TEAM', StepEntityMetadata> = {
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
};

// Example on how you'd do the same for relationships

// export const Relationships: Record<
//   | 'USER_HAS_RESOURCE',
//   StepRelationshipMetadata
// > = {
//   USER_HAS_RESOURCE: {
//     _type: 'hubspot_user_has_resource',
//     _class: RelationshipClass.HAS,
//     sourceType: Entities.USER._type,
//     targetType: Entities.SOME_RESOURCE._type,
//   }
// }
