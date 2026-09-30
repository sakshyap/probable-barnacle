import { ArrowUp, Sparkles, Linkedin, Instagram, Github, Mail } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { ThemeConfig } from '../types';

interface FooterProps {
  theme?: ThemeConfig;
}

export default function Footer({ theme }: FooterProps) {
  const {
    personalInfo: PERSONAL_INFO,
    socials: SOCIAL_LINKS,
    navItems: NAV_ITEMS
  } = usePortfolio();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  const currentYear = new Date().getFullYear();

  return (
    <footer id="main-footer" className="bg-[#05070c] border-t border-white/[0.08] pt-16 pb-12 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-white/[0.08]">
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-400 p-[1.5px]">
                <div className="w-full h-full bg-[#0d121f] rounded-[6.5px] flex items-center justify-center">
                  <span className="font-extrabold text-white text-xs">S</span>
                </div>
              </div>
              <span className="font-bold text-lg text-white tracking-tight">{PERSONAL_INFO.name}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/25">
                AI Specialist
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-sm leading-relaxed">
              Digital Marketing with AI Specialist. Crafting modern web architectures, interactive canvas games, and automated content using next-gen generative AI tools.
            </p>
          </div>

          {/* Quick Navigation Links */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Navigation
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  className="hover:text-cyan-300 transition-colors py-1 flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                  <span>{item.label}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Connect / Socials */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Social Links
            </h4>
            <div className="flex items-center gap-2">
              {SOCIAL_LINKS.map((link) => (
                <a
                  key={link.platform}
                  id={`footer-social-${link.platform.toLowerCase()}`}
                  href={link.url}
                  target={link.url.startsWith('mailto:') ? '_self' : '_blank'}
                  rel="noreferrer noopener"
                  className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-violet-500/50 text-slate-400 hover:text-white transition-all hover:scale-105"
                  aria-label={link.label}
                  title={link.label}
                >
                  {getSocialIcon(link.iconName)}
                </a>
              ))}
            </div>
            <p className="text-[11px] text-slate-500 pt-1">
              Direct: <span className="text-slate-300 font-mono">sakshikashyap6857@gmail.com</span>
            </p>
          </div>
        </div>

        {/* Bottom row: copyright & back to top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-slate-500">
            <span>© {currentYear} {PERSONAL_INFO.name}. All rights reserved.</span>
            <span className="hidden sm:inline">·</span>
            <span className="hidden sm:inline">Digital Marketing with AI</span>
            <span>·</span>
            <a href="/admin" className="text-slate-500 hover:text-violet-300 transition-colors underline decoration-slate-700 underline-offset-4">
              Admin Portal
            </a>
          </div>

          <button
            onClick={scrollToTop}
            id="back-to-top-btn"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] hover:border-violet-500/40 text-slate-400 hover:text-violet-300 transition-colors cursor-pointer"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
