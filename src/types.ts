export interface NavItem {
  id: string;
  label: string;
  href: string;
}

export interface SkillItem {
  name: string;
  iconName: string;
  description: string;
  badge?: string;
  tags?: string[];
  level?: string;
}

export interface SkillCategory {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  accentColor: string; // e.g., 'purple', 'teal', 'pink', 'blue'
  items: SkillItem[];
}

export interface Project {
  id: string;
  title: string;
  badge: string;
  tagline: string;
  description: string;
  longDescription: string;
  techStack: string[];
  features: string[];
  category: 'Website Development' | 'Game Development';
  githubUrl: string;
  liveUrl: string;
  thumbnailGradient: string;
  previewType: 'school' | 'game';
  imageUrl?: string;
}

export type ColorTheme = 'violet' | 'emerald' | 'rose' | 'ocean' | 'amber';

export interface ThemeConfig {
  id: ColorTheme;
  name: string;
  accentGradient: string;
  primaryColor: string;
  secondaryColor: string;
  glowColor1: string;
  glowColor2: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  buttonGradient: string;
  buttonShadow: string;
  activeBorder: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  iconName: string;
  label: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export interface BlogPost {
  id: string;
  title: string;
  author: string;
  category: string;
  excerpt: string;
  content: string;
  imageUrl?: string;
  status: 'Published' | 'Draft';
  createdAt: string;
}
