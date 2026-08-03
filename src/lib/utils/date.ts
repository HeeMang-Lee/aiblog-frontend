import { format, isValid, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';

/**
 * Notion returns either a date ("2026-07-31") or a timestamp, and a row whose
 * date property was never filled in falls back to created_time. Anything
 * unparseable renders as an empty string rather than crashing the page.
 */
export function formatDate(dateString: string): string {
  const parsed = parseISO(dateString);
  if (!isValid(parsed)) return '';
  return format(parsed, 'yyyy년 M월 d일', { locale: ko });
}

export function toISODate(dateString: string): string {
  const parsed = parseISO(dateString);
  if (!isValid(parsed)) return '';
  return format(parsed, 'yyyy-MM-dd');
}
