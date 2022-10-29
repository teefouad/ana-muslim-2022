/**
 * Returns parts of a specific timestamp
 * @param timestamp Timestamp to return as parts, in milliseconds. Leave empty for current time
 * @returns Time broken down into parts, as an object
 */
export type Time = {
  now: Date,
  hours24: number,
  period: string,
  hours: number,
  minutes: number,
  seconds: number,
};

export const getTimeParts = (timestamp?: Date): Time => {
  const now = timestamp ?? new Date();
  const hours24 = now.getHours();
  const period = hours24 > 12 ? 'pm' : 'am';
  const hours = hours24 > 12 ? hours24 - 12 : hours24;
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  return {
    now,
    hours24,
    hours,
    minutes,
    seconds,
    period,
  };
};

/**
 * Calculates and returns the time parts in a given value of milliseconds
 * @param milliseconds Value to process
 * @returns How many days, hours, minutes and seconds in that given value
 */
export type TimeParts = {
  days: number,
  hours: number,
  minutes: number,
  seconds: number,
};

export const getTimePartsIn = (milliseconds: number): TimeParts => {
  let remaining = milliseconds / 1000 / 60 / 60 / 24;

  const days = Math.floor(remaining);
  remaining = (remaining - days) * 24;

  const hours = Math.floor(remaining);
  remaining = (remaining - hours) * 60;

  const minutes = Math.floor(remaining);
  remaining = (remaining - minutes) * 60;

  const seconds = Math.floor(remaining);

  return {
    days,
    hours,
    minutes,
    seconds,
  };
};

/**
 * Returns parts of a specific date from hijri or gregorian calendar
 * @param date Date to return as parts
 * @param calendar Which calendar to pick the date from, either 'hijri' or 'gregorian'
 * @param lang Language to use for the returned date parts
 * @param options DateTime options to pass to DateTimeFormat
 * @returns 
 */
export type DateParts = {
  day: number;
  month: string;
  year: number;
  weekday: string;
  era: string;
};

export const getDatePartsFromCalendar = (date: Date, calendar: 'hijri' | 'gregorian' = 'hijri', lang: 'ar' | 'en' = 'ar', options = {}): DateParts => {
  const locale = {
    hijri: `${lang}-EG-u-ca-islamic-umalqura`,
    gregorian: `${lang}-EG-u-ca-gregory`,
  }[calendar];

  const dateTimeOptions: any = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    weekday: 'long',
    era: 'short',
    ...options,
  };

  const dateParts = new Intl.DateTimeFormat(locale, dateTimeOptions).formatToParts(date);

  return dateParts.reduce((p, n) => ({
    ...p,
    ...(dateTimeOptions[n.type] ? { [n.type]: n.value } : {}),
  }), {} as DateParts);
};

export const getDaySuffix = (day: number) => {
  if (day === 1) return 'st';
  if (day === 2) return 'nd';
  if (day === 3) return 'rd';
  return 'th';
};
