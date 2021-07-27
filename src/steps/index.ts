import { accountSteps } from './account';
import { companySteps } from './companies';
import { ownerSteps } from './owners';
import { roleSteps } from './roles';
import { userSteps } from './users';

const integrationSteps = [
  ...accountSteps,
  ...roleSteps,
  ...ownerSteps,
  ...companySteps,
  ...userSteps,
];

export { integrationSteps };
