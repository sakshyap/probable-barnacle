import { motion } from 'framer-motion';
import { Calendar, ArrowRight, BellRing } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'wouter';

const news = [
  {
    id: 1,
    title: 'Admissions Open for Session 2024-25',
    date: 'March 15, 2024',
    category: 'Admissions',
    desc: 'Registration for classes Nursery to IX and XI has commenced. Early bird concessions apply.'
  },
  {
    id: 2,
    title: 'Annual Exam Schedule Released',
    date: 'February 28, 2024',
    category: 'Academics',
    desc: 'The date sheet for final term examinations is now available on the student portal.'
  },
  {
    id: 3,
    title: 'Summer Holiday Camp Announcement',
    date: 'February 20, 2024',
    category: 'Events',
    desc: 'Special Vedic Maths and Yoga camp will be held during the summer vacations.'
  },
  {
    id: 4,
    title: 'CBSE Board Results 2023-24',
    date: 'May 12, 2024',
    category: 'Achievements',
    desc: '100% pass result with 45 students scoring above 90% in Class XII Board Exams.'
  }
];

export function News() {
  const [location] = useLocation();

  return (
    <section id="news" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row gap-12">
          
          <div className="lg:w-1/3">
            <div className="sticky top-24">
              <span className="text-primary font-semibold tracking-wider uppercase text-sm mb-2 block">Stay Updated</span>
              <h2 className="text-3xl md:text-5xl font-bold font-serif text-foreground mb-6">
                Notice Board
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                Keep track of all the latest happenings, announcements, and important dates at the Gurukul.
              </p>
              {location !== '/news' && (
                <Button asChild className="bg-secondary text-white hover:bg-secondary/90 shadow-lg group">
                  <Link href="/news">
                    View All Notices
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              )}
            </div>
          </div>
          
          <div className="lg:w-2/3">
            <div className="space-y-6">
              {news.map((item, index) => (
                <motion.article
                  key={item.id}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-card p-6 rounded-2xl shadow-sm border border-border/60 hover:shadow-md transition-shadow relative overflow-hidden group"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/20 group-hover:bg-primary transition-colors" />
                  
                  <div className="flex flex-col sm:flex-row justify-between gap-4 mb-3">
                    <span className="inline-block px-3 py-1 bg-accent/20 text-secondary dark:text-accent text-xs font-bold rounded-full w-fit border border-accent/30">
                      {item.category}
                    </span>
                    <div className="flex items-center text-sm text-muted-foreground font-medium">
                      <Calendar className="w-4 h-4 mr-2" />
                      {item.date}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold font-serif text-foreground mb-2 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {item.desc}
                  </p>
                </motion.article>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
