import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'ThemeSelector',
  emits: ['theme-changed'],
  setup(_) {
    const { currentTheme, availableThemes, applyTheme, resetTheme } = useTheme();
    const getSelectedTheme = ref(currentTheme);
    const onApplyTheme = (themeName: string) => {
      applyTheme(themeName);
      getSelectedTheme.value = themeName;
    };
    const resetToDefault = () => {
      resetTheme();
      getSelectedTheme.value = 'default';
    };
    // const availableThemes = [
    //   {
    //     name: 'default',
    //     displayName: 'Default Theme',
    //     colors: {
    //       primary: '#0F7173',
    //       secondary: '#4D6CFA',
    //       accent: '#0B5563'
    //     }
    //   },
    //   {
    //     name: 'ocean',
    //     displayName: 'Ocean Blue',
    //     colors: {
    //       primary: '#0284c7',
    //       secondary: '#0891b2',
    //       accent: '#06b6d4'
    //     }
    //   },
    //   {
    //     name: 'forest',
    //     displayName: 'Forest Green',
    //     colors: {
    //       primary: '#059669',
    //       secondary: '#10b981',
    //       accent: '#34d399'
    //     }
    //   },
    //   {
    //     name: 'sunset',
    //     displayName: 'Sunset Orange',
    //     colors: {
    //       primary: '#ea580c',
    //       secondary: '#f59e0b',
    //       accent: '#fb923c'
    //     }
    //   },
    //   {
    //     name: 'purple',
    //     displayName: 'Royal Purple',
    //     colors: {
    //       primary: '#7c3aed',
    //       secondary: '#a855f7',
    //       accent: '#c084fc'
    //     }
    //   }
    // ]

    // const applyTheme = (themeName: string) => {
    //   currentTheme.value = themeName
    //   const theme = availableThemes.find(t => t.name === themeName)

    //   if (theme) {
    //     const root = document.documentElement
    //     root.style.setProperty('--color-primary-500', theme.colors.primary)
    //     root.style.setProperty('--color-secondary-500', theme.colors.secondary)
    //     root.style.setProperty('--color-accent-500', theme.colors.accent)

    //     emit('theme-changed', themeName)

    //     window.dispatchEvent(new CustomEvent('theme-changed'))
    //   }
    // }

    // const resetTheme = () => {
    //   applyTheme('default')
    // }

    return {
      getSelectedTheme,
      availableThemes,
      onApplyTheme,
      resetToDefault,
    };
  },
});
