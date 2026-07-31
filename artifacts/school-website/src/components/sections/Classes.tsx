import { motion } from 'framer-motion';
import { BookOpen, Users, Clock, ChevronRight } from 'lucide-react';

const classGroups = [
  {
    label: 'Pre-Primary',
    range: 'Nursery, LKG, UKG',
    color: 'border-pink-400 bg-pink-50 dark:bg-pink-950/30',
    badge: 'bg-pink-100 text-pink-700 dark:bg-pink-900/50 dark:text-pink-300',
    subjects: ['English', 'Hindi', 'EVS', 'Drawing & Craft', 'Music & Dance', 'Yoga'],
    timing: '8:00 AM – 12:30 PM',
    strength: 'Up to 30 per section',
  },
  {
    label: 'Primary',
    range: 'Classes I – V',
    color: 'border-blue-400 bg-blue-50 dark:bg-blue-950/30',
    badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
    subjects: ['English', 'Hindi', 'Mathematics', 'EVS / Science', 'Social Studies', 'Sanskrit', 'Computer'],
    timing: '8:00 AM – 2:30 PM',
    strength: 'Up to 40 per section',
  },
  {
    label: 'Middle',
    range: 'Classes VI – VIII',
    color: 'border-green-400 bg-green-50 dark:bg-green-950/30',
    badge: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
    subjects: ['English', 'Hindi', 'Mathematics', 'Science', 'Social Science', 'Sanskrit', 'Computer'],
    timing: '8:00 AM – 3:00 PM',
    strength: 'Up to 40 per section',
  },
  {
    label: 'Secondary',
    range: 'Classes IX – X',
    color: 'border-orange-400 bg-orange-50 dark:bg-orange-950/30',
    badge: 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300',
    subjects: ['English', 'Hindi', 'Mathematics', 'Science', 'Social Science', 'IT / Sanskrit'],
    timing: '8:00 AM – 3:30 PM',
    strength: 'Up to 40 per section',
  },
  {
    label: 'Senior Secondary',
    range: 'Classes XI – XII',
    color: 'border-purple-400 bg-purple-50 dark:bg-purple-950/30',
    badge: 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300',
    subjects: ['Science Stream: Physics, Chemistry, Biology / Maths', 'Commerce Stream: Accountancy, Business Studies, Economics', 'Common: English, Hindi, Physical Education'],
    timing: '8:00 AM – 3:30 PM',
    strength: 'Up to 35 per section',
  },
];

export function Classes() {
  return (
    <section id="classes" className="py-20 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-block text-sm font-semibold tracking-widest text-primary uppercase mb-3">
            Academic Structure
          </span>
          <h2 className="text-3xl md:text-4xl font-bold font-serif text-foreground mb-4">
            Classes & Curriculum
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full mb-4" />
          <p className="text-foreground/60 max-w-2xl mx-auto">
            From Nursery to Class XII, we offer a structured, CBSE-aligned curriculum with a balance of academics, co-curricular activities, and Vedic learning.
          </p>
        </motion.div>

        <div className="flex flex-col gap-6">
          {classGroups.map((group, i) => (
            <motion.div
              key={group.label}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`border-l-4 rounded-2xl p-6 md:p-8 ${group.color}`}
            >
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                <div className="md:min-w-[180px]">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold mb-2 ${group.badge}`}>
                    {group.label}
                  </span>
                  <p className="text-foreground font-semibold text-lg font-serif">{group.range}</p>
                  <div className="mt-3 flex flex-col gap-1.5">
                    <div className="flex items-center gap-2 text-foreground/60 text-xs">
                      <Clock className="w-3.5 h-3.5 shrink-0" />
                      <span>{group.timing}</span>
                    </div>
                    <div className="flex items-center gap-2 text-foreground/60 text-xs">
                      <Users className="w-3.5 h-3.5 shrink-0" />
                      <span>{group.strength}</span>
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen className="w-4 h-4 text-foreground/50" />
                    <span className="text-sm font-semibold text-foreground/70 uppercase tracking-wide">Subjects</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {group.subjects.map((sub) => (
                      <span key={sub} className="flex items-center gap-1 text-sm text-foreground/80 bg-background/70 border border-border/60 rounded-lg px-3 py-1">
                        <ChevronRight className="w-3 h-3 text-primary shrink-0" />
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
