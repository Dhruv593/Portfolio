import test from 'node:test';
import assert from 'node:assert/strict';
import { authenticateAdmin } from '../backend/middleware/auth.middleware.js';
import { validateRequest } from '../backend/middleware/validate.middleware.js';
import { updateEducationSchema } from '../backend/utils/validators.js';
import adminRoutes from '../backend/routes/admin.routes.js';
import projectRoutes from '../backend/routes/project.routes.js';
import blogRoutes from '../backend/routes/blog.routes.js';
import experienceRoutes from '../backend/routes/experience.routes.js';
import educationRoutes from '../backend/routes/education.routes.js';
import skillsRoutes from '../backend/routes/skills.routes.js';
import profileRoutes from '../backend/routes/profile.routes.js';
import contactRoutes from '../backend/routes/contact.routes.js';
import mediaRoutes from '../backend/routes/media.routes.js';

test('every content-changing endpoint requires admin except login and contact submission', () => {
  const routers = [adminRoutes, projectRoutes, blogRoutes, experienceRoutes, educationRoutes,
    skillsRoutes, profileRoutes, contactRoutes, mediaRoutes];
  for (const router of routers) {
    for (const layer of (router as any).stack) {
      const route = layer.route;
      if (!route || !Object.keys(route.methods).some((method) => ['post', 'put', 'patch', 'delete'].includes(method))) continue;
      if (router === adminRoutes && route.path === '/login') continue;
      if (router === contactRoutes && route.path === '/') continue;
      assert.ok(route.stack.some((handler: any) => handler.handle === authenticateAdmin),
        `Admin authentication missing for ${route.path}`);
    }
  }
});

test('validated updates discard fields that clients cannot edit', async () => {
  const request = { body: { degree: 'AI', id: 'other-record', _id: 'other-record' }, params: {}, query: {} } as any;
  const response = {} as any;
  let nextCalled = false;
  await validateRequest(updateEducationSchema)(request, response, () => { nextCalled = true; });
  assert.equal(nextCalled, true);
  assert.deepEqual(request.body, { degree: 'AI' });
});
