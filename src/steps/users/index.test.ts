import {
  createMockStepExecutionContext,
  Recording,
} from '@jupiterone/integration-sdk-testing';
import { createIntegrationConfig } from '../../../test/config';
import { IntegrationConfig } from '../../config';
import * as user from '.';
import { setupHubspotRecording } from '../../../test/recording';

describe('#fetchUsers', () => {
  let recording: Recording;

  beforeEach(() => {
    recording = setupHubspotRecording({
      directory: __dirname,
      name: 'fetchUsers',
    });
  });

  afterEach(async () => {
    await recording.stop();
  });

  test('should collect data', async () => {
    const context = createMockStepExecutionContext<IntegrationConfig>({
      instanceConfig: createIntegrationConfig(),
    });
    await user.fetchUsers(context);

    expect({
      numCollectedEntities: context.jobState.collectedEntities.length,
      numCollectedRelationships: context.jobState.collectedRelationships.length,
      collectedEntities: context.jobState.collectedEntities,
      collectedRelationships: context.jobState.collectedRelationships,
      encounteredTypes: context.jobState.encounteredTypes,
    }).toMatchSnapshot();

    const users = context.jobState.collectedEntities.filter((e) =>
      e._type.includes('hubspot_user'),
    );

    expect(users.length).toBeGreaterThan(0);
    expect(users).toMatchGraphObjectSchema({
      _class: ['User'],
      schema: {
        additionalProperties: false,
        properties: {
          _rawData: {
            type: 'array',
            items: { type: 'object' },
          },
          _type: { const: 'hubspot_user' },
          id: { type: 'string' },
          username: { type: 'string' },
          name: { type: 'string' },
          email: { type: 'string' },
          roleId: { type: 'string' },
          primaryTeamId: { type: 'string' },
        },
      },
    });
  });
});
