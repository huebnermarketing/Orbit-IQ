/**
 * Helper utility functions composable
 * Provides common utility functions used throughout the application
 */

/**
 * Get initials from a full name (first name and last name)
 * @param name - Full name string
 * @returns Two-letter initials string
 */
export const getInitials = (name: string): string => {
  if (!name) return 'U'
  
  const words = name.trim().split(/\s+/).filter(w => w.length > 0)
  if (words.length === 0) return 'U'
  
  if (words.length === 1) {
    return words[0]!.substring(0, 2).toUpperCase()
  }
  
  const firstInitial = words[0]!.charAt(0).toUpperCase()
  const lastInitial = words[words.length - 1]!.charAt(0).toUpperCase()
  
  return firstInitial + lastInitial
}

/**
 * Get company initials from company name
 * @param companyName - Company name string
 * @returns Two-letter initials string
 */
export const getCompanyInitials = (companyName: string): string => {
  if (!companyName) return 'C'
  
  const words = companyName.trim().split(/\s+/).filter(w => w.length > 0)
  if (words.length === 0) return 'C'
  
  if (words.length === 1) {
    return words[0]!.substring(0, 2).toUpperCase()
  }
  
  const firstInitial = words[0]!.charAt(0).toUpperCase()
  const lastInitial = words[words.length - 1]!.charAt(0).toUpperCase()
  
  return firstInitial + lastInitial
}

/**
 * Format a date to a readable string
 */
export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

/**
 * Format a date to relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffInMs = now.getTime() - d.getTime()
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
  
  if (diffInMinutes < 1) return 'Just now'
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours}h ago`
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays === 1) return 'Yesterday'
  if (diffInDays < 7) return `${diffInDays}d ago`
  
  return formatDate(d)
}

/**
 * Get contrast color (white or black) based on background color
 * @param hexColor - Hex color code (e.g., "#3B82F6")
 * @returns "white" or "black" for optimal contrast
 */
export const getContrastColor = (hexColor: string): string => {
  // Remove # if present
  const hex = hexColor.replace('#', '')
  
  // Convert to RGB
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  
  // Return black for light backgrounds, white for dark backgrounds
  return luminance > 0.5 ? 'black' : 'white'
}

/**
 * Generate a random color
 * @returns Random hex color code
 */
export const getRandomColor = (): string => {
  const colors = [
    '#3B82F6', // blue
    '#10B981', // green
    '#F59E0B', // yellow
    '#EF4444', // red
    '#8B5CF6', // purple
    '#EC4899', // pink
    '#14B8A6', // teal
    '#F97316', // orange
  ]
  
  return colors[Math.floor(Math.random() * colors.length)]!
}