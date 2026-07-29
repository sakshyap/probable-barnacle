import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import heroImg from '@assets/generated_images/hero.jpg';

export function Hero() {
  const scrollTo = (id: string) => {
    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/90 via-secondary/70 to-secondary/40 mix-blend-multiply z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-90 z-10" />
        <img
          src={heroImg}
          alt="Sunrise over Swami Bharmanand Gurukul campus"
          className="w-full h-full object-cover object-center"
          loading="eager"
        />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-20 pt-20">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-4"
          >
            <span className="inline-block py-1 px-3 rounded-full bg-primary/20 text-primary border border-primary/30 text-sm font-semibold tracking-wider uppercase mb-4 backdrop-blur-sm">
              Est. 1999 • 25 Years of Excellence
            </span>
            <h2 className="hindi-text text-3xl md:text-4xl text-accent mb-2 font-medium drop-shadow-lg">
              ज्ञान • संस्कार • अनुशासन
            </h2>
            <h1 className="text-5xl md:text-7xl font-bold text-white font-serif leading-tight drop-shadow-xl">
              Swami Bharmanand <span className="text-primary">Gurukul</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl leading-relaxed drop-shadow-md"
          >
            A sacred place where Vedic discipline meets contemporary education. 
            We build character, impart quality education rooted in Indian cultural identity, 
            and nurture the leaders of tomorrow.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap gap-4"
          >
            <Button
              size="lg"
              className="bg-primary text-white hover:bg-primary/90 text-lg px-8 py-6 rounded-full shadow-[0_0_20px_rgba(255,153,51,0.4)]"
              onClick={() => scrollTo('#admissions')}
            >
              Apply for Admission
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-white border-white/30 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-lg px-8 py-6 rounded-full"
              onClick={() => scrollTo('#contact')}
            >
              Contact Us
            </Button>
          </motion.div>
        </div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center cursor-pointer"
        onClick={() => scrollTo('#about')}
      >
        <span className="text-white/70 text-sm mb-2 uppercase tracking-widest font-medium">Discover</span>
        <motion.div 
          animate={{ y: [0, 8, 0] }} 
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-[1px] h-12 bg-gradient-to-b from-primary to-transparent"
        />
      </motion.div>
    </section>
  );
}
