// Application Domain Types for Nuxt 4
// Note: Nuxt 4's auto-imports (ref, computed, $fetch, etc.) are handled by .nuxt/types after npm install

// ============================================================================
// Project types
// ============================================================================

export interface Project {
  id: number
  name: string
  project_number: string
  job_code?: string
  description?: string
  status?: string
  client_id?: number
  created_at: string
  updated_at: string
  due_date?: string
  budget?: string
  client?: Client
  subclient?: Subclient
  funding_source?: string
  hour_type?: string
  project_status?: ProjectStatus
  project_type?: ProjectType
  account_manager?: User
  project_manager?: User
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

export interface User {
  id: number
  name: string
  email: string
  avatar?: string
}

export interface Subclient {
  id: number
  name: string
}

export interface ProjectStatus {
  id: number
  name: string
  color: string
}

export interface ProjectType {
  id: number
  name: string
  color: string
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