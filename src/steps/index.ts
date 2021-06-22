import { companySteps } from './companies';
import { domainSteps } from './domains';
import { ownerSteps } from './owners';
import { teamSteps } from './teams';

const integrationSteps = [
  ...ownerSteps,
  ...teamSteps,
  ...teamSteps,
  ...domainSteps,
  ...companySteps,
];

export { integrationSteps };
