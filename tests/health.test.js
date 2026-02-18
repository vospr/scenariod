'use strict';

const request = require('supertest');
const app = require('../src/app');

describe('GET /health', () => {
  it('A1: returns HTTP 200 status code', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
  });

  it('A2: responds with Content-Type application/json', async () => {
    const res = await request(app).get('/health');
    expect(res.headers['content-type']).toMatch(/application\/json/);
  });

  it('A3: body contains status === "ok"', async () => {
    const res = await request(app).get('/health');
    expect(res.body.status).toBe('ok');
  });

  it('A4: body contains a valid ISO 8601 timestamp (round-trip check)', async () => {
    const res = await request(app).get('/health');
    const ts = res.body.timestamp;
    expect(typeof ts).toBe('string');
    expect(new Date(ts).toISOString()).toBe(ts);
  });

  it('A5: body contains exactly the fields status and timestamp (no extra fields)', async () => {
    const res = await request(app).get('/health');
    const keys = Object.keys(res.body);
    expect(keys).toContain('status');
    expect(keys).toContain('timestamp');
    expect(keys.length).toBe(2);
  });

  it('A6: each request produces a fresh timestamp (monotonicity check)', async () => {
    const res1 = await request(app).get('/health');
    // Small delay to ensure time can advance
    await new Promise((resolve) => setTimeout(resolve, 5));
    const res2 = await request(app).get('/health');
    const t1 = new Date(res1.body.timestamp).getTime();
    const t2 = new Date(res2.body.timestamp).getTime();
    expect(t2).toBeGreaterThanOrEqual(t1);
  });
});
