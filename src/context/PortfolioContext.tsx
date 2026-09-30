import { createContext, useContext, useEffect, useState } from 'react';
import {
  PERSONAL_INFO,
  SOCIAL_LINKS,
  NAV_ITEMS,
  SKILL_CATEGORIES,
  PROJECTS
} from '../data/portfolioData';
import { NavItem, Project, SkillCategory, SocialLink } from '../types';

export interface PersonalInfo {
  name: string;
  title: string;
  shortIntro: string;
  location: string;
  email: string;
  status: string;
  bioParagraph1: string;
  bioParagraph2: string;
  highlights: { label: string; value: string; detail: string }[];
  stats: { number: string; label: string }[];
}

export interface PortfolioContent {
  personalInfo: PersonalInfo;
  socials: SocialLink[];
  navItems: NavItem[];
  skillCategories: SkillCategory[];
  projects: Project[];
  /** True once the admin-authored content has replaced the bundled defaults. */
  fromApi: boolean;
}

/**
 * Bundled defaults render instantly on first paint. If the fetch fails - or the
 * site is opened without the Express server - the portfolio still shows
 * complete content instead of an empty page.
 */
const FALLBACK: PortfolioContent = {
  personalInfo: PERSONAL_INFO as PersonalInfo,
  socials: SOCIAL_LINKS,
  navItems: NAV_ITEMS,
  skillCategories: SKILL_CATEGORIES,
  projects: PROJECTS,
  fromApi: false
};

const PortfolioContext = createContext<PortfolioContent>(FALLBACK);

function normalise(data: Partial<PortfolioContent>): PortfolioContent {
  return {
    personalInfo: data.personalInfo ?? FALLBACK.personalInfo,
    socials: Array.isArray(data.socials) && data.socials.length ? data.socials : FALLBACK.socials,
    navItems: Array.isArray(data.navItems) && data.navItems.length ? data.navItems : FALLBACK.navItems,
    skillCategories:
      Array.isArray(data.skillCategories) && data.skillCategories.length
        ? data.skillCategories
        : FALLBACK.skillCategories,
    projects: Array.isArray(data.projects) && data.projects.length ? data.projects : FALLBACK.projects,
    fromApi: true
  };
}

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<PortfolioContent>(FALLBACK);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch('/api/portfolio/content');
        if (!res.ok) return;

        const payload = await res.json();
        if (cancelled || !payload?.data) return;

        setContent(normalise({ ...payload.data, personalInfo: payload.data.profile }));
      } catch (err) {
        console.warn('Falling back to bundled portfolio content.', err);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return <PortfolioContext.Provider value={content}>{children}</PortfolioContext.Provider>;
}

export function usePortfolio(): PortfolioContent {
  return useContext(PortfolioContext);
}
