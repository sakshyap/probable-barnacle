import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import logoImg from '@assets/image_1785473819970.png';

const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'Vision', href: '#vision' },
  { name: 'About Us', href: '#about' },
  { name: 'Gallery', href: '#gallery' },
  { name: 'Mandatory Disclosure', href: '#mandatory-disclosure' },
  { name: 'CBSE', href: '#cbse' },
  { name: 'Classes', href: '#classes' },
  { name: 'Contact', href: '#contact' },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0A2540]/98 backdrop-blur-md shadow-md py-3'
          : 'bg-[#0A2540]/90 backdrop-blur-sm py-4'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <a
            href="#home"
            onClick={(e) => handleNavClick(e, '#home')}
            className="flex items-center gap-3 group"
          >
            <img
              src={logoImg}
              alt="Swami Bharmanand Gurukul Logo"
              className="h-12 w-12 md:h-14 md:w-14 rounded-full object-cover shadow-md shrink-0"
            />
            <div className="flex flex-col">
              <span className={`text-base md:text-xl font-bold font-serif leading-tight transition-colors ${isScrolled ? 'text-primary' : 'text-white drop-shadow-md'}`}>
                Swami Bharmanand Gurukul
              </span>
              <span className={`hindi-text text-xs md:text-sm leading-tight transition-colors ${isScrolled ? 'text-foreground/70' : 'text-white/85 drop-shadow-md'}`}>
                स्वामी ब्रह्मानंद गुरुकुल
              </span>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors hover:text-primary ${
                  isScrolled ? 'text-foreground/80' : 'text-white/90 drop-shadow-sm hover:text-white'
                }`}
              >
                {link.name}
              </a>
            ))}
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={`ml-2 rounded-full ${isScrolled ? 'text-foreground' : 'text-white hover:bg-white/20 hover:text-white'}`}
            >
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </nav>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={`mr-2 rounded-full ${isScrolled ? 'text-foreground' : 'text-white hover:bg-white/20'}`}
            >
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={isScrolled ? 'text-foreground' : 'text-white hover:bg-white/20'}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-background border-b shadow-lg overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1 flex flex-col">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="px-3 py-3 rounded-md text-base font-medium text-foreground hover:bg-accent/50 hover:text-primary transition-colors border-b border-border/50 last:border-0"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
