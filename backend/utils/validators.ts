import { z } from 'zod';

export const adminLoginSchema = z.object({
  body: z.object({
    password: z.string().min(1, 'Password is required'),
  }),
});

export const createProjectSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Project name is required'),
    category: z.string().default('General'),
    status: z.enum(['Published', 'Draft']).default('Published'),
    dateAdded: z.string().optional(),
    image: z.string().optional(),
    description: z.string().optional(),
    longDescription: z.string().optional(),
    githubUrl: z.string().optional(),
    liveUrl: z.string().optional(),
    tags: z.union([z.array(z.string()), z.string()]).optional(),
    featured: z.boolean().optional(),
  }),
});

export const updateProjectSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
  body: z.object({
    name: z.string().optional(),
    category: z.string().optional(),
    status: z.enum(['Published', 'Draft']).optional(),
    image: z.string().optional(),
    description: z.string().optional(),
    longDescription: z.string().optional(),
    githubUrl: z.string().optional(),
    liveUrl: z.string().optional(),
    tags: z.union([z.array(z.string()), z.string()]).optional(),
    featured: z.boolean().optional(),
  }),
});

export const mongoConfigSchema = z.object({
  body: z.object({
    uri: z.string().min(1, 'MongoDB connection string is required'),
  }),
});

export const experienceSchema = z.object({
  body: z.object({
    role: z.string().min(1, 'Role is required'),
    company: z.string().min(1, 'Company is required'),
    period: z.string().min(1, 'Period is required'),
    isCurrent: z.boolean().optional(),
    location: z.string().optional(),
    description: z.string().optional(),
  }),
});

export const educationSchema = z.object({
  body: z.object({
    degree: z.string().min(1, 'Degree is required'),
    institution: z.string().min(1, 'Institution is required'),
    period: z.string().optional(),
    description: z.string().optional(),
    location: z.string().optional(),
    gpaOrHonors: z.string().optional(),
  }),
});

export const skillCategorySchema = z.object({
  body: z.object({
    category: z.string().min(1, 'Category name is required'),
    iconName: z.string().optional(),
    skills: z.array(z.string()).default([]),
  }),
});

export const profileSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    title: z.string().optional(),
    location: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
    status: z.string().optional(),
    bioParagraph1: z.string().optional(),
    bioParagraph2: z.string().optional(),
    avatar: z.string().optional(),
    githubUrl: z.string().optional(),
    linkedinUrl: z.string().optional(),
    twitterUrl: z.string().optional(),
    skillsList: z.string().optional(),
    statsProjects: z.string().optional(),
    statsPositions: z.string().optional(),
    statsQuality: z.string().optional(),
    resumeFileName: z.string().optional(),
  }),
});

export const createBlogSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    category: z.string().default('General'),
    status: z.enum(['Published', 'Draft']).default('Published'),
    dateAdded: z.string().optional(),
    readTime: z.string().optional(),
    image: z.string().optional(),
    excerpt: z.string().optional(),
    content: z.string().optional(),
    tags: z.union([z.array(z.string()), z.string()]).optional(),
    author: z.string().optional(),
    featured: z.boolean().optional(),
  }),
});

export const updateBlogSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
  body: z.object({
    title: z.string().optional(),
    category: z.string().optional(),
    status: z.enum(['Published', 'Draft']).optional(),
    dateAdded: z.string().optional(),
    readTime: z.string().optional(),
    image: z.string().optional(),
    excerpt: z.string().optional(),
    content: z.string().optional(),
    tags: z.union([z.array(z.string()), z.string()]).optional(),
    author: z.string().optional(),
    featured: z.boolean().optional(),
  }),
});
