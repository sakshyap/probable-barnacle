import { PageLayout } from '@/components/layout/PageLayout';
import { GallerySection } from '@/components/sections/GallerySection';

export default function GalleryPage() {
  return (
    <PageLayout>
      <div className="pt-24">
        <GallerySection />
      </div>
    </PageLayout>
  );
}