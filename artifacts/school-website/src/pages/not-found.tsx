import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'wouter';
import { AlertCircle } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';

export default function NotFound() {
  return (
    <PageLayout>
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 pt-24">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6">
            <div className="flex mb-4 gap-2">
              <AlertCircle className="h-8 w-8 text-red-500" />
              <h1 className="text-2xl font-bold text-gray-900">
                404 Page Not Found
              </h1>
            </div>

            <p className="mt-4 text-sm text-gray-600">
              The page you are looking for does not exist.
            </p>
            <Link href="/" className="mt-4 inline-block text-sm font-medium text-primary hover:underline">
              Back to Home
            </Link>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}