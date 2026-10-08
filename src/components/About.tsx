import { useState } from 'react';
import { Award, Rocket, CheckCircle2, User, Camera, ArrowRight, BrainCircuit, Sparkles } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { ThemeConfig } from '../types';
import defaultPhoto from '../assets/images/sakshi_hero_portrait_1790060105063.jpg';

interface AboutProps {
  onScrollTo: (sectionId: string) => void;
  theme?: ThemeConfig;
}

export default function About({ onScrollTo, theme }: AboutProps) {
  const { personalInfo: PERSONAL_INFO } = usePortfolio();

  // Allow an optional custom image URL or fallback to the elegant portrait
  const [customPhotoUrl, setCustomPhotoUrl] = useState<string | null>(defaultPhoto);
  const [isPhotoEditing, setIsPhotoEditing] = useState(false);
  const [tempUrlInput, setTempUrlInput] = useState('');

  const handleApplyPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempUrlInput.trim()) {
      setCustomPhotoUrl(tempUrlInput.trim());
    }
    setIsPhotoEditing(false);
  };

  const accentGradient = theme?.accentGradient || 'from-violet-400 via-fuchsia-400 to-cyan-300';

  return (
    <section id="about" className="py-24 relative overflow-hidden bg-[#0a0d16]">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.1] text-violet-300 text-xs font-semibold mb-3">
            <User className="w-3.5 h-3.5 text-violet-400" />
            <span>Profile & Background</span>
          </div>
          <h2
            id="about-section-heading"
            className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-4"
          >
            About <span className={`text-transparent bg-clip-text bg-gradient-to-r ${accentGradient}`}>Sakshi</span>
          </h2>
          <p className="text-slate-400 text-base leading-relaxed">
            Specializing at the intersection of modern digital marketing strategies and rapid generative AI engineering.
          </p>
        </div>

        {/* Main Grid: Photo Column + Bio */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Profile Photo Placeholder Column (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative group w-full max-w-sm">
              {/* Outer decorative glow frame */}
              <div className="absolute -inset-1.5 bg-gradient-to-tr from-violet-600 via-indigo-500 to-cyan-400 rounded-3xl blur-md opacity-35 group-hover:opacity-65 transition duration-500 pointer-events-none" />

              {/* Card Container */}
              <div className="relative rounded-2xl bg-[#0c101c]/90 border border-white/[0.1] p-6 flex flex-col items-center text-center shadow-2xl backdrop-blur-xl">
                {/* Photo / Avatar Box */}
                <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden bg-slate-900 border-2 border-white/[0.12] flex items-center justify-center shadow-inner group/photo">
                  {customPhotoUrl ? (
                    <img
                      src={customPhotoUrl}
                      alt="Sakshi Kashyap - Digital Marketing with AI Specialist portrait"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      className="w-full h-full object-cover object-top"
                      onError={() => setCustomPhotoUrl(null)}
                    />
                  ) : (
                    /* Default stylized avatar placeholder */
                    <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-violet-950/40 via-slate-900 to-cyan-950/30">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-violet-600 to-cyan-400 p-1 flex items-center justify-center mb-3 shadow-lg shadow-violet-600/30">
                        <div className="w-full h-full rounded-full bg-[#07090e] flex items-center justify-center">
                          <span className="text-3xl font-extrabold text-white tracking-wider">S</span>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-slate-200">Sakshi's Portrait</span>
                      <span className="text-[11px] text-violet-400 font-medium">Digital Marketing & AI</span>
                    </div>
                  )}

                  {/* Corner Tech Badge */}
                  <div className="absolute top-2.5 right-2.5 bg-[#07090e]/90 border border-cyan-500/40 px-2.5 py-0.5 rounded-full text-[10px] font-semibold text-cyan-300 flex items-center gap-1 backdrop-blur-sm">
                    <Sparkles className="w-2.5 h-2.5 text-cyan-400" />
                    <span>AI Specialist</span>
                  </div>

                  {/* Hover overlay to change/edit placeholder URL */}
                  <button
                    onClick={() => setIsPhotoEditing(!isPhotoEditing)}
                    className="absolute inset-0 bg-[#07090e]/85 backdrop-blur-xs opacity-0 group-hover/photo:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 text-slate-200 cursor-pointer"
                    title="Customize photo URL"
                    type="button"
                  >
                    <Camera className="w-5 h-5 text-violet-400" />
                    <span className="text-xs font-medium">Change Photo URL</span>
                  </button>
                </div>

                {/* Optional Photo URL Input form */}
                {isPhotoEditing && (
                  <form onSubmit={handleApplyPhoto} className="mt-4 w-full text-left space-y-2">
                    <label className="text-xs text-slate-300 block">Image URL / Link:</label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={tempUrlInput}
                        onChange={(e) => setTempUrlInput(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-violet-500"
                      />
                      <button
                        type="submit"
                        className="px-3 py-1 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-xs font-medium cursor-pointer"
                      >
                        Set
                      </button>
                    </div>
                  </form>
                )}

                {/* Sub-card details */}
                <div className="mt-5 text-center">
                  <h3 className="text-lg font-bold text-white tracking-tight">{PERSONAL_INFO.name}</h3>
                  <p className="text-xs text-violet-400 font-medium">{PERSONAL_INFO.title}</p>
                  <div className="mt-3 flex items-center justify-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium bg-white/[0.05] text-slate-300 border border-white/[0.08]">
                      <Award className="w-3 h-3 text-cyan-400" />
                      Course Certified
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium bg-white/[0.05] text-slate-300 border border-white/[0.08]">
                      <BrainCircuit className="w-3 h-3 text-violet-400" />
                      GenAI Builder
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bio and Background Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-bold text-cyan-400">
                <Rocket className="w-4 h-4" />
                <span>My Journey & Philosophy</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
                Empowering Brands & Products With Generative AI
              </h3>

              {/* Requirement: short bio explaining I completed a Digital Marketing with AI course and love building things using AI tools */}
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-slate-200 text-base leading-relaxed backdrop-blur-sm">
                <p className="mb-3 font-medium text-slate-100">
                  {PERSONAL_INFO.bioParagraph1}
                </p>
                <p className="text-slate-300 text-sm">
                  {PERSONAL_INFO.bioParagraph2}
                </p>
              </div>
            </div>

            {/* Key Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              <div className="p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] flex items-start gap-3 transition-colors">
                <div className="p-2 rounded-lg bg-violet-500/15 text-violet-400 shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Digital Marketing Certified</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Trained in AI campaign strategy, user acquisition, and conversion funnel optimization.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] flex items-start gap-3 transition-colors">
                <div className="p-2 rounded-lg bg-cyan-500/15 text-cyan-400 shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">AI-Assisted Web Dev</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Building responsive, aesthetic interfaces using rapid AI scaffolding workflows.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] flex items-start gap-3 transition-colors">
                <div className="p-2 rounded-lg bg-fuchsia-500/15 text-fuchsia-400 shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Interactive Game Dev</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Prompting AI models to build playable browser canvas physics, scoring, and arcade games.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] flex items-start gap-3 transition-colors">
                <div className="p-2 rounded-lg bg-emerald-500/15 text-emerald-400 shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">AI Video & Media Creation</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Producing generative video scenes, synthetic voice narration, and high-retention social assets.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Action */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => onScrollTo('skills')}
                className="inline-flex items-center gap-2 text-sm font-semibold text-violet-400 hover:text-violet-300 transition-colors group cursor-pointer"
              >
                <span>Explore my skills & AI tools</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
