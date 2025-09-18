/**
 * Get initials from a full name (first name and last name)
 * @param name - Full name string
 * @returns Two-letter initials string
 */
export const getInitials = (name: string): string => {
  if (!name) return 'U'
  
  const words = name.trim().split(/\s+/)
  if (words.length === 1) {
    // If only one word, take first two characters
    return words[0].substring(0, 2).toUpperCase()
  }
  
  // Take first character of first and last word
  const firstInitial = words[0].charAt(0).toUpperCase()
  const lastInitial = words[words.length - 1].charAt(0).toUpperCase()
  
  return firstInitial + lastInitial
}

/**
 * Get company initials from company name
 * @param companyName - Company name string
 * @returns Two-letter initials string
 */
export const getCompanyInitials = (companyName: string): string => {
  if (!companyName) return 'C'
  
  const words = companyName.trim().split(/\s+/)
  if (words.length === 1) {
    // If only one word, take first two characters
    return words[0].substring(0, 2).toUpperCase()
  }
  
  // Take first character of first and last word
  const firstInitial = words[0].charAt(0).toUpperCase()
  const lastInitial = words[words.length - 1].charAt(0).toUpperCase()
  
  return firstInitial + lastInitial
}

