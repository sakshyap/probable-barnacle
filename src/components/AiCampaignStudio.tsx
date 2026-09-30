import { useState } from 'react';
import {
  Sparkles,
  Bot,
  TrendingUp,
  Target,
  Wand2,
  Copy,
  Check,
  Zap,
  ArrowRight,
  Mail,
  BarChart3,
  Layers,
} from 'lucide-react';
import { ThemeConfig } from '../types';
import { usePortfolio } from '../context/PortfolioContext';

interface AiCampaignStudioProps {
  theme?: ThemeConfig;
}

interface CampaignPreset {
  goal: string;
  niche: string;
  headline: string;
  hook: string;
  targetAudience: string;
  aiTools: string[];
  metrics: {
    estCTR: string;
    estROAS: string;
    conversionBoost: string;
  };
  sampleCopy: string;
  hashtags: string[];
}

const CAMPAIGN_PRESETS: Record<string, CampaignPreset> = {
  'reels-fashion': {
    goal: 'Viral Short-Form Reels',
    niche: 'Fashion & Lifestyle',
    headline: 'AI-Generated Seasonal Lookbook Campaign',
    hook: '“The fit check you didn’t know you needed — styled entirely by AI in 60 seconds.”',
    targetAudience: 'Gen-Z & Millennials, fashion enthusiasts, 18-32 years, urban metros',
    aiTools: ['Midjourney v6', 'Runway Gen-3', 'ElevenLabs Audio', 'CapCut AI'],
    metrics: { estCTR: '5.2%', estROAS: '4.2x', conversionBoost: '+68%' },
    sampleCopy:
      'Level up your wardrobe without breaking the bank. Our spring collection combines timeless street aesthetics with everyday comfort. Limited drop — tap link to claim 20% off!',
    hashtags: ['#OOTD', '#StreetStyle2026', '#FashionAI', '#StyleInspo', '#ViralReels'],
  },
  'googleads-tech': {
    goal: 'High-Conversion Google Ads',
    niche: 'SaaS & Tech',
    headline: 'High-Intent Search & AI Retargeting Funnel',
    hook: '“Automate 80% of your workflow before your morning coffee cools down.”',
    targetAudience: 'B2B Founders, Marketing Directors, Tech Teams looking for productivity gains',
    aiTools: ['ChatGPT-4o Prompt Engine', 'Google Ads Smart Bidding', 'Claude 3.5 Sonnet'],
    metrics: { estCTR: '6.4%', estROAS: '3.9x', conversionBoost: '+54%' },
    sampleCopy:
      'Tired of repetitive manual tasks? Deploy intelligent AI automations in under 5 minutes. No complex code needed. Start your 14-day free trial today.',
    hashtags: ['#SaaSGrowth', '#AIAutomation', '#ProductivityHacks', '#B2BMarketing'],
  },
  'email-fitness': {
    goal: 'Automated AI Email Drip Funnel',
    niche: 'Fitness & Wellness',
    headline: '7-Day Personalized Habit Transformation Series',
    hook: '“Why 90% of fitness plans fail by Week 2 (and the 5-minute fix that changes everything).”',
    targetAudience: 'Busy professionals, health-conscious adults, 25-45, seeking sustainable habits',
    aiTools: ['ChatGPT-4o Copywriter', 'Subject Line AI Tester', 'Brevo/Mailchimp Workflows'],
    metrics: { estCTR: '4.8%', estROAS: '4.8x', conversionBoost: '+72%' },
    sampleCopy:
      'Hey friend, quick question: When was the last time you felt truly energized all day? Day 1 of our free routine starts inside — check out your personalized 10-minute micro-workout.',
    hashtags: ['#FitnessJourney', '#WellnessMindset', '#HealthHabits', '#MicroWorkouts'],
  },
  'ugc-food': {
    goal: 'Local Business Lead Generation',
    niche: 'Cafe & Culinary',
    headline: 'Hyperlocal Geo-Targeted Instagram & Reel Blast',
    hook: '“Hidden gem alert in your city: Handcrafted artisanal brews & sourdough you must try.”',
    targetAudience: 'Local residents within 8km radius, foodies, remote workers, students',
    aiTools: ['Canva Magic Studio', 'CapCut AI Captions', 'Meta Advantage+ Geo Targeting'],
    metrics: { estCTR: '7.1%', estROAS: '5.1x', conversionBoost: '+85%' },
    sampleCopy:
      'Craving the perfect cup of coffee? Show this post at the counter for a free warm croissant with your double espresso. Open every day till 10 PM!',
    hashtags: ['#LocalEats', '#CafeVibes', '#SpecialtyCoffee', '#FoodieFinds'],
  },
};

