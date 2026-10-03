import { PageLayout } from '@/components/layout/PageLayout';
import { Hero } from '@/components/sections/Hero';
import { Achievements } from '@/components/sections/Achievements';
import { Features } from '@/components/sections/Features';
import { Classes } from '@/components/sections/Classes';
import { News } from '@/components/sections/News';
import { Testimonials } from '@/components/sections/Testimonials';

export default function HomePage() {
  return (
    <PageLayout>
      <Hero />
      <Achievements />
      <Features />
      <Classes />
      <News />
      <Testimonials />
    </PageLayout>
  );
}