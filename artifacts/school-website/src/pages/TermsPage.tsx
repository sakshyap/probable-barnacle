import { Link } from 'wouter';
import { PageLayout } from '@/components/layout/PageLayout';

export default function TermsPage() {
  return (
    <PageLayout>
      <div className="pt-32 pb-24 bg-background">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <h1 className="text-3xl md:text-5xl font-bold font-serif text-foreground mb-8">Terms &amp; Conditions</h1>
          <div className="space-y-6 text-muted-foreground">
            <p>By using the Swami Bharmanand Gurukul website, you agree to the following terms.</p>
            <h2 className="text-xl font-semibold text-foreground">Website Use</h2>
            <p>The content on this website is provided for general information about the school, its programmes, admissions, and facilities, and may change without notice.</p>
            <h2 className="text-xl font-semibold text-foreground">Admissions</h2>
            <p>Seats are allotted as per the school's admission policy and CBSE norms. Claims made on this site do not guarantee admission. Please contact the school office for the latest admission procedure.</p>
            <h2 className="text-xl font-semibold text-foreground">External Links</h2>
            <p>We are not responsible for the content or practices of external websites linked from this site.</p>
            <h2 className="text-xl font-semibold text-foreground">Contact</h2>
            <p>For questions regarding these terms, please reach out at gurukulbanipundri@gmail.com or through our <Link className="text-primary hover:underline" href="/contact">contact page</Link>.</p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}