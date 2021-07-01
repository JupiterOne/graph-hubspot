import { createMockStepExecutionContext } from '@jupiterone/integration-sdk-testing';
import * as domain from '.';
import { createIntegrationConfig } from '../../../test/config';
import { IntegrationConfig } from '../../config';
import { Entities } from '../constants';

describe('#fetchDomains', () => {
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

    await domain.fetchDomains(context);

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

    expect(companies.length).toBeGreaterThanOrEqual(0);
    expect(companies).toMatchGraphObjectSchema({
      _class: [Entities.DOMAIN._class as string],
      schema: {
        additionalProperties: false,
        required: [],
        properties: {
          _rawData: {
            type: 'array',
            items: { type: 'object' },
          },
          _type: { const: Entities.DOMAIN._type },
          // We want to make sure we include every field from converter.ts
          domainName: { type: 'string' },
          archived: { type: 'boolean' },
          createdOn: { type: 'number' },
          updatedOn: { type: 'number' },
        },
      },
    });
  });
});
