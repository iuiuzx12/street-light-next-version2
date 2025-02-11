import { notFound } from "next/navigation";
import { getRequestConfig } from 'next-intl/server';

const locales: string[] = ['en', 'th'];

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as any)) notFound();

  return {
    messages: {
      ...(await import(`./locales/login/${locale}.json`)).default,
      ...(await import(`./locales/sidebar/${locale}.json`)).default,
      ...(await import(`./locales/control-group/${locale}.json`)).default,
      ...(await import(`./locales/control-individual/${locale}.json`)).default,
      ...(await import(`./locales/control-schedule/${locale}.json`)).default,
      ...(await import(`./locales/setting-alert/${locale}.json`)).default,
      ...(await import(`./locales/dashboard-period/${locale}.json`)).default,
      ...(await import(`./locales/dashboard-daily/${locale}.json`)).default,
      ...(await import(`./locales/map-total/${locale}.json`)).default,
      ...(await import(`./locales/map-disconnect/${locale}.json`)).default,
      ...(await import(`./locales/setting-personal/${locale}.json`)).default,
      ...(await import(`./locales/setting-menu/${locale}.json`)).default,
      ...(await import(`./locales/setting-alert/${locale}.json`)).default,
      ...(await import(`./locales/error/${locale}.json`)).default
      
    }
  };
});