import { motion } from 'framer-motion';
import { FileText, ExternalLink } from 'lucide-react';

const disclosureItems = [
  { label: 'School Name', value: 'Swami Bharmanand Gurukul' },
  { label: 'Affiliation No.', value: 'To be updated' },
  { label: 'School Code', value: 'To be updated' },
  { label: 'Complete Address', value: 'Jind Road, Pundri, Kaithal, Haryana – 136026' },
  { label: 'Principal Name', value: 'To be updated' },
  { label: 'Contact No.', value: '9255145421 / 9996122410' },
  { label: 'Email', value: 'gurukulbanipundri@gmail.com' },
  { label: 'Website', value: 'www.sbgpundri.com' },
  { label: 'Year of Establishment', value: '1999' },
  { label: 'Status of Affiliation', value: 'Permanent / Provisional' },
  { label: 'Affiliation Period', value: 'To be updated' },
  { label: 'Type of School', value: 'Co-Educational' },
  { label: 'Medium of Instruction', value: 'Hindi & English' },
  { label: 'Classes Offered', value: 'Nursery to Class XII' },
];

const documents = [
  { name: 'Affiliation Letter', href: '/contact' },
  { name: 'Trust / Society Certificate', href: '/contact' },
  { name: 'NOC from State Govt.', href: '/contact' },
  { name: 'Recognition Certificate', href: '/contact' },
  { name: 'Building Safety Certificate', href: '/contact' },
  { name: 'Fire Safety Certificate', href: '/contact' },
  { name: 'Self Certification', href: '/contact' },
  { name: 'Water, Health & Sanitation Certificate', href: '/contact' },
];

export function MandatoryDisclosure() {
  return (
    <section id="mandatory-disclosure" className="py-20 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-block text-sm font-semibold tracking-widest text-primary uppercase mb-3">
            Transparency & Compliance
          </span>
          <h2 className="text-3xl md:text-4xl font-bold font-serif text-foreground mb-4">
            Mandatory Disclosure
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full mb-4" />
          <p className="text-foreground/60 text-sm max-w-xl mx-auto">
            As per CBSE Affiliation Bye-Laws, the following information is disclosed for public reference.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* School Info Table */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm"
          >
            <div className="bg-primary/10 px-6 py-4 border-b border-border">
              <h3 className="font-bold text-lg text-foreground font-serif">School Information</h3>
            </div>
            <div className="divide-y divide-border">
              {disclosureItems.map((item) => (
                <div key={item.label} className="flex px-6 py-3 gap-4">
                  <span className="text-sm font-medium text-foreground/60 min-w-[160px] shrink-0">{item.label}</span>
                  <span className="text-sm text-foreground font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Documents */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
              <div className="bg-primary/10 px-6 py-4 border-b border-border">
                <h3 className="font-bold text-lg text-foreground font-serif">Documents & Certificates</h3>
              </div>
              <div className="divide-y divide-border">
                {documents.map((doc) => (
                  <a
                    key={doc.name}
                    href={doc.href}
                    className="flex items-center justify-between px-6 py-3 hover:bg-accent/50 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-primary shrink-0" />
                      <span className="text-sm text-foreground">{doc.name}</span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-foreground/30 group-hover:text-primary transition-colors" />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
