// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://ballabotond.com',
  integrations: [
    tailwind(),
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en',
          hu: 'hu-HU',
          it: 'it-IT',
          zh: 'zh-CN',
          ja: 'ja-JP'
        }
      }
    })
  ],
  i18n: {
    defaultLocale: "en",
    locales: ["en", "hu", "it", "zh", "ja"],
    routing: {
      prefixDefaultLocale: false
    }
  },
  server: {
    port: 4322,
    host: true
  }
});
