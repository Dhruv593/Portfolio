import React, { useState } from 'react';
import { Shield, Lock, ArrowRight, AlertCircle, KeyRound } from 'lucide-react';
import { portfolioApi } from '../../../api/portfolioApi';

interface AdminAuthModalProps {
  isOpen: boolean;
  onSuccess: () => void;
  onCancel: () => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onSuccess,
  onCancel,
}) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await portfolioApi.adminLogin(password);
      const token = res.data?.token || res.token;

      if (res.success && token) {
        localStorage.setItem('admin_auth_token', token);
        sessionStorage.setItem('admin_auth_token', token);
        setPassword('');
        onSuccess();
      } else {
        setError(res.error || 'Invalid passcode.');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 sm:p-8 border border-slate-200 text-center space-y-6">
        <div className="w-16 h-16 bg-blue-50 text-[#0058be] rounded-2xl mx-auto flex items-center justify-center ring-8 ring-blue-50/50">
          <Shield className="w-8 h-8 text-[#2170e4]" />
        </div>

        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-[#151c27]">
            Admin Dashboard Access
          </h2>
          <p className="text-xs sm:text-sm text-[#424754]">
            This area is restricted. Please enter the admin authentication passcode.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-[#0058be]" />
              Passcode
            </label>
            <div className="relative">
              <input
                type="password"
                required
                autoFocus
                placeholder="Enter passcode..."
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                className="w-full px-4 py-3 bg-[#f0f3ff] border border-slate-200 rounded-xl text-sm outline-hidden focus:ring-2 focus:ring-[#2170e4] font-mono tracking-widest text-[#151c27]"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-xs font-semibold text-red-600 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-3 px-4 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-2 py-3 px-5 rounded-xl text-xs font-semibold bg-[#2170e4] hover:bg-[#0058be] text-white shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Unlock Admin</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
