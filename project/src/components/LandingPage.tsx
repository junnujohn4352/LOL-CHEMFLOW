import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';

const LandingPage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const tl = gsap.timeline();
    
    // Initial state
    gsap.set('.logo-letter', { y: 100, opacity: 0 });
    gsap.set('.tagline', { y: 50, opacity: 0 });
    gsap.set('.glow-effect', { scale: 0, opacity: 0 });
    
    // Animate logo and effects
    tl.to('.logo-letter', {
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.1,
      ease: "back.out(1.7)"
    })
    .to('.glow-effect', {
      scale: 1,
      opacity: 0.8,
      duration: 1,
      ease: "power2.out"
    }, "-=0.5")
    .to('.tagline', {
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.1,
      ease: "power2.out"
    }, "-=0.8")
    .to('.logo-container', {
      scale: 0.9,
      opacity: 0,
      duration: 0.5,
      delay: 1.5,
      ease: "power2.in"
    });
    
    return () => {
      tl.kill();
    };
  }, []);
  
  return (
    <div ref={containerRef} className="fixed inset-0 flex items-center justify-center overflow-hidden">
      {/* Dynamic background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
        <div className="absolute inset-0 opacity-30">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-blue-500/20 animate-pulse"
              style={{
                width: `${Math.random() * 4 + 2}rem`,
                height: `${Math.random() * 4 + 2}rem`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDuration: `${Math.random() * 3 + 2}s`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Grid overlay */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}
      />

      {/* Main content */}
      <div className="logo-container relative z-10">
        <div className="absolute inset-0 glow-effect bg-blue-500/20 blur-3xl rounded-full" />
        
        <div className="relative bg-gray-900/30 backdrop-blur-xl rounded-2xl border border-white/10 p-16 shadow-2xl">
          {/* LOL Logo */}
          <div className="flex items-center justify-center mb-8">
            {['L', 'O', 'L'].map((letter, index) => (
              <motion.div
                key={index}
                className="logo-letter text-9xl font-black mx-2"
                style={{
                  background: 'linear-gradient(to bottom right, #60A5FA, #3B82F6)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 0 40px rgba(59, 130, 246, 0.5)'
                }}
              >
                {letter}
              </motion.div>
            ))}
          </div>

          {/* GROUPS text */}
          <div className="flex items-center justify-center mb-8">
            {Array.from('GROUPS').map((letter, index) => (
              <motion.div
                key={index}
                className="logo-letter text-5xl font-bold mx-1 text-blue-400"
                style={{
                  textShadow: '0 0 20px rgba(96, 165, 250, 0.5)'
                }}
              >
                {letter}
              </motion.div>
            ))}
          </div>

          {/* Tagline */}
          <motion.div className="tagline text-2xl text-center text-blue-200 mb-6">
            presents
          </motion.div>

          {/* Product name */}
          <motion.div 
            className="tagline text-6xl font-bold text-center"
            style={{
              background: 'linear-gradient(to right, #22D3EE, #3B82F6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 0 30px rgba(59, 130, 246, 0.3)'
            }}
          >
            ChemFlow
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;