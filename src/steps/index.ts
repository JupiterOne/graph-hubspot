import { companySteps } from './companies';
import { contactSteps } from './contacts';
import { domainSteps } from './domains';
import { ownerSteps } from './owners';
import { teamSteps } from './teams';

const integrationSteps = [
  ...ownerSteps,
  ...teamSteps,
  ...contactSteps,
  ...domainSteps,
  ...companySteps,
];

export { integrationSteps };
