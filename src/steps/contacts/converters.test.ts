import { getMockContact } from '../../../test/mocks';
import { createContactEntity } from './converters';

describe('#createContactEntity', () => {
  test('should convert to entity', () => {
    expect(createContactEntity(getMockContact())).toMatchSnapshot();
  });
});
