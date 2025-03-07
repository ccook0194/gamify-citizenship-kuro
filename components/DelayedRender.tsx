import { useState, useEffect, ReactNode } from 'react';

interface DelayedRenderProps {
  children: ReactNode;
  waitBeforeShow?: number;
}

const DelayedRender: React.FC<DelayedRenderProps> = ({ children, waitBeforeShow = 2000 }) => {
  const [isShown, setIsShown] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsShown(true);
    }, waitBeforeShow);

    return () => clearTimeout(timer);
  }, [waitBeforeShow]);

  return isShown ? <>{children}</> : null;
};

export default DelayedRender;
