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
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/```([\s\S]+?)```/g, '<pre><code>$1</code></pre>')
      .replace(/(?:^|\n)(\d+)\.\s(.+)/gm, (match, p1, p2, offset, str) => {
        const isFirstItem = str.lastIndexOf('\n1.', offset - 1) === -1;
        const isLastItem = str.indexOf('\n1.', offset + match.length) === -1;
        return `${isFirstItem ? '<ol>' : ''}<li>${p2}</li>${isLastItem ? '</ol>' : ''}`;
      })
      .replace(/(?:^|\n)-\s(.+)/gm, (match, p1, offset, str) => {
        const isFirstItem = str.lastIndexOf('\n-', offset - 1) === -1;
        const isLastItem = str.indexOf('\n-', offset + match.length) === -1;
        return `${isFirstItem ? '<ul>' : ''}<li>${p1}</li>${isLastItem ? '</ul>' : ''}`;
      })
      .replace(/\n{2,}/g, '</p><p>')
      .replace(/\n/g, '<br />')
      .replace(/^(?!<h\d>|<ul>|<ol>|<pre>|<p>)([\s\S]+)$/, '<p>$1</p>');
  };

  // Extracts only the visible characters while keeping the full HTML structure
  const getVisibleSubstring = (html: string, charLimit: number): string => {
    let result = '';
    let visibleCount = 0;
    let inTag = false;

    for (let i = 0; i < html.length; i++) {
      const char = html[i];

      if (char === '<') inTag = true;
      if (!inTag) visibleCount++;
      if (char === '>') inTag = false;

      result += char;
      if (visibleCount >= charLimit) break;
    }

    return result;
  };

  useEffect(() => {
    if (!text || typeof text !== 'string') {
      setDisplayedText('');
      return;
    }

    const formattedText = formatMessage(text);
    const totalVisibleChars = formattedText.replace(/<[^>]+>/g, '').length;

    if (currentIndex < totalVisibleChars) {
      const timeout = setTimeout(() => {
        setDisplayedText(getVisibleSubstring(formattedText, currentIndex + 1));
        setCurrentIndex((prev) => prev + 1);
      }, delay);

      return () => clearTimeout(timeout);
    }
  }, [text, currentIndex, delay]);

  return <>{typeof text === 'string' ? parse(displayedText) : text}</>;
};

export default TypingEffect;
