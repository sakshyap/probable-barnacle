import { PageLayout } from '@/components/layout/PageLayout';
import { Vision } from '@/components/sections/Vision';
import { About } from '@/components/sections/About';
import { Achievements } from '@/components/sections/Achievements';
import { Features } from '@/components/sections/Features';

export default function AboutPage() {
  return (
    <PageLayout>
      <div className="pt-24">
        <Vision />
        <About />
        <Achievements />
        <Features />
      </div>
    </PageLayout>
  );
}