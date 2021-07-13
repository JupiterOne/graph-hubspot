import {
  createMockStepExecutionContext,
  Recording,
} from '@jupiterone/integration-sdk-testing';
import * as team from '.';
import { createIntegrationConfig } from '../../../test/config';
import { setupHubspotRecording } from '../../../test/recording';
import { IntegrationConfig } from '../../config';
import * as owner from '../owners';

describe('#fetchTeams', () => {
  let recording: Recording;

  beforeEach(() => {
    recording = setupHubspotRecording({
      directory: __dirname,
      name: 'fetchTeams',
    });
  });

  afterEach(async () => {
    await recording.stop();
  });

  test('should collect data', async () => {
    const context = createMockStepExecutionContext<IntegrationConfig>({
      instanceConfig: createIntegrationConfig(),
    });

    await owner.fetchOwners(context);
    await team.fetchTeams(context);

    expect({
      numCollectedEntities: context.jobState.collectedEntities.length,
      numCollectedRelationships: context.jobState.collectedRelationships.length,
      collectedEntities: context.jobState.collectedEntities,
      collectedRelationships: context.jobState.collectedRelationships,
      encounteredTypes: context.jobState.encounteredTypes,
    }).toMatchSnapshot();

    const teams = context.jobState.collectedEntities.filter((e) =>
      e._class.includes('Team'),
    );

    expect(teams).toMatchGraphObjectSchema({
      _class: ['Team'],
      schema: {
        additionalProperties: false,
        properties: {
          _rawData: {
            type: 'array',
            items: { type: 'object' },
          },
          _type: { const: 'hubspot_team' },
          // We want to make sure we include every field from converter.ts
          name: { type: 'string' },
        },
      },
    });
  });
});
