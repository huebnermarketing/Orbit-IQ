import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '~/types/user'

export const useAuthStore = defineStore('auth', () => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase
  
  const user = ref<User | null>(null)
  const loading = ref(false)
  const initialized = ref(false)
  
  // Use Nuxt's useCookie instead of localStorage
  const tokenCookie = useCookie('token', {
    maxAge: 60 * 60 * 24 * 30, // 30 days
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
  })
  
  const expiresAtCookie = useCookie('token_expires_at')
  const rememberMeCookie = useCookie('remember_me')

  const isAuthenticated = computed(() => !!tokenCookie.value && !!user.value)

  const initialize = async () => {
    if (initialized.value) return
    
    const savedToken = tokenCookie.value
    const tokenExpiresAt = expiresAtCookie.value
    
    console.log('Initializing auth store, saved token:', savedToken ? 'exists' : 'none')
    
    // Check if token is expired
    if (savedToken && tokenExpiresAt) {
      const expirationDate = new Date(tokenExpiresAt)
      if (expirationDate <= new Date()) {
        console.log('Token has expired, clearing auth data')
        tokenCookie.value = null
        expiresAtCookie.value = null
        rememberMeCookie.value = null
        user.value = null
        initialized.value = true
        return
      }
    }
    
    if (savedToken) {
      try {
        // Fetch user profile to verify token is still valid
        const response = await $fetch(`${apiBase}/profile`, {
          headers: {
            Authorization: `Bearer ${savedToken}`
          }
        }) as { user: User }
        user.value = response.user
        console.log('Auth initialization successful, user:', response.user)
      } catch (error) {
        // Token is invalid, clear it
        console.error('Token validation failed:', error)
        tokenCookie.value = null
        expiresAtCookie.value = null
        rememberMeCookie.value = null
        user.value = null
      }
    }
    
    initialized.value = true
    console.log('Auth store initialized, isAuthenticated:', isAuthenticated.value)
  }

  const login = async (email: string, password: string, mfaCode?: string, remember?: boolean) => {
    loading.value = true
    try {
      const response = await $fetch(`${apiBase}/auth/login`, {
        method: 'POST',
        body: {
          email,
          password,
          mfa_code: mfaCode,
          remember
        }
      }) as {
        mfa_required?: boolean
        token?: string
        user?: User
        expires_at?: string
        remember?: boolean
      }
      
      console.log('Login response:', response)
      
      // If MFA is required, return the response without setting token
      if (response.mfa_required) {
        return response
      }
      
      tokenCookie.value = response.token
      user.value = response.user ?? null
      
      // Store token expiration info if provided
      if (response.expires_at) {
        expiresAtCookie.value = response.expires_at
      }
      if (response.remember !== undefined) {
        rememberMeCookie.value = response.remember.toString()
      }
      
      console.log('Login successful, token saved, user:', response.user, 'expires_at:', response.expires_at)
      return response
    } catch (error) {
      console.error('Login error:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const register = async (userData: {
    name: string
    email: string
    password: string
    password_confirmation: string
  }) => {
    loading.value = true
    try {
      const response = await $fetch(`${apiBase}/auth/register`, {
        method: 'POST',
        body: userData
      }) as {
        token: string
        user: User
      }
      
      tokenCookie.value = response.token
      user.value = response.user ?? null
      return response
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    try {
      if (tokenCookie.value) {
        await $fetch(`${apiBase}/auth/logout`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${tokenCookie.value}`
          }
        })
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      tokenCookie.value = null
      expiresAtCookie.value = null
      rememberMeCookie.value = null
      user.value = null
    }
  }

  const updateUser = (userData: User) => {
    user.value = userData
  }

  return {
    user,
    token: computed(() => tokenCookie.value),
    loading,
    initialized,
    isAuthenticated,
    initialize,
    login,
    register,
    logout,
    updateUser
  }
})