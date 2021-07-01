import { getMockCompany } from '../../../test/mocks';
import { createCompanyEntity } from './converters';

describe('#createCompanyEntity', () => {
  test('should convert to entity', () => {
    expect(createCompanyEntity(getMockCompany())).toMatchSnapshot();
  });
});
