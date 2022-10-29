/**
 * Dependency imports
 */
import React from 'react';

/**
 * Default export
 */
export const useWatchTower = (value: any): boolean => {
  const prevValue = React.useRef(value);

  React.useEffect(() => {
    prevValue.current = value;
  }, [value]);

  return prevValue.current !== value;
};
