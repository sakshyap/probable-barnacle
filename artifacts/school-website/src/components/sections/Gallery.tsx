import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';

import studentsImg from '@assets/image_1785474392844.png';
import eventsImg from '@assets/generated_images/gallery-events.jpg';
import sportsImg from '@assets/generated_images/gallery-sports.jpg';
import classroomImg from '@assets/generated_images/gallery-classroom.jpg';
import assemblyImg from '@assets/generated_images/gallery-assembly.jpg';
import yogaImg from '@assets/generated_images/gallery-yoga.jpg';
import scienceFairImg from '@assets/generated_images/gallery-science-fair.jpg';

const images = [
  { id: 1, src: studentsImg, alt: 'Students — School Events & Activities', span: 'col-span-1 md:col-span-2 row-span-2' },
  { id: 2, src: assemblyImg, alt: 'Morning Assembly', span: 'col-span-1 md:col-span-2 row-span-2' },
  { id: 3, src: classroomImg, alt: 'Classroom Learning', span: 'col-span-1 row-span-1' },
  { id: 4, src: sportsImg, alt: 'Annual Sports Day', span: 'col-span-1 row-span-1' },
  { id: 5, src: eventsImg, alt: 'Cultural Events', span: 'col-span-1 row-span-2' },
  { id: 6, src: yogaImg, alt: 'Morning Yoga Session', span: 'col-span-1 md:col-span-2 row-span-1' },
  { id: 7, src: scienceFairImg, alt: 'Science Fair', span: 'col-span-1 row-span-1' },
];

export function Gallery() {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const openLightbox = (index: number) => setSelectedIdx(index);
  const closeLightbox = () => setSelectedIdx(null);
  
  const showNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIdx !== null) {
      setSelectedIdx((selectedIdx + 1) % images.length);
    }
  };
  
  const showPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIdx !== null) {
      setSelectedIdx((selectedIdx - 1 + images.length) % images.length);
    }
  };

  return (
    <section id="gallery" className="py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <span className="text-primary font-semibold tracking-wider uppercase text-sm mb-2 block">Our Memories</span>
            <h2 className="text-3xl md:text-5xl font-bold font-serif text-foreground">
              Photo Gallery
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[200px] gap-4">
          {images.map((img, index) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative group overflow-hidden rounded-xl cursor-pointer ${img.span}`}
              onClick={() => openLightbox(index)}
            >
              <img 
                src={img.src} 
                alt={img.alt} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-secondary/0 group-hover:bg-secondary/60 transition-colors duration-300 flex items-center justify-center">
                <p className="text-white font-serif font-bold text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-4 group-hover:translate-y-0 transform">
                  {img.alt}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Dialog */}
      <Dialog open={selectedIdx !== null} onOpenChange={(open) => !open && closeLightbox()}>
        <DialogContent className="max-w-5xl bg-transparent border-none shadow-none p-0 flex flex-col items-center justify-center h-[90vh]">
          <DialogTitle className="sr-only">Image Lightbox</DialogTitle>
          <DialogDescription className="sr-only">View images in full screen</DialogDescription>
          
          {selectedIdx !== null && (
            <div className="relative w-full h-full flex items-center justify-center group">
              <img 
                src={images[selectedIdx].src} 
                alt={images[selectedIdx].alt} 
                className="max-w-full max-h-full object-contain rounded-md"
              />
              
              <button 
                onClick={showPrev}
                className="absolute left-4 p-3 rounded-full bg-black/50 text-white hover:bg-primary transition-colors backdrop-blur-sm"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              
              <button 
                onClick={showNext}
                className="absolute right-4 p-3 rounded-full bg-black/50 text-white hover:bg-primary transition-colors backdrop-blur-sm"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
              
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/60 backdrop-blur-sm rounded-full text-white text-sm">
                {images[selectedIdx].alt} ({selectedIdx + 1} / {images.length})
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
