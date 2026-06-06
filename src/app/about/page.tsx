import { TransitionLink } from "@/components/TransitionLink";

export default function About() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-zinc-900 text-white relative z-10">
      <h1 className="text-6xl font-bold mb-8 tracking-tighter">About Page</h1>
      <p className="text-xl text-gray-400 mb-12">The transition brought you here.</p>
      
      <TransitionLink 
        href="/" 
        className="px-8 py-4 bg-white text-black rounded-full font-medium hover:scale-105 transition-transform"
      >
        Go back Home
      </TransitionLink>
    </main>
  );
}
