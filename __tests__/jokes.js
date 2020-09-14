const supertest = require('supertest');
const server = require('../api/server');

let token;

beforeAll((done) => {
  supertest(server)
    .post('/api/auth/login')
    .send({
      username: 'bdavis',
      password: 'davis',
    })
    .end((err, response) => {
      token = response.body.token; // save the token!
      done();
    });
});

describe('Jokes Auth Tests', () => {
  it('GET /api/jokes fails auth', async () => {
    const res = await supertest(server).get('/api/jokes');
    expect(res.statusCode).toBe(400);
    expect(res.type).toBe('application/json');
    expect(res.body.message).toBe('No credentials provided');
  });

  it('GET /api/jokes passes auth', async () => {
    const res = await supertest(server)
      .get('/api/jokes')
      .set('authorization', `${token}`);
    expect(res.statusCode).toBe(200);
  });
});
