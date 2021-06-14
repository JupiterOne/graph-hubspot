import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';
import { createAPIClient } from '../../client';
import { IntegrationConfig } from '../../config';
import { Entities, IntegrationSteps } from '../constants';
import { createCompanyEntity } from './converters';

export async function fetchCompanies({
  instance,
  executionHistory,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config, executionHistory);
  await apiClient.iterateCompanies(async (company) => {
    await jobState.addEntity(createCompanyEntity(company));
  });
}

export const companySteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: IntegrationSteps.COMPANIES,
    name: 'Fetch Companies',
    entities: [Entities.COMPANY],
    relationships: [],
    dependsOn: [],
    executionHandler: fetchCompanies,
  },
];
