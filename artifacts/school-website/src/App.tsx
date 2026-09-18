import { lazy, Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import HomePage from '@/pages/HomePage';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { ThemeProvider } from '@/components/theme-provider';

const AboutPage = lazy(() => import('@/pages/AboutPage'));
const AcademicsPage = lazy(() => import('@/pages/AcademicsPage'));
const AdmissionsPage = lazy(() => import('@/pages/AdmissionsPage'));
const FacilitiesPage = lazy(() => import('@/pages/FacilitiesPage'));
const GalleryPage = lazy(() => import('@/pages/GalleryPage'));
const NewsPage = lazy(() => import('@/pages/NewsPage'));
const CBSEPage = lazy(() => import('@/pages/CBSEPage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));
const PrivacyPolicyPage = lazy(() => import('@/pages/PrivacyPolicyPage'));
const TermsPage = lazy(() => import('@/pages/TermsPage'));
const NotFound = lazy(() => import('@/pages/not-found'));

const queryClient = new QueryClient();

function PageFallback() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
    </div>
  );
}

function Router() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/about" component={AboutPage} />
        <Route path="/academics" component={AcademicsPage} />
        <Route path="/facilities" component={FacilitiesPage} />
        <Route path="/gallery" component={GalleryPage} />
        <Route path="/admissions" component={AdmissionsPage} />
        <Route path="/news" component={NewsPage} />
        <Route path="/cbse" component={CBSEPage} />
        <Route path="/contact" component={ContactPage} />
        <Route path="/privacy-policy" component={PrivacyPolicyPage} />
        <Route path="/terms" component={TermsPage} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;