import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, unlinkSync, rmdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

test('new projects remain first and dashboard positions persist', async () => {
  const originalDirectory = process.cwd();
  const scratch = mkdtempSync(join(tmpdir(), 'portfolio-project-order-'));
  process.chdir(scratch);

  try {
    const { dbStore } = await import('../backend/db/jsonStore.js');
    const { projectService } = await import('../backend/services/project.service.js');
    dbStore.projects = [
      { id: 'a', name: 'A', category: 'Test', status: 'Published', dateAdded: '', image: '', description: '', tags: [] },
      { id: 'b', name: 'B', category: 'Test', status: 'Published', dateAdded: '', image: '', description: '', tags: [] },
      { id: 'c', name: 'C', category: 'Test', status: 'Published', dateAdded: '', image: '', description: '', tags: [] },
    ];
    dbStore.categories = ['Test'];

    const created = await projectService.createProject({ name: 'New', category: 'Test', status: 'Published', imagePosition: '30% 70%', imageFit: 'contain', imageScale: 1.2 });
    assert.equal((await projectService.getAllProjects({})).projects[0].id, created.id);
    assert.equal(created.imagePosition, '30% 70%');
    assert.equal(created.imageFit, 'contain');
    assert.equal(created.imageScale, 1.2);

    assert.equal(await projectService.setProjectPosition('c', 1), true);
    assert.deepEqual((await projectService.getAllProjects({})).projects.map((project) => project.id), ['c', created.id, 'a', 'b']);
    assert.deepEqual((await projectService.getAllProjects({ page: 2, limit: 2 })).projects.map((project) => project.id), ['a', 'b']);
    assert.deepEqual(JSON.parse(readFileSync(join(scratch, 'portfolio_db.json'), 'utf8')).projects.map((project: { id: string }) => project.id), ['c', created.id, 'a', 'b']);
  } finally {
    process.chdir(originalDirectory);
    unlinkSync(join(scratch, 'portfolio_db.json'));
    rmdirSync(scratch);
  }
});
