import {
  Project,
  BlogPost,
  ExperienceItem,
  EducationItem,
  SkillCategory,
  ProfileData,
  MongoConfig,
  DashboardStats,
  ContactMessage,
} from '../../src/types.js';

export type ProjectDoc = Project;
export type BlogDoc = BlogPost;
export type ExperienceItemDoc = ExperienceItem;
export type EducationItemDoc = EducationItem;
export type SkillCategoryDoc = SkillCategory;
export type ProfileDataDoc = ProfileData;
export type ContactMessageDoc = ContactMessage;

export interface DBStore {
  projects: Project[];
  blogs: BlogPost[];
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: SkillCategory[];
  profile: ProfileData[];
  messages: ContactMessage[];
  categories?: string[];
  blogCategories?: string[];
  mongoUri?: string;
}

export type { MongoConfig, DashboardStats };
