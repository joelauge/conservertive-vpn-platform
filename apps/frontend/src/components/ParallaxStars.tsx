'use client';

import { useEffect, useState } from 'react';

export default function ParallaxStars() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const stars = document.querySelectorAll('.star');
      
      stars.forEach((star, index) => {
        const speed = 0.5 + (index % 3) * 0.2; // Different speeds for different layers
        const yPos = -(scrolled * speed);
        (star as HTMLElement).style.transform = `translateY(${yPos}px)`;
      });
    };

    // Add random twinkling animations
    const addRandomTwinkling = () => {
      const stars = document.querySelectorAll('.star-dot');
      stars.forEach((star, index) => {
        const delay = Math.random() * 3; // Random delay 0-3 seconds
        const duration = 1 + Math.random() * 2; // Random duration 1-3 seconds
        const opacity = 0.3 + Math.random() * 0.7; // Random opacity 0.3-1
        
        (star as HTMLElement).style.animationDelay = `${delay}s`;
        (star as HTMLElement).style.animationDuration = `${duration}s`;
        (star as HTMLElement).style.setProperty('--twinkle-opacity', opacity.toString());
      });
    };

    window.addEventListener('scroll', handleScroll);
    addRandomTwinkling();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isClient]);

  // Generate random star positions only on client
  const generateStars = (count: number, layer: number) => {
    if (!isClient) return [];
    
    const stars = [];
    for (let i = 0; i < count; i++) {
      const top = Math.random() * 4700; // Random vertical position
      const left = Math.random() * 800; // Random horizontal position
      const size = layer === 1 ? 'w-1 h-1' : 'w-0.5 h-0.5';
      const opacity = layer === 1 ? 'opacity-60' : layer === 2 ? 'opacity-80' : 'opacity-100';
      
      stars.push(
        <div 
          key={`${layer}-${i}`}
          className={`star-dot absolute ${size} bg-white rounded-full ${opacity} animate-randomTwinkle`}
          style={{ 
            top: `${top}px`, 
            left: `${left}px`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${1 + Math.random() * 2}s`
          }}
        />
      );
    }
    return stars;
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-0" style={{ height: '500vh' }}>
      {/* Layer 1 - Slowest parallax - 90 stars */}
      <div className="star absolute inset-0">
        {generateStars(90, 1)}
      </div>
      
      {/* Layer 2 - Medium parallax - 90 stars */}
      <div className="star absolute inset-0">
        {generateStars(90, 2)}
      </div>
      
      {/* Layer 3 - Fastest parallax - 90 stars */}
      <div className="star absolute inset-0">
        {generateStars(90, 3)}
      </div>
    </div>
  );
}