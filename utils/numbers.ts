/**
 * Adds a leading zero to a numeric value
 * @param n The numeric value
 * @returns The value as a string with a leading zero
 */
export const leadZero = (n: number) => (n < 10 ? `0${n}` : n.toString());

/**
 * Converts English digits to Arabic digits
 * @param n Digits to convert
 * @returns Digits in Arabic
 */
export const toArabicDigits = (n: number) => n.toString().replace(/[0123456789]/g, (d) => '\u0660\u0661\u0662\u0663\u0664\u0665\u0666\u0667\u0668\u0669'[+d]);

/**
 * Converts Arabic digits to English digits
 * @param n Digits to convert
 * @returns Digits in English
 */
export const toEnglishDigits = (n: number) => {
  const arabicNumbers = ['\u0660', '\u0661', '\u0662', '\u0663', '\u0664', '\u0665', '\u0666', '\u0667', '\u0668', '\u0669'];
  return n.toString().replace(new RegExp(`[${arabicNumbers.join('')}]`, 'g'), (d) => '0123456789'[arabicNumbers.indexOf(d)]);
};
