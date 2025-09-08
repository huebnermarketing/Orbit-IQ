/**
 * Calculate the appropriate text color (black or white) based on background color
 * Uses WCAG relative luminance formula for proper contrast
 * @param hexColor - Hex color string (with or without #)
 * @returns Hex color string for text (#000000 for light backgrounds, #ffffff for dark backgrounds)
 */
export const getContrastColor = (hexColor: string): string => {
  // Remove # if present
  const hex = hexColor.replace('#', '')
  
  // Validate hex color format
  if (!/^[0-9A-Fa-f]{6}$/.test(hex)) {
    return '#000000' // Default to black for invalid colors
  }
  
  // Convert hex to RGB
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)
  
  // Calculate relative luminance using the WCAG formula
  // This gives a value between 0 (darkest) and 1 (lightest)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  
  // Return black for light colors (luminance > 0.5), white for dark colors
  return luminance > 0.5 ? '#000000' : '#ffffff'
}

/**
 * Validate if a hex color string is valid
 * @param hexColor - Hex color string
 * @returns boolean indicating if the color is valid
 */
export const isValidHexColor = (hexColor: string): boolean => {
  const hex = hexColor.replace('#', '')
  return /^[0-9A-Fa-f]{6}$/.test(hex)
}

/**
 * Convert RGB values to hex color string
 * @param r - Red value (0-255)
 * @param g - Green value (0-255)
 * @param b - Blue value (0-255)
 * @returns Hex color string with #
 */
export const rgbToHex = (r: number, g: number, b: number): string => {
  const toHex = (n: number) => {
    const hex = Math.round(n).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

/**
 * Get a random color for status badges
 * @returns Hex color string with #
 */
export const getRandomColor = (): string => {
  const colors = [
    '#3B82F6', // Blue
    '#10B981', // Emerald
    '#F59E0B', // Amber
    '#EF4444', // Red
    '#8B5CF6', // Purple
    '#EC4899', // Pink
    '#06B6D4', // Cyan
    '#84CC16', // Lime
    '#F97316', // Orange
    '#6366F1', // Indigo
    '#14B8A6', // Teal
    '#F43F5E', // Rose
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}
