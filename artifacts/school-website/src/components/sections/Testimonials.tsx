import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Mr. Arvind Gupta',
    role: 'Parent of Class 10 Student',
    text: 'The blend of traditional values and modern education here is unparalleled. My son has not only improved academically but has become much more disciplined and respectful.',
    rating: 5
  },
  {
    id: 2,
    name: 'Priya Sharma',
    role: 'Alumna, Batch of 2018',
    text: 'The foundational years at the Gurukul shaped my character. The teachers focus on individual growth, and the peaceful environment makes learning a joy.',
    rating: 5
  },
  {
    id: 3,
    name: 'Mrs. Sunita Verma',
    role: 'Parent of Class 6 Student',
    text: 'I was worried about the transition from the city, but the hostel wardens are like parents. The daily yoga and morning assembly routine is beautiful.',
    rating: 5
  },
  {
    id: 4,
    name: 'Rahul Deshmukh',
    role: 'Class 12 Science Student',
    text: 'The science labs are excellent and the faculty for competitive exams is very supportive. I feel well-prepared for my medical entrance exams.',
    rating: 4
  }
];

export function Testimonials() {
  const [current, setCurrent] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  }, []);

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <section className="py-24 bg-secondary text-secondary-foreground relative overflow-hidden">
      <Quote className="absolute top-10 left-10 w-48 h-48 text-white/5 rotate-180 -z-0" />
      <Quote className="absolute bottom-10 right-10 w-48 h-48 text-white/5 -z-0" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary font-semibold tracking-wider uppercase text-sm mb-2 block">Testimonials</span>
          <h2 className="text-3xl md:text-5xl font-bold font-serif text-white">
            What Parents Say
          </h2>
        </div>

        <div className="max-w-4xl mx-auto relative h-[300px] md:h-[250px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex flex-col items-center text-center"
            >
              <div className="flex space-x-1 mb-6 text-primary">
                {[...Array(testimonials[current].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              
              <p className="text-xl md:text-2xl font-serif italic text-white/90 mb-8 leading-relaxed max-w-3xl">
                "{testimonials[current].text}"
              </p>
              
              <div>
                <h4 className="text-lg font-bold text-white">{testimonials[current].name}</h4>
                <p className="text-primary text-sm">{testimonials[current].role}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-center mt-8 space-x-2">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`box-content w-3 h-3 p-4 rounded-full transition-all duration-300 flex items-center justify-center ${
                current === idx ? 'bg-primary w-8' : 'bg-white/20 hover:bg-white/40'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
