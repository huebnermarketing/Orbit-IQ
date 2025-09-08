export interface User {
  id: number
  name: string
  email: string
  avatar?: string
  timezone: string
  theme_preference?: string
  email_verified_at?: string
  created_at: string
  updated_at: string
  role?: string
  is_active?: boolean
  mfa_enabled?: boolean
  organization_role_id?: number
  assigned_pm_id?: number
}

export interface AuthResponse {
  user: User
  token: string
  mfa_required?: boolean
  expires_at?: string
  remember?: boolean
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  password_confirmation: string
}
