import { motion, AnimatePresence } from 'framer-motion';
import { Twitter } from 'lucide-react';
import ImagesLinks from '../utils/ImagesLinks';

interface WelcomeCitizenProps {
  isOpen: boolean;
  onClose: () => void;
}

const WelcomeCitizen = ({ isOpen, onClose }: WelcomeCitizenProps) => {
  const shareOnTwitter = () => {
    const text = "I'm now officially a citizen of Kuro Universe! 🎉 Join me";
    const url = typeof window !== 'undefined' ? window.location.origin : '';
    const hashtags = 'kurocatuniverse';

    const params = new URLSearchParams({
      text,
      url,
      hashtags,
    });

    const twitterUrl = `https://twitter.com/intent/tweet?${params.toString()}`;

    window.open(twitterUrl, '_blank');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-3xl p-8 max-w-lg w-full mx-4 text-center"
          >
            <h2 className="font-title text-3xl text-pink-600 mb-4">Welcome to Kuro Universe!</h2>
            <p className="font-body text-black/70 mb-6">
              Congratulations! You are now officially a citizen of Kuro Universe. Share this
              exciting news with your friends!
            </p>

            <div className="relative w-full aspect-video mb-6 rounded-xl overflow-hidden">
              <img
                src={ImagesLinks.welcomeCitizen}
                alt="Welcome to Kuro Universe"
                className="w-full h-full object-cover"
              />
            </div>

            <button
              onClick={shareOnTwitter}
              className="flex items-center justify-center gap-2 w-full bg-[#1DA1F2] text-white py-3 px-6 rounded-xl hover:bg-[#1a8cd8] transition-colors"
            >
              <Twitter className="w-5 h-5" />
              Share on Twitter
            </button>

            <button
              onClick={onClose}
              className="mt-4 text-black/50 hover:text-black/70 transition-colors"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeCitizen;
