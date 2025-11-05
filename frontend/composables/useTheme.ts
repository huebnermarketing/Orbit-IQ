/**
 * Theme Management Utility
 *
 * This utility provides functions to manage themes and color schemes
 * for the Orbit IQ platform. It allows for dynamic theme switching
 * and provides type-safe theme configurations.
 */
// import { useAuthStore } from '~/stores/auth'
//     const authStore = useAuthStore()

// Import Vue composables
// import { ref, readonly, onMounted, onUnmounted } from 'vue';

export interface ThemeConfig {
  name: string;
  displayName: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    'surface-alt': string;
    'text-primary': string;
    'text-secondary': string;
    'border-light': string;
    'border-medium': string;
    'border-dark': string;
  };
}

export interface ColorPalette {
  primary: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
  secondary: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
  accent: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
}

// Predefined themes
export const themes: Record<string, ThemeConfig> = {
  default: {
    name: 'default',
    displayName: 'Orbit IQ Default',
    colors: {
      primary: '#0F7173',
      secondary: '#4D6CFA',
      accent: '#0B5563',
      background: '#F7F0F0',
      surface: '#FFFFFF',
      'surface-alt': '#FBF7F4',
      'text-primary': '#050404',
      'text-secondary': '#230C0F',
      'border-light': '#e5e7eb',
      'border-medium': '#d1d5db',
      'border-dark': '#9ca3af',
    },
  },
  ocean: {
    name: 'ocean',
    displayName: 'Ocean Blue',
    colors: {
      primary: '#0ea5e9',
      secondary: '#3b82f6',
      accent: '#1e40af',
      background: '#f0f9ff',
      surface: '#ffffff',
      'surface-alt': '#f8fafc',
      'text-primary': '#0f172a',
      'text-secondary': '#334155',
      'border-light': '#e5e7eb',
      'border-medium': '#d1d5db',
      'border-dark': '#9ca3af',
    },
  },
  forest: {
    name: 'forest',
    displayName: 'Forest Green',
    colors: {
      primary: '#059669',
      secondary: '#10b981',
      accent: '#047857',
      background: '#f0fdf4',
      surface: '#ffffff',
      'surface-alt': '#f9fafb',
      'text-primary': '#064e3b',
      'text-secondary': '#065f46',
      'border-light': '#e5e7eb',
      'border-medium': '#d1d5db',
      'border-dark': '#9ca3af',
    },
  },
  sunset: {
    name: 'sunset',
    displayName: 'Sunset Orange',
    colors: {
      primary: '#ea580c',
      secondary: '#f97316',
      accent: '#c2410c',
      background: '#fff7ed',
      surface: '#ffffff',
      'surface-alt': '#fef3c7',
      'text-primary': '#9a3412',
      'text-secondary': '#c2410c',
      'border-light': '#e5e7eb',
      'border-medium': '#d1d5db',
      'border-dark': '#9ca3af',
    },
  },
  royal: {
    name: 'royal',
    displayName: 'Royal Purple',
    colors: {
      primary: '#7c3aed',
      secondary: '#8b5cf6',
      accent: '#6d28d9',
      background: '#faf5ff',
      surface: '#ffffff',
      'surface-alt': '#f3e8ff',
      'text-primary': '#581c87',
      'text-secondary': '#6b21a8',
      'border-light': '#e5e7eb',
      'border-medium': '#d1d5db',
      'border-dark': '#9ca3af',
    },
  },
  darkBlue: {
    name: 'darkBlue',
    displayName: 'Dark Blue',
    colors: {
      primary: '#121212',
      secondary: '#03dac6',
      accent: '#D3DAD9',
      background: '#f8fafc',
      surface: '#ffffff',
      'surface-alt': '#f1f5f9',
      'text-primary': '#0f172a',
      'text-secondary': '#334155',
      'border-light': '#e5e7eb',
      'border-medium': '#d1d5db',
      'border-dark': '#9ca3af',
    },
  },
  nightMode: {
    name: 'nightMode',
    displayName: 'Night Mode',
    colors: {
      primary: '#03dac6',
      secondary: '#bb86fc',
      accent: '#cf6679',
      background: '#121212',
      surface: '#1e1e1e',
      'surface-alt': '#2d2d2d',
      'text-primary': '#ffffff',
      'text-secondary': '#b3b3b3',
      'border-light': '#404040',
      'border-medium': '#606060',
      'border-dark': '#808080',
    },
  },
};

// Generate color palette from base color
export function generateColorPalette(baseColor: string): ColorPalette['primary'] {
  const colors = {
    50: lighten(baseColor, 0.9),
    100: lighten(baseColor, 0.8),
    200: lighten(baseColor, 0.6),
    300: lighten(baseColor, 0.4),
    400: lighten(baseColor, 0.2),
    500: baseColor,
    600: darken(baseColor, 0.1),
    700: darken(baseColor, 0.2),
    800: darken(baseColor, 0.3),
    900: darken(baseColor, 0.4),
  };

  return colors;
}

