import { NavItem, SkillCategory, Project, SocialLink, ThemeConfig } from '../types';
import schoolPortalImg from '../assets/images/project_school_portal_1790317925562.jpg';
import arcadeGameImg from '../assets/images/project_arcade_game_1790317939580.jpg';
import videoStudioImg from '../assets/images/project_ai_video_studio_1790317956809.jpg';

export const THEME_CONFIGS: Record<string, ThemeConfig> = {
  violet: {
    id: 'violet',
    name: 'Cosmic Violet',
    accentGradient: 'from-violet-400 via-fuchsia-400 to-cyan-300',
    primaryColor: '#8b5cf6',
    secondaryColor: '#06b6d4',
    glowColor1: 'bg-violet-600/20',
    glowColor2: 'bg-cyan-500/15',
    badgeBg: 'bg-violet-950/60',
    badgeBorder: 'border-violet-500/30',
    badgeText: 'text-violet-300',
    buttonGradient: 'from-violet-600 via-indigo-600 to-cyan-500',
    buttonShadow: 'shadow-violet-600/30 hover:shadow-violet-500/50',
    activeBorder: 'border-violet-500/60',
  },
  emerald: {
    id: 'emerald',
    name: 'Cyber Emerald',
    accentGradient: 'from-emerald-400 via-teal-300 to-amber-300',
    primaryColor: '#10b981',
    secondaryColor: '#14b8a6',
    glowColor1: 'bg-emerald-600/20',
    glowColor2: 'bg-teal-500/15',
    badgeBg: 'bg-emerald-950/60',
    badgeBorder: 'border-emerald-500/30',
    badgeText: 'text-emerald-300',
    buttonGradient: 'from-emerald-600 via-teal-600 to-cyan-500',
    buttonShadow: 'shadow-emerald-600/30 hover:shadow-emerald-500/50',
    activeBorder: 'border-emerald-500/60',
  },
  rose: {
    id: 'rose',
    name: 'Neon Sunset',
    accentGradient: 'from-rose-400 via-pink-400 to-amber-300',
    primaryColor: '#f43f5e',
    secondaryColor: '#a855f7',
    glowColor1: 'bg-rose-600/20',
    glowColor2: 'bg-pink-500/15',
    badgeBg: 'bg-rose-950/60',
    badgeBorder: 'border-rose-500/30',
    badgeText: 'text-rose-300',
    buttonGradient: 'from-rose-600 via-pink-600 to-amber-500',
    buttonShadow: 'shadow-rose-600/30 hover:shadow-rose-500/50',
    activeBorder: 'border-rose-500/60',
  },
  ocean: {
    id: 'ocean',
    name: 'Electric Blue',
    accentGradient: 'from-blue-400 via-cyan-300 to-teal-300',
    primaryColor: '#3b82f6',
    secondaryColor: '#06b6d4',
    glowColor1: 'bg-blue-600/20',
    glowColor2: 'bg-teal-500/15',
    badgeBg: 'bg-blue-950/60',
    badgeBorder: 'border-blue-500/30',
    badgeText: 'text-blue-300',
    buttonGradient: 'from-blue-600 via-indigo-600 to-cyan-500',
    buttonShadow: 'shadow-blue-600/30 hover:shadow-blue-500/50',
    activeBorder: 'border-blue-500/60',
  },
  amber: {
    id: 'amber',
    name: 'Luxe Amber',
    accentGradient: 'from-amber-300 via-orange-400 to-rose-400',
    primaryColor: '#f59e0b',
    secondaryColor: '#f97316',
    glowColor1: 'bg-amber-600/20',
    glowColor2: 'bg-orange-500/15',
    badgeBg: 'bg-amber-950/60',
    badgeBorder: 'border-amber-500/30',
    badgeText: 'text-amber-300',
    buttonGradient: 'from-amber-500 via-orange-500 to-rose-600',
    buttonShadow: 'shadow-amber-600/30 hover:shadow-amber-500/50',
    activeBorder: 'border-amber-500/60',
  },
};

export const AI_VIDEO_SHOWCASE_IMG = videoStudioImg;

export const PERSONAL_INFO = {
  name: 'Sakshi',
  title: 'Digital Marketing with AI Specialist',
  shortIntro:
    'Bridging creative marketing strategy with cutting-edge AI tools to design responsive web platforms, interactive games, and automated digital campaigns.',
  location: 'Available Globally (Remote)',
  email: 'sakshikashyap6857@gmail.com',
  status: 'Open to AI Marketing & Web Development Projects',
  bioParagraph1:
    "Hi, I'm Sakshi! I recently completed a specialized certification in Digital Marketing with AI, unlocking new ways to combine modern marketing strategies with rapid artificial intelligence workflows.",
  bioParagraph2:
    "I have a deep passion for building things hands-on using AI tools — from intelligent responsive websites and interactive canvas games to automated video content pipelines. By harnessing AI as a creative amplifier, I turn concepts into live digital products with speed and precision.",
  highlights: [
    {
      label: 'Specialization',
      value: 'Digital Marketing with AI',
      detail: 'Certified in modern AI marketing workflows',
    },
    {
      label: 'Primary Focus',
      value: 'AI Tools & Rapid Dev',
      detail: 'Websites, interactive games & AI video',
    },
    {
      label: 'Key Strengths',
      value: 'Prompting & Optimization',
      detail: 'ChatGPT, Gemini, Claude, AI Studio',
    },
    {
      label: 'Philosophy',
      value: 'Build Fast, Iterate Smart',
      detail: 'AI-assisted coding & creative execution',
    },
  ],
  stats: [
    { number: '5+', label: 'AI Power Tools' },
    { number: '100%', label: 'Hands-on AI Driven' },
    { number: '2+', label: 'Featured Showcases' },
    { number: '24/7', label: 'Curiosity & Passion' },
  ],
};

