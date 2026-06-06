'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { extend } from '@react-three/fiber';
import { useRef, useEffect } from 'react';
import { useTransition } from './TransitionContext';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';

const NoiseMaterial = shaderMaterial(
  {
    uProgress: 0,
    uTime: 0,
  },
  // vertex shader
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      // Using raw coordinates to perfectly fill the screen
      gl_Position = vec4(position.xy, 0.0, 1.0);
    }
  `,
  // fragment shader
  `
    uniform float uProgress;
    uniform float uTime;
    varying vec2 vUv;

    // Simplex 2D noise function
    vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

    float snoise(vec2 v){
      const vec4 C = vec4(0.211324865405187, 0.366025403784439,
               -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy) );
      vec2 x0 = v -   i + dot(i, C.xx);
      vec2 i1;
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod(i, 289.0);
      vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
      + i.x + vec3(0.0, i1.x, 1.0 ));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
        dot(x12.zw,x12.zw)), 0.0);
      m = m*m ;
      m = m*m ;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    void main() {
      // Noise calculation
      // Reduced frequency (from 5.0 to 1.5) makes the noise larger and less chaotic
      float rawNoise = snoise(vUv * 1.5 + uTime * 0.1);
      
      // Map noise to 0.0 -> 1.0, but reduce its contrast/intensity by 50%
      // so it feels much softer and less harsh
      float noise = rawNoise * 0.18;
      
      float p = uProgress;
      float alpha = 0.0;
      
      // Calculate dissolve effect based on progress (0 to 1 for intro, 1 to 2 for outro)
      if (p <= 1.0) {
         // Animating in (covering screen)
         float threshold = p * 1.4 - 0.2;
         alpha = smoothstep(threshold - 0.1, threshold + 0.1, noise);
         alpha = 1.0 - alpha; // Invert so it fills up
      } else {
         // Animating out (clearing screen)
         float p2 = p - 1.0;
         float threshold = p2 * 1.4 - 0.2;
         alpha = smoothstep(threshold - 0.1, threshold + 0.1, noise);
      }
      
      // The transition color (dark gray)
      vec3 color = vec3(0.06, 0.06, 0.06); 
      
      gl_FragColor = vec4(color, alpha);
    }
  `
);

extend({ NoiseMaterial });

const Scene = ({ registerTrigger }: { registerTrigger: (fn: (href: string) => void) => void }) => {
  const materialRef = useRef<any>(null);
  const router = useRouter();

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uTime = state.clock.elapsedTime;
    }
  });

  useEffect(() => {
    registerTrigger((href: string) => {
      if (!materialRef.current) return;
      
      // Intro animation (fill screen)
      gsap.to(materialRef.current.uniforms.uProgress, {
        value: 1.0,
        duration: 1.5,
        ease: 'power1.inOut',
        onComplete: () => {
          // Change route once screen is covered
          router.push(href);
          
          // Slight delay to let Next.js render the new DOM
          setTimeout(() => {
            gsap.to(materialRef.current.uniforms.uProgress, {
              value: 2.0,
              duration: 1.5,
              ease: 'power1.inOut',
              onComplete: () => {
                 // Reset progress silently back to 0
                 materialRef.current.uniforms.uProgress.value = 0.0;
              }
            });
          }, 200);
        }
      });
    });
  }, [registerTrigger, router]);

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      {/* @ts-ignore */}
      <noiseMaterial ref={materialRef} transparent depthWrite={false} depthTest={false} />
    </mesh>
  );
};

export const TransitionCanvas = () => {
  const { registerTrigger } = useTransition();

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <Canvas style={{ pointerEvents: 'none' }}>
        <Scene registerTrigger={registerTrigger} />
      </Canvas>
    </div>
  );
};
