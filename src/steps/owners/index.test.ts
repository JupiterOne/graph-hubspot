import {
  createMockStepExecutionContext,
  Recording,
} from '@jupiterone/integration-sdk-testing';
import { createIntegrationConfig } from '../../../test/config';
import { IntegrationConfig } from '../../config';
import * as owner from '.';
import * as role from '../roles';
import * as user from '../users';
import { Relationships } from '../constants';
import { setupHubspotRecording } from '../../../test/recording';

describe('#fetchOwners', () => {
  let recording: Recording;

  beforeEach(() => {
    recording = setupHubspotRecording({
      directory: __dirname,
      name: 'fetchOwners',
    });
  });

  afterEach(async () => {
    await recording.stop();
  });

  test('should collect data', async () => {
    const context = createMockStepExecutionContext<IntegrationConfig>({
      instanceConfig: createIntegrationConfig(),
    });

    await role.fetchRoles(context);
    await user.fetchUsers(context);
    await owner.fetchOwners(context);

    expect({
      numCollectedEntities: context.jobState.collectedEntities.length,
      numCollectedRelationships: context.jobState.collectedRelationships.length,
      collectedEntities: context.jobState.collectedEntities,
      collectedRelationships: context.jobState.collectedRelationships,
      encounteredTypes: context.jobState.encounteredTypes,
    }).toMatchSnapshot();

    const owners = context.jobState.collectedEntities.filter((e) =>
      e._type.includes('hubspot_owner'),
    );

    expect(owners.length).toBeGreaterThan(0);
    expect(owners).toMatchGraphObjectSchema({
      _class: ['User'],
      schema: {
        additionalProperties: false,
        properties: {
          _rawData: {
            type: 'array',
            items: { type: 'object' },
          },
          _type: { const: 'hubspot_owner' },
          id: { type: 'string' },
          name: { type: 'string' },
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          email: { type: 'string' },
          userId: { type: 'number' },
          username: { type: 'string' },
          archived: { type: 'boolean' },
          active: { type: 'boolean' },
          createdOn: { type: 'number' },
          updatedOn: { type: 'number' },
        },
      },
    });

    expect(
      context.jobState.collectedRelationships.filter(
        (e) => e._type === Relationships.USER_ASSIGNED_ROLE._type,
      ),
    ).toMatchDirectRelationshipSchema({
      schema: {
        properties: {
          _class: { const: 'ASSIGNED' },
          _type: {
            const: 'hubspot_user_assigned_role',
          },
        },
      },
    });

    expect(
      context.jobState.collectedRelationships.filter(
        (e) => e._type === Relationships.OWNER_IS_USER._type,
      ),
    ).toMatchDirectRelationshipSchema({
      schema: {
        properties: {
          _class: { const: 'IS' },
          _type: {
            const: 'hubspot_owner_is_user',
          },
        },
      },
    });
  });
});
