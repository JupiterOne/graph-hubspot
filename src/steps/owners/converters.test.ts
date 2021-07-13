import { getMockOwner } from '../../../test/mocks';
import { createUserEntity } from './converters';

describe('#createUserEntity', () => {
  test('should convert to entity', () => {
    expect(createUserEntity(getMockOwner())).toMatchSnapshot();
  });
});
