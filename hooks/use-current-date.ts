/**
 * Dependency imports
 */
import React from 'react';

/**
 * Local imports
 */
import { getDatePartsFromCalendar, DateParts } from '../utils/date-time';

/**
 * Default export
 */
export const useCurrentDate = (calendar: 'hijri' | 'gregorian' = 'hijri', lang: 'ar' | 'en' = 'ar', options = {}): DateParts => {
  const [currentDate, setCurrentDate] = React.useState(getDatePartsFromCalendar(new Date(), calendar, lang, options));

  React.useEffect(() => {
    const updateCurrentDate = () => {
      setCurrentDate(getDatePartsFromCalendar(new Date(), calendar, lang, options));
    };

    updateCurrentDate();

    const interval = setInterval(updateCurrentDate, 1000);

    return () => clearInterval(interval);
  }, [calendar, lang, JSON.stringify(options)]);

  return currentDate;
};
