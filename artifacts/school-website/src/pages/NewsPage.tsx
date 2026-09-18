import { PageLayout } from '@/components/layout/PageLayout';
import { News } from '@/components/sections/News';

export default function NewsPage() {
  return (
    <PageLayout>
      <div className="pt-24">
        <News />
      </div>
    </PageLayout>
  );
}