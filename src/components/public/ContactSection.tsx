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
    <section id="contact" className="pt-12 pb-20 sm:py-20 max-w-6xl mx-auto px-6 sm:px-8 lg:px-10 space-y-8 sm:space-y-12 scroll-mt-20">
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#151c27]">
          Let's Build Something Together
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-10 items-start">
        {/* Right Side: Contact Form */}
        <div className="lg:col-start-3 lg:row-start-1 lg:col-span-3 rounded-2xl bg-white p-0 sm:p-7 sm:border sm:border-slate-200">
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
                  <label htmlFor="contact-name" className="text-sm font-medium text-slate-700">Your Name</label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    placeholder="Alex Morgan"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-base text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0058be]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="contact-email" className="text-sm font-medium text-slate-700">Your Email</label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    placeholder="alex@example.com"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-base text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0058be]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="contact-subject" className="text-sm font-medium text-slate-700">Subject</label>
                <input
                  id="contact-subject"
                  type="text"
                  required
                  placeholder="Project Inquiry / Job Opportunity"
                  value={contactSubject}
                  onChange={(e) => setContactSubject(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-base text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0058be]"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="contact-message" className="text-sm font-medium text-slate-700">Message</label>
                <textarea
                  id="contact-message"
                  rows={4}
                  required
                  placeholder="Hi, I'd like to discuss a project..."
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-base text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0058be] resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingContact}
                className="w-full inline-flex min-h-12 items-center justify-center gap-2 px-6 py-3 bg-[#0058be] hover:bg-[#2170e4] text-white font-semibold rounded-xl transition-colors cursor-pointer text-base disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmittingContact ? 'Sending Message...' : 'Send Message'}</span>
              </button>
            </form>
          )}
        </div>
        {/* Contact details follow the form on narrow screens. */}
        <div className="lg:col-start-1 lg:row-start-1 lg:col-span-2 rounded-2xl bg-slate-50 p-5 sm:p-7 space-y-5">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-[#151c27]">Contact Information</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Fill out the inquiry form or reach out directly via email or social links.
            </p>
          </div>

          <div className="space-y-4 text-sm">
            {profile.email && (
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <Mail className="w-5 h-5 text-slate-500 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm text-slate-500">Email</p>
                    <p className="font-medium text-sm text-slate-800 break-all">{profile.email}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="w-11 h-11 flex items-center justify-center hover:bg-slate-200 rounded-xl transition-colors shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#0058be]"
                  aria-label={copied ? 'Email copied' : 'Copy email'}
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-700" /> : <Copy className="w-4 h-4 text-slate-600" />}
                </button>
              </div>
            )}

            {profile.location && (
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-slate-500 shrink-0" />
                <div>
                  <p className="text-sm text-slate-500">Location</p>
                  <p className="font-medium text-sm text-slate-800">{profile.location}</p>
                </div>
              </div>
            )}
          </div>

          {/* Social Links */}
          <div className="pt-4 border-t border-slate-200 flex items-center gap-2">
            {profile.github && (
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-xl hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
            )}

            {profile.linkedin && (
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-xl hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            )}

            {profile.resumeUrl && (
              <a
                href={profile.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-xl hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors"
                aria-label="Resume"
              >
                <FileText className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};
