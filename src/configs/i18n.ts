export const i18n = {
  defaultLocale: 'vn',
  locales: ['vn', 'en'],
  langDirection: {
    vn: 'ltr',
    en: 'ltr'
  }
} as const

export type Locale = (typeof i18n)['locales'][number]
