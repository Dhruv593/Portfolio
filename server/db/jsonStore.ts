import fs from 'fs';
import path from 'path';
import { DBStore } from '../models/types';
import { initialProjects, initialBlogs, initialExperience, initialEducation, initialSkills, initialProfile } from '../../src/data/initialData';
import { logger } from '../utils/logger';

const DATA_FILE = path.join(process.cwd(), 'portfolio_db.json');

const defaultCategories = Array.from(
  new Set([
    'Mobile & Web Design',
    'Full Stack Development',
    'AI & Machine Learning',
    'UI/UX Design',
    'Cloud Architecture',
    'DevOps & Systems',
    'Data Science & Analytics',
    'Enterprise Solution',
    'Identity Design',
    'Website Design',
    ...initialProjects.map((p) => p.category).filter(Boolean),
  ])
);

const defaultBlogCategories = Array.from(
  new Set([
    'Engineering Architecture',
    'UI/UX Design',
    'Backend Development',
    'Product Strategy',
    'Tutorials & Insights',
    ...initialBlogs.map((b) => b.category).filter(Boolean),
  ])
);

export let dbStore: DBStore = {
  projects: [...initialProjects],
  blogs: [...initialBlogs],
  experience: [...initialExperience],
  education: [...initialEducation],
  skills: [...initialSkills],
  profile: [{ ...initialProfile }],
  messages: [],
  categories: [...defaultCategories],
  blogCategories: [...defaultBlogCategories],
  mongoUri: process.env.MONGODB_URI || '',
};

export function loadJsonStore(): void {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (parsed.projects && Array.isArray(parsed.projects)) dbStore.projects = parsed.projects;
      if (parsed.blogs && Array.isArray(parsed.blogs)) dbStore.blogs = parsed.blogs;
      if (parsed.experience && Array.isArray(parsed.experience)) dbStore.experience = parsed.experience;
      if (parsed.education && Array.isArray(parsed.education)) dbStore.education = parsed.education;
      if (parsed.skills && Array.isArray(parsed.skills)) dbStore.skills = parsed.skills;
      if (parsed.profile && Array.isArray(parsed.profile)) dbStore.profile = parsed.profile;
      if (parsed.messages && Array.isArray(parsed.messages)) dbStore.messages = parsed.messages;
      if (parsed.categories && Array.isArray(parsed.categories)) {
        dbStore.categories = Array.from(new Set([...defaultCategories, ...parsed.categories]));
      } else {
        dbStore.categories = [...defaultCategories];
      }
      if (parsed.blogCategories && Array.isArray(parsed.blogCategories)) {
        dbStore.blogCategories = Array.from(new Set([...defaultBlogCategories, ...parsed.blogCategories]));
      } else {
        dbStore.blogCategories = [...defaultBlogCategories];
      }
      if (parsed.mongoUri) dbStore.mongoUri = parsed.mongoUri;
      logger.info('Loaded local portfolio database successfully.');
    } else {
      saveJsonStore();
    }
  } catch (err: any) {
    logger.error('Failed to load local portfolio JSON store', err);
  }
}

export function saveJsonStore(): void {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(dbStore, null, 2), 'utf-8');
  } catch (err: any) {
    logger.error('Failed to save local portfolio JSON store', err);
  }
}

export function resetJsonStore(): void {
  dbStore.projects = [...initialProjects];
  dbStore.blogs = [...initialBlogs];
  dbStore.experience = [...initialExperience];
  dbStore.education = [...initialEducation];
  dbStore.skills = [...initialSkills];
  dbStore.profile = [{ ...initialProfile }];
  saveJsonStore();
}
