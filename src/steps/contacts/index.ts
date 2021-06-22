import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';
import { createAPIClient } from '../../client';
import { IntegrationConfig } from '../../config';
import { Entities, IntegrationSteps } from '../constants';
import { createContactEntity } from './converters';

export async function fetchContacts({
  jobState,
  instance,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);
  await apiClient.iterateContacts(async (contact) => {
    await jobState.addEntity(createContactEntity(contact));
  });
}

export const contactSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: IntegrationSteps.CONTACTS,
    name: 'Fetch Contacts',
    entities: [Entities.CONTACT],
    relationships: [],
    dependsOn: [],
    executionHandler: fetchContacts,
  },
];
