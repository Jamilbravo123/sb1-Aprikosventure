import React from 'react';
import { useSpring, animated } from '@react-spring/web';

interface CountUpNumberProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export default function CountUpNumber({
  value,
  duration = 2000,
  prefix = '',
  suffix = '',
  className = ''
}: CountUpNumberProps) {
  const { number } = useSpring({
    from: { number: 0 },
    to: { number: value },
    config: { duration },
  });

  return (
    <span className={`inline-flex items-center ${className}`}>
      {prefix}
      <animated.span>
        {number.to(n => Math.floor(n))}
      </animated.span>
      {suffix}
    </span>
  );
}