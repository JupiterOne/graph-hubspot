import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';
import { createAPIClient } from '../../client';
import { IntegrationConfig } from '../../config';
import { Company } from '../../types';
import { Entities, IntegrationSteps } from '../constants';
import { createCompanyEntity } from './converters';

export async function fetchCompanies({
  instance,
  executionHistory,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config, executionHistory);
  const res = await apiClient.hubspotClient.crm.companies.getAll();
  res.forEach(async (company) => {
    await jobState.addEntity(createCompanyEntity(company as Company));
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
