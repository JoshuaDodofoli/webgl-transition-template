'use client';

import React from 'react';
import { useTransition } from './TransitionContext';
import { useRouter } from 'next/navigation';

interface TransitionLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export const TransitionLink: React.FC<TransitionLinkProps> = ({ href, children, className }) => {
  const { transitionTo } = useTransition();
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement | HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Instead of letting Next.js Link handle it, we intercept completely
    transitionTo(href);
  };

  // We use an anchor tag so it still looks like a link, but we completely hijack the click
  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  );
};
