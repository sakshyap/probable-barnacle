import { PageLayout } from '@/components/layout/PageLayout';
import { Classes } from '@/components/sections/Classes';
import { Programs } from '@/components/sections/Programs';

export default function AcademicsPage() {
  return (
    <PageLayout>
      <div className="pt-24">
        <Classes />
        <Programs />
      </div>
    </PageLayout>
  );
}