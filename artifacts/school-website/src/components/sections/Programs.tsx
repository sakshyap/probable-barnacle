import { motion } from 'framer-motion';
import { BookA, Atom, Calculator, Palette, Briefcase, Microscope } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';

const programs = [
  {
    id: 'primary',
    title: 'Primary School',
    grades: 'Classes 1 - 5',
    icon: BookA,
    desc: 'Building a strong foundation with emphasis on conceptual clarity, languages, and moral values through play-way and activity-based learning.',
    color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
  },
  {
    id: 'middle',
    title: 'Middle School',
    grades: 'Classes 6 - 8',
    icon: Atom,
    desc: 'Transitioning to structured academic discipline. Introduction to applied sciences, advanced mathematics, and project-based learning.',
    color: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20'
  },
  {
    id: 'senior',
    title: 'Secondary',
    grades: 'Classes 9 - 10',
    icon: Calculator,
    desc: 'Rigorous preparation for board examinations with focused career counseling and comprehensive subject mastery.',
    color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20'
  },
  {
    id: 'science',
    title: 'Senior Sec. (Science)',
    grades: 'Classes 11 - 12',
    icon: Microscope,
    desc: 'Medical and Non-Medical streams equipped with state-of-the-art laboratories and specialized coaching for competitive exams.',
    color: 'bg-primary/10 text-primary border-primary/20'
  },
  {
    id: 'commerce',
    title: 'Senior Sec. (Commerce)',
    grades: 'Classes 11 - 12',
    icon: Briefcase,
    desc: 'Comprehensive curriculum covering Accountancy, Business Studies, and Economics to prepare future business leaders.',
    color: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20'
  },
  {
    id: 'arts',
    title: 'Senior Sec. (Arts)',
    grades: 'Classes 11 - 12',
    icon: Palette,
    desc: 'Humanities stream focusing on History, Political Science, Geography, and Languages to foster critical thinking.',
    color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
  }
];

export function Programs() {
  return (
    <section id="programs" className="py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <span className="text-primary font-semibold tracking-wider uppercase text-sm mb-2 block">Academic Journey</span>
            <h2 className="text-3xl md:text-5xl font-bold font-serif text-foreground mb-4">
              Programs Offered
            </h2>
            <p className="text-muted-foreground text-lg">
              Our curriculum follows the CBSE pattern, deeply integrated with Gurukul values to provide a balanced and rigorous academic experience.
            </p>
          </div>
          <Button asChild variant="outline" className="shrink-0 border-primary text-primary hover:bg-primary hover:text-white">
            <Link href="/admissions">
              Apply for Admission
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((prog, index) => {
            const Icon = prog.icon;
            return (
              <motion.div
                key={prog.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-xl transition-all duration-300 group"
              >
                <div className="p-8">
                  <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 border ${prog.color} transition-transform group-hover:-translate-y-2`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <div className="mb-2">
                    <span className="inline-block py-1 px-3 rounded-full bg-accent/20 text-foreground text-xs font-bold tracking-wider mb-3">
                      {prog.grades}
                    </span>
                    <h3 className="text-2xl font-bold font-serif text-foreground">{prog.title}</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed mt-4">
                    {prog.desc}
                  </p>
                </div>
                <div className="px-8 py-4 bg-muted border-t border-border mt-auto">
                  <Link href="/admissions" className="text-sm font-semibold text-primary flex items-center group-hover:translate-x-2 transition-transform">
                    View Admission Criteria
                    <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
