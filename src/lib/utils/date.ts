import { format, isValid, parseISO } from 'date-fns';

/**
 * Dates are set in mono, so they are formatted with digits only.
 *
 * "2025년 11월 3일" would put Hangul inside a monospace run: IBM Plex Mono has
 * no Korean glyphs, so 년/월/일 fall back to a different typeface and the
 * fixed-width spaces open up into visible gaps. Dotted numerals also match the
 * date style on the portfolio site.
 *
 * Notion returns either a date ("2026-07-31") or a timestamp, and a row whose
 * date property was never filled in falls back to created_time. Anything
 * unparseable renders as an empty string rather than crashing the page.
 */
export function formatDate(dateString: string): string {
  const parsed = parseISO(dateString);
  if (!isValid(parsed)) return '';
  return format(parsed, 'yyyy.MM.dd');
}

export function toISODate(dateString: string): string {
  const parsed = parseISO(dateString);
  if (!isValid(parsed)) return '';
  return format(parsed, 'yyyy-MM-dd');
}
