import { TransitionLink } from "@/components/TransitionLink";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-black text-white relative z-10">
      <h1 className="text-6xl font-bold mb-8 tracking-tighter">Three.js Transition</h1>
      <p className="text-xl text-gray-400 mb-12">Click the button below to see the WebGL shader dissolve effect.</p>
      
      <TransitionLink 
        href="/about" 
        className="px-8 py-4 bg-white text-black rounded-full font-medium hover:scale-105 transition-transform"
      >
        Go to About Page
      </TransitionLink>
    </main>
  );
}
