import React, { ReactNode, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import TypingEffect from '@/components/TypingEffect';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import axios from 'axios';
import generateUUID from '@/utils/generateUUID';
import MayorChatItem from '../MayorChatItem';
import DelayedRender from '../DelayedRender';

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 120, damping: 12 },
  },
  exit: { opacity: 0, y: 20, transition: { duration: 0.3 } },
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
  const [chatCount, setChatCount] = useState<number>(messages.length);
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

      let newCount = chatCount + response?.data?.retry ? 0 : 1;
      setChatCount(newCount);

      if (newCount < maxChatQuestions) {
        // Continue asking further questions
        setMessages((prev: any) => [
          ...prev,
          { id: `q-${newCount}`, type: 'question', text: nextQuestionText },
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

  const handleRestart = () => {
    setMessages([initialQuestion]);
    setChatCount(1);
    setIsRegistered(null);
  }

  return (
    <div className="p-4 flex flex-col">
      {/* render questions and answers */}
      {messages.map((msg: any) => (
        <MayorChatItem key={msg.id} chat={msg} />
      ))}

      {/* loader - show when chat question is loadings */}
      {isLoading && (
        <motion.div
          className="rounded-2xl border-2 border-black bg-blue-100 p-3 shadow-[2px_2px_0_0_black] w-auto max-w-sm mb-2"
          variants={itemVariants}
        >
          <p className="text-xs text-gray-600">Loading...</p>
        </motion.div>
      )}

      {/* Registered users see Twitter login */}
      {isRegistered === true ? (
        <motion.div
          className="rounded-2xl border-2 border-black bg-green-100 p-3 shadow-[2px_2px_0_0_black] w-4/5 mb-2"
          variants={itemVariants}
        >
          <p className="text-xs text-gray-600">Thank you for already being registered with us.</p>
          <Button onClick={() => signIn('twitter')} className="mt-4 bg-blue-500 text-white">
            Login with Twitter
          </Button>
        </motion.div>
      ) : (
        <>
          {/* Show radio selection only for the initial question */}
          {isRegistered === null && chatCount < maxChatQuestions && (
            <DelayedRender waitBeforeShow={3200}>
              <motion.div
                className="rounded-2xl border-2 border-black bg-white p-3 shadow-[2px_2px_0_0_black] w-1/2 max-w-sm mb-2 self-end ml-auto"
                variants={itemVariants}
              >
                <RadioGroup
                  onValueChange={handleRadioSelection}
                  className="mt-4 flex justify-around"
                >
                  <label className="flex items-center space-x-2 text-gray-600">
                    <RadioGroupItem value="yes" /> <span>Yes</span>
                  </label>
                  <label className="flex items-center space-x-2 text-gray-600">
                    <RadioGroupItem value="no" /> <span>No</span>
                  </label>
                </RadioGroup>
              </motion.div>
            </DelayedRender>
          )}

          {/* For chat conversation if user selected "No" */}
          {isRegistered === false && chatCount < maxChatQuestions && (
            <div className="w-full mt-4 relative">
              <Textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                className="text-gray-700 placeholder:text-gray-300 min-h-[24px] resize-none overflow-auto"
                placeholder="Type your answer..."
                autoFocus
              />
              <Button
                size="icon"
                onClick={handleNextQuestion}
                className="bg-blue-500 text-white absolute right-2 top-3"
                disabled={!inputValue.trim() || isLoading}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          )}

          {/* If chat is completed, show the restart button */}
          {isRegistered === false && chatCount == maxChatQuestions && (
            <Button onClick={handleRestart} className="mt-4 bg-blue-500 text-white">
              Restart Application
            </Button>
          )}
        </>
      )}
    </div>
  );
}
