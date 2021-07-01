import { Company, Contact, Domain, Owner, Team } from '../src/types';

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

export function getMockContact(partial?: Partial<Contact>): Contact {
  return {
    id: '84106262',
    properties: {
      email: 'user@example.com',
      firstname: 'John',
      lastname: 'Doe',
    },
    createdAt: '2021-06-14T19:38:46.907Z',
    updatedAt: '2021-06-14T19:38:46.907Z',
    archivedAt: '2021-06-14T19:38:46.907Z',
    archived: false,
    ...partial,
  };
}

export function getMockTeam(partial?: Partial<Team>): Team {
  return {
    id: '81106262',
    name: 'Team A',
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

export function getMockDomain(partial?: Partial<Domain>): Domain {
  return {
    id: '84106262',
    createdAt: '2021-06-14T19:38:46.907Z',
    updatedAt: '2021-06-14T19:38:46.907Z',
    archivedAt: '2021-06-14T19:38:46.907Z',
    archived: false,
    domain: 'creativice.com',
    ...partial,
  };
}
