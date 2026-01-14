export const NEWS_CATEGORIES = {
  competitors: 'Competitors',
  industry: 'Industry Trends',
  regulatory: 'Regulatory',
  technology: 'Technology',
} as const

export type NewsCategory = keyof typeof NEWS_CATEGORIES

export const COMPETITOR_QUERIES = [
  'Samsara',
  'Motive fleet',
  'Lytx',
  'Verizon Connect fleet',
  'Geotab',
  'Omnitracs',
]

export const INDUSTRY_QUERIES = [
  'fleet telematics',
  'dashcam fleet safety',
  'ELD compliance',
  'fleet management technology',
  'commercial vehicle telematics',
]

export const ALL_SEARCH_QUERIES = [...COMPETITOR_QUERIES, ...INDUSTRY_QUERIES]

export const NEWS_MAX_AGE_DAYS = 14
