import { useState, useEffect } from 'react';
import { Menu, X, Sparkles, Send, ArrowRight, Palette } from 'lucide-react';
import { THEME_CONFIGS } from '../data/portfolioData';
import { usePortfolio } from '../context/PortfolioContext';
import { ColorTheme, ThemeConfig } from '../types';

interface NavbarProps {
  activeSection: string;
  currentTheme?: ColorTheme;
  onThemeChange?: (theme: ColorTheme) => void;
}

export default function Navbar({ activeSection, currentTheme = 'violet', onThemeChange }: NavbarProps) {
  const {
    personalInfo: PERSONAL_INFO,
    navItems: NAV_ITEMS
  } = usePortfolio();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showThemePicker, setShowThemePicker] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    setShowThemePicker(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const activeThemeObj = THEME_CONFIGS[currentTheme] || THEME_CONFIGS.violet;

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#07090e]/90 backdrop-blur-xl border-b border-white/[0.08] shadow-xl shadow-black/40 py-3.5'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('#hero');
            }}
            id="brand-logo-link"
            className="group flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 rounded-lg p-1"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-400 p-[1.5px] transition-transform duration-300 group-hover:scale-105 shadow-md shadow-violet-500/25">
              <div className="w-full h-full bg-[#0d121f] rounded-[10px] flex items-center justify-center">
                <span className="font-extrabold text-white text-base tracking-tight">S</span>
              </div>
            </div>
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg text-white tracking-tight group-hover:text-violet-300 transition-colors">
                  {PERSONAL_INFO.name}
                </span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-violet-500/15 text-violet-300 border border-violet-500/25">
                  AI Pro
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium hidden sm:block">
                Digital Marketing & AI
              </span>
            </div>
          </a>

          {/* Zone 2: 4-6 clean text navigation links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2" aria-label="Main Navigation">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.href);
                  }}
                  className={`relative px-3.5 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'text-white bg-white/[0.08] shadow-inner font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-300 rounded-full shadow-[0_0_8px_rgba(139,92,246,0.6)]" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Zone 3: 1-2 primary actions + Direct Theme Palette Selector */}
          <div className="hidden md:flex items-center gap-2.5 lg:gap-3">
            {/* Direct Visible Color Combination Switcher */}
            {onThemeChange && (
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-slate-900/80 border border-white/[0.12] shadow-inner backdrop-blur-md">
                <span className="text-[11px] text-slate-300 font-semibold px-1.5 flex items-center gap-1">
                  <Palette className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="hidden xl:inline text-[11px]">Theme:</span>
                </span>
                {Object.values(THEME_CONFIGS).map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => onThemeChange(t.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
                      currentTheme === t.id
                        ? 'bg-white/20 text-white shadow-md ring-1 ring-white/40 scale-105'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.08]'
                    }`}
                    title={`Switch to ${t.name}`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full shadow-xs ring-1 ring-white/30"
                      style={{ backgroundColor: t.primaryColor }}
                    />
                    <span className="text-[11px] hidden lg:inline">{t.name.split(' ')[1] || t.name}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Let's Talk CTA */}
            <a
              id="nav-cta-contact-btn"
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('#contact');
              }}
              className={`group inline-flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded-lg bg-gradient-to-r ${activeThemeObj.buttonGradient} hover:brightness-110 text-white shadow-md transition-all duration-200 active:scale-95 cursor-pointer`}
            >
              <span>Let's Talk</span>
              <Send className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>

            {/* Admin Portal Direct Link */}
            <a
              href="/admin"
              className="px-2.5 py-1.5 text-xs font-medium text-slate-400 hover:text-white rounded-lg hover:bg-white/[0.06] transition-colors border border-transparent hover:border-white/[0.08]"
              title="Open Admin Portal"
            >
              Admin
            </a>
          </div>

          {/* Mobile Hamburger Button & Theme Swatch */}
          <div className="flex md:hidden items-center gap-2">
            {onThemeChange && (
              <button
                type="button"
                onClick={() => {
                  const themes: ColorTheme[] = ['violet', 'emerald', 'rose', 'ocean', 'amber'];
                  const nextIdx = (themes.indexOf(currentTheme) + 1) % themes.length;
                  onThemeChange(themes[nextIdx]);
                }}
                className="p-2 rounded-lg bg-white/[0.05] border border-white/[0.08] text-slate-300"
                title="Cycle Color Scheme"
                aria-label="Cycle Color Scheme"
              >
                <div
                  className="w-3.5 h-3.5 rounded-full"
                  style={{ backgroundColor: activeThemeObj.primaryColor }}
                />
              </button>
            )}

            <button
              id="mobile-menu-toggle-btn"
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/[0.08] focus:outline-none focus:ring-2 focus:ring-violet-500"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-violet-400" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-drawer-menu"
          className="md:hidden bg-[#07090e]/95 border-b border-white/[0.08] backdrop-blur-2xl px-4 pt-3 pb-6 space-y-3 mt-2 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-200"
        >
          <div className="py-2 space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  id={`mobile-nav-link-${item.id}`}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.href);
                  }}
                  className={`flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'text-white bg-violet-600/20 border border-violet-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  <span>{item.label}</span>
                  <ArrowRight className={`w-4 h-4 ${isActive ? 'text-violet-400' : 'text-slate-500'}`} />
                </a>
              );
            })}
          </div>

          {/* Mobile Theme Selector */}
          {onThemeChange && (
            <div className="pt-2 border-t border-white/[0.08]">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Color Palette Theme
              </span>
              <div className="grid grid-cols-2 gap-2">
                {Object.values(THEME_CONFIGS).map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      onThemeChange(t.id);
                    }}
                    className={`flex items-center gap-2 p-2 rounded-lg text-xs font-medium border ${
                      currentTheme === t.id
                        ? 'bg-white/[0.12] border-white/20 text-white'
                        : 'bg-white/[0.03] border-white/[0.06] text-slate-400'
                    }`}
                  >
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: t.primaryColor }}
                    />
                    <span className="truncate">{t.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="pt-2 border-t border-white/[0.08] flex flex-col gap-2">
            <a
              id="mobile-contact-cta"
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('#contact');
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-md active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>Contact Sakshi</span>
            </a>
            <a
              href="/admin"
              className="w-full text-center py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white bg-white/[0.03] border border-white/[0.06]"
            >
              Admin Portal Login →
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
