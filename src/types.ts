export type ResourceIteratee<T> = (each: T) => Promise<void> | void;

export interface Owner {
  firstName: string;
  lastName: string;
  createdAt: string;
  archived: boolean;
  teams?: Team[];
  id: string;
  userId: number;
  email: string;
  updatedAt: string;
}

export interface Team {
  id: string;
  name: string;
}

export interface Contact {
  id: string;
  properties: ContactProperties;
  updatedAt: string;
  createdAt: string;
  archived: boolean;
  archivedAt: string;
}

export interface ContactProperties {
  email: string;
  firstname: string;
  lastname: string;
  [key: string]: any;
}
