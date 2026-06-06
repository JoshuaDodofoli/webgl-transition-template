'use client';

import dynamic from 'next/dynamic';

export const ClientTransitionCanvas = dynamic(
  () => import('./TransitionCanvas').then(mod => mod.TransitionCanvas),
  { ssr: false }
);
