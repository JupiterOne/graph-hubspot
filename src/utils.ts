import { StepEntityMetadata } from '@jupiterone/integration-sdk-core';

export function getEntityKey(entity: StepEntityMetadata, id: string) {
  return `${entity._type}:${id} `;
}
