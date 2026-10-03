import { motion } from 'framer-motion';
import { Award, BookOpen, CheckCircle, ExternalLink } from 'lucide-react';

const highlights = [
  { icon: Award, title: 'CBSE Affiliated', desc: 'Swami Bharmanand Gurukul is affiliated with the Central Board of Secondary Education (CBSE), New Delhi — ensuring nationally recognized standards of education.' },
  { icon: BookOpen, title: 'NCERT Curriculum', desc: 'We follow the NCERT syllabus as prescribed by CBSE for all classes from I to XII, ensuring uniformity and quality in education.' },
  { icon: CheckCircle, title: 'Regular Inspections', desc: 'Our school undergoes regular CBSE inspections to maintain affiliation standards in academics, infrastructure, and faculty qualifications.' },
];

const cbseLinks = [
  { name: 'CBSE Official Website', url: 'https://cbse.gov.in' },
  { name: 'CBSE Results Portal', url: 'https://results.cbse.nic.in' },
  { name: 'CBSE Digital Academic Documents', url: 'https://parinam.cbse.gov.in' },
  { name: 'CBSE Affiliation Bye-Laws', url: 'https://cbseacademic.nic.in' },
  { name: 'National Scholarship Portal', url: 'https://scholarships.gov.in' },
  { name: 'CBSE Sample Papers', url: 'https://cbseacademic.nic.in/SQP_CLASSX.html' },
];

export function CBSESection() {
  return (
    <section id="cbse" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-block text-sm font-semibold tracking-widest text-primary uppercase mb-3">
            Board Affiliation
          </span>
          <h2 className="text-3xl md:text-4xl font-bold font-serif text-foreground mb-4">
            CBSE Corner
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {highlights.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="bg-card border border-border rounded-2xl p-7 shadow-sm"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-5">
                <item.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-serif text-foreground mb-2">{item.title}</h3>
              <p className="text-foreground/70 text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Important Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm"
        >
          <div className="bg-primary/10 px-6 py-4 border-b border-border">
            <h3 className="font-bold text-lg text-foreground font-serif">Important CBSE Links</h3>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border">
            {cbseLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-6 py-4 hover:bg-accent/50 transition-colors group border-b border-border last:border-b-0"
              >
                <span className="text-sm text-foreground font-medium">{link.name}</span>
                <ExternalLink className="w-4 h-4 text-foreground/30 group-hover:text-primary transition-colors shrink-0 ml-2" />
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
