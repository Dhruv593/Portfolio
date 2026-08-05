import React from 'react';
import { AdminSidebar } from './components/admin/AdminSidebar';
import { AdminTopBar } from './components/admin/AdminTopBar';
import { AdminOverview } from './components/admin/AdminOverview';
import { AdminProjectsTable } from './components/admin/AdminProjectsTable';
import { AdminBlogsTable } from './components/admin/AdminBlogsTable';
import { ProjectModal } from './components/admin/modals/ProjectModal';
import { BlogModal } from './components/admin/modals/BlogModal';
import { ExperienceManager } from './components/admin/ExperienceManager';
import { EducationManager } from './components/admin/EducationManager';
import { SkillsManager } from './components/admin/SkillsManager';
import { ProfileManager } from './components/admin/ProfileManager';
import { AdminMessagesTable } from './components/admin/AdminMessagesTable';
import { MongoDbModal } from './components/admin/modals/MongoDbModal';
import { PublishModal } from './components/admin/modals/PublishModal';
import { AdminAuthModal } from './components/admin/modals/AdminAuthModal';
import { PublicPortfolioNav } from './components/PublicPortfolioNav';
import { PublicPortfolioView } from './components/PublicPortfolioView';
import { Toast } from './components/Toast';
import { useToast } from './hooks/useToast';
import { useAuth } from './hooks/useAuth';
import { usePortfolioData } from './hooks/usePortfolioData';

export default function App() {
  const { toast, showToast, hideToast } = useToast();

  const {
    viewMode,
    isAdminAuthModalOpen,
    handleSwitchToAdmin,
    handleSwitchToPublic,
    handleAuthSuccess,
    handleAuthCancel,
    handleAdminLogout,
  } = useAuth(showToast);

  const {
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
    handleAddCategory,
    blogs,
    blogCategories,
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
  } = usePortfolioData(showToast);

  return (
    <div className="min-h-screen bg-[#f9f9ff] text-[#151c27]">
      {/* Toast Notification Banner */}
      <Toast toast={toast} onClose={hideToast} />

      {viewMode === 'public' ? (
        // --- PUBLIC PORTFOLIO VIEW ---
        <div className="min-h-screen flex flex-col">
          <PublicPortfolioNav profile={profile} />
          <main className="flex-1">
            <PublicPortfolioView
              projects={projects}
              blogs={blogs}
              experience={experience}
              education={education}
              skills={skills}
              profile={profile}
              onSwitchToAdmin={handleSwitchToAdmin}
            />
          </main>
        </div>
      ) : (
        // --- ADMIN CONSOLE VIEW ---
        <div className="min-h-screen flex flex-col md:flex-row">
          {/* Admin Sidebar */}
          <AdminSidebar
            activeTab={adminTab}
            setActiveTab={setAdminTab}
            onPublishClick={() => setIsPublishModalOpen(true)}
            onSwitchToPublic={handleSwitchToPublic}
            isMobileOpen={isMobileSidebarOpen}
            setIsMobileOpen={setIsMobileSidebarOpen}
          />

          {/* Main Content Area */}
          <div className="flex-1 lg:ml-64 flex flex-col min-h-screen bg-[#f8fafc]">
            <AdminTopBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              mongoConfig={mongoConfig}
              onOpenMongoModal={() => setIsMongoModalOpen(true)}
              onOpenSettingsModal={() => setIsMongoModalOpen(true)}
              onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
              onSwitchToPublic={handleSwitchToPublic}
              onLogout={handleAdminLogout}
              profile={profile}
            />

            <main className="flex-1 p-6 sm:p-8 max-w-7xl mx-auto w-full">
              {adminTab === 'overview' && (
                <AdminOverview
                  profile={profile}
                  projects={projects}
                  blogs={blogs}
                  experience={experience}
                  education={education}
                  skills={skills}
                  stats={stats}
                  mongoConfig={mongoConfig}
                  setActiveTab={setAdminTab}
                  onAddNewProject={handleOpenAddProject}
                  onAddBlog={handleOpenAddBlog}
                  onOpenMongoModal={() => setIsMongoModalOpen(true)}
                />
              )}

              {adminTab === 'projects' && (
                <AdminProjectsTable
                  projects={projects}
                  totalProjectsCount={totalProjectsCount}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  setCurrentPage={setCurrentPage}
                  stats={stats}
                  experience={experience}
                  onAddNewProject={handleOpenAddProject}
                  onEditProject={handleOpenEditProject}
                  onDeleteProject={handleDeleteProject}
                  onToggleStatus={handleToggleStatus}
                  onViewAllExperience={() => setAdminTab('experience')}
                  statusFilter={statusFilter}
                  setStatusFilter={setStatusFilter}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                />
              )}

              {adminTab === 'blogs' && (
                <AdminBlogsTable
                  blogs={blogs}
                  onAddBlog={handleOpenAddBlog}
                  onEditBlog={handleOpenEditBlog}
                  onDeleteBlog={handleDeleteBlog}
                  onToggleStatus={handleToggleBlogStatus}
                />
              )}

              {adminTab === 'experience' && (
                <ExperienceManager
                  experience={experience}
                  onAddExperience={handleAddExperience}
                  onUpdateExperience={handleUpdateExperience}
                  onDeleteExperience={handleDeleteExperience}
                />
              )}

              {adminTab === 'skills' && (
                <SkillsManager
                  skills={skills}
                  onAddSkillCategory={handleAddSkillCategory}
                  onUpdateSkillCategory={handleUpdateSkillCategory}
                  onDeleteSkillCategory={handleDeleteSkillCategory}
                />
              )}

              {adminTab === 'education' && (
                <EducationManager
                  education={education}
                  onAddEducation={handleAddEducation}
                  onUpdateEducation={handleUpdateEducation}
                  onDeleteEducation={handleDeleteEducation}
                />
              )}

              {adminTab === 'profile' && (
                <ProfileManager
                  profile={profile}
                  onUpdateProfile={handleUpdateProfile}
                />
              )}

              {adminTab === 'messages' && (
                <AdminMessagesTable />
              )}
            </main>

            {/* Footer */}
            <footer className="py-6 border-t border-slate-200 text-center text-xs text-slate-500">
              © {new Date().getFullYear()} Portfolio Admin Console • Built with Luminous Design System
            </footer>
          </div>
        </div>
      )}

      {/* Modals */}
      <AdminAuthModal
        isOpen={isAdminAuthModalOpen}
        onSuccess={handleAuthSuccess}
        onCancel={handleAuthCancel}
      />

      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        onSave={handleSaveProject}
        initialProject={editingProject}
        existingProjects={projects}
        categories={categories}
        onAddCategory={handleAddCategory}
      />

      <BlogModal
        isOpen={isBlogModalOpen}
        onClose={() => setIsBlogModalOpen(false)}
        onSave={handleSaveBlog}
        blogToEdit={editingBlog}
        existingBlogs={blogs}
        blogCategories={blogCategories}
        onAddCategory={handleAddBlogCategory}
      />

      <MongoDbModal
        isOpen={isMongoModalOpen}
        onClose={() => setIsMongoModalOpen(false)}
        mongoConfig={mongoConfig}
        onConnectMongo={handleConnectMongo}
        onResetSeedData={handleResetSeedData}
      />

      <PublishModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        onSwitchToPublic={handleSwitchToPublic}
        projectsCount={totalProjectsCount}
      />
    </div>
  );
}
