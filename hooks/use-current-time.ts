/**
 * Dependency imports
 */
import React from 'react';

/**
 * Local imports
 */
import { getTimeParts, Time } from '../utils/date-time';

/**
 * Default export
 */
export const useCurrentTime = (updateInterval: number = 1000): Time => {
  const [currentTime, setCurrentTime] = React.useState(getTimeParts());

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(getTimeParts());
    }, updateInterval);
    return () => clearInterval(interval);
  }, []);

  return currentTime;
};
