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
