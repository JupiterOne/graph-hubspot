import {
  createIntegrationEntity,
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../config';
import { getEntityKey } from '../../utils';
import { Entities, IntegrationSteps } from '../constants';

export async function fetchAccount({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  await jobState.addEntity(
    createIntegrationEntity({
      entityData: {
        source: {
          appId: instance.config.appId,
          apiBaseUrl: instance.config.apiBaseUrl,
        },
        assign: {
          _class: Entities.ACCOUNT._class,
          _type: Entities.ACCOUNT._type,
          _key: getEntityKey(Entities.ACCOUNT, instance.config.appId),
          name: instance.config.appId,
          accessUrl: instance.config.apiBaseUrl,
        },
      },
    }),
  );
}

export const accountSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: IntegrationSteps.ACCOUNT,
    name: 'Fetch Account',
    entities: [Entities.ACCOUNT],
    relationships: [],
    dependsOn: [],
    executionHandler: fetchAccount,
  },
];
