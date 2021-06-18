import { getMockTeam } from '../../../test/mocks';
import { createTeamEntity } from './converters';

describe('#createTeamEntity', () => {
  test('should convert to entity', () => {
    expect(createTeamEntity(getMockTeam())).toMatchSnapshot();
  });
});
