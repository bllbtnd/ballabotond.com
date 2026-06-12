// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import AstroPWA from '@vite-pwa/astro';

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
          it: 'it-IT'
        }
      },
      filter: (page) => !page.includes('/404'),
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date()
    }),
    AstroPWA({
      registerType: 'autoUpdate',
      manifest: {
        name: "Balla Botond - Portfolio",
        short_name: "Balla Botond",
        description: "Personal website of Balla Botond - Software Engineer & Computer Science Student",
        theme_color: "#F4F1EA",
        background_color: "#F4F1EA",
        display: "standalone",
        orientation: "portrait-primary",
        scope: "/",
        start_url: "/",
        icons: [
          {
            src: "/favicon-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable any"
          },
          {
            src: "/favicon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable any"
          }
        ],
        categories: ["portfolio", "developer", "personal"]
      },
      workbox: {
        navigateFallback: '/404',
        globPatterns: ['**/*.{css,js,svg,png,ico,txt,webmanifest}'],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
        maximumFileSizeToCacheInBytes: 7000000
      },
      devOptions: {
        enabled: false
      }
    })
  ],
  i18n: {
    defaultLocale: "en",
    locales: ["en", "hu", "it"],
    routing: {
      prefixDefaultLocale: false
    }
  },
  server: {
    port: 4322,
    host: true
  },
  build: {
    inlineStylesheets: 'auto',
    assets: '_astro'
  },
  vite: {
    build: {
      cssCodeSplit: true,
      minify: 'esbuild'
    }
  }
});
