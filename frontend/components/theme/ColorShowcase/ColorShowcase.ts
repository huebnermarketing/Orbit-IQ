import { defineComponent, ref, onMounted, onUnmounted } from 'vue'

export default defineComponent({
  name: 'ColorShowcase',
  setup() {
    const colorValues = ref<Record<string, string>>({})

    const getColorValue = (colorClass: string) => {
      return colorValues.value[colorClass] || '#000000'
    }

    const updateColorValues = () => {
      const root = document.documentElement
      const computedStyle = getComputedStyle(root)
      
      const brandColors = ['primary', 'secondary', 'accent']
      const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]
      
      brandColors.forEach(color => {
        shades.forEach(shade => {
          const cssVar = `--color-${color}-${shade}`
          const value = computedStyle.getPropertyValue(cssVar).trim()
          if (value) {
            colorValues.value[`${color}-${shade}`] = value
          } else {
            const fallbackColors: Record<string, string> = {
              'primary-500': '#0F7173',
              'secondary-500': '#4D6CFA',
              'accent-500': '#0B5563',
            }
            colorValues.value[`${color}-${shade}`] = fallbackColors[`${color}-500`] || '#000000'
          }
        })
      })
      
      const semanticColors = ['success', 'warning', 'error', 'info']
      const semanticColorMap: Record<string, string> = {
        'success': '#22c55e',
        'warning': '#f59e0b', 
        'error': '#ef4444',
        'info': '#3b82f6',
      }
      
      semanticColors.forEach(color => {
        shades.forEach(shade => {
          const baseColor = semanticColorMap[color]
          if (baseColor) {
            const value = shade === 500 ? baseColor : baseColor
            colorValues.value[`${color}-${shade}`] = value
          }
        })
      })
    }

    const handleThemeChange = () => {
      updateColorValues()
    }

    onMounted(() => {
      setTimeout(() => {
        updateColorValues()
      }, 100)
      window.addEventListener('theme-changed', handleThemeChange)
    })

    onUnmounted(() => {
      window.removeEventListener('theme-changed', handleThemeChange)
    })

    return {
      colorValues,
      getColorValue,
    }
  },
})