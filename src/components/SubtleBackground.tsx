'use client';

import { useEffect, useRef } from 'react';

export function SubtleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Create subtle gradient mesh points
    const points: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
    }> = [];

    // Fewer, larger, more subtle points
    for (let i = 0; i < 5; i++) {
      points.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        radius: 200 + Math.random() * 100
      });
    }

    function animate() {
      if (!ctx || !canvas) return;
      
      // Clear with very subtle fade
      ctx.fillStyle = 'rgba(0, 0, 0, 0.02)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      points.forEach((point, i) => {
        point.x += point.vx;
        point.y += point.vy;

        if (point.x < -point.radius || point.x > canvas.width + point.radius) point.vx *= -1;
        if (point.y < -point.radius || point.y > canvas.height + point.radius) point.vy *= -1;

        // Create very subtle gradients
        const gradient = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, point.radius);
        
        if (i % 2 === 0) {
          gradient.addColorStop(0, 'rgba(59, 130, 246, 0.02)'); // Subtle blue
          gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
        } else {
          gradient.addColorStop(0, 'rgba(99, 102, 241, 0.02)'); // Subtle indigo
          gradient.addColorStop(1, 'rgba(99, 102, 241, 0)');
        }

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      });

      requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <canvas 
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}