import { generateRandomLog } from '../../src/utils.ts';

describe('유틸에 대한 테스트 진행 (format: this is sample log {랜덤 숫지})', () => {
  test('랜덤 로그 생성 확인', () => {
    expect(generateRandomLog()).toMatch(/this is sample log \d+/);
  });
});
