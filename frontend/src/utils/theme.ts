/**
 * Theme Management Utility
 * 
 * This utility provides functions to manage themes and color schemes
 * for the Orbit IQ platform. It allows for dynamic theme switching
 * and provides type-safe theme configurations.
 */

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
    }
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
    }
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
    }
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
    }
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
    }
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
    }
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
    }
  }
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
  
  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
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
  
  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
}

// Theme management functions
export class ThemeManager {
  private currentTheme: string = 'default';
  private storageKey: string = 'orbit-iq-theme';

  constructor() {
    this.loadTheme();
  }

  /**
   * Get the current theme
   */
  getCurrentTheme(): string {
    return this.currentTheme;
  }

  /**
   * Get all available themes
   */
  getAvailableThemes(): ThemeConfig[] {
    return Object.values(themes);
  }

  /**
   * Apply a theme
   */
  applyTheme(themeName: string): void {
    const theme = themes[themeName];
    if (!theme) {
      console.warn(`Theme "${themeName}" not found`);
      return;
    }

    this.currentTheme = themeName;
    this.updateCSSVariables(theme);
    this.saveTheme();
    this.saveUserThemePreference(themeName);
    this.notifyThemeChange();
  }

  /**
   * Update CSS custom properties
   */
  private updateCSSVariables(theme: ThemeConfig): void {
    const root = document.documentElement;
    
    // Set data attribute for theme detection
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

  /**
   * Save theme to localStorage
   */
  private saveTheme(): void {
    try {
      localStorage.setItem(this.storageKey, this.currentTheme);
    } catch (error) {
      console.warn('Failed to save theme to localStorage:', error);
    }
  }

  /**
   * Load theme from localStorage
   */
  private loadTheme(): void {
    try {
      // First check if user is logged in and has a theme preference
      const userTheme = this.getUserThemePreference();
      if (userTheme && themes[userTheme]) {
        this.currentTheme = userTheme;
        this.applyTheme(userTheme);
        return;
      }

      // Fallback to localStorage theme
      const savedTheme = localStorage.getItem(this.storageKey);
      if (savedTheme && themes[savedTheme]) {
        this.currentTheme = savedTheme;
        this.applyTheme(savedTheme);
      } else {
        // If no saved theme, apply default theme
        this.currentTheme = 'default';
        this.applyTheme('default');
      }
    } catch (error) {
      console.warn('Failed to load theme:', error);
      // Fallback to default theme
      this.currentTheme = 'default';
      this.applyTheme('default');
    }
  }

  /**
   * Get user's theme preference from auth store
   */
  private getUserThemePreference(): string | null {
    try {
      // Try to get user from localStorage (auth store data)
      const authData = localStorage.getItem('auth-store');
      if (authData) {
        const parsed = JSON.parse(authData);
        return parsed?.user?.theme_preference || null;
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Save user's theme preference to backend
   */
  private async saveUserThemePreference(themeName: string): Promise<void> {
    try {
      // Check if user is logged in
      const token = localStorage.getItem('token');
      if (!token) {
        return; // User not logged in, skip backend save
      }

      // Import authApi dynamically to avoid circular dependencies
      const { authApi } = await import('@/utils/api');
      await authApi.updateThemePreference(themeName);
    } catch (error) {
      console.warn('Failed to save theme preference to backend:', error);
      // Don't throw error - theme should still be applied locally
    }
  }

  /**
   * Notify components of theme change
   */
  private notifyThemeChange(): void {
    // Dispatch custom event for components to listen to
    window.dispatchEvent(new CustomEvent('theme-changed', {
      detail: { theme: this.currentTheme }
    }));
  }

  /**
   * Reset to default theme
   */
  resetToDefault(): void {
    this.applyTheme('default');
  }


}

// Export singleton instance
export const themeManager = new ThemeManager();

// Vue composable for theme management
export function useTheme() {
  const currentTheme = ref(themeManager.getCurrentTheme());
  const availableThemes = ref(themeManager.getAvailableThemes());

  const applyTheme = (themeName: string) => {
    themeManager.applyTheme(themeName);
    currentTheme.value = themeName;
  };

  const resetTheme = () => {
    themeManager.resetToDefault();
    currentTheme.value = 'default';
  };

  // Listen for theme changes
  onMounted(() => {
    const handleThemeChange = (event: CustomEvent) => {
      currentTheme.value = event.detail.theme;
    };

    window.addEventListener('theme-changed', handleThemeChange as EventListener);
    
    onUnmounted(() => {
      window.removeEventListener('theme-changed', handleThemeChange as EventListener);
    });
  });

  return {
    currentTheme: readonly(currentTheme),
    availableThemes: readonly(availableThemes),
    applyTheme,
    resetTheme,
  };
}

// Import Vue composables
import { ref, readonly, onMounted, onUnmounted } from 'vue';
