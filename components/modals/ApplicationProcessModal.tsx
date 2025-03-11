import React, { ReactNode, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TypingEffect from '@/components/TypingEffect';
import { signIn } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Clock, CheckCircle2 } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import axios from 'axios';
import generateUUID from '@/utils/generateUUID';
import MayorChatItem from '../MayorChatItem';
import DelayedRender from '../DelayedRender';

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 120, damping: 12 },
  },
  exit: { opacity: 0, y: 20, scale: 0.95, transition: { duration: 0.3 } },
};

const initialQuestion = {
  id: 'initial',
  type: 'question',
  text: "Welcome to Kuro Town! I'm Mayor. Before we get started, I'd love to learn more about you!, Are you already registered with us?",
};

const finalQuestion = {
  id: 'final',
  type: 'question',
  text: (
    <>
      <p>
        You're almost done! To complete your citizenship application, connect your Twitter account.
      </p>
      <Button onClick={() => signIn('twitter')} className="mt-4 bg-blue-500 text-white">
        Connect using Twitter
      </Button>
    </>
  ),
};

const loginQuestion = {
  id: 'login',
  type: 'question',
  text: (
    <>
      <p className="text-xs text-gray-600">Thank you for already being registered with us.</p>
      <Button onClick={() => signIn('twitter')} className="mt-4 bg-blue-500 text-white">
        Login with Twitter
      </Button>
    </>
  ),
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const pulseAnimation = {
  scale: [1, 1.05, 1],
  transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
};
// Helper function to get current time
const getCurrentTime = () => {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
};

export default function ApplicationProcessModal({
  messages,
  setMessages,
  isLoading,
  setIsLoading,
}: {
  messages: any;
  setMessages: any;
  isLoading: boolean;
  setIsLoading: any;
}) {
  const [isRegistered, setIsRegistered] = useState<boolean | null>(messages.length == 1 ? null : false);
  const [inputValue, setInputValue] = useState<string>('');
  const [progress, setProgress] = useState<number>(0);
  const [chatCount, setChatCount] = useState<number>(messages.filter((message:any) => !message.retry && message.type == "question").length);
  const maxChatQuestions = 5;

  function getUserUUID() {
    let userUUID = sessionStorage.getItem('userUUID');
    if (!userUUID) {
      userUUID = generateUUID();
      sessionStorage.setItem('userUUID', userUUID);
    }
    return userUUID;
  }

  // Function to call chat API with user's response and append the next question
  const handleChat = async (userResponse: string) => {
    try {
      setIsLoading(true);
      const response = await axios.post(`/api/chat`, {
        userId: getUserUUID(),
        userResponse,
      });
      // Assume the API returns a new question text
      const nextQuestionText = response?.data?.question || response?.data?.message;

      let newCount = chatCount + (response?.data?.retry ? 0 : 1);
      setChatCount(newCount);

      if (newCount < maxChatQuestions) {
        // Continue asking further questions
        setMessages((prev: any) => [
          ...prev,
          { id: `q-${newCount}`, type: 'question', text: nextQuestionText, retry: response?.data?.retry ?? false },
        ]);
      } else {
        // Append the final question
        setMessages((prev: any) => [...prev, finalQuestion]);
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Error calling chat API:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for radio selection on the initial question
  const handleRadioSelection = (value: string) => {
    setIsRegistered(value === 'yes');
    // Append the user's radio answer to the chat
    setMessages((prev: any) => [...prev, { id: 'r-initial', type: 'answer', text: value }]);
    // If "No" is selected, kick off the follow-up chat questions
    if (value === 'no') {
      handleChat('no, I am not registered');
    }
  };

  // Handler for when the user types an answer and proceeds
  const handleNextQuestion = () => {
    if (inputValue.trim() !== '' && !isLoading) {
      setMessages((prev: any) => [
        ...prev,
        { id: `a-${prev.length + 1}`, type: 'answer', text: inputValue },
      ]);
      const userResponse = inputValue;
      setInputValue('');
      handleChat(userResponse);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      e.preventDefault();
      handleNextQuestion();
    }
  };
  
  // Update progress when currentQuestionIndex changes
  useEffect(() => {
    const totalQuestions = maxChatQuestions;
    const newProgress = Math.round(((chatCount + 1) / totalQuestions) * 100);
    setProgress(newProgress);
  }, [chatCount]);

  const handleRestart = () => {
    setMessages([initialQuestion]);
    setChatCount(1);
    setIsRegistered(null);
  }

  return (
    <Card className="w-full max-w-3xl mx-auto bg-gradient-to-b from-white to-blue-50 border-2 border-gray-200 shadow-lg rounded-2xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex flex-row items-center gap-4 border-b border-gray-200">
        <Avatar className="h-14 w-14 border-2 border-white shadow-md">
          <AvatarImage src="/images/mayor.png" alt="Mayor Takahashi" />
          <AvatarFallback className="bg-blue-100 text-blue-800 font-bold">MT</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-white flex items-center gap-2">
            Mayor
            <Badge className="bg-blue-200 text-blue-800 ml-2 px-2 py-1 text-xs font-semibold rounded-full">
              Official
            </Badge>
          </CardTitle>
          <p className="text-blue-100 text-sm">Kuro Town Administration</p>
        </div>
      </CardHeader>

      <div className="p-1">
        <Progress value={progress} className="h-2 bg-gray-200" />
      </div>

      <div className="p-4 flex flex-col space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
        <AnimatePresence>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-4"
          >
            {messages.map((msg:any, index:number) => (
              <ChatItemInterface
                key={`${msg.id}-${index}`}
                chat={msg}
                isRegistered={isRegistered}
                handleRadioSelection={handleRadioSelection}
                isTyping={isLoading && index === messages.length - 1 && msg.type === 'question'}
              />
            ))}
          </motion.div>

          {/* loader - show when chat question is loadings */}
          {isLoading && (
            <ChatItemInterface
              chat={{ id: "loading", type: "question", text: "..." }}
              isRegistered={isRegistered}
              handleRadioSelection={handleRadioSelection}
              isTyping={isLoading}
            />
          )}

          {/* Registered users see Twitter login */}
          {isRegistered === true && chatCount < maxChatQuestions ? (
            <ChatItemInterface
              chat={loginQuestion}
              isRegistered={isRegistered}
              handleRadioSelection={handleRadioSelection}
              isTyping={isLoading}
            />
          ) : (
            <>
              {/* Show radio selection only for the initial question */}
              {isRegistered === null && (
                <DelayedRender waitBeforeShow={3200}>
                  <motion.div
                    className="rounded-2xl bg-white p-4 shadow-lg border border-gray-200 w-auto max-w-sm mb-2 self-end ml-auto mt-4"
                    variants={itemVariants}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm font-medium text-gray-500">Select an option:</p>
                      <span className="text-xs text-gray-400 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {getCurrentTime()}
                      </span>
                    </div>
                    <div className="flex gap-3 justify-center">
                      <Button
                        onClick={() => handleRadioSelection('yes')}
                        variant="default"
                        className="w-full py-2 px-4"
                      >
                        Yes, I am
                      </Button>
                      <Button
                        onClick={() => handleRadioSelection('no')}
                        variant="secondary"
                        className="w-full py-2 px-4"
                      >
                        No, I'm new
                      </Button>
                    </div>
                  </motion.div>
                </DelayedRender>
              )}

              {/* For chat conversation if user selected "No" */}
              {isRegistered === false && chatCount < maxChatQuestions && (
                <motion.div 
                  className="w-full mt-6 relative"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Avatar className="h-10 w-10 border-2 border-gray-200 shadow-sm">
                      <AvatarFallback className="bg-gray-100 text-gray-600 flex items-center justify-center">You</AvatarFallback>
                    </Avatar>
                    <p className="text-sm font-medium text-gray-600">Your response:</p>
                  </div>
                  
                  <div className="relative rounded-2xl border border-gray-300 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all duration-200 overflow-hidden shadow-sm">
                    <Textarea
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyPress}
                      className="text-gray-700 placeholder:text-gray-400 min-h-[80px] resize-none overflow-auto p-4 border-none focus:ring-0 focus:outline-none"
                      placeholder="Type your response here..."
                      autoFocus
                    />

                    <Button
                      onClick={handleNextQuestion}
                      className="absolute right-3 bottom-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-md transition-all duration-200 flex items-center gap-2 py-2"
                      disabled={!inputValue.trim()}
                    >
                      <span className="hidden sm:inline">Send</span>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-400 mt-1 ml-2">Press Enter to send</p>
                </motion.div>
              )}

              {/* If chat is completed, show the restart button */}
              {isRegistered === false && chatCount == maxChatQuestions && (
                <Button onClick={handleRestart} className="mt-4 bg-blue-500 text-white">
                  Restart Application
                </Button>
              )}
            </>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
}

const ChatItemInterface = ({
  chat,
  isRegistered,
  handleRadioSelection,
  isTyping = false,
}: {
  chat: any;
  isRegistered: boolean | null;
  handleRadioSelection: (value: string) => void;
  isTyping?: boolean;
}) => {
  return chat.type === 'question' ? (
    <motion.div
      className="flex items-start gap-3 group"
      variants={itemVariants}
      initial="hidden"
      animate="show"
      exit="exit"
    >
      <Avatar className="h-10 w-10 mt-1 border-2 border-blue-200 shadow-sm">
        <AvatarImage src="/images/mayor.png" alt="Mayor Takahashi" />
        <AvatarFallback className="bg-blue-100 text-blue-800 font-bold">MT</AvatarFallback>
      </Avatar>
      
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">Mayor</Badge>
          <span className="text-xs text-gray-400 ml-auto flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            {chat.timestamp}
          </span>
        </div>
        
        <div className="relative">
          <div className="rounded-2xl rounded-tl-none bg-gradient-to-br from-blue-50 to-blue-100 p-4 shadow-md border border-blue-200">
            {isTyping ? (
              <div className="flex items-center gap-1 py-2">
                <motion.div animate={pulseAnimation} className="w-2 h-2 bg-blue-400 rounded-full" />
                <motion.div animate={pulseAnimation} className="w-2 h-2 bg-blue-400 rounded-full" transition={{ delay: 0.2 }} />
                <motion.div animate={pulseAnimation} className="w-2 h-2 bg-blue-400 rounded-full" transition={{ delay: 0.4 }} />
              </div>
            ) : (
              <div className="text-gray-700 text-sm leading-relaxed">
                <TypingEffect text={chat.text} />
                {isRegistered === false && chat.id === '6' && (
                  <div className="mt-4 text-right">
                    <Button 
                      onClick={() => signIn('twitter')} 
                      className="bg-indigo-500 hover:bg-indigo-600 text-white font-medium px-6 py-2 rounded-full transition-all duration-300 flex items-center gap-2 inline-flex"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/>
                      </svg>
                      Connect with Twitter
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  ) : (
    <motion.div
      className="flex items-center gap-3 flex-row-reverse group"
      variants={itemVariants}
      initial="hidden"
      animate="show"
      exit="exit"
    >
      <Avatar className="h-10 w-10 mt-6 border-2 border-gray-200 shadow-sm">
        <AvatarFallback className="bg-gray-100 text-gray-600 flex items-center justify-center font-extrabold">Y</AvatarFallback>
      </Avatar>
      
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1 flex-row-reverse">
          <span className="font-medium text-gray-700">You</span>
          <span className="text-xs text-gray-400 mr-auto flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            {chat.timestamp}
          </span>
        </div>
        
        <div className="relative">
          <div className="rounded-2xl rounded-tr-none bg-white p-4 shadow-md border border-gray-200">
            <p className="text-gray-700 text-sm text-right">{chat.text}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Add a custom scrollbar style to global CSS
const customScrollbarStyle = `
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #c5d1eb;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #a3b8e0;
}
`;
