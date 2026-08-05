import React, { useState } from 'react';
import { Mail, MapPin, Send, CheckCircle2, Copy, Check, Github, Linkedin, FileText } from 'lucide-react';
import { ProfileData } from '../../types';
import { useContactForm } from '../../hooks/useContactForm';

interface ContactSectionProps {
  profile: ProfileData;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ profile }) => {
  const [copied, setCopied] = useState(false);
  const {
    contactName,
    setContactName,
    contactEmail,
    setContactEmail,
    contactSubject,
    setContactSubject,
    contactMessage,
    setContactMessage,
    isSubmittingContact,
    contactSuccess,
    submitContactForm,
  } = useContactForm();

  const handleCopyEmail = () => {
    if (profile.email) {
      navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section id="contact" className="pt-10 sm:pt-12 pb-20 sm:pb-24 max-w-6xl mx-auto px-6 sm:px-8 lg:px-10 space-y-12 scroll-mt-20">
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#0058be] text-xs font-bold uppercase tracking-wider">
          Get in Touch
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#151c27]">
          Let's Build Something Together
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        {/* Left Side: Contact Information Card */}
        <div className="lg:col-span-2 bg-[#0058be] text-white rounded-3xl p-8 shadow-xl space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-3 relative z-10">
            <h3 className="text-2xl font-bold">Contact Information</h3>
            <p className="text-blue-100 text-xs sm:text-sm leading-relaxed">
              Fill out the inquiry form or reach out directly via email or social links.
            </p>
          </div>

          <div className="space-y-5 text-sm relative z-10">
            {profile.email && (
              <div className="flex items-center justify-between gap-3 p-3.5 bg-white/10 rounded-2xl border border-white/15">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-white" />
                  </div>
                  <div className="truncate">
                    <p className="text-[10px] text-blue-200 uppercase font-bold tracking-wider">Email</p>
                    <p className="font-semibold text-xs sm:text-sm truncate">{profile.email}</p>
                  </div>
                </div>

                <button
                  onClick={handleCopyEmail}
                  className="p-2 hover:bg-white/20 rounded-xl transition-colors shrink-0 cursor-pointer"
                  title="Copy email"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4 text-white" />}
                </button>
              </div>
            )}

            {profile.location && (
              <div className="flex items-center gap-3 p-3.5 bg-white/10 rounded-2xl border border-white/15">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-[10px] text-blue-200 uppercase font-bold tracking-wider">Location</p>
                  <p className="font-semibold text-xs sm:text-sm">{profile.location}</p>
                </div>
              </div>
            )}
          </div>

          {/* Social Links */}
          <div className="pt-4 border-t border-white/20 flex items-center gap-3 relative z-10">
            {profile.github && (
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white transition-all"
                title="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
            )}

            {profile.linkedin && (
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white transition-all"
                title="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            )}

            {profile.resumeUrl && (
              <a
                href={profile.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white transition-all"
                title="Resume"
              >
                <FileText className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        {/* Right Side: Contact Form */}
        <div className="lg:col-span-3 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs">
          {contactSuccess ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-[#151c27]">Message Sent Successfully!</h3>
              <p className="text-slate-600 text-sm max-w-md mx-auto">
                Thank you for reaching out. I have received your message and will get back to you shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={submitContactForm} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Alex Morgan"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0058be]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Your Email</label>
                  <input
                    type="email"
                    required
                    placeholder="alex@example.com"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0058be]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="Project Inquiry / Job Opportunity"
                  value={contactSubject}
                  onChange={(e) => setContactSubject(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0058be]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Message</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Hi, I'd like to discuss a project..."
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0058be] resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingContact}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#0058be] hover:bg-[#2170e4] text-white font-bold rounded-2xl shadow-md hover:shadow-lg transition-all cursor-pointer text-sm disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmittingContact ? 'Sending Message...' : 'Send Message'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
