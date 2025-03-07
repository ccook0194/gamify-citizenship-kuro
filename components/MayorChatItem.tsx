import { motion } from 'framer-motion';
import TypingEffect from './TypingEffect';

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 120, damping: 12 },
  },
  exit: { opacity: 0, y: 20, transition: { duration: 0.3 } },
};

const MayorChatItem = ({ chat }: { chat: any }) => {
  // render ui for chat question
  if (chat.type === 'question') {
    return (
      <motion.div
        className="rounded-2xl border-2 border-black bg-blue-100 p-3 shadow-[2px_2px_0_0_black] w-auto max-w-sm mb-2"
        variants={itemVariants}
      >
        <p className="text-xs text-gray-600">
          <TypingEffect text={chat.text} />
        </p>
      </motion.div>
    );
  }

  // render ui for user chat response
  return (
    <motion.div
      className="rounded-2xl border-2 border-black bg-white p-3 shadow-[2px_2px_0_0_black] w-auto max-w-sm mb-2 self-end ml-auto"
      variants={itemVariants}
    >
      <p className="text-xs text-gray-600">{chat.text}</p>
    </motion.div>
  );
};

export default MayorChatItem;
