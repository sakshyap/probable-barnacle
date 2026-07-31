import { motion } from 'framer-motion';
import { BookOpen, Star, Shield, Users } from 'lucide-react';
import principalImg from '@assets/image_1785474123355.png';

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
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
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

          {/* Right Column: Principal & Philosophy */}
          <motion.div variants={itemVariants} className="relative">
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border-4 border-white dark:border-secondary-foreground">
              <img 
                src={principalImg} 
                alt="Principal of Swami Bharmanand Gurukul" 
                className="w-full aspect-[4/5] object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8 text-white">
                <h3 className="text-2xl font-bold font-serif">Our Principal</h3>
                <p className="text-accent font-medium mb-4">Swami Bharmanand Gurukul, Pundri</p>
                <p className="text-sm italic text-white/90 leading-relaxed border-l-2 border-primary pl-4">
                  "Education is not merely the accumulation of facts; it is the awakening of the soul. At our Gurukul, we nurture the intellect, discipline the body, and purify the heart."
                </p>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-6 -left-6 md:-left-12 bg-white dark:bg-card p-4 rounded-xl shadow-xl border border-border flex items-center gap-4 z-20">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">25+</p>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Years of Legacy</p>
              </div>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}
