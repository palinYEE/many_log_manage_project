import { TCustomLog } from './../../src/interface/app.interface';
import request from 'supertest';
import { Faker, ko } from '@faker-js/faker';

const koFaker = new Faker({
  locale: [ko],
});

describe('root route /log API TEST', () => {
  describe('GET /random: 랜덤한 로그를 생성한다.', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let data: any;
    test('정상적으로 데이터를 받아 오는지 확인', async () => {
      const res = await request('http://localhost:3000').get('/log/random');
      data = res.body;
      expect(res.statusCode).toBe(200);
    });
    test('각 필드가 존재하는지 확인', () => {
      const keys = Object.keys(data);
      expect(keys).toEqual(['log', 'name', 'email']);
    });
    test('name 필드가 Null 이 아닌지 확인', () => {
      expect(data['name']).not.toBeNull();
    });
    test('log 필드가 Null 이 아닌지 확인', () => {
      expect(data['log']).not.toBeNull();
    });
    test('email 필드가 Null 이 아닌지 확인', () => {
      expect(data['email']).not.toBeNull();
    });
  });

  describe('POST /custom: 사용자가 로그를 입력한다.', () => {
    const successData: TCustomLog = {
      log: koFaker.word.words({ count: { min: 10, max: 1000 } }),
      name: koFaker.person.fullName(),
      email: koFaker.internet.email(),
    };
    const logEmptyData: Omit<TCustomLog, 'log'> = {
      name: koFaker.person.fullName(),
      email: koFaker.internet.email(),
    };
    const nameEmptyData: Omit<TCustomLog, 'name'> = {
      log: koFaker.word.words({ count: { min: 10, max: 1000 } }),
      email: koFaker.internet.email(),
    };
    const emailEmptyData: Omit<TCustomLog, 'email'> = {
      log: koFaker.word.words({ count: { min: 10, max: 1000 } }),
      name: koFaker.person.fullName(),
    };
    test('랜덤 데이터를 통해서 API 호출시 정상 동작 하는지 확인', async () => {
      const res = await request('http://localhost:3000', {})
        .post('/log/custom')
        .set('Accept', 'application/json')
        .type('application/json')
        .send(successData);
      expect(res.statusCode).toBe(200);
    });
    test('log 데이터가 없는 경우 에러 반환 확인', async () => {
      const res = await request('http://localhost:3000', {})
        .post('/log/custom')
        .set('Accept', 'application/json')
        .type('application/json')
        .send(logEmptyData);
      expect(res.statusCode).toBe(400);
      expect(res.body.errors[0].msg).toBe('Invalid value');
      expect(res.body.errors[0].path).toBe('log');
    });
    test('name 데이터가 없는 경우 에러 반환 확인', async () => {
      const res = await request('http://localhost:3000', {})
        .post('/log/custom')
        .set('Accept', 'application/json')
        .type('application/json')
        .send(nameEmptyData);
      expect(res.statusCode).toBe(400);
      expect(res.body.errors[0].msg).toBe('Invalid value');
      expect(res.body.errors[0].path).toBe('name');
    });
    test('email 데이터가 없는 경우 에러 반환 확인', async () => {
      const res = await request('http://localhost:3000', {})
        .post('/log/custom')
        .set('Accept', 'application/json')
        .type('application/json')
        .send(emailEmptyData);
      expect(res.statusCode).toBe(400);
      expect(res.body.errors[0].msg).toBe('Invalid value');
      expect(res.body.errors[0].path).toBe('email');
    });
  });
});
