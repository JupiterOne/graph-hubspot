import {
  createDirectRelationship,
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';
import { createAPIClient } from '../../client';
import { IntegrationConfig } from '../../config';
import { Company } from '../../types';
import { getEntityKey } from '../../utils';
import { Entities, IntegrationSteps, Relationships } from '../constants';
import { createCompanyEntity } from './converters';

export async function fetchCompanies({
  instance,
  executionHistory,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config, executionHistory);
  const accountEntity = await jobState.findEntity(
    getEntityKey(Entities.ACCOUNT, instance.config.appId),
  );

  await apiClient.iterateCompanies(async (company) => {
    const companyEntity = createCompanyEntity(company as Company);
    await jobState.addEntity(companyEntity);

    if (accountEntity && companyEntity) {
      await jobState.addRelationship(
        createDirectRelationship({
          _class: RelationshipClass.HAS,
          from: accountEntity,
          to: companyEntity,
        }),
      );
    }
  });
}

export const companySteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: IntegrationSteps.COMPANIES,
    name: 'Fetch Companies',
    entities: [Entities.COMPANY],
    relationships: [Relationships.ACCOUNT_HAS_COMPANY],
    dependsOn: [IntegrationSteps.ACCOUNT],
    executionHandler: fetchCompanies,
  },
];
