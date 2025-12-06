// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import partytown from '@astrojs/partytown';
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
          it: 'it-IT',
          zh: 'zh-CN',
          ja: 'ja-JP'
        }
      }
    }),
    partytown({
      config: {
        forward: ["dataLayer.push"],
      },
    }),
    AstroPWA({
      registerType: 'autoUpdate',
      manifest: {
        name: "Balla Botond - Portfolio",
        short_name: "Balla Botond",
        description: "Personal website of Balla Botond - Software Developer & Computer Science Student",
        theme_color: "#c9a96b",
        background_color: "#111827",
        display: "standalone",
        orientation: "portrait-primary",
        scope: "/",
        start_url: "/",
        icons: [
          {
            src: "/favicon.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable any"
          },
          {
            src: "/favicon.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable any"
          }
        ],
        categories: ["portfolio", "developer", "personal"],
        shortcuts: [
          {
            name: "Projects",
            short_name: "Projects",
            description: "View my projects and work",
            url: "/projects"
          },
          {
            name: "Resume",
            short_name: "Resume",
            description: "View my professional resume",
            url: "/resume"
          }
        ]
      },
      workbox: {
        navigateFallback: '/404',
        globPatterns: ['**/*.{css,js,html,svg,png,ico,txt}'],
        maximumFileSizeToCacheInBytes: 7000000
      },
      devOptions: {
        enabled: true,
        navigateFallbackAllowlist: [/^\/404$/]
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
  },
  build: {
    inlineStylesheets: 'auto', // Inline small CSS automatically
    assets: '_astro' // Organize assets in _astro directory
  },
  vite: {
    build: {
      cssCodeSplit: true, // Split CSS per page for better caching
      minify: 'esbuild', // Fast minification
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            // Split large libraries into separate chunks
            if (id.includes('node_modules')) {
              return 'vendor';
            }
          }
        }
      }
    }
  }
});
