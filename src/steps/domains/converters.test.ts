import { getMockDomain } from '../../../test/mocks';
import { createDomainEntity } from './converters';

describe('#createDomainEntity', () => {
  test('should convert to entity', () => {
    expect(createDomainEntity(getMockDomain())).toMatchSnapshot();
  });
});
