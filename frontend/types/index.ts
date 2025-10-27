// Application Domain Types for Nuxt 4
// Note: Nuxt 4's auto-imports (ref, computed, $fetch, etc.) are handled by .nuxt/types after npm install

// ============================================================================
// Project types
// ============================================================================

export interface Project {
  id: number
  name: string
  description?: string
  status?: string
  client_id?: number
  created_at: string
  updated_at: string
}

// ============================================================================
// Client types
// ============================================================================

export interface Client {
  id: number
  company_name: string
  email: string
  phone?: string
  website?: string
  address?: string
  primary_account_manager_id?: number
  secondary_account_manager_ids?: number[]
  secondary_account_managers?: Manager[]
  client_type?: string
  is_active: boolean
}

export interface Manager {
  id: number
  name: string
  email: string
}

// ============================================================================
// Status types
// ============================================================================

export interface Status {
  id: number
  name: string
  color: string
  category: string
  is_locked?: boolean
  sort_order?: number
}