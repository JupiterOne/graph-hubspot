import { createMockStepExecutionContext } from '@jupiterone/integration-sdk-testing';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { createIntegrationConfig } from '../../test/config';
import { IntegrationConfig } from '../config';
import * as owner from './owner';

beforeAll(() => {
  dotenv.config({
    path: path.join(__dirname, '../../.env'),
  });
});

test('should collect data', async () => {
  const context = createMockStepExecutionContext<IntegrationConfig>({
    instanceConfig: createIntegrationConfig(),
  });

  // Simulates dependency graph execution.
  // See https://github.com/JupiterOne/sdk/issues/262.
  // // await fetchAccountDetails(context);

  await owner.fetchOwners(context);

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
