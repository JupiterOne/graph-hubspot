import { createMockStepExecutionContext } from '@jupiterone/integration-sdk-testing';
import * as company from '.';
import { createIntegrationConfig } from '../../../test/config';
import { IntegrationConfig } from '../../config';
import { Entities } from '../constants';

describe('#fetchCompanies', () => {
  // TODO: we'll add recordings later
  // let recording: Recording;

  // beforeEach(() => {
  //   recording = setupHubSpotRecording({
  //     directory: __dirname,
  //     name: 'fetchOwners',
  //   });
  // });

  // afterEach(async () => {
  //   await recording.stop();
  // });

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
          // We want to make sure we include every field from converter.ts
          name: { type: 'string' },
          website: { type: 'string' },
          emailDomain: { type: 'string' },
          archived: { type: 'boolean' },
          createdOn: { type: 'number' },
          updatedOn: { type: 'number' },
        },
      },
    });
  });
});
