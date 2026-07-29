import { motion } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';

export function FloatingWhatsApp() {
  return (
    <motion.a
      href="https://wa.me/911746000000"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-24 right-6 z-50 flex items-center justify-center h-14 w-14 rounded-full bg-[#25D366] text-white shadow-lg hover:scale-110 transition-transform"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label="Chat on WhatsApp"
    >
      <FaWhatsapp className="h-8 w-8" />
    </motion.a>
  );
}
