import { companySteps } from './companies';
import { ownerSteps } from './owners';
import { roleSteps } from './roles';

const integrationSteps = [...ownerSteps, ...roleSteps, ...companySteps];

export { integrationSteps };
