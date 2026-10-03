import { PageLayout } from '@/components/layout/PageLayout';
import { Admissions } from '@/components/sections/Admissions';
import { FAQ } from '@/components/sections/FAQ';

export default function AdmissionsPage() {
  return (
    <PageLayout>
      <div className="pt-24">
        <Admissions />
        <FAQ />
      </div>
    </PageLayout>
  );
}