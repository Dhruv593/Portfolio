import { apiClient } from './apiClient';
import {
  Project,
  BlogPost,
  ExperienceItem,
  EducationItem,
  SkillCategory,
  ProfileData,
  DashboardStats,
  MongoConfig,
} from '../types';

export const portfolioApi = {
  // Projects API
  getCategories: async () => {
    return apiClient.get<{ categories?: string[]; data?: { categories: string[] } }>('/projects/categories');
  },

  createCategory: async (name: string) => {
    return apiClient.post<{ categories?: string[]; data?: { categories: string[] } }>('/projects/categories', { name });
  },

  getProjects: async (params?: { search?: string; status?: string; page?: number; limit?: number }) => {
    return apiClient.get<{
      projects?: Project[];
      data?: Project[];
      total?: number;
      page?: number;
      limit?: number;
      totalPages?: number;
      meta?: { total: number; page: number; limit: number; totalPages: number };
    }>('/projects', { params });
  },

  createProject: async (project: Partial<Project>) => {
    return apiClient.post<{ success: boolean; project?: Project; data?: { project: Project } }>('/projects', project);
  },

  updateProject: async (id: string, project: Partial<Project>) => {
    return apiClient.put<{ success: boolean; project?: Project; data?: { project: Project } }>(`/projects/${id}`, project);
  },

  deleteProject: async (id: string) => {
    return apiClient.delete<{ success: boolean; message?: string }>(`/projects/${id}`);
  },

  // Blogs API
  getBlogCategories: async () => {
    return apiClient.get<{ categories?: string[]; data?: { categories: string[] } }>('/blogs/categories');
  },

  createBlogCategory: async (name: string) => {
    return apiClient.post<{ categories?: string[]; data?: { categories: string[] } }>('/blogs/categories', { name });
  },

  getBlogs: async (params?: { search?: string; status?: string; page?: number; limit?: number }) => {
    return apiClient.get<{
      blogs?: BlogPost[];
      data?: BlogPost[];
      total?: number;
      page?: number;
      limit?: number;
      totalPages?: number;
      meta?: { total: number; page: number; limit: number; totalPages: number };
    }>('/blogs', { params });
  },

  getBlogById: async (idOrSlug: string) => {
    return apiClient.get<{ blog?: BlogPost; data?: BlogPost }>(`/blogs/${idOrSlug}`);
  },

  createBlog: async (blog: Partial<BlogPost>) => {
    return apiClient.post<{ success: boolean; blog?: BlogPost; data?: { blog: BlogPost } }>('/blogs', blog);
  },

  updateBlog: async (id: string, blog: Partial<BlogPost>) => {
    return apiClient.put<{ success: boolean; blog?: BlogPost; data?: { blog: BlogPost } }>(`/blogs/${id}`, blog);
  },

  deleteBlog: async (id: string) => {
    return apiClient.delete<{ success: boolean; message?: string }>(`/blogs/${id}`);
  },

  // Experience API
  getExperience: async () => {
    return apiClient.get<{ experience?: ExperienceItem[]; data?: { experience: ExperienceItem[] } }>('/experience');
  },

  createExperience: async (exp: Partial<ExperienceItem>) => {
    return apiClient.post<{ success: boolean; experience?: ExperienceItem; data?: { experience: ExperienceItem } }>('/experience', exp);
  },

  updateExperience: async (id: string, exp: Partial<ExperienceItem>) => {
    return apiClient.put<{ success: boolean; experience?: ExperienceItem; data?: { experience: ExperienceItem } }>(`/experience/${id}`, exp);
  },

  deleteExperience: async (id: string) => {
    return apiClient.delete<{ success: boolean }>(`/experience/${id}`);
  },

  // Education API
  getEducation: async () => {
    return apiClient.get<{ education?: EducationItem[]; data?: { education: EducationItem[] } }>('/education');
  },

  createEducation: async (edu: Partial<EducationItem>) => {
    return apiClient.post<{ success: boolean; education?: EducationItem; data?: { education: EducationItem } }>('/education', edu);
  },

  updateEducation: async (id: string, edu: Partial<EducationItem>) => {
    return apiClient.put<{ success: boolean; education?: EducationItem; data?: { education: EducationItem } }>(`/education/${id}`, edu);
  },

  deleteEducation: async (id: string) => {
    return apiClient.delete<{ success: boolean }>(`/education/${id}`);
  },

  // Skills API
  getSkills: async () => {
    return apiClient.get<{ skills?: SkillCategory[]; data?: { skills: SkillCategory[] } }>('/skills');
  },

  createSkillCategory: async (skillCat: Partial<SkillCategory>) => {
    return apiClient.post<{ success: boolean; skillCategory?: SkillCategory; data?: { skillCategory: SkillCategory } }>('/skills', skillCat);
  },

  updateSkillCategory: async (id: string, skillCat: Partial<SkillCategory>) => {
    return apiClient.put<{ success: boolean; skillCategory?: SkillCategory; data?: { skillCategory: SkillCategory } }>(`/skills/${id}`, skillCat);
  },

  deleteSkillCategory: async (id: string) => {
    return apiClient.delete<{ success: boolean }>(`/skills/${id}`);
  },

  // Profile API
  getProfile: async () => {
    return apiClient.get<{ profile?: ProfileData; data?: { profile: ProfileData } }>('/profile');
  },

  updateProfile: async (profile: Partial<ProfileData>) => {
    return apiClient.put<{ success: boolean; profile?: ProfileData; data?: { profile: ProfileData } }>('/profile', profile);
  },

  // Admin & Stats API
  adminLogin: async (password: string) => {
    return apiClient.post<{ success: boolean; token?: string; data?: { token: string }; error?: string }>('/admin/login', { password });
  },

  getStats: async () => {
    return apiClient.get<DashboardStats & { data?: DashboardStats }>('/admin/stats');
  },

  getMongoStatus: async () => {
    return apiClient.get<MongoConfig>('/admin/mongodb/status');
  },

  configMongo: async (uri: string) => {
    return apiClient.post<{ success: boolean; message?: string; error?: string }>('/admin/mongodb/config', { uri });
  },

  seedData: async () => {
    return apiClient.post<{ success: boolean; message?: string }>('/admin/seed');
  },

  // Health API
  getHealthStatus: async () => {
    return apiClient.get<{ status: string; uptime: number; database: { status: string; uri: string } }>('/health');
  },
};
