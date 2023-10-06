import { IUser } from '../../src/interface/utils.interface';
import { generateRandomLog, generateRandomUser } from '../../src/utils';

describe('유틸에 대한 테스트 진행 (format: this is sample log {랜덤 숫지})', () => {
  describe('랜덤 로그 생성 확인', () => {
    test('랜덤 로그 데이터가 형식에 맞게 생성되는지 확인 (format: this is sample log {랜덤 숫자}', () => {
      expect(generateRandomLog()).toMatch(/this is sample log \d+/);
    });
  });

  describe('랜덤 유저 데이터 생성 확인', () => {
    let testData: IUser;
    beforeAll(() => {
      testData = generateRandomUser();
    });
    test('name 필드의 타입이 string 인지 확인', () => {
      expect(typeof testData.name).toBe('string');
    });
    test('email 필드의 데이터가 이메일 형식을 가지고 있는지 확인', () => {
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      expect(testData.email).toMatch(emailRegex);
    });
  });
});
