import { useState } from 'react';
import {
  Mail,
  Send,
  CheckCircle,
  Copy,
  Linkedin,
  Instagram,
  Github,
  Sparkles,
  Globe,
  Clock,
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { ContactFormData, ThemeConfig } from '../types';

interface ContactProps {
  theme?: ThemeConfig;
}

export default function Contact({ theme }: ContactProps) {
  const {
    personalInfo: PERSONAL_INFO,
    socials: SOCIAL_LINKS
  } = usePortfolio();
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Submits to the server so the message lands in the admin inbox. If the API
   * is unreachable we fall back to opening the visitor's mail client, so an
   * inquiry is never silently lost.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    setErrorText('');

    try {
      const res = await fetch('/api/portfolio/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject || '',
          message: formData.message,
          // Honeypot - always empty for a real visitor.
          website: '',
        }),
      });

      if (!res.ok) throw new Error('send-failed');

      setIsSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setIsSuccess(false), 7000);
    } catch (err) {
      const subject = encodeURIComponent(
        formData.subject?.trim() || `Portfolio Inquiry from ${formData.name}`
      );
      const body = encodeURIComponent(
        `Hello Sakshi,\n\nName: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
      );
      window.location.href = `mailto:${PERSONAL_INFO.email}?subject=${subject}&body=${body}`;
      setErrorText('Could not reach the server, so your email app was opened instead.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 3000);
  };

  const getSocialIcon = (iconName: string) => {
    switch (iconName) {
      case 'Linkedin':
        return <Linkedin className="w-4 h-4" />;
      case 'Instagram':
        return <Instagram className="w-4 h-4" />;
      case 'Github':
        return <Github className="w-4 h-4" />;
      case 'Mail':
      default:
        return <Mail className="w-4 h-4" />;
    }
  };

  const accentGradient = theme?.accentGradient || 'from-violet-400 via-fuchsia-400 to-cyan-300';
  const buttonGradient = theme?.buttonGradient || 'from-violet-600 via-indigo-600 to-cyan-500';

  return (
    <section id="contact" className="py-24 relative overflow-hidden bg-[#07090e]">
      {/* Background radial highlights */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.1] text-violet-300 text-xs font-semibold mb-3">
            <Mail className="w-3.5 h-3.5 text-violet-400" />
            <span>Direct Inquiries</span>
          </div>
          <h2
            id="contact-section-heading"
            className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-4"
          >
            Contact Sakshi Kashyap
          </h2>
          <p className="text-slate-400 text-base leading-relaxed">
            Have a project in mind, need digital marketing assistance with AI, or looking to collaborate? Drop me a message below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Contact Info & Socials (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0c101c]/90 border border-white/[0.08] shadow-2xl space-y-6 backdrop-blur-xl">
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  Reach Out Directly
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
                  I'm actively looking for digital marketing roles, freelance AI web projects, and creative collaborations.
                </p>
              </div>

              {/* Email Card with Copy button */}
              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.1] flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="p-2.5 rounded-xl bg-violet-500/15 text-violet-400 shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="overflow-hidden">
                    <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">
                      Email Address
                    </span>
                    <a
                      href={`mailto:${PERSONAL_INFO.email}`}
                      className="text-xs sm:text-sm font-semibold text-slate-100 hover:text-cyan-300 transition-colors truncate block"
                    >
                      {PERSONAL_INFO.email}
                    </a>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="p-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0 border border-white/[0.08]"
                  title="Copy email to clipboard"
                >
                  {copiedEmail ? (
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Status & Availability */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-xs text-slate-300">
                  <div className="p-2.5 rounded-xl bg-cyan-500/15 text-cyan-400">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-white block">Location</span>
                    <span className="text-slate-400">{PERSONAL_INFO.location}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-300">
                  <div className="p-2.5 rounded-xl bg-violet-500/15 text-violet-400">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-white block">Response Time</span>
                    <span className="text-slate-400">Prompt / Within 24 Hours</span>
                  </div>
                </div>
              </div>

              {/* Social Profiles */}
              <div className="pt-4 border-t border-white/[0.08]">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-3">
                  Connect On Social Media
                </span>
                <div className="flex flex-wrap gap-2.5">
                  {SOCIAL_LINKS.map((link) => (
                    <a
                      key={link.platform}
                      href={link.url}
                      target={link.url.startsWith('mailto:') ? '_self' : '_blank'}
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-violet-500/50 text-slate-300 hover:text-white text-xs font-medium transition-all hover:scale-105"
                      aria-label={link.label}
                    >
                      {getSocialIcon(link.iconName)}
                      <span>{link.platform}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0c101c]/90 border border-white/[0.08] shadow-2xl backdrop-blur-xl">
              <h3 className="text-xl font-bold text-white tracking-tight mb-1 flex items-center gap-2">
                <span>Send a Message</span>
                <Sparkles className="w-4 h-4 text-violet-400" />
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mb-6">
                Fill in your details below and it will send directly to Sakshi's inbox.
              </p>

              {isSuccess && (
                <div
                  id="contact-form-success"
                  className="mb-6 p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs sm:text-sm flex items-start gap-3 animate-in fade-in"
                >
                  <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-emerald-100">Thank you for your message!</p>
                    <p className="text-emerald-300/90 mt-0.5">
                      It has been delivered straight to Sakshi's inbox. She will get back to you promptly!
                    </p>
                    {errorText && (
                      <p className="text-amber-300/90 mt-1.5">{errorText}</p>
                    )}
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name field */}
                  <div className="space-y-1.5 text-left">
                    <label
                      htmlFor="contact-name"
                      className="text-xs font-semibold text-slate-300 block"
                    >
                      Your Name <span className="text-violet-400">*</span>
                    </label>
                    <input
                      type="text"
                      id="contact-name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white placeholder-slate-500 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
                    />
                  </div>

                  {/* Email field */}
                  <div className="space-y-1.5 text-left">
                    <label
                      htmlFor="contact-email"
                      className="text-xs font-semibold text-slate-300 block"
                    >
                      Your Email <span className="text-violet-400">*</span>
                    </label>
                    <input
                      type="email"
                      id="contact-email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. rahul@example.com"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white placeholder-slate-500 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Subject field (optional) */}
                <div className="space-y-1.5 text-left">
                  <label
                    htmlFor="contact-subject"
                    className="text-xs font-semibold text-slate-300 block"
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    id="contact-subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="e.g. AI Marketing Campaign / Web Project Inquiry"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white placeholder-slate-500 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
                  />
                </div>

                {/* Message field */}
                <div className="space-y-1.5 text-left">
                  <label
                    htmlFor="contact-message"
                    className="text-xs font-semibold text-slate-300 block"
                  >
                    Message <span className="text-violet-400">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={5}
                    required
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell me about your project, goals, or inquiry..."
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white placeholder-slate-500 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  id="contact-form-submit-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm bg-gradient-to-r ${buttonGradient} hover:brightness-110 text-white shadow-xl shadow-violet-900/30 transition-all duration-300 active:scale-98 disabled:opacity-50 cursor-pointer`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Message to Sakshi</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
