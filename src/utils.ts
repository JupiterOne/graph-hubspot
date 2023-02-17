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

export async function paginated(
  callback: (after?: string) => Promise<string | undefined>,
) {
  let after: string | undefined = undefined;

  do {
    after = await callback(after);
  } while (after);
}

export async function legacyPaginated(
  callback: (offset: number) => Promise<{ offset: number; hasMore: boolean }>,
) {
  let offset = 0;
  let hasMore = false;

  do {
    const pagerProperties = await callback(offset);
    offset = pagerProperties.offset;
    hasMore = pagerProperties.hasMore;
  } while (hasMore);
}
