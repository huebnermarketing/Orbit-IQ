export interface Organization {
  id: number;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
}
export interface User {
  id: number;
  name: string;
  email: string;

  // Common optional + nullable fields from Laravel API
  email_verified_at?: string | null;
  mfa_enabled?: boolean;
  mfa_secret?: string | null;
  avatar?: string | null;
  avatar_url?: string | null;

  role?: string;
  permissions?: string[];
  theme_preference?: 'light' | 'dark' | 'system';
  organization?: {
    id: number;
    name: string;
  } | null;

  created_at: string;
  updated_at: string;
}
/** Response returned after login/register actions */
export interface AuthResponse {
  token: string;
  expires_at?: string;
  remember?: boolean;
  user: User;
  message?: string;
}

/** Data sent to backend during registration */
export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role_id?: number;
  department_id?: number;
  organization_id?: number;
  invite_token?: string;
}
