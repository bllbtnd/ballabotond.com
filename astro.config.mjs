// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  i18n: {
    defaultLocale: "en",
    locales: ["en", "hu", "it", "zh", "ja", "egy"],
    routing: {
      prefixDefaultLocale: false
    }
  },
  server: {
    port: 4322,
    host: true
  }
});