export const NAV_ITEMS: NavItem[] = [
  { id: 'hero', label: 'Home', href: '#hero' },
  { id: 'about', label: 'About Me', href: '#about' },
  { id: 'skills', label: 'Skills & Tools', href: '#skills' },
  { id: 'projects', label: 'Projects', href: '#projects' },
  { id: 'blog', label: 'Blog', href: '#blog' },
  { id: 'contact', label: 'Contact', href: '#contact' },
];

export const SOCIAL_LINKS: SocialLink[] = [
  {
    platform: 'LinkedIn',
    url: 'https://linkedin.com/in/sakshi-digital-marketing-ai',
    iconName: 'Linkedin',
    label: 'Connect on LinkedIn',
  },
  {
    platform: 'Instagram',
    url: 'https://instagram.com/sakshi_ai_marketing',
    iconName: 'Instagram',
    label: 'Follow on Instagram',
  },
  {
    platform: 'GitHub',
    url: 'https://github.com/sakshi-ai-dev',
    iconName: 'Github',
    label: 'Check Code on GitHub',
  },
  {
    platform: 'Email',
    url: 'mailto:sakshikashyap6857@gmail.com',
    iconName: 'Mail',
    label: 'Email Sakshi',
  },
];

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: 'web-dev',
    title: 'Website Development',
    subtitle: 'Building clean, fast, and responsive websites',
    icon: 'Globe',
    accentColor: 'purple',
    items: [
      {
        name: 'Responsive Web Design',
        iconName: 'Layout',
        description: 'Creating mobile-first websites tailored for all screen resolutions.',
        tags: ['HTML5', 'CSS3', 'Tailwind CSS'],
        level: 'Advanced',
      },
      {
        name: 'AI Coding & Scaffolding',
        iconName: 'Code',
        description: 'Using AI models to architect clean semantic HTML, layout systems, and scripts.',
        tags: ['Vite', 'JavaScript', 'AI Studio'],
        level: 'Specialist',
      },
      {
        name: 'Landing Page Conversion',
        iconName: 'Sparkles',
        description: 'Structuring hero sections, value propositions, and high-converting CTAs.',
        tags: ['SEO', 'Marketing UX', 'A/B Concepts'],
        level: 'Pro',
      },
      {
        name: 'UI/UX & Accessibility',
        iconName: 'Palette',
        description: 'Readable typography, accessible contrast, smooth transitions, and clean aesthetics.',
        tags: ['Modern UI', 'Micro-interactions'],
        level: 'Skilled',
      },
    ],
  },
  {
    id: 'game-dev',
    title: 'Game Development',
    subtitle: 'Building fun, interactive games using AI assistance',
    icon: 'Gamepad2',
    accentColor: 'teal',
    items: [
      {
        name: 'Interactive Game Logic',
        iconName: 'Cpu',
        description: 'Designing collision systems, scoring, timers, and difficulty scaling.',
        tags: ['HTML5 Canvas', 'JS Game Loops'],
        level: 'Proficient',
      },
      {
        name: 'AI-Assisted Prototyping',
        iconName: 'Zap',
        description: 'Prompting LLMs to generate algorithmic gameplay rules and debug game states.',
        tags: ['Claude AI', 'ChatGPT'],
        level: 'Specialist',
      },
      {
        name: 'Story & Level Design',
        iconName: 'Compass',
        description: 'Writing engaging narratives, character mechanics, and level progressions.',
        tags: ['Game Mechanics', 'Storyboards'],
        level: 'Creative',
      },
      {
        name: 'Audio & Visual Feedback',
        iconName: 'Sliders',
        description: 'Implementing responsive visual particle effects, victory states, and audio cues.',
        tags: ['Web Audio', 'Canvas FX'],
        level: 'Skilled',
      },
    ],
  },
  {
    id: 'ai-video',
    title: 'AI Video Creation',
    subtitle: 'Making engaging videos using generative AI tools',
    icon: 'Video',
    accentColor: 'pink',
    items: [
      {
        name: 'AI Video Generation',
        iconName: 'Film',
        description: 'Crafting video scenes and dynamic visual animations using generative text-to-video AI.',
        tags: ['Prompt to Video', 'Generative Media'],
        level: 'Specialist',
      },
      {
        name: 'AI Scripting & Voiceover',
        iconName: 'Mic',
        description: 'Drafting high-retention video scripts and generating natural synthetic voice narration.',
        tags: ['Script Writing', 'ElevenLabs / TTS'],
        level: 'Advanced',
      },
      {
        name: 'Short-Form Video Strategy',
        iconName: 'Flame',
        description: 'Optimizing hooks and visuals for Instagram Reels, YouTube Shorts, and TikTok.',
        tags: ['Reels', 'TikToks', 'Pacing'],
        level: 'Marketing',
      },
      {
        name: 'Editing & Visual Effects',
        iconName: 'Scissors',
        description: 'Assembling generative clips with captions, background tracks, and brand overlays.',
        tags: ['Captions', 'Motion Cuts'],
        level: 'Proficient',
      },
    ],
  },
  {
    id: 'ai-tools',
    title: 'AI Tools I Use',
    subtitle: 'My everyday artificial intelligence arsenal',
    icon: 'Bot',
    accentColor: 'blue',
    items: [
      {
        name: 'ChatGPT',
        iconName: 'MessageSquare',
        description: 'Advanced prompt engineering for marketing copy, SEO content, and fast script ideation.',
        badge: 'OpenAI',
        tags: ['Content Strategy', 'Copywriting', 'Logic'],
        level: 'Daily Driver',
      },
      {
        name: 'Gemini',
        iconName: 'Sparkles',
        description: 'Multimodal analysis, deep search synthesis, and creative ideation across text and media.',
        badge: 'Google',
        tags: ['Multimodal', 'Research', 'Marketing Insights'],
        level: 'Power User',
      },
      {
        name: 'Claude AI',
        iconName: 'Brain',
        description: 'Complex reasoning, long-form technical architecture, and clean code generation.',
        badge: 'Anthropic',
        tags: ['Code Synthesis', 'Nuanced Writing'],
        level: 'Expert',
      },
      {
        name: 'Google AI Studio',
        iconName: 'Boxes',
        description: 'Rapid developer prototyping, system prompt testing, and API experimentation.',
        badge: 'Google',
        tags: ['Prompt Engineering', 'Prototyping', 'Vite/React'],
        level: 'Specialist',
      },
      {
        name: 'Google AI Flow',
        iconName: 'Workflow',
        description: 'Orchestrating interconnected AI pipelines, agentic workflows, and marketing automations.',
        badge: 'Automation',
        tags: ['Workflows', 'Pipeline Automation'],
        level: 'Innovator',
      },
    ],
  },
];

