import { useState } from 'react';
import {
  Globe,
  Gamepad2,
  Video,
  Bot,
  Sparkles,
  Layout,
  Code,
  Palette,
  Cpu,
  Zap,
  Compass,
  Sliders,
  Film,
  Mic,
  Flame,
  Scissors,
  MessageSquare,
  Brain,
  Boxes,
  Workflow,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';
import { AI_VIDEO_SHOWCASE_IMG } from '../data/portfolioData';
import { usePortfolio } from '../context/PortfolioContext';
import { ThemeConfig } from '../types';

interface SkillsProps {
  theme?: ThemeConfig;
}

export default function Skills({ theme }: SkillsProps) {
  const { skillCategories: SKILL_CATEGORIES } = usePortfolio();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Globe':
        return <Globe className="w-5 h-5" />;
      case 'Gamepad2':
        return <Gamepad2 className="w-5 h-5" />;
      case 'Video':
        return <Video className="w-5 h-5" />;
      case 'Bot':
        return <Bot className="w-5 h-5" />;
      default:
        return <Sparkles className="w-5 h-5" />;
    }
  };

  const getItemIcon = (iconName: string) => {
    switch (iconName) {
      case 'Layout':
        return <Layout className="w-4 h-4 text-violet-400" />;
      case 'Code':
        return <Code className="w-4 h-4 text-violet-400" />;
      case 'Palette':
        return <Palette className="w-4 h-4 text-violet-400" />;
      case 'Cpu':
        return <Cpu className="w-4 h-4 text-cyan-400" />;
      case 'Zap':
        return <Zap className="w-4 h-4 text-cyan-400" />;
      case 'Compass':
        return <Compass className="w-4 h-4 text-cyan-400" />;
      case 'Sliders':
        return <Sliders className="w-4 h-4 text-cyan-400" />;
      case 'Film':
        return <Film className="w-4 h-4 text-fuchsia-400" />;
      case 'Mic':
        return <Mic className="w-4 h-4 text-fuchsia-400" />;
      case 'Flame':
        return <Flame className="w-4 h-4 text-fuchsia-400" />;
      case 'Scissors':
        return <Scissors className="w-4 h-4 text-fuchsia-400" />;
      case 'MessageSquare':
        return <MessageSquare className="w-4 h-4 text-emerald-400" />;
      case 'Brain':
        return <Brain className="w-4 h-4 text-amber-400" />;
      case 'Boxes':
        return <Boxes className="w-4 h-4 text-cyan-400" />;
      case 'Workflow':
        return <Workflow className="w-4 h-4 text-indigo-400" />;
      case 'Sparkles':
      default:
        return <Sparkles className="w-4 h-4 text-violet-400" />;
    }
  };

  const accentGradient = theme?.accentGradient || 'from-violet-400 via-fuchsia-400 to-cyan-300';

  const filteredCategories =
    selectedCategory === 'all'
      ? SKILL_CATEGORIES
      : SKILL_CATEGORIES.filter((cat) => cat.id === selectedCategory);

  return (
    <section id="skills" className="py-24 relative overflow-hidden bg-[#07090e]">
      {/* Decorative background glow */}
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-violet-900/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-cyan-900/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.1] text-cyan-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Expertise & Capabilities</span>
          </div>
          <h2
            id="skills-section-heading"
            className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-4"
          >
            Skills & <span className={`text-transparent bg-clip-text bg-gradient-to-r ${accentGradient}`}>AI Toolkit</span>
          </h2>
          <p className="text-slate-400 text-base leading-relaxed">
            Hands-on technical and marketing capabilities grouped into websites, games, AI video generation, and foundational models.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12" role="tablist">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/30'
                : 'bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white border border-white/[0.08]'
            }`}
          >
            All Categories ({SKILL_CATEGORIES.length})
          </button>
          {SKILL_CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                selectedCategory === category.id
                  ? 'bg-white/[0.12] text-white border border-white/[0.2] shadow-md shadow-violet-950/40'
                  : 'bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white border border-white/[0.08]'
              }`}
            >
              {getCategoryIcon(category.icon)}
              <span>{category.title}</span>
            </button>
          ))}
        </div>

        {/* Categories Stack */}
        <div className="space-y-10">
          {filteredCategories.map((category) => (
            <div
              key={category.id}
              id={`skill-category-${category.id}`}
              className="rounded-3xl bg-[#0c101c]/80 border border-white/[0.08] p-6 sm:p-8 backdrop-blur-xl shadow-2xl transition-all"
            >
              {/* Category Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-white/[0.08] mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-white/[0.05] border border-white/[0.1] text-cyan-400">
                    {getCategoryIcon(category.icon)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                      {category.title}
                      <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-white/[0.06] text-slate-300 border border-white/[0.08]">
                        {category.items.length} Skills
                      </span>
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 mt-0.5">{category.subtitle}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.1] text-slate-300">
                    Active Specialization
                  </span>
                </div>
              </div>

              {/* Items Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="group relative rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.06] hover:border-violet-500/40 p-5 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-violet-950/20"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-white/[0.05] border border-white/[0.08] group-hover:scale-105 transition-transform">
                          {getItemIcon(item.iconName)}
                        </div>
                        <h4 className="text-sm font-bold text-slate-100 group-hover:text-white">
                          {item.name}
                        </h4>
                      </div>

                      {item.badge && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/25">
                          {item.badge}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed mb-3">
                      {item.description}
                    </p>

                    {/* Clean unboxed tags with typographic separators */}
                    {item.tags && (
                      <div className="pt-2.5 border-t border-white/[0.06] flex items-center gap-1.5 text-xs text-slate-400">
                        {item.tags.map((tag, tIdx) => (
                          <span key={tIdx} className="flex items-center gap-1.5">
                            <span className="text-slate-300 font-medium text-[11px]">{tag}</span>
                            {tIdx < item.tags!.length - 1 && (
                              <span className="text-slate-600 font-bold" aria-hidden="true">·</span>
                            )}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* AI Tools I Use Spotlight Banner */}
        <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-violet-950/40 via-[#0c101c] to-cyan-950/40 border border-white/[0.1] shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1.5 text-center md:text-left">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                Everyday AI Stack
              </span>
              <h4 className="text-lg sm:text-xl font-bold text-white">
                Fluent In Modern AI Prompting & Workflows
              </h4>
              <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
                Iteratively engineering prompt chains and multimodal logic across ChatGPT, Gemini, Claude, and Google AI Studio to turn ideas into polished production output.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="px-3.5 py-1.5 rounded-xl bg-white/[0.05] border border-white/[0.12] text-xs font-semibold text-emerald-300">
                ChatGPT
              </span>
              <span className="px-3.5 py-1.5 rounded-xl bg-white/[0.05] border border-white/[0.12] text-xs font-semibold text-cyan-300">
                Gemini
              </span>
              <span className="px-3.5 py-1.5 rounded-xl bg-white/[0.05] border border-white/[0.12] text-xs font-semibold text-amber-300">
                Claude AI
              </span>
              <span className="px-3.5 py-1.5 rounded-xl bg-white/[0.05] border border-white/[0.12] text-xs font-semibold text-violet-300">
                Google AI Studio
              </span>
              <span className="px-3.5 py-1.5 rounded-xl bg-white/[0.05] border border-white/[0.12] text-xs font-semibold text-fuchsia-300">
                Google AI Flow
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
