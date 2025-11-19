# Orbit-IQ Frontend

A modern web application built with Nuxt 4 and TypeScript, featuring a clean 3-file component architecture and organized API structure.

## Tech Stack

- **Framework**: [Nuxt 4](https://nuxt.com) (CSR mode)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **State Management**: Pinia
- **HTTP Client**: $fetch (built-in)
- **UI Libraries**: Floating UI, Quill (Rich Text Editor), FontAwesome

## Project Structure

```
frontend/
├── components/          # Vue components (3-file architecture)
│   ├── common/         # Reusable components (BaseSelect, BaseMultiSelect, etc.)
│   ├── icons/          # Icon components
│   ├── layout/         # Layout components (AppLayout)
│   ├── modals/         # Modal components (ClientModal, UserModal, etc.)
│   ├── org-settings/   # Organization settings tab components
│   ├── theme/          # Theme-related components
│   ├── views/          # View components (Dashboard, ProjectsView, etc.)
│   └── ToastContainer/ # Toast notification component
├── composables/        # Composable functions
│   ├── api/           # API composables (file-based organization)
│   │   ├── authApi.ts
│   │   ├── clientApi.ts
│   │   ├── organizationApi.ts
│   │   ├── projectApi.ts
│   │   ├── taskApi.ts
│   │   ├── teamsApi.ts
│   │   └── userApi.ts
│   ├── useApiFetch.ts      # API fetch utility
│   ├── useFormValidation.ts # Form validation composable
│   ├── useHelpers.ts        # Helper functions (getInitials, formatDate, etc.)
│   ├── useTheme.ts          # Theme management
│   └── useToast.ts          # Toast notifications
├── layouts/            # Layout templates
├── middleware/         # Route middleware (auth, guest, root)
├── pages/              # File-based routing
│   ├── auth/          # Authentication pages
│   ├── projects/      # Project pages
│   └── ...            # Other pages
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
├── ComponentName.ts     # Script logic (using defineComponent)
└── ComponentName.css    # Scoped styles
```

### Component Example

```vue
<!-- ComponentName.vue -->
<template>
  <div>
    <!-- Your template -->
  </div>
</template>

<script lang="ts" src="./ComponentName.ts"></script>
<style scoped src="./ComponentName.css"></style>
```

```typescript
// ComponentName.ts
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'ComponentName',
  setup() {
    const data = ref('');

    return {
      data,
    };
  },
});
```

## API Structure

All API endpoints are organized in file-based composables under `composables/api/`:

- **authApi.ts** - Authentication and profile endpoints
- **clientApi.ts** - Client management endpoints
- **organizationApi.ts** - Organization profile and roles endpoints
- **projectApi.ts** - Project and project type endpoints
- **taskApi.ts** - Task-related endpoints
- **teamsApi.ts** - Team management endpoints
- **userApi.ts** - User management and user groups endpoints

### Usage Example

```typescript
import { clientApi } from '@/composables/api/clientApi';

// In your component
const loadClients = async () => {
  const response = await clientApi.getClients();
  clients.value = response.data || [];
};
```

## Helper Functions

Helper functions are centralized in `composables/useHelpers.ts`:

- `getInitials(name: string)` - Get initials from a name
- `getCompanyInitials(companyName: string)` - Get initials from company name
- `formatDate(date: Date | string)` - Format date to readable string
- `formatRelativeTime(date: Date | string)` - Format date to relative time
- `getContrastColor(hexColor: string)` - Get contrast color (white/black) for background
- `getRandomColor()` - Generate a random color

### Usage Example

```typescript
import { getInitials, formatDate } from '@/composables/useHelpers';

const initials = getInitials('John Doe'); // Returns "JD"
const formatted = formatDate(new Date()); // Returns formatted date string
```

## Organization Settings

The organization settings page (`/org-settings`) is organized into modular tab components:

- **CompanyProfileTab** - Company profile management
- **UserManagementTab** - User management with filtering and pagination
- **OrganizationRolesTab** - Organization roles management
- **TeamsTab** - Team management
- **UserGroupsTab** - User groups management
- **ClientManagementTab** - Client management with Excel export
- **ProjectStatusTab** - Project status management
- **TaskStatusTab** - Task status management
- **ProjectTypesTab** - Project types management
- **GlobalNotificationsTab** - Global notification settings

Each tab follows the 3-file component structure and is located in `components/org-settings/`.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm, yarn, or pnpm

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
- ✅ Modal system with Teleport
- ✅ Toast notifications
- ✅ Form validation composable
- ✅ Rich text editor (Quill)
- ✅ Excel export functionality
- ✅ Multi-select components
- ✅ Date picker component

## Development Guidelines

### Adding a New Component

1. Create a directory in `components/`
2. Add three files: `.vue`, `.ts`, and `.css`
3. Use `defineComponent` in the `.ts` file
4. Import logic and styles in the `.vue` file:

```vue
<template>
  <!-- Your template -->
</template>

<script lang="ts" src="./ComponentName.ts"></script>
<style scoped src="./ComponentName.css"></style>
```

### Adding a New API Endpoint

1. Identify the appropriate API file in `composables/api/`
2. Add the endpoint function using `useApiFetch`:

```typescript
// composables/api/exampleApi.ts
export const exampleApi = {
  getExamples: () => useApiFetch('/api/examples'),
  createExample: (data: any) => useApiFetch('/api/examples', { method: 'POST', body: data }),
  updateExample: (id: string, data: any) =>
    useApiFetch(`/api/examples/${id}`, { method: 'PUT', body: data }),
  deleteExample: (id: string) => useApiFetch(`/api/examples/${id}`, { method: 'DELETE' }),
};
```

### Adding a New Page

Create a `.vue` file in `pages/`. The file structure determines the route:

- `pages/index.vue` → `/`
- `pages/dashboard.vue` → `/dashboard`
- `pages/auth/login.vue` → `/auth/login`
- `pages/projects/[id].vue` → `/projects/:id` (dynamic route)

### Styling

Use TailwindCSS utility classes. For custom styles, use `@apply` in component CSS files:

```css
.custom-class {
  @apply flex items-center justify-center;
}
```

### Modal Components

Modals should use `Teleport` to render at the body level:

```vue
<template>
  <Teleport to="body">
    <div v-if="show" class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-panel">
        <!-- Modal content -->
      </div>
    </div>
  </Teleport>
</template>
```

## Key Conventions

1. **Component Structure**: Always use 3-file structure (`.vue`, `.ts`, `.css`)
2. **API Organization**: Keep API endpoints in file-based composables under `composables/api/`
3. **Helper Functions**: Use `composables/useHelpers.ts` for shared utilities
4. **Auto-imports**: Leverage Nuxt's auto-import for components and composables
5. **TypeScript**: Use strict typing throughout the codebase
6. **Naming**: Use PascalCase for components, camelCase for functions/variables

## Contributing

1. Create a feature branch
2. Follow the 3-file component structure
3. Organize API endpoints in appropriate composable files
4. Use TypeScript with proper typing
5. Test thoroughly
6. Submit a pull request

## License

[Add your license here]
