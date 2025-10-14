export interface User {
  id: number
  name: string
  email: string
  email_verified_at?: string
  mfa_enabled?: boolean
  mfa_secret?: string
  avatar?: string
  created_at: string
  updated_at: string
  organization?: Organization
  role?: string
}

export interface Organization {
  id: number
  name: string
  slug: string
  created_at: string
  updated_at: string
}