import {getRequestConfig} from 'next-intl/server';
import {routing} from '@/i18n/routing';
 
export default getRequestConfig(async ({requestLocale}) => {
  // This typically corresponds to the `[locale]` segment.
  let locale = await requestLocale;
 
  // Ensure that a valid locale is used
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }
 
  return {
    locale,
    messages: {
        ...(await import(`../locales/login/${locale}.json`)).default,
        ...(await import(`../locales/sidebar/${locale}.json`)).default,
        ...(await import(`../locales/control-group/${locale}.json`)).default,
        ...(await import(`../locales/control-individual/${locale}.json`)).default,
        ...(await import(`../locales/control-schedule/${locale}.json`)).default,
        ...(await import(`../locales/setting-alert/${locale}.json`)).default,
        ...(await import(`../locales/dashboard-period/${locale}.json`)).default,
        ...(await import(`../locales/dashboard-daily/${locale}.json`)).default,
        ...(await import(`../locales/map-total/${locale}.json`)).default,
        ...(await import(`../locales/map-disconnect/${locale}.json`)).default,
        ...(await import(`../locales/setting-personal/${locale}.json`)).default,
        ...(await import(`../locales/setting-menu/${locale}.json`)).default,
        ...(await import(`../locales/setting-alert/${locale}.json`)).default,
        ...(await import(`../locales/error/${locale}.json`)).default
        
      }
  };
});