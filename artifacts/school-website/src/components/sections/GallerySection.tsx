import { motion } from 'framer-motion';
import { ImageOff } from 'lucide-react';

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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col items-center justify-center py-20 text-center bg-card border border-dashed border-border rounded-2xl"
        >
          <ImageOff className="w-12 h-12 text-foreground/20 mb-4" />
          <p className="text-foreground/40 text-lg font-medium">Photos coming soon</p>
          <p className="text-foreground/30 text-sm mt-1">School photos will be added here shortly.</p>
        </motion.div>
      </div>
    </section>
  );
}
