import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { 
  GraduationCap, 
  MonitorPlay, 
  HeartHandshake, 
  Dumbbell, 
  Laptop, 
  Library, 
  Music, 
  ShieldCheck, 
  Scale, 
  TrendingUp 
} from 'lucide-react';

const features = [
  { icon: GraduationCap, title: 'Experienced Faculty', desc: 'Highly qualified educators dedicated to student success.', href: '/about' },
  { icon: MonitorPlay, title: 'Smart Classrooms', desc: 'Interactive panels and digital learning tools.', href: '/facilities' },
  { icon: HeartHandshake, title: 'Value-Based Education', desc: 'Rooted in Indian ethos and moral values.', href: '/about' },
  { icon: Dumbbell, title: 'Sports Facilities', desc: 'Extensive grounds for physical development.', href: '/facilities' },
  { icon: Laptop, title: 'Computer Lab', desc: 'State-of-the-art tech infrastructure.', href: '/facilities' },
  { icon: Library, title: 'Rich Library', desc: 'Thousands of books for academic and spiritual growth.', href: '/facilities' },
  { icon: Music, title: 'Cultural Activities', desc: 'Fostering creativity through art, music, and dance.', href: '/gallery' },
  { icon: ShieldCheck, title: 'Safe Campus', desc: '24/7 CCTV surveillance and secure environment.', href: '/facilities' },
  { icon: Scale, title: 'Discipline', desc: 'A core Gurukul value for personal foundation.', href: '/about' },
  { icon: TrendingUp, title: 'Personality Dev.', desc: 'Holistic focus on mind, body, and spirit.', href: '/about' },
];

export function Features() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary font-semibold tracking-wider uppercase text-sm mb-2 block">Why Choose Us</span>
          <h2 className="text-3xl md:text-5xl font-bold font-serif text-foreground mb-6">
            The Gurukul Advantage
          </h2>
          <p className="text-muted-foreground text-lg">
            We provide a comprehensive ecosystem designed to nurture every aspect of a child's development.
          </p>
        </div>

        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.li
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="bg-card hover:bg-primary group rounded-2xl p-6 text-center shadow-sm border border-border/50 hover:shadow-xl transition-all duration-300 flex flex-col items-center"
              >
                <div className="w-14 h-14 rounded-full bg-primary/10 group-hover:bg-white/20 flex items-center justify-center mb-4 transition-colors">
                  <Icon className="w-7 h-7 text-primary group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-bold text-foreground group-hover:text-white mb-2 transition-colors">
                  {feature.href ? (
                    <Link
                      href={feature.href}
                      className="underline-offset-4 hover:underline"
                      aria-label={`Learn more about ${feature.title}`}
                    >
                      {feature.title}
                    </Link>
                  ) : (
                    feature.title
                  )}
                </h3>
                <p className="text-sm text-muted-foreground group-hover:text-white/80 transition-colors leading-relaxed">
                  {feature.desc}
                </p>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
