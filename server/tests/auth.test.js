const request = require('supertest');
const app = require('../server');
const { startDB, closeDB } = require('./util/db');

describe('Server V1 Auth Endpoints', () => {
  let server;

  beforeAll(async () => {
    await startDB();
    server = app.listen();
  });

  afterAll(async () => {
    await closeDB();
  });

  const loginEndpoint = '/api/v1/login';
  const validateEndpoint = '/api/v1/validate';

  it('Login using username and password, receive JWT', async () => {
    const res = await request.agent(app)
      .post(loginEndpoint)
      .send({
        username: 'username',
        password: 'password',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  it('Login using wrong password, receive 401 (Unauthorized)', async () => {
    const res = await request.agent(app)
      .post(loginEndpoint)
      .send({
        username: 'username',
        password: 'pa1ssword',
      });
    expect(res.statusCode).toEqual(401);
  });

  it('Validate JWT, receive 200', async () => {
    const resLogin = await request.agent(app)
      .post(loginEndpoint)
      .send({
        username: 'username',
        password: 'password',
      });
    const res = await request.agent(app)
      .get(validateEndpoint)
      .set({ Accept: 'application/json', 'Content-type': 'application/json', Authorization: `Bearer ${resLogin.body.token}` });
    expect(res.statusCode).toEqual(200);
  });

  it('Validate wrong JWT, receive 401', async () => {
    const res = await request.agent(app)
      .get(validateEndpoint)
      .set({ Accept: 'application/json', 'Content-type': 'application/json', Authorization: 'Bearer 1' });
    expect(res.statusCode).toEqual(401);
  });

  afterAll(() => {
    server.close();
  });
});
