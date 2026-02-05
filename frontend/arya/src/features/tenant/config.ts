export const tenantConfig = {
  name: 'کانون آریا',
  slug: 'arya',
  theme: {
    primary: '#165DFF',
    accent: '#36CFC9',
    muted: '#F3F4F6',
    text: '#1F2937',
  },
  assets: {
    logo: '/src/assets/images/arya-logo.svg',
    hero: '/src/assets/images/hero-arya.svg',
    posters: ['/src/assets/images/poster-1.svg', '/src/assets/images/poster-2.svg'],
  },
  contact: {
    phone: '021-00000000',
    email: 'info@arya-kanoon.ir',
    instagram: '@arya.kanoon',
  },
} as const;
