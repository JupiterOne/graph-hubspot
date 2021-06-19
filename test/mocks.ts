import { Company, Owner } from '../src/types';

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

export function getMockCompany(partial?: Partial<Company>): Company {
  return {
    id: '84106264',
    properties: {
      name: 'Awesome company',
      domain: 'awesomecompanydomain.tld',
      website: 'awesomecompanydomain.tld',
    },
    createdAt: '2021-06-14T19:38:46.907Z',
    updatedAt: '2021-06-14T19:38:46.907Z',
    archivedAt: '2021-06-14T19:38:46.907Z',
    archived: false,
    ...partial,
  };
}
