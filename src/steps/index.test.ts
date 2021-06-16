import { createMockStepExecutionContext } from '@jupiterone/integration-sdk-testing';
import { integrationConfig } from '../../test/config';
import { IntegrationConfig } from '../config';
import { fetchOwners } from './owner';

test('should collect data', async () => {
  const context = createMockStepExecutionContext<IntegrationConfig>({
    instanceConfig: integrationConfig,
  });

  // Simulates dependency graph execution.
  // See https://github.com/JupiterOne/sdk/issues/262.
  // await fetchAccountDetails(context);
  await fetchOwners(context);

  // Review snapshot, failure is a regression
  expect({
    numCollectedEntities: context.jobState.collectedEntities.length,
    numCollectedRelationships: context.jobState.collectedRelationships.length,
    collectedEntities: context.jobState.collectedEntities,
    collectedRelationships: context.jobState.collectedRelationships,
    encounteredTypes: context.jobState.encounteredTypes,
  }).toMatchSnapshot();

  const owners = context.jobState.collectedEntities.filter((e) =>
    e._class.includes('User'),
  );
  expect(owners.length).toBeGreaterThan(0);
  expect(owners).toMatchGraphObjectSchema({
    _class: ['User'],
    schema: {
      additionalProperties: false,
      properties: {
        _type: { const: 'acme_user' },
        firstName: { type: 'string' },
        _rawData: {
          type: 'array',
          items: { type: 'object' },
        },
      },
      required: ['firstName'],
    },
  });
});
