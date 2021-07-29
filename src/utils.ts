import { StepEntityMetadata } from '@jupiterone/integration-sdk-core';

export function getEntityKey(entity: StepEntityMetadata, id: string) {
  return `${entity._type}:${id} `;
}

export function parseHubspotScopes(scopes: string): string[] {
  return scopes.trim().split(',');
}

export function isSuperset(set, subset) {
  for (const elem of subset) {
    if (!set.has(elem)) {
      return false;
    }
  }
  return true;
}
