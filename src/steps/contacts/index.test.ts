import {
  createMockStepExecutionContext,
  Recording,
} from '@jupiterone/integration-sdk-testing';
import * as contact from '.';
import { createIntegrationConfig } from '../../../test/config';
import { setupHubspotRecording } from '../../../test/recording';
import { IntegrationConfig } from '../../config';

describe('#fetchContacts', () => {
  let recording: Recording;

  beforeEach(() => {
    recording = setupHubspotRecording({
      directory: __dirname,
      name: 'fetchContacts',
    });
  });

  afterEach(async () => {
    await recording.stop();
  });

  test('should collect data', async () => {
    const context = createMockStepExecutionContext<IntegrationConfig>({
      instanceConfig: createIntegrationConfig(),
    });

    await contact.fetchContacts(context);

    expect({
      numCollectedEntities: context.jobState.collectedEntities.length,
      numCollectedRelationships: context.jobState.collectedRelationships.length,
      collectedEntities: context.jobState.collectedEntities,
      collectedRelationships: context.jobState.collectedRelationships,
      encounteredTypes: context.jobState.encounteredTypes,
    }).toMatchSnapshot();

    const contacts = context.jobState.collectedEntities.filter((e) =>
      e._class.includes('User'),
    );

    expect(contacts.length).toBeGreaterThan(0);
    expect(contacts).toMatchGraphObjectSchema({
      _class: ['User'],
      schema: {
        additionalProperties: false,
        properties: {
          _rawData: {
            type: 'array',
            items: { type: 'object' },
          },
          _type: { const: 'hubspot_contact' },
          // We want to make sure we include every field from converter.ts
          archived: { type: 'boolean' },
          createdOn: { type: 'number' },
          updatedOn: { type: 'number' },
          properties: { type: 'object' },
          email: { type: 'string' },
          name: { type: 'string' },
          username: { type: 'string' },
        },
      },
    });
  });
});
