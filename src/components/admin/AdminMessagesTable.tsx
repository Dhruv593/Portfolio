import React, { useState, useEffect } from 'react';
import { Mail, Trash2, CheckCircle2, Clock, Search, RefreshCw, User, MessageSquare } from 'lucide-react';
import { ContactMessage } from '../../types';

interface AdminMessagesTableProps {
  onRefresh?: () => void;
}

export const AdminMessagesTable: React.FC<AdminMessagesTableProps> = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedMsg, setSelectedMsg] = useState<ContactMessage | null>(null);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/contact');
      const data = await res.json();
      if (res.ok && data.success) {
        setMessages(data.messages || []);
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this contact message?')) return;
    try {
      const res = await fetch(`/api/contact/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMessages((prev) => prev.filter((m) => m.id !== id));
        if (selectedMsg?.id === id) setSelectedMsg(null);
      }
    } catch (err) {
      console.error('Error deleting message:', err);
    }
  };

  const handleToggleRead = async (id: string) => {
    try {
      const res = await fetch(`/api/contact/${id}/read`, { method: 'PATCH' });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, read: data.data.read } : m))
        );
        if (selectedMsg?.id === id) {
          setSelectedMsg((prev) => prev ? { ...prev, read: data.data.read } : null);
        }
      }
    } catch (err) {
      console.error('Error marking message read status:', err);
    }
  };

  const filteredMessages = messages.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold tracking-tight text-[#151c27]">
              Received Contact Inquiries
            </h2>
            <span className="bg-blue-50 text-blue-700 text-[10px] px-2.5 py-0.5 rounded-md font-bold uppercase tracking-wider">
              {messages.length} Messages
            </span>
          </div>
          <p className="text-slate-500 text-xs mt-1 font-medium">
            Messages submitted from your public portfolio contact form saved in database.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search messages..."
              className="w-full pl-9 pr-3 py-2.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl text-xs outline-hidden focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-medium transition-all"
            />
          </div>

          <button
            onClick={fetchMessages}
            className="p-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
            title="Refresh messages"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Messages Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Messages List Column */}
        <div className={`lg:col-span-6 space-y-3 ${selectedMsg ? 'hidden lg:block' : 'block'}`}>
          {loading ? (
            <div className="p-12 text-center text-slate-400 text-xs font-bold uppercase tracking-wider">Loading messages...</div>
          ) : filteredMessages.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200/80 text-slate-500 space-y-2 shadow-3xs">
              <MessageSquare className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">No messages found in database.</p>
              <p className="text-xs text-slate-400">When visitors send inquiries from the contact form, they will appear here.</p>
            </div>
          ) : (
            filteredMessages.map((msg) => {
              const isSelected = selectedMsg?.id === msg.id;
              return (
                <div
                  key={msg.id}
                  onClick={() => setSelectedMsg(msg)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
                    isSelected
                      ? 'bg-blue-50/50 border-blue-300 shadow-3xs'
                      : !msg.read
                      ? 'bg-white border-blue-200/80 shadow-3xs font-medium'
                      : 'bg-white/60 border-slate-200/80 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-1.5">
                    <div className="flex items-center gap-2">
                      {!msg.read && <span className="w-1.5 h-1.5 rounded-full bg-[#0058be] shrink-0" />}
                      <span className="text-sm font-bold text-[#151c27] line-clamp-1">{msg.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider shrink-0">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-xs font-bold text-[#0058be] line-clamp-1 mb-1">{msg.subject}</p>
                  <p className="text-xs text-slate-500 line-clamp-2 text-justify font-medium">{msg.message}</p>
                </div>
              );
            })
          )}
        </div>

        {/* Selected Message Detail Column */}
        <div className={`lg:col-span-6 ${selectedMsg ? 'block' : 'hidden lg:block'}`}>
          {selectedMsg ? (
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-3xs space-y-6 sticky top-6">
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-[#151c27] leading-tight">{selectedMsg.subject}</h3>
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{new Date(selectedMsg.createdAt).toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleToggleRead(selectedMsg.id)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer border transition-colors ${
                      selectedMsg.read
                        ? 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                        : 'bg-blue-50 text-[#0058be] border-blue-200 hover:bg-blue-100'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{selectedMsg.read ? 'Unread' : 'Read'}</span>
                  </button>

                  <button
                    onClick={() => handleDelete(selectedMsg.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete message"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Sender Details */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100/70 space-y-2">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-slate-400">Sender Name:</span>
                  <span className="font-bold text-slate-800 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-[#0058be]" />
                    {selectedMsg.name}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-slate-400">Email Address:</span>
                  <a
                    href={`mailto:${selectedMsg.email}`}
                    className="font-bold text-[#0058be] hover:text-blue-600 transition-colors"
                  >
                    {selectedMsg.email}
                  </a>
                </div>
              </div>

              {/* Message Body */}
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Message Content:</p>
                <div className="p-4 bg-slate-50 hover:bg-slate-100/30 rounded-xl border border-slate-200/80 text-xs text-slate-600 leading-relaxed whitespace-pre-wrap text-justify font-medium">
                  {selectedMsg.message}
                </div>
              </div>

              {/* Quick Reply Button */}
              <a
                href={`mailto:${selectedMsg.email}?subject=Re: ${encodeURIComponent(selectedMsg.subject)}`}
                className="w-full py-2.5 bg-[#0058be] hover:bg-[#2170e4] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <Mail className="w-4 h-4" />
                <span>Reply via Email ({selectedMsg.email})</span>
              </a>
            </div>
          ) : (
            <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-12 text-center text-slate-400 text-xs flex flex-col items-center justify-center h-64 space-y-2">
              <Mail className="w-8 h-8 text-slate-300" />
              <p className="font-medium text-slate-400">Select a message from the list to view its complete content and sender details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
