import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Users, GraduationCap, Trophy, History } from 'lucide-react';

const stats = [
  { id: 1, label: 'Happy Students', value: 2500, suffix: '+', icon: Users },
  { id: 2, label: 'Expert Teachers', value: 120, suffix: '+', icon: GraduationCap },
  { id: 3, label: 'Awards Won', value: 85, suffix: '+', icon: Trophy },
  { id: 4, label: 'Years of Excellence', value: 25, suffix: '+', icon: History },
];

function Counter({ from, to, duration = 2 }: { from: number; to: number; duration?: number }) {
  const [count, setCount] = useState(from);
  const nodeRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(nodeRef, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!inView) return;

    let startTime: number;
    let animationFrame: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      
      // Easing function (easeOutExpo)
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      setCount(Math.floor(easeProgress * (to - from) + from));

      if (progress < 1) {
        animationFrame = window.requestAnimationFrame(step);
      }
    };

    animationFrame = window.requestAnimationFrame(step);

    return () => window.cancelAnimationFrame(animationFrame);
  }, [from, to, duration, inView]);

  return <span ref={nodeRef}>{count}</span>;
}

export function Achievements() {
  return (
    <section className="py-20 bg-secondary text-white relative overflow-hidden">
      {/* Subtle mandala pattern background - simulated with radial gradients */}
      <div className="absolute inset-0 opacity-10" 
           style={{ 
             backgroundImage: 'radial-gradient(circle at 50% 50%, var(--primary) 2px, transparent 2px)', 
             backgroundSize: '40px 40px' 
           }} 
      />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col items-center text-center space-y-4"
              >
                <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-primary rotate-3 hover:rotate-0 transition-transform duration-300">
                  <Icon className="w-8 h-8" />
                </div>
                <div>
                  <div className="text-4xl md:text-5xl font-bold font-serif text-white mb-2 flex items-center justify-center">
                    <Counter from={0} to={stat.value} />
                    <span className="text-primary ml-1">{stat.suffix}</span>
                  </div>
                  <p className="text-secondary-foreground font-medium uppercase tracking-wider text-xs md:text-sm">
                    {stat.label}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
