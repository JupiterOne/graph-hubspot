import { companySteps } from './companies';
import { domainSteps } from './domains';
import { ownerSteps } from './owners';

const integrationSteps = [...ownerSteps, ...companySteps, ...domainSteps];

export { integrationSteps };
