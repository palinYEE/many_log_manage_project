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
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../src/utils");
describe('유틸에 대한 테스트', () => {
    describe('랜덤 로그 생성 확인', () => {
        test('랜덤 로그 데이터가 형식에 맞게 생성되는지 확인 (format: this is sample log {랜덤 숫자}', () => {
            expect((0, utils_1.generateRandomLog)()).toMatch(/this is sample log \d+/);
        });
    });
    describe('랜덤 유저 데이터 생성 확인', () => {
        let testData;
        beforeAll(() => {
            testData = (0, utils_1.generateRandomUser)();
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
describe('Rabbitmq 관련 유틸 테스트', () => {
    process.env.NODE_ENV = 'development';
    process.env.RABBITMQ_ID = 'admin';
    process.env.RABBITMQ_PASSWORD = 'admin';
    process.env.RABBITMQ_PORT = '5672';
    describe('성공 시나리오', () => {
        process.env.RABBITMQ_HOST = 'localhost'; // local 에서 테스트 하기 때문에 host 를 localhost 로 함.
        const successMQClass = new utils_1.rabbitmqHandlerClass();
        test('Rabbitmq 정상 연결 확인', () => __awaiter(void 0, void 0, void 0, function* () {
            yield successMQClass.connnectMQ();
            expect(successMQClass.connection).not.toEqual(null);
        }));
        test('Rabbitmq 채널 생성 확인', () => __awaiter(void 0, void 0, void 0, function* () {
            yield successMQClass.createChannel();
            expect(successMQClass.channel).not.toEqual(null);
        }));
        test('Rabbitmq exchange 생성 확인', () => __awaiter(void 0, void 0, void 0, function* () {
            yield successMQClass.createExchange('test_exchange', 'direct');
            expect(successMQClass.exchange).not.toEqual(null);
        }));
        test('Rabbitmq 큐 생성 확인', () => __awaiter(void 0, void 0, void 0, function* () {
            yield successMQClass.createQueue('test_queue');
            expect(successMQClass.queue).not.toEqual(null);
        }));
        test('Rabbitmq 생성한 테스트 exchange, 테스트 큐를 정상적으로 바인딩 하는지 확인', () => __awaiter(void 0, void 0, void 0, function* () {
            let errorMessage = '';
            try {
                yield successMQClass.bindingQueue('test_routingkey');
            }
            catch (error) {
                errorMessage = error.message;
            }
            expect(errorMessage).toEqual('');
        }));
        test('Rabbitmq 데이터 전송 테스트', () => __awaiter(void 0, void 0, void 0, function* () {
            const testUser = (0, utils_1.generateRandomUser)();
            const testLogData = (0, utils_1.generateRandomLog)();
            const testData = {
                log: testLogData,
                user: testUser,
            };
            let errorMessage = '';
            try {
                yield successMQClass.publish(testData);
            }
            catch (error) {
                errorMessage = error.message;
            }
            expect(errorMessage).toEqual('');
        }));
        test('Rabbitmq 연결 해제 확인', () => __awaiter(void 0, void 0, void 0, function* () {
            yield successMQClass.closeMQ();
            expect(successMQClass.connection).toEqual(null);
        }));
    });
    describe('실패 시나리오', () => {
        process.env.RABBITMQ_HOST = 'error'; // local 에서 테스트 하기 때문에 host 를 localhost 로 함.
        const failMQClass = new utils_1.rabbitmqHandlerClass();
        test('Rabbitmq 연결 실패 시 에러 반환 확인', () => __awaiter(void 0, void 0, void 0, function* () {
            let errorMessage = '';
            try {
                yield failMQClass.connnectMQ();
            }
            catch (error) {
                errorMessage = error.message;
            }
            expect(errorMessage).not.toEqual('');
        }));
        test('Rabbitmq 연결이 안된 상태에서 채널 생성 시 에러 반환 확인', () => __awaiter(void 0, void 0, void 0, function* () {
            let errorMessage = '';
            try {
                yield failMQClass.createChannel();
            }
            catch (error) {
                errorMessage = error.message;
            }
            expect(errorMessage).not.toEqual('');
        }));
        test('Rabbitmq 채널이 없는 상태에서 exchange 생성 시 에러 반환 확인', () => __awaiter(void 0, void 0, void 0, function* () {
            let errorMessage = '';
            try {
                yield failMQClass.createExchange('test_exchange', 'direct');
            }
            catch (error) {
                errorMessage = error.message;
            }
            expect(errorMessage).not.toEqual('');
        }));
        test('Rabbitmq 채널이 없는 상태에서 큐 생성 시 에러 반환 확인', () => __awaiter(void 0, void 0, void 0, function* () {
            let errorMessage = '';
            try {
                yield failMQClass.createQueue('test_queue');
            }
            catch (error) {
                errorMessage = error.message;
            }
            expect(errorMessage).not.toEqual('');
        }));
        test('Rabbitmq 채널, 큐, exchange가 없는 상태에서 binding 시도 시 에러 반환 확인', () => __awaiter(void 0, void 0, void 0, function* () {
            let errorMessage = '';
            try {
                yield failMQClass.bindingQueue('test_routingkey');
            }
            catch (error) {
                errorMessage = error.message;
            }
            expect(errorMessage).not.toEqual('');
        }));
        test('Rabbitmq 연결 안된 상태에서 연결 끊을 시 에러 반환 확인', () => __awaiter(void 0, void 0, void 0, function* () {
            let errorMessage = '';
            try {
                yield failMQClass.closeMQ();
            }
            catch (error) {
                errorMessage = error.message;
            }
            expect(errorMessage).not.toEqual('');
        }));
    });
});
