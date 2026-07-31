import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Achievements } from '@/components/sections/Achievements';
import { Features } from '@/components/sections/Features';
import { Programs } from '@/components/sections/Programs';
import { Facilities } from '@/components/sections/Facilities';
import { News } from '@/components/sections/News';
import { Testimonials } from '@/components/sections/Testimonials';
import { Admissions } from '@/components/sections/Admissions';
import { FAQ } from '@/components/sections/FAQ';
import { Contact } from '@/components/sections/Contact';
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';
import { ScrollToTop } from '@/components/ScrollToTop';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main>
        <Hero />
        <About />
        <Achievements />
        <Features />
        <Programs />
        <Facilities />
        <News />
        <Testimonials />
        <Admissions />
        <FAQ />
        <Contact />
      </main>

      <Footer />
      
      <FloatingWhatsApp />
      <ScrollToTop />
    </div>
  );
}
