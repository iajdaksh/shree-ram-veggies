'use client'

import { useState, useEffect } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function CustomCursor() {
  // Smooth Cursor States
  const [isHovering, setIsHovering] = useState(false)
  const [isClicking, setIsClicking] = useState(false)

  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  const ringX = useSpring(cursorX, { stiffness: 150, damping: 15, mass: 0.5 })
  const ringY = useSpring(cursorY, { stiffness: 150, damping: 15, mass: 0.5 })
  const dotX = useSpring(cursorX, { stiffness: 800, damping: 30, mass: 0.5 })
  const dotY = useSpring(cursorY, { stiffness: 800, damping: 30, mass: 0.5 })

  useEffect(() => {
    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY, target } = e;

      // Use requestAnimationFrame to batch updates and improve performance
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(() => {
        // Update cursor position for springs
        cursorX.set(clientX);
        cursorY.set(clientY);

        // Update CSS variables for the glow effect
        document.documentElement.style.setProperty('--cursor-x', `${clientX}px`);
        document.documentElement.style.setProperty('--cursor-y', `${clientY}px`);

        // Check for hover state inside the same optimized loop
        const isHoveringInteractive = !!(target as HTMLElement).closest('a, button, input, textarea, select, [role="button"]');
        if (isHoveringInteractive !== isHovering) {
          setIsHovering(isHoveringInteractive);
        }
      });
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mouseup', handleMouseUp)
      cancelAnimationFrame(animationFrameId);
    }
  }, [isHovering]) // Re-run effect only when isHovering changes

  return (
    <>
      <div className="cursor-glow hidden sm:block" />
      
      {/* Interactive Framer Motion Cursor */}
      <motion.div
        className="custom-cursor-dot hidden sm:block"
        style={{ x: dotX, y: dotY, left: -4, top: -4 }}
        animate={{ scale: isHovering ? 0 : 1, opacity: isHovering ? 0 : 1 }}
        transition={{ duration: 0.15 }}
      />
      <motion.div
        className="custom-cursor-ring hidden sm:block"
        style={{ x: ringX, y: ringY, left: -18, top: -18 }}
        animate={{
          scale: isClicking ? 0.8 : isHovering ? 1.5 : 1,
          backgroundColor: isHovering ? 'rgba(142, 182, 155, 0.4)' : 'rgba(142, 182, 155, 0)',
          borderColor: isHovering ? 'rgba(35, 83, 71, 0)' : 'var(--border-strong)'
        }}
        transition={{ duration: 0.15 }}
      />
    </>
  )
}