import { PageLayout } from '@/components/layout/PageLayout';
import { Contact } from '@/components/sections/Contact';

export default function ContactPage() {
  return (
    <PageLayout>
      <div className="pt-24">
        <Contact />
      </div>
    </PageLayout>
  );
}