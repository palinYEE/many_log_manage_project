import request from 'supertest';

describe('root route /log API TEST', () => {
  describe('GET /random: 랜덤한 로그를 생성한다.', () => {
    it('성공 시', done => {
      request('http://localhost:3000')
        .get('/log/random')
        .end((err, res) => {
          expect(res.status).toBe(200);
          done();
        });
    });
  });
});
