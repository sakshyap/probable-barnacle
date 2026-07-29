import { motion } from 'framer-motion';
import { ClipboardList, FileCheck, FileSearch, UserCheck, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const steps = [
  { icon: ClipboardList, title: 'Submit Application', desc: 'Fill out the registration form online or at the school reception.' },
  { icon: FileSearch, title: 'Document Verification', desc: 'Submit previous academic records, birth certificate, and ID proofs.' },
  { icon: FileCheck, title: 'Entrance Test', desc: 'A basic assessment test for classes 1 and above.' },
  { icon: UserCheck, title: 'Interview', desc: 'Interaction with the Principal to align values and expectations.' },
  { icon: CheckCircle2, title: 'Confirmation', desc: 'Fee payment and seat confirmation.' },
];

export function Admissions() {
  return (
    <section id="admissions" className="py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary font-semibold tracking-wider uppercase text-sm mb-2 block">Join the Family</span>
          <h2 className="text-3xl md:text-5xl font-bold font-serif text-foreground mb-6">
            Admission Process
          </h2>
          <p className="text-muted-foreground text-lg">
            We welcome students from all backgrounds who seek a disciplined, value-based education system.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Timeline / Process */}
          <div className="relative">
            <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-border/80 hidden md:block" />
            
            <div className="space-y-8">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="relative flex items-start gap-6 group"
                  >
                    <div className="relative z-10 w-16 h-16 shrink-0 rounded-full bg-card border-2 border-primary flex items-center justify-center shadow-md group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                      <Icon className="w-7 h-7 text-primary group-hover:text-white transition-colors" />
                    </div>
                    <div className="pt-3">
                      <h3 className="text-xl font-bold text-foreground mb-2">
                        {index + 1}. {step.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {step.desc}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-accent/10 border border-accent/30 rounded-3xl p-8 lg:p-12 shadow-lg"
          >
            <h3 className="text-2xl font-bold font-serif text-secondary dark:text-white mb-6">Eligibility & Documents</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-foreground mb-2 flex items-center">
                  <div className="w-2 h-2 rounded-full bg-primary mr-2" /> Required Documents
                </h4>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                  <li>Birth Certificate (Municipal Corp)</li>
                  <li>Transfer Certificate (TC) in original</li>
                  <li>Last Report Card / Marksheet</li>
                  <li>Aadhar Card copies of student & parents</li>
                  <li>4 Passport size photographs</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-2 flex items-center">
                  <div className="w-2 h-2 rounded-full bg-primary mr-2" /> Age Criteria
                </h4>
                <p className="text-muted-foreground ml-4">
                  For Class 1, the child must be 6 years old as of 31st March of the admission year.
                </p>
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-border/50 text-center">
              <p className="font-medium text-foreground mb-6">Admissions for 2024-25 are currently open.</p>
              <Button size="lg" className="w-full sm:w-auto bg-primary text-white hover:bg-primary/90 text-lg py-6 px-10 rounded-full shadow-lg hover:shadow-xl transition-all">
                Apply Now Online
              </Button>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