export const PROJECTS: Project[] = [
  {
    id: 'school-website',
    title: 'School Website',
    badge: 'AI-Powered Education Portal',
    tagline: 'Modern, fully responsive educational institution website built with AI coding assistants',
    description:
      'An AI-powered school web portal built using AI coding tools. Features a dynamic course catalog, faculty directory, student event notices, and mobile-friendly admissions portal.',
    longDescription:
      'Designed and coded utilizing AI prompt engineering workflows to rapidly scaffold semantic HTML5, modern Tailwind CSS styling, and responsive navigation. Includes interactive tabs for academic departments, interactive fee calculator, upcoming event calendar, and contact forms.',
    techStack: ['HTML5/CSS3', 'JavaScript', 'Google AI Studio', 'ChatGPT', 'Responsive UI'],
    features: [
      'Interactive department and course browser',
      'Event announcements and campus calendar',
      'Admissions inquiry form with client validation',
      'High-speed mobile layout with accessibility standards',
    ],
    category: 'Website Development',
    githubUrl: 'https://github.com/sakshi-ai-dev/ai-school-website-portal',
    liveUrl: 'https://school-website-ai-demo.example.com',
    thumbnailGradient: 'from-violet-900/60 via-indigo-900/40 to-slate-900/80',
    previewType: 'school',
    imageUrl: schoolPortalImg,
  },
  {
    id: 'ai-built-game',
    title: 'AI-Built Game',
    badge: 'Interactive AI-Assisted Game',
    tagline: 'Fast-paced retro arcade web game programmed using AI prompt engineering',
    description:
      'A responsive arcade browser game built with the assistance of AI tools. Features dynamic collision detection, score streaks, responsive keyboard/touch controls, and audio effects.',
    longDescription:
      'Developed by collaborating with Claude AI and Gemini to generate clean HTML5 Canvas render loops, particle explosions, speed ramps, and high score tracking. Includes both keyboard (Arrow keys/WASD) and touch controls for seamless mobile playability.',
    techStack: ['HTML5 Canvas', 'JavaScript', 'Claude AI', 'Gemini', 'Web Audio API'],
    features: [
      'Dynamic physics and collision mechanics',
      'Interactive in-browser playable mini-game demo',
      'Mobile touch controls + desktop keyboard support',
      'Real-time score multiplier and sound synth effects',
    ],
    category: 'Game Development',
    githubUrl: 'https://github.com/sakshi-ai-dev/ai-canvas-arcade-game',
    liveUrl: 'https://ai-arcade-game-demo.example.com',
    thumbnailGradient: 'from-cyan-900/60 via-teal-900/40 to-slate-900/80',
    previewType: 'game',
    imageUrl: arcadeGameImg,
  },
];
