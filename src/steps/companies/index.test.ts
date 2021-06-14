import {
  createMockStepExecutionContext,
  Recording,
} from '@jupiterone/integration-sdk-testing';
import * as company from '.';
import { createIntegrationConfig } from '../../../test/config';
import { IntegrationConfig } from '../../config';
import { Entities } from '../constants';
import { setupHubspotRecording } from '../../../test/recording';

describe('#fetchCompanies', () => {
  let recording: Recording;

  beforeEach(() => {
    recording = setupHubspotRecording({
      directory: __dirname,
      name: 'fetchCompanies',
    });
  });

  afterEach(async () => {
    await recording.stop();
  });

  test('should collect data', async () => {
    const context = createMockStepExecutionContext<IntegrationConfig>({
      instanceConfig: createIntegrationConfig(),
    });

    await company.fetchCompanies(context);

    expect({
      numCollectedEntities: context.jobState.collectedEntities.length,
      numCollectedRelationships: context.jobState.collectedRelationships.length,
      collectedEntities: context.jobState.collectedEntities,
      collectedRelationships: context.jobState.collectedRelationships,
      encounteredTypes: context.jobState.encounteredTypes,
    }).toMatchSnapshot();

    const companies = context.jobState.collectedEntities.filter((e) =>
      e._class.includes(Entities.COMPANY._class as string),
    );

    expect(companies.length).toBeGreaterThan(0);
    expect(companies).toMatchGraphObjectSchema({
      _class: [Entities.COMPANY._class as string],
      schema: {
        additionalProperties: false,
        required: [],
        properties: {
          _rawData: {
            type: 'array',
            items: { type: 'object' },
          },
          _type: { const: Entities.COMPANY._type },

          id: { type: 'string' },
          portalId: { type: 'number' },
          name: { type: 'string' },
          archived: { type: 'boolean' },
          host: { type: 'string' },
          domain: { type: 'string' },
          city: { type: 'string' },
          industry: { type: 'string' },
          ownerId: { type: 'string' },
          public: { type: 'boolean' },
          createdOn: { type: 'number' },
          updatedOn: { type: 'number' },
        },
      },
    });
  });
});
