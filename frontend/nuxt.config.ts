// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  // CSR only mode (no SSR)
  ssr: false,

  // TypeScript configuration
  typescript: {
    strict: true,
    typeCheck: true,
    tsConfig: {
      compilerOptions: {
        skipLibCheck: true,
      },
      vueCompilerOptions: {
        skipTemplateCodegen: true,
      },
    },
  },

  // Modules
  modules: ['@pinia/nuxt'],

  // CSS configuration
  css: ['~/assets/css/main.css', '@fortawesome/fontawesome-free/css/all.css', 'quill/dist/quill.snow.css'],

  // App configuration
  app: {
    head: {
      title: 'Orbit IQ - Project Management System',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Orbit IQ Project Management System' },
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },
  },

  // Build configuration
  build: {
    transpile: [],
  },

  // Runtime configuration
  runtimeConfig: {
    public: {
      apiBase: process.env.VITE_API_URL || 'https://orbitapi.whitelabeliq.com/api',
      // appUrl: process.env.VITE_API_URL || 'https://orbitapi.whitelabeliq.com/api'
    },
  },

  plugins: [{ src: '~/plugins/api.ts' }, { src: '~/plugins/auth.ts' }],

  // PostCSS configuration for Tailwind 4
  postcss: {
    plugins: {
      '@tailwindcss/postcss': {},
      autoprefixer: {},
    },
  },

  // Dev server configuration
  devServer: {
    port: 3000,
    host: '0.0.0.0',
  },

  // Vite configuration
  vite: {
    server: {
      // Proxy is disabled - API calls will be made directly from the browser
      // to the URL specified in VITE_API_URL environment variable
    },
    build: {
      outDir: 'dist',
      sourcemap: true,
    },
  },

  // Auto-import configuration
  components: {
    dirs: [
      {
        path: '~/components',
        pathPrefix: false,
        extensions: ['.vue'],
      },
    ],
    loader: true,
  },

  // Experimental features
  experimental: {
    componentIslands: true,
  },
});
