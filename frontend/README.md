# Orbit-IQ Frontend

A modern web application built with Nuxt 4 and TypeScript, featuring a clean 3-file component architecture.

## Tech Stack

- **Framework**: [Nuxt 4](https://nuxt.com) (CSR mode)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **State Management**: Pinia
- **HTTP Client**: $fetch (built-in)

## Project Structure

```
frontend/
├── components/          # Vue components (3-file architecture)
│   ├── common/         # Reusable components
│   ├── layout/         # Layout components
│   ├── modals/         # Modal components
│   └── views/          # View components
├── composables/        # Composable functions
├── layouts/            # Layout templates
├── middleware/         # Route middleware
├── pages/              # File-based routing
├── plugins/            # Nuxt plugins
├── stores/             # Pinia state stores
├── types/              # TypeScript type definitions
├── app.vue             # Root component
└── nuxt.config.ts      # Nuxt configuration
```

## Component Architecture

This project uses a strict 3-file component structure:

```
ComponentName/
├── ComponentName.vue    # Template
├── ComponentName.ts     # Script logic
└── ComponentName.css    # Scoped styles
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn or pnpm

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`

### Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Generate Static Site

```bash
# Generate static site
npm run generate
```

## Environment Variables

Copy [`.env.example`](.env.example) to `.env` and configure your environment variables:

```bash
cp .env.example .env
```

## Features

- ✅ Client-side rendering (CSR)
- ✅ TypeScript strict mode
- ✅ TailwindCSS with custom configuration
- ✅ Auto-import components and composables
- ✅ File-based routing
- ✅ Pinia state management
- ✅ Authentication middleware
- ✅ Theme system support

## Development Guidelines

### Adding a New Component

1. Create a directory in [`components/`](components/)
2. Add three files: `.vue`, `.ts`, and `.css`
3. Import logic and styles in the `.vue` file:

```vue
<template>
  <!-- Your template -->
</template>

<script setup lang="ts" src="./ComponentName.ts"></script>
<style scoped src="./ComponentName.css"></style>
```

### Adding a New Page

Create a `.vue` file in [`pages/`](pages/). The file structure determines the route:

- [`pages/index.vue`](pages/index.vue) → `/`
- [`pages/dashboard.vue`](pages/dashboard.vue) → `/dashboard`
- [`pages/auth/login.vue`](pages/auth/login.vue) → `/auth/login`

### Styling

Use TailwindCSS utility classes. For custom styles, use `@apply` in component CSS files:

```css
.custom-class {
  @apply flex items-center justify-center;
}
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

[Add your license here]