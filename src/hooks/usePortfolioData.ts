import { useState, useEffect, useCallback } from 'react';
import { portfolioApi } from '../api/portfolioApi';
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
import {
  initialProjects,
  initialBlogs,
  initialExperience,
  initialEducation,
  initialSkills,
  initialProfile,
} from '../data/initialData';
import { AdminTab } from '../components/admin/AdminSidebar';

export function usePortfolioData(showToast: (text: string, type?: 'success' | 'error' | 'info') => void) {
  const [adminTab, setAdminTabState] = useState<AdminTab>(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('portfolio_admin_tab') as AdminTab;
      if (
        saved &&
        ['overview', 'projects', 'blogs', 'experience', 'skills', 'education', 'profile', 'messages'].includes(saved)
      ) {
        return saved;
      }
    }
    return 'overview';
  });

  const setAdminTab = useCallback((tab: AdminTab) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('portfolio_admin_tab', tab);
    }
    setAdminTabState(tab);
  }, []);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProjectsCount, setTotalProjectsCount] = useState(0);

  // Data States
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [categories, setCategories] = useState<string[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>(initialBlogs);
  const [blogCategories, setBlogCategories] = useState<string[]>([]);
  const [experience, setExperience] = useState<ExperienceItem[]>(initialExperience);
  const [education, setEducation] = useState<EducationItem[]>(initialEducation);
  const [skills, setSkills] = useState<SkillCategory[]>(initialSkills);
  const [profile, setProfile] = useState<ProfileData>(initialProfile);
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 24,
    liveViewers: '1.2k',
    recentActivity: '+4',
    publishedCount: 18,
    draftCount: 6,
  });

  const [mongoConfig, setMongoConfig] = useState<MongoConfig>({
    connected: false,
    dbName: 'portfolio_admin',
  });

  // UI Modals
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [isMongoModalOpen, setIsMongoModalOpen] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Loaders
  const loadProjects = useCallback(async () => {
    try {
      const res = await portfolioApi.getProjects({
        search: searchQuery,
        status: statusFilter,
        page: currentPage,
        limit: 10,
      });
      const projectList = res.projects || res.data || [];
      const pages = res.totalPages || res.meta?.totalPages || 1;
      const totalCount = res.total || res.meta?.total || projectList.length;

      setProjects(projectList);
      setTotalPages(pages);
      setTotalProjectsCount(totalCount);
    } catch {
      // Fallback local state if network drops
    }
  }, [searchQuery, statusFilter, currentPage]);

  const loadBlogs = useCallback(async () => {
    try {
      const res = await portfolioApi.getBlogs();
      const blogList = res.blogs || res.data || [];
      if (blogList && blogList.length > 0) {
        setBlogs(blogList);
      }
    } catch {}
  }, []);

  const loadExperience = useCallback(async () => {
    try {
      const res = await portfolioApi.getExperience();
      const expList = res.experience || res.data?.experience;
      if (expList) setExperience(expList);
    } catch {}
  }, []);

  const loadEducation = useCallback(async () => {
    try {
      const res = await portfolioApi.getEducation();
      const eduList = res.education || res.data?.education;
      if (eduList) setEducation(eduList);
    } catch {}
  }, []);

  const loadSkills = useCallback(async () => {
    try {
      const res = await portfolioApi.getSkills();
      const skillsList = res.skills || res.data?.skills;
      if (skillsList) setSkills(skillsList);
    } catch {}
  }, []);

  const loadProfile = useCallback(async () => {
    try {
      const res = await portfolioApi.getProfile();
      const prof = res.profile || res.data?.profile;
      if (prof) setProfile(prof);
    } catch {}
  }, []);

  const loadStats = useCallback(async () => {
    try {
      const res = await portfolioApi.getStats();
      if (res) setStats(res.data || res);
    } catch {}
  }, []);

  const loadCategories = useCallback(async () => {
    try {
      const res = await portfolioApi.getCategories();
      const catList = res.categories || res.data?.categories || [];
      if (catList && catList.length > 0) {
        setCategories(catList);
      }
    } catch {}
  }, []);

  const handleAddCategory = async (categoryName: string) => {
    try {
      const res = await portfolioApi.createCategory(categoryName);
      const catList = res.categories || res.data?.categories || [];
      if (catList && catList.length > 0) {
        setCategories(catList);
      } else {
        loadCategories();
      }
    } catch {
      loadCategories();
    }
  };

  const loadBlogCategories = useCallback(async () => {
    try {
      const res = await portfolioApi.getBlogCategories();
      const catList = res.categories || res.data?.categories || [];
      if (catList && catList.length > 0) {
        setBlogCategories(catList);
      }
    } catch {}
  }, []);

  const handleAddBlogCategory = async (categoryName: string) => {
    try {
      const res = await portfolioApi.createBlogCategory(categoryName);
      const catList = res.categories || res.data?.categories || [];
      if (catList && catList.length > 0) {
        setBlogCategories(catList);
      } else {
        loadBlogCategories();
      }
    } catch {
      loadBlogCategories();
    }
  };

  const loadMongoStatus = useCallback(async () => {
    try {
      const res = await portfolioApi.getMongoStatus();
      if (res) setMongoConfig(res);
    } catch {}
  }, []);

  // Initial Data Synchronization
  useEffect(() => {
    loadProjects();
    loadCategories();
    loadBlogs();
    loadBlogCategories();
    loadExperience();
    loadEducation();
    loadSkills();
    loadProfile();
    loadStats();
    loadMongoStatus();
  }, [loadProjects, loadCategories, loadBlogs, loadBlogCategories, loadExperience, loadEducation, loadSkills, loadProfile, loadStats, loadMongoStatus]);

  // Blog Handlers
  const handleOpenAddBlog = () => {
    setEditingBlog(null);
    setIsBlogModalOpen(true);
  };

  const handleOpenEditBlog = (blog: BlogPost) => {
    setEditingBlog(blog);
    setIsBlogModalOpen(true);
  };

  const handleSaveBlog = async (blogData: Partial<BlogPost>) => {
    try {
      if (editingBlog && editingBlog.id) {
        await portfolioApi.updateBlog(editingBlog.id, blogData);
        showToast('Blog article updated successfully!');
      } else {
        await portfolioApi.createBlog(blogData);
        showToast('New blog article published!');
      }
      loadBlogs();
      loadBlogCategories();
    } catch {
      showToast('Error saving blog article', 'error');
    }
  };

  const handleDeleteBlog = async (blogId: string) => {
    if (!confirm('Are you sure you want to delete this blog article?')) return;
    try {
      await portfolioApi.deleteBlog(blogId);
      showToast('Blog article deleted', 'info');
      loadBlogs();
    } catch {
      showToast('Error deleting blog article', 'error');
    }
  };

  const handleToggleBlogStatus = async (blog: BlogPost) => {
    const newStatus = blog.status === 'Published' ? 'Draft' : 'Published';
    try {
      await portfolioApi.updateBlog(blog.id, { status: newStatus });
      showToast(`Article status changed to ${newStatus}`);
      loadBlogs();
    } catch {
      showToast('Failed to change article status', 'error');
    }
  };

  // Project Handlers
  const handleOpenAddProject = () => {
    setEditingProject(null);
    setIsProjectModalOpen(true);
  };

  const handleOpenEditProject = (project: Project) => {
    setEditingProject(project);
    setIsProjectModalOpen(true);
  };

  const handleSaveProject = async (projectData: Partial<Project>) => {
    try {
      if (projectData.id) {
        await portfolioApi.updateProject(projectData.id, projectData);
        showToast('Project updated successfully!');
      } else {
        await portfolioApi.createProject(projectData);
        showToast('New project added to portfolio!');
      }
      loadProjects();
      loadCategories();
      loadStats();
    } catch {
      showToast('Error saving project', 'error');
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      await portfolioApi.deleteProject(projectId);
      showToast('Project deleted', 'info');
      loadProjects();
      loadStats();
    } catch {
      showToast('Error deleting project', 'error');
    }
  };

  const handleToggleStatus = async (project: Project) => {
    const newStatus = project.status === 'Published' ? 'Draft' : 'Published';
    try {
      await portfolioApi.updateProject(project.id, { status: newStatus });
      showToast(`Project status changed to ${newStatus}`);
      loadProjects();
      loadStats();
    } catch {
      showToast('Failed to change status', 'error');
    }
  };

  // Experience Handlers
  const handleAddExperience = async (item: Partial<ExperienceItem>) => {
    try {
      await portfolioApi.createExperience(item);
      showToast('Work position added');
      loadExperience();
    } catch {}
  };

  const handleUpdateExperience = async (id: string, item: Partial<ExperienceItem>) => {
    try {
      await portfolioApi.updateExperience(id, item);
      showToast('Experience updated');
      loadExperience();
    } catch {}
  };

  const handleDeleteExperience = async (id: string) => {
    try {
      await portfolioApi.deleteExperience(id);
      showToast('Experience item removed', 'info');
      loadExperience();
    } catch {
      setExperience((prev) => prev.filter((item) => item.id !== id));
      showToast('Experience item removed', 'info');
    }
  };

  // Education Handlers
  const handleAddEducation = async (item: Partial<EducationItem>) => {
    try {
      await portfolioApi.createEducation(item);
      showToast('Education record added');
      loadEducation();
    } catch {
      const newItem: EducationItem = {
        id: `edu-${Date.now()}`,
        degree: item.degree || 'Degree',
        institution: item.institution || 'University',
        period: item.period || '2018 — 2022',
        location: item.location || '',
        description: item.description || '',
        gpaOrHonors: item.gpaOrHonors || '',
      };
      setEducation((prev) => [newItem, ...prev]);
      showToast('Education record added');
    }
  };

  const handleUpdateEducation = async (id: string, updated: Partial<EducationItem>) => {
    try {
      await portfolioApi.updateEducation(id, updated);
      showToast('Education record updated');
      loadEducation();
    } catch {
      setEducation((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...updated } : item))
      );
      showToast('Education record updated');
    }
  };

  const handleDeleteEducation = async (id: string) => {
    try {
      await portfolioApi.deleteEducation(id);
      showToast('Education record removed', 'info');
      loadEducation();
    } catch {
      setEducation((prev) => prev.filter((item) => item.id !== id));
      showToast('Education record removed', 'info');
    }
  };

  // Skills Handlers
  const handleAddSkillCategory = async (cat: Partial<SkillCategory>) => {
    try {
      await portfolioApi.createSkillCategory(cat);
      showToast('Skill category created');
      loadSkills();
    } catch {}
  };

  const handleUpdateSkillCategory = async (id: string, cat: Partial<SkillCategory>) => {
    try {
      await portfolioApi.updateSkillCategory(id, cat);
      showToast('Skills updated');
      loadSkills();
    } catch {}
  };

  const handleDeleteSkillCategory = async (id: string) => {
    try {
      await portfolioApi.deleteSkillCategory(id);
      showToast('Skill category removed', 'info');
      loadSkills();
    } catch {}
  };

  // Profile Handler
  const handleUpdateProfile = async (updated: Partial<ProfileData>) => {
    try {
      await portfolioApi.updateProfile(updated);
      showToast('Profile saved successfully');
      loadProfile();
    } catch {
      showToast('Failed to update profile', 'error');
    }
  };

  // Mongo Handlers
  const handleConnectMongo = async (uri: string) => {
    try {
      const res = await portfolioApi.configMongo(uri);
      if (!res.success) {
        throw new Error(res.error || 'Connection failed');
      }
      showToast('MongoDB connected and synced!');
      loadMongoStatus();
      loadProjects();
      loadExperience();
      loadEducation();
      loadSkills();
      loadProfile();
    } catch (err: any) {
      throw new Error(err.message || 'Connection failed');
    }
  };

  const handleResetSeedData = async () => {
    try {
      const res = await portfolioApi.seedData();
      if (res.success) {
        showToast('Portfolio data reset to initial defaults');
        loadProjects();
        loadExperience();
        loadEducation();
        loadSkills();
        loadProfile();
        loadStats();
      }
    } catch {
      showToast('Failed to reset portfolio data', 'error');
    }
  };

  return {
    adminTab,
    setAdminTab,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    currentPage,
    setCurrentPage,
    totalPages,
    totalProjectsCount,
    projects,
    categories,
    loadCategories,
    handleAddCategory,
    blogs,
    blogCategories,
    loadBlogCategories,
    handleAddBlogCategory,
    experience,
    education,
    skills,
    profile,
    stats,
    mongoConfig,
    isProjectModalOpen,
    setIsProjectModalOpen,
    editingProject,
    isBlogModalOpen,
    setIsBlogModalOpen,
    editingBlog,
    isMongoModalOpen,
    setIsMongoModalOpen,
    isPublishModalOpen,
    setIsPublishModalOpen,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
    handleOpenAddBlog,
    handleOpenEditBlog,
    handleSaveBlog,
    handleDeleteBlog,
    handleToggleBlogStatus,
    handleOpenAddProject,
    handleOpenEditProject,
    handleSaveProject,
    handleDeleteProject,
    handleToggleStatus,
    handleAddExperience,
    handleUpdateExperience,
    handleDeleteExperience,
    handleAddEducation,
    handleUpdateEducation,
    handleDeleteEducation,
    handleAddSkillCategory,
    handleUpdateSkillCategory,
    handleDeleteSkillCategory,
    handleUpdateProfile,
    handleConnectMongo,
    handleResetSeedData,
  };
}
