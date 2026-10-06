import { z } from 'zod';

export const adminLoginSchema = z.object({
  body: z.object({
    password: z.string().min(1, 'Password is required').max(256),
  }),
});

export const categorySchema = z.object({
  body: z.object({ name: z.string().trim().min(1).max(80) }),
});

export const createProjectSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Project name is required'),
    category: z.string().default('General'),
    status: z.enum(['Published', 'Draft']).default('Published'),
    dateAdded: z.string().optional(),
    image: z.string().optional(),
    imagePosition: z.string().optional(),
    imageFit: z.enum(['cover', 'contain', 'fill']).optional(),
    imageScale: z.number().min(1).optional(),
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
    imagePosition: z.string().optional(),
    imageFit: z.enum(['cover', 'contain', 'fill']).optional(),
    imageScale: z.number().min(1).optional(),
    description: z.string().optional(),
    longDescription: z.string().optional(),
    githubUrl: z.string().optional(),
    liveUrl: z.string().optional(),
    tags: z.union([z.array(z.string()), z.string()]).optional(),
    featured: z.boolean().optional(),
  }),
});

export const projectPositionSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({ position: z.number().int().min(1) }),
});

export const mongoConfigSchema = z.object({
  body: z.object({
    uri: z.string().min(1, 'MongoDB connection string is required').max(2048).refine((value) => /^mongodb(\+srv)?:\/\//.test(value), 'Invalid MongoDB URI'),
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
export const updateExperienceSchema = z.object({ body: experienceSchema.shape.body.partial() });

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
export const updateEducationSchema = z.object({ body: educationSchema.shape.body.partial() });

export const skillCategorySchema = z.object({
  body: z.object({
    category: z.string().min(1, 'Category name is required'),
    iconName: z.string().optional(),
    skills: z.array(z.string()).default([]),
  }),
});
export const updateSkillCategorySchema = z.object({ body: skillCategorySchema.shape.body.partial() });

export const profileSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    title: z.string().optional(),
    subtitle: z.string().optional(),
    avatarUrl: z.string().optional(),
    avatarPosition: z.string().optional(),
    avatarFit: z.enum(['cover', 'contain', 'fill']).optional(),
    avatarScale: z.number().min(1).optional(),
    location: z.string().optional(),
    email: z.string().optional(),
    github: z.string().optional(),
    linkedin: z.string().optional(),
    dribbble: z.string().optional(),
    resumeUrl: z.string().optional(),
    yearsExperience: z.number().min(0).optional(),
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
      sectionVisibility: z.object({
        hero: z.boolean().optional(),
        about: z.boolean().optional(),
        experience: z.boolean().optional(),
        projects: z.boolean().optional(),
        skills: z.boolean().optional(),
        education: z.boolean().optional(),
        blog: z.boolean().optional(),
        contact: z.boolean().optional(),
      }).optional(),
  }),
});

export const createBlogSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    slug: z.string().optional(),
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
    slug: z.string().optional(),
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
