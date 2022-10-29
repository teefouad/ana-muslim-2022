/**
 * Dependency imports
 */
import React from 'react';

/**
 * Local imports
 */
import { raf } from '../utils/animation';

/**
 * Default export
 */
export const useChameleon = (value: any, watch: any[], options: {
  duration?: number,
  delay?: number,
} = {
  duration: 200,
  delay: 0,
}): any => {
  const watchRef = React.useRef(watch);
  const animationTimerRef = React.useRef<() => void>();
  const [active, setActive] = React.useState(true);
  const [currentValue, setCurrentValue] = React.useState(value);

  React.useEffect(() => {
    let shouldUpdate = false;

    watchRef.current.forEach((value, n) => {
      if (!shouldUpdate && value !== watch[n]) shouldUpdate = true;
    });

    if (shouldUpdate) {
      setActive(false);
      
      animationTimerRef.current?.();

      animationTimerRef.current = raf(() => {
        setActive(true);
        setCurrentValue(value);
        watchRef.current = watch;
      }, options.duration! + options.delay!, false);
    } else {
      setCurrentValue(value);
    }
  }, [value, watch, options.delay, options.duration]);

  return [currentValue, active];
};
