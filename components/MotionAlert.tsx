import { motion, AnimatePresence } from 'framer-motion';
import { PartyPopper } from 'lucide-react';

interface AlertProps {
  title: string;
  message: string;
  onClose: () => void;
}

const MotionAlert = ({ title, message, onClose }: AlertProps) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
        className="fixed top-8 left-1/3 z-50"
      >
        <div className="bg-green-100 p-4 rounded-2xl border-2 border-black shadow-[2px_2px_0_0_black] min-w-[300px]">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <h4 className="text-lg text-green-800 font-bold font-title">{title}</h4>
              <PartyPopper className="text-green-800" />
            </div>
            <button
              onClick={onClose}
              aria-label="Close alert"
              className="text-black text-green-800 hover:text-black/70 transition-colors text-xl"
            >
              ×
            </button>
          </div>
          <p className="text-sm text-black/70 font-body">{message}</p>
          <motion.div
            key={title + message} // Reset animation if alert content changes
            className="h-1 bg-black/10 mt-3 rounded-full"
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ duration: 5, ease: 'linear' }}
            onAnimationComplete={onClose}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MotionAlert;
