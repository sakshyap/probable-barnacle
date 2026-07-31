import { motion } from 'framer-motion';
import studentImg from '@assets/image_1785474392844.png';

const photos = [
  { src: studentImg, caption: 'Student Events & Activities' },
  { src: studentImg, caption: 'Annual Cultural Program' },
  { src: studentImg, caption: 'Sports Day Celebration' },
  { src: studentImg, caption: 'Vedic Recitation Competition' },
  { src: studentImg, caption: 'Science Exhibition' },
  { src: studentImg, caption: 'Prize Distribution Ceremony' },
];

export function GallerySection() {
  return (
    <section id="gallery" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-block text-sm font-semibold tracking-widest text-primary uppercase mb-3">
            Our Moments
          </span>
          <h2 className="text-3xl md:text-4xl font-bold font-serif text-foreground mb-4">
            Photo Gallery
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {photos.map((photo, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group relative overflow-hidden rounded-2xl shadow-md aspect-[4/3]"
            >
              <img
                src={photo.src}
                alt={photo.caption}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-[#0A2540]/0 group-hover:bg-[#0A2540]/60 transition-all duration-300 flex items-end">
                <p className="text-white text-sm font-medium px-4 py-3 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  {photo.caption}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
