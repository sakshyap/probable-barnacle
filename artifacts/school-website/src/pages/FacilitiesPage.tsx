import { PageLayout } from '@/components/layout/PageLayout';
import { Facilities } from '@/components/sections/Facilities';

export default function FacilitiesPage() {
  return (
    <PageLayout>
      <div className="pt-24">
        <Facilities />
      </div>
    </PageLayout>
  );
}