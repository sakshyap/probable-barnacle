import { Link } from 'wouter';
import { PageLayout } from '@/components/layout/PageLayout';

export default function PrivacyPolicyPage() {
  return (
    <PageLayout>
      <div className="pt-32 pb-24 bg-background">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <h1 className="text-3xl md:text-5xl font-bold font-serif text-foreground mb-8">Privacy Policy</h1>
          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6 text-muted-foreground">
            <p>Swami Bharmanand Gurukul is committed to protecting the privacy of our students, parents, and website visitors.</p>
            <h2 className="text-xl font-semibold text-foreground">Information We Collect</h2>
            <p>When you use the contact or admission enquiry form, we collect information you voluntarily provide, such as your name, phone number, and email address.</p>
            <h2 className="text-xl font-semibold text-foreground">How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>To respond to your enquiries about admissions and school programmes</li>
              <li>To share announcements, exam schedules, and other academic updates</li>
              <li>For internal record keeping and administrative purposes</li>
            </ul>
            <h2 className="text-xl font-semibold text-foreground">Data Sharing</h2>
            <p>We do not sell, trade, or rent your personal information to third parties.</p>
            <h2 className="text-xl font-semibold text-foreground">Contact</h2>
            <p>For any privacy-related questions, please contact us at gurukulbanipundri@gmail.com or visit our <Link className="text-primary hover:underline" href="/contact">contact page</Link>.</p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}