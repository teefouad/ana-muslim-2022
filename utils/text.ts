export const baseFontSize = 14;

/**
 * Converts a measurement value from pixels to rem
 * @param px Value in pixels
 * @param includeUnit Whether the returned value should include the unit or not
 * @returns Value in rem
 */
export const toRem = (px: number, includeUnit: boolean = true) => `${px / baseFontSize}${includeUnit && 'rem'}`;

/**
 * Removes arabic diacritics from a piece of text
 * @param text Text to process
 * @returns Text without diacritics
 */
export const removeDiacritics = (text: string) => text && text.replace(/[\u064b-\u065e\u0670\u06d6-\u06dc\u06df-\u06ed]/g, '');
