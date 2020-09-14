const supertest = require('supertest');
const server = require('../api/server');

describe('User Auth Register Tests', () => {
  it('POST /api/auth/register fails register', async () => {
    const res = await supertest(server)
      .post('/api/auth/register')
      .send({ username: 'test', password: null });
    expect(res.statusCode).toBe(400);
    expect(res.type).toBe('application/json');
    expect(res.body.message).toBe(
      'Username, and Password fields are required.'
    );
  });

  it('POST /api/auth/register creates test user', async () => {
    const res = await supertest(server)
      .post('/api/auth/register')
      .send({ username: `${Date.now()}`, password: `${Date.now()}` });
    expect(res.statusCode).toBe(201);
    expect(res.type).toBe('application/json');
  });
});

describe('User Auth Login Tests', () => {
  it('POST /api/auth/login fails login', async () => {
    const res = await supertest(server)
      .post('/api/auth/login')
      .send({ username: 'bdavis', password: null });
    expect(res.statusCode).toBe(400);
    expect(res.type).toBe('application/json');
    expect(res.body.message).toBe(
      'Username, and Password fields are required.'
    );
  });

  it('POST /api/auth/login successfully logs in', async () => {
    const res = await supertest(server)
      .post('/api/auth/login')
      .send({ username: 'bdavis', password: 'davis' });
    expect(res.statusCode).toBe(200);
    expect(res.type).toBe('application/json');
  });
});
