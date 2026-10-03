import { PageLayout } from '@/components/layout/PageLayout';
import { MandatoryDisclosure } from '@/components/sections/MandatoryDisclosure';
import { CBSESection } from '@/components/sections/CBSESection';

export default function CBSEPage() {
  return (
    <PageLayout>
      <div className="pt-24">
        <MandatoryDisclosure />
        <CBSESection />
      </div>
    </PageLayout>
  );
}