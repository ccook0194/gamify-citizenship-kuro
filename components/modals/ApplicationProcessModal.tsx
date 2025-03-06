import React, { ReactNode, useState } from 'react';
import { motion } from 'framer-motion';
import TypingEffect from '@/components/TypingEffect';
import { signIn, signOut } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 120, damping: 12 },
  },
  exit: { opacity: 0, y: 20, transition: { duration: 0.3 } },
};

const questions = [
  {
    id: '1',
    type: 'question',
    text: "Welcome to Kuro Town! I'm Mayor. Before we get started, I'd love to learn more about you!, What is your name? ",
  },
  {
    id: '2',
    type: 'question',
    text: 'What brings you to Kuro Town? Are you looking to become a resident, a visitor, or something else?',
  },
  {
    id: '3',
    type: 'question',
    text: 'Tell me a little about yourself. What do you do, and what are your interests?',
  },
  {
    id: '4',
    type: 'question',
    text: 'How do you see yourself contributing to the Kuro Town community?',
  },
  {
    id: '5',
    type: 'question',
    text: 'Would you like to receive updates and opportunities about Kuro Town?',
  },
  {
    id: '6',
    type: 'question',
    text: (
      <>
        <p>
          You're almost done! To complete your application, connect your Twitter account. This helps
          us keep our community engaged and informed.
        </p>

        <button
          onClick={() => signIn('twitter')}
          className="text-blue-600 underline cursor-pointer"
        >
          Click here to continue with the application
        </button>
      </>
    ),
  },
];

export default function ApplicationProcessModal() {
  const { data: session, status } = useSession();

  const [messages, setMessages] = useState<
    { id: string; type: string; text: string | ReactNode }[]
  >([questions[0]]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [inputValue, setInputValue] = useState<string>('');

  const handleNextQuestion = () => {
    if (inputValue.trim() !== '') {
      const newMessages = [
        ...messages,
        { id: `${messages.length + 1}`, type: 'answer', text: inputValue },
      ];
      setMessages(newMessages);
      setInputValue('');
      setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
          setMessages([...newMessages, questions[currentQuestionIndex + 1]]);
          setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
      }, 200);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      e.preventDefault();
      handleNextQuestion();
    }
  };

  return (
    <div className="p-4 flex flex-col">
      {status === 'authenticated' ? (
        <>
          <motion.div
            className="rounded-2xl border-2 border-black bg-green-100 p-3 shadow-[2px_2px_0_0_black] w-4/5 mb-2"
            variants={itemVariants}
          >
            <p className="text-xs text-gray-600">
              Congratulations, you have successfully linked your twitter account with Us
            </p>
          </motion.div>
        </>
      ) : (
        <>
          {messages.map((msg) => (
            <ChatItemInterface chat={msg} />
          ))}

          {currentQuestionIndex < 5 && (
            <div className="w-full mt-4 relative">
              <Textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                className="text-gray-700 placeholder:text-gray-300 min-h-[24px] resize-none overflow-auto"
                placeholder="type here... "
                autoFocus
              />

              <Button
                size="icon"
                onClick={handleNextQuestion}
                className="bg-blue-500 text-white absolute right-2 top-3"
                disabled={!inputValue.trim()}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

const ChatItemInterface = ({ chat }: { chat: any }) => {
  return chat.type === 'question' ? (
    <motion.div
      className="rounded-2xl border-2 border-black bg-blue-100 p-3 shadow-[2px_2px_0_0_black] w-auto max-w-sm mb-2"
      variants={itemVariants}
    >
      <p className="text-xs text-gray-600">
        <TypingEffect text={chat.text} />
      </p>
    </motion.div>
  ) : (
    <motion.div
      className="rounded-2xl border-2 border-black bg-white p-3 shadow-[2px_2px_0_0_black] w-auto max-w-sm mb-2 self-end ml-auto"
      variants={itemVariants}
    >
      <p className="text-xs text-gray-600">{chat.text}</p>
    </motion.div>
  );
};
