const request = require('supertest');

describe('Example Tests', () => {

  it('Test 1', async (done) => {
    expect(true).toEqual(true);
    done();
  });

  it('Test 2', async (done) => {
    expect(false).toEqual(false);
    done();
  });
});
