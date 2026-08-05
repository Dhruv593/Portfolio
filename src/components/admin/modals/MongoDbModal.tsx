import React, { useState } from 'react';
import { X, Database, CheckCircle2, AlertCircle, RefreshCw, KeyRound, Sparkles } from 'lucide-react';
import { MongoConfig } from '../../../types';

interface MongoDbModalProps {
  isOpen: boolean;
  onClose: () => void;
  mongoConfig: MongoConfig;
  onConnectMongo: (uri: string) => Promise<void>;
  onResetSeedData: () => Promise<void>;
}

export const MongoDbModal: React.FC<MongoDbModalProps> = ({
  isOpen,
  onClose,
  mongoConfig,
  onConnectMongo,
  onResetSeedData,
}) => {
  const [uriInput, setUriInput] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uriInput.trim()) return;
    setIsConnecting(true);
    setErrorMsg('');
    try {
      await onConnectMongo(uriInput.trim());
      setUriInput('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to connect to MongoDB');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleReset = async () => {
    if (!confirm('Are you sure you want to reset all portfolio data to default sample projects?')) return;
    setIsResetting(true);
    try {
      await onResetSeedData();
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200">
        <div className="bg-[#151c27] text-white p-6 flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">MongoDB Database</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Data store configuration & status
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Status Badge */}
          <div className="p-4 rounded-xl border bg-slate-50 flex items-start gap-3">
            {mongoConfig.connected ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div className="space-y-1">
              <p className="text-sm font-semibold text-[#151c27]">
                {mongoConfig.connected
                  ? 'Active MongoDB Connection'
                  : 'Operating on Local Database'}
              </p>
              <p className="text-xs text-slate-600 leading-relaxed">
                {mongoConfig.connected
                  ? `Connected to database: portfolio_admin. Changes saved from the Admin Console will persist directly to your MongoDB cluster.`
                  : 'Currently storing projects in local persistent JSON storage. You can set MONGODB_URI in your .env file or enter your connection string below to sync live.'}
              </p>
              {mongoConfig.error && (
                <p className="text-xs font-semibold text-red-600 pt-1">
                  Error: {mongoConfig.error}
                </p>
              )}
            </div>
          </div>

          {/* Connect Form */}
          <form onSubmit={handleConnect} className="space-y-3">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-[#0058be]" />
              MongoDB Connection String
            </label>
            <input
              type="text"
              required
              placeholder="mongodb+srv://user:password@cluster.mongodb.net/portfolio"
              value={uriInput}
              onChange={(e) => setUriInput(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#f0f3ff] border border-slate-200 rounded-xl text-sm outline-hidden focus:ring-2 focus:ring-[#2170e4] font-mono text-xs"
            />
            {errorMsg && (
              <p className="text-xs text-red-600 font-medium">{errorMsg}</p>
            )}
            <button
              type="submit"
              disabled={isConnecting}
              className="w-full py-2.5 bg-[#0058be] hover:bg-blue-700 text-white font-semibold rounded-xl text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isConnecting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Testing & Connecting...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Connect & Sync MongoDB
                </>
              )}
            </button>
          </form>

          {/* Reset Action */}
          <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between">
            <div className="text-xs text-slate-500">
              Need to restore original demo projects?
            </div>
            <button
              type="button"
              onClick={handleReset}
              disabled={isResetting}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer transition-colors"
            >
              {isResetting ? 'Resetting...' : 'Reset Sample Data'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
