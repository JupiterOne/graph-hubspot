import { accountSteps } from './account';
import { companySteps } from './companies';
import { ownerSteps } from './owners';
import { roleSteps } from './roles';

const integrationSteps = [
  ...accountSteps,
  ...roleSteps,
  ...ownerSteps,
  ...companySteps,
];

export { integrationSteps };