// Simple color manipulation functions
function lighten(color: string, amount: number): string {
  // Convert hex to RGB
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  // Lighten by mixing with white
  const newR = Math.round(r + (255 - r) * amount);
  const newG = Math.round(g + (255 - g) * amount);
  const newB = Math.round(b + (255 - b) * amount);

  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB
    .toString(16)
    .padStart(2, '0')}`;
}

function darken(color: string, amount: number): string {
  // Convert hex to RGB
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  // Darken by reducing RGB values
  const newR = Math.round(r * (1 - amount));
  const newG = Math.round(g * (1 - amount));
  const newB = Math.round(b * (1 - amount));

  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB
    .toString(16)
    .padStart(2, '0')}`;
}

// Theme management functions
const themeManager = (() => {
  let currentTheme = 'default';
  // const storageKey = 'orbit-iq-theme';

  function getCurrentTheme() {
    return currentTheme;
  }

  function getAvailableThemes() {
    return Object.values(themes);
  }

  function applyTheme(themeName: string) {
    const theme = themes[themeName];
    if (!theme) {
      console.warn(`Theme "${themeName}" not found`);
      return;
    }
    currentTheme = themeName;
    updateCSSVariables(theme);
    // saveTheme();
    notifyThemeChange();
  }

  function setTheme(themeName: string) {
    const theme = themes[themeName];
    if (!theme) {
      console.warn(`Theme "${themeName}" not found`);
      return;
    }
    currentTheme = themeName;
    updateCSSVariables(theme);
  }

  function updateCSSVariables(theme: ThemeConfig) {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme.name);

    // Update primary colors
    const primaryPalette = generateColorPalette(theme.colors.primary);
    Object.entries(primaryPalette).forEach(([shade, color]) => {
      root.style.setProperty(`--color-primary-${shade}`, color);
    });

    // Update secondary colors
    const secondaryPalette = generateColorPalette(theme.colors.secondary);
    Object.entries(secondaryPalette).forEach(([shade, color]) => {
      root.style.setProperty(`--color-secondary-${shade}`, color);
    });

    // Update accent colors
    const accentPalette = generateColorPalette(theme.colors.accent);
    Object.entries(accentPalette).forEach(([shade, color]) => {
      root.style.setProperty(`--color-accent-${shade}`, color);
    });

    // Update surface colors
    root.style.setProperty('--color-background', theme.colors.background);
    root.style.setProperty('--color-surface', theme.colors.surface);
    root.style.setProperty('--color-surface-alt', theme.colors['surface-alt']);

    // Update text colors
    root.style.setProperty('--color-text-primary', theme.colors['text-primary']);
    root.style.setProperty('--color-text-secondary', theme.colors['text-secondary']);

    // Update border colors
    root.style.setProperty('--color-border-light', theme.colors['border-light'] || '#e5e7eb');
    root.style.setProperty('--color-border-medium', theme.colors['border-medium'] || '#d1d5db');
    root.style.setProperty('--color-border-dark', theme.colors['border-dark'] || '#9ca3af');
  }

  // function saveTheme() {
  //   try {
  //     localStorage.setItem(storageKey, currentTheme);
  //   } catch (error) {
  //     console.warn('Failed to save theme to localStorage:', error);
  //   }
  // }

  // function loadTheme() {
  //   try {
  //     const savedTheme = localStorage.getItem(storageKey);
  //     if (savedTheme && themes[savedTheme]) {
  //       currentTheme = savedTheme;
  //       applyTheme(savedTheme);
  //     } else {
  //       currentTheme = 'default';
  //       applyTheme('default');
  //     }
  //   } catch (error) {
  //     console.warn('Failed to load theme:', error);
  //     currentTheme = 'default';
  //     applyTheme('default');
  //   }
  // }

  function notifyThemeChange() {
    window.dispatchEvent(
      new CustomEvent('theme-changed', {
        detail: { theme: currentTheme },
      })
    );
  }

  function resetToDefault() {
    applyTheme('default');
  }

  // loadTheme();

  return {
    getCurrentTheme,
    getAvailableThemes,
    applyTheme,
    setTheme,
    resetToDefault,
  };
})();

// Vue composable for theme management
export function useTheme() {
  const currentTheme = themeManager.getCurrentTheme();
  const availableThemes = themeManager.getAvailableThemes();

  const applyTheme = async (themeName: string) => {
    themeManager.applyTheme(themeName);

    // ✅ Nuxt composables like useNuxtApp() can safely be used here (inside setup)
    try {
      const { $authApi } = useNuxtApp();
      await $authApi.updateThemePreference(themeName);
    } catch (error) {
      console.warn('Failed to save theme preference to backend:', error);
    }
  };

  const setTheme = (themeName: string) => {
    themeManager.setTheme(themeName);
  };

  const resetTheme = () => {
    themeManager.resetToDefault();
  };

  return {
    currentTheme,
    availableThemes,
    applyTheme,
    resetTheme,
    setTheme,
  };
}
