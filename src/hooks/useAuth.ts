import { useState, useEffect, useCallback } from 'react';

export function useAuth(showToast?: (text: string, type?: 'success' | 'error' | 'info') => void) {
  const isInitialAdminPath =
    typeof window !== 'undefined' &&
    (window.location.pathname === '/admin' || window.location.hash === '#admin');

  // If page loads on a non-admin path, clear any stale admin auth token immediately
  if (typeof window !== 'undefined' && !isInitialAdminPath) {
    localStorage.removeItem('admin_auth_token');
    sessionStorage.removeItem('admin_auth_token');
  }

  const [viewMode, setViewMode] = useState<'admin' | 'public'>(isInitialAdminPath ? 'admin' : 'public');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    if (!isInitialAdminPath) return false;
    return Boolean(localStorage.getItem('admin_auth_token') || sessionStorage.getItem('admin_auth_token'));
  });
  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState<boolean>(() => {
    return isInitialAdminPath && !Boolean(localStorage.getItem('admin_auth_token') || sessionStorage.getItem('admin_auth_token'));
  });

  // Synchronize URL location with viewMode & handle token lifetime
  useEffect(() => {
    const handleLocationChange = () => {
      const isAdminRoute = window.location.pathname === '/admin' || window.location.hash === '#admin';
      if (isAdminRoute) {
        setViewMode('admin');
        const token = localStorage.getItem('admin_auth_token') || sessionStorage.getItem('admin_auth_token');
        if (!token) {
          setIsAdminAuthenticated(false);
          setIsAdminAuthModalOpen(true);
        }
      } else {
        // Routing to public portfolio or non-admin route: ALWAYS clear auth token & reset auth state
        localStorage.removeItem('admin_auth_token');
        sessionStorage.removeItem('admin_auth_token');
        setIsAdminAuthenticated(false);
        setIsAdminAuthModalOpen(false);
        setViewMode('public');
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);

    if (viewMode === 'admin' && !isAdminAuthenticated) {
      setIsAdminAuthModalOpen(true);
    }

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, [viewMode, isAdminAuthenticated]);

  const handleSwitchToAdmin = useCallback(() => {
    if (window.location.pathname !== '/admin') {
      window.history.pushState({}, '', '/admin');
    }
    setViewMode('admin');
    const token = localStorage.getItem('admin_auth_token') || sessionStorage.getItem('admin_auth_token');
    if (!token) {
      setIsAdminAuthenticated(false);
      setIsAdminAuthModalOpen(true);
    }
  }, []);

  const handleSwitchToPublic = useCallback(() => {
    if (window.location.pathname !== '/') {
      window.history.pushState({}, '', '/');
    }
    // Clear admin auth token completely when routing to portfolio
    localStorage.removeItem('admin_auth_token');
    sessionStorage.removeItem('admin_auth_token');
    sessionStorage.removeItem('portfolio_admin_tab');
    setIsAdminAuthenticated(false);
    setIsAdminAuthModalOpen(false);
    setViewMode('public');
  }, []);

  const handleAuthSuccess = useCallback(() => {
    setIsAdminAuthenticated(true);
    setIsAdminAuthModalOpen(false);
    showToast?.('Admin Authentication Successful!', 'success');
  }, [showToast]);

  const handleAuthCancel = useCallback(() => {
    setIsAdminAuthModalOpen(false);
    handleSwitchToPublic();
  }, [handleSwitchToPublic]);

  const handleAdminLogout = useCallback(() => {
    localStorage.removeItem('admin_auth_token');
    sessionStorage.removeItem('admin_auth_token');
    setIsAdminAuthenticated(false);
    setIsAdminAuthModalOpen(false);
    showToast?.('Admin console locked.', 'info');
    handleSwitchToPublic();
  }, [showToast, handleSwitchToPublic]);

  return {
    viewMode,
    isAdminAuthenticated,
    isAdminAuthModalOpen,
    handleSwitchToAdmin,
    handleSwitchToPublic,
    handleAuthSuccess,
    handleAuthCancel,
    handleAdminLogout,
  };
}
