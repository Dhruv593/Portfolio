export type ProjectStatus = 'Published' | 'Draft';
export type BlogStatus = 'Published' | 'Draft';

export interface Project {
  id: string;
  name: string;
  category: string;
  status: ProjectStatus;
  dateAdded: string;
  image: string;
  imagePosition?: string;
  imageFit?: 'cover' | 'contain' | 'fill';
  imageScale?: number;
  description: string;
  longDescription?: string;
  githubUrl?: string;
  liveUrl?: string;
  tags: string[];
  featured?: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  status: BlogStatus;
  dateAdded: string;
  readTime: string;
  image: string;
  imagePosition?: string;
  imageFit?: 'cover' | 'contain' | 'fill';
  imageScale?: number;
  excerpt: string;
  content: string;
  tags: string[];
  author?: string;
  featured?: boolean;
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  isCurrent?: boolean;
  description: string;
  location?: string;
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  period: string;
  location?: string;
  description?: string;
  gpaOrHonors?: string;
}

export interface SkillCategory {
  id: string;
  category: string;
  iconName: string;
  skills: string[];
}

export interface ProfileData {
  name: string;
  title: string;
  subtitle: string;
  avatarUrl: string;
  avatarPosition?: string;
  avatarFit?: 'cover' | 'contain' | 'fill';
  avatarScale?: number;
  bioParagraph1: string;
  bioParagraph2: string;
  email: string;
  location: string;
  github: string;
  linkedin: string;
  dribbble?: string;
  resumeUrl?: string;
  yearsExperience: number;
}

export interface DashboardStats {
  totalProjects: number;
  liveViewers: string;
  recentActivity: string;
  publishedCount: number;
  draftCount: number;
}

export interface MongoConfig {
  connected: boolean;
  uri?: string;
  dbName?: string;
  error?: string;
  lastSynced?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  read?: boolean;
}
