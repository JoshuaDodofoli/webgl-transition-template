'use client';

import React, { createContext, useContext, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface TransitionContextType {
  transitionTo: (href: string) => void;
  registerTrigger: (fn: (href: string) => void) => void;
}

const TransitionContext = createContext<TransitionContextType | null>(null);

export const useTransition = () => {
  const context = useContext(TransitionContext);
  if (!context) {
    throw new Error('useTransition must be used within a TransitionProvider');
  }
  return context;
};

export const TransitionProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const triggerRef = useRef<((href: string) => void) | null>(null);

  const registerTrigger = useCallback((fn: (href: string) => void) => {
    triggerRef.current = fn;
  }, []);

  const transitionTo = useCallback((href: string) => {
    if (triggerRef.current) {
      triggerRef.current(href);
    } else {
      router.push(href);
    }
  }, [router]);

  return (
    <TransitionContext.Provider value={{ transitionTo, registerTrigger }}>
      {children}
    </TransitionContext.Provider>
  );
};
