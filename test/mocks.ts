import { Company, Owner, Role } from '../src/types';

export function getMockOwner(partial?: Partial<Owner>): Owner {
  return {
    id: '84106262',
    email: 'user@example.com',
    firstName: 'John',
    lastName: 'Doe',
    userId: 25150127,
    createdAt: '2021-06-14T19:38:46.907Z',
    updatedAt: '2021-06-14T19:38:46.907Z',
    archived: false,
    ...partial,
  };
}

export function getMockRole(partial?: Partial<Role>): Role {
  return {
    id: '95124',
    name: 'TestRole',
    requiresBillingWrite: false,
    ...partial,
  };
}

export function getMockCompany(partial?: Partial<Company>): Company {
  return {
    companyId: 84106264,
    portalId: 21406264,
    isDeleted: false,
    properties: {
      name: {
        value: 'Awesome company',
      },
      domain: {
        value: 'awesomecompanydomain.tld',
      },
      website: {
        value: 'awesomecompanydomain.tld',
      },
    },
    ...partial,
  };
}
