import { motion } from 'framer-motion';
import { Eye, Target, Heart } from 'lucide-react';

const cards = [
  {
    icon: Eye,
    title: 'Our Vision',
    color: 'bg-saffron/10 text-saffron border-saffron/20',
    desc: 'To be a leading institution that nurtures young minds with Vedic wisdom and modern knowledge, producing well-rounded individuals who serve society with integrity, compassion, and excellence.',
  },
  {
    icon: Target,
    title: 'Our Mission',
    color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    desc: 'To provide holistic education that integrates traditional Indian values with contemporary curriculum, fostering academic excellence, moral character, physical fitness, and cultural pride in every student.',
  },
  {
    icon: Heart,
    title: 'Our Values',
    color: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
    desc: 'Discipline (अनुशासन), Knowledge (ज्ञान), Culture (संस्कार), Respect (सम्मान), and Service (सेवा) — these five pillars guide every aspect of life at Swami Bharmanand Gurukul.',
  },
];

export function Vision() {
  return (
    <section id="vision" className="py-20 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-block text-sm font-semibold tracking-widest text-primary uppercase mb-3">
            What We Stand For
          </span>
          <h2 className="text-3xl md:text-4xl font-bold font-serif text-foreground mb-4">
            Vision, Mission & Values
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="bg-card border border-border rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl border ${card.color} mb-6`}>
                <card.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold font-serif text-foreground mb-3">{card.title}</h3>
              <p className="text-foreground/70 leading-relaxed">{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
