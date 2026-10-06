import { Router } from 'express';
import { dbService } from '../db/mongodb.js';
import { dbStore } from '../db/jsonStore.js';
import { readCollection } from '../db/readCollection.js';
import { env } from '../config/env.config.js';
import { BlogDoc, EducationItemDoc, ExperienceItemDoc, ProjectDoc, SkillCategoryDoc } from '../models/types.js';

const router = Router();

router.get('/', async (_req, res) => {
  const db = dbService.getDb();
  if (env.IS_PROD && !db) {
    return res.status(503).json({ error: 'Portfolio data is temporarily unavailable.' });
  }

  try {
    const started = performance.now();
    const [projects, blogs, experience, education, skills, profileDoc] = await Promise.all([
      readCollection<ProjectDoc>('projects'),
      readCollection<BlogDoc>('blogs'),
      readCollection<ExperienceItemDoc>('experience'),
      readCollection<EducationItemDoc>('education'),
      readCollection<SkillCategoryDoc>('skills'),
      db ? (async () => {
        const collection = db.collection('profile');
        return await collection.findOne({ _id: 'main-profile' } as any) || await collection.findOne({});
      })() : undefined,
    ]);
    const profile = profileDoc
      ? (({ _id, ...rest }) => rest)(profileDoc)
      : db ? null : dbStore.profile[0];

    if (!profile) {
      return res.status(503).json({ error: 'Portfolio profile is temporarily unavailable.' });
    }

    res.append('Server-Timing', `portfolio-read;dur=${(performance.now() - started).toFixed(1)}`);
    return res.json({
      projects: (projects ?? dbStore.projects).filter((project) => project.status === 'Published').sort((a, b) =>
        (a.displayOrder ?? Number.MAX_SAFE_INTEGER) - (b.displayOrder ?? Number.MAX_SAFE_INTEGER)
      ),
      blogs: (blogs ?? dbStore.blogs).filter((blog) => blog.status === 'Published'),
      experience: experience ?? dbStore.experience,
      education: education ?? dbStore.education,
      skills: skills ?? dbStore.skills,
      profile,
    });
  } catch {
    return res.status(503).json({ error: 'Portfolio data is temporarily unavailable.' });
  }
});

export default router;
