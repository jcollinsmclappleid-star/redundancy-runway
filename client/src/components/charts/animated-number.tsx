import { useEffect, useRef, useState } from "react";

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  format?: (v: number) => string;
  className?: string;
  prefix?: string;
  suffix?: string;
  testId?: string;
}

export function AnimatedNumber({
  value,
  duration = 900,
  format,
  className,
  prefix = "",
  suffix = "",
  testId,
}: AnimatedNumberProps) {
  const [display, setDisplay] = useState(value);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const from = display;
    startRef.current = null;
    if (from === value) return;

    const step = (ts: number) => {
      if (startRef.current == null) startRef.current = ts;
      const t = Math.min(1, (ts - startRef.current) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(from + (value - from) * eased);
      if (t < 1) rafRef.current = requestAnimationFrame(step);
      else setDisplay(value);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration]);

  const text = format ? format(display) : Math.round(display).toLocaleString("en-GB");
  return (
    <span className={className} data-testid={testId}>
      {prefix}{text}{suffix}
    </span>
  );
}
