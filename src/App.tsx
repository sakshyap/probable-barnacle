import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import AiCampaignStudio from './components/AiCampaignStudio';
import Projects from './components/Projects';
import Blog from './components/Blog';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { ColorTheme } from './types';
import { THEME_CONFIGS } from './data/portfolioData';
import { PortfolioProvider } from './context/PortfolioContext';

export default function App() {
  const [activeSection, setActiveSection] = useState('hero');
  const [currentTheme, setCurrentTheme] = useState<ColorTheme>('violet');

  // Handle active section on scroll
  useEffect(() => {
    const sectionIds = ['hero', 'about', 'skills', 'projects', 'blog', 'contact'];
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i];
        const element = document.getElementById(id);
        if (element) {
          const top = element.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollTo = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const themeConfig = THEME_CONFIGS[currentTheme] || THEME_CONFIGS.violet;

  return (
    <PortfolioProvider>
      <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans selection:bg-violet-600 selection:text-white transition-colors duration-500">
        {/* Sticky Top Navbar with Color Theme Selector */}
        <Navbar
          activeSection={activeSection}
          currentTheme={currentTheme}
          onThemeChange={setCurrentTheme}
        />

        {/* Main Content Area */}
        <main className="flex-1">
          <Hero
            onScrollTo={handleScrollTo}
            theme={themeConfig}
            currentTheme={currentTheme}
            onThemeChange={setCurrentTheme}
          />
          <About onScrollTo={handleScrollTo} theme={themeConfig} />
          <Skills theme={themeConfig} />
          <AiCampaignStudio theme={themeConfig} />
          <Projects theme={themeConfig} />
          <Blog theme={themeConfig} />
          <Contact theme={themeConfig} />
        </main>

        {/* Footer */}
        <Footer theme={themeConfig} />
      </div>
    </PortfolioProvider>
  );
}

