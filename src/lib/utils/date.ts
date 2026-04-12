import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';

export function formatDate(dateString: string): string {
  return format(parseISO(dateString), 'yyyy년 M월 d일', { locale: ko });
}

export function formatDateTime(dateString: string): string {
  return format(parseISO(dateString), 'yyyy년 M월 d일 HH:mm', { locale: ko });
}
