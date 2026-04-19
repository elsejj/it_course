// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/ui',
    '@pinia/nuxt',
    '@nuxthub/core',
    '@nuxtjs/mdc',
    '@nuxt/icon'
  ],

  ssr: false,

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  routeRules: {
    '/': { prerender: true }
  },

  compatibilityDate: '2025-01-15',

  icon: {
    mode: 'css',
    cssLayer: 'base',
    provider: 'none',
    clientBundle: {
      scan: true,
    },
  },

  hub: {
    db: {
      dialect: 'sqlite',
      driver: 'd1',
      connection: {
        databaseId: 'f0ba0e79-d283-475b-9048-a424c7094137'
      }
    }
  },


  $development: {
    hub: {
      db: {
        'dialect': 'sqlite',
      }


    }

  }
})