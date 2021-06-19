import { companySteps } from './companies';
import { ownerSteps } from './owners';

const integrationSteps = [...ownerSteps, ...companySteps];

export { integrationSteps };
