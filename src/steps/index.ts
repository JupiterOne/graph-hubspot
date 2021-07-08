import { companySteps } from './companies';
import { contactSteps } from './contacts';
import { domainSteps } from './domains';
import { ownerSteps } from './owners';
import { teamSteps } from './teams';
import { roleSteps } from './roles';

const integrationSteps = [
  ...ownerSteps,
  ...roleSteps,
  ...teamSteps,
  ...contactSteps,
  ...domainSteps,
  ...companySteps,
];

export { integrationSteps };
