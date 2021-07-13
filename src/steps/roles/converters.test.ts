import { getMockRole } from '../../../test/mocks';
import { createRoleEntity } from './converters';

describe('#createRoleEntity', () => {
  test('should convert to entity', () => {
    expect(createRoleEntity(getMockRole())).toMatchSnapshot();
  });
});
