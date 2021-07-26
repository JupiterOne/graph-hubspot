import { getMockOwner } from '../../../test/mocks';
import { createOwnerEntity } from './converters';

describe('#createOwnerEntity', () => {
  test('should convert to entity', () => {
    expect(createOwnerEntity(getMockOwner())).toMatchSnapshot();
  });
});
