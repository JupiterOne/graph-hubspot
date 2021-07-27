import {
  createMockStepExecutionContext,
  Recording,
} from '@jupiterone/integration-sdk-testing';
import * as account from '.';
import { createIntegrationConfig } from '../../../test/config';
import { IntegrationConfig } from '../../config';
import { Entities } from '../constants';
import { setupHubspotRecording } from '../../../test/recording';

describe('#fetchAccount', () => {
  let recording: Recording;

  beforeEach(() => {
    recording = setupHubspotRecording({
      directory: __dirname,
      name: 'fetchAccount',
    });
  });

  afterEach(async () => {
    await recording.stop();
  });

  test('should collect data', async () => {
    const context = createMockStepExecutionContext<IntegrationConfig>({
      instanceConfig: createIntegrationConfig(),
    });

    await account.fetchAccount(context);

    expect({
      numCollectedEntities: context.jobState.collectedEntities.length,
      numCollectedRelationships: context.jobState.collectedRelationships.length,
      collectedEntities: context.jobState.collectedEntities,
      collectedRelationships: context.jobState.collectedRelationships,
      encounteredTypes: context.jobState.encounteredTypes,
    }).toMatchSnapshot();

    const companies = context.jobState.collectedEntities.filter((e) =>
      e._class.includes(Entities.ACCOUNT._class as string),
    );

    expect(companies.length).toBeGreaterThan(0);
    expect(companies).toMatchGraphObjectSchema({
      _class: [Entities.ACCOUNT._class as string],
      schema: {
        additionalProperties: false,
        required: [],
        properties: {
          _rawData: {
            type: 'array',
            items: { type: 'object' },
          },
          _type: { const: Entities.ACCOUNT._type },

          name: { type: 'string' },
          accessUrl: { type: 'string' },
        },
      },
    });
  });
});
