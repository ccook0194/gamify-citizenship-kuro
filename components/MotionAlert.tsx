import { motion, AnimatePresence } from 'framer-motion';
import { Twitter, FileText, UserCheck, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

interface AlertProps {
  title: string;
  message: string;
  onClose: () => void;
}

const steps = [
  {
    title: 'Fetching Twitter Data',
    icon: Twitter,
    description: 'We are retrieving your Twitter profile information...',
  },
  {
    title: 'Creating Application',
    icon: FileText,
    description: 'We are preparing your citizenship application...',
  },
  {
    title: 'Mayor Review',
    icon: UserCheck,
    description: 'The Mayor is carefully evaluating your application...',
  },
];

const MotionAlert = ({ title, message, onClose }: AlertProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) return prev + 1;
        clearInterval(timer);
        return prev;
      });
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl p-8 max-w-lg w-full mx-4"
        >
          <div className="space-y-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep;
              const isComplete = index < currentStep;

              return (
                <motion.div
                  key={step.title}
                  initial={false}
                  animate={{
                    opacity: isActive || isComplete ? 1 : 0.5,
                  }}
                  className="flex items-center gap-4"
                >
                  <div className="bg-pink-100 p-3 rounded-full">
                    {isActive ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      >
                        <Loader2 className="w-6 h-6 text-pink-600" />
                      </motion.div>
                    ) : (
                      <Icon className="w-6 h-6 text-pink-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-title font-bold text-pink-600">{step.title}</h3>
                    <p className="text-sm text-black/70 font-body">{step.description}</p>
                  </div>
                </motion.div>
              );
            })}

            {currentStep === steps.length - 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="pt-4 border-t"
              >
                <h4 className="font-title font-bold text-pink-600 text-lg mb-2">{title}</h4>
                <p className="text-black/70 font-body mb-4">{message}</p>
                <button
                  onClick={onClose}
                  className="w-full bg-black text-white py-2 rounded-xl hover:bg-black/80 transition-colors font-medium"
                >
                  Close
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MotionAlert;
