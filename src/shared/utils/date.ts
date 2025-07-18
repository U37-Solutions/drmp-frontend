import { formatRelative, parseISO } from 'date-fns';
import { uk } from 'date-fns/locale';

const formatRelativeLocale = {
  lastWeek: 'eeee',
  yesterday: 'вчора',
  today: 'сьогодні',
  tomorrow: 'завтра',
  nextWeek: 'eeee',
  other: 'dd.MM.yyyy',
};

const localeWithoutTime = {
  ...uk,
  formatRelative: (token: string) => formatRelativeLocale[token as keyof typeof formatRelativeLocale],
};

export const getFormattedRelativeDateTime = (date: string): string => {
  return formatRelative(date, new Date(), { locale: uk });
};

export const getFormattedRelativeDate = (date: string): string => {
  return formatRelative(parseISO(date), new Date(), { locale: localeWithoutTime });
};

export const getFormattedTime = (date: string): string => {
  const parsedDate = parseISO(date);
  return parsedDate.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });
};
