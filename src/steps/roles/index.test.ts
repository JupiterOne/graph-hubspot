import {
  createMockStepExecutionContext,
  Recording,
} from '@jupiterone/integration-sdk-testing';
import { createIntegrationConfig } from '../../../test/config';
import { IntegrationConfig } from '../../config';
import * as role from '.';

describe('#fetchRoles', () => {
  // TODO: we'll add recordings later
  // let recording: Recording;

  // beforeEach(() => {
  //   recording = setupHubSpotRecording({
  //     directory: __dirname,
  //     name: 'fetchRoles',
  //   });
  // });

  // afterEach(async () => {
  //   await recording.stop();
  // });

  test('should collect data', async () => {
    const context = createMockStepExecutionContext<IntegrationConfig>({
      instanceConfig: createIntegrationConfig(),
    });

    await role.fetchRoles(context);

    expect({
      numCollectedEntities: context.jobState.collectedEntities.length,
      numCollectedRelationships: context.jobState.collectedRelationships.length,
      collectedEntities: context.jobState.collectedEntities,
      collectedRelationships: context.jobState.collectedRelationships,
      encounteredTypes: context.jobState.encounteredTypes,
    }).toMatchSnapshot();

    const roles = context.jobState.collectedEntities.filter((e) =>
      e._class.includes('AccessRole'),
    );

    expect(roles.length).toBeGreaterThan(0);
    expect(roles).toMatchGraphObjectSchema({
      _class: ['AccessRole'],
      schema: {
        additionalProperties: false,
        properties: {
          _rawData: {
            type: 'array',
            items: { type: 'object' },
          },
          _type: { const: 'hubspot_role' },
          // We want to make sure we include every field from converter.ts
          name: { type: 'string' },
          requiresBillingWrite: { type: 'boolean' },
        },
      },
    });
  });
});
