import { useState } from 'react';
import {
  ArrowDown,
  Sparkles,
  FolderGit2,
  Mail,
  Linkedin,
  Instagram,
  Github,
  BrainCircuit,
  ArrowUpRight,
  Zap,
  Palette,
  Copy,
  Check,
  Award,
  TrendingUp,
} from 'lucide-react';
import { THEME_CONFIGS } from '../data/portfolioData';
import { usePortfolio } from '../context/PortfolioContext';
import { ColorTheme, ThemeConfig } from '../types';
import heroPortrait from '../assets/images/sakshi_hero_portrait_1790060105063.jpg';

interface HeroProps {
  onScrollTo: (sectionId: string) => void;
  theme?: ThemeConfig;
  currentTheme?: ColorTheme;
  onThemeChange?: (theme: ColorTheme) => void;
}

export default function Hero({
  onScrollTo,
  theme,
  currentTheme = 'violet',
  onThemeChange,
}: HeroProps) {
  const {
    personalInfo: PERSONAL_INFO,
    socials: SOCIAL_LINKS
  } = usePortfolio();

  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
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

  const activeTheme = theme || THEME_CONFIGS[currentTheme] || THEME_CONFIGS.violet;
  const accentGradient = activeTheme.accentGradient;
  const buttonGradient = activeTheme.buttonGradient;

  return (
    <section
      id="hero"
      className="relative min-h-[95vh] flex items-center justify-center pt-28 pb-16 overflow-hidden"
    >
      {/* Dynamic Ambient Background Illumination Matching Active Theme */}
      <div
        className="absolute top-1/4 left-1/10 w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none opacity-40 transition-colors duration-700 animate-pulse-glow"
        style={{ backgroundColor: activeTheme.primaryColor }}
      />
      <div
        className="absolute top-1/3 right-1/10 w-[550px] h-[550px] rounded-full blur-[150px] pointer-events-none opacity-30 transition-colors duration-700"
        style={{ backgroundColor: activeTheme.secondaryColor }}
      />
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-slate-800/20 rounded-full blur-[130px] pointer-events-none" />

      {/* Modern subtle dot-matrix background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff0d_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_45%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 w-full">
        {/* Main Side-by-Side: Left (Name & Details), Right (Portrait Picture) */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* LEFT SIDE: Name, Tagline, Bio, Email Box, Action Buttons (7 cols on sm+) */}
          <div className="sm:col-span-7 text-left space-y-5 lg:space-y-6 order-1">
            
            {/* Top Status & Certification Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-white/10 text-xs sm:text-sm font-medium shadow-xl backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
              <span className="text-slate-200 font-semibold tracking-wide">
                Digital Marketing with AI
              </span>
              <span className="text-slate-500">·</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Certified Specialist
              </span>
            </div>

            {/* Main Greeting & Name Heading */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-sm sm:text-base font-semibold tracking-widest uppercase">
                  Namaste, I am
                </span>
                <span
                  className="px-2.5 py-0.5 rounded-md text-[11px] font-bold tracking-wider uppercase border"
                  style={{
                    backgroundColor: `${activeTheme.primaryColor}22`,
                    borderColor: `${activeTheme.primaryColor}55`,
                    color: activeTheme.primaryColor,
                  }}
                >
                  Portfolio
                </span>
              </div>
              <h1
                id="hero-name-heading"
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-none"
              >
                <span className={`bg-gradient-to-r ${accentGradient} bg-clip-text text-transparent drop-shadow-[0_2px_20px_rgba(255,255,255,0.15)]`}>
                  {PERSONAL_INFO.name}
                </span>
              </h1>
            </div>

            {/* Tagline & Subheading */}
            <div className="space-y-2">
              <p
                id="hero-tagline"
                className="text-lg sm:text-xl md:text-2xl font-bold text-slate-100 tracking-tight"
              >
                {PERSONAL_INFO.title}
              </p>
              <div
                className={`h-1.5 w-32 bg-gradient-to-r ${accentGradient} rounded-full shadow-lg`}
              />
            </div>

            {/* Engaging Short Intro */}
            <p
              id="hero-short-intro"
              className="text-sm sm:text-base md:text-lg text-slate-300 font-normal leading-relaxed max-w-xl"
            >
              Combining modern marketing intelligence with generative AI to build high-converting campaigns, automated video content, responsive web platforms, and interactive digital experiences.
            </p>

            {/* Highlighted Official Email Pill with 1-Click Copy & Direct Mail */}
            <div className="pt-1">
              <div className="inline-flex flex-wrap items-center gap-2 p-1.5 sm:p-2 rounded-xl bg-slate-900/90 border border-white/15 backdrop-blur-md shadow-lg shadow-black/40">
                <div className="flex items-center gap-2 px-2.5 py-1 text-xs sm:text-sm font-mono text-slate-200">
                  <Mail className="w-4 h-4 text-cyan-400" />
                  <span className="font-semibold">{PERSONAL_INFO.email}</span>
                </div>
                <div className="flex items-center gap-1.5 ml-auto">
                  <button
                    onClick={handleCopyEmail}
                    type="button"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-colors cursor-pointer border border-white/10"
                    title="Copy Email to Clipboard"
                  >
                    {copiedEmail ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-bold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                  <a
                    href={`mailto:${PERSONAL_INFO.email}`}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-sm transition-all"
                  >
                    <span>Mail Now</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* Call to Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1">
              <button
                id="hero-cta-projects"
                onClick={() => onScrollTo('projects')}
                className={`group inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r ${buttonGradient} text-white shadow-xl hover:brightness-110 transition-all duration-300 active:scale-95 cursor-pointer`}
              >
                <FolderGit2 className="w-4 h-4 transition-transform group-hover:scale-110" />
                <span>Explore Projects & Games</span>
                <ArrowUpRight className="w-4 h-4 opacity-80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>

              <button
                id="hero-cta-contact"
                onClick={() => onScrollTo('contact')}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-sm bg-slate-800/90 hover:bg-slate-700/90 text-white border border-white/15 hover:border-white/30 shadow-md backdrop-blur-sm transition-all duration-300 active:scale-95 cursor-pointer"
              >
                <Mail className="w-4 h-4 text-cyan-400" />
                <span>Get in Touch</span>
              </button>
            </div>

            {/* Social Links Bar */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold mr-1">
                Connect:
              </span>
              <div className="flex items-center gap-2" aria-label="Social Profiles">
                {SOCIAL_LINKS.map((link) => (
                  <a
                    key={link.platform}
                    id={`hero-social-${link.platform.toLowerCase()}`}
                    href={link.url}
                    target={link.url.startsWith('mailto:') ? '_self' : '_blank'}
                    rel="noreferrer noopener"
                    className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-white/10 border border-white/10 hover:border-white/30 text-slate-300 hover:text-white transition-all duration-200 hover:scale-105"
                    aria-label={link.label}
                    title={link.label}
                  >
                    {getSocialIcon(link.iconName)}
                  </a>
                ))}
              </div>
            </div>

            {/* Interactive Color Palette Selector with All 5 Curated Themes */}
            {onThemeChange && (
              <div className="pt-4 border-t border-white/10">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="text-xs uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5 mr-1">
                    <Palette className="w-3.5 h-3.5 text-cyan-400" /> Theme Color:
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    {Object.values(THEME_CONFIGS).map((t) => {
                      const isSelected = currentTheme === t.id;
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => onThemeChange(t.id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                            isSelected
                              ? 'bg-white/20 text-white shadow-lg ring-2 ring-white/50 scale-105'
                              : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-white/10 border border-white/10'
                          }`}
                          title={`Select ${t.name} color palette`}
                        >
                          <span
                            className="w-2.5 h-2.5 rounded-full ring-1 ring-white/40 shadow-xs"
                            style={{ backgroundColor: t.primaryColor }}
                          />
                          <span>{t.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT SIDE: Portrait Picture with Stylish Glowing Glass Frame (5 cols on sm+) */}
          <div className="sm:col-span-5 flex justify-center order-2">
            <div className="relative w-full max-w-[340px] sm:max-w-md group">
              {/* Outer Radiant Glowing Ambient Halo */}
              <div
                className="absolute -inset-2 rounded-3xl blur-2xl opacity-60 group-hover:opacity-90 transition duration-700 pointer-events-none"
                style={{
                  background: `linear-gradient(135deg, ${activeTheme.primaryColor}88, ${activeTheme.secondaryColor}88)`,
                }}
              />

              {/* Picture Card Wrapper */}
              <div className="relative rounded-3xl bg-slate-900/90 border-2 border-white/15 p-3.5 sm:p-4 shadow-2xl backdrop-blur-2xl overflow-hidden">
                {/* Image Frame */}
                <div className="relative aspect-[4/4.5] w-full rounded-2xl overflow-hidden bg-slate-950 border border-white/15 shadow-inner">
                  <img
                    id="hero-profile-image"
                    src={heroPortrait}
                    alt="Sakshi - Digital Marketing with AI Specialist"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Gentle gradient overlay for cinematic depth */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

                  {/* Top Floating Badge: Sakshi · AI Specialist */}
                  <div className="absolute top-3 right-3 bg-slate-950/90 border border-cyan-400/40 px-3 py-1 rounded-full text-xs font-bold text-cyan-300 flex items-center gap-1.5 shadow-xl backdrop-blur-md">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                    <span>Sakshi · AI Specialist</span>
                  </div>

                  {/* Bottom Left Floating Badge: Ready for Projects */}
                  <div className="absolute bottom-3 left-3 bg-slate-950/90 border border-emerald-400/40 px-3 py-1 rounded-xl text-xs font-semibold text-emerald-300 flex items-center gap-2 shadow-xl backdrop-blur-md">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>Open to Projects</span>
                  </div>
                </div>

                {/* Micro Info Strip Below Picture */}
                <div className="mt-3 px-1 py-1 flex items-center justify-between text-xs text-slate-200">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center border"
                      style={{
                        backgroundColor: `${activeTheme.primaryColor}22`,
                        borderColor: `${activeTheme.primaryColor}55`,
                      }}
                    >
                      <BrainCircuit
                        className="w-4 h-4"
                        style={{ color: activeTheme.primaryColor }}
                      />
                    </div>
                    <div>
                      <div className="font-bold text-white text-xs">Sakshi</div>
                      <div className="text-[10px] text-slate-400">Digital Marketing & AI</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-mono text-cyan-300 font-bold bg-cyan-950/80 px-2.5 py-1 rounded-md border border-cyan-500/30">
                    <Award className="w-3 h-3 text-cyan-400" />
                    <span>Certified</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Feature Highlights Grid at Bottom of Hero */}
        <div className="mt-16 pt-8 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-5xl mx-auto">
          <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/60 hover:bg-slate-900/90 border border-white/10 backdrop-blur-md text-left transition-all hover:scale-[1.02]">
            <span className="text-[11px] text-cyan-400 font-bold uppercase tracking-wider block">Domain</span>
            <span className="text-xs sm:text-sm font-semibold text-white">AI Digital Marketing</span>
            <span className="text-[11px] text-slate-400 block mt-0.5">Campaigns & Growth</span>
          </div>

          <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/60 hover:bg-slate-900/90 border border-white/10 backdrop-blur-md text-left transition-all hover:scale-[1.02]">
            <span className="text-[11px] text-violet-400 font-bold uppercase tracking-wider block">Web & Games</span>
            <span className="text-xs sm:text-sm font-semibold text-white">Modern Dev Stack</span>
            <span className="text-[11px] text-slate-400 block mt-0.5">Canvas & Responsive</span>
          </div>

          <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/60 hover:bg-slate-900/90 border border-white/10 backdrop-blur-md text-left transition-all hover:scale-[1.02]">
            <span className="text-[11px] text-fuchsia-400 font-bold uppercase tracking-wider block">Creative Media</span>
            <span className="text-xs sm:text-sm font-semibold text-white">AI Video & Visuals</span>
            <span className="text-[11px] text-slate-400 block mt-0.5">Viral Reels & Audio</span>
          </div>

          <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/60 hover:bg-slate-900/90 border border-white/10 backdrop-blur-md text-left transition-all hover:scale-[1.02]">
            <span className="text-[11px] text-emerald-400 font-bold uppercase tracking-wider block">AI Powerhouse</span>
            <span className="text-xs sm:text-sm font-semibold text-white">ChatGPT · Gemini · Claude</span>
            <span className="text-[11px] text-slate-400 block mt-0.5">Prompt Engineering</span>
          </div>
        </div>

        {/* Scroll Down Indicator */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => onScrollTo('about')}
            className="p-2 text-slate-400 hover:text-white transition-colors cursor-pointer animate-bounce"
            aria-label="Scroll to About section"
          >
            <ArrowDown className="w-5 h-5" />
          </button>
        </div>

      </div>
    </section>
  );
}