export default function AiCampaignStudio({ theme }: AiCampaignStudioProps) {
  const { personalInfo: PERSONAL_INFO } = usePortfolio();

  const [selectedGoal, setSelectedGoal] = useState<'reels' | 'googleads' | 'email' | 'ugc'>('reels');
  const [selectedNiche, setSelectedNiche] = useState<'fashion' | 'tech' | 'fitness' | 'food'>('fashion');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  // Derive preset key
  const presetKey =
    selectedGoal === 'reels'
      ? 'reels-fashion'
      : selectedGoal === 'googleads'
      ? 'googleads-tech'
      : selectedGoal === 'email'
      ? 'email-fitness'
      : 'ugc-food';

  const campaign = CAMPAIGN_PRESETS[presetKey];

  const handleSimulateGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 600);
  };

  const handleCopyCopy = () => {
    navigator.clipboard.writeText(`${campaign.hook}\n\n${campaign.sampleCopy}\n\n${campaign.hashtags.join(' ')}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const accentGradient = theme?.accentGradient || 'from-violet-400 via-fuchsia-400 to-cyan-300';
  const buttonGradient = theme?.buttonGradient || 'from-violet-600 via-indigo-600 to-cyan-500';

  return (
    <section id="ai-studio" className="py-24 relative overflow-hidden bg-[#070a12]">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-white/10 text-xs font-semibold text-cyan-300 mb-4 shadow-lg backdrop-blur-md">
            <Bot className="w-3.5 h-3.5 text-cyan-400" />
            <span>Interactive AI Marketing Lab</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            AI Campaign Strategy{' '}
            <span className={`text-transparent bg-clip-text bg-gradient-to-r ${accentGradient}`}>
              Generator
            </span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Test how Sakshi leverages generative AI pipelines to architect high-ROI digital marketing campaigns in seconds.
          </p>
        </div>

        {/* Studio Interactive Card */}
        <div className="rounded-3xl bg-slate-900/80 border border-white/15 p-6 sm:p-8 lg:p-10 shadow-2xl backdrop-blur-2xl">
          {/* Controls Bar */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end pb-8 border-b border-white/10">
            {/* Goal Selector */}
            <div className="md:col-span-6 space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-cyan-400" />
                Select Campaign Objective:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedGoal('reels');
                    setSelectedNiche('fashion');
                  }}
                  className={`px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition-all ${
                    selectedGoal === 'reels'
                      ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-md'
                      : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  🎥 Viral Video Reel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedGoal('googleads');
                    setSelectedNiche('tech');
                  }}
                  className={`px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition-all ${
                    selectedGoal === 'googleads'
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
                      : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  📈 Google Search Ads
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedGoal('email');
                    setSelectedNiche('fitness');
                  }}
                  className={`px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition-all ${
                    selectedGoal === 'email'
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                      : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  ✉️ AI Email Drip Funnel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedGoal('ugc');
                    setSelectedNiche('food');
                  }}
                  className={`px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition-all ${
                    selectedGoal === 'ugc'
                      ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md'
                      : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  📍 Hyperlocal Growth
                </button>
              </div>
            </div>

            {/* Target Niche */}
            <div className="md:col-span-3 space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                Industry Focus:
              </label>
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-xs font-semibold text-cyan-300">
                {campaign.niche}
              </div>
            </div>

            {/* Trigger Button */}
            <div className="md:col-span-3">
              <button
                type="button"
                onClick={handleSimulateGenerate}
                disabled={isGenerating}
                className={`w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 bg-gradient-to-r ${buttonGradient} text-white shadow-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer`}
              >
                {isGenerating ? (
                  <>
                    <Zap className="w-4 h-4 animate-spin text-cyan-300" />
                    <span>Synthesizing...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 text-cyan-300" />
                    <span>Generate Blueprint</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Generated Result Output Box */}
          <div className="pt-8 space-y-6">
            {/* Top Row: Campaign Title & Performance Projections */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-7 space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                  AI Architecture Blueprint
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {campaign.headline}
                </h3>
                <p className="text-sm text-slate-300 italic bg-white/5 p-3 rounded-xl border border-white/10">
                  {campaign.hook}
                </p>
              </div>

              {/* Metrics Highlights */}
              <div className="lg:col-span-5 grid grid-cols-3 gap-2.5">
                <div className="p-3 rounded-xl bg-slate-950/80 border border-white/10 text-center">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
                    Est. CTR
                  </span>
                  <span className="text-lg font-black text-cyan-400">{campaign.metrics.estCTR}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/80 border border-white/10 text-center">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
                    Est. ROAS
                  </span>
                  <span className="text-lg font-black text-emerald-400">{campaign.metrics.estROAS}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/80 border border-white/10 text-center">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
                    Conversion
                  </span>
                  <span className="text-lg font-black text-violet-400">
                    {campaign.metrics.conversionBoost}
                  </span>
                </div>
              </div>
            </div>

            {/* Middle Row: AI Tech Stack & Target Persona */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-white/10 space-y-2">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-cyan-400" />
                  Target Buyer Persona
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {campaign.targetAudience}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-white/10 space-y-2">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Bot className="w-3.5 h-3.5 text-violet-400" />
                  AI Stack Deployed
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {campaign.aiTools.map((tool) => (
                    <span
                      key={tool}
                      className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-white/10 text-slate-200 border border-white/10"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Ad Script & Copy Box */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/90 border border-white/15 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  AI Generated Ad Copy Sample:
                </span>
                <button
                  type="button"
                  onClick={handleCopyCopy}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-colors cursor-pointer border border-white/10"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-bold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Ad Copy</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                {campaign.sampleCopy}
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {campaign.hashtags.map((tag) => (
                  <span key={tag} className="text-xs font-mono text-cyan-400">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Direct CTA */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Need a customized marketing funnel for your brand or product?</span>
              </div>
              <a
                href={`mailto:${PERSONAL_INFO.email}?subject=Inquiry%20from%20Portfolio%20-%20AI%20Marketing%20Campaign`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-all shadow-md"
              >
                <Mail className="w-3.5 h-3.5 text-cyan-400" />
                <span>Contact Sakshi ({PERSONAL_INFO.email})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
