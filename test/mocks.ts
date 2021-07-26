import { Company, Owner, Role, User } from '../src/types';

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

export function getMockUser(partial?: Partial<User>): User {
  return {
    id: '25412366',
    email: 'user@email.com',
    roleId: '12312',
    primaryTeamId: '3712345',
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
