"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const faker_1 = require("@faker-js/faker");
const koFaker = new faker_1.Faker({
    locale: [faker_1.ko],
});
describe('root route /log API TEST', () => {
    describe('GET /random: 랜덤한 로그를 생성한다.', () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let data;
        test('정상적으로 데이터를 받아 오는지 확인', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)('http://localhost:3000').get('/log/random');
            data = res.body;
            expect(res.statusCode).toBe(200);
        }));
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
        const successData = {
            log: koFaker.word.words({ count: { min: 10, max: 1000 } }),
            name: koFaker.person.fullName(),
            email: koFaker.internet.email(),
        };
        const logEmptyData = {
            name: koFaker.person.fullName(),
            email: koFaker.internet.email(),
        };
        const nameEmptyData = {
            log: koFaker.word.words({ count: { min: 10, max: 1000 } }),
            email: koFaker.internet.email(),
        };
        const emailEmptyData = {
            log: koFaker.word.words({ count: { min: 10, max: 1000 } }),
            name: koFaker.person.fullName(),
        };
        test('랜덤 데이터를 통해서 API 호출시 정상 동작 하는지 확인', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)('http://localhost:3000', {})
                .post('/log/custom')
                .set('Accept', 'application/json')
                .type('application/json')
                .send(successData);
            expect(res.statusCode).toBe(200);
        }));
        test('log 데이터가 없는 경우 에러 반환 확인', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)('http://localhost:3000', {})
                .post('/log/custom')
                .set('Accept', 'application/json')
                .type('application/json')
                .send(logEmptyData);
            expect(res.statusCode).toBe(400);
            expect(res.body.errors[0].msg).toBe('Invalid value');
            expect(res.body.errors[0].path).toBe('log');
        }));
        test('name 데이터가 없는 경우 에러 반환 확인', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)('http://localhost:3000', {})
                .post('/log/custom')
                .set('Accept', 'application/json')
                .type('application/json')
                .send(nameEmptyData);
            expect(res.statusCode).toBe(400);
            expect(res.body.errors[0].msg).toBe('Invalid value');
            expect(res.body.errors[0].path).toBe('name');
        }));
        test('email 데이터가 없는 경우 에러 반환 확인', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)('http://localhost:3000', {})
                .post('/log/custom')
                .set('Accept', 'application/json')
                .type('application/json')
                .send(emailEmptyData);
            expect(res.statusCode).toBe(400);
            expect(res.body.errors[0].msg).toBe('Invalid value');
            expect(res.body.errors[0].path).toBe('email');
        }));
    });
    describe('POST /start: 스케줄을 시작 정상 동작 확인.', () => {
        test('스케줄 시작에 성공한다.', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)('http://localhost:3000', {}).post('/log/start');
            expect(res.statusCode).toBe(200);
        }));
        // 또 한번 더 시작 스케줄 진행 시 에러 반환
        test('이미 스케줄이 동작 중인 경우 에러 반환 확인', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)('http://localhost:3000', {}).post('/log/start');
            expect(res.statusCode).toBe(400);
            expect(res.body.errorMessage).toEqual('이미 스케줄이 동작 중입니다.');
        }));
    });
    describe('POST /stop: 스케줄을 종료 정상 동작 확인.', () => {
        test('스케줄 종료에 성공한다.', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)('http://localhost:3000', {}).post('/log/stop');
            expect(res.statusCode).toBe(200);
        }));
        test('이미 스케줄이 동작 중이 아닌 경우 에러 반환 확인', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)('http://localhost:3000', {}).post('/log/stop');
            expect(res.statusCode).toBe(400);
            expect(res.body.errorMessage).toEqual('이미 스케줄이 동작 중이 아닙니다.');
        }));
    });
});
