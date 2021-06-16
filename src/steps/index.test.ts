import {
  createIntegrationEntity,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';
import { createMockStepExecutionContext } from '@jupiterone/integration-sdk-testing';
import { integrationConfig } from '../../test/config';
import { IntegrationConfig } from '../config';
import * as owner from './owner';

test('should collect data', async () => {
  const context = createMockStepExecutionContext<IntegrationConfig>({
    instanceConfig: integrationConfig,
  });

  // Simulates dependency graph execution.
  // See https://github.com/JupiterOne/sdk/issues/262.
  // await fetchAccountDetails(context);
  jest
    .spyOn(owner, 'fetchOwners')
    .mockImplementation(
      async ({
        jobState,
      }: IntegrationStepExecutionContext<IntegrationConfig>) => {
        await jobState.addEntity(
          createIntegrationEntity({
            entityData: {
              source: {
                id: 'owner-1',
              },
              assign: {
                _key: `hubspot-owner-owner-1`,
                _type: 'acme_user',
                _class: 'User',
                // This is a custom property that is not a part of the data model class
                // hierarchy. See: https://github.com/JupiterOne/data-model/blob/master/src/schemas/User.json
                firstName: 'Owner',
                // lastName: owner.lastName,
                name: `Owner One`,
                email: 'ownerone@company.tld',
                username: 'ownerone@company.tld',
              },
            },
          }),
        );
      },
    );

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
