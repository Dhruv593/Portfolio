import test from 'node:test';
import assert from 'node:assert/strict';
import jwt from 'jsonwebtoken';
import { isAdminRequest } from '../backend/middleware/auth.middleware.js';
import { env } from '../backend/config/env.config.js';

test('only a signed admin token authorizes admin access', () => {
  const admin = jwt.sign({ role: 'admin' }, env.JWT_SECRET, { algorithm: 'HS256', expiresIn: '1h' });
  const viewer = jwt.sign({ role: 'viewer' }, env.JWT_SECRET, { algorithm: 'HS256', expiresIn: '1h' });
  const expired = jwt.sign({ role: 'admin' }, env.JWT_SECRET, { algorithm: 'HS256', expiresIn: -1 });
  const request = (token: string) => ({ headers: { authorization: `Bearer ${token}` } }) as any;

  assert.equal(isAdminRequest(request(admin)), true);
  assert.equal(isAdminRequest(request(viewer)), false);
  assert.equal(isAdminRequest(request(expired)), false);
  assert.equal(isAdminRequest(request('invalid')), false);
});
