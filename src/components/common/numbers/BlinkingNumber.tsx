import React, { useState, useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';

interface BlinkingNumberProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export default function BlinkingNumber({
  value,
  duration = 2000,
  prefix = '',
  suffix = '',
  className = ''
}: BlinkingNumberProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  const { number } = useSpring({
    from: { number: 0 },
    to: { number: value },
    config: { duration },
    onRest: () => setIsAnimating(false),
  });

  useEffect(() => {
    setIsAnimating(true);
  }, [value]);

  return (
    <span className={`inline-flex items-center ${className} ${isAnimating ? 'text-purple-600' : ''}`}>
      {prefix}
      <animated.span>
        {number.to(n => Math.floor(n))}
      </animated.span>
      {suffix}
    </span>
  );
}