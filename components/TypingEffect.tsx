'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import parse from 'html-react-parser';

interface TypingEffectProps {
  text?: string | ReactNode;
  delay?: number;
}

const TypingEffect: React.FC<TypingEffectProps> = ({ text = '', delay = 17 }) => {
  const [displayedText, setDisplayedText] = useState<string>('');
  const [currentIndex, setCurrentIndex] = useState(0);

  const formatMessage = (text: string): string => {
    return text
      .replace(/^####\s(.+)$/gm, '<h4>$1</h4>')
      .replace(/^###\s(.+)$/gm, '<h3>$1</h3>')
      .replace(/^##\s(.+)$/gm, '<h2>$1</h2>')
      .replace(/^#\s(.+)$/gm, '<h1>$1</h1>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/(?:^|\n)-\s(.+)/gm, (match, p1, offset, str) => {
        const isFirstItem = str.lastIndexOf('\n-', offset - 1) === -1;
        const isLastItem = str.indexOf('\n-', offset + match.length) === -1;
        return `${isFirstItem ? '<ul>' : ''}<li>${p1}</li>${isLastItem ? '</ul>' : ''}`;
      })
      .replace(/\n/g, '<br />');
  };

  useEffect(() => {
    if (!text) {
      setDisplayedText('');
      return;
    }

    if (typeof text !== 'string') {
      // If text is a JSX element, render it directly
      return;
    }

    const formattedText = formatMessage(text);
    let cleanText = formattedText.replace(/<[^>]+>/g, ''); // Remove HTML tags for character count

    if (currentIndex < cleanText.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(formattedText.slice(0, currentIndex + 1));
        setCurrentIndex((prev) => prev + 1);
      }, delay);
      return () => clearTimeout(timeout);
    }
  }, [text, currentIndex, delay]);

  return <>{typeof text === 'string' ? parse(displayedText) : text}</>;
};

export default TypingEffect;
