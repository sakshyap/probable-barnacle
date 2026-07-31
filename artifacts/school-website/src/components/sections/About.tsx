import { motion } from 'framer-motion';
import { BookOpen, Star, Shield } from 'lucide-react';

export function About() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <section id="about" className="py-24 bg-background relative overflow-hidden">
      {/* Decorative background pattern */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -z-10 mix-blend-multiply dark:mix-blend-lighten" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[100px] -z-10 mix-blend-multiply dark:mix-blend-lighten" />

      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="max-w-3xl mx-auto"
        >
          {/* Left Column: Text content */}
          <div className="space-y-8">
            <motion.div variants={itemVariants}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 text-secondary mb-4 border border-accent/50 dark:text-accent">
                <BookOpen className="w-4 h-4" />
                <span className="text-sm font-semibold tracking-wide uppercase">Our Heritage</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold font-serif text-foreground mb-6">
                Rooted in Tradition, <br />
                <span className="text-primary italic">Ready for Tomorrow.</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Founded in the sacred Gurukul tradition, Swami Bharmanand Gurukul was established to revive the ancient Indian educational philosophy while equipping students with modern competencies. We don't just teach subjects; we mold character.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="grid sm:grid-cols-2 gap-6">
              <div className="bg-card p-6 rounded-2xl shadow-sm border border-border/50 hover:shadow-md transition-shadow relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-bl-full -z-10 transition-transform group-hover:scale-150" />
                <Star className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2 font-serif text-foreground">Our Mission</h3>
                <p className="text-muted-foreground text-sm">To impart holistic education that balances intellectual rigor with spiritual and ethical grounding, preparing youth for a complex world.</p>
              </div>
              <div className="bg-card p-6 rounded-2xl shadow-sm border border-border/50 hover:shadow-md transition-shadow relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-16 h-16 bg-accent/20 rounded-bl-full -z-10 transition-transform group-hover:scale-150" />
                <Shield className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2 font-serif text-foreground">Our Vision</h3>
                <p className="text-muted-foreground text-sm">To be a luminous center of learning where students develop a deep sense of cultural identity alongside global excellence.</p>
              </div>
            </motion.div>
          </div>

        </motion.div>
      </div>
    </section>
  );
}
