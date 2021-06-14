import { companySteps } from './companies';
import { ownerSteps } from './owners';
import { roleSteps } from './roles';

const integrationSteps = [...roleSteps, ...ownerSteps, ...companySteps];

export { integrationSteps };
