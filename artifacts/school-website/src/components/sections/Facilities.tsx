import { motion } from 'framer-motion';
import smartClassImg from '@assets/generated_images/facility-smart-class.jpg';
import scienceImg from '@assets/generated_images/facility-science.jpg';
import computerImg from '@assets/generated_images/facility-computer.jpg';
import libraryImg from '@assets/generated_images/facility-library.jpg';
import hostelImg from '@assets/generated_images/facility-hostel.jpg';
import sportsImg from '@assets/generated_images/facility-sports.jpg';
import transportImg from '@assets/generated_images/facility-transport.jpg';
import medicalImg from '@assets/generated_images/facility-medical.jpg';

const facilities = [
  { id: 1, name: 'Smart Classrooms', img: smartClassImg, desc: 'Interactive panels for engaging visual learning.' },
  { id: 2, name: 'Science Labs', img: scienceImg, desc: 'Well-equipped Physics, Chemistry, and Bio labs.' },
  { id: 3, name: 'Computer Lab', img: computerImg, desc: 'Modern systems with high-speed internet.' },
  { id: 4, name: 'Rich Library', img: libraryImg, desc: 'Vast collection of academic and spiritual texts.' },
  { id: 5, name: 'Gurukul Hostel', img: hostelImg, desc: 'Disciplined and warm residential facilities.' },
  { id: 6, name: 'Sports Complex', img: sportsImg, desc: 'Expansive grounds for physical development.' },
  { id: 7, name: 'Transport Fleet', img: transportImg, desc: 'Safe school buses covering a 30km radius.' },
  { id: 8, name: 'Medical Facility', img: medicalImg, desc: 'On-campus infirmary with trained staff.' },
];

export function Facilities() {
  return (
    <section id="facilities" className="py-24 bg-muted/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary font-semibold tracking-wider uppercase text-sm mb-2 block">Campus Life</span>
          <h2 className="text-3xl md:text-5xl font-bold font-serif text-foreground mb-6">
            World-Class Facilities
          </h2>
          <p className="text-muted-foreground text-lg">
            A serene, pollution-free environment equipped with modern infrastructure to support holistic learning.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {facilities.map((facility, index) => (
            <motion.div
              key={facility.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative rounded-2xl overflow-hidden shadow-sm aspect-[4/3] cursor-pointer"
            >
              <img 
                src={facility.img} 
                alt={facility.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 via-secondary/40 to-transparent transition-opacity duration-300" />
              
              <div className="absolute inset-x-0 bottom-0 p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-xl font-bold text-white mb-2">{facility.name}</h3>
                <p className="text-white/80 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                  {facility.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
