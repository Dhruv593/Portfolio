import test from 'node:test';
import assert from 'node:assert/strict';
import publicRoutes from '../backend/routes/public.routes.js';
import { dbService } from '../backend/db/mongodb.js';
import { experienceService } from '../backend/services/experience.service.js';
import { profileService } from '../backend/services/profile.service.js';
import { env } from '../backend/config/env.config.js';

test('public portfolio returns one MongoDB snapshot rather than bundled sample content', async () => {
  const documents: Record<string, object[]> = {
    projects: [{ _id: 'project-1', name: 'Live project', displayOrder: 1 }],
    blogs: [],
    experience: [{ _id: 'experience-1', role: 'AI Engineer' }],
    education: [],
    skills: [],
    profile: [{ _id: 'main-profile', name: 'Live profile' }],
  };
  const originalGetDb = dbService.getDb;
  const originalProduction = env.IS_PROD;
  dbService.getDb = (() => ({
    collection: (name: string) => ({
      find: () => ({ toArray: async () => documents[name] }),
      findOne: async () => documents[name][0],
    }),
  })) as typeof dbService.getDb;

  const route = (publicRoutes as any).stack.find((layer: any) => layer.route?.path === '/').route;
  const handler = route.stack[0].handle;
  const headers: Record<string, string> = {};
  let status = 200;
  let data: any;
  const response = {
    status(code: number) { status = code; return this; },
    append(name: string, value: string) { headers[name.toLowerCase()] = value; return this; },
    json(value: unknown) { data = value; return this; },
  };
  try {
    await handler({}, response);
    assert.equal(status, 200);
    assert.equal(data.profile.name, 'Live profile');
    assert.equal(data.projects[0].id, 'project-1');
    assert.equal(data.experience[0].role, 'AI Engineer');
    assert.ok(headers['server-timing']?.includes('portfolio-read'));
    assert.equal((await experienceService.getExperience())[0].role, 'AI Engineer');
    assert.equal((await profileService.getProfile()).name, 'Live profile');

    env.IS_PROD = true;
    dbService.getDb = (() => null) as typeof dbService.getDb;
    await handler({}, response);
    assert.equal(status, 503);
    assert.equal(data.error, 'Portfolio data is temporarily unavailable.');
  } finally {
    env.IS_PROD = originalProduction;
    dbService.getDb = originalGetDb;
  }
});
